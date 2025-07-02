/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FC,
  Fragment,
} from 'react';
import { StudyItem, ChatMessage } from '../types/types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: StudyItem;
  onAskAI: (
    userQuery: string,
    predefinedAction?: 'simplify' | 'key_points' | 'example'
  ) => Promise<void>;
  isLoading: boolean;
  aiResponse: string;
  aiError: string | null;
}

const predefinedActionLabels: Record<
  'simplify' | 'key_points' | 'example',
  string
> = {
  simplify: 'Explique de forma simples',
  key_points: 'Pontos principais',
  example: 'Dê um exemplo prático',
};

// Fallback para crypto.randomUUID em navegadores antigos
const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substr(2, 9);

const createMessage = (
  text: string,
  sender: ChatMessage['sender']
): ChatMessage => ({
  id: generateId(),
  sender,
  text,
  timestamp: Date.now(),
});

const AIAssistantModal: FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentItem,
  onAskAI,
  isLoading,
  aiResponse,
  aiError,
}) => {
  const [customQuery, setCustomQuery] = useState('');
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Foco automático no textarea ao abrir
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen, currentItem.id]);

  // Fechar com ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Animação de entrada
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => setIsAnimatingIn(true), 10);
      setChatHistory([]);
      setCustomQuery('');
    } else {
      setIsAnimatingIn(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen, currentItem.id]);

  // Handler para pergunta customizada
  const handleCustomQuerySubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const queryText = customQuery.trim();
      if (queryText) {
        setChatHistory((prev) => [
          ...prev,
          createMessage(queryText, 'user'),
        ]);
        onAskAI(queryText);
        setCustomQuery('');
      }
    },
    [customQuery, onAskAI]
  );

  // Handler para ação predefinida
  const handlePredefinedAction = useCallback(
    (action: 'simplify' | 'key_points' | 'example') => {
      const actionText = `Solicitação: ${predefinedActionLabels[action]}`;
      setChatHistory((prev) => [
        ...prev,
        createMessage(actionText, 'user'),
      ]);
      onAskAI('', action);
    },
    [onAskAI]
  );

  // Adiciona resposta da IA ao histórico (evita duplicatas)
  useEffect(() => {
    if (!isLoading && aiResponse && isOpen) {
      setChatHistory((prev) => {
        if (
          prev.length > 0 &&
          prev[prev.length - 1].sender === 'ai' &&
          prev[prev.length - 1].text === aiResponse
        ) {
          return prev;
        }
        return [...prev, createMessage(aiResponse, 'ai')];
      });
    }
  }, [aiResponse, isLoading, isOpen]);

  // Adiciona erro ao histórico (evita duplicatas)
  useEffect(() => {
    if (!isLoading && aiError && isOpen) {
      setChatHistory((prev) => {
        if (
          prev.length > 0 &&
          prev[prev.length - 1].sender === 'error' &&
          prev[prev.length - 1].text === aiError
        ) {
          return prev;
        }
        return [...prev, createMessage(aiError, 'error')];
      });
    }
  }, [aiError, isLoading, isOpen]);

  // Scroll automático
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Evita renderização do modal quando fechado
  if (!isOpen && !isAnimatingIn) return null;

  const itemTitleDisplay =
    currentItem.title.split('.').slice(1).join('.').trim() ||
    currentItem.title;

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-out ${
        isOpen && isAnimatingIn
          ? 'bg-opacity-50'
          : 'bg-opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-assistant-title"
      tabIndex={-1}
    >
      <div
        className={`
          bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col
          transform transition-all duration-300 ease-out
          ${isOpen && isAnimatingIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <h2
            id="ai-assistant-title"
            className="text-xl font-semibold text-gray-800"
          >
            Assistente IA ✨{' '}
            <span className="text-sm font-normal text-gray-500">
              - {itemTitleDisplay}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 active:text-gray-800 active:scale-90 transition-all duration-150 text-3xl"
            aria-label="Fechar modal do assistente IA"
            type="button"
          >
            &times;
          </button>
        </div>

        <div className="mb-4 space-y-2 sm:space-y-0 sm:flex sm:gap-2">
          <button
            onClick={() => handlePredefinedAction('simplify')}
            disabled={isLoading}
            className="w-full sm:w-auto flex-1 px-4 py-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 active:bg-blue-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            type="button"
          >
            {predefinedActionLabels.simplify}
          </button>
          <button
            onClick={() => handlePredefinedAction('key_points')}
            disabled={isLoading}
            className="w-full sm:w-auto flex-1 px-4 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 active:bg-green-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            type="button"
          >
            {predefinedActionLabels.key_points}
          </button>
          <button
            onClick={() => handlePredefinedAction('example')}
            disabled={isLoading}
            className="w-full sm:w-auto flex-1 px-4 py-2 text-xs font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 active:bg-purple-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            type="button"
          >
            {predefinedActionLabels.example}
          </button>
        </div>

        <form onSubmit={handleCustomQuerySubmit} className="mb-4">
          <textarea
            ref={textareaRef}
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Ou faça uma pergunta específica sobre este tópico..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm"
            rows={2}
            disabled={isLoading}
            aria-label="Digite sua pergunta para o assistente IA"
          />
          <button
            type="submit"
            disabled={isLoading || !customQuery.trim()}
            className="mt-2 w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? 'Perguntando...' : 'Perguntar'}
          </button>
        </form>

        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 min-h-[200px] chat-bubble-container custom-scrollbar"
          aria-live="polite"
        >
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.sender}`}
              aria-label={`Mensagem de ${
                msg.sender === 'user'
                  ? 'você'
                  : msg.sender === 'ai'
                  ? 'Assistente IA'
                  : 'Erro'
              }: ${msg.text}`}
            >
{msg.text.split('\n').map((line, index) => (
  <Fragment key={index}>
    {line}
    {index < msg.text.split('\n').length - 1 && <br />}
  </Fragment>
))}
            </div>
          ))}
          {isLoading &&
            chatHistory.length > 0 &&
            chatHistory[chatHistory.length - 1].sender === 'user' && (
              <div className="flex items-center self-start p-2 chat-bubble ai opacity-75">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-2 text-gray-600 text-sm">Processando...</p>
              </div>
            )}
          {chatHistory.length === 0 && !isLoading && (
            <p className="text-gray-500 text-center text-sm italic py-4">
              O assistente aguarda sua pergunta ou comando.
            </p>
          )}
        </div>
        <footer className="mt-4 pt-4 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 active:bg-gray-400 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
            type="button"
          >
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AIAssistantModal;
