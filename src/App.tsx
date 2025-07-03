// src/App.tsx
import React, { useCallback, useEffect, useState } from 'react';

import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { TabSelector } from './components/TabSelector';
import {
  TOPIC_META_DATA_ARRAY,
  TRAIL_DETAILS,
  TRAIL_ORDER,
} from './config/constants';
import Dashboard from './features/Dashboard';
import FocusTabSwitchReminder from './features/FocusTabSwitchReminder';
import { MyFlashcardsMode } from './features/MyFlashcardsMode';
import { QuestionGenerationMode } from './features/QuestionGenerationMode';
import { StudyMode } from './features/StudyMode';
import useFlashcards from './hooks/useFlashcards';
import useInactivityDetection from './hooks/useInactivityDetection';
import useNavigationStack from './hooks/useNavigationStack';
import useQuiz from './hooks/useQuiz';
import useReviewSchedule from './hooks/useReviewSchedule';
import useTimer from './hooks/useTimer';
import MindMapModal from './modals/MindMapModal';
import ReviewModal from './modals/ReviewModal';
import type {
  StudyItem,
  StudyItemMeta,
  UserFlashcardsData,
} from './types/types';

const tabs = [
  {
    id: 'dashboard-panel',
    label: '📊 Dashboard',
    ariaControls: 'dashboard-panel',
  },
  { id: 'study-panel', label: '📚 Estudar', ariaControls: 'study-panel' },
  {
    id: 'questions-panel',
    label: '❓ Questões',
    ariaControls: 'questions-panel',
  },
  {
    id: 'my-flashcards-panel',
    label: '🃏 Meus Flashcards',
    ariaControls: 'my-flashcards-panel',
  },
];

