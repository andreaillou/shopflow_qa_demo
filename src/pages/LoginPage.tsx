import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../components/features/AuthForm';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/errorHandler';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      const redirect = new URLSearchParams(location.search).get('redirect');
      navigate(redirect === 'cart' ? '/cart' : '/products');
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
        <AuthForm
          mode="login"
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          loading={loading}
        />
        {error ? (
          <p data-testid="login-error" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}
        <p className="mt-4 text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700">
            Register
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;
