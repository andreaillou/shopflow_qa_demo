import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/features/CartItem';
import PromoCodeInput from '../components/features/PromoCodeInput';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatters';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, subtotal, totalAfterDiscount, promoDiscount, removeItem, updateQuantity } = useCart();

  if (!isAuthenticated) {
    navigate('/login?redirect=cart');
    return null;
  }

  if (items.length === 0) {
    return (
      <PageWrapper>
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <p className="text-lg font-medium text-slate-900">Your cart is empty</p>
          <Link to="/products" className="mt-3 inline-block text-blue-600 hover:text-blue-700">
            Continue shopping
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Your Cart</h1>

        <div className="space-y-3">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={(next) => updateQuantity(item.id, next)}
              onDecrease={(next) => updateQuantity(item.id, next)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>

        <PromoCodeInput />

        <section className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
          <p data-testid="cart-subtotal" className="text-sm text-slate-700">
            Subtotal: {formatCurrency(subtotal)}
          </p>
          {promoDiscount > 0 ? (
            <p data-testid="cart-discount" className="text-sm text-green-700">
              Discount: -{promoDiscount}%
            </p>
          ) : null}
          <p data-testid="cart-total" className="text-lg font-semibold text-slate-900">
            Total: {formatCurrency(totalAfterDiscount)}
          </p>

          <Button type="button" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
        </section>
      </div>
    </PageWrapper>
  );
};

export default CartPage;
