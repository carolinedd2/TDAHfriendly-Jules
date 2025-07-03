import type { GenerateContentResponse } from '@google/genai';
import { useCallback, useState } from 'react';

import { QuizQuestion, StudyItemMeta } from '../types/types';
import { genaiClient } from '../utils/genaiClient';

export default function useQuiz() {
  const [quizContextItem, setQuizContextItem] = useState<StudyItemMeta | null>(
    null,
  );
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<
    QuizQuestion[] | null
  >(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizGenerationError, setQuizGenerationError] = useState<string | null>(
    null,
  );
  const [showQuizModal, setShowQuizModal] = useState(false);

  const handleGenerateQuiz = useCallback(async (studyItem: StudyItemMeta) => {
    setQuizContextItem(studyItem);
    setIsGeneratingQuiz(true);
    setQuizGenerationError(null);
    setCurrentQuizQuestions(null);
    // Don't set setShowQuizModal(true) yet

    // 1) Carrega o StudyItem completo via loader
    setQuizContextItem(studyItem);
    setShowQuizModal(true);
    setIsGeneratingQuiz(true);
    setQuizGenerationError(null);
    setCurrentQuizQuestions(null);
 

    const fullItem = await studyItem.loader();
    const itemContent =
      fullItem.content?.trim() || fullItem.resumo?.trim() || '';
 fix/lint-errors

    if (!itemContent) {
      setQuizGenerationError(
        'Não há conteúdo suficiente neste tópico para gerar um quiz.',
      );
      setIsGeneratingQuiz(false);
      setShowQuizModal(true); // Show modal to display the error
      return;
    }

    // If content exists, now we decide to show the modal because we will proceed.
    setShowQuizModal(true);

    // 2) Define contexto do prompt
    const isMainTopic = !studyItem.id.includes('.');
    const numberOfQuestions = isMainTopic ? '10 a 15' : '4 a 5';
    const topicContextMessage = isMainTopic
      ? `Tópico principal: gere entre ${numberOfQuestions} perguntas de múltipla escolha.`
      : `Subtópico: gere entre ${numberOfQuestions} perguntas de múltipla escolha.`;


    if (!itemContent) {
      setQuizGenerationError(
        'Não há conteúdo suficiente neste tópico para gerar um quiz.',
      );
      setIsGeneratingQuiz(false);
      return;
    }

    // 2) Define contexto do prompt
    const isMainTopic = !studyItem.id.includes('.');
    const numberOfQuestions = isMainTopic ? '10 a 15' : '4 a 5';
    const topicContextMessage = isMainTopic
      ? `Tópico principal: gere entre ${numberOfQuestions} perguntas de múltipla escolha.`
      : `Subtópico: gere entre ${numberOfQuestions} perguntas de múltipla escolha.`;

 main
    const prompt = `
${topicContextMessage}

Gere um quiz com ${numberOfQuestions} perguntas sobre o texto fornecido.
Para cada pergunta, retorne um objeto com:
1. "question": string
2. "options": array de 3–4 objetos com:
   - "text": string
   - "isCorrect": boolean (exatamente UMA opção correta)
   - "justification": string

Formate a saída como um array JSON de objetos. Nada além do JSON.
      `.trim();

    try {
      // 3) Gera o quiz usando o cliente GenAI
      const response: GenerateContentResponse =
        await genaiClient.models.generateContent({
          model: 'gemini-2.5-flash-preview-04-17',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

      // 4) Extrai e valida o JSON
      const jsonStr = (response.text ?? '')
        .trim()
        .replace(/^```(?:json)?/i, '')
        .replace(/```$/, '');
      const parsed = JSON.parse(jsonStr);
      interface QuizOptionFromAPI {
        text: string;
        isCorrect: boolean;
        justification: string;
      }

      interface QuizQuestionFromAPI {
        id?: string;
        question: string;
        options: QuizOptionFromAPI[];
      }
      if (
        Array.isArray(parsed) &&
        parsed.every(
          (q: QuizQuestionFromAPI) =>
            typeof q.question === 'string' &&
            Array.isArray(q.options) &&
            q.options.every(
              (opt: QuizOptionFromAPI) =>
                typeof opt.text === 'string' &&
                typeof opt.isCorrect === 'boolean' &&
                typeof opt.justification === 'string',
            ) &&
            q.options.filter((opt: QuizOptionFromAPI) => opt.isCorrect)
              .length === 1,
        )
      ) {
        const questionsWithIds: QuizQuestion[] = parsed.map(
          (q: QuizQuestionFromAPI) => ({
            id: q.id || crypto.randomUUID(),
            question: q.question,
            options: q.options,
          }),
        );
        setCurrentQuizQuestions(questionsWithIds);
      } else {
        throw new Error('Formato das perguntas retornadas pela IA é inválido.');
      }
    } catch (err) {
      console.error('Erro ao gerar quiz:', err);
      if (err instanceof Error) {
        setQuizGenerationError(`Erro ao gerar quiz: ${err.message}`);
      } else {
        setQuizGenerationError('Ocorreu um erro desconhecido ao gerar o quiz.');
      }
    } finally {
      setIsGeneratingQuiz(false);
    }
  }, []);

  const handleCloseQuizModal = useCallback(() => {
    setShowQuizModal(false);
    setCurrentQuizQuestions(null);
    setQuizGenerationError(null);
    setQuizContextItem(null);
  }, []);

  return {
    quizContextItem,
    currentQuizQuestions,
    isGeneratingQuiz,
    quizGenerationError,
    showQuizModal,
    handleGenerateQuiz,
    handleCloseQuizModal,
  };
}

// Exporta o tipo para uso em StudyModeProps
export type ReturnTypeUseQuiz = ReturnType<typeof useQuiz>;
