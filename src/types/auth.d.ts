declare namespace Auth {
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
