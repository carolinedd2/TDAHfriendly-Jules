// src/features/StudyMode.tsx
import React, { useState, useEffect } from 'react';
import { StudyItemMeta, StudyItem, Flashcard } from '../types/types';
import type { ReturnTypeUseTimer } from '../hooks/useTimer';
import type { ReturnTypeUseQuiz } from '../hooks/useQuiz';
import type { ReturnTypeUseFlashcards } from '../hooks/useFlashcards';
import QuizModal from '../modals/QuizModal';

export interface StudyModeProps {
  currentItem: StudyItemMeta;
  topicProgressMap: Record<string, number>;
  onToggleComprehendedItem: (itemId: string) => void;
  timer: ReturnTypeUseTimer;
  quiz: ReturnTypeUseQuiz;
  flashcards: ReturnTypeUseFlashcards;
  onOpenMindMapModal: (item: StudyItem) => void;
  /** Função para selecionar/navegar para outro tópico */
  onSelectTopic: (topicId: string) => Promise<void>;
}

export const StudyMode: React.FC<StudyModeProps> = ({
  currentItem,
  topicProgressMap,
  onToggleComprehendedItem,
  timer,
  quiz,
  flashcards,
  onOpenMindMapModal,
  onSelectTopic,
}) => {
  const [fullItem, setFullItem] = useState<StudyItem | null>(null);
  const progress = topicProgressMap[currentItem.id] ?? 0;

  // Load full StudyItem when currentItem changes
  useEffect(() => {
    let canceled = false;
    currentItem.loader().then(item => {
      if (!canceled) setFullItem(item);
    });
    return () => {
      canceled = true;
    };
  }, [currentItem]);

  // Show loading state until fullItem is available
  if (!fullItem) {
    return <div>Carregando…</div>;
  }

  const { subtopics = [], content, resumo } = fullItem;

  return (
    <div className="p-4 space-y-6">
      {/* Título e Resumo */}
      <header>
        <h2 className="text-2xl font-bold">{currentItem.title}</h2>
        {resumo && <p className="mt-2 text-gray-700">{resumo}</p>}
      </header>

      {/* Botões de Navegação */}
      <div className="flex space-x-2">
        <button
          onClick={() => onSelectTopic(currentItem.id)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ir para próximo tópico
        </button>
        <button
          onClick={() =>
            onOpenMindMapModal({
              id: fullItem.id,
              title: currentItem.title,
              content: content || resumo || '',
              subtopics: fullItem.subtopics,
              meta: currentItem,
              baseColor: '',
              body: undefined
            })
          }
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Abrir Mapa Mental
        </button>
      </div>

      {/* Timer Pomodoro */}
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Timer Pomodoro</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xl font-mono">
            {String(Math.floor(timer.timerSecondsRemaining / 60)).padStart(2, '0')}:
            {String(timer.timerSecondsRemaining % 60).padStart(2, '0')}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded">
            {timer.currentTimerMode}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => timer.startTimer('focus')}
            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Iniciar Foco
          </button>
          <button
            onClick={() => timer.startTimer('break')}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Pausa
          </button>
          <button
            onClick={timer.pauseTimer}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Pausar
          </button>
          <button
            onClick={timer.resetTimer}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Resetar
          </button>
        </div>
      </section>

      {/* Subtópicos e Revisão */}
      {subtopics.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Subtópicos</h3>
          <ul className="space-y-1">
            {subtopics.map(sub => (
              <li key={sub.id} className="flex items-center space-x-2">
                <input
                  id={`chk-${sub.id}`}
                  type="checkbox"
                  checked={topicProgressMap[sub.id] === 100}
                  onChange={() => onToggleComprehendedItem(sub.id)}
                  className="h-4 w-4"
                />
                <label htmlFor={`chk-${sub.id}`} className="flex-1">
                  {sub.title}
                </label>
                <span className="text-sm text-gray-500">
                  {topicProgressMap[sub.id] ?? 0}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Progresso Geral */}
      <section>
        <h3 className="text-lg font-semibold">
          Progresso deste tópico: {progress}%
        </h3>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-400 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Quiz via IA */}
<section className="space-y-2">
  <h3 className="text-lg font-semibold">Quiz</h3>
  <button
    onClick={() => quiz.handleGenerateQuiz(currentItem)}
    disabled={quiz.isGeneratingQuiz}
    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
  >
    {quiz.isGeneratingQuiz ? 'Gerando Quiz…' : 'Gerar Quiz'}
  </button>

  <QuizModal
    isOpen={quiz.showQuizModal}
    isGenerating={quiz.isGeneratingQuiz}
    studyItemTitle={currentItem.title}
    questions={quiz.currentQuizQuestions ?? []}
    error={quiz.quizGenerationError}
    onClose={quiz.handleCloseQuizModal}
  />
</section>

      {/* Flashcards */}
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Flashcards</h3>
        <button
          onClick={() => flashcards.generateCards(currentItem)}
          disabled={flashcards.isGenerating}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50"
        >
          {flashcards.isGenerating ? 'Gerando Flashcards…' : 'Gerar Flashcards'}
        </button>
        {flashcards.userFlashcards[currentItem.id]?.length > 0 && (
          <ul className="mt-4 space-y-2">
            {flashcards.userFlashcards[currentItem.id]?.map((card: Flashcard) => (
              <li key={card.id} className="p-4 border rounded">
                <p><strong>P:</strong> {card.question}</p>
                <p><strong>R:</strong> {card.answer}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default StudyMode;