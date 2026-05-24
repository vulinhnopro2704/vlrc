import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { 
  useScenariosQuery, 
  useStartRoleplayMutation, 
  useChatRoleplayMutation,
  useChatVoiceRoleplayMutation,
  useSessionHistoryQuery,
  useSessionDetailsQuery,
  useTranslateMessageMutation,
  useSuggestRepliesMutation
} from '@/api/roleplay-management';

export const useRolePlaySession = (
  playAudioFromResponse: (url: string) => void,
  stopPlayback: () => void
) => {
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<'practice' | 'history'>('practice');
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeSession, setActiveSession] = useState<RoleplayManagement.ActiveSession | null>(null);
  const [inputText, setInputText] = useState('');
  const [showCorrectionIds, setShowCorrectionIds] = useState<string[]>([]);
  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const { data: scenarios, isLoading: isScenariosLoading } = useScenariosQuery();
  const { data: historyItems, isLoading: isHistoryLoading, refetch: refetchHistory } = useSessionHistoryQuery();
  const { data: historyDetails, isLoading: isHistoryDetailsLoading } = useSessionDetailsQuery(
    selectedHistorySessionId ?? '',
    !!selectedHistorySessionId
  );

  const startMutation = useStartRoleplayMutation();
  const chatMutation = useChatRoleplayMutation();
  const chatVoiceMutation = useChatVoiceRoleplayMutation();
  const translateMutation = useTranslateMessageMutation();
  const suggestRepliesMutation = useSuggestRepliesMutation();

  useEffect(() => {
    if (activeTab === 'history') {
      refetchHistory();
    }
  }, [activeTab, refetchHistory]);

  useEffect(() => {
    if (historyDetails) {
      const mappedMessages: RoleplayManagement.ActiveMessage[] = [];
      mappedMessages.push({
        id: `ai-intro-title-history`,
        role: 'AI',
        text: `Hi! Let's practice English through this role-play scenario: **${historyDetails.scenario.title}**.`
      });
      mappedMessages.push({
        id: `ai-intro-context-history`,
        role: 'AI',
        text: `Here is the scenario context:\n"${historyDetails.scenario.description}"\n\n- **Your Role**: ${historyDetails.scenario.userPersona}\n- **My Role**: ${historyDetails.scenario.aiPersona}\n\nLet's begin!`
      });
      historyDetails.messages.forEach((m) => {
        mappedMessages.push({
          id: m.id,
          role: m.role === 'user' ? 'You' : 'AI',
          text: m.content,
          audioUrl: m.audioUrl,
          translation: m.translation,
          grammarCorrection: m.grammarFeedback
        });
      });

      setTimeout(() => {
        setActiveSession({
          sessionId: historyDetails.id,
          scenario: historyDetails.scenario,
          messages: mappedMessages,
          taskEvaluation: {
            task_1_completed: historyDetails.sessionEvaluation?.task1Completed ?? false,
            task_2_completed: historyDetails.sessionEvaluation?.task2Completed ?? false,
            task_3_completed: historyDetails.sessionEvaluation?.task3Completed ?? false
          },
          scenarioCompleted: false,
          isReadOnly: true,
          cumulativeGrammarFeedback: (historyDetails.sessionEvaluation?.grammarFeedback as string[]) ?? []
        });
      }, 0);
    }
  }, [historyDetails]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
    }
    silenceStartRef.current = null;
  };

  const monitorSilence = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(dataArray);

    let isSilent = true;
    for (let i = 0; i < dataArray.length; i++) {
      if (Math.abs(dataArray[i] - 128) > 5) {
        isSilent = false;
        break;
      }
    }

    if (isSilent) {
      if (silenceStartRef.current === null) {
        // eslint-disable-next-line react-hooks/purity
        silenceStartRef.current = Date.now();
      // eslint-disable-next-line react-hooks/purity
      } else if (Date.now() - silenceStartRef.current > 3000) {
        toast.info('Tự động dừng ghi âm do không có tiếng động.', { id: 'vad-toast' });
        stopRecording();
        return;
      }
    } else {
      silenceStartRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      animationFrameRef.current = requestAnimationFrame(monitorSilence);
    }
  };

  const startRecording = async () => {
    try {
      stopPlayback();
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

      let mediaRecorder: MediaRecorder;
      try {
        const options: MediaRecorderOptions = mimeType ? { mimeType, audioBitsPerSecond: 16000 } : { audioBitsPerSecond: 16000 };
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        console.warn('MediaRecorder with strict options failed. Falling back to default', e);
        const fallbackOptions = mimeType ? { mimeType } : undefined;
        mediaRecorder = new MediaRecorder(stream, fallbackOptions);
      }

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          const exactMimeType = (mediaRecorder.mimeType || 'audio/webm').split(';')[0].trim();
          void handleSendVoice(base64data, exactMimeType);
        };
      };

      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      silenceStartRef.current = null;
      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(monitorSilence);
      }, 100);
      
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Microphone Access Error:', error);
      toast.error(`Lỗi Microphone: ${error?.name || error?.message || 'Không rõ nguyên nhân'}`);
    }
  };

  const handleSendVoice = async (audioBase64: string, mimeType: string) => {
    if (!activeSession || chatVoiceMutation.isPending) return;

    const tempUserMsgId = `user-voice-${Date.now()}`;
    try {
      stopPlayback();
      const response = await chatVoiceMutation.mutateAsync({
        sessionId: activeSession.sessionId,
        audioBase64,
        mimeType
      });

      setActiveSession(prev => {
        if (!prev) return null;
        const updatedMessages = [
          ...prev.messages,
          { id: tempUserMsgId, role: 'You' as const, text: response.user_spoken_transcript }
        ];

        const lastUserMsgIdx = updatedMessages.length - 1;
        if (lastUserMsgIdx !== -1 && response.grammar_feedback) {
          updatedMessages[lastUserMsgIdx] = {
            ...updatedMessages[lastUserMsgIdx],
            grammarCorrection: response.grammar_feedback
          };
          const userMsgIdToOpen = updatedMessages[lastUserMsgIdx].id;
          setShowCorrectionIds(curr => [...curr, userMsgIdToOpen]);
        }

        return {
          ...prev,
          messages: [
            ...updatedMessages,
            {
              id: `ai-${Date.now()}`,
              role: 'AI' as const,
              text: response.ai_spoken_response
            }
          ],
          taskEvaluation: response.task_evaluation,
          scenarioCompleted: response.scenario_completed
        };
      });

      if (response.audio?.url && response.audio.status === 'completed') {
        playAudioFromResponse(response.audio.url);
      }
      if (response.scenario_completed) {
        toast.success(t('roleplay_completed_congrats', 'Chúc mừng! Bạn đã hoàn thành xuất sắc tất cả nhiệm vụ!'));
      }
    } catch {
      toast.error('Lỗi nhận diện hoặc tổng hợp giọng nói. Vui lòng thử lại!');
    }
  };

  const handleStartScenario = async (scenario: RoleplayManagement.Scenario) => {
    try {
      stopPlayback();
      const response = await startMutation.mutateAsync({ scenarioId: scenario.id });
      
      setActiveSession({
        sessionId: response.sessionId,
        scenario,
        messages: [
          {
            id: `ai-intro-title-${Date.now()}`,
            role: 'AI',
            text: `Hi! Let's practice English through this role-play scenario: **${scenario.title}**.`
          },
          {
            id: `ai-intro-context-${Date.now()}`,
            role: 'AI',
            text: `Here is the scenario context:\n"${scenario.description}"\n\n- **Your Role**: ${scenario.userPersona}\n- **My Role**: ${scenario.aiPersona}\n\nLet's begin!`
          },
          {
            id: `ai-start-${Date.now()}`,
            role: 'AI',
            text: response.ai_first_message
          }
        ],
        taskEvaluation: {
          task_1_completed: false,
          task_2_completed: false,
          task_3_completed: false
        },
        scenarioCompleted: false
      });
      
      setShowCorrectionIds([]);
      setIsVoiceMode(true);
      toast.success(t('roleplay_started', 'Bắt đầu cuộc trò chuyện nhập vai!'));

      if (response.audio?.url && response.audio.status === 'completed') {
        playAudioFromResponse(response.audio.url);
      }
    } catch {
      // handled
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSession || chatMutation.isPending) return;

    const userMsg = inputText.trim();
    setInputText('');
    const userMsgId = `user-${Date.now()}`;
    
    setActiveSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [
          ...prev.messages,
          { id: userMsgId, role: 'You', text: userMsg }
        ]
      };
    });

    try {
      stopPlayback();
      const response = await chatMutation.mutateAsync({
        sessionId: activeSession.sessionId,
        userMessage: userMsg
      });

      setActiveSession(prev => {
        if (!prev) return null;
        const updatedMessages = [...prev.messages];
        const lastUserMsgIdx = updatedMessages.reduce((lastIdx, msg, idx) => msg.role === 'You' ? idx : lastIdx, -1);
        
        if (lastUserMsgIdx !== -1 && response.grammar_feedback) {
          updatedMessages[lastUserMsgIdx] = {
            ...updatedMessages[lastUserMsgIdx],
            grammarCorrection: response.grammar_feedback
          };
          const userMsgIdToOpen = updatedMessages[lastUserMsgIdx].id;
          setShowCorrectionIds(curr => [...curr, userMsgIdToOpen]);
        }

        return {
          ...prev,
          messages: [
            ...updatedMessages,
            {
              id: `ai-${Date.now()}`,
              role: 'AI',
              text: response.ai_spoken_response
            }
          ],
          taskEvaluation: response.task_evaluation,
          scenarioCompleted: response.scenario_completed
        };
      });

      if (response.audio?.url && response.audio.status === 'completed') {
        playAudioFromResponse(response.audio.url);
      }
      if (response.scenario_completed) {
        toast.success(t('roleplay_completed_congrats', 'Chúc mừng! Bạn đã hoàn thành xuất sắc tất cả nhiệm vụ!'));
      }
    } catch {
      // handled
    }
  };

  const toggleCorrection = (id: string) => {
    setShowCorrectionIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleTranslateMessage = async (messageId: string) => {
    if (!activeSession) return;
    const msg = activeSession.messages.find(m => m.id === messageId);
    if (!msg) return;
    try {
      const { translation } = await translateMutation.mutateAsync({
        sessionId: activeSession.sessionId,
        text: msg.text
      });
      setActiveSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages.map(m => m.id === messageId ? { ...m, translation } : m)
        };
      });
    } catch {
      // toast already handled in mutation
    }
  };

  const handleSuggestReplies = async () => {
    if (!activeSession) return [];
    try {
      const { suggestions } = await suggestRepliesMutation.mutateAsync(activeSession.sessionId);
      return suggestions;
    } catch {
      return [];
    }
  };

  const completedObjectivesCount = activeSession
    ? [
        activeSession.taskEvaluation.task_1_completed,
        activeSession.taskEvaluation.task_2_completed,
        activeSession.taskEvaluation.task_3_completed
      ].filter(Boolean).length
    : 0;

  return {
    state: {
      activeTab,
      isVoiceMode,
      showChatPopup,
      isRecording,
      activeSession,
      inputText,
      showCorrectionIds,
      selectedHistorySessionId,
      completedObjectivesCount,
    },
    queries: {
      scenarios,
      isScenariosLoading,
      historyItems,
      isHistoryLoading,
      isHistoryDetailsLoading
    },
    mutations: {
      isStartPending: startMutation.isPending,
      isChatPending: chatMutation.isPending,
      isVoicePending: chatVoiceMutation.isPending,
      isTranslatePending: translateMutation.isPending,
      isSuggestRepliesPending: suggestRepliesMutation.isPending,
      startVariables: startMutation.variables
    },
    actions: {
      setActiveTab,
      setIsVoiceMode,
      setShowChatPopup,
      setActiveSession,
      setInputText,
      setSelectedHistorySessionId,
      handleStartScenario,
      handleSendMessage,
      startRecording,
      stopRecording,
      toggleCorrection,
      handleTranslateMessage,
      handleSuggestReplies
    }
  };
};
