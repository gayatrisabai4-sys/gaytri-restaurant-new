export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface Reservation {
  id: string;
  customer_name: string;
  date: string;
  time: string;
  number_of_people: number;
  status: string;
  created_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CheckoutFormData {
  customer_name: string;
  phone: string;
  address: string;
  payment_method: string;
}

export interface ReservationFormData {
  customer_name: string;
  date: string;
  time: string;
  number_of_people: number;
}
