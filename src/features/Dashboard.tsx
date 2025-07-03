import React from 'react';

import {
  Goal,
  GoalType,
  NotificationPermissionStatus,
  ReviewSchedule,
  StudyItemMeta,
} from '@/types/types';

interface DashboardProps {
  topicsMeta: StudyItemMeta[];
  onSelectTopic: (topicId: string) => void;
  topicProgressMap: Record<string, number>;
  activeGoals: Goal[];
  onAddDailyGoal: (
    type: GoalType,
    targetValue: number,
    rewardPoints: number,
  ) => void;
  onClearGoal: (goalId: string) => void;
  updateGoalByType: (type: GoalType, increment?: number) => void;
  showInactivityReminder: boolean;
  onDismissInactivityReminder: () => void;
  notificationPermission: NotificationPermissionStatus;
  onRequestNotificationPermission: () => void;
  allTopicsMeta: StudyItemMeta[];
  reviewSchedule: ReviewSchedule;
  onOpenReviewModal: (topicId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  topicsMeta,
  onSelectTopic,
  topicProgressMap,
  activeGoals,
  onAddDailyGoal,
  onClearGoal,
  showInactivityReminder,
  onDismissInactivityReminder,
  notificationPermission,
  onRequestNotificationPermission,
  reviewSchedule,
  onOpenReviewModal,
}) => {
  console.log('📚 Tópicos recebidos no Dashboard:', topicsMeta);
  return (
    <div className="dashboard-container">
      <section className="topics-section">
        <h2>Topics</h2>
        <ul>
          {topicsMeta.map(topic => (
            <li key={topic.id} onClick={() => onSelectTopic(topic.id)}>
              {topic.title} - Progress: {topicProgressMap[topic.id] || 0}%
            </li>
          ))}
        </ul>
      </section>

      <section className="goals-section">
        <h2>Active Goals</h2>
        <ul>
          {activeGoals.map(goal => (
            <li key={goal.id}>
              {goal.type} - Target: {goal.targetValue} - Reward:{' '}
              {goal.rewardPoints}
              <button onClick={() => onClearGoal(goal.id)}>Clear</button>
            </li>
          ))}
        </ul>
        <button onClick={() => onAddDailyGoal('study', 5, 10)}>
          Add Study Goal
        </button>
      </section>

      <section className="review-section">
        <h2>Review Schedule</h2>
        <ul>
          {Object.entries(reviewSchedule).map(([topicId, schedule]) => (
            <li key={topicId}>
              {topicId} - Next Review: {schedule.nextReviewDate}
              <button onClick={() => onOpenReviewModal(topicId)}>
                Open Review
              </button>
            </li>
          ))}
        </ul>
      </section>

      {showInactivityReminder && (
        <div className="inactivity-reminder">
          <p>
            You&apos;ve been inactive for a while. Time to get back on track!
          </p>
          <button onClick={onDismissInactivityReminder}>Dismiss</button>
        </div>
      )}

      <section className="notification-section">
        <h2>Notifications</h2>
        <p>Permission Status: {notificationPermission}</p>
        <button onClick={onRequestNotificationPermission}>
          Request Permission
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
