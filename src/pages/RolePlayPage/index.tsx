import { useState, useRef, useEffect, Suspense } from 'react';
import { 
  useScenariosQuery, 
  useStartRoleplayMutation, 
  useChatRoleplayMutation,
  useChatVoiceRoleplayMutation,
  useSessionHistoryQuery,
  useSessionDetailsQuery
} from '@/api/roleplay-management';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  PlusCircle, 
  MessageCircle, 
  Play, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Award,
  Loader2,
  BookOpen,
  Mic,
  Square,
  History,
  Clock,
  MessageSquare,
  Headphones
} from 'lucide-react';
import CreateScenarioModal from './CreateScenarioModal';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import TutorAvatarRig from '../Tutor3DPage/TutorAvatarRig';
import useTutor3DLipsync from '../Tutor3DPage/useTutor3DLipsync';
import SceneLoader from '../Tutor3DPage/SceneLoader';
import { useTutor3DStore } from '@/stores/tutor-3d';
import { Tutor3DAnimation, Tutor3DFacialExpression } from '@/enums/tutor-3d';

interface ActiveMessage {
  id: string;
  role: 'You' | 'AI';
  text: string;
  grammarCorrection?: string;
}

interface ActiveSession {
  sessionId: string;
  scenario: RoleplayManagement.Scenario;
  messages: ActiveMessage[];
  taskEvaluation: RoleplayManagement.TaskEvaluation;
  scenarioCompleted: boolean;
  isReadOnly?: boolean;
  cumulativeGrammarFeedback?: string[];
}

const RolePlayPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Segment toggle: 'practice' or 'history'
  const [activeTab, setActiveTab] = useState<'practice' | 'history'>('practice');

  // Voice call states
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // States for active session
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [inputText, setInputText] = useState('');
  
  // Track which user message corrections are expanded/toggled open
  const [showCorrectionIds, setShowCorrectionIds] = useState<string[]>([]);

  const { data: scenarios, isLoading } = useScenariosQuery();
  const { data: historyItems, isLoading: isHistoryLoading, refetch: refetchHistory } = useSessionHistoryQuery();

  const startMutation = useStartRoleplayMutation();
  const chatMutation = useChatRoleplayMutation();
  const chatVoiceMutation = useChatVoiceRoleplayMutation();

  // 3D Lipsync Hook & Store
  const { isPlaying, liveVisemeRef, playAudioFromResponse, stopPlayback } = useTutor3DLipsync();
  const cameraDistance = useTutor3DStore(s => s.cameraDistance);
  const { setSelectedAnimation, setSelectedExpression } = useTutor3DStore(s => s.actions);

  // Sync 3D Avatar Animations dynamically based on playback status
  useEffect(() => {
    if (activeSession) {
      if (isPlaying) {
        setSelectedAnimation(Tutor3DAnimation.Talking0);
        setSelectedExpression(Tutor3DFacialExpression.Smile);
      } else {
        setSelectedAnimation(Tutor3DAnimation.Idle);
        setSelectedExpression(Tutor3DFacialExpression.Default);
      }
    }
  }, [isPlaying, activeSession, setSelectedAnimation, setSelectedExpression]);

  // Refetch history when changing tabs to history
  useEffect(() => {
    if (activeTab === 'history') {
      refetchHistory();
    }
  }, [activeTab, refetchHistory]);

  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState<string | null>(null);

  const { data: historyDetails, isLoading: isHistoryDetailsLoading } = useSessionDetailsQuery(
    selectedHistorySessionId ?? '',
    !!selectedHistorySessionId
  );

  useEffect(() => {
    if (historyDetails) {
      const mappedMessages: ActiveMessage[] = [];
      
      // Inject AI welcoming scenario intro cards to maintain structural consistency
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

      // Populate conversation transcripts
      historyDetails.messages.forEach((m) => {
        mappedMessages.push({
          id: m.id,
          role: m.role === 'user' ? 'You' : 'AI',
          text: m.content
        });
      });

      setActiveSession({
        sessionId: historyDetails.id,
        scenario: historyDetails.scenario,
        messages: mappedMessages,
        taskEvaluation: {
          task_1_completed: historyDetails.sessionEvaluation?.task1Completed ?? false,
          task_2_completed: historyDetails.sessionEvaluation?.task2Completed ?? false,
          task_3_completed: historyDetails.sessionEvaluation?.task3Completed ?? false
        },
        scenarioCompleted: false, // Avoid overlay in read-only history
        isReadOnly: true,
        cumulativeGrammarFeedback: (historyDetails.sessionEvaluation?.grammarFeedback as string[]) ?? []
      });
    }
  }, [historyDetails]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages, chatMutation.isPending]);

  // GSAP animations for listing page with explicit fromTo to prevent React re-render opacity freeze
  useGSAP(() => {
    if (isLoading || activeSession) return;
    
    gsap.fromTo('.hero-content', 
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
      }
    );

    gsap.fromTo('.scenario-card', 
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
      }
    );
  }, { dependencies: [isLoading, activeSession], scope: containerRef });

  // Handle starting a scenario
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
      setIsVoiceMode(false);
      toast.success(t('roleplay_started', 'Bắt đầu cuộc trò chuyện nhập vai!'));

      if (response.audio?.url && response.audio.status === 'completed') {
        playAudioFromResponse(response.audio.url);
      }
    } catch (error) {
      // Error is already toasted inside mutation
    }
  };

  // Handle sending a chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSession || chatMutation.isPending) return;

    const userMsg = inputText.trim();
    setInputText('');

    // Append user message locally
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

      // Update session state with backend AI response and real-time evaluations
      setActiveSession(prev => {
        if (!prev) return null;
        
        const updatedMessages = [...prev.messages];
        const lastUserMsgIdx = updatedMessages.reduce((lastIdx, msg, idx) => msg.role === 'You' ? idx : lastIdx, -1);
        
        // Attach the grammar feedback directly to this specific user message bubble
        if (lastUserMsgIdx !== -1 && response.grammar_feedback) {
          updatedMessages[lastUserMsgIdx] = {
            ...updatedMessages[lastUserMsgIdx],
            grammarCorrection: response.grammar_feedback
          };
          
          // Auto-expand/toggle this new grammar correction so they see it immediately
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
    } catch (error) {
      // Error handles in mutation
    }
  };

  // Start Voice Recording
  const startRecording = async () => {
    try {
      stopPlayback();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
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

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error('Không thể truy cập Microphone của thiết bị');
    }
  };

  // Stop Voice Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Process and send recorded voice base64 to backend
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

      // Update session state with the transcribed user message, AI spoken response and task evaluations
      setActiveSession(prev => {
        if (!prev) return null;

        const updatedMessages = [
          ...prev.messages,
          { id: tempUserMsgId, role: 'You' as const, text: response.user_spoken_transcript }
        ];

        const lastUserMsgIdx = updatedMessages.length - 1;
        
        // Attach the grammar feedback directly to this voice user message bubble
        if (lastUserMsgIdx !== -1 && response.grammar_feedback) {
          updatedMessages[lastUserMsgIdx] = {
            ...updatedMessages[lastUserMsgIdx],
            grammarCorrection: response.grammar_feedback
          };
          
          // Auto-expand/toggle this new grammar correction so they see it immediately
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
    } catch (error) {
      toast.error('Lỗi nhận diện hoặc tổng hợp giọng nói. Vui lòng thử lại!');
    }
  };

  const toggleCorrection = (id: string) => {
    setShowCorrectionIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFreeTalk = () => {
    toast.info('Bắt đầu Free Talk (vui lòng truy cập Tutor 3D để trải nghiệm voice trực quan)');
  };

  // Count completed tasks dynamically
  const completedObjectivesCount = activeSession
    ? [
        activeSession.taskEvaluation.task_1_completed,
        activeSession.taskEvaluation.task_2_completed,
        activeSession.taskEvaluation.task_3_completed
      ].filter(Boolean).length
    : 0;

  return (
    <div ref={containerRef} className="h-[calc(100vh-4rem)] overflow-y-auto bg-slate-950 relative text-slate-50 w-full pb-16">
      {/* Background with glassmorphism / liquid feel */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_75%_10%,rgba(99,102,241,0.12),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(15,23,42,0.95),rgba(2,6,23,1))] pointer-events-none' />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {!activeSession ? (
          /* Scenario List View & History List View */
          <>
            <div className="hero-content text-center mb-8 space-y-5 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 tracking-tight">
                {t('roleplay_title')}
              </h1>
              <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
                {t('roleplay_description')}
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 pt-3">
                <Button 
                  size="default" 
                  onClick={() => setIsModalOpen(true)} 
                  className="gap-2 bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white rounded-full px-5 transition-all text-sm"
                >
                  <PlusCircle size={18} />
                  {t('roleplay_create_scenario')}
                </Button>
                <Button 
                  size="default" 
                  variant="secondary" 
                  onClick={handleFreeTalk} 
                  className="gap-2 rounded-full px-5 bg-slate-900/60 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm"
                >
                  <MessageCircle size={18} />
                  {t('roleplay_free_talk')}
                </Button>
              </div>
            </div>

            {/* Premium segmented control switch */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-900/80 border border-slate-800/85 p-1 rounded-2xl flex gap-1 backdrop-blur-md shadow-inner">
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'practice'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <MessageSquare size={15} />
                  Kịch bản nhập vai
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'history'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <Clock size={15} />
                  Lịch sử luyện tập
                </button>
              </div>
            </div>

            {activeTab === 'practice' ? (
              /* Scenario Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-52 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800/40" />
                  ))
                ) : (
                  scenarios?.map((scenario) => (
                    <Card 
                      key={scenario.id} 
                      className="scenario-card bg-slate-900/70 backdrop-blur-md border border-slate-800/80 hover:border-indigo-500/80 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all duration-300 group rounded-2xl"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {scenario.title}
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-2 line-clamp-3 leading-relaxed text-sm">
                          {scenario.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="flex flex-wrap gap-2">
                          {scenario.level && (
                            <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                              {t('roleplay_scenario_level', { level: scenario.level })}
                            </span>
                          )}
                          {scenario.topic && (
                            <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                              {scenario.topic}
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button 
                          disabled={startMutation.isPending}
                          className="w-full gap-2 bg-slate-800/80 border border-slate-700/50 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 text-slate-200 transition-all rounded-xl" 
                          onClick={() => handleStartScenario(scenario)}
                        >
                          {startMutation.isPending && startMutation.variables?.scenarioId === scenario.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Play size={16} />
                          )}
                          {t('roleplay_scenario_start')}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              /* History Sessions Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {isHistoryLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-52 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800/40" />
                  ))
                ) : !historyItems || historyItems.length === 0 ? (
                  <div className="col-span-full text-center py-20 bg-slate-900/20 border border-slate-800/60 rounded-3xl backdrop-blur-md space-y-4">
                    <History size={48} className="text-slate-600 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-300">Chưa có lịch sử học tập</h3>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto">Hãy chọn một kịch bản luyện nói để lưu giữ nhật ký học tập và xem phân tích sửa lỗi ngữ pháp nhé!</p>
                  </div>
                ) : (
                  historyItems.map((item) => {
                    const completedTasks = [
                      item.sessionEvaluation?.task1Completed,
                      item.sessionEvaluation?.task2Completed,
                      item.sessionEvaluation?.task3Completed
                    ].filter(Boolean).length;

                    const dateStr = item.startedAt 
                      ? new Date(item.startedAt).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A';

                    return (
                      <Card 
                        key={item.id} 
                        className="bg-slate-900/70 border border-slate-800/80 rounded-2xl shadow-xl hover:border-indigo-500/40 transition-all duration-300"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                              <Clock size={12} />
                              {dateStr}
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                              item.status === 'completed' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {item.status === 'completed' ? 'Hoàn thành' : 'Đang học'}
                            </span>
                          </div>
                          <CardTitle className="text-lg font-bold text-slate-200 mt-2 line-clamp-1">{item.scenario.title}</CardTitle>
                          <CardDescription className="text-xs text-slate-400 flex items-center gap-1 pt-1 font-medium">
                            Vai diễn: <strong>{item.scenario.userPersona}</strong>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="flex items-center justify-between text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                            <span className="text-slate-400 font-medium">Nhiệm vụ đạt được:</span>
                            <span className="font-bold text-indigo-400">{completedTasks}/3 mục tiêu</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="secondary"
                            className="w-full gap-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs"
                            onClick={() => setSelectedHistorySessionId(item.id)}
                            disabled={isHistoryDetailsLoading && selectedHistorySessionId === item.id}
                          >
                            {isHistoryDetailsLoading && selectedHistorySessionId === item.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <History size={14} />
                            )}
                            Xem lại hội thoại
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </>
        ) : (
          /* Active Interactive Role-Play Chat Session - FULL WIDTH */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6rem)] overflow-hidden items-stretch relative">
            
            {/* Left: Chat Container - TAKES UP FULL 12 COLUMNS */}
            <div className="lg:col-span-12 flex flex-col h-full bg-slate-900/50 border border-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl relative">
              
              {/* Active Session Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      stopPlayback();
                      setSelectedHistorySessionId(null);
                      setActiveSession(null);
                    }}
                    className="hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-full"
                  >
                    <ArrowLeft size={18} />
                  </Button>
                  <div>
                    <h2 className="text-sm sm:text-lg font-bold text-slate-100 line-clamp-1">{activeSession.scenario.title}</h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {activeSession.isReadOnly ? (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                          Xem lại lịch sử (Chỉ đọc)
                        </span>
                      ) : isVoiceMode ? (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Đang gọi thoại 1-1
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                          Đang nhắn tin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Clean Floating Quick Info Popovers */}
                <div className="flex items-center gap-2 sm:gap-3">
                  
                  {/* Segmented Mode Toggle (Only when writeable) */}
                  {!activeSession.isReadOnly && (
                    <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-xl flex shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          stopPlayback();
                          setIsVoiceMode(false);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
                          !isVoiceMode
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <MessageSquare size={12} />
                        <span className="hidden sm:inline">Trò chuyện</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          stopPlayback();
                          setIsVoiceMode(true);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition-all ${
                          isVoiceMode
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Headphones size={12} />
                        <span className="hidden sm:inline">Gọi thoại</span>
                      </button>
                    </div>
                  )}

                  {/* Cumulative Grammar Errors (Only in read-only review) */}
                  {activeSession.isReadOnly && activeSession.cumulativeGrammarFeedback && activeSession.cumulativeGrammarFeedback.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300 gap-1.5 text-xs rounded-xl hover:bg-slate-800 shrink-0"
                        >
                          <Sparkles size={13} />
                          <span className="hidden xs:inline">Tổng hợp lỗi ({activeSession.cumulativeGrammarFeedback.length})</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-slate-900/95 border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl backdrop-blur-md max-h-80 overflow-y-auto">
                        <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-1.5">
                          <Sparkles size={16} className="animate-pulse" />
                          Tổng Hợp Lỗi Ngữ Pháp
                        </h3>
                        <div className="space-y-2.5">
                          {activeSession.cumulativeGrammarFeedback.map((err, idx) => (
                            <div key={idx} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-200 leading-relaxed">
                              <span className="font-bold text-amber-400">Lỗi #{idx + 1}: </span>
                              {err}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  
                  {/* Scenario Context Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-slate-900 border-slate-800 text-indigo-400 hover:text-indigo-300 gap-1 sm:gap-1.5 text-xs rounded-xl hover:bg-slate-800 transition-colors shrink-0"
                      >
                        <BookOpen size={14} />
                        <span className="hidden sm:inline">Ngữ cảnh</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-slate-900/95 border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl backdrop-blur-md">
                      <h3 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
                        <BookOpen size={16} />
                        Ngữ Cảnh Nhập Vai
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 mb-3">
                        "{activeSession.scenario.description}"
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-indigo-950/20 border border-indigo-900/30 p-2.5 rounded-xl">
                          <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">AI đóng vai</div>
                          <div className="text-xs font-semibold text-slate-100 mt-1">{activeSession.scenario.aiPersona}</div>
                        </div>
                        <div className="bg-purple-950/20 border border-purple-900/30 p-2.5 rounded-xl">
                          <div className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Bạn đóng vai</div>
                          <div className="text-xs font-semibold text-slate-100 mt-1">{activeSession.scenario.userPersona}</div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Required Tasks objectives Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-slate-900 border-slate-800 text-emerald-400 hover:text-emerald-300 gap-1 sm:gap-1.5 text-xs rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        <Sparkles size={14} />
                        <span>Nhiệm vụ ({completedObjectivesCount}/3)</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-slate-900/95 border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl backdrop-blur-md">
                      <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                        <Sparkles size={16} className="animate-pulse" />
                        Nhiệm Vụ Cần Đạt
                      </h3>
                      <div className="space-y-3">
                        {/* Task 1 */}
                        <div className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${
                          activeSession.taskEvaluation.task_1_completed 
                            ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-100 shadow-md' 
                            : 'bg-slate-950/25 border-transparent text-slate-400'
                        }`}>
                          {activeSession.taskEvaluation.task_1_completed ? (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Circle size={16} className="text-slate-600 shrink-0 mt-0.5" />
                          )}
                          <span className="text-xs font-medium leading-relaxed">{activeSession.scenario.requiredTasks[0] || 'Nhiệm vụ 1'}</span>
                        </div>

                        {/* Task 2 */}
                        <div className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${
                          activeSession.taskEvaluation.task_2_completed 
                            ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-100 shadow-md' 
                            : 'bg-slate-950/25 border-transparent text-slate-400'
                        }`}>
                          {activeSession.taskEvaluation.task_2_completed ? (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Circle size={16} className="text-slate-600 shrink-0 mt-0.5" />
                          )}
                          <span className="text-xs font-medium leading-relaxed">{activeSession.scenario.requiredTasks[1] || 'Nhiệm vụ 2'}</span>
                        </div>

                        {/* Task 3 */}
                        <div className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${
                          activeSession.taskEvaluation.task_3_completed 
                            ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-100 shadow-md' 
                            : 'bg-slate-950/25 border-transparent text-slate-400'
                        }`}>
                          {activeSession.taskEvaluation.task_3_completed ? (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Circle size={16} className="text-slate-600 shrink-0 mt-0.5" />
                          )}
                          <span className="text-xs font-medium leading-relaxed">{activeSession.scenario.requiredTasks[2] || 'Nhiệm vụ 3'}</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn thoát phiên luyện tập này không?')) {
                        setActiveSession(null);
                      }
                    }}
                    className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100 text-xs rounded-xl"
                  >
                    Thoát vai
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeSession.messages.map((msg) => {
                  const isIntroTitle = msg.id.startsWith('ai-intro-title-');
                  const isIntroContext = msg.id.startsWith('ai-intro-context-');
                  const isIntro = isIntroTitle || isIntroContext;

                  if (isIntro) {
                    return (
                      <div 
                        key={msg.id} 
                        className="w-full max-w-[95%] mx-auto animate-fade-in"
                      >
                        {isIntroTitle && (
                          <div className="w-full bg-gradient-to-r from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 backdrop-blur-md rounded-2xl p-5 shadow-lg space-y-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                                <Sparkles size={16} className="animate-pulse" />
                              </div>
                              <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">Chào mừng đến với Scenarios!</span>
                            </div>
                            
                            <div className="space-y-1">
                              <h3 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 leading-tight">
                                {activeSession.scenario.title}
                              </h3>
                              <div className="flex flex-wrap gap-2 pt-1.5">
                                {activeSession.scenario.level && (
                                  <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                                    Level: {activeSession.scenario.level}
                                  </span>
                                )}
                                {activeSession.scenario.topic && (
                                  <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                                    Topic: {activeSession.scenario.topic}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-slate-300 leading-relaxed">
                              Chào bạn! Tôi là trợ lý AI. Tôi sẽ đồng hành cùng bạn để luyện tập tiếng Anh thực tế qua kịch bản nhập vai này. Bạn có thể cuộn lên bất kỳ lúc nào để xem lại ngữ cảnh và vai diễn nhé!
                            </p>
                          </div>
                        )}

                        {isIntroContext && (
                          <div className="w-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg space-y-5">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-indigo-400">
                                <BookOpen size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Bối Cảnh Nhập Vai</span>
                              </div>
                              <div className="text-sm text-slate-300 leading-relaxed italic bg-slate-950/40 p-4 rounded-xl border border-slate-800/40 relative">
                                <span className="absolute top-1 left-2 text-slate-700 text-3xl font-serif leading-none">“</span>
                                <p className="pl-4 pr-2">{activeSession.scenario.description}</p>
                                <span className="absolute bottom-1 right-2 text-slate-700 text-3xl font-serif leading-none">”</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-indigo-950/20 border border-indigo-900/35 p-3 rounded-xl">
                                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                  Bạn đóng vai
                                </div>
                                <div className="text-sm font-semibold text-slate-100 mt-1">{activeSession.scenario.userPersona}</div>
                              </div>
                              <div className="bg-purple-950/20 border border-purple-900/35 p-3 rounded-xl">
                                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                  AI đóng vai
                                </div>
                                <div className="text-sm font-semibold text-slate-100 mt-1">{activeSession.scenario.aiPersona}</div>
                              </div>
                            </div>

                            <div className="space-y-3 pt-1">
                              <div className="flex items-center gap-2 text-emerald-400">
                                <Sparkles size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Nhiệm Vụ Cần Hoàn Thành ({completedObjectivesCount}/3)</span>
                              </div>
                              <div className="space-y-2">
                                {/* Objective 1 */}
                                <div className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-300 ${
                                  activeSession.taskEvaluation.task_1_completed 
                                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                                }`}>
                                  {activeSession.taskEvaluation.task_1_completed ? (
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle size={16} className="text-slate-600 shrink-0 mt-0.5" />
                                  )}
                                  <span className="text-xs font-medium leading-relaxed">{activeSession.scenario.requiredTasks[0] || 'Nhiệm vụ 1'}</span>
                                </div>

                                {/* Objective 2 */}
                                <div className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-300 ${
                                  activeSession.taskEvaluation.task_2_completed 
                                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                                }`}>
                                  {activeSession.taskEvaluation.task_2_completed ? (
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle size={16} className="text-slate-600 shrink-0 mt-0.5" />
                                  )}
                                  <span className="text-xs font-medium leading-relaxed">{activeSession.scenario.requiredTasks[1] || 'Nhiệm vụ 2'}</span>
                                </div>

                                {/* Objective 3 */}
                                <div className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-300 ${
                                  activeSession.taskEvaluation.task_3_completed 
                                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                                }`}>
                                  {activeSession.taskEvaluation.task_3_completed ? (
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle size={16} className="text-slate-600 shrink-0 mt-0.5" />
                                  )}
                                  <span className="text-xs font-medium leading-relaxed">{activeSession.scenario.requiredTasks[2] || 'Nhiệm vụ 3'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={msg.id} 
                      className={`flex items-start gap-3.5 max-w-[85%] ${msg.role === 'You' ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      {/* Role Avatar Badge */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-md shrink-0 ${
                        msg.role === 'You' 
                          ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white' 
                          : 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 text-indigo-300'
                      }`}>
                        {msg.role === 'You' ? 'ME' : 'AI'}
                      </div>

                      <div className="space-y-1.5 flex flex-col w-full items-start">
                        <div className={`text-xs text-slate-400 font-medium ${msg.role === 'You' ? 'self-end' : ''}`}>
                          {msg.role === 'You' ? activeSession.scenario.userPersona : activeSession.scenario.aiPersona}
                        </div>
                        
                        {msg.role === 'You' ? (
                          /* User Message with inline correction toggle */
                          <div className="flex flex-col items-end w-full space-y-1">
                            <div className="relative group/bubble flex items-center gap-2.5 max-w-full">
                              
                              {/* Toggle Correction Sparkles Button inside/adjacent to the user bubble */}
                              {msg.grammarCorrection && (
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => toggleCorrection(msg.id)}
                                  className={`w-7 h-7 rounded-full shrink-0 border transition-all ${
                                    showCorrectionIds.includes(msg.id)
                                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                      : 'bg-amber-500/5 border-amber-500/25 text-amber-400 hover:bg-amber-500/15'
                                  }`}
                                  title="Xem sửa lỗi trực tiếp"
                                >
                                  <Sparkles size={12} className="animate-pulse" />
                                </Button>
                              )}

                              <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed bg-gradient-to-r from-indigo-600 to-indigo-500 text-slate-50 rounded-tr-none shadow-[0_4px_12px_rgba(99,102,241,0.2)]">
                                {msg.text}
                              </div>
                            </div>

                            {/* Nested Collapsible Grammar Feedback Card directly below the message */}
                            {msg.grammarCorrection && showCorrectionIds.includes(msg.id) && (
                              <div className="w-full max-w-lg bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-xl text-xs sm:text-sm text-amber-200/90 shadow-md leading-relaxed flex items-start gap-2.5 animate-fade-in self-end mt-1.5 mr-0.5">
                                <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                                <div className="space-y-1 text-left">
                                  <div className="font-bold text-amber-300 text-[10px] uppercase tracking-wider">AI nhận xét lỗi:</div>
                                  <div className="leading-relaxed">{msg.grammarCorrection}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* AI Message */
                          <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed bg-slate-800/80 border border-slate-700/40 text-slate-100 rounded-tl-none shadow-md">
                            {msg.text}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* AI Typings indicator */}
                {chatMutation.isPending && (
                  <div className="flex items-start gap-3.5 max-w-[80%]">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 text-indigo-300">
                      AI
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-slate-400 font-medium">
                        {activeSession.scenario.aiPersona}
                      </div>
                      <div className="flex items-center gap-1.5 px-4 py-3.5 bg-slate-800/80 border border-slate-700/40 rounded-2xl rounded-tl-none">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Floating 3D Tutor video call square box (Only in Voice Call mode, writeable) */}
              {!activeSession.isReadOnly && isVoiceMode && (
                <div className="absolute bottom-24 right-6 w-48 h-48 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.4)] bg-slate-950/90 z-20 transition-all duration-300 hover:scale-105">
                  <Canvas
                    shadows
                    dpr={[1, 2]}
                    camera={{ position: [0, 2.1, cameraDistance], fov: 30, near: 0.1, far: 100 }}
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                    className="w-full h-full"
                  >
                    <Suspense fallback={<SceneLoader />}>
                      <TutorAvatarRig liveVisemeRef={liveVisemeRef} isPlaying={isPlaying} />
                    </Suspense>
                  </Canvas>
                </div>
              )}

              {/* ElevenLabs Attribution Tag */}
              <div className="flex items-center justify-center py-1.5 border-t border-slate-800/40 bg-slate-950/30 text-[10px] text-slate-500 font-medium">
                Voice by <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200 underline pl-1">elevenlabs.io</a>
              </div>

              {/* Chat Form / Action Footer */}
              {activeSession.isReadOnly ? (
                /* Read-Only Mode Footer */
                <div className="p-4 border-t border-slate-800/85 bg-slate-950/70 text-center text-xs text-slate-500 font-semibold italic flex items-center justify-center gap-1.5">
                  <Clock size={14} className="text-slate-600" />
                  Bạn đang xem lại lịch sử phiên luyện tập này dưới dạng chỉ đọc.
                </div>
              ) : isVoiceMode ? (
                /* Voice Call Mode Mic Recorder Form */
                <div className="p-4 border-t border-slate-800/85 bg-slate-950/70 backdrop-blur-md flex gap-3 items-center">
                  <input
                    type="text"
                    readOnly
                    placeholder={
                      isRecording 
                        ? '🎙️ Đang ghi âm giọng nói của bạn... Hãy nói đi!' 
                        : chatVoiceMutation.isPending 
                          ? '⏳ Đang chuyển đổi giọng nói và nhận xét...' 
                          : 'Bấm phím Nói bên phải để bắt đầu nói...'
                    }
                    className="flex-1 bg-slate-900/60 border border-slate-800/80 text-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none cursor-default placeholder:text-slate-500 select-none"
                  />
                  
                  {isRecording ? (
                    <Button 
                      type="button" 
                      onClick={stopRecording}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 h-11 shrink-0 gap-1.5 animate-pulse font-semibold"
                    >
                      <Square size={13} fill="currentColor" />
                      Dừng nói
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={startRecording}
                      disabled={chatVoiceMutation.isPending}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 h-11 shrink-0 gap-1.5 transition-all font-semibold"
                    >
                      {chatVoiceMutation.isPending ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Phân tích...
                        </>
                      ) : (
                        <>
                          <Mic size={15} />
                          Nói
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                /* Standard Chat Mode Form Input */
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800/85 bg-slate-950/70 backdrop-blur-md flex gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      activeSession.scenarioCompleted 
                        ? 'Nhiệm vụ đã hoàn thành! Bạn vẫn có thể nói tiếp...' 
                        : `Trả lời trong vai ${activeSession.scenario.userPersona}...`
                    }
                    disabled={chatMutation.isPending}
                    className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-500 disabled:opacity-50"
                  />
                  <Button 
                    type="submit" 
                    disabled={!inputText.trim() || chatMutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 transition-colors shrink-0 gap-1.5 font-semibold"
                  >
                    <Send size={15} />
                    <span className="hidden sm:inline">Gửi</span>
                  </Button>
                </form>
              )}

              {/* Scenario Completed Celebration Overlay */}
              {activeSession.scenarioCompleted && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-pulse">
                    <Award size={48} />
                  </div>
                  
                  <h3 className="text-3xl font-extrabold text-slate-50 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                    Kịch Bản Hoàn Thành!
                  </h3>
                  <p className="text-slate-300 max-w-md mt-3 mb-8 leading-relaxed">
                    Bạn đã xuất sắc hoàn thành tất cả 3 mục tiêu của kịch bản nhập vai <strong>{activeSession.scenario.title}</strong>!
                  </p>

                  <div className="w-full max-w-sm bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 mb-8 text-left space-y-3">
                    <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">Mục tiêu đạt được:</div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-200">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>{activeSession.scenario.requiredTasks[0]}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-200">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>{activeSession.scenario.requiredTasks[1]}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-200">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>{activeSession.scenario.requiredTasks[2]}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setActiveSession(prev => prev ? { ...prev, scenarioCompleted: false } : null)}
                      variant="outline"
                      className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 rounded-full px-6"
                    >
                      Xem lại cuộc đối thoại
                    </Button>
                    <Button 
                      onClick={() => {
                        stopPlayback();
                        setActiveSession(null);
                      }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white rounded-full px-8 font-semibold transition-all"
                    >
                      Quay lại kịch bản
                    </Button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      <CreateScenarioModal 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default RolePlayPage;
