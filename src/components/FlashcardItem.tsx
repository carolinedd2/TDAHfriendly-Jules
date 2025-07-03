import React, { FC, useState } from 'react';

import { Flashcard } from '../types/types';

interface FlashcardItemProps {
  studyItemId: string;
  flashcard: Flashcard;
  onDelete: (studyItemId: string, flashcardId: string) => void;
}

const TrashIcon: FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3V3.25a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
      clipRule="evenodd"
    />
  </svg>
);

export const FlashcardItem: FC<FlashcardItemProps> = ({
  studyItemId,
  flashcard,
  onDelete,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsFlipped(!isFlipped);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir este flashcard?\n\nP: ${flashcard.question}`,
      )
    ) {
      onDelete(studyItemId, flashcard.id);
    }
  };

  return (
    <div className="flashcard-view-container group relative">
      <div
        className="flashcard-perspective-container select-none"
        onClick={handleToggleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsFlipped(!isFlipped);
            e.preventDefault();
          }
        }}
        aria-pressed={isFlipped}
        aria-label={`Flashcard: ${isFlipped ? 'Resposta' : 'Pergunta'}. Clique para ${isFlipped ? 'ver pergunta' : 'ver resposta'}.`}
      >
        <div
          className={`flashcard-content-flipper ${isFlipped ? 'is-flipped' : ''}`}
        >
          <div className="flashcard-front">
            <p className="flashcard-question-text">
              <strong>P:</strong> {flashcard.question}
            </p>
          </div>
          <div className="flashcard-back">
            <p className="flashcard-answer-text">
              <strong>R:</strong> {flashcard.answer}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-full 
          hover:bg-red-200 hover:text-red-700 opacity-0 group-hover:opacity-100 
          focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-300 
          transition-all duration-150"
        aria-label={`Excluir flashcard: ${flashcard.question}`}
        title="Excluir Flashcard"
      >
        <TrashIcon />
      </button>

      <div
        className="text-center text-xs text-gray-400 pt-2 mt-auto transition-colors 
          duration-200 group-hover:text-blue-500"
        aria-hidden="true"
      >
        Clique para {isFlipped ? 'ver pergunta' : 'ver resposta'}
      </div>
    </div>
  );
};
