import Input from '../ui/Input';
import Button from '../ui/Button';

export interface ShippingValues {
  full_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface PaymentValues {
  cardholder_name: string;
  card_number: string;
  expiry: string;
  cvv: string;
}

interface CheckoutFormProps {
  step: 1 | 2;
  shipping: ShippingValues;
  payment: PaymentValues;
  shippingErrors: Partial<Record<keyof ShippingValues, string>>;
  paymentErrors: Partial<Record<keyof PaymentValues, string>>;
  onShippingChange: (field: keyof ShippingValues, value: string) => void;
  onPaymentChange: (field: keyof PaymentValues, value: string) => void;
  onContinue: () => void;
  onBack?: () => void;
}

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Australia',
  'Japan',
  'Brazil',
  'Netherlands',
];

const CheckoutForm = ({
  step,
  shipping,
  payment,
  shippingErrors,
  paymentErrors,
  onShippingChange,
  onPaymentChange,
  onContinue,
  onBack,
}: CheckoutFormProps) => {
  if (step === 1) {
    return (
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
        <Input
          id="full_name"
          label="Full name"
          value={shipping.full_name}
          onChange={(event) => onShippingChange('full_name', event.target.value)}
          error={shippingErrors.full_name}
          required
        />
        <Input
          id="address_line_1"
          label="Address line 1"
          value={shipping.address_line_1}
          onChange={(event) => onShippingChange('address_line_1', event.target.value)}
          error={shippingErrors.address_line_1}
          required
        />
        <Input
          id="address_line_2"
          label="Address line 2 (optional)"
          value={shipping.address_line_2}
          onChange={(event) => onShippingChange('address_line_2', event.target.value)}
          error={shippingErrors.address_line_2}
        />
        <Input
          id="city"
          label="City"
          value={shipping.city}
          onChange={(event) => onShippingChange('city', event.target.value)}
          error={shippingErrors.city}
          required
        />
        <Input
          id="postal_code"
          label="Postal code"
          value={shipping.postal_code}
          onChange={(event) => onShippingChange('postal_code', event.target.value)}
          error={shippingErrors.postal_code}
          required
        />

        <div className="space-y-1">
          <label htmlFor="country" className="block text-sm font-medium text-slate-800">
            Country
          </label>
          <select
            id="country"
            value={shipping.country}
            onChange={(event) => onShippingChange('country', event.target.value)}
            className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {shippingErrors.country ? (
            <p className="text-sm text-red-600">{shippingErrors.country}</p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
      <Input
        id="cardholder_name"
        label="Cardholder name"
        value={payment.cardholder_name}
        onChange={(event) => onPaymentChange('cardholder_name', event.target.value)}
        error={paymentErrors.cardholder_name}
        required
      />
      <Input
        id="card_number"
        label="Card number"
        placeholder="XXXX XXXX XXXX XXXX"
        value={payment.card_number}
        onChange={(event) => onPaymentChange('card_number', event.target.value)}
        error={paymentErrors.card_number}
        required
      />
      <Input
        id="expiry"
        label="Expiry date"
        placeholder="MM/YY"
        value={payment.expiry}
        onChange={(event) => onPaymentChange('expiry', event.target.value)}
        error={paymentErrors.expiry}
        required
      />
      <Input
        id="cvv"
        label="CVV"
        type="password"
        value={payment.cvv}
        onChange={(event) => onPaymentChange('cvv', event.target.value)}
        error={paymentErrors.cvv}
        required
      />

      <div className="flex items-center justify-between">
        {onBack ? (
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="button" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;
