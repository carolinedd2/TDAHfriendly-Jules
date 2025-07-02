import { useState, useEffect, useRef, FC, useCallback } from 'react';
import { StudyItemMeta } from '../types/types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicToReview: StudyItemMeta | null;
  onMarkAsReviewed: (topicId: string) => void;
}

const ReviewModal: FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  topicToReview,
  onMarkAsReviewed,
}) => {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const reviewBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && reviewBtnRef.current) {
      reviewBtnRef.current.focus();
    }
  }, [isOpen, topicToReview]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsAnimatingIn(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimatingIn(false);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimatingIn) return null;
  if (!topicToReview) return null;

  const handleReviewed = useCallback(() => {
    onMarkAsReviewed(topicToReview.id);
  }, [onMarkAsReviewed, topicToReview]);

  const baseColor = topicToReview.baseColor ?? 'blue';

  return (
    <div
      className={`
        fixed inset-0 z-[60] flex items-center justify-center p-4
        bg-black transition-opacity duration-300 ease-out
        ${isOpen && isAnimatingIn ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}
      `}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      tabIndex={-1}
    >
      <div
        className={`
          bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh]
          flex flex-col transform transition-all duration-300 ease-out
          ${isOpen && isAnimatingIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        onClick={e => e.stopPropagation()}
        role="document"
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            id="review-modal-title"
            className="text-xl md:text-2xl font-semibold text-gray-800"
          >
            Revisão:{' '}
            <span className={`text-${baseColor}-600`}>
              {topicToReview.title.split('.').slice(1).join('.').trim() || topicToReview.title}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 active:text-gray-800 active:scale-90 transition-all duration-150 text-3xl"
            aria-label="Fechar modal de revisão"
            type="button"
          >
            &times;
          </button>
        </div>

        <div
          className={`prose prose-${baseColor} max-w-none text-gray-700 leading-relaxed mb-6 overflow-y-auto flex-grow p-4 bg-gray-50 rounded-lg border border-gray-200`}
        >
          <h3 className={`text-lg font-bold text-${baseColor}-700 !mt-0`}>
            Resumo do Tópico:
          </h3>
          <p>{topicToReview.resumo || 'Resumo não disponível.'}</p>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 active:bg-gray-400 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            type="button"
          >
            Cancelar
          </button>
          <button
            ref={reviewBtnRef}
            onClick={handleReviewed}
            className={`w-full sm:w-auto order-1 sm:order-2 flex-1 px-6 py-3 text-white font-semibold rounded-lg hover:brightness-110 active:brightness-90 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            style={{ backgroundColor: `var(--tw-prose-${baseColor})` }}
            type="button"
          >
            Marcar como Revisado (+5 pts)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

