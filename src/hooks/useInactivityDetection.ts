// src/hooks/useInactivityDetection.ts
import { useEffect, useRef, useCallback, Dispatch, SetStateAction } from 'react';

const INACTIVITY_TIMEOUT_DURATION_MS = 5 * 60 * 1000;
const TAB_SWITCH_THRESHOLD = 3;
const REMINDER_DURATION_MS = 5000;

const focusReminderMessages = [
  "Lembre-se do seu foco! Você consegue! 💪",
  "Mantenha o foco, você está quase lá! 🚀",
  "Concentre-se na sua tarefa atual. Pequenos passos levam a grandes vitórias! ✨",
  "Evite distrações! Sua concentração agradece. 😉",
  "Foco total no Pomodoro! Sua AFO merece atenção exclusiva agora. 📚"
];

interface UseInactivityDetectionProps {
  isTimerRunning: boolean;
  currentTimerMode: 'focus' | 'break';
  autoPauseFocusTimer: () => void;
  setShowTabSwitchReminder: Dispatch<SetStateAction<boolean>>;
  setTabSwitchReminderMessage: Dispatch<SetStateAction<string>>;
}

export default function useInactivityDetection({
  isTimerRunning,
  currentTimerMode,
  autoPauseFocusTimer,
  setShowTabSwitchReminder,
  setTabSwitchReminderMessage,
}: UseInactivityDetectionProps) {
  const inactivityTimerIdRef = useRef<number | null>(null);
  const reminderTimeoutRef = useRef<number | null>(null);
  const focusModeTabSwitchCountRef = useRef(0);

  const getRandomReminderMessage = () =>
    focusReminderMessages[Math.floor(Math.random() * focusReminderMessages.length)];

  const resetInactivityDetection = useCallback(() => {
    if (inactivityTimerIdRef.current) {
      clearTimeout(inactivityTimerIdRef.current);
    }
    if (isTimerRunning && currentTimerMode === 'focus') {
      inactivityTimerIdRef.current = window.setTimeout(() => {
        autoPauseFocusTimer();
        console.debug('[Inatividade] Timer pausado por ausência de interação.');
      }, INACTIVITY_TIMEOUT_DURATION_MS);
    }
  }, [isTimerRunning, currentTimerMode, autoPauseFocusTimer]);

  useEffect(() => {
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    if (isTimerRunning && currentTimerMode === 'focus') {
      activityEvents.forEach(event => document.addEventListener(event, resetInactivityDetection));
      resetInactivityDetection();
    } else {
      if (inactivityTimerIdRef.current) clearTimeout(inactivityTimerIdRef.current);
    }

    return () => {
      activityEvents.forEach(event => document.removeEventListener(event, resetInactivityDetection));
      if (inactivityTimerIdRef.current) clearTimeout(inactivityTimerIdRef.current);
    };
  }, [isTimerRunning, currentTimerMode, resetInactivityDetection]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isTimerRunning || currentTimerMode !== 'focus') return;

      if (document.hidden) {
        focusModeTabSwitchCountRef.current += 1;
        autoPauseFocusTimer();
      } else {
        if (focusModeTabSwitchCountRef.current >= TAB_SWITCH_THRESHOLD) {
          const message = getRandomReminderMessage();
          setTabSwitchReminderMessage(message);
          setShowTabSwitchReminder(true);

          if (reminderTimeoutRef.current) clearTimeout(reminderTimeoutRef.current);
          reminderTimeoutRef.current = window.setTimeout(() => {
            setShowTabSwitchReminder(false);
          }, REMINDER_DURATION_MS);
        }
        focusModeTabSwitchCountRef.current = 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (reminderTimeoutRef.current) clearTimeout(reminderTimeoutRef.current);
    };
  }, [isTimerRunning, currentTimerMode, autoPauseFocusTimer, setShowTabSwitchReminder, setTabSwitchReminderMessage]);
}
