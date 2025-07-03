import React, { useState } from 'react';

import { QuizQuestion } from '../types/types';

interface QuizModalProps {
  isOpen?: boolean; // ← opcional, usado apenas em contextos que precisam disso
  isGenerating: boolean;
  studyItemTitle: string;
  questions: QuizQuestion[];
  error: string | null;
  onClose: () => void;
  baseColor?: string;
}

const QuizModal: React.FC<QuizModalProps> = ({
  isGenerating,
  studyItemTitle,
  questions,
  error,
  onClose,
  baseColor = '#4F8EF7', // azul padrão se não vier nada
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setQuizScore(score => score + 1);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setShowResult(true);
    }
  };

  const getFeedbackMessage = () => {
    const percent = (quizScore / questions.length) * 100;
    if (percent === 100) return '🎉 Excelente! Você acertou todas.';
    if (percent >= 70) return '💪 Bom trabalho! Continue praticando.';
    return '📚 Continue estudando e tente novamente.';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{studyItemTitle} – Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar quiz"
          >
            ✕
          </button>
        </header>

        {/* Estados de carregamento e erro */}
        {isGenerating && (
          <div className="text-center py-8">
            <p>🧠 Gerando quiz com IA... Aguarde um momento!</p>
          </div>
        )}

        {!isGenerating && error && (
          <div className="text-red-600 py-4">
            <p>😞 Erro ao gerar o quiz: {error}</p>
          </div>
        )}

        {!isGenerating && !error && questions.length === 0 && (
          <div className="text-center py-8 text-gray-700">
            <p>🤷 Nenhuma pergunta disponível. Tente novamente mais tarde.</p>
          </div>
        )}

        {/* Quiz ativo */}
        {!isGenerating && !error && questions.length > 0 && !showResult && (
          <div>
            <p className="mb-2 text-sm text-gray-600">
              Pergunta {currentQuestionIndex + 1} de {questions.length}
            </p>
            <div className="mb-4">
              <p className="font-semibold text-gray-800">
                {currentQuestion.question}
              </p>
            </div>
            <ul className="space-y-2 mb-6">
              {currentQuestion.options.map(opt => (
                <li key={opt.text}>
                  <button
                    onClick={() => handleAnswer(opt.isCorrect)}
                    className="w-full text-left px-4 py-2 border rounded transition hover:bg-opacity-10"
                    style={{ borderColor: baseColor, color: baseColor }}
                  >
                    {opt.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resultado final */}
        {!isGenerating && !error && showResult && (
          <div className="space-y-4 text-center">
            <p className="text-lg font-semibold text-gray-800">
              Você acertou {quizScore} de {questions.length} pergunta(s)!
            </p>
            <p className="text-sm italic text-gray-600">
              {getFeedbackMessage()}
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-4 py-2 rounded text-white font-medium"
              style={{ backgroundColor: baseColor }}
            >
              Fechar Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