const LOCAL_STORAGE_KEY = 'topicProgressMap';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard-panel');
  const [topicProgressMap, setTopicProgressMap] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    setTopicProgressMap(saved ? JSON.parse(saved) : {});
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(topicProgressMap));
  }, [topicProgressMap]);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [topicToReview, setTopicToReview] = useState<StudyItemMeta | null>(
    null,
  );
  const [isMindMapModalOpen, setIsMindMapModalOpen] = useState(false);
  const [mindMapItem, setMindMapItem] = useState<StudyItem | null>(null);

  const timer = useTimer();
  const reviewScheduleHook = useReviewSchedule();
  const flashcards = useFlashcards();
  const quiz = useQuiz();
  const navigation = useNavigationStack();

  const [showTabSwitchReminder, setShowTabSwitchReminder] = useState(false);
  const [tabSwitchReminderMessage, setTabSwitchReminderMessage] = useState('');

  useInactivityDetection({
    isTimerRunning: timer.isTimerRunning,
    currentTimerMode: timer.currentTimerMode,
    autoPauseFocusTimer: timer.autoPauseFocusTimer,
    setShowTabSwitchReminder,
    setTabSwitchReminderMessage,
  });

  const handleSelectTopic = useCallback(
    async (topicId: string) => {

      setTopicToReview(null); // Clear any review context

      if (topicId.includes('.')) {
        // This is a subtopic ID
        await navigation.handleNavigateToInternalLink(topicId);
        // Ensure study tab is active if not already
        if (activeTab !== 'study-panel') {
          setActiveTab('study-panel');
        }
      } else {
        // This is a main topic ID
        await navigation.handleSelectTopic(topicId);
        setActiveTab('study-panel');
      }

      // Progress update (optional, consider if it applies to subtopics too)
      // For now, let's assume it does for simplicity.

      await navigation.handleSelectTopic(topicId);

      setTopicProgressMap(prev => ({
        ...prev,
        [topicId]: Math.min((prev[topicId] || 0) + 10, 100),
      }));
    },

    [navigation, setActiveTab, activeTab],
  );

  // Effect to handle pending internal navigation (e.g., after parent topic loads)
  useEffect(() => {
    if (
      navigation.pendingInternalNavTarget &&
      navigation.navigationStack.length > 0
    ) {
      const mainTopicOfTarget =
        navigation.pendingInternalNavTarget.split('.')[0];
      if (navigation.navigationStack[0].id === mainTopicOfTarget) {
        // Parent topic is loaded, now build stack to the actual subtopic
        navigation.buildNavigationStackForId(
          navigation.pendingInternalNavTarget,
          navigation.navigationStack[0],
        );
        navigation.setPendingInternalNavTarget(null); // Clear the pending target
      }
    }
  }, [
    navigation.pendingInternalNavTarget,
    navigation.navigationStack,
    navigation.buildNavigationStackForId,
    navigation.setPendingInternalNavTarget,
  ]);
    [navigation],
  );

  const handleToggleComprehendedItem = useCallback((itemId: string) => {
    setTopicProgressMap(prev => ({
      ...prev,
      [itemId]: prev[itemId] === 100 ? 0 : 100,
    }));
  }, []);

  const handleOpenReviewModal = (topicId: string) => {
    const meta: StudyItemMeta | undefined = TOPIC_META_DATA_ARRAY.find(
      (t: StudyItemMeta) => t.id === topicId,
    );
    if (meta) {
      setTopicToReview(meta);
      setIsReviewModalOpen(true);
    }
  };
  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setTopicToReview(null);
  };
  const handleMarkAsReviewed = (topicId: string) => {
    setTopicProgressMap(prev => ({ ...prev, [topicId]: 100 }));
    handleCloseReviewModal();
  };

  const handleOpenMindMapModal = (item: StudyItem) => {
    setMindMapItem(item);
    setIsMindMapModalOpen(true);
  };
  const handleCloseMindMapModal = () => {
    setIsMindMapModalOpen(false);
    setMindMapItem(null);
  };

  const score = 0,
    streak = 0; // placeholders

  // Placeholder goals object to prevent errors
  const goals = {
    activeGoals: [],
    addDailyGoal: () => {},
    clearGoal: () => {},
    updateGoalByType: () => {},
  };

  // Placeholder notification permission and request function
  const notificationPermission = 'default';
  const requestNotificationPermission = () => {};
  console.log(
    '🔍 TOPIC_META_DATA_ARRAY enviado pro Dashboard:',
    TOPIC_META_DATA_ARRAY,
  );
  console.log('🔍 topicProgressMap:', topicProgressMap);
  console.log(
    '🔍 reviewScheduleHook.reviewSchedule:',
    reviewScheduleHook.reviewSchedule,
  );

  return (
    <>
      <Header
        title="Estudos TDAH-Friendly"
        subtitle="Aplicação de Administração Financeira e Orçamentária"
      />

      <StatsBar
        timerMode={timer.currentTimerMode}
        timerSecondsRemaining={timer.timerSecondsRemaining}
        isTimerRunning={timer.isTimerRunning}
        onStartTimer={timer.startTimer}
        onPauseTimer={timer.pauseTimer}
        onResetTimer={timer.resetTimer}
        score={score}
        streak={streak}
      />

      <TabSelector
        tabs={tabs}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isFocusModeActive={
          timer.currentTimerMode === 'focus' && timer.isTimerRunning
        }
      />

      {activeTab === 'dashboard-panel' && (
        <Dashboard
          topicsMeta={TOPIC_META_DATA_ARRAY}
=======
          onSelectTopic={handleSelectTopic}
          topicProgressMap={topicProgressMap}
          activeGoals={goals.activeGoals}
          onAddDailyGoal={goals.addDailyGoal}
          onClearGoal={goals.clearGoal}
          updateGoalByType={goals.updateGoalByType}
          showInactivityReminder={showTabSwitchReminder}
          onDismissInactivityReminder={() => setShowTabSwitchReminder(false)}
          notificationPermission={notificationPermission}
          onRequestNotificationPermission={requestNotificationPermission}
          allTopicsMeta={TOPIC_META_DATA_ARRAY}
          reviewSchedule={reviewScheduleHook.reviewSchedule}
          onOpenReviewModal={handleOpenReviewModal}
        />
      )}

      {activeTab === 'study-panel' && reviewScheduleHook.currentItemMeta && (
        <StudyMode
          currentItem={reviewScheduleHook.currentItemMeta}
          onSelectTopic={handleSelectTopic}
          topicProgressMap={topicProgressMap}
          activeGoals={goals.activeGoals}
          onAddDailyGoal={goals.addDailyGoal}
          onClearGoal={goals.clearGoal}
          updateGoalByType={goals.updateGoalByType}
          showInactivityReminder={showTabSwitchReminder}
          onDismissInactivityReminder={() => setShowTabSwitchReminder(false)}
          notificationPermission={notificationPermission}
          onRequestNotificationPermission={requestNotificationPermission}
          allTopicsMeta={TOPIC_META_DATA_ARRAY}
          reviewSchedule={reviewScheduleHook.reviewSchedule}
          onOpenReviewModal={handleOpenReviewModal}
        />
      )}

      {/* StudyMode should render if study-panel is active and there's an item in navigationStack */}
      {activeTab === 'study-panel' &&
        navigation.navigationStack.length > 0 &&
        navigation.navigationStack[0] && (
          <StudyMode
            // currentItem should now come from the navigation stack
            // The navigationStack[0] is the root topic, which has StudyItemMeta structure.
            // However, StudyMode expects StudyItemMeta, and navigationStack[0] is StudyItem.
            // We need to ensure the correct type is passed.
            // The loader in constants.ts returns StudyItem, which includes StudyItemMeta as 'meta'.
            // Let's assume navigation.navigationStack[0] is the full StudyItem.
            // currentItem should be derived from the LAST item in the navigationStack
            // which represents the currently focused topic or subtopic.
            // The last item in navigationStack is a StudyItem. We need its meta.
            currentItem={
              TOPIC_META_DATA[
                navigation.navigationStack[
                  navigation.navigationStack.length - 1
                ].id
              ] ||
              navigation.navigationStack[navigation.navigationStack.length - 1]
                .meta
            }
            onSelectTopic={handleSelectTopic}
            topicProgressMap={topicProgressMap}
            onToggleComprehendedItem={handleToggleComprehendedItem}
            onOpenMindMapModal={handleOpenMindMapModal}
            timer={timer}
            quiz={quiz}
            flashcards={flashcards}
          />
        )}

      {activeTab === 'questions-panel' && (
        <QuestionGenerationMode
          trailOrder={TRAIL_ORDER}
          trailDetails={TRAIL_DETAILS}
          topicsMeta={TOPIC_META_DATA_ARRAY}
          loadTopicContentById={id => {
            const topic = TOPIC_META_DATA_ARRAY.find(t => t.id === id);
            if (topic) {
              return topic.loader();
            } else {
              return Promise.reject(new Error(`Topic with id ${id} not found`));
            }
          }}
        />
      )}

      {activeTab === 'my-flashcards-panel' && (
        <MyFlashcardsMode
          userFlashcards={flashcards.userFlashcards as UserFlashcardsData}
          allTopicsMeta={TOPIC_META_DATA_ARRAY}
          onDeleteFlashcard={flashcards.deleteFlashcard}
          onDeleteAllFlashcards={flashcards.deleteAllFlashcards}
        />
      )}

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        topicToReview={topicToReview}
        onMarkAsReviewed={handleMarkAsReviewed}
      />

      <MindMapModal
        isOpen={isMindMapModalOpen}
        item={mindMapItem} // pode ser null até o handleOpen ser chamado
        onClose={handleCloseMindMapModal}
      />

      <FocusTabSwitchReminder
        show={showTabSwitchReminder}
        message={tabSwitchReminderMessage}
      />
    </>
  );
};

export default App;
