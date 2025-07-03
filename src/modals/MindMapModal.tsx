// src/modals/MindMapModal.tsx
import React, { useEffect, useRef } from 'react';

import type { StudyItem } from '../types/types';

export interface MindMapModalProps {
  isOpen: boolean;
  item: StudyItem | null;
  onClose: () => void;
}

const MindMapModal: React.FC<MindMapModalProps> = ({
  isOpen,
  item,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Fechar com ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Foco automático no modal ao abrir
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen || !item) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mindmap-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 focus:outline-none"
        tabIndex={-1}
      >
        <header className="flex justify-between items-center mb-4">
          <h2 id="mindmap-modal-title" className="text-xl font-bold">
            Mapa Mental – {item.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </header>
        <div>
          <p>ID do tópico: {item.id}</p>
          {/* Renderização adicional do conteúdo do mapa mental */}
        </div>
      </div>
    </div>
  );
};

export default MindMapModal;
