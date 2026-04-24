import Input from '../ui/Input';
import Button from '../ui/Button';

interface AuthFormProps {
  mode: 'login' | 'register';
  email: string;
  password: string;
  confirmPassword?: string;
  errors?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  };
  loading?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange?: (value: string) => void;
  onSubmit: () => void;
}

const AuthForm = ({
  mode,
  email,
  password,
  confirmPassword = '',
  errors,
  loading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: AuthFormProps) => {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Input
        id="email"
        label="Email address"
        type="email"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        required
      />
      {mode === 'register' ? (
        <Input
          id="confirm_password"
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(event) => onConfirmPasswordChange?.(event.target.value)}
          required
        />
      ) : null}

      {errors?.general ? <p className="text-sm text-red-600">{errors.general}</p> : null}

      <Button type="submit" loading={loading} className="w-full">
        {mode === 'login' ? 'Sign in' : 'Create account'}
      </Button>
    </form>
  );
};

export default AuthForm;
