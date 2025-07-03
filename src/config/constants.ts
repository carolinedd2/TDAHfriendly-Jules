import {
  AllTopicsArray,
  StudyItem,
  TopicMetaList,
  TrailDetail,
} from '../types/types';

//
// ⏱️ Temporizadores
//
export const FOCUS_DURATION = 25 * 60;
export const BREAK_DURATION = 5 * 60;

export const DEFAULT_FOCUS_MINUTES = 25;
export const DEFAULT_BREAK_MINUTES = 5;

export const INACTIVITY_TIMEOUT_DURATION_MS = 3 * 60 * 1000;

//
// 🧭 Trilhas de Aprendizado
//
export const TRAIL_ORDER: string[] = [
  'FUNDAMENTOS',
  'PLANEJAMENTO_EXECUCAO',
  'CONTABILIDADE_LRF',
  'LEGISLACAO_ESPECIFICA',
  'TOPICOS_AVANCADOS',
];

export const TRAIL_DETAILS: Record<string, TrailDetail> = {
  FUNDAMENTOS: {
    displayName: 'Fundamentos',
    icon: '🧱',
    baseColor: 'blue',
    subtitle: 'A base conceitual e legal da AFO.',
  },
  PLANEJAMENTO_EXECUCAO: {
    displayName: 'Planejamento e Execução',
    icon: '⚙️',
    baseColor: 'green',
    subtitle: 'Do plano à realidade: ciclo orçamentário e gestão.',
  },
  CONTABILIDADE_LRF: {
    displayName: 'Contabilidade',
    icon: '📊',
    baseColor: 'yellow',
    subtitle: 'Registros, MCASP e responsabilidade fiscal.',
  },
  LEGISLACAO_ESPECIFICA: {
    displayName: 'Legislação Específica',
    icon: '⚖️',
    baseColor: 'purple',
    subtitle: 'Leis chave: Licitações, PPPs, Arcabouço Fiscal.',
  },
  TOPICOS_AVANCADOS: {
    displayName: 'Tópicos Avançados',
    icon: '🚀',
    baseColor: 'red',
    subtitle: 'Inovações, futuro do orçamento e temas complexos.',
  },
};

