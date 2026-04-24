import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm, { type PaymentValues, type ShippingValues } from '../components/features/CheckoutForm';
import OrderConfirmationModal from '../components/features/OrderConfirmationModal';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { placeOrder } from '../api/orders';
import { useCart } from '../hooks/useCart';
import { formatCurrency, maskCardNumber } from '../utils/formatters';
import { isValidCardNumber, isValidCvv, isValidExpiry, isValidPostalCode } from '../utils/validators';
import type { Order } from '../types';

interface StepState {
  step: 1 | 2 | 3;
}

type StepAction = { type: 'NEXT' } | { type: 'BACK' } | { type: 'GO'; payload: 1 | 2 | 3 };

const reducer = (state: StepState, action: StepAction): StepState => {
  if (action.type === 'NEXT') {
    return { step: Math.min(3, state.step + 1) as 1 | 2 | 3 };
  }
  if (action.type === 'BACK') {
    return { step: Math.max(1, state.step - 1) as 1 | 2 | 3 };
  }
  return { step: action.payload };
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, promoDiscount, totalAfterDiscount, promoCode, clearCart } = useCart();
  const [stepState, dispatch] = useReducer(reducer, { step: 1 });

  const [shipping, setShipping] = useState<ShippingValues>({
    full_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postal_code: '',
    country: '',
  });

  const [payment, setPayment] = useState<PaymentValues>({
    cardholder_name: '',
    card_number: '',
    expiry: '',
    cvv: '',
  });

  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingValues, string>>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentValues, string>>>({});
  const [order, setOrder] = useState<Order | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const updateShipping = (field: keyof ShippingValues, value: string) => {
    setShipping((previous) => ({ ...previous, [field]: value }));
  };

  const formatCardNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const updatePayment = (field: keyof PaymentValues, value: string) => {
    if (field === 'card_number') {
      setPayment((previous) => ({ ...previous, card_number: formatCardNumber(value) }));
      return;
    }
    if (field === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      setPayment((previous) => ({ ...previous, expiry: formatted }));
      return;
    }
    if (field === 'cvv') {
      setPayment((previous) => ({ ...previous, cvv: value.replace(/\D/g, '').slice(0, 4) }));
      return;
    }
    setPayment((previous) => ({ ...previous, [field]: value }));
  };

  const continueFromShipping = () => {
    const nextErrors: Partial<Record<keyof ShippingValues, string>> = {};

    if (!shipping.full_name.trim()) nextErrors.full_name = 'Full name is required.';
    if (!shipping.address_line_1.trim()) nextErrors.address_line_1 = 'Address line 1 is required.';
    if (!shipping.city.trim()) nextErrors.city = 'City is required.';
    if (!shipping.country.trim()) nextErrors.country = 'Country is required.';
    if (!shipping.postal_code.trim()) {
      nextErrors.postal_code = 'Postal code is required.';
    } else if (!isValidPostalCode(shipping.postal_code)) {
      nextErrors.postal_code = 'Postal code format is invalid.';
    }

    setShippingErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      dispatch({ type: 'NEXT' });
    }
  };

  const continueFromPayment = () => {
    const nextErrors: Partial<Record<keyof PaymentValues, string>> = {};

    if (!payment.cardholder_name.trim()) nextErrors.cardholder_name = 'Cardholder name is required.';
    if (!isValidCardNumber(payment.card_number)) nextErrors.card_number = 'Card number must be 16 digits.';
    if (!isValidExpiry(payment.expiry)) nextErrors.expiry = 'Expiry must be MM/YY.';
    if (!isValidCvv(payment.cvv)) nextErrors.cvv = 'CVV must be 3 or 4 digits.';

    setPaymentErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      dispatch({ type: 'NEXT' });
    }
  };

  const handlePlaceOrder = async () => {
    setError('');
    setIsPlacingOrder(true);
    setModalOpen(true);
    try {
      const result = await placeOrder({
        shipping: {
          full_name: shipping.full_name,
          address_line_1: shipping.address_line_1,
          address_line_2: shipping.address_line_2 || undefined,
          city: shipping.city,
          postal_code: shipping.postal_code,
          country: shipping.country,
        },
        payment: {
          cardholder_name: payment.cardholder_name,
          card_number_last4: payment.card_number.replace(/\s/g, '').slice(-4),
        },
        promo_code: promoCode ?? undefined,
      });
      setOrder(result);
      clearCart();
    } catch {
      setError('Failed to place order.');
      setModalOpen(false);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>

        <div data-testid="checkout-step-indicator" className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              type="button"
              data-testid={`checkout-step-${step}`}
              aria-current={stepState.step === step ? 'step' : undefined}
              className={`h-11 min-w-[44px] rounded-full px-4 text-sm font-medium ${stepState.step === step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}
              onClick={() => dispatch({ type: 'GO', payload: step as 1 | 2 | 3 })}
            >
              Step {step}
            </button>
          ))}
        </div>

        {stepState.step === 1 ? (
          <CheckoutForm
            step={1}
            shipping={shipping}
            payment={payment}
            shippingErrors={shippingErrors}
            paymentErrors={paymentErrors}
            onShippingChange={updateShipping}
            onPaymentChange={updatePayment}
            onContinue={continueFromShipping}
          />
        ) : null}

        {stepState.step === 2 ? (
          <CheckoutForm
            step={2}
            shipping={shipping}
            payment={payment}
            shippingErrors={shippingErrors}
            paymentErrors={paymentErrors}
            onShippingChange={updateShipping}
            onPaymentChange={updatePayment}
            onContinue={continueFromPayment}
            onBack={() => dispatch({ type: 'BACK' })}
          />
        ) : null}

        {stepState.step === 3 ? (
          <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Shipping summary</h2>
              <p className="text-sm text-slate-600">{shipping.full_name}</p>
              <p className="text-sm text-slate-600">{shipping.address_line_1}</p>
              {shipping.address_line_2 ? <p className="text-sm text-slate-600">{shipping.address_line_2}</p> : null}
              <p className="text-sm text-slate-600">
                {shipping.city} {shipping.postal_code}
              </p>
              <p className="text-sm text-slate-600">{shipping.country}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">Payment summary</h2>
              <p className="text-sm text-slate-600">{payment.cardholder_name}</p>
              <p className="text-sm text-slate-600">{maskCardNumber(payment.card_number.replace(/\s/g, '').slice(-4))}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">Items</h2>
              <ul className="space-y-1 text-sm text-slate-700">
                {items.map((item) => (
                  <li key={item.id}>
                    {item.product.name} x{item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-slate-700">Subtotal: {formatCurrency(subtotal)}</p>
              {promoDiscount > 0 ? <p className="text-sm text-green-700">Discount: -{promoDiscount}%</p> : null}
              <p className="font-semibold text-slate-900">Total: {formatCurrency(totalAfterDiscount)}</p>
            </div>

            {error ? <ErrorMessage message={error} /> : null}

            <div className="flex items-center justify-between">
              <Button type="button" variant="secondary" onClick={() => dispatch({ type: 'BACK' })}>
                Back
              </Button>
              <Button type="button" onClick={handlePlaceOrder} loading={isPlacingOrder}>
                Place Order
              </Button>
            </div>
          </section>
        ) : null}
      </div>

      <OrderConfirmationModal
        isOpen={modalOpen}
        order={order}
        loading={isPlacingOrder}
        onClose={() => {
          if (!isPlacingOrder) {
            setModalOpen(false);
          }
        }}
        onContinueShopping={() => {
          setModalOpen(false);
          setOrder(null);
          navigate('/products');
        }}
      />
    </PageWrapper>
  );
};

export default CheckoutPage;
