/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { TopicMetaList,  AllTopicsArray, TrailDetail } from './types';

export const FOCUS_DURATION = 25 * 60;
export const BREAK_DURATION = 5 * 60;

export const DEFAULT_FOCUS_MINUTES = 25;
export const DEFAULT_BREAK_MINUTES = 5;

export const INACTIVITY_TIMEOUT_DURATION_MS = 3 * 60 * 1000; // 3 minutos

export const TRAIL_ORDER: string[] = [
  'FUNDAMENTOS',
  'PLANEJAMENTO_EXECUCAO',
  'CONTABILIDADE_LRF',
  'LEGISLACAO_ESPECIFICA',
  'TOPICOS_AVANCADOS'
];

export const TRAIL_DETAILS: Record<string, TrailDetail> = {
  FUNDAMENTOS: { displayName: "Fundamentos", icon: "🧱", colorClass: "border-blue-500", bgColorClass: "bg-blue-50", subtitle: "A base conceitual e legal da AFO." },
  PLANEJAMENTO_EXECUCAO: { displayName: "Planejamento e Execução", icon: "⚙️", colorClass: "border-green-500", bgColorClass: "bg-green-50", subtitle: "Do plano à realidade: ciclo orçamentário e gestão." },
  CONTABILIDADE_LRF: { displayName: "Contabilidade", icon: "📊", colorClass: "border-yellow-500", bgColorClass: "bg-yellow-50", subtitle: "Registros, MCASP e responsabilidade fiscal." },
  LEGISLACAO_ESPECIFICA: { displayName: "Legislação Específica", icon: "⚖️", colorClass: "border-purple-500", bgColorClass: "bg-purple-50", subtitle: "Leis chave: Licitações, PPPs, Arcabouço Fiscal." },
  TOPICOS_AVANCADOS: { displayName: "Tópicos Avançados", icon: "🚀", colorClass: "border-red-500", bgColorClass: "bg-red-50", subtitle: "Inovações, futuro do orçamento e temas complexos." },
};

export const ORIGINAL_COLOR_TO_TAILWIND_MAP: Record<string, string> = {
  'bg-blue': 'bg-blue-600',
  'bg-green': 'bg-green-600',
  'bg-yellow': 'bg-yellow-500',
  'bg-purple': 'bg-purple-600',
  'bg-red': 'bg-red-600',
  'bg-indigo': 'bg-indigo-600',
  'bg-pink': 'bg-pink-600',
  'bg-orange': 'bg-orange-600',
  'bg-teal': 'bg-teal-600',
  'bg-gray': 'bg-gray-600',
  'bg-brown': 'bg-yellow-700',
  'bg-cyan': 'bg-cyan-600',
  'bg-lime': 'bg-lime-600',
  'bg-sky': 'bg-sky-600',
  'bg-rose': 'bg-rose-600',
  'bg-navy-blue': 'bg-blue-800',
};


