import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import type { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CartItemProps {
  item: CartItemType;
  onIncrease: (nextQuantity: number) => Promise<void>;
  onDecrease: (nextQuantity: number) => Promise<void>;
  onRemove: () => Promise<void>;
}

const CartItem = ({ item, onIncrease, onDecrease, onRemove }: CartItemProps) => {
  const [optimisticQuantity, setOptimisticQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setOptimisticQuantity(item.quantity);
  }, [item.quantity]);

  const increase = async () => {
    const next = optimisticQuantity + 1;
    setOptimisticQuantity(next);
    setIsUpdating(true);
    try {
      await onIncrease(next);
    } finally {
      setIsUpdating(false);
    }
  };

  const decrease = async () => {
    if (optimisticQuantity <= 1) {
      return;
    }
    const next = optimisticQuantity - 1;
    setOptimisticQuantity(next);
    setIsUpdating(true);
    try {
      await onDecrease(next);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <article
      data-testid="cart-item"
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
    >
      <div>
        <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
        <p className="text-sm text-slate-600">{formatCurrency(item.product.price)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={decrease} disabled={isUpdating}>
          −
        </Button>
        <span className="inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-md border border-slate-300 px-3 text-sm">
          {optimisticQuantity}
        </span>
        <Button type="button" variant="secondary" size="sm" onClick={increase} disabled={isUpdating}>
          +
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <p className="font-semibold text-slate-800">{formatCurrency(item.product.price * optimisticQuantity)}</p>
        <Button type="button" variant="danger" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </article>
  );
};

export default CartItem;
