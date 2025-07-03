/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { FC } from 'react';

import { ORIGINAL_COLOR_TO_TAILWIND_MAP, TRAIL_DETAILS } from '../constants';
import { ReviewSchedule, StudyItemMeta } from '../types/types';

interface ReviewSectionProps {
  reviewSchedule: ReviewSchedule;
  onOpenReviewModal: (topicId: string) => void;
  allTopicsMeta: StudyItemMeta[];
}

export const ReviewSection: FC<ReviewSectionProps> = ({
  reviewSchedule,
  onOpenReviewModal,
  allTopicsMeta,
}) => {
  const topicsDueForReview = allTopicsMeta.filter(
    meta => reviewSchedule[meta.id]?.isDueForReview,
  );

  return (
    <section
      className="mb-10 p-6 bg-white rounded-2xl shadow-lg"
      aria-labelledby="review-section-title"
    >
      <h3
        id="review-section-title"
        className="text-xl font-semibold text-gray-800 mb-1"
      >
        Revisão Programada 🧠
      </h3>
      <p className="text-sm text-gray-500 mb-5">
        Tópicos que precisam da sua atenção para fixar o conhecimento.
      </p>

      {topicsDueForReview.length === 0 ? (
        <div className="text-center py-6 px-4 bg-green-50 rounded-lg border-2 border-dashed border-green-200">
          <svg
            className="mx-auto h-12 w-12 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h4 className="mt-2 text-md font-medium text-green-700">
            Tudo em Dia!
          </h4>
          <p className="mt-1 text-sm text-green-600">
            Nenhum tópico para revisar hoje. Bom trabalho!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topicsDueForReview.map(topicMeta => {
            const trailInfo = topicMeta.trail
              ? TRAIL_DETAILS[topicMeta.trail]
              : null;
            const topicColor = topicMeta.color
              ? ORIGINAL_COLOR_TO_TAILWIND_MAP[topicMeta.color]
              : 'bg-gray-500';
            const borderColor = topicColor.replace('bg-', 'border-');

            return (
              <div
                key={topicMeta.id}
                className={`p-4 rounded-lg border-l-4 ${borderColor} bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between`}
              >
                <div>
                  <h4 className="text-md font-medium text-gray-800">
                    {topicMeta.title}
                  </h4>
                  {trailInfo && (
                    <p className="text-xs text-gray-500">
                      Trilha: {trailInfo.displayName} {trailInfo.icon}
                    </p>
                  )}
                  {reviewSchedule[topicMeta.id] && (
                    <p className="text-xs text-red-600 font-semibold mt-0.5">
                      Revisão {reviewSchedule[topicMeta.id].reviewStage + 1} de{' '}
                      {reviewSchedule[topicMeta.id].reviewStage < 4
                        ? 5
                        : 'Final'}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onOpenReviewModal(topicMeta.id)}
                  className="px-3 py-1.5 bg-yellow-400 text-yellow-800 text-xs font-semibold rounded-md hover:bg-yellow-500 active:bg-yellow-600 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  aria-label={`Revisar tópico ${topicMeta.title}`}
                >
                  Revisar Agora
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
