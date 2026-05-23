import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons/Icons';
import CreateScenarioModal from './CreateScenarioModal';

import { useRolePlaySession } from './hooks/useRolePlaySession';
import useTutor3DLipsync from '../Tutor3DPage/useTutor3DLipsync';

import { ScenarioSelection } from './components/ScenarioSelection';
import { SessionHistory } from './components/SessionHistory';
import { VoiceCallUI } from './components/VoiceCallUI';
import { TextChatUI } from './components/TextChatUI';

const RolePlayPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { isPlaying, liveVisemeRef, playAudioFromResponse, stopPlayback } = useTutor3DLipsync();

  const {
    state,
    queries,
    mutations,
    actions
  } = useRolePlaySession(playAudioFromResponse, stopPlayback);

  // GSAP animations for listing page
  useGSAP(() => {
    if (queries.isScenariosLoading || state.activeSession) return;
    
    gsap.fromTo('.hero-content', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    gsap.fromTo('.scenario-card', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
    );
  }, { dependencies: [queries.isScenariosLoading, state.activeSession], scope: containerRef });

  const handleFreeTalk = () => {
    toast.info('Bắt đầu Free Talk (vui lòng truy cập Tutor 3D để trải nghiệm voice trực quan)');
  };

  return (
    <div ref={containerRef} className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-950 relative text-slate-50 w-full">
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_75%_10%,rgba(99,102,241,0.12),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(15,23,42,0.95),rgba(2,6,23,1))] pointer-events-none' />
      
      <div className={`relative z-10 w-full flex-1 max-w-7xl mx-auto px-4 md:px-6 flex flex-col ${!state.activeSession ? 'py-8 md:py-12 overflow-y-auto pb-20' : 'py-4 md:py-6'}`}>
        {!state.activeSession ? (
          <div className="flex-1">
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
                  <Icons.PlusCircle size={18} />
                  {t('roleplay_create_scenario')}
                </Button>
                <Button 
                  size="default" 
                  variant="secondary" 
                  onClick={handleFreeTalk} 
                  className="gap-2 rounded-full px-5 bg-slate-900/60 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm"
                >
                  <Icons.MessageCircle size={18} />
                  {t('roleplay_free_talk')}
                </Button>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="bg-slate-900/80 border border-slate-800/85 p-1 rounded-2xl flex gap-1 backdrop-blur-md shadow-inner">
                <button
                  onClick={() => actions.setActiveTab('practice')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    state.activeTab === 'practice'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <Icons.MessageSquare size={15} />
                  Kịch bản nhập vai
                </button>
                <button
                  onClick={() => actions.setActiveTab('history')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    state.activeTab === 'history'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <Icons.Clock size={15} />
                  Lịch sử luyện tập
                </button>
              </div>
            </div>

            {state.activeTab === 'practice' ? (
              <ScenarioSelection 
                scenarios={queries.scenarios}
                isLoading={queries.isScenariosLoading}
                handleStartScenario={actions.handleStartScenario}
                isStartPending={mutations.isStartPending}
                startVariables={mutations.startVariables}
              />
            ) : (
              <SessionHistory 
                historyItems={queries.historyItems}
                isLoading={queries.isHistoryLoading}
                setSelectedHistorySessionId={actions.setSelectedHistorySessionId}
                isHistoryDetailsLoading={queries.isHistoryDetailsLoading}
                selectedHistorySessionId={state.selectedHistorySessionId}
              />
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {!state.activeSession.isReadOnly && state.isVoiceMode ? (
              <VoiceCallUI 
                activeSession={state.activeSession}
                isRecording={state.isRecording}
                isPlaying={isPlaying}
                liveVisemeRef={liveVisemeRef}
                isVoicePending={mutations.isVoicePending}
                showChatPopup={state.showChatPopup}
                completedObjectivesCount={state.completedObjectivesCount}
                stopPlayback={stopPlayback}
                setSelectedHistorySessionId={actions.setSelectedHistorySessionId}
                setActiveSession={actions.setActiveSession}
                setIsVoiceMode={actions.setIsVoiceMode}
                stopRecording={actions.stopRecording}
                startRecording={actions.startRecording}
                setShowChatPopup={actions.setShowChatPopup}
              />
            ) : (
              <TextChatUI 
                activeSession={state.activeSession}
                isChatPending={mutations.isChatPending}
                isVoicePending={mutations.isVoicePending}
                inputText={state.inputText}
                showCorrectionIds={state.showCorrectionIds}
                completedObjectivesCount={state.completedObjectivesCount}
                chatEndRef={chatEndRef}
                stopPlayback={stopPlayback}
                setSelectedHistorySessionId={actions.setSelectedHistorySessionId}
                setActiveSession={actions.setActiveSession}
                setIsVoiceMode={actions.setIsVoiceMode}
                setInputText={actions.setInputText}
                handleSendMessage={actions.handleSendMessage}
                toggleCorrection={actions.toggleCorrection}
              />
            )}
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
