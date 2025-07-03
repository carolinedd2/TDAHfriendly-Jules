import { FC } from 'react';

import { GoalType } from '@/types/types';
import { getValidatedTailwindColorClasses } from '@/utils/getTailwindColorClasses';
export interface Goal {
  id: string;
  type: GoalType;
  description: string;
  targetValue: number;
  currentValue: number;
  timeframe: 'daily';
  createdAtDate: string;
  isCompleted: boolean;
  completedAt?: number;
  rewardPoints: number;
  baseColor: string; // Ex: 'green', 'blue', 'rose' — usado com Tailwind
}
interface DailyGoalDisplayProps {
  goals: Goal[];
  onClearGoal: (goalId: string) => void;
}

const CheckCircleIcon: FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.86-9.81a.75.75 0 00-1.22-.88l-3.48 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.14-.09l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

const TrashIcon: FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.82 8.15A1.5 1.5 0 005.36 15h5.29a1.5 1.5 0 001.49-1.35l.82-8.15h.3a.75.75 0 000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25 2.25 0 005 3.25zM7.25 2.5a.75.75 0 00-.75.75V4h3V3.25a.75.75 0 00-.75-.75h-1.5zM6.05 6a.75.75 0 01.79.71l.27 5.5a.75.75 0 01-1.5.08l-.27-5.5A.75.75 0 016.05 6zm3.9 0a.75.75 0 01.71.79l-.27 5.5a.75.75 0 01-1.5-.08l.27-5.5a.75.75 0 01.79-.71z"
      clipRule="evenodd"
    />
  </svg>
);

export const DailyGoalDisplay: FC<DailyGoalDisplayProps> = ({
  goals,
  onClearGoal,
}) => {
  if (goals.length === 0) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          Nenhuma meta rápida definida para hoje. Que tal adicionar uma?
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3" role="list" aria-label="Metas diárias">
      {goals.map(goal => {
        const { bgColor, textColor, bgSoft, borderColor } =
          getValidatedTailwindColorClasses(goal.baseColor);

        return (
          <div
            key={goal.id}
            role="listitem"
            className={`p-3 md:p-4 rounded-lg shadow-sm flex items-start justify-between transition-all duration-300 border 
              ${goal.isCompleted ? `${bgSoft} ${borderColor}` : 'bg-white border-gray-200'} 
              hover:shadow-md`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-start">
                {goal.isCompleted && (
                  <CheckCircleIcon
                    className={`w-5 h-5 ${textColor} mr-2 flex-shrink-0 mt-0.5`}
                  />
                )}
                <span
                  className={`text-sm font-medium break-words ${
                    goal.isCompleted
                      ? `${textColor} line-through`
                      : 'text-gray-700'
                  }`}
                  title={goal.description}
                >
                  {goal.description}
                </span>
              </div>

              {!goal.isCompleted && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${bgColor} h-2 rounded-full transition-all duration-500 ease-out`}
                      style={{
                        width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%`,
                      }}
                      role="progressbar"
                      aria-valuenow={goal.currentValue}
                      aria-valuemin={0}
                      aria-valuemax={goal.targetValue}
                      aria-label={`Progresso da meta: ${goal.currentValue} de ${goal.targetValue}`}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${textColor}`}>
                      {goal.currentValue}/{goal.targetValue}
                    </span>
                    {goal.rewardPoints > 0 && (
                      <span className="text-xs text-gray-500">
                        +{goal.rewardPoints} pts
                      </span>
                    )}
                  </div>
                </div>
              )}

              {goal.isCompleted && (
                <div className="mt-1">
                  <span className={`text-xs font-medium ${textColor}`}>
                    ✅ Concluído! +{goal.rewardPoints} pontos!
                  </span>
                </div>
              )}
            </div>

            {!goal.isCompleted && (
              <button
                onClick={() => onClearGoal(goal.id)}
                className="ml-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors duration-150 flex-shrink-0"
                aria-label={`Remover meta: ${goal.description}`}
                title="Remover meta"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
