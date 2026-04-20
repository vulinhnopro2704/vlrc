import { Lipsync, VISEMES } from 'wawa-lipsync';

const useTutor3DLipsync = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lipsyncRef = useRef<Lipsync | null>(null);
  const rafRef = useRef<number | null>(null);
  const objectUrlRef = useRef<string>('');
  const liveVisemeRef = useRef<VISEMES>(VISEMES.sil);
  const playbackTokenRef = useRef<number>(0);

  const selectedFileName = audioFile?.name ?? '';

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

  const playAudio = () => {
    const audio = audioRef.current;
    const manager = lipsyncRef.current;

    if (!audio || !manager || !audio.src) return;

    stopPlayback();

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

  useMount(() => {
    const audio = new Audio();
    audio.preload = 'auto';

    audioRef.current = audio;
    lipsyncRef.current = new Lipsync();
  });

  useEffect(() => {
    if (!audioRef.current) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = '';
    }

    if (!audioFile) {
      audioRef.current.src = '';
      stopPlayback();
      return;
    }

    const url = URL.createObjectURL(audioFile);
    objectUrlRef.current = url;
    audioRef.current.src = url;
    audioRef.current.load();
    stopPlayback();
  }, [audioFile, stopPlayback]);

  useUnmount(() => {
    playbackTokenRef.current += 1;
    stopPlayback();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.onended = null;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    lipsyncRef.current = null;
  });

  return {
    isPlaying,
    selectedFileName,
    liveVisemeRef,
    playAudio,
    stopPlayback,
    setAudioFile
  };
};

export default useTutor3DLipsync;
