// src/hooks/useTimer.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerMode = 'focus' | 'break';

interface UseTimerProps {
  defaultFocusMinutes?: number;
  defaultBreakMinutes?: number;
}

const INACTIVITY_TIMEOUT_DURATION_MS = 5 * 60 * 1000;

export default function useTimer({
  defaultFocusMinutes = 25,
  defaultBreakMinutes = 5,
}: UseTimerProps = {}) {
  const [focusDurationMinutes, setFocusDurationMinutes] =
    useState(defaultFocusMinutes);
  const [breakDurationMinutes, setBreakDurationMinutes] =
    useState(defaultBreakMinutes);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState(
    defaultFocusMinutes * 60,
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimerMode, setCurrentTimerMode] = useState<TimerMode>('focus');

  const timerIntervalIdRef = useRef<number | null>(null);
  const inactivityTimerIdRef = useRef<number | null>(null);

  const getInitialTime = useCallback(
    (mode: TimerMode) =>
      (mode === 'focus' ? focusDurationMinutes : breakDurationMinutes) * 60,
    [focusDurationMinutes, breakDurationMinutes],
  );

  const updateDocumentTitle = useCallback(() => {
    let title = 'Estudos TDAH Friendly';
    if (isTimerRunning || timerSecondsRemaining > 0) {
      const m = Math.floor(timerSecondsRemaining / 60)
        .toString()
        .padStart(2, '0');
      const s = (timerSecondsRemaining % 60).toString().padStart(2, '0');
      title = `${isTimerRunning ? '' : '(Pausado) '}${m}:${s} - Estudos TDAH Friendly`;
    }
    document.title = title;
  }, [isTimerRunning, timerSecondsRemaining]);

  const autoPauseFocusTimer = useCallback(() => {
    if (timerIntervalIdRef.current) {
      clearInterval(timerIntervalIdRef.current);
      timerIntervalIdRef.current = null;
    }
    if (inactivityTimerIdRef.current) {
      clearTimeout(inactivityTimerIdRef.current);
      inactivityTimerIdRef.current = null;
    }
    setIsTimerRunning(false);
    updateDocumentTitle();
  }, [updateDocumentTitle]);

  const resetTimer = useCallback(() => {
    if (timerIntervalIdRef.current) {
      clearInterval(timerIntervalIdRef.current);
      timerIntervalIdRef.current = null;
    }
    if (inactivityTimerIdRef.current) {
      clearTimeout(inactivityTimerIdRef.current);
      inactivityTimerIdRef.current = null;
    }
    setIsTimerRunning(false);
    setCurrentTimerMode('focus');
    setTimerSecondsRemaining(getInitialTime('focus'));
    updateDocumentTitle();
  }, [getInitialTime, updateDocumentTitle]);

  const startTimer = useCallback(
    (mode: TimerMode) => {
      if (timerIntervalIdRef.current) {
        clearInterval(timerIntervalIdRef.current);
        timerIntervalIdRef.current = null;
      }
      if (inactivityTimerIdRef.current) {
        clearTimeout(inactivityTimerIdRef.current);
        inactivityTimerIdRef.current = null;
      }

      setCurrentTimerMode(mode);
      setTimerSecondsRemaining(getInitialTime(mode));
      setIsTimerRunning(true);
      updateDocumentTitle();
    },
    [getInitialTime, updateDocumentTitle],
  );

  const pauseTimer = useCallback(() => {
    if (timerIntervalIdRef.current) {
      clearInterval(timerIntervalIdRef.current);
      timerIntervalIdRef.current = null;
    }
    if (inactivityTimerIdRef.current) {
      clearTimeout(inactivityTimerIdRef.current);
      inactivityTimerIdRef.current = null;
    }
    setIsTimerRunning(false);
    updateDocumentTitle();
  }, [updateDocumentTitle]);

  const updateTimerSettings = useCallback(
    (newFocusMinutes: number, newBreakMinutes: number) => {
      setFocusDurationMinutes(newFocusMinutes);
      setBreakDurationMinutes(newBreakMinutes);
      if (!isTimerRunning) {
        setTimerSecondsRemaining(
          currentTimerMode === 'focus'
            ? newFocusMinutes * 60
            : newBreakMinutes * 60,
        );
        updateDocumentTitle();
      }
    },
    [isTimerRunning, currentTimerMode, updateDocumentTitle],
  );

  useEffect(() => {
    if (!isTimerRunning) return;

    timerIntervalIdRef.current = window.setInterval(() => {
      setTimerSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalIdRef.current!);
          timerIntervalIdRef.current = null;
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalIdRef.current) {
        clearInterval(timerIntervalIdRef.current);
      }
    };
  }, [isTimerRunning]);

  useEffect(() => {
    if (isTimerRunning && currentTimerMode === 'focus') {
      inactivityTimerIdRef.current = window.setTimeout(
        autoPauseFocusTimer,
        INACTIVITY_TIMEOUT_DURATION_MS,
      );

      return () => {
        if (inactivityTimerIdRef.current) {
          clearTimeout(inactivityTimerIdRef.current);
        }
      };
    }
  }, [isTimerRunning, currentTimerMode, autoPauseFocusTimer]);

  useEffect(() => {
    updateDocumentTitle();
  }, [updateDocumentTitle, currentTimerMode]);

  const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  const showNotification = (title: string, message: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body: message });
        }
      });
    }
  };

  useEffect(() => {
    if (timerSecondsRemaining === 0) {
      const soundFile =
        currentTimerMode === 'focus' ? 'focus-end.mp3' : 'break-end.mp3';
      playSound(soundFile);
      const notificationTitle =
        currentTimerMode === 'focus' ? 'Fim do foco!' : 'Fim da pausa!';
      const notificationMessage =
        currentTimerMode === 'focus'
          ? 'Hora de descansar!'
          : 'Hora de voltar ao trabalho!';
      showNotification(notificationTitle, notificationMessage);
    }
  }, [timerSecondsRemaining, currentTimerMode]);

  return {
    timerSecondsRemaining,
    isTimerRunning,
    currentTimerMode,
    focusDurationMinutes,
    breakDurationMinutes,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTimerSettings,
    autoPauseFocusTimer,
  };
}

export type ReturnTypeUseTimer = ReturnType<typeof useTimer>;
