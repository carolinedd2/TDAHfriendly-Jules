import { useState, useEffect, useCallback } from 'react';
import { getTodayDateString, addDaysToDateString } from '../utils/helpers';
import type { StudyItemMeta } from '../types/types';
import { TOPIC_META_DATA_ARRAY } from '../constants';

export interface ReviewItem {
  topicId: string;
  firstStudiedDate: string;
  lastReviewDate: string;
  nextReviewDate: string;
  reviewStage: number;
  isDueForReview: boolean;
}

export type ReviewSchedule = Record<string, ReviewItem>;

const REVIEW_INTERVALS_DAYS = [1, 3, 7, 15, 30];
const MAX_REVIEW_STAGES = REVIEW_INTERVALS_DAYS.length;
const STORAGE_KEY = 'reviewSchedule';

export default function useReviewSchedule() {
  const [reviewSchedule, setReviewSchedule] = useState<ReviewSchedule>({});
  const [currentItemMeta, setCurrentItemMeta] = useState<StudyItemMeta | null>(null);

  // Carrega e valida agenda do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) {
          setReviewSchedule(parsed);
        }
      } catch (error) {
        console.error('Erro ao carregar agenda de revisão:', error);
      }
    }
  }, []);

  // Persiste sempre que a agenda muda
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewSchedule));
    } catch (error) {
      console.error('Erro ao salvar a agenda de revisão:', error);
    }
  }, [reviewSchedule]);

  // Atualiza sinalizadores de revisão pendente
  const updateReviewMarkers = useCallback(() => {
    const today = new Date(getTodayDateString());
    setReviewSchedule(prev => {
      let changed = false;
      const next: ReviewSchedule = { ...prev };
      for (const topicId in next) {
        const item = next[topicId];
        const due =
          new Date(item.nextReviewDate) <= today &&
          item.reviewStage < MAX_REVIEW_STAGES;
        if (item.isDueForReview !== due) {
          next[topicId] = { ...item, isDueForReview: due };
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  // Inicializa revisão para um novo tópico
  const initializeReviewForTopic = useCallback((topicId: string) => {
    setReviewSchedule(prev => {
      if (prev[topicId]) return prev;
      const today = getTodayDateString();
      const firstNext = addDaysToDateString(today, REVIEW_INTERVALS_DAYS[0]);
      return {
        ...prev,
        [topicId]: {
          topicId,
          firstStudiedDate: today,
          lastReviewDate: today,
          nextReviewDate: firstNext,
          reviewStage: 0,
          isDueForReview: false,
        },
      };
    });
    updateReviewMarkers();
  }, [updateReviewMarkers]);

  // Marca tópico como revisado e avança estágio
  const markAsReviewed = useCallback((topicId: string) => {
    setReviewSchedule(prev => {
      const item = prev[topicId];
      if (!item) return prev;

      const nextStage = Math.min(item.reviewStage + 1, MAX_REVIEW_STAGES - 1);
      const today = getTodayDateString();
      const nextDate = addDaysToDateString(today, REVIEW_INTERVALS_DAYS[nextStage] || 3650);

      return {
        ...prev,
        [topicId]: {
          ...item,
          lastReviewDate: today,
          nextReviewDate: nextDate,
          reviewStage: nextStage,
          isDueForReview: false,
        },
      };
    });
    updateReviewMarkers();
  }, [updateReviewMarkers]);

  // Define o próximo item a revisar
  useEffect(() => {
    const dueIds = Object.values(reviewSchedule)
      .filter(item => item.isDueForReview)
      .map(item => item.topicId);

    if (dueIds.length > 0) {
      const nextMeta: StudyItemMeta | null = TOPIC_META_DATA_ARRAY.find((m: StudyItemMeta) => m.id === dueIds[0]) || null;
      setCurrentItemMeta(nextMeta);
    } else {
      setCurrentItemMeta(null);
    }
  }, [reviewSchedule]);

  // Estatísticas úteis para UI
  const getReviewStats = useCallback(() => {
    const totalTopics = Object.keys(reviewSchedule).length;
    const dueTopics = Object.values(reviewSchedule).filter(item => item.isDueForReview).length;
    const completedStages = Object.values(reviewSchedule).reduce((sum, item) => sum + item.reviewStage, 0);

    return {
      totalTopics,
      dueTopics,
      completedStages,
    };
  }, [reviewSchedule]);

  return {
    reviewSchedule,
    initializeReviewForTopic,
    markAsReviewed,
    updateReviewMarkers,
    currentItemMeta,
    getReviewStats,
  };
}

export type ReturnTypeUseReviewSchedule = ReturnType<typeof useReviewSchedule>;

