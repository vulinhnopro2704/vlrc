import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses, createCourse, updateCourse, deleteCourse } from '@/api/course-management';
import { useNavigate } from '@tanstack/react-router';
import { toast } from '@/shared';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash,
  Eye
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

export const AdminCoursesPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Search & Filter states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // Pagination states
  const [cursors, setCursors] = useState<(string | number | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 12;

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<LearningManagement.Course | null>(null);

  // Form states (Create)
  const [createTitle, setCreateTitle] = useState('');
  const [createEnTitle, setCreateEnTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createIcon, setCreateIcon] = useState('');
  const [createImage, setCreateImage] = useState('');
  const [createIsPublished, setCreateIsPublished] = useState(false);

  // Form states (Edit)
  const [editTitle, setEditTitle] = useState('');
  const [editEnTitle, setEditEnTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editIsPublished, setEditIsPublished] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCursors([null]);
      setPageIndex(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val as any);
    setCursors([null]);
    setPageIndex(0);
  };

  // Build params
  const queryParams = {
    search: debouncedSearch.trim() || undefined,
    isPublished: statusFilter === 'ALL' ? undefined : statusFilter === 'PUBLISHED',
    cursor: cursors[pageIndex] as any,
    take: pageSize
  };

  // Fetch courses
  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ['admin', 'courses', queryParams],
    queryFn: () => getCourses(queryParams),
    placeholderData: (previousData) => previousData
  });

  const coursesList = coursesData?.data || [];

  // Mutations
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success('Tạo khoá học mới thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      setIsCreateOpen(false);
      resetCreateForm();
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể tạo khoá học');
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, payload }: { id: App.ID; payload: LearningManagement.Course }) =>
      updateCourse(id, payload),
    onSuccess: () => {
      toast.success('Cập nhật khoá học thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      setIsEditOpen(false);
      setSelectedCourse(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể cập nhật khoá học');
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success('Xoá khoá học thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      setIsDeleteOpen(false);
      setSelectedCourse(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể xoá khoá học');
    }
  });

  const resetCreateForm = () => {
    setCreateTitle('');
    setCreateEnTitle('');
    setCreateDescription('');
    setCreateIcon('📚');
    setCreateImage('');
    setCreateIsPublished(false);
  };

  const openEditModal = (course: LearningManagement.Course) => {
    setSelectedCourse(course);
    setEditTitle(course.title);
    setEditEnTitle(course.enTitle || '');
    setEditDescription(course.description || '');
    setEditIcon(course.icon || '📚');
    setEditImage(course.image || '');
    setEditIsPublished(!!course.isPublished);
    setIsEditOpen(true);
  };

  const openDeleteModal = (course: LearningManagement.Course) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle) {
      toast.error('Tiêu đề là bắt buộc');
      return;
    }
    createCourseMutation.mutate({
      title: createTitle,
      enTitle: createEnTitle || undefined,
      description: createDescription || undefined,
      icon: createIcon || undefined,
      image: createImage || undefined,
      isPublished: createIsPublished
    } as any);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    if (!editTitle) {
      toast.error('Tiêu đề là bắt buộc');
      return;
    }
    updateCourseMutation.mutate({
      id: selectedCourse.id!,
      payload: {
        title: editTitle,
        enTitle: editEnTitle || undefined,
        description: editDescription || undefined,
        icon: editIcon || undefined,
        image: editImage || undefined,
        isPublished: editIsPublished
      } as any
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedCourse) return;
    deleteCourseMutation.mutate(selectedCourse.id!);
  };

  // Pagination
  const handleNextPage = () => {
    if (coursesData?.nextCursor) {
      const nextC = coursesData.nextCursor;
      if (cursors.length <= pageIndex + 1) {
        setCursors([...cursors, nextC]);
      }
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Quản lý khoá học</h2>
          <p className="text-xs text-muted-foreground">
            Thiết kế khoá học tiếng Anh, bài giảng, và phân loại từ vựng học tập.
          </p>
        </div>
        <Button
          onClick={() => {
            resetCreateForm();
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-2 text-xs font-semibold h-9 rounded-xl shadow-lg shadow-primary/10 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Tạo khoá học mới
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khoá học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-xs bg-background/50"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto self-start md:self-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Trạng thái:</span>
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={(val) => handleStatusFilterChange(val || 'ALL')}
              options={[
                { value: 'ALL', label: 'Tất cả' },
                { value: 'PUBLISHED', label: 'Đã xuất bản' },
                { value: 'DRAFT', label: 'Bản nháp' }
              ]}
              className="h-9 text-xs rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Courses Grid List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <span className="text-xs text-muted-foreground">Đang tải danh sách khoá học...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 font-medium border rounded-2xl bg-card">
          Lỗi khi tải danh sách khoá học. Vui lòng thử lại.
        </div>
      ) : coursesList.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl bg-card/20">
          Chưa có khoá học nào được tạo. Nhấn "Tạo khoá học mới" để bắt đầu.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesList.map((course) => (
            <div
              key={course.id}
              className="bg-card border rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col group relative"
            >
              {/* Top cover placeholder if image doesn't exist */}
              <div className="h-28 bg-gradient-to-tr from-primary/10 to-violet-500/10 border-b flex items-center justify-center text-4xl relative">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                ) : (
                  <span>{course.icon || '📚'}</span>
                )}
                {/* Published status badge */}
                <div className="absolute top-3 right-3">
                  {course.isPublished ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-semibold">
                      Hoạt động
                    </Badge>
                  ) : (
                    <Badge className="bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 text-[9px] font-semibold">
                      Bản nháp
                    </Badge>
                  )}
                </div>
              </div>

              {/* Card content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  {course.enTitle && (
                    <p className="text-[11px] text-muted-foreground font-medium mb-2">{course.enTitle}</p>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {course.description || 'Chưa có mô tả ngắn về khoá học này.'}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    <strong>{course.totalLessons ?? course.lessons?.length ?? 0}</strong> bài học
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate({ to: `/admin/courses/${course.id}` })}
                      title="Xem chi tiết & quản lý bài học"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => openEditModal(course)}
                      title="Chỉnh sửa khoá học"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => openDeleteModal(course)}
                      title="Xoá khoá học"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {!isLoading && coursesList.length > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">Trang {pageIndex + 1}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl px-4 text-xs font-semibold"
              disabled={pageIndex === 0}
              onClick={handlePrevPage}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl px-4 text-xs font-semibold"
              disabled={!coursesData?.hasMore}
              onClick={handleNextPage}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {/* CREATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Tạo khoá học mới</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Nhập tiêu đề và mô tả của khoá học để hiển thị cho học sinh.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Tên khoá học (Tiếng Việt) *</label>
              <Input
                placeholder="Ví dụ: Tiếng Anh giao tiếp cơ bản"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Tên Tiếng Anh (Tùy chọn)</label>
              <Input
                placeholder="Ví dụ: Basic English Communication"
                value={createEnTitle}
                onChange={(e) => setCreateEnTitle(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Mô tả ngắn</label>
              <textarea
                placeholder="Nhập mô tả tóm tắt khoá học..."
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                className="w-full text-xs rounded-xl border p-2 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Icon (Emoji) *</label>
                <Input
                  value={createIcon}
                  onChange={(e) => setCreateIcon(e.target.value)}
                  className="h-9 text-xs rounded-xl text-center"
                  maxLength={4}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Ảnh bìa (URL)</label>
                <Input
                  placeholder="https://..."
                  value={createImage}
                  onChange={(e) => setCreateImage(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="createIsPublished"
                checked={createIsPublished}
                onChange={(e) => setCreateIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="createIsPublished" className="text-xs font-semibold text-foreground cursor-pointer">
                Xuất bản khoá học này ngay lập tức
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="h-9 text-xs rounded-xl">
                Huỷ
              </Button>
              <Button type="submit" disabled={createCourseMutation.isPending} className="h-9 text-xs rounded-xl">
                {createCourseMutation.isPending ? 'Đang tạo...' : 'Tạo khoá học'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Chỉnh sửa khoá học</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Cập nhật các thông tin của khoá học.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Tên khoá học (Tiếng Việt) *</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Tên Tiếng Anh</label>
              <Input
                value={editEnTitle}
                onChange={(e) => setEditEnTitle(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Mô tả ngắn</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full text-xs rounded-xl border p-2 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Icon (Emoji) *</label>
                <Input
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                  className="h-9 text-xs rounded-xl text-center"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">Ảnh bìa (URL)</label>
                <Input
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="editIsPublished"
                checked={editIsPublished}
                onChange={(e) => setEditIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="editIsPublished" className="text-xs font-semibold text-foreground cursor-pointer">
                Xuất bản khoá học
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="h-9 text-xs rounded-xl">
                Huỷ
              </Button>
              <Button type="submit" disabled={updateCourseMutation.isPending} className="h-9 text-xs rounded-xl">
                {updateCourseMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      {selectedCourse && (
        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title="Xác nhận xoá khoá học"
          message={`Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xoá vĩnh viễn khoá học "${selectedCourse.title}" cùng với tất cả các bài học và từ vựng đi kèm?`}
          onConfirm={handleDeleteConfirm}
          confirmText="Xoá vĩnh viễn"
          cancelText="Huỷ"
        />
      )}
    </div>
  );
};
export default AdminCoursesPage;
