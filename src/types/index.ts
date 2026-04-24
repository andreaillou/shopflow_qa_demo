export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  expires_at: string;
  is_active: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  promo_code_id: string | null;
  subtotal_before_discount: number;
  discount_amount: number;
  total_after_discount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_at_purchase: string;
  price_at_purchase: number;
  quantity: number;
  line_total: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PlaceOrderPayload {
  shipping: {
    full_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  payment: {
    cardholder_name: string;
    card_number_last4: string;
  };
  promo_code?: string;
}
