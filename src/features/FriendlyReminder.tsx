/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, FC } from 'react';

interface FriendlyReminderProps {
  onDismiss: () => void;
}

const reminderMessages = [
  "Sua AFO está sentindo sua falta! 🥺 Que tal um reencontro produtivo hoje?",
  "O Tópico 'Orçamento Público' me disse que você prometeu voltar... Ele ainda está esperando por você! 😉",
  "Alerta de fofura: seus pontos de estudo estão se sentindo sozinhos! Venha dar um 'oi' e acumular mais! ✨",
  "A LRF não vai se estudar sozinha, e seu cérebro adora um desafio! Bora dominar mais um conceito? 🚀",
  "Pssst... Ouvi dizer que revisar aquele resuminho de Contabilidade Pública pode render uns pontinhos extras hoje! 🧐",
  "Seu futuro eu, aprovado(a) e especialista em AFO, mandou um recado: 'Não desista agora!' 💪",
  "Lembrete amigável: até os maiores especialistas em AFO começaram com o primeiro Pomodoro. Qual será o seu de hoje? 🍅"
];

export const FriendlyReminder: FC<FriendlyReminderProps> = ({ onDismiss }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setCurrentMessage(reminderMessages[Math.floor(Math.random() * reminderMessages.length)]);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        mb-8 p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white
        rounded-2xl shadow-xl
        transition-all duration-500 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'}
        max-w-2xl mx-auto
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <span role="img" aria-hidden="true" className="mr-2 text-2xl">👋</span>
            E aí, Mestre(a) da AFO!
          </h3>
          <p className="text-sm mb-4 opacity-90">{currentMessage}</p>
        </div>
        <button
          onClick={onDismiss}
          className="ml-0 sm:ml-4 text-xs bg-white/25 hover:bg-white/40 active:bg-white/50 text-white font-semibold py-1.5 px-4 rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-purple-600 active:scale-95 shrink-0"
          aria-label="Dispensar lembrete de inatividade"
        >
          Ok, entendi!
        </button>
      </div>
    </div>
  );
};