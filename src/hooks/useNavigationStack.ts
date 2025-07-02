// src/hooks/useNavigationStack.ts
import { useState, useCallback } from 'react';
import { StudyItem } from '../types/types';
import { TOPIC_META_DATA } from '../constants';

export default function useNavigationStack() {
  const [navigationStack, setNavigationStack] = useState<StudyItem[]>([]);
  const [loadedTopics, setLoadedTopics] = useState<Record<string, StudyItem>>({});
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);
  const [pendingInternalNavTarget, setPendingInternalNavTarget] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null); // novo estado

  const findItemByIdRecursive = useCallback((items: StudyItem[], id: string): StudyItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.subtopics) {
        const found = findItemByIdRecursive(item.subtopics, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const handleSelectTopic = useCallback(async (topicId: string, topicProgressMap?: Record<string, number>, updateSuggestedTopic?: (id: string) => void) => {
    setIsLoadingTopic(true);
    setLoadError(null);
    setPendingInternalNavTarget(null);

    if (loadedTopics[topicId]) {
      setNavigationStack([loadedTopics[topicId]]);
      setIsLoadingTopic(false);
      if (topicProgressMap?.[topicId] === 100 && updateSuggestedTopic) {
        updateSuggestedTopic(topicId);
      }
      return;
    }

    const topicMeta = TOPIC_META_DATA[topicId];
    if (topicMeta?.loader) {
      try {
        const fullTopicData = await topicMeta.loader();
        const fullTopicWithTrail: StudyItem = {
          ...fullTopicData,
          trail: topicMeta.trail,
          baseColor: topicMeta.baseColor, // aplica cor do meta, se necessário
        };
        setLoadedTopics(prev => ({ ...prev, [topicId]: fullTopicWithTrail }));
        setNavigationStack([fullTopicWithTrail]);
        if (topicProgressMap?.[topicId] === 100 && updateSuggestedTopic) {
          updateSuggestedTopic(topicId);
        }
      } catch (error) {
        console.error("Failed to load topic:", error);
        setNavigationStack([]);
        setLoadError("Não foi possível carregar este tópico. Tente novamente.");
      } finally {
        setIsLoadingTopic(false);
      }
    } else {
      console.error("No loader for topic:", topicId);
      setNavigationStack([]);
      setIsLoadingTopic(false);
      setLoadError("Este tópico não está disponível no momento.");
    }
  }, [loadedTopics]);

  const handleSelectSubtopic = useCallback((subtopicId: string) => {
    const currentTopic = navigationStack[0];
    if (!currentTopic) return;

    let foundSubtopic: StudyItem | null = null;
    const lastItemInStack = navigationStack[navigationStack.length - 1];
    if (lastItemInStack.subtopics) {
      foundSubtopic = findItemByIdRecursive(lastItemInStack.subtopics, subtopicId);
    }
    if (!foundSubtopic && currentTopic.subtopics) {
      foundSubtopic = findItemByIdRecursive(currentTopic.subtopics, subtopicId);
    }
    if (!foundSubtopic) return;

    setNavigationStack(prev => {
      const alreadyExists = prev.some(item => item.id === foundSubtopic!.id);
      if (alreadyExists) return prev;

      const currentLastStackItem = prev[prev.length - 1];
      if (currentLastStackItem.subtopics?.find(st => st.id === foundSubtopic!.id)) {
        return [...prev, foundSubtopic!];
      }

      const parentIdx = prev.findIndex(item => item.subtopics?.find(st => st.id === foundSubtopic!.id));
      if (parentIdx !== -1) {
        return [...prev.slice(0, parentIdx + 1), foundSubtopic!];
      }

      return [...prev, foundSubtopic!];
    });
  }, [navigationStack, findItemByIdRecursive]);

  const handleBreadcrumbNavigate = useCallback((index: number, topicProgressMap?: Record<string, number>, updateSuggestedTopic?: (id: string) => void) => {
    if (index === -1) {
      setNavigationStack([]);
    } else {
      setNavigationStack(prev => prev.slice(0, index + 1));
      const newRoot = navigationStack[0];
      if (index === 0 && newRoot && topicProgressMap?.[newRoot.id] === 100 && updateSuggestedTopic) {
        updateSuggestedTopic(newRoot.id);
      }
    }
  }, [navigationStack]);

  const buildNavigationStackForId = useCallback(async (targetId: string, rootTopicData: StudyItem) => {
    const parts = targetId.split('.');
    if (rootTopicData.id !== parts[0]) {
      await handleSelectTopic(parts[0]);
      setPendingInternalNavTarget(targetId);
      return;
    }

    if (parts.length === 1) {
      setNavigationStack([rootTopicData]);
      return;
    }

    const path: StudyItem[] = [rootTopicData];
    let currentLevelItems = rootTopicData.subtopics;

    for (let i = 1; i < parts.length; i++) {
      const currentPathId = parts.slice(0, i + 1).join('.');
      const foundItem = currentLevelItems?.find(item => item.id === currentPathId);
      if (foundItem) {
        path.push(foundItem);
        currentLevelItems = foundItem.subtopics;
      } else {
        break;
      }
    }
    setNavigationStack(path);
  }, [handleSelectTopic]);

  const handleNavigateToInternalLink = useCallback(async (targetId: string) => {
    const mainTopicId = targetId.split('.')[0];
    setLoadError(null);

    if (navigationStack.length > 0 && navigationStack[0].id === mainTopicId && loadedTopics[mainTopicId]) {
      buildNavigationStackForId(targetId, loadedTopics[mainTopicId]);
    } else {
      setNavigationStack([]);
      setIsLoadingTopic(true);
      setPendingInternalNavTarget(targetId);

      if (loadedTopics[mainTopicId]) {
        setIsLoadingTopic(false);
        setNavigationStack([loadedTopics[mainTopicId]]);
      } else {
        const topicMeta = TOPIC_META_DATA[mainTopicId];
        if (topicMeta?.loader) {
          try {
            const fullTopicData = await topicMeta.loader();
            const fullTopicWithTrail: StudyItem = {
              ...fullTopicData,
              trail: topicMeta.trail,
              baseColor: topicMeta.baseColor,
            };
            setLoadedTopics(prev => ({ ...prev, [mainTopicId]: fullTopicWithTrail }));
            setNavigationStack([fullTopicWithTrail]);
          } catch (error) {
            console.error("Load topic for internal link error:", error);
            setPendingInternalNavTarget(null);
            setLoadError("Não foi possível carregar o tópico do link interno.");
          } finally {
            setIsLoadingTopic(false);
          }
        } else {
          console.error("No loader for topic for internal link:", mainTopicId);
          setPendingInternalNavTarget(null);
          setIsLoadingTopic(false);
          setLoadError("Tópico indisponível.");
        }
      }
    }
  }, [navigationStack, loadedTopics, buildNavigationStackForId]);

  return {
    navigationStack,
    loadedTopics,
    isLoadingTopic,
    pendingInternalNavTarget,
    loadError,
    setPendingInternalNavTarget,
    setNavigationStack,
    handleSelectTopic,
    handleSelectSubtopic,
    handleBreadcrumbNavigate,
    handleNavigateToInternalLink,
    buildNavigationStackForId,
  };
}
