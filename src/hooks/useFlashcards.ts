import { useState, useCallback } from 'react';
import { Flashcard, StudyItemMeta, UserFlashcardsData } from '../types/types';
import { genaiClient } from '../utils/genaiClient';
import type { GenerateContentResponse } from '@google/genai';

export default function useFlashcards() {
  const [userFlashcards, setUserFlashcards] = useState<UserFlashcardsData>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const generateCards = useCallback(async (studyItem: StudyItemMeta) => {
    setIsGenerating(true);
    setGenerationError(null);

    const full = await studyItem.loader();
    const text = full.content?.trim() || full.resumo?.trim() || '';
    if (!text) {
      setGenerationError('Conteúdo insuficiente');
      setIsGenerating(false);
      return;
    }

    const prompt = `Gere 5 flashcards com base no seguinte conteúdo: ${text}`;
    try {
      const response: GenerateContentResponse = await genaiClient.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const parsed: Flashcard[] = JSON.parse(response.text ?? '');
      setUserFlashcards(prev => ({
        ...prev,
        [studyItem.id]: parsed,
      }));
    } catch (err: any) {
      setGenerationError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const deleteFlashcard = useCallback((studyItemId: string, flashcardId: string) => {
    setUserFlashcards(prev => ({
      ...prev,
      [studyItemId]: prev[studyItemId]?.filter(f => f.id !== flashcardId) ?? [],
    }));
  }, []);

  const deleteAllFlashcards = useCallback((studyItemId: string) => {
    setUserFlashcards(prev => ({
      ...prev,
      [studyItemId]: [],
    }));
  }, []);

  return {
    userFlashcards,
    isGenerating,
    generationError,
    generateCards,
    deleteFlashcard,
    deleteAllFlashcards,
  };
}

export type ReturnTypeUseFlashcards = ReturnType<typeof useFlashcards>;
