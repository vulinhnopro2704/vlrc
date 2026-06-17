import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '@/api/user-management';
import { useAuthSession } from '@/hooks/useAuthSession';
import { toast } from '@/shared';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Edit,
  Trash,
  PenTool
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

export const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useAuthSession();

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Auth.Role | 'ALL'>('ALL');

  // Pagination states
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<Auth.UserProfile | null>(null);

  // Form states (Create)
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createName, setCreateName] = useState('');
  const [createRole, setCreateRole] = useState<Auth.Role>('USER');

  // Form states (Edit)
  const [editEmail, setEditEmail] = useState('');
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<Auth.Role>('USER');
  const [editPassword, setEditPassword] = useState(''); // Optional password change

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      // Reset pagination when filters change
      setCursors([null]);
      setPageIndex(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset pagination when role filter changes
  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val as Auth.Role | 'ALL');
    setCursors([null]);
    setPageIndex(0);
  };

  // Build query params
  const queryParams = {
    search: debouncedSearch.trim() || undefined,
    role: roleFilter === 'ALL' ? undefined : roleFilter,
    cursor: cursors[pageIndex] || undefined,
    take: pageSize
  };

  // Fetch users
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['admin', 'users', queryParams],
    queryFn: () => getUsers(queryParams),
    placeholderData: (previousData) => previousData
  });

  const usersList = usersData?.data || [];
  const pagination = usersData?.pagination;

  // Mutation: Create User
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('Thêm người dùng mới thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setIsCreateOpen(false);
      resetCreateForm();
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể tạo người dùng mới');
    }
  });

  // Mutation: Update User
  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Auth.UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      toast.success('Cập nhật người dùng thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['users', selectedUser?.id] });
      setIsEditOpen(false);
      setSelectedUser(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể cập nhật người dùng');
    }
  });

  // Mutation: Delete User
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Xoá người dùng thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setIsDeleteOpen(false);
      setSelectedUser(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Không thể xoá người dùng');
    }
  });

  // Reset forms
  const resetCreateForm = () => {
    setCreateEmail('');
    setCreatePassword('');
    setCreateName('');
    setCreateRole('USER');
  };

  const openEditModal = (user: Auth.UserProfile) => {
    setSelectedUser(user);
    setEditEmail(user.email);
    setEditName(user.name || '');
    setEditRole(user.role);
    setEditPassword('');
    setIsEditOpen(true);
  };

  const openDeleteModal = (user: Auth.UserProfile) => {
    if (user.id === currentUser?.id) {
      toast.error('Bạn không thể xoá tài khoản chính mình đang đăng nhập');
      return;
    }
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createEmail || !createPassword || !createName) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    createUserMutation.mutate({
      email: createEmail,
      password: createPassword,
      name: createName,
      role: createRole
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!editEmail || !editName) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const payload: Auth.UpdateUserPayload = {
      email: editEmail,
      name: editName,
      role: editRole
    };

    if (editPassword.trim()) {
      if (editPassword.length < 8) {
        toast.error('Mật khẩu mới phải dài từ 8 ký tự trở lên');
        return;
      }
      payload.password = editPassword;
    }

    updateUserMutation.mutate({
      id: selectedUser.id as string,
      payload
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id as string);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination?.hasMore && pagination.nextCursor) {
      const nextC = pagination.nextCursor;
      // If we haven't tracked this cursor yet, append it
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  const getRoleBadge = (role: Auth.Role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <Badge className="bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 font-medium">
            ADMIN
          </Badge>
        );
      case 'CONTENT_CREATOR':
        return (
          <Badge className="bg-violet-500/10 text-violet-500 dark:text-violet-400 border border-violet-500/20 font-medium">
            CREATOR
          </Badge>
        );
      default:
        return (
          <Badge className="bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border border-zinc-500/20 font-medium">
            USER
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner/Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Quản lý người dùng</h2>
          <p className="text-xs text-muted-foreground">
            Danh sách tất cả người dùng trong hệ thống học tiếng Anh VLRC.
          </p>
        </div>
        <Button
          onClick={() => {
            resetCreateForm();
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-2 text-xs font-semibold h-9 rounded-xl shadow-lg shadow-primary/10 self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tổng người dùng</p>
            <p className="text-lg font-bold">{pagination?.total ?? 0}</p>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quản trị viên</p>
            <p className="text-lg font-bold">Admin</p>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 rounded-xl text-violet-500">
            <PenTool className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Người tạo nội dung</p>
            <p className="text-lg font-bold">Creator</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-xs bg-background/50"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto self-start md:self-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Lọc vai trò:</span>
          <div className="w-40">
            <Select
              value={roleFilter}
              onChange={(val) => handleRoleFilterChange(val || 'ALL')}
              options={[
                { value: 'ALL', label: 'Tất cả vai trò' },
                { value: 'USER', label: 'USER' },
                { value: 'ADMIN', label: 'ADMIN' },
                { value: 'CONTENT_CREATOR', label: 'CONTENT_CREATOR' }
              ]}
              className="h-9 text-xs rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>Đang tải danh sách người dùng...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-red-500 font-medium">
                    Không thể tải danh sách người dùng. Vui lòng thử lại.
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs border">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover rounded-full" />
                          ) : (
                            user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-foreground truncate">{user.name || 'Người dùng'}</span>
                          <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                          onClick={() => openEditModal(user)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg"
                          onClick={() => openDeleteModal(user)}
                          title="Xoá"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!isLoading && usersList.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between bg-muted/10">
            <span className="text-[11px] text-muted-foreground">
              Trang {pageIndex + 1}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-semibold rounded-xl"
                disabled={pageIndex === 0}
                onClick={handlePrevPage}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-semibold rounded-xl"
                disabled={!pagination?.hasMore}
                onClick={handleNextPage}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Thêm người dùng mới</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Nhập các thông tin dưới đây để tạo tài khoản mới trên hệ thống.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Họ và tên *</label>
              <Input
                placeholder="Ví dụ: Nguyễn Văn A"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Email *</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Mật khẩu *</label>
              <Input
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Vai trò *</label>
              <Select
                value={createRole}
                onChange={(val) => setCreateRole((val || 'USER') as Auth.Role)}
                options={[
                  { value: 'USER', label: 'USER (Học viên)' },
                  { value: 'CONTENT_CREATOR', label: 'CONTENT_CREATOR (Người biên soạn)' },
                  { value: 'ADMIN', label: 'ADMIN (Quản trị viên)' }
                ]}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateOpen(false)}
                className="h-9 text-xs rounded-xl"
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="h-9 text-xs rounded-xl"
              >
                {createUserMutation.isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Cập nhật người dùng</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Thay đổi thông tin cho tài khoản: <strong className="text-foreground">{selectedUser?.email}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Họ và tên *</label>
              <Input
                placeholder="Ví dụ: Nguyễn Văn A"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Email *</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="h-9 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                Mật khẩu mới (Bỏ trống nếu không đổi)
              </label>
              <Input
                type="password"
                placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="h-9 text-xs rounded-xl"
                minLength={8}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Vai trò *</label>
              <Select
                value={editRole}
                onChange={(val) => setEditRole((val || 'USER') as Auth.Role)}
                options={[
                  { value: 'USER', label: 'USER (Học viên)' },
                  { value: 'CONTENT_CREATOR', label: 'CONTENT_CREATOR (Người biên soạn)' },
                  { value: 'ADMIN', label: 'ADMIN (Quản trị viên)' }
                ]}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                className="h-9 text-xs rounded-xl"
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="h-9 text-xs rounded-xl"
              >
                {updateUserMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      {selectedUser && (
        <ConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title="Xác nhận xoá người dùng"
          message={`Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xoá vĩnh viễn tài khoản của người dùng "${selectedUser.name || selectedUser.email}" khỏi hệ thống?`}
          onConfirm={handleDeleteConfirm}
          confirmText="Xoá vĩnh viễn"
          cancelText="Huỷ"
        />
      )}
    </div>
  );
};
export default AdminUsersPage;
