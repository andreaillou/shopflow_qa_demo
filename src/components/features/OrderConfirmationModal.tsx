import { useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import type { Order } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  order: Order | null;
  loading: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
}

const OrderConfirmationModal = ({
  isOpen,
  order,
  loading,
  onClose,
  onContinueShopping,
}: OrderConfirmationModalProps) => {
  const itemSummary = useMemo(() => {
    if (!order) {
      return [];
    }
    return order.items.map((item) => `${item.product_name_at_purchase} x${item.quantity}`);
  }, [order]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={loading ? 'Processing Order' : 'Order Confirmed!'} disableBackdropClose={loading}>
      {loading ? (
        <p className="text-sm text-slate-600">Please wait while your order is being processed.</p>
      ) : order ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-700">Order Confirmed!</p>
          <p data-testid="order-id" className="font-medium text-slate-900">
            {order.id}
          </p>
          <ul className="list-inside list-disc text-sm text-slate-700">
            {itemSummary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="font-semibold text-slate-900">Total paid: {formatCurrency(order.total_after_discount)}</p>
          <Button type="button" onClick={onContinueShopping}>
            Continue Shopping
          </Button>
        </div>
      ) : null}
    </Modal>
  );
};

export default OrderConfirmationModal;
