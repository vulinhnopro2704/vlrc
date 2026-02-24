declare namespace Auth {
  // ── Enums ──

  type Role = 'USER' | 'ADMIN' | 'CONTENT_CREATOR';

  // ── Entities ──

  interface UserProfile extends App.Base {
    email: string;
    name: string;
    avatar?: string;
    role: Role;
  }

  // ── Auth payloads (reuse form types via Omit) ──

  type LoginPayload = Omit<LoginFormData, 'rememberMe'>;

  type RegisterPayload = Omit<RegisterFormData, 'confirmPassword'>;

  interface AuthTokens {
    accessToken: string;
    refreshToken: string;
  }

  interface AuthResponse extends AuthTokens {
    user: UserProfile;
  }

  // ── User management payloads ──

  type CreateUserPayload = Pick<UserProfile, 'email'> & {
    password: string;
    name?: string;
    role?: Role;
  };

  type UpdateUserPayload = Partial<CreateUserPayload & Pick<UserProfile, 'avatar'>>;

  interface UserQueryParams extends App.CursorPaginationParams {
    search?: string;
    role?: Role;
  }

  // ── Form types (existing) ──

  interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
  }

  interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  interface ForgotPasswordFormData {
    email: string;
  }
}
