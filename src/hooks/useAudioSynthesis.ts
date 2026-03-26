import { useCallback, useRef, useState } from 'react';

interface UseAudioSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

const useAudioSynthesis = (options: UseAudioSynthesisOptions = {}) => {
  const { rate = 1, pitch = 1, volume = 1, lang = 'en-US' } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string, customOptions?: UseAudioSynthesisOptions) => {
      // Cancel any existing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = customOptions?.rate ?? rate;
      utterance.pitch = customOptions?.pitch ?? pitch;
      utterance.volume = customOptions?.volume ?? volume;
      utterance.lang = customOptions?.lang ?? lang;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsSynthesizing(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsSynthesizing(false);
      };

      utterance.onerror = event => {
        console.error('[useAudioSynthesis] Speech synthesis error:', event.error);
        setIsPlaying(false);
        setIsSynthesizing(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [rate, pitch, volume, lang]
  );

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsSynthesizing(false);
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isPlaying,
    isSynthesizing,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window
  };
};

export default useAudioSynthesis;
