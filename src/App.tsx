// src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { StudyItemMeta, StudyItem, UserFlashcardsData } from './types/types';

import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { TabSelector } from './components/TabSelector';
import Dashboard from './features/Dashboard';
import { StudyMode } from './features/StudyMode';
import { QuestionGenerationMode } from './features/QuestionGenerationMode';
import { MyFlashcardsMode } from './features/MyFlashcardsMode';
import ReviewModal from './modals/ReviewModal';
import MindMapModal from './modals/MindMapModal';
import FocusTabSwitchReminder from './features/FocusTabSwitchReminder';

import useTimer from './hooks/useTimer';
import useInactivityDetection from './hooks/useInactivityDetection';
import useReviewSchedule from './hooks/useReviewSchedule';
import useFlashcards from './hooks/useFlashcards';
import useQuiz from './hooks/useQuiz';
import useNavigationStack from './hooks/useNavigationStack';

import { TOPIC_META_DATA_ARRAY, TRAIL_DETAILS, TRAIL_ORDER } from './config/constants';

const tabs = [
  { id: 'dashboard-panel', label: '📊 Dashboard', ariaControls: 'dashboard-panel' },
  { id: 'study-panel',     label: '📚 Estudar',   ariaControls: 'study-panel' },
  { id: 'questions-panel', label: '❓ Questões',  ariaControls: 'questions-panel' },
  { id: 'my-flashcards-panel', label: '🃏 Meus Flashcards', ariaControls: 'my-flashcards-panel' },
];

const LOCAL_STORAGE_KEY = 'topicProgressMap';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard-panel');
  const [topicProgressMap, setTopicProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    setTopicProgressMap(saved ? JSON.parse(saved) : {});
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(topicProgressMap));
  }, [topicProgressMap]);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [topicToReview, setTopicToReview] = useState<StudyItemMeta | null>(null);
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

  const handleSelectTopic = useCallback(async (topicId: string) => {
    await navigation.handleSelectTopic(topicId);
    setTopicProgressMap(prev => ({
      ...prev,
      [topicId]: Math.min((prev[topicId] || 0) + 10, 100),
    }));
  }, [navigation]);

  const handleToggleComprehendedItem = useCallback((itemId: string) => {
    setTopicProgressMap(prev => ({
      ...prev,
      [itemId]: prev[itemId] === 100 ? 0 : 100,
    }));
  }, []);

  const handleOpenReviewModal = (topicId: string) => {
    const meta: StudyItemMeta | undefined = TOPIC_META_DATA_ARRAY.find((t: StudyItemMeta) => t.id === topicId);
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

  const score = 0, streak = 0; // placeholders

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
  console.log("🔍 TOPIC_META_DATA_ARRAY enviado pro Dashboard:", TOPIC_META_DATA_ARRAY);
  console.log("🔍 topicProgressMap:", topicProgressMap)
  console.log("🔍 reviewScheduleHook.reviewSchedule:", reviewScheduleHook.reviewSchedule);



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
  isFocusModeActive={timer.currentTimerMode === 'focus' && timer.isTimerRunning}
/>

      {activeTab === 'dashboard-panel' && (
        <Dashboard
  topicsMeta={TOPIC_META_DATA_ARRAY}
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
  item={mindMapItem}         // pode ser null até o handleOpen ser chamado
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
