import { Lipsync, VISEMES } from 'wawa-lipsync';

const useTutor3DLipsync = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lipsyncRef = useRef<Lipsync | null>(null);
  const rafRef = useRef<number | null>(null);
  const objectUrlRef = useRef<string>('');
  const liveVisemeRef = useRef<VISEMES>(VISEMES.sil);

  const selectedFileName = audioFile?.name ?? '';

  const stopVisemeLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const stopPlayback = () => {
    stopVisemeLoop();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
    }

    liveVisemeRef.current = VISEMES.sil;
    setIsPlaying(false);
  };

  const runVisemeLoop = () => {
    const manager = lipsyncRef.current;
    if (!manager) return;

    manager.processAudio();
    liveVisemeRef.current = manager.viseme;
    rafRef.current = requestAnimationFrame(runVisemeLoop);
  };

  const playAudio = () => {
    const audio = audioRef.current;
    const manager = lipsyncRef.current;

    if (!audio || !manager || !audio.src) return;

    stopPlayback();
    manager.connectAudio(audio);

    audio.onended = () => {
      stopPlayback();
    };

    void audio
      .play()
      .then(() => {
        setIsPlaying(true);
        rafRef.current = requestAnimationFrame(runVisemeLoop);
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
  }, [audioFile]);

  useUnmount(() => {
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
