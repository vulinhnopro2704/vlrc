import { useRef, useState, useEffect } from 'react';
import { Lipsync, VISEMES } from 'wawa-lipsync';

const useTutor3DLipsync = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lipsyncRef = useRef<Lipsync | null>(null);
  const rafRef = useRef<number | null>(null);
  const liveVisemeRef = useRef<VISEMES>(VISEMES.sil);
  const playbackTokenRef = useRef<number>(0);

  const stopVisemeLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const stopPlayback = () => {
    playbackTokenRef.current += 1;
    stopVisemeLoop();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
    }

    liveVisemeRef.current = VISEMES.sil;
    setIsPlaying(false);
  };

  const runVisemeLoop = (token: number) => {
    if (token !== playbackTokenRef.current) return;

    const manager = lipsyncRef.current;
    if (!manager) return;

    manager.processAudio();
    liveVisemeRef.current = manager.viseme;
    rafRef.current = requestAnimationFrame(() => runVisemeLoop(token));
  };

  const playAudioFromResponse = (audioSrc: string) => {
    stopPlayback();

    const audio = audioRef.current;
    const manager = lipsyncRef.current;

    if (!audio || !manager) return;

    audio.src = audioSrc;
    audio.load();

    const currentToken = playbackTokenRef.current;
    manager.connectAudio(audio);

    audio.onended = () => {
      if (currentToken === playbackTokenRef.current) {
        stopPlayback();
      }
    };

    void audio
      .play()
      .then(() => {
        if (currentToken !== playbackTokenRef.current) {
          audio.pause();
          return;
        }
        setIsPlaying(true);
        rafRef.current = requestAnimationFrame(() => runVisemeLoop(currentToken));
      })
      .catch(() => {
        stopPlayback();
      });
  };

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';

    audioRef.current = audio;
    lipsyncRef.current = new Lipsync();

    return () => {
      playbackTokenRef.current += 1;
      stopPlayback();

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.onended = null;
      }

      lipsyncRef.current = null;
    };
  // eslint-disable-next-deps
  }, []);

  return {
    isPlaying,
    liveVisemeRef,
    playAudioFromResponse,
    stopPlayback
  };
};

export default useTutor3DLipsync;
