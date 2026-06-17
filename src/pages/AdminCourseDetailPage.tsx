import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { getCourse } from '@/api/course-management';
import { getLessons, createLesson, updateLesson, deleteLesson } from '@/api/lesson-management';
import { getWords, createWord, updateWord, deleteWord } from '@/api/word-management';
import { toast } from '@/shared';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
  Volume2
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

// Sub-component to manage words list within each expanded Lesson
interface LessonWordsTableProps {
  lessonId: number;
}

const LessonWordsTable = ({ lessonId }: LessonWordsTableProps) => {
  const queryClient = useQueryClient();
  const [isWordCreateOpen, setIsWordCreateOpen] = useState(false);
  const [isWordEditOpen, setIsWordEditOpen] = useState(false);
  const [isWordDeleteOpen, setIsWordDeleteOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<LearningManagement.Word | null>(null);

  // Form states (Create)
  const [wSpelling, setWSpelling] = useState('');
  const [wPronunciation, setWPronunciation] = useState('');
  const [wPos, setWPos] = useState('');
  const [wCefr, setWCefr] = useState('A1');
  const [wMeaning, setWMeaning] = useState('');
  const [wExample, setWExample] = useState('');
  const [wExampleVi, setWExampleVi] = useState('');
  const [wAudio, setWAudio] = useState('');

  // Form states (Edit)
  const [eSpelling, setESpelling] = useState('');
  const [ePronunciation, setEPronunciation] = useState('');
  const [ePos, setEPos] = useState('');
  const [eCefr, setECefr] = useState('A1');
  const [eMeaning, setEMeaning] = useState('');
  const [eExample, setEExample] = useState('');
  const [eExampleVi, setEExampleVi] = useState('');
  const [eAudio, setEAudio] = useState('');

  // Fetch words in lesson
  const { data: wordsData, isLoading, error } = useQuery({
    queryKey: ['admin', 'lessons', lessonId, 'words'],
    queryFn: () => getWords({ lessonId, take: 100 })
  });

  const wordsList = wordsData?.data || [];

  // Mutations
  const createWordMutation = useMutation({
    mutationFn: createWord,
    onSuccess: () => {
      toast.success('Thêm từ vựng thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'lessons', lessonId, 'words'] });
      setIsWordCreateOpen(false);
      resetWordCreateForm();
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể tạo từ vựng');
    }
  });

  const updateWordMutation = useMutation({
    mutationFn: ({ id, payload }: { id: App.ID; payload: LearningManagement.Word }) =>
      updateWord(id, payload),
    onSuccess: () => {
      toast.success('Cập nhật từ vựng thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'lessons', lessonId, 'words'] });
      setIsWordEditOpen(false);
      setSelectedWord(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể cập nhật từ vựng');
    }
  });

  const deleteWordMutation = useMutation({
    mutationFn: deleteWord,
    onSuccess: () => {
      toast.success('Xoá từ vựng thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'lessons', lessonId, 'words'] });
      setIsWordDeleteOpen(false);
      setSelectedWord(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể xoá từ vựng');
    }
  });

  const resetWordCreateForm = () => {
    setWSpelling('');
    setWPronunciation('');
    setWPos('');
    setWCefr('A1');
    setWMeaning('');
    setWExample('');
    setWExampleVi('');
    setWAudio('');
  };

  const openWordEdit = (word: LearningManagement.Word) => {
    setSelectedWord(word);
    setESpelling(word.word);
    setEPronunciation(word.pronunciation || '');
    setEPos(word.pos || '');
    setECefr(word.cefr || 'A1');
    setEMeaning(word.meaning);
    setEExample(word.example || '');
    setEExampleVi(word.exampleVi || '');
    setEAudio(word.audio || '');
    setIsWordEditOpen(true);
  };

  const openWordDelete = (word: LearningManagement.Word) => {
    setSelectedWord(word);
    setIsWordDeleteOpen(true);
  };

  const handleWordCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wSpelling || !wMeaning) {
      toast.error('Từ vựng và Nghĩa là bắt buộc');
      return;
    }
    createWordMutation.mutate({
      word: wSpelling,
      pronunciation: wPronunciation || undefined,
      pos: wPos || undefined,
      cefr: wCefr || undefined,
      meaning: wMeaning,
      example: wExample || undefined,
      exampleVi: wExampleVi || undefined,
      audio: wAudio || undefined,
      lessonId: lessonId
    } as any);
  };

  const handleWordEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWord) return;
    if (!eSpelling || !eMeaning) {
      toast.error('Từ vựng và Nghĩa là bắt buộc');
      return;
    }
    updateWordMutation.mutate({
      id: selectedWord.id!,
      payload: {
        word: eSpelling,
        pronunciation: ePronunciation || undefined,
        pos: ePos || undefined,
        cefr: eCefr || undefined,
        meaning: eMeaning,
        example: eExample || undefined,
        exampleVi: eExampleVi || undefined,
        audio: eAudio || undefined,
        lessonId: lessonId
      } as any
    });
  };

  const handleWordDeleteConfirm = () => {
    if (!selectedWord) return;
    deleteWordMutation.mutate(selectedWord.id!);
  };

  const playAudio = (url?: string) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch(() => toast.error('Không thể phát âm thanh'));
  };

  return (
    <div className="mt-4 border-t pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Danh sách từ vựng</h4>
        <Button onClick={() => setIsWordCreateOpen(true)} size="sm" className="h-8 rounded-xl text-[10px] font-semibold flex items-center gap-1.5">
          <Plus className="h-3 w-3" />
          Thêm từ vựng
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-6 text-xs text-muted-foreground animate-pulse">Đang tải từ vựng...</div>
      ) : error ? (
        <div className="text-center py-6 text-xs text-red-500 font-medium">Lỗi khi tải từ vựng</div>
      ) : wordsList.length === 0 ? (
        <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-xl bg-muted/10">
          Chưa có từ vựng nào trong bài học này.
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden shadow-sm bg-background">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b bg-muted/20 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2">Từ vựng</th>
                  <th className="px-4 py-2">Phiên âm / Loại</th>
                  <th className="px-4 py-2">Nghĩa</th>
                  <th className="px-4 py-2">Ví dụ</th>
                  <th className="px-4 py-2 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {wordsList.map((w) => (
                  <tr key={w.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">
                      <div className="flex items-center gap-1.5">
                        {w.word}
                        {w.cefr && (
                          <Badge className="bg-primary/10 text-primary text-[8px] scale-90 px-1 py-0 border-none font-bold">
                            {w.cefr}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-muted-foreground font-mono">{w.pronunciation || '/—/'}</span>
                        {w.pos && <span className="text-[9px] text-muted-foreground font-semibold italic">{w.pos}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">{w.meaning}</td>
                    <td className="px-4 py-3">
                      {w.example ? (
                        <div className="flex flex-col max-w-[200px] leading-tight">
                          <span className="text-foreground font-medium">{w.example}</span>
                          <span className="text-muted-foreground text-[10px]">{w.exampleVi}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {w.audio && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => playAudio(w.audio)}
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => openWordEdit(w)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => openWordDelete(w)}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE WORD DIALOG */}
      <Dialog open={isWordCreateOpen} onOpenChange={setIsWordCreateOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Thêm từ vựng mới</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Nhập các trường bắt buộc dưới đây để thêm từ mới vào bài giảng.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWordCreateSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Từ vựng *</label>
                <Input
                  placeholder="Ví dụ: Hello"
                  value={wSpelling}
                  onChange={(e) => setWSpelling(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Phiên âm</label>
                <Input
                  placeholder="Ví dụ: /həˈləʊ/"
                  value={wPronunciation}
                  onChange={(e) => setWPronunciation(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Từ loại (PoS)</label>
                <Input
                  placeholder="Ví dụ: Verb, Noun"
                  value={wPos}
                  onChange={(e) => setWPos(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">CEFR Level</label>
                <Select
                  value={wCefr}
                  onChange={(val) => setWCefr(val || 'A1')}
                  options={[
                    { value: 'A1', label: 'A1' },
                    { value: 'A2', label: 'A2' },
                    { value: 'B1', label: 'B1' },
                    { value: 'B2', label: 'B2' },
                    { value: 'C1', label: 'C1' },
                    { value: 'C2', label: 'C2' }
                  ]}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Nghĩa Tiếng Việt *</label>
              <Input
                placeholder="Nghĩa của từ..."
                value={wMeaning}
                onChange={(e) => setWMeaning(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Ví dụ Tiếng Anh</label>
              <Input
                placeholder="Ví dụ câu chứa từ..."
                value={wExample}
                onChange={(e) => setWExample(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Dịch nghĩa ví dụ</label>
              <Input
                placeholder="Dịch ví dụ câu..."
                value={wExampleVi}
                onChange={(e) => setWExampleVi(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Audio phát âm (URL)</label>
              <Input
                placeholder="URL file mp3 phát âm..."
                value={wAudio}
                onChange={(e) => setWAudio(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsWordCreateOpen(false)} className="h-9 text-xs rounded-xl">
                Huỷ
              </Button>
              <Button type="submit" disabled={createWordMutation.isPending} className="h-9 text-xs rounded-xl">
                {createWordMutation.isPending ? 'Đang tạo...' : 'Tạo từ vựng'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT WORD DIALOG */}
      <Dialog open={isWordEditOpen} onOpenChange={setIsWordEditOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Chỉnh sửa từ vựng</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Cập nhật các trường thông tin của từ vựng.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWordEditSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Từ vựng *</label>
                <Input
                  value={eSpelling}
                  onChange={(e) => setESpelling(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Phiên âm</label>
                <Input
                  value={ePronunciation}
                  onChange={(e) => setEPronunciation(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Từ loại (PoS)</label>
                <Input
                  value={ePos}
                  onChange={(e) => setEPos(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">CEFR Level</label>
                <Select
                  value={eCefr}
                  onChange={(val) => setECefr(val || 'A1')}
                  options={[
                    { value: 'A1', label: 'A1' },
                    { value: 'A2', label: 'A2' },
                    { value: 'B1', label: 'B1' },
                    { value: 'B2', label: 'B2' },
                    { value: 'C1', label: 'C1' },
                    { value: 'C2', label: 'C2' }
                  ]}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Nghĩa Tiếng Việt *</label>
              <Input
                value={eMeaning}
                onChange={(e) => setEMeaning(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Ví dụ Tiếng Anh</label>
              <Input
                value={eExample}
                onChange={(e) => setEExample(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Dịch nghĩa ví dụ</label>
              <Input
                value={eExampleVi}
                onChange={(e) => setEExampleVi(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Audio phát âm (URL)</label>
              <Input
                value={eAudio}
                onChange={(e) => setEAudio(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsWordEditOpen(false)} className="h-9 text-xs rounded-xl">
                Huỷ
              </Button>
              <Button type="submit" disabled={updateWordMutation.isPending} className="h-9 text-xs rounded-xl">
                {updateWordMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE WORD CONFIRMATION */}
      {selectedWord && (
        <ConfirmModal
          isOpen={isWordDeleteOpen}
          onClose={() => setIsWordDeleteOpen(false)}
          title="Xác nhận xoá từ vựng"
          message={`Bạn có chắc chắn muốn xoá từ vựng "${selectedWord.word}" khỏi bài học? Hành động này không thể hoàn tác.`}
          onConfirm={handleWordDeleteConfirm}
          confirmText="Xoá"
          cancelText="Huỷ"
        />
      )}
    </div>
  );
};

export const AdminCourseDetailPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { courseId } = useParams({ from: '/admin/courses/$courseId' });

  // Accordion open lesson ID state
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);

  // Lesson Dialog states
  const [isLessCreateOpen, setIsLessCreateOpen] = useState(false);
  const [isLessEditOpen, setIsLessEditOpen] = useState(false);
  const [isLessDeleteOpen, setIsLessDeleteOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LearningManagement.Lesson | null>(null);

  // Form states (Lesson Create)
  const [lTitle, setLTitle] = useState('');
  const [lDescription, setLDescription] = useState('');
  const [lOrder, setLOrder] = useState('0');
  const [lIsPublished, setLIsPublished] = useState(false);

  // Form states (Lesson Edit)
  const [leTitle, setLeTitle] = useState('');
  const [leDescription, setLeDescription] = useState('');
  const [leOrder, setLeOrder] = useState('0');
  const [leIsPublished, setLeIsPublished] = useState(false);

  // Fetch Course details
  const { data: course, isLoading: isCourseLoading, error: courseError } = useQuery({
    queryKey: ['admin', 'courses', courseId],
    queryFn: () => getCourse(courseId)
  });

  // Fetch lessons inside course
  const { data: lessonsData, isLoading: isLessonsLoading, error: lessonsError } = useQuery({
    queryKey: ['admin', 'courses', courseId, 'lessons'],
    queryFn: () => getLessons({ courseId: Number(courseId), take: 100 })
  });

  const lessonsList = lessonsData?.data || [];

  // Mutations (Lesson)
  const createLessonMutation = useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      toast.success('Tạo bài học mới thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses', courseId, 'lessons'] });
      setIsLessCreateOpen(false);
      resetLessCreateForm();
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể tạo bài học');
    }
  });

  const updateLessonMutation = useMutation({
    mutationFn: ({ id, payload }: { id: App.ID; payload: LearningManagement.Lesson }) =>
      updateLesson(id, payload),
    onSuccess: () => {
      toast.success('Cập nhật bài học thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses', courseId, 'lessons'] });
      setIsLessEditOpen(false);
      setSelectedLesson(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể cập nhật bài học');
    }
  });

  const deleteLessonMutation = useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => {
      toast.success('Xoá bài học thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses', courseId, 'lessons'] });
      setIsLessDeleteOpen(false);
      setSelectedLesson(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể xoá bài học');
    }
  });

  const resetLessCreateForm = () => {
    setLTitle('');
    setLDescription('');
    setLOrder('0');
    setLIsPublished(false);
  };

  const openLessEdit = (lesson: LearningManagement.Lesson) => {
    setSelectedLesson(lesson);
    setLeTitle(lesson.title);
    setLeDescription(lesson.description || '');
    setLeOrder(String(lesson.order || 0));
    setLeIsPublished(!!lesson.isPublished);
    setIsLessEditOpen(true);
  };

  const openLessDelete = (lesson: LearningManagement.Lesson) => {
    setSelectedLesson(lesson);
    setIsLessDeleteOpen(true);
  };

  const handleLessCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lTitle) {
      toast.error('Tiêu đề bài học là bắt buộc');
      return;
    }
    createLessonMutation.mutate({
      title: lTitle,
      description: lDescription || undefined,
      order: Number(lOrder) || 0,
      isPublished: lIsPublished,
      courseId: Number(courseId)
    } as any);
  };

  const handleLessEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson) return;
    if (!leTitle) {
      toast.error('Tiêu đề bài học là bắt buộc');
      return;
    }
    updateLessonMutation.mutate({
      id: selectedLesson.id!,
      payload: {
        title: leTitle,
        description: leDescription || undefined,
        order: Number(leOrder) || 0,
        isPublished: leIsPublished,
        courseId: Number(courseId)
      } as any
    });
  };

  const handleLessDeleteConfirm = () => {
    if (!selectedLesson) return;
    deleteLessonMutation.mutate(selectedLesson.id!);
  };

  const toggleLesson = (id: number) => {
    setExpandedLessonId(expandedLessonId === id ? null : id);
  };

  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="text-center py-12 text-red-500 font-medium">
        Lỗi khi tải thông tin khoá học. Vui lòng quay lại.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/admin/courses' })}
          className="h-8 px-2 pl-0 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách khoá học
        </Button>
      </div>

      {/* Course Detail Card */}
      <div className="bg-card border rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-violet-500" />
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-primary/20">
            {course.icon || '📚'}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">{course.title}</h2>
              {course.isPublished ? (
                <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-semibold">
                  Đang hoạt động
                </Badge>
              ) : (
                <Badge className="bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 text-[9px] font-semibold">
                  Bản nháp
                </Badge>
              )}
            </div>
            {course.enTitle && <p className="text-xs text-muted-foreground font-semibold">{course.enTitle}</p>}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {course.description || 'Không có mô tả cho khoá học này.'}
            </p>
          </div>
        </div>
      </div>

      {/* Lessons List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Bài học giáo trình</h3>
          <p className="text-[10px] text-muted-foreground">Tổng số: {lessonsList.length} bài học</p>
        </div>
        <Button onClick={() => setIsLessCreateOpen(true)} className="flex items-center gap-1.5 text-xs font-semibold h-9 rounded-xl">
          <Plus className="h-4 w-4" />
          Thêm bài học mới
        </Button>
      </div>

      {/* Lessons Accordion List */}
      {isLessonsLoading ? (
        <div className="text-center py-12 text-xs text-muted-foreground animate-pulse">Đang tải bài học...</div>
      ) : lessonsError ? (
        <div className="text-center py-12 text-xs text-red-500">Lỗi khi tải danh sách bài học</div>
      ) : lessonsList.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-2xl bg-card/20 text-muted-foreground text-xs">
          Chưa có bài học nào được tạo cho khoá học này. Nhấn "Thêm bài học mới" để bắt đầu.
        </div>
      ) : (
        <div className="space-y-3">
          {lessonsList.map((lesson) => {
            const isExpanded = expandedLessonId === lesson.id;
            return (
              <div key={lesson.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                {/* Lesson Header Accordion Trigger */}
                <div
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/10 transition-colors select-none"
                  onClick={() => toggleLesson(lesson.id as number)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border shrink-0">
                      {lesson.order ?? 0}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs leading-none mb-1 text-foreground truncate">
                        {lesson.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[200px] sm:max-w-md">
                        {lesson.description || 'Chưa có mô tả bài học'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {lesson.isPublished ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] scale-90 px-1 py-0 font-bold">
                        Đang hoạt động
                      </Badge>
                    ) : (
                      <Badge className="bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 text-[8px] scale-90 px-1 py-0 font-bold">
                        Bản nháp
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLessEdit(lesson);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLessDelete(lesson);
                      }}
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t bg-card/20">
                    <LessonWordsTable lessonId={lesson.id as number} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE LESSON DIALOG */}
      <Dialog open={isLessCreateOpen} onOpenChange={setIsLessCreateOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Thêm bài học mới</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tạo bài học mới thuộc giáo trình khoá học này.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLessCreateSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Tiêu đề bài học *</label>
              <Input
                placeholder="Ví dụ: Bài 1: Greetings & Introductions"
                value={lTitle}
                onChange={(e) => setLTitle(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Mô tả bài học</label>
              <textarea
                placeholder="Bài học này giúp học viên làm quen với..."
                value={lDescription}
                onChange={(e) => setLDescription(e.target.value)}
                className="w-full text-xs rounded-xl border p-2 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Thứ tự bài học (Order)</label>
              <Input
                type="number"
                value={lOrder}
                onChange={(e) => setLOrder(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="lIsPublished"
                checked={lIsPublished}
                onChange={(e) => setLIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="lIsPublished" className="text-xs font-semibold text-foreground cursor-pointer">
                Xuất bản bài học này ngay lập tức
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsLessCreateOpen(false)} className="h-9 text-xs rounded-xl">
                Huỷ
              </Button>
              <Button type="submit" disabled={createLessonMutation.isPending} className="h-9 text-xs rounded-xl">
                {createLessonMutation.isPending ? 'Đang tạo...' : 'Tạo bài học'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT LESSON DIALOG */}
      <Dialog open={isLessEditOpen} onOpenChange={setIsLessEditOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Chỉnh sửa bài học</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Cập nhật thông tin chi tiết bài học.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLessEditSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Tiêu đề bài học *</label>
              <Input
                value={leTitle}
                onChange={(e) => setLeTitle(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Mô tả bài học</label>
              <textarea
                value={leDescription}
                onChange={(e) => setLeDescription(e.target.value)}
                className="w-full text-xs rounded-xl border p-2 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Thứ tự bài học (Order)</label>
              <Input
                type="number"
                value={leOrder}
                onChange={(e) => setLeOrder(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="leIsPublished"
                checked={leIsPublished}
                onChange={(e) => setLeIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="leIsPublished" className="text-xs font-semibold text-foreground cursor-pointer">
                Xuất bản bài học
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsLessEditOpen(false)} className="h-9 text-xs rounded-xl">
                Huỷ
              </Button>
              <Button type="submit" disabled={updateLessonMutation.isPending} className="h-9 text-xs rounded-xl">
                {updateLessonMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE LESSON CONFIRMATION */}
      {selectedLesson && (
        <ConfirmModal
          isOpen={isLessDeleteOpen}
          onClose={() => setIsLessDeleteOpen(false)}
          title="Xác nhận xoá bài học"
          message={`Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xoá bài học "${selectedLesson.title}" cùng với toàn bộ từ vựng và lịch sử học liên quan?`}
          onConfirm={handleLessDeleteConfirm}
          confirmText="Xoá"
          cancelText="Huỷ"
        />
      )}
    </div>
  );
};
export default AdminCourseDetailPage;
