import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons/Icons';

export const SessionHistory = ({
  historyItems,
  isLoading,
  setSelectedHistorySessionId,
  isHistoryDetailsLoading,
  selectedHistorySessionId
}: {
  historyItems: RoleplayManagement.HistoryItem[] | undefined;
  isLoading: boolean;
  setSelectedHistorySessionId: (id: string | null) => void;
  isHistoryDetailsLoading: boolean;
  selectedHistorySessionId: string | null;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-52 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800/40" />
        ))}
      </div>
    );
  }

  if (!historyItems || historyItems.length === 0) {
    return (
      <div className="col-span-full text-center py-20 bg-slate-900/20 border border-slate-800/60 rounded-3xl backdrop-blur-md space-y-4 animate-fade-in">
        <Icons.History size={48} className="text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-300">Chưa có lịch sử học tập</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">Hãy chọn một kịch bản luyện nói để lưu giữ nhật ký học tập và xem phân tích sửa lỗi ngữ pháp nhé!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {historyItems.map((item) => {
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
                  <Icons.Clock size={12} />
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
                  <Icons.Loader2 size={14} className="animate-spin" />
                ) : (
                  <Icons.History size={14} />
                )}
                Xem lại hội thoại
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
