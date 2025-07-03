import { FC } from 'react';

import { getValidatedTailwindColorClasses } from '../utils/getTailwindColorClasses';

interface TrailCardProps {
  trailId: string;
  displayName: string;
  icon: string;
  baseColor: string;
  progress: number;
  onSelect: (trailId: string) => void;
  subtitle: string;
}

export const TrailCard: FC<TrailCardProps> = ({
  trailId,
  displayName,
  icon,
  baseColor,
  progress,
  onSelect,
  subtitle,
}) => {
  const { bgColor, textColor, borderColor, bgSoft, ringColor } =
    getValidatedTailwindColorClasses(baseColor);

  return (
    <div
      className={`group relative flex flex-col rounded-xl overflow-hidden shadow-lg hover:shadow-2xl 
      transition-all duration-300 ease-in-out h-full border-2 ${borderColor} cursor-pointer 
      transform hover:-translate-y-1.5 active:scale-[0.98] focus:outline-none ${ringColor}`}
      onClick={() => onSelect(trailId)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(trailId);
        }
      }}
      aria-label={`Selecionar trilha: ${displayName}`}
    >
      <div className={`absolute top-0 left-0 w-full h-2 ${bgColor}`}></div>
      <div className={`p-6 flex flex-col flex-grow ${bgSoft}`}>
        <div className="flex items-center mb-4">
          <span className="text-4xl mr-4">{icon}</span>
          <div className="flex-1">
            <h4 className={`text-lg font-bold truncate ${textColor}`}>
              {displayName}
            </h4>
            <p className="text-xs text-gray-600 mt-1 truncate">{subtitle}</p>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex justify-between items-center text-sm text-gray-700 mb-1">
            <span>Progresso da Trilha</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`${bgColor} h-3 rounded-full transition-all duration-500 ease-out flex items-center justify-center`}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progresso da trilha ${displayName}: ${progress}%`}
            />
          </div>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 w-full h-1.5 ${bgColor} opacity-80 group-hover:opacity-100 transition-opacity`}
      />
    </div>
  );
};
