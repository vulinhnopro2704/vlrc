import { Lipsync, VISEMES } from 'wawa-lipsync';

const CUE_VISEME_MAP: Record<string, VISEMES> = {
  A: VISEMES.PP,
  B: VISEMES.aa,
  C: VISEMES.E,
  D: VISEMES.aa,
  E: VISEMES.E,
  F: VISEMES.U,
  G: VISEMES.O,
  H: VISEMES.I,
  X: VISEMES.sil
};

const toCueSeconds = (value: number, unitDivisor: number) => value / unitDivisor;

const normalizeLipSyncCues = (cues: Tutor3DManagement.TutorLipSyncCue[] | null) => {
  if (!cues || cues.length === 0) {
    return [] as Array<{ start: number; end: number; viseme: VISEMES }>;
  }

  const maxValue = Math.max(...cues.flatMap(cue => [cue.start, cue.end]));
  const unitDivisor = maxValue > 50 ? 1000 : 1;

  return cues
    .map(cue => {
      const viseme = CUE_VISEME_MAP[String(cue.value).trim().toUpperCase()] ?? VISEMES.aa;
      return {
        start: toCueSeconds(cue.start, unitDivisor),
        end: toCueSeconds(cue.end, unitDivisor),
        viseme
      };
    })
    .filter(cue => cue.end > cue.start);
};

const useTutor3DLipsync = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lipsyncRef = useRef<Lipsync | null>(null);
  const rafRef = useRef<number | null>(null);
  const objectUrlRef = useRef<string>('');
  const liveVisemeRef = useRef<VISEMES>(VISEMES.sil);
  const playbackTokenRef = useRef<number>(0);
  const apiCueTimelineRef = useRef<Array<{ start: number; end: number; viseme: VISEMES }>>([]);
  const shouldAutoPlayRef = useRef<boolean>(false);

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
    const audio = audioRef.current;
    const cueTimeline = apiCueTimelineRef.current;

    if (cueTimeline.length > 0 && audio) {
      const currentTime = audio.currentTime;
      const activeCue = cueTimeline.find(cue => currentTime >= cue.start && currentTime <= cue.end);
      liveVisemeRef.current = activeCue?.viseme ?? VISEMES.sil;
    } else {
      if (!manager) return;
      manager.processAudio();
      liveVisemeRef.current = manager.viseme;
    }

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

  const setAudioFileAndPlay = (file: File) => {
    shouldAutoPlayRef.current = true;
    setAudioFile(file);
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

    if (!shouldAutoPlayRef.current) {
      return;
    }

    const audioElement = audioRef.current;
    const handleCanPlay = () => {
      audioElement.removeEventListener('canplaythrough', handleCanPlay);
      if (shouldAutoPlayRef.current) {
        shouldAutoPlayRef.current = false;
        playAudio();
      }
    };

    if (audioElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      shouldAutoPlayRef.current = false;
      playAudio();
      return;
    }

    audioElement.addEventListener('canplaythrough', handleCanPlay);

    return () => {
      audioElement.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, [audioFile, stopPlayback]);

  const setLipSyncCues = (cues: Tutor3DManagement.TutorLipSyncCue[] | null) => {
    apiCueTimelineRef.current = normalizeLipSyncCues(cues);
  };

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
    setAudioFile,
    setAudioFileAndPlay,
    setLipSyncCues
  };
};

export default useTutor3DLipsync;
