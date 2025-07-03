import React from 'react';

import { getValidatedTailwindColorClasses } from '@/utils/getTailwindColorClasses';

import { StudyItemMeta } from '../types/types';
import { formatDisplayTitle, getTrailOrderAndRootId } from '../utils/utils';

interface TopicCardProps {
  topicMeta: StudyItemMeta;
  onSelect: (topicId: string) => void;
  progress: number;
  currentTrailId: string | null;
  allTopicsMeta: StudyItemMeta[];
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topicMeta,
  onSelect,
  progress,
  currentTrailId,
  allTopicsMeta,
}) => {
  const { trailOrderNumberStr, isTrailRelative, actualRootGlobalId } =
    getTrailOrderAndRootId(topicMeta.id, currentTrailId, allTopicsMeta);

  const displayTitle = formatDisplayTitle(
    topicMeta.title,
    trailOrderNumberStr,
    isTrailRelative,
    actualRootGlobalId,
    topicMeta.id,
  );

  const baseColor = topicMeta.baseColor || 'gray';
  const { bgColor, borderColor, textColor, bgSoft, ringColor } =
    getValidatedTailwindColorClasses(baseColor);

  return (
    <div
      className={`group relative flex flex-col rounded-xl overflow-hidden shadow-lg 
      hover:shadow-xl transition-shadow duration-300 ease-in-out h-full border-2 
      ${borderColor} cursor-pointer transform hover:-translate-y-1 ${ringColor} focus:outline-none`}
      onClick={() => onSelect(topicMeta.id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(topicMeta.id);
        }
      }}
      aria-label={`Selecionar tópico: ${topicMeta.title}`}
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 ${bgColor}`} />
      <div className="p-5 flex flex-col flex-grow bg-white">
        <div className="flex items-start mb-3">
          {topicMeta.icon && (
            <span className="text-3xl mr-3 pt-1">{topicMeta.icon}</span>
          )}
          <div className="flex-1">
            <h4 className={`text-sm font-semibold truncate ${textColor}`}>
              {displayTitle}
            </h4>
            {topicMeta.subtitle && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {topicMeta.subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className={`w-full ${bgSoft} rounded-full h-2.5`}>
            <div
              className={`${bgColor} h-2.5 rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progresso do tópico ${topicMeta.title}: ${progress}%`}
            />
          </div>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 w-full h-1 ${bgColor} opacity-70 group-hover:opacity-100 transition-opacity`}
      />
    </div>
  );
};
