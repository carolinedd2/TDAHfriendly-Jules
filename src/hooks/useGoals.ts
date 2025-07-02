import { useState, useEffect, useCallback } from 'react';
import { Goal, GoalType } from '../types/types';

const GOALS_STORAGE_KEY = 'dailyGoals';
const GOALS_HISTORY_STORAGE_KEY = 'goalsHistory';
const GOALS_SCORE_KEY = 'totalGoalsScore';

// 🎯 Paleta temática por tipo de meta
export const GOAL_TYPE_COLORS: Record<GoalType, string> = {
  review_content: '#4F8EF7',
  study_subtopics: '#AF52DE',
  practice_exercises: '#34C759',
  complete_pomodoros: '#FF9500',
  quiz_mode: '#FF2D55',
};

export default function useGoals() {
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  // 🧠 Carregamento inicial seguro
  useEffect(() => {
    try {
      const savedGoals = JSON.parse(localStorage.getItem(GOALS_STORAGE_KEY) || '[]');
      const savedHistory = JSON.parse(localStorage.getItem(GOALS_HISTORY_STORAGE_KEY) || '[]');
      const savedScore = parseInt(localStorage.getItem(GOALS_SCORE_KEY) || '0', 10);

      if (Array.isArray(savedGoals)) {
        setActiveGoals(savedGoals.map(goal => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
        })));
      }

      if (Array.isArray(savedHistory)) {
        setCompletedGoals(savedHistory.map(goal => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          completedAt: new Date(goal.completedAt),
        })));
      }

      setTotalScore(isNaN(savedScore) ? 0 : savedScore);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  }, []);

  // 💾 Persistência automática
  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(activeGoals));
  }, [activeGoals]);

  useEffect(() => {
    localStorage.setItem(GOALS_HISTORY_STORAGE_KEY, JSON.stringify(completedGoals));
  }, [completedGoals]);

  useEffect(() => {
    localStorage.setItem(GOALS_SCORE_KEY, totalScore.toString());
  }, [totalScore]);

  // ➕ Criação de meta diária
  const addDailyGoal = useCallback((
    type: GoalType,
    targetValue: number,
    rewardPoints: number,
    description = '',
    timeframe: 'daily' = 'daily'
  ) => {
    const baseColor = GOAL_TYPE_COLORS[type] ?? 'gray';

    const newGoal: Goal = {
      id: `${type}_${Date.now()}`,
      type,
      targetValue,
      currentValue: 0,
      rewardPoints,
      baseColor,
      createdAt: new Date(),
      description,
      timeframe,
      isCompleted: false,
    };

    setActiveGoals(prev => [...prev, newGoal]);
  }, []);

  const updateGoalProgress = useCallback((goalId: string, increment = 1) => {
    setActiveGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;

      const newCurrentValue = Math.min(goal.currentValue + increment, goal.targetValue);
      const isCompleted = newCurrentValue >= goal.targetValue;

      return {
        ...goal,
        currentValue: newCurrentValue,
        isCompleted,
        completedAt: isCompleted && !goal.completedAt ? new Date() : goal.completedAt,
      };
    }));
  }, []);

  const updateGoalByType = useCallback((type: GoalType, increment = 1) => {
    const goal = activeGoals.find(g => g.type === type && !g.isCompleted);
    if (goal) updateGoalProgress(goal.id, increment);
  }, [activeGoals, updateGoalProgress]);

  const removeGoal = useCallback((goalId: string) => {
    setActiveGoals(prev => prev.filter(goal => goal.id !== goalId));
  }, []);

  const completeGoal = useCallback((goalId: string) => {
    const goal = activeGoals.find(goal => goal.id === goalId && goal.isCompleted);
    if (!goal) return;

    const completedGoal = {
      ...goal,
      completedAt: new Date(),
    };

    setCompletedGoals(prev => [...prev, completedGoal]);
    setActiveGoals(prev => prev.filter(goal => goal.id !== goalId));
    setTotalScore(prev => prev + goal.rewardPoints);
  }, [activeGoals]);

  const clearOldGoals = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setActiveGoals(prev =>
      prev.filter(goal => {
        const goalDate = new Date(goal.createdAt);
        goalDate.setHours(0, 0, 0, 0);
        return goalDate.getTime() === today.getTime();
      })
    );
  }, []);

  // 📊 Estatísticas úteis
  const getGoalStats = useCallback(() => {
    const completedToday = activeGoals.filter(goal => goal.isCompleted).length;
    const totalToday = activeGoals.length;
    const completionRate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

    const pointsEarnedToday = activeGoals
      .filter(goal => goal.isCompleted)
      .reduce((sum, goal) => sum + goal.rewardPoints, 0);

    const totalPoints = completedGoals.reduce((sum, goal) => sum + goal.rewardPoints, 0);

    return {
      completedToday,
      totalToday,
      completionRate,
      pointsEarnedToday,
      totalPoints,
    };
  }, [activeGoals, completedGoals]);

  return {
    activeGoals,
    completedGoals,
    totalScore,
    addDailyGoal,
    updateGoalProgress,
    updateGoalByType,
    removeGoal,
    completeGoal,
    clearOldGoals,
    getGoalStats,
  };
}