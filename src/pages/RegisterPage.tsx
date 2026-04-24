import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../components/features/AuthForm';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/errorHandler';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handleSubmit = async () => {
    setEmailError('');
    setPasswordError('');
    setConfirmError('');

    let hasError = false;
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      hasError = true;
    }
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      hasError = true;
    }
    if (hasError) {
      return;
    }

    setLoading(true);
    try {
      await register({ email, password, confirmPassword });
      navigate('/products');
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to register.');
      setEmailError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="mb-4 text-2xl font-semibold">Create account</h1>
        <AuthForm
          mode="register"
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleSubmit}
          loading={loading}
        />
        {emailError ? (
          <p data-testid="register-error-email" className="mt-2 text-sm text-red-600">
            {emailError}
          </p>
        ) : null}
        {passwordError ? (
          <p data-testid="register-error-password" className="mt-2 text-sm text-red-600">
            {passwordError}
          </p>
        ) : null}
        {confirmError ? (
          <p data-testid="register-error-confirm" className="mt-2 text-sm text-red-600">
            {confirmError}
          </p>
        ) : null}

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default RegisterPage;
