import { useState } from 'react';
import {
  useScenariosQuery,
  useScenarioMutation,
  useDeleteScenarioMutation,
  useGenerateScenarioMutation
} from '@/api/roleplay-management';
import { toast } from '@/shared';
import {
  Sparkles,
  Plus,
  Search,
  Edit,
  Trash,
  Globe,
  Lock,
  CheckSquare,
  Bot,
  User,
  Cpu
} from 'lucide-react';
import {
  Button,
  Input,
  Badge,
  ConfirmModal,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Select
} from '@platform-core/components';

export const AdminScenariosPage = () => {

  // Tab state
  const [activeTab, setActiveTab] = useState<'list' | 'ai'>('list');

  // Search & level filter states
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | string>('ALL');

  // Dialog open states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<RoleplayManagement.Scenario | null>(null);

  // Form states (Create/Edit manual)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('A2');
  const [topic, setTopic] = useState('General');
  const [aiPersona, setAiPersona] = useState('');
  const [userPersona, setUserPersona] = useState('');
  const [task1, setTask1] = useState('');
  const [task2, setTask2] = useState('');
  const [task3, setTask3] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // AI Generator states
  const [aiTopic, setAiTopic] = useState('');
  const [aiLevel, setAiLevel] = useState('A2');
  const [aiIsPublic, setAiIsPublic] = useState(true);
  const [generatedResult, setGeneratedResult] = useState<RoleplayManagement.Scenario | null>(null);

  // Fetch scenarios
  const { data: scenarios = [], isLoading, error } = useScenariosQuery(
    levelFilter !== 'ALL' ? { level: levelFilter } : undefined
  );

  // Client-side search & display filter
  const filteredScenarios = scenarios.filter((sc) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      sc.title.toLowerCase().includes(s) ||
      sc.description.toLowerCase().includes(s) ||
      (sc.topic && sc.topic.toLowerCase().includes(s))
    );
  });

  // Mutations
  const scenarioMutation = useScenarioMutation({
    onSuccess: () => {
      setIsCreateOpen(false);
      setIsEditOpen(false);
      resetManualForm();
    }
  });

  const deleteMutation = useDeleteScenarioMutation();

  const generateMutation = useGenerateScenarioMutation({
    onSuccess: (data) => {
      setGeneratedResult(data);
    }
  });

  const resetManualForm = () => {
    setTitle('');
    setDescription('');
    setLevel('A2');
    setTopic('General');
    setAiPersona('');
    setUserPersona('');
    setTask1('');
    setTask2('');
    setTask3('');
    setIsPublic(true);
    setSelectedScenario(null);
  };

  const openCreateModal = () => {
    resetManualForm();
    setIsCreateOpen(true);
  };

  const openEditModal = (sc: RoleplayManagement.Scenario) => {
    setSelectedScenario(sc);
    setTitle(sc.title);
    setDescription(sc.description);
    setLevel(sc.level || 'A2');
    setTopic(sc.topic || 'General');
    setAiPersona(sc.aiPersona);
    setUserPersona(sc.userPersona);
    setTask1(sc.requiredTasks?.[0] || '');
    setTask2(sc.requiredTasks?.[1] || '');
    setTask3(sc.requiredTasks?.[2] || '');
    setIsPublic(sc.isPublic);
    setIsEditOpen(true);
  };

  const openDeleteModal = (sc: RoleplayManagement.Scenario) => {
    setSelectedScenario(sc);
    setIsDeleteOpen(true);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !aiPersona || !userPersona || !task1 || !task2 || !task3) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc và cả 3 nhiệm vụ!');
      return;
    }

    const payload: RoleplayManagement.CreateScenarioPayload = {
      title,
      description,
      aiPersona,
      userPersona,
      requiredTasks: [task1, task2, task3],
      level,
      topic,
      isPublic
    };

    scenarioMutation.mutate({
      id: selectedScenario?.id || undefined,
      payload
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedScenario) return;
    deleteMutation.mutate(selectedScenario.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedScenario(null);
      }
    });
  };

  const handleAiGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) {
      toast.error('Chủ đề kịch bản không được để trống');
      return;
    }
    setGeneratedResult(null);
    generateMutation.mutate({
      topic: aiTopic,
      level: aiLevel,
      isPublic: aiIsPublic,
      generateImage: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Quản lý Kịch bản Role-play</h2>
          <p className="text-xs text-muted-foreground font-medium">
            Thiết lập các tình huống hội thoại thực tế để học viên thực hành nói tiếng Anh cùng trợ lý AI.
          </p>
        </div>
        {activeTab === 'list' && (
          <Button
            onClick={openCreateModal}
            className="flex items-center gap-2 text-xs font-semibold h-9 rounded-xl shadow-lg shadow-primary/10 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Tạo kịch bản thủ công
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-muted">
        <button
          onClick={() => setActiveTab('list')}
          className={`pb-3 text-xs font-semibold px-4 border-b-2 transition-colors -mb-[2px] ${
            activeTab === 'list'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Danh sách kịch bản
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-3 text-xs font-semibold px-4 border-b-2 transition-colors -mb-[2px] ${
            activeTab === 'ai'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Tự động tạo bằng AI
        </button>
      </div>

      {/* TAB: LIST */}
      {activeTab === 'list' && (
        <>
          {/* Filters Toolbar */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm kịch bản..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 rounded-xl text-xs bg-background/50"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto self-start md:self-auto">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Trình độ CEFR:</span>
              <div className="w-44">
                <Select
                  value={levelFilter}
                  onChange={(val) => setLevelFilter(val || 'ALL')}
                  options={[
                    { value: 'ALL', label: 'Tất cả trình độ' },
                    { value: 'A1', label: 'A1 - Beginner' },
                    { value: 'A2', label: 'A2 - Elementary' },
                    { value: 'B1', label: 'B1 - Intermediate' },
                    { value: 'B2', label: 'B2 - Upper Intermediate' },
                    { value: 'C1', label: 'C1 - Advanced' },
                    { value: 'C2', label: 'C2 - Mastery' }
                  ]}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Grid List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <span className="text-xs text-muted-foreground">Đang tải danh sách kịch bản...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500 font-medium border rounded-2xl bg-card">
              Có lỗi xảy ra khi tải danh sách kịch bản. Vui lòng thử lại.
            </div>
          ) : filteredScenarios.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl bg-card/20">
              Không tìm thấy kịch bản nào phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScenarios.map((sc) => (
                <div
                  key={sc.id}
                  className="bg-card border rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex gap-1.5 flex-wrap">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-semibold">
                          {sc.level || 'A2'}
                        </Badge>
                        {sc.topic && (
                          <Badge className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20 text-[9px] font-semibold">
                            {sc.topic}
                          </Badge>
                        )}
                        {sc.type === 'AI_GENERATED' ? (
                          <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 text-[9px] font-semibold flex items-center gap-1">
                            <Sparkles className="h-2.5 w-2.5" />
                            AI Tạo
                          </Badge>
                        ) : sc.type === 'SYSTEM' ? (
                          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[9px] font-semibold">
                            Hệ thống
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-semibold">
                            Tự tạo
                          </Badge>
                        )}
                      </div>

                      <div title={sc.isPublic ? "Công khai" : "Riêng tư"}>
                        {sc.isPublic ? (
                          <Globe className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-zinc-400" />
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {sc.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 min-h-[32px]">
                      {sc.description}
                    </p>

                    {/* Personas context preview */}
                    <div className="mt-4 space-y-2 border-t pt-3 text-[11px]">
                      <div className="flex gap-1.5 items-start">
                        <Bot className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <p className="text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">AI:</strong> {sc.aiPersona}
                        </p>
                      </div>
                      <div className="flex gap-1.5 items-start">
                        <User className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-muted-foreground leading-relaxed">
                          <strong className="text-foreground">Học viên:</strong> {sc.userPersona}
                        </p>
                      </div>
                    </div>

                    {/* Tasks checklist */}
                    <div className="mt-3 bg-muted/30 p-2.5 rounded-xl border border-muted/50 space-y-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <CheckSquare className="h-3 w-3" />
                        Nhiệm vụ cần đạt ({sc.requiredTasks?.length || 0})
                      </span>
                      <ul className="space-y-1">
                        {sc.requiredTasks?.map((task, idx) => (
                          <li key={idx} className="text-[11px] text-foreground font-medium flex items-start gap-1">
                            <span className="text-primary font-semibold shrink-0">{idx + 1}.</span>
                            <span className="line-clamp-1">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => openEditModal(sc)}
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => openDeleteModal(sc)}
                      title="Xoá kịch bản"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB: AI GENERATOR */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form generator */}
          <div className="bg-card border rounded-2xl p-6 lg:col-span-5 space-y-5">
            <div className="space-y-1">
              <h3 className="font-bold text-sm flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                Trình tạo kịch bản tự động
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Sử dụng Trí tuệ Nhân tạo để phân tích chủ đề, xây dựng ngữ cảnh, các vai persona và 3 nhiệm vụ phù hợp với cấp độ CEFR.
              </p>
            </div>

            <form onSubmit={handleAiGenerateSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Chủ đề/Ngữ cảnh mô tả *</label>
                <textarea
                  placeholder="Ví dụ: Đặt bàn ăn tại nhà hàng Pháp sang trọng, đặt vé xem phim tại rạp..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full text-xs rounded-xl border p-3 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[100px] leading-relaxed"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Mục tiêu Trình độ (CEFR) *</label>
                <div className="w-full">
                  <Select
                    value={aiLevel}
                    onChange={(val) => setAiLevel(val || 'A2')}
                    options={[
                      { value: 'A1', label: 'A1 - Beginner' },
                      { value: 'A2', label: 'A2 - Elementary' },
                      { value: 'B1', label: 'B1 - Intermediate' },
                      { value: 'B2', label: 'B2 - Upper Intermediate' },
                      { value: 'C1', label: 'C1 - Advanced' },
                      { value: 'C2', label: 'C2 - Mastery' }
                    ]}
                    className="h-9 text-xs rounded-xl w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="aiIsPublic"
                  checked={aiIsPublic}
                  onChange={(e) => setAiIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="aiIsPublic" className="text-xs font-semibold text-foreground cursor-pointer">
                  Công khai kịch bản sau khi tạo thành công
                </label>
              </div>

              <Button
                type="submit"
                disabled={generateMutation.isPending}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold h-10 rounded-xl shadow-lg shadow-primary/10"
              >
                {generateMutation.isPending ? (
                  <>
                    <Cpu className="h-4 w-4 animate-spin" />
                    AI đang xây dựng kịch bản...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Bắt đầu tạo kịch bản
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Generator Preview Output */}
          <div className="lg:col-span-7">
            {generateMutation.isPending && (
              <div className="bg-card/30 border border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                <div className="relative flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="h-5 w-5 text-primary absolute animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs">AI đang chuẩn bị nội dung</h4>
                  <p className="text-[11px] text-muted-foreground max-w-sm">
                    Quá trình này có thể mất từ 15-30 giây để LLM sinh các persona chân thực nhất cùng cấu trúc ngữ pháp tương ứng.
                  </p>
                </div>
              </div>
            )}

            {!generateMutation.isPending && !generatedResult && (
              <div className="bg-card/20 border border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px] text-muted-foreground">
                <Cpu className="h-8 w-8 text-muted-foreground/50" />
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-foreground">Chưa có kết quả tạo</h4>
                  <p className="text-[11px] max-w-sm">
                    Hãy nhập chủ đề hội thoại và cấp độ tiếng Anh cần thiết kế ở bảng bên trái để tiến hành sinh thử kịch bản.
                  </p>
                </div>
              </div>
            )}

            {!generateMutation.isPending && generatedResult && (
              <div className="bg-card border rounded-2xl p-6 space-y-6 shadow-sm border-violet-500/20">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 text-[9px] font-semibold flex items-center gap-1">
                        <Sparkles className="h-2.5 w-2.5" />
                        Kết quả tạo bởi AI
                      </Badge>
                      <Badge className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-semibold">
                        {generatedResult.level}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-base text-foreground mt-1">{generatedResult.title}</h3>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px]">
                    Đã lưu CSDL
                  </Badge>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mô tả bối cảnh</span>
                  <p className="text-xs text-foreground bg-muted/30 p-3 rounded-xl border border-muted/50 leading-relaxed font-medium">
                    {generatedResult.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Bot className="h-3.5 w-3.5 text-indigo-500" />
                      Persona của AI (Đóng vai)
                    </span>
                    <div className="text-xs text-muted-foreground border p-3 rounded-xl min-h-[80px] leading-relaxed">
                      {generatedResult.aiPersona}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-orange-500" />
                      Persona học viên (Người dùng)
                    </span>
                    <div className="text-xs text-muted-foreground border p-3 rounded-xl min-h-[80px] leading-relaxed">
                      {generatedResult.userPersona}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <CheckSquare className="h-3.5 w-3.5 text-primary" />
                    3 nhiệm vụ AI yêu cầu hoàn thành
                  </span>
                  <div className="space-y-2">
                    {generatedResult.requiredTasks?.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-xl border">
                        <span className="h-5 w-5 bg-primary/10 text-primary border border-primary/20 flex items-center justify-center rounded-lg text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-foreground">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => {
                      setGeneratedResult(null);
                      setAiTopic('');
                      setActiveTab('list');
                    }}
                    className="text-xs rounded-xl h-9 font-semibold"
                  >
                    Quay về danh sách kịch bản
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE MANUAL DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl p-6 rounded-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Tạo kịch bản nói mới</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Thiết kế chi tiết thông tin đóng vai cho AI, người dùng và các cột mốc hoàn thành.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleManualSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Tiêu đề kịch bản *</label>
                <Input
                  placeholder="Ví dụ: Booking a Hotel Room"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Chủ đề/Thể loại *</label>
                <Input
                  placeholder="Ví dụ: Travel, Business, Food..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Cấp độ (CEFR) *</label>
                <div>
                  <Select
                    value={level}
                    onChange={(val) => setLevel(val || 'A2')}
                    options={[
                      { value: 'A1', label: 'A1 - Beginner' },
                      { value: 'A2', label: 'A2 - Elementary' },
                      { value: 'B1', label: 'B1 - Intermediate' },
                      { value: 'B2', label: 'B2 - Upper Intermediate' },
                      { value: 'C1', label: 'C1 - Advanced' },
                      { value: 'C2', label: 'C2 - Mastery' }
                    ]}
                    className="h-9 text-xs rounded-xl w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="createIsPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="createIsPublic" className="text-xs font-semibold text-foreground cursor-pointer">
                  Công khai kịch bản này
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Mô tả bối cảnh ngắn *</label>
              <textarea
                placeholder="Nhập mô tả bối cảnh tình huống nói để học viên nắm thông tin trước..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs rounded-xl border p-2.5 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[60px]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Persona của AI (Đóng vai trợ lý) *</label>
              <textarea
                placeholder="Ví dụ: Bạn là lễ tân khách sạn Marriott, vui vẻ, lịch sự và hỗ trợ khách hàng hết mình..."
                value={aiPersona}
                onChange={(e) => setAiPersona(e.target.value)}
                className="w-full text-xs rounded-xl border p-2.5 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[60px]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Persona học viên (Vai người dùng) *</label>
              <textarea
                placeholder="Ví dụ: Bạn là một khách du lịch đến New York, muốn nhận phòng đã đặt và hỏi về giờ ăn sáng..."
                value={userPersona}
                onChange={(e) => setUserPersona(e.target.value)}
                className="w-full text-xs rounded-xl border p-2.5 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[60px]"
                required
              />
            </div>

            <div className="space-y-2 border-t pt-3">
              <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <CheckSquare className="h-4 w-4 text-primary" />
                Thiết lập 3 nhiệm vụ bắt buộc hoàn thành *
              </label>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-muted-foreground w-6">1.</span>
                  <Input
                    placeholder="Nhiệm vụ 1: Ví dụ: Cung cấp tên và mã đặt phòng của bạn"
                    value={task1}
                    onChange={(e) => setTask1(e.target.value)}
                    className="h-9 text-xs rounded-xl flex-1"
                    required
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-muted-foreground w-6">2.</span>
                  <Input
                    placeholder="Nhiệm vụ 2: Ví dụ: Hỏi lễ tân khách sạn về thời gian và địa điểm ăn sáng"
                    value={task2}
                    onChange={(e) => setTask2(e.target.value)}
                    className="h-9 text-xs rounded-xl flex-1"
                    required
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-muted-foreground w-6">3.</span>
                  <Input
                    placeholder="Nhiệm vụ 3: Ví dụ: Hỏi xin chìa khóa phòng và nói lời cảm ơn"
                    value={task3}
                    onChange={(e) => setTask3(e.target.value)}
                    className="h-9 text-xs rounded-xl flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="h-9 text-xs rounded-xl">
                Huỷ
              </Button>
              <Button type="submit" disabled={scenarioMutation.isPending} className="h-9 text-xs rounded-xl">
                {scenarioMutation.isPending ? 'Đang tạo...' : 'Tạo kịch bản'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl p-6 rounded-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Chỉnh sửa kịch bản nói</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Cập nhật thông tin chi tiết cho kịch bản đóng vai.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleManualSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Tiêu đề kịch bản *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Chủ đề/Thể loại *</label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Cập nhật Trình độ *</label>
                <div>
                  <Select
                    value={level}
                    onChange={(val) => setLevel(val || 'A2')}
                    options={[
                      { value: 'A1', label: 'A1 - Beginner' },
                      { value: 'A2', label: 'A2 - Elementary' },
                      { value: 'B1', label: 'B1 - Intermediate' },
                      { value: 'B2', label: 'B2 - Upper Intermediate' },
                      { value: 'C1', label: 'C1 - Advanced' },
                      { value: 'C2', label: 'C2 - Mastery' }
                    ]}
                    className="h-9 text-xs rounded-xl w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="editIsPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="editIsPublic" className="text-xs font-semibold text-foreground cursor-pointer">
                  Công khai kịch bản này
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Mô tả bối cảnh ngắn *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs rounded-xl border p-2.5 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[60px]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Persona của AI *</label>
              <textarea
                value={aiPersona}
                onChange={(e) => setAiPersona(e.target.value)}
                className="w-full text-xs rounded-xl border p-2.5 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[60px]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Persona học viên *</label>
              <textarea
                value={userPersona}
                onChange={(e) => setUserPersona(e.target.value)}
                className="w-full text-xs rounded-xl border p-2.5 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[60px]"
                required
              />
            </div>

            <div className="space-y-2 border-t pt-3">
              <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <CheckSquare className="h-4 w-4 text-primary" />
                Thiết lập 3 nhiệm vụ bắt buộc hoàn thành *
              </label>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-muted-foreground w-6">1.</span>
                  <Input
                    value={task1}
                    onChange={(e) => setTask1(e.target.value)}
                    className="h-9 text-xs rounded-xl flex-1"
                    required
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-muted-foreground w-6">2.</span>
                  <Input
                    value={task2}
                    onChange={(e) => setTask2(e.target.value)}
                    className="h-9 text-xs rounded-xl flex-1"
                    required
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-muted-foreground w-6">3.</span>
                  <Input
                    value={task3}
                    onChange={(e) => setTask3(e.target.value)}
                    className="h-9 text-xs rounded-xl flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="h-9 text-xs rounded-xl">
                Huỷ
              </Button>
              <Button type="submit" disabled={scenarioMutation.isPending} className="h-9 text-xs rounded-xl">
                {scenarioMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      {selectedScenario && (
        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title="Xác nhận xoá kịch bản"
          message={`Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xoá vĩnh viễn kịch bản nói "${selectedScenario.title}"?`}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};