//
// 📚 Tópicos de Estudo
//
export const TOPIC_META_DATA: TopicMetaList = {
  '1': {
    id: '1',
    title: '1. Papel do Estado nas Finanças',
    subtitle: 'Estado, economia e o orçamento público',
    icon: '🏛️',
    baseColor: 'blue',
    trail: 'FUNDAMENTOS',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic1.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '2': {
    id: '2',
    title: '2. Lei nº 10.180/2001',
    subtitle: 'Sistemas Federais de Gestão e a Prática do MTO',
    icon: '🔍',
    baseColor: 'indigo',
    trail: 'FUNDAMENTOS',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic2.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '3': {
    id: '3',
    title: '3. O Orçamento no Brasil: A Tríade Orçamentária e seus Princípios',
    subtitle: 'PPA, LDO, LOA, Ciclo Orçamentário e os Princípios Fundamentais',
    icon: '📄',
    baseColor: 'yellow',
    trail: 'PLANEJAMENTO_EXECUCAO',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic3.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '4': {
    id: '4',
    title: '4. Programação e Execução Orçamentária',
    subtitle: 'Do planejamento à realidade',
    icon: '📈',
    baseColor: 'purple',
    trail: 'PLANEJAMENTO_EXECUCAO',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic4.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '5': {
    id: '5',
    title: '5. Contabilidade Aplicada ao Setor Público (CASP) e o MCASP',
    subtitle: 'Fundamentos, PCASP e Características da Informação',
    icon: '🔢',
    baseColor: 'pink',
    trail: 'CONTABILIDADE_LRF',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic5.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '6': {
    id: '6',
    title: '6. Receita Pública sob a ótica do MCASP',
    subtitle: 'Enfoque Orçamentário e Patrimonial',
    icon: '💰',
    baseColor: 'green',
    trail: 'CONTABILIDADE_LRF',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic6.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '7': {
    id: '7',
    title: '7. Despesa Pública sob a ótica do MCASP',
    subtitle: 'Enfoque Orçamentário e Patrimonial',
    icon: '💸',
    baseColor: 'orange',
    trail: 'CONTABILIDADE_LRF',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic7.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '8': {
    id: '8',
    title: '8. Lei de Responsabilidade Fiscal (LRF - LC 101/2000)',
    subtitle: 'Normas para uma Gestão Fiscal Responsável',
    icon: '📜',
    baseColor: 'teal',
    trail: 'PLANEJAMENTO_EXECUCAO',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic8.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '9': {
    id: '9',
    title: '9. Vedações Orçamentárias (Art. 167 CF)',
    subtitle: "As 'Regras de Ouro' do Gasto Público",
    icon: '🚫',
    baseColor: 'gray',
    trail: 'PLANEJAMENTO_EXECUCAO',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic9.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '10': {
    id: '10',
    title: '10. Licitação (Lei 14.133/2021)',
    subtitle: 'Processo de Contratação Pública',
    icon: '⚖️',
    baseColor: 'blue', // convertido de navy-blue
    trail: 'LEGISLACAO_ESPECIFICA',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic10.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '11': {
    id: '11',
    title: '11. Contrato Administrativo (Lei 14.133/2021)',
    subtitle: 'Formalização e Gestão dos Acordos Públicos',
    icon: '📝',
    baseColor: 'cyan',
    trail: 'LEGISLACAO_ESPECIFICA',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic11.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '12': {
    id: '12',
    title: '12. Normas Gerais de Finanças (Lei 4.320/64)',
    subtitle: 'A Lei Fundamental do Direito Financeiro',
    icon: '📚',
    baseColor: 'yellow', // substituindo brown
    trail: 'FUNDAMENTOS',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic12.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '13': {
    id: '13',
    title: '13. O Novo Arcabouço Fiscal (LCP 200/2023)',
    subtitle: 'Regime Fiscal Sustentável',
    icon: '🆕',
    baseColor: 'red',
    trail: 'LEGISLACAO_ESPECIFICA',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic13.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '14': {
    id: '14',
    title: '14. Parcerias Público-Privadas (Lei 11.079/2004) e o MDF',
    subtitle: 'Concessões, Limites e Evidenciação Fiscal',
    icon: '🏗️',
    baseColor: 'orange',
    trail: 'LEGISLACAO_ESPECIFICA',
    resumo: '...',
    subtopics: false,
    loader: () =>
      fetch('/data/topics/topic14.json').then(
        res => res.json() as Promise<StudyItem>,
      ),
  },
  '15': {
    id: '15',
    title: '15. O futuro do orçamento: Técnicas Modernas',
    subtitle: 'Do Orçamento-Programa a Inovações Digitais',
    icon: '🚀',
    baseColor: 'lime',
    trail: 'TOPICOS_AVANCADOS',
    resumo: '...',
    subtopics: false,
    loader: () => fetch('/data/topics/topic15.json').then(res => res.json()),
  },
  '16': {
    id: '16',
    title: '16. MCASP - Procedimentos Contábeis Específicos (Parte III)',
    subtitle: 'Tópicos avançados e detalhamentos da CASP',
    icon: '🧩',
    baseColor: 'sky',
    trail: 'TOPICOS_AVANCADOS',
    resumo: '...',
    subtopics: false,
    loader: () => fetch('/data/topics/topic16.json').then(res => res.json()),
  },
};

//
// 📋 Array derivado para renderizações
//
//
// 📋 Array derivado para renderizações
//
export const TOPIC_META_DATA_ARRAY: AllTopicsArray =
  Object.values(TOPIC_META_DATA);

//
// 💾 Storage Keys
//
export const REVIEW_SCHEDULE_STORAGE_KEY = 'tdahFriendlyReviewSchedule';
export const USER_NOTES_STORAGE_KEY = 'tdahFriendlyUserNotes';
export const TIMER_SETTINGS_STORAGE_KEY = 'tdahFriendlyTimerSettings';
export const USER_FLASHCARDS_STORAGE_KEY = 'tdahFriendlyUserFlashcards';

//
// 🔊 Sons do sistema
//
export const REVIEW_SOUND_URL =
  'https://www.soundjay.com/buttons/sounds/button-12.mp3';
export const CHECK_SOUND_URL =
  'https://www.soundjay.com/buttons/sounds/button-09.mp3';
export const UNCHECK_SOUND_URL =
  'https://www.soundjay.com/buttons/sounds/button-10.mp3';
export const GOAL_COMPLETE_SOUND_URL =
  'https://www.soundjay.com/buttons/sounds/button-3.mp3';

//
// 🔁 Lógica de Revisão
//
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];
export const MAX_REVIEW_STAGES = REVIEW_INTERVALS_DAYS.length;
export const REVIEW_COMPLETION_POINTS = 5;
