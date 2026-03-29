import { supabase } from './supabase';
import type { MenuItem, Order, OrderItem, Reservation } from '@/types/types';

// ─── Menu Items ───────────────────────────────────────────────────────────────

/** For regular users: only returns available items */
export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('category')
    .order('name');

  if (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
  return Array.isArray(data) ? (data as MenuItem[]) : [];
}

/** For admin: returns ALL items including unavailable */
export async function getAllMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('category')
    .order('name');

  if (error) {
    console.error('Error fetching all menu items:', error);
    return [];
  }
  return Array.isArray(data) ? (data as MenuItem[]) : [];
}

export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', category)
    .eq('available', true)
    .order('name');

  if (error) {
    console.error('Error fetching menu items by category:', error);
    return [];
  }
  return Array.isArray(data) ? (data as MenuItem[]) : [];
}

export async function createMenuItem(item: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert(item)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating menu item:', error);
    return null;
  }
  return data as MenuItem | null;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating menu item:', error);
    return null;
  }
  return data as MenuItem | null;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);

  if (error) {
    console.error('Error deleting menu item:', error);
    return false;
  }
  return true;
}

/** Toggle availability of a menu item (admin use) */
export async function toggleMenuItemAvailability(id: string, available: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('menu_items')
    .update({ available })
    .eq('id', id);

  if (error) {
    console.error('Error toggling availability:', error);
    return false;
  }
  return true;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function createOrder(orderData: {
  customer_name: string;
  phone: string;
  address: string;
  payment_method: string;
  total_amount: number;
  items: { menu_item_id: string; item_name: string; quantity: number; unit_price: number }[];
}): Promise<Order | null> {
  const { customer_name, phone, address, payment_method, total_amount, items } = orderData;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ customer_name, phone, address, payment_method, total_amount })
    .select()
    .maybeSingle();

  if (orderError || !order) {
    console.error('Error creating order:', orderError);
    return null;
  }

  const orderItems = items.map(item => ({
    order_id: (order as Order).id,
    menu_item_id: item.menu_item_id,
    item_name: item.item_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return null;
  }

  return order as Order;
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return Array.isArray(data) ? (data as Order[]) : [];
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) {
    console.error('Error fetching order items:', error);
    return [];
  }
  return Array.isArray(data) ? (data as OrderItem[]) : [];
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }
  return true;
}

// ─── Reservations ─────────────────────────────────────────────────────────────

export async function createReservation(reservationData: {
  customer_name: string;
  date: string;
  time: string;
  number_of_people: number;
}): Promise<Reservation | null> {
  const { data, error } = await supabase
    .from('reservations')
    .insert(reservationData)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating reservation:', error);
    return null;
  }
  return data as Reservation | null;
}

export async function getReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false });

  if (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
  return Array.isArray(data) ? (data as Reservation[]) : [];
}

export async function updateReservationStatus(reservationId: string, status: string): Promise<boolean> {
  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', reservationId);

  if (error) {
    console.error('Error updating reservation status:', error);
    return false;
  }
  return true;
}