export const TOPIC_META_DATA: TopicMetaList = {
  "1": {
    id: "1",
    title: "1. Papel do Estado nas Finanças",
    subtitle: "Estado, economia e o orçamento público",
    icon: "🏛️",
    color: "bg-blue",
    trail: "FUNDAMENTOS",
    resumo: "O Estado desempenha funções essenciais na economia, intervindo para corrigir falhas de mercado e promover equidade, utilizando o orçamento como ferramenta chave...",
    loader: () => fetch('/data/topics/topic1.json').then(res => res.json()),
  },
  "2": {
    id: "2",
    title: "2. Lei nº 10.180/2001",
    subtitle: "Sistemas Federais de Gestão e a Prática do MTO",
    icon: "🔍",
    color: "bg-indigo",
    trail: "FUNDAMENTOS",
    resumo: "Organiza e disciplina os Sistemas de Planejamento e de Orçamento Federal, de Administração Financeira Federal, de Contabilidade Federal e de Controle Interno do Poder Executivo Federal...",
    loader: () => fetch('/data/topics/topic2.json').then(res => res.json()),
  },
  "3": {
    id: "3",
    title: "3. O Orçamento no Brasil: A Tríade Orçamentária e seus Princípios",
    subtitle: "PPA, LDO, LOA, Ciclo Orçamentário e os Princípios Fundamentais",
    icon: "📄",
    color: "bg-yellow",
    trail: "PLANEJAMENTO_EXECUCAO",
    resumo: "A Constituição de 1988 estabelece a base para o planejamento e o orçamento no Brasil através da tríade PPA, LDO e LOA...",
    loader: () => fetch('/data/topics/topic3.json').then(res => res.json()),
  },
  "4": {
    id: "4",
    title: "4. Programação e Execução Orçamentária",
    subtitle: "Do planejamento à realidade: Elaboração, Execução e Alterações",
    icon: "📈",
    color: "bg-purple",
    trail: "PLANEJAMENTO_EXECUCAO",
    resumo: "Este tópico detalha as fases de elaboração da proposta orçamentária no âmbito federal (conforme MTO e Capítulo 12 do livro de Giacomoni), o exercício financeiro, o regime contábil...",
    loader: () => fetch('/data/topics/topic4.json').then(res => res.json()),
  },
  "5": {
    id: "5",
    title: "5. Contabilidade Aplicada ao Setor Público (CASP) e o MCASP",
    subtitle: "Fundamentos, PCASP e Características da Informação",
    icon: "🔢",
    color: "bg-pink",
    trail: "CONTABILIDADE_LRF",
    resumo: "A Contabilidade Aplicada ao Setor Público (CASP) registra os atos e fatos da gestão pública. O MCASP padroniza essas regras...",
    loader: () => fetch('/data/topics/topic5.json').then(res => res.json()),
  },
  "6": {
    id: "6",
    title: "6. Receita Pública sob a ótica do MCASP",
    subtitle: "Enfoque Orçamentário e Patrimonial, e Classificações do MTO",
    icon: "💰",
    color: "bg-green",
    trail: "CONTABILIDADE_LRF",
    resumo: "O MCASP classifica a receita sob dois enfoques: o orçamentário (entrada de caixa) e o patrimonial (impacto no patrimônio)...",
    loader: () => fetch('/data/topics/topic6.json').then(res => res.json()),
  },
  "7": {
    id: "7",
    title: "7. Despesa Pública sob a ótica do MCASP",
    subtitle: "Enfoque Orçamentário e Patrimonial, e Classificações do MTO",
    icon: "💸",
    color: "bg-orange",
    trail: "CONTABILIDADE_LRF",
    resumo: "A despesa tem dois enfoques no MCASP: o orçamentário (controle da saída de dinheiro) e o patrimonial (geração da obrigação)...",
    loader: () => fetch('/data/topics/topic7.json').then(res => res.json()),
  },
  "8": {
    id: "8",
    title: "8. Lei de Responsabilidade Fiscal (LRF - LC 101/2000)",
    subtitle: "Normas para uma Gestão Fiscal Responsável",
    icon: "📜",
    color: "bg-teal",
    trail: "PLANEJAMENTO_EXECUCAO",
    resumo: "A Lei Complementar nº 101/2000 (LRF) estabelece normas de finanças públicas voltadas para a responsabilidade na gestão fiscal...",
    loader: () => fetch('/data/topics/topic8.json').then(res => res.json()),
  },
  "9": {
    id: "9",
    title: "9. Vedações Orçamentárias (Art. 167 CF)",
    subtitle: "As 'Regras de Ouro' do Gasto Público",
    icon: "🚫",
    color: "bg-gray",
    trail: "PLANEJAMENTO_EXECUCAO",
    resumo: "O Artigo 167 da Constituição Federal estabelece um conjunto vital de proibições para a gestão orçamentária...",
    loader: () => fetch('/data/topics/topic9.json').then(res => res.json()),
  },
  "10": {
    id: "10",
    title: "10. Licitação (Lei 14.133/2021)",
    subtitle: "Processo de Contratação Pública",
    icon: "⚖️",
    color: "bg-navy-blue",
    trail: "LEGISLACAO_ESPECIFICA",
    resumo: "A Lei 14.133/2021 estabelece as normas gerais para licitações e contratos administrativos...",
    loader: () => fetch('/data/topics/topic10.json').then(res => res.json()),
  },
  "11": {
    id: "11",
    title: "11. Contrato Administrativo (Lei 14.133/2021)",
    subtitle: "Formalização e Gestão dos Acordos Públicos",
    icon: "📝",
    color: "bg-cyan",
    trail: "LEGISLACAO_ESPECIFICA",
    resumo: "A Lei 14.133/2021 rege a formalização, execução, alteração e extinção dos contratos administrativos.",
    loader: () => fetch('/data/topics/topic11.json').then(res => res.json()),
  },
  "12": {
    id: "12",
    title: "12. Normas Gerais de Finanças (Lei 4.320/64)",
    subtitle: "A Lei Fundamental do Direito Financeiro e sua Aplicação",
    icon: "📚",
    color: "bg-brown",
    trail: "FUNDAMENTOS",
    resumo: "A Lei 4.320/64 estatui Normas Gerais de Direito Financeiro, sendo a espinha dorsal da elaboração e controle dos orçamentos e balanços no Brasil...",
    loader: () => fetch('/data/topics/topic12.json').then(res => res.json()),
  },
  "13": {
    id: "13",
    title: "13. O Novo Arcabouço Fiscal (LCP 200/2023)",
    subtitle: "Regime Fiscal Sustentável para Equilíbrio das Contas Públicas",
    icon: "🆕",
    color: "bg-red",
    trail: "LEGISLACAO_ESPECIFICA",
    resumo: "A Lei Complementar nº 200/2023 institui o Regime Fiscal Sustentável, substituindo o 'Teto de Gastos'...",
    loader: () => fetch('/data/topics/topic13.json').then(res => res.json()),
  },
  "14": {
    id: "14",
    title: "14. Parcerias Público-Privadas (Lei 11.079/2004) e o MDF",
    subtitle: "Concessões, Limites e Evidenciação Fiscal (Anexo 13 RREO)",
    icon: "🏗️",
    color: "bg-orange",
    trail: "LEGISLACAO_ESPECIFICA",
    resumo: "A Lei nº 11.079/2004 institui normas para Parcerias Público-Privadas (PPPs), detalhando modalidades, diretrizes, vedações e garantias...",
    loader: () => fetch('/data/topics/topic14.json').then(res => res.json()),
  },
  "15": {
    id: "15",
    title: "15. O futuro do orçamento: Técnicas Modernas e Foco em Resultados",
    subtitle: "Do Orçamento-Programa ao Orçamento por Resultados, OBZ, APO e Inovações Digitais",
    icon: "🚀",
    color: "bg-lime",
    trail: "TOPICOS_AVANCADOS",
    resumo: "Este tópico explora a evolução das técnicas orçamentárias modernas, desde os fundamentos do Orçamento-Programa, passando pelo Orçamento de Desempenho...",
    loader: () => fetch('/data/topics/topic15.json').then(res => res.json()),
  },
  "16": {
    id: "16",
    title: "16. MCASP - Procedimentos Contábeis Específicos (Parte III)",
    subtitle: "Tópicos avançados e detalhamentos da CASP, e sua relação com o MTO",
    icon: "🧩",
    color: "bg-sky",
    trail: "TOPICOS_AVANCADOS",
    resumo: "Aprofundamento em temas como consolidação de contas, operações entre órgãos, previdência de servidores (RPPS), consórcios e fundos especiais...",
    loader: () => fetch('/data/topics/topic16.json').then(res => res.json()),
  }
};

// Derived array from TOPIC_META_DATA
export const TOPIC_META_DATA_ARRAY: AllTopicsArray = Object.values(TOPIC_META_DATA);

// Storage Keys
export const REVIEW_SCHEDULE_STORAGE_KEY = 'tdahFriendlyReviewSchedule';
export const USER_NOTES_STORAGE_KEY = 'tdahFriendlyUserNotes';
export const TIMER_SETTINGS_STORAGE_KEY = 'tdahFriendlyTimerSettings';
export const USER_FLASHCARDS_STORAGE_KEY = 'tdahFriendlyUserFlashcards';

// Sound URLs
export const REVIEW_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/button-12.mp3'; // Example sound
