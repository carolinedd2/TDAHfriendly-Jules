/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { FC } from 'react';
import { StudyItem, StudyItemMeta } from '../types/types';
import { getTrailOrderAndRootId, formatDisplayTitle } from '../utils/utils';

interface BreadcrumbsProps {
  stack: StudyItem[];
  onNavigate: (index: number) => void;
  currentStudyTrailId: string | null;
  allTopicsMeta: StudyItemMeta[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  stack,
  onNavigate,
  currentStudyTrailId,
  allTopicsMeta,
}) => {
  if (stack.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
      <ol className="flex flex-wrap items-center gap-x-3">
        <li>
          <button
            onClick={() => onNavigate(-1)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 active:text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md px-1.5 py-0.5 transition-all"
          >
            Início
          </button>
        </li>

        {stack.map((item, index) => {
          const { trailOrderNumberStr, isTrailRelative, actualRootGlobalId } = getTrailOrderAndRootId(
            item.id,
            currentStudyTrailId,
            allTopicsMeta
          );

          const displayItemTitle = formatDisplayTitle(
            item.title,
            trailOrderNumberStr,
            isTrailRelative,
            actualRootGlobalId,
            item.id
          );

          const firstSpace = displayItemTitle.indexOf(' ');
          const label =
            index < stack.length - 1 && firstSpace !== -1
              ? displayItemTitle.substring(0, firstSpace)
              : displayItemTitle;

          return (
            <li key={item.id} className="flex items-center gap-x-3">
              <span className="text-gray-400">→</span>
              {index === stack.length - 1 ? (
                <span className="font-semibold text-gray-700 truncate max-w-xs block" aria-current="page">
                  {displayItemTitle}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(index)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md px-1.5 py-0.5 transition-colors truncate max-w-xs"
                >
                  {label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
