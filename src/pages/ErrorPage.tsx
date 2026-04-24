import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';

const contentByType: Record<string, { title: string; message: string }> = {
  '404': {
    title: 'Page not found',
    message: "The page you're looking for doesn't exist.",
  },
  '500': {
    title: 'Something went wrong',
    message: 'There was a server error. Please try again later.',
  },
  '401': {
    title: 'Access denied',
    message: 'You need to be signed in to view this page.',
  },
  network: {
    title: 'Connection failed',
    message: 'Could not connect to the server. Check your internet connection.',
  },
};

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') ?? '404';

  const content = useMemo(() => contentByType[type] ?? contentByType['404'], [type]);

  return (
    <PageWrapper>
      <section
        data-testid="error-page-type"
        data-error-type={type}
        className="mx-auto max-w-lg rounded-lg border border-slate-200 bg-white p-8 text-center"
      >
        <h1 className="text-3xl font-semibold text-slate-900">{content.title}</h1>
        <p className="mt-3 text-slate-600">{content.message}</p>
        <p className="mt-3 text-sm text-slate-500">{type}</p>
        <div className="mt-6">
          <Button
            type="button"
            onClick={() => {
              window.history.back();
            }}
          >
            Go back
          </Button>
        </div>
      </section>
    </PageWrapper>
  );
};

export default ErrorPage;
