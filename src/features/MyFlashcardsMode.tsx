// src/features/MyFlashcardsMode.tsx
import { useState, FC } from 'react';
import { UserFlashcardsData, StudyItemMeta, Flashcard } from '../types/types';
import { getValidatedTailwindColorClasses } from '../utils/getTailwindColorClasses'; // Certifique-se de importar essa função

interface MyFlashcardsModeProps {
  userFlashcards: UserFlashcardsData;
  allTopicsMeta: StudyItemMeta[];
  onDeleteFlashcard: (studyItemId: string, flashcardId: string) => void;
  onDeleteAllFlashcards: (studyItemId: string) => void;
}

export const MyFlashcardsMode: FC<MyFlashcardsModeProps> = ({
  userFlashcards,
  allTopicsMeta,
  onDeleteFlashcard,
  onDeleteAllFlashcards,
}) => {
  const [selectedStudyItemId, setSelectedStudyItemId] = useState<string | null>(null);

  const topicsWithFlashcards = Object.keys(userFlashcards).filter(
    id => (userFlashcards[id] || []).length > 0
  );

  if (topicsWithFlashcards.length === 0) {
    return <p className="text-gray-500 mt-8 text-center">📭 Você ainda não gerou nenhum flashcard.</p>;
  }

  return (
    <div className="flex divide-x">
      {/* Sidebar de Tópicos */}
      <ul className="w-1/4 pr-4 space-y-2">
        {topicsWithFlashcards.map(topicId => {
          const meta = allTopicsMeta.find(m => m.id === topicId);
          const isSelected = selectedStudyItemId === topicId;

          return (
            <li key={topicId} className="flex flex-col items-start">
              <button
                onClick={() => setSelectedStudyItemId(topicId)}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  isSelected ? 'bg-indigo-100 font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                {meta?.title || topicId}
              </button>
              <button
                onClick={() => onDeleteAllFlashcards(topicId)}
                className="ml-2 text-xs text-red-500 hover:underline"
              >
                Limpar todos
              </button>
            </li>
          );
        })}
      </ul>

      {/* Lista de Flashcards do Tópico Selecionado */}
      <div className="w-3/4 pl-6 space-y-4">
        {selectedStudyItemId ? (
          userFlashcards[selectedStudyItemId]?.map((card: Flashcard) => {
            const meta = allTopicsMeta.find(m => m.id === selectedStudyItemId);
            const color = getValidatedTailwindColorClasses(meta?.baseColor || 'gray');

            return (
              <div
                key={card.id}
                className={`p-4 border-l-4 rounded shadow-sm ${color.border} bg-white`}
              >
                <p><strong>P:</strong> {card.question}</p>
                <p><strong>R:</strong> {card.answer}</p>
                <button
                  onClick={() => onDeleteFlashcard(selectedStudyItemId, card.id)}
                  className="mt-2 text-sm text-red-500 hover:underline"
                >
                  Remover
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">Selecione um tópico à esquerda para ver seus flashcards.</p>
        )}
      </div>
    </div>
  );
};
