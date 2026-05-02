declare namespace Auth {
  type Role = 'USER' | 'ADMIN' | 'CONTENT_CREATOR';

  interface UserProfile extends App.Base {
    email: string;
    name: string;
    avatar?: string;
    role: Role;
    emailVerifiedAt?: string | null;
  }

  type LoginPayload = Omit<LoginFormData, 'rememberMe'>;
  type RegisterPayload = Omit<RegisterFormData, 'confirmPassword'>;

  interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
  }

  interface AuthResponse extends AuthTokens {
    user: UserProfile;
  }

  interface MessageResponse {
    message: string;
  }

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

  interface VerifyEmailPayload {
    token: string;
  }

  interface ResendVerificationPayload {
    email: string;
  }

  interface ForgotPasswordPayload {
    email: string;
  }

  interface ResetPasswordPayload {
    token: string;
    password: string;
  }
}
