import { useState } from 'react';

interface UseAudioSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

const useAudioSynthesis = (options: UseAudioSynthesisOptions = {}) => {
  const { rate = 1, pitch = 1, volume = 1, lang = 'en-US' } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const speak = (text: string, customOptions?: UseAudioSynthesisOptions) => {
    if (!isSupported) return;

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

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsSynthesizing(false);
  };

  const pause = () => {
    if (!isSupported) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (!isSupported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  return {
    speak,
    stop,
    pause,
    resume,
    isPlaying,
    isSynthesizing,
    isSupported
  };
};

export default useAudioSynthesis;
