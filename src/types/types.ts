/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** Metadados básicos de um item de estudo (sem o conteúdo completo). */
export interface StudyItemMeta {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  baseColor: string; // Ex: 'blue', 'green' — usado para gerar classes Tailwind
  trail?: string;
  resumo?: string;
  subtopics: boolean;
  loader: () => Promise<StudyItem>;
}

/** Item de estudo completo, incluindo conteúdo e subtópicos. */
export interface StudyItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  baseColor: string;
  trail?: string;
  resumo?: string;
  content?: string;
  subtopics?: StudyItem[];
  meta: StudyItemMeta;
}

/** Detalhe de uma trilha de estudo */
export interface TrailDetail {
  displayName: string;
  icon: string;
  subtitle: string;
  baseColor: string;
}

/** Lista de metadados, indexada por ID do tópico */
export type TopicMetaList = Record<string, StudyItemMeta>;

/** Array de todos os StudyItemMeta disponíveis */
export type AllTopicsArray = StudyItemMeta[];

/** Modos do timer Pomodoro */
export type TimerMode = 'focus' | 'break';

/** Aba da interface (Dashboard, StudyMode, etc.) */
export interface Tab {
  id: string;
  label: string;
  ariaControls: string;
}

/** Tipos de metas gamificadas */
export type GoalType =
  | 'study'
  | 'study_subtopics'
  | 'review_content'
  | 'practice_exercises'
  | 'complete_pomodoros'
  | 'quiz_mode';

/** Meta diária configurável pelo usuário */
export interface Goal {
  id: string;
  type: GoalType;
  description: string;
  targetValue: number;
  currentValue: number;
  timeframe: 'daily';
  createdAt: Date;
  isCompleted: boolean;
  completedAt?: Date;
  rewardPoints: number;
  baseColor: string;
}

/** Status de permissão de notificações */
export type NotificationPermissionStatus = 'granted' | 'denied' | 'default';

/** Item da agenda de revisão espaçada */
export interface ReviewScheduleItem {
  topicId: string;
  firstStudiedDate: string;
  lastReviewDate: string;
  nextReviewDate: string;
  reviewStage: number;
  isDueForReview: boolean;
}

/** Mapa de itens de revisão por ID */
export type ReviewSchedule = Record<string, ReviewScheduleItem>;

/** Notas livres do usuário, indexadas por StudyItem.id */
export type UserNotesData = Record<string, string>;

/** Mensagem de chat entre usuário e IA */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'error';
  text: string;
  timestamp: number;
}

/** Flashcard gerado pela IA */
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

/** Armazenamento de flashcards por tópico */
export type UserFlashcardsData = Record<string, Flashcard[]>;

/** Opção de resposta de quiz */
export interface QuizAnswerOption {
  text: string;
  isCorrect: boolean;
  justification: string;
}

/** Questão de quiz gerada pela IA */
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizAnswerOption[];
}

/** Sugestão de novo tópico */
export interface SuggestedTopicInfo {
  id: string;
  title: string;
  trail: string;
}
