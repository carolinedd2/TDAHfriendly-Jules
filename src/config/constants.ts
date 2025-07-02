import { TopicMetaList, AllTopicsArray, TrailDetail } from '../types/types';

// Timer Configuration
export const FOCUS_DURATION = 25 * 60;
export const BREAK_DURATION = 5 * 60;

export const DEFAULT_FOCUS_MINUTES = 25;
export const DEFAULT_BREAK_MINUTES = 5;

export const INACTIVITY_TIMEOUT_DURATION_MS = 3 * 60 * 1000;

// Trail Configuration
export const TRAIL_ORDER: string[] = [
  'FUNDAMENTOS',
  'PLANEJAMENTO_EXECUCAO',
  'CONTABILIDADE_LRF',
  'LEGISLACAO_ESPECIFICA',
  'TOPICOS_AVANCADOS',
];

export const TRAIL_DETAILS: Record<string, TrailDetail> = {
  FUNDAMENTOS: {
    displayName: "Fundamentos",
    icon: "🧱",
    baseColor: "blue",
    subtitle: "A base conceitual e legal da AFO.",
  },
  PLANEJAMENTO_EXECUCAO: {
    displayName: "Planejamento e Execução",
    icon: "⚙️",
    baseColor: "green",
    subtitle: "Do plano à realidade: ciclo orçamentário e gestão.",
  },
  CONTABILIDADE_LRF: {
    displayName: "Contabilidade",
    icon: "📊",
    baseColor: "yellow",
    subtitle: "Registros, MCASP e responsabilidade fiscal.",
  },
  LEGISLACAO_ESPECIFICA: {
    displayName: "Legislação Específica",
    icon: "⚖️",
    baseColor: "purple",
    subtitle: "Leis chave: Licitações, PPPs, Arcabouço Fiscal.",
  },
  TOPICOS_AVANCADOS: {
    displayName: "Tópicos Avançados",
    icon: "🚀",
    baseColor: "red",
    subtitle: "Inovações, futuro do orçamento e temas complexos.",
  },
};

// Topic Metadata
export const TOPIC_META_DATA: TopicMetaList = {
  "1": {
    id: "1",
    title: "1. Papel do Estado nas Finanças",
    subtitle: "Estado, economia e o orçamento público",
    icon: "🏛️",
    baseColor: "blue",
    color: "blue", // Added color property
    trail: "FUNDAMENTOS",
    subtopics: false,
    loader: () => fetch('/data/topics/topic1.json').then(res => res.json()),
  },
  "2": {
    id: "2",
    title: "2. Lei nº 10.180/2001",
    subtitle: "Sistemas Federais de Gestão e a Prática do MTO",
    icon: "🔍",
    baseColor: "indigo",
    color: "indigo", // Added color property
    trail: "FUNDAMENTOS",
    subtopics: false,
    loader: () => fetch('/data/topics/topic2.json').then(res => res.json()),
  },
  "3": {
    id: "3",
    title: "3. O Orçamento no Brasil: A Tríade Orçamentária e seus Princípios",
    subtitle: "PPA, LDO, LOA, Ciclo Orçamentário e os Princípios Fundamentais",
    icon: "📄",
    baseColor: "yellow",
    color: "yellow", // Added color property
    trail: "PLANEJAMENTO_EXECUCAO",
    subtopics: false,
    loader: () => fetch('/data/topics/topic3.json').then(res => res.json()),
  },
  // ... continue com os demais tópicos usando baseColor no lugar de color
};

export const TOPIC_META_DATA_ARRAY: AllTopicsArray = Object.values(TOPIC_META_DATA);

// Storage Keys
export const REVIEW_SCHEDULE_STORAGE_KEY = 'tdahFriendlyReviewSchedule';
export const USER_NOTES_STORAGE_KEY = 'tdahFriendlyUserNotes';
export const TIMER_SETTINGS_STORAGE_KEY = 'tdahFriendlyTimerSettings';
export const USER_FLASHCARDS_STORAGE_KEY = 'tdahFriendlyUserFlashcards';

// Sound URLs
export const REVIEW_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/button-12.mp3';
export const CHECK_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/button-09.mp3';
export const UNCHECK_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/button-10.mp3';
export const GOAL_COMPLETE_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/button-3.mp3';

// Review System
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];
export const MAX_REVIEW_STAGES = REVIEW_INTERVALS_DAYS.length;
export const REVIEW_COMPLETION_POINTS = 5;
