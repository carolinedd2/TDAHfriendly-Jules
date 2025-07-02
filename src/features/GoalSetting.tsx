/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, FC } from 'react';
import { GoalType } from '../types/types';

// Define colors for each goal type
const GOAL_TYPE_COLORS: Record<string, string> = {
  study_subtopics: '#6366f1', // Indigo-500
  complete_pomodoros: '#f59e42', // Orange-400
};

interface GoalSettingProps {
  onAddDailyGoal: (
    type: GoalType,
    targetValue: number,
    rewardPoints: number,
    baseColor: string // novo parâmetro
  ) => void;
}


const QuickGoalButton: FC<{ label: string, onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex-1 px-3 py-2.5 bg-indigo-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-indigo-600 active:bg-indigo-700 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
  >
    {label}
  </button>
);

export const GoalSetting: FC<GoalSettingProps> = ({ onAddDailyGoal }) => {
  const [subtopicGoal, setSubtopicGoal] = useState(3);
  const [pomodoroGoal, setPomodoroGoal] = useState(2);

  const handleAddSubtopicGoal = () => {
    if (subtopicGoal > 0) {
      const baseColor = GOAL_TYPE_COLORS['study_subtopics'];
      onAddDailyGoal('study_subtopics', subtopicGoal, subtopicGoal * 5, baseColor); // 5 pontos por subtópico
    }
  };

  const handleAddPomodoroGoal = () => {
    if (pomodoroGoal > 0) {
      const baseColor = GOAL_TYPE_COLORS['complete_pomodoros'];
      onAddDailyGoal('complete_pomodoros', pomodoroGoal, pomodoroGoal * 10, baseColor); // 10 pontos por Pomodoro
    }
  };

  return (
    <div className="mt-3 space-y-4">
      <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-3 sm:space-y-0">
        <label htmlFor="subtopic-goal-input" className="sr-only">Número de subtópicos para estudar</label>
        <input
          id="subtopic-goal-input"
          type="number"
          value={subtopicGoal}
          onChange={(e) => setSubtopicGoal(Math.max(1, parseInt(e.target.value, 10) || 1))}
          min="1"
          className="w-full sm:w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Número de subtópicos"
        />
        <QuickGoalButton 
          label={`Estudar ${subtopicGoal} Subtópico(s)`} 
          onClick={handleAddSubtopicGoal} 
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-3 sm:space-y-0">
        <label htmlFor="pomodoro-goal-input" className="sr-only">Número de Pomodoros para completar</label>
        <input
          id="pomodoro-goal-input"
          type="number"
          value={pomodoroGoal}
          onChange={(e) => setPomodoroGoal(Math.max(1, parseInt(e.target.value, 10) || 1))}
          min="1"
          className="w-full sm:w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Número de sessões Pomodoro"
        />
        <QuickGoalButton 
          label={`Completar ${pomodoroGoal} Pomodoro(s)`} 
          onClick={handleAddPomodoroGoal} 
        />
      </div>
    </div>
  );
};