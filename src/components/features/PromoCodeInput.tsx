import { useState } from 'react';
import Button from '../ui/Button';
import { useCart } from '../../hooks/useCart';
import { getErrorMessage } from '../../utils/errorHandler';

const PromoCodeInput = () => {
  const { applyPromoCode } = useCart();
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      setFeedback('Please enter a promo code.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const promo = await applyPromoCode(code.trim());
      setFeedback(`Promo code ${promo.code} applied successfully.`);
      setIsSuccess(true);
    } catch (error) {
      setFeedback(getErrorMessage(error, 'Unable to apply promo code.'));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          placeholder="Enter promo code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="h-11 flex-1 rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="button" onClick={handleApply} loading={loading}>
          Apply
        </Button>
      </div>
      {feedback ? (
        <p
          data-testid="promo-feedback"
          className={`mt-3 text-sm ${isSuccess ? 'text-green-700' : 'text-red-600'}`}
        >
          {feedback}
        </p>
      ) : null}
    </section>
  );
};

export default PromoCodeInput;
