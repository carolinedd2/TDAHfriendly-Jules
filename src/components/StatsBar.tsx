import React from 'react';
import { getValidatedTailwindColorClasses } from '../utils/getTailwindColorClasses';

interface StatsBarProps {
  timerMode: 'focus' | 'break';
  timerSecondsRemaining: number;
  isTimerRunning: boolean;
  onStartTimer: (mode: 'focus' | 'break') => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  score: number;
  streak: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  timerMode,
  timerSecondsRemaining,
  isTimerRunning,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  score,
  streak,
}) => {
  const minutes = Math.floor(timerSecondsRemaining / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timerSecondsRemaining % 60).toString().padStart(2, '0');

  const modeColor = timerMode === 'focus' ? 'purple' : 'green';
  const { bgColor, textColor, bgSoft, ringColor } =
    getValidatedTailwindColorClasses(modeColor);

  return (
    <div
      className={`flex items-center justify-between rounded-xl px-6 py-4 shadow-md transition duration-300 ease-in-out
      ${bgColor} text-white ${ringColor} ${isTimerRunning ? 'animate-pulse' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">⏳</span>
        <div className="text-sm">
          <div className="uppercase font-semibold tracking-widest text-xs opacity-70">
            Modo
          </div>
          <div className={`font-bold text-lg ${textColor}`}>
            {timerMode === 'focus' ? 'Foco' : 'Pausa'}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-xs uppercase tracking-widest opacity-80">
          Tempo restante
        </div>
        <div className="font-mono text-2xl">
          {minutes}:{seconds}
        </div>
        {isTimerRunning ? (
          <button
            onClick={onPauseTimer}
            className="mt-1 text-xs px-3 py-1 bg-white text-purple-700 font-semibold rounded hover:bg-purple-100 transition"
          >
            Pausar
          </button>
        ) : (
          <button
            onClick={() => onStartTimer(timerMode)}
            className="mt-1 text-xs px-3 py-1 bg-white text-purple-700 font-semibold rounded hover:bg-purple-100 transition"
          >
            Iniciar
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-xs font-bold tracking-wide uppercase">XP</div>
          <div className="text-xl font-mono">{score}</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold uppercase text-yellow-300">🔥 Combo</div>
          <div className="text-xl font-mono">{streak}</div>
        </div>
        <button
          onClick={onResetTimer}
          className="ml-4 text-xs bg-red-100 text-red-600 font-semibold px-3 py-1 rounded hover:bg-red-200 transition"
        >
          Resetar
        </button>
        <div className={`w-full mt-2 h-1.5 rounded-full overflow-hidden ${bgSoft}`}>
  <div
    className={`${bgColor} h-1.5 rounded-full transition-all duration-500 ease-out`}
    style={{ width: `${(1 - timerSecondsRemaining / (timerMode === 'focus' ? 1500 : 300)) * 100}%` }}
    role="progressbar"
    aria-label="Barra de progresso do Pomodoro"
  />
</div>
      </div>
    </div>
  );
};
