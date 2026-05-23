import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/Icons/Icons';

export const TextChatUI = ({
  activeSession,
  isChatPending,
  isVoicePending,
  inputText,
  showCorrectionIds,
  completedObjectivesCount,
  chatEndRef,
  stopPlayback,
  setSelectedHistorySessionId,
  setActiveSession,
  setIsVoiceMode,
  setInputText,
  handleSendMessage,
  toggleCorrection
}: {
  activeSession: RoleplayManagement.ActiveSession;
  isChatPending: boolean;
  isVoicePending: boolean;
  inputText: string;
  showCorrectionIds: string[];
  completedObjectivesCount: number;
  chatEndRef: React.RefObject<HTMLDivElement>;
  stopPlayback: () => void;
  setSelectedHistorySessionId: (id: string | null) => void;
  setActiveSession: (val: RoleplayManagement.ActiveSession | null | ((prev: RoleplayManagement.ActiveSession | null) => RoleplayManagement.ActiveSession | null)) => void;
  setIsVoiceMode: (val: boolean) => void;
  setInputText: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  toggleCorrection: (id: string) => void;
}) => {
  const renderHeader = () => (
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
          <Icons.ArrowLeft size={18} />
        </Button>
        <div>
          <h2 className="text-sm sm:text-lg font-bold text-slate-100 line-clamp-1">{activeSession.scenario.title}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            {activeSession.isReadOnly ? (
              <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                Xem lại lịch sử (Chỉ đọc)
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
      
      <div className="flex items-center gap-2 sm:gap-3">
        {!activeSession.isReadOnly && (
          <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-xl flex shrink-0">
            <button type="button" className="px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition-all bg-indigo-600 text-white shadow-sm">
              <Icons.MessageSquare size={12} />
              <span className="hidden sm:inline">Trò chuyện</span>
            </button>
            <button
              type="button"
              onClick={() => { stopPlayback(); setIsVoiceMode(true); }}
              className="px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition-all text-slate-400 hover:text-slate-200"
            >
              <Icons.Phone size={12} />
              <span className="hidden sm:inline">Gọi thoại</span>
            </button>
          </div>
        )}

        {activeSession.isReadOnly && activeSession.cumulativeGrammarFeedback && activeSession.cumulativeGrammarFeedback.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300 gap-1.5 text-xs rounded-xl hover:bg-slate-800 shrink-0">
                <Icons.Sparkles size={13} />
                <span className="hidden xs:inline">Tổng hợp lỗi ({activeSession.cumulativeGrammarFeedback.length})</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-slate-900/95 border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl backdrop-blur-md max-h-80 overflow-y-auto">
              <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-1.5">
                <Icons.Sparkles size={16} className="animate-pulse" /> Tổng Hợp Lỗi Ngữ Pháp
              </h3>
              <div className="space-y-2.5">
                {activeSession.cumulativeGrammarFeedback.map((err, idx) => (
                  <div key={idx} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-200 leading-relaxed">
                    <span className="font-bold text-amber-400">Lỗi #{idx + 1}: </span>{err}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-indigo-400 hover:text-indigo-300 gap-1 sm:gap-1.5 text-xs rounded-xl hover:bg-slate-800 transition-colors shrink-0">
              <Icons.BookOpen size={14} />
              <span className="hidden sm:inline">Ngữ cảnh</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-slate-900/95 border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
              <Icons.BookOpen size={16} /> Ngữ Cảnh Nhập Vai
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

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-emerald-400 hover:text-emerald-300 gap-1 sm:gap-1.5 text-xs rounded-xl hover:bg-slate-800 transition-colors">
              <Icons.Sparkles size={14} />
              <span>Nhiệm vụ ({completedObjectivesCount}/3)</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-slate-900/95 border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
              <Icons.Sparkles size={16} className="animate-pulse" /> Nhiệm Vụ Cần Đạt
            </h3>
            <div className="space-y-3">
              {[0, 1, 2].map(i => {
                const completed = i === 0 ? activeSession.taskEvaluation.task_1_completed : i === 1 ? activeSession.taskEvaluation.task_2_completed : activeSession.taskEvaluation.task_3_completed;
                return (
                  <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${completed ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-100 shadow-md' : 'bg-slate-950/25 border-transparent text-slate-400'}`}>
                    {completed ? <Icons.CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> : <Icons.Circle size={16} className="text-slate-600 shrink-0 mt-0.5" />}
                    <span className="text-xs font-medium leading-relaxed">{activeSession.scenario.requiredTasks[i] || `Nhiệm vụ ${i+1}`}</span>
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            if (confirm('Bạn có chắc muốn thoát phiên luyện tập này không?')) setActiveSession(null);
          }}
          className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100 text-xs rounded-xl"
        >
          Thoát vai
        </Button>
      </div>
    </div>
  );

  const renderIntroMessage = (msg: RoleplayManagement.ActiveMessage) => {
    const isIntroTitle = msg.id.startsWith('ai-intro-title-');
    if (isIntroTitle) {
      return (
        <div key={msg.id} className="w-full max-w-[95%] mx-auto animate-fade-in">
          <div className="w-full bg-gradient-to-r from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 backdrop-blur-md rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Icons.Sparkles size={16} className="animate-pulse" />
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
        </div>
      );
    }

    return (
      <div key={msg.id} className="w-full max-w-[95%] mx-auto animate-fade-in">
        <div className="w-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-lg space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Icons.BookOpen size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Bối Cảnh Nhập Vai</span>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed italic bg-slate-950/40 p-4 rounded-xl border border-slate-800/40 relative">
              <span className="absolute top-1 left-2 text-slate-700 text-3xl font-serif leading-none">{'\u201c'}</span>
              <p className="pl-4 pr-2">{activeSession.scenario.description}</p>
              <span className="absolute bottom-1 right-2 text-slate-700 text-3xl font-serif leading-none">{'\u201d'}</span>
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
              <Icons.Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Nhiệm Vụ Cần Hoàn Thành ({completedObjectivesCount}/3)</span>
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map(i => {
                const completed = i === 0 ? activeSession.taskEvaluation.task_1_completed : i === 1 ? activeSession.taskEvaluation.task_2_completed : activeSession.taskEvaluation.task_3_completed;
                return (
                  <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-300 ${completed ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' : 'bg-slate-950/40 border-slate-800 text-slate-400'}`}>
                    {completed ? <Icons.CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> : <Icons.Circle size={16} className="text-slate-600 shrink-0 mt-0.5" />}
                    <span className="text-xs font-medium leading-relaxed">{activeSession.scenario.requiredTasks[i] || `Nhiệm vụ ${i+1}`}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch relative">
      <div className="lg:col-span-12 flex flex-col h-full bg-slate-900/50 border border-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl relative">
        {renderHeader()}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeSession.messages.map((msg) => {
            const isIntroTitle = msg.id.startsWith('ai-intro-title-');
            const isIntroContext = msg.id.startsWith('ai-intro-context-');
            if (isIntroTitle || isIntroContext) return renderIntroMessage(msg);

            return (
              <div key={msg.id} className={`flex items-start gap-3.5 max-w-[85%] ${msg.role === 'You' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-md shrink-0 ${
                  msg.role === 'You' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white' : 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 text-indigo-300'
                }`}>
                  {msg.role === 'You' ? 'ME' : 'AI'}
                </div>
                <div className="space-y-1.5 flex flex-col w-full items-start">
                  <div className={`text-xs text-slate-400 font-medium ${msg.role === 'You' ? 'self-end' : ''}`}>
                    {msg.role === 'You' ? activeSession.scenario.userPersona : activeSession.scenario.aiPersona}
                  </div>
                  
                  {msg.role === 'You' ? (
                    <div className="flex flex-col items-end w-full space-y-1">
                      <div className="relative group/bubble flex items-center gap-2.5 max-w-full">
                        {msg.grammarCorrection && (
                          <Button
                            type="button" size="icon" variant="ghost" onClick={() => toggleCorrection(msg.id)}
                            className={`w-7 h-7 rounded-full shrink-0 border transition-all ${
                              showCorrectionIds.includes(msg.id)
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                : 'bg-amber-500/5 border-amber-500/25 text-amber-400 hover:bg-amber-500/15'
                            }`}
                          >
                            <Icons.Sparkles size={12} className="animate-pulse" />
                          </Button>
                        )}
                        <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed bg-gradient-to-r from-indigo-600 to-indigo-500 text-slate-50 rounded-tr-none shadow-[0_4px_12px_rgba(99,102,241,0.2)]">
                          {msg.text}
                        </div>
                      </div>
                      {msg.grammarCorrection && showCorrectionIds.includes(msg.id) && (
                        <div className="w-full max-w-lg bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-xl text-xs sm:text-sm text-amber-200/90 shadow-md leading-relaxed flex items-start gap-2.5 animate-fade-in self-end mt-1.5 mr-0.5">
                          <Icons.Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                          <div className="space-y-1 text-left">
                            <div className="font-bold text-amber-300 text-[10px] uppercase tracking-wider">AI nhận xét lỗi:</div>
                            <div className="leading-relaxed">{msg.grammarCorrection}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed bg-slate-800/80 border border-slate-700/40 text-slate-100 rounded-tl-none shadow-md">
                      {msg.text}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {(isChatPending || isVoicePending) && (
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

        <div className="flex items-center justify-center py-1.5 border-t border-slate-800/40 bg-slate-950/30 text-[10px] text-slate-500 font-medium">
          Voice by <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200 underline pl-1">elevenlabs.io</a>
        </div>

        {activeSession.isReadOnly ? (
          <div className="p-4 border-t border-slate-800/85 bg-slate-950/70 text-center text-xs text-slate-500 font-semibold italic flex items-center justify-center gap-1.5">
            <Icons.Clock size={14} className="text-slate-600" /> Bạn đang xem lại lịch sử phiên luyện tập này dưới dạng chỉ đọc.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800/85 bg-slate-950/70 backdrop-blur-md flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={activeSession.scenarioCompleted ? 'Nhiệm vụ đã hoàn thành! Bạn vẫn có thể nói tiếp...' : `Trả lời trong vai ${activeSession.scenario.userPersona}...`}
              disabled={isChatPending}
              className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-500 disabled:opacity-50"
            />
            <Button type="submit" disabled={!inputText.trim() || isChatPending} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 transition-colors shrink-0 gap-1.5 font-semibold">
              <Icons.Send size={15} />
              <span className="hidden sm:inline">Gửi</span>
            </Button>
          </form>
        )}

        {activeSession.scenarioCompleted && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-pulse">
              <Icons.Award size={48} />
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              Kịch Bản Hoàn Thành!
            </h3>
            <p className="text-slate-300 max-w-md mt-3 mb-8 leading-relaxed">
              Bạn đã xuất sắc hoàn thành tất cả 3 mục tiêu của kịch bản nhập vai <strong>{activeSession.scenario.title}</strong>!
            </p>
            <div className="w-full max-w-sm bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 mb-8 text-left space-y-3">
              <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">Mục tiêu đạt được:</div>
              {[0, 1, 2].map(i => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <Icons.CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>{activeSession.scenario.requiredTasks[i]}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setActiveSession(prev => prev ? { ...prev, scenarioCompleted: false } : null)} variant="outline" className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 rounded-full px-6">
                Xem lại cuộc đối thoại
              </Button>
              <Button onClick={() => { stopPlayback(); setActiveSession(null); }} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-full px-8 font-semibold transition-all">
                Quay lại kịch bản
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
