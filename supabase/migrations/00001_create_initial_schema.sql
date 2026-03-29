-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  email text,
  role user_role NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  category text NOT NULL,
  image_url text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  payment_method text NOT NULL DEFAULT 'cod',
  total_amount numeric(10, 2) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  number_of_people integer NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create helper function to check admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (format: username@miaoda.com)
  extracted_username := split_part(NEW.email, '@', 1);
  
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    extracted_username,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Trigger for user registration
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Menu items policies (public read, admin write)
CREATE POLICY "Anyone can view menu items" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert menu items" ON menu_items
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update menu items" ON menu_items
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete menu items" ON menu_items
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Orders policies (anyone can insert, admin can view all)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- Order items policies
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view order items" ON order_items
  FOR SELECT USING (true);

-- Reservations policies
CREATE POLICY "Anyone can create reservations" ON reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view reservations" ON reservations
  FOR SELECT USING (true);

CREATE POLICY "Admins can update reservations" ON reservations
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- Insert sample menu data
INSERT INTO menu_items (name, description, price, category, image_url) VALUES
  ('Paneer Butter Masala', 'Cottage cheese cubes in rich tomato and butter gravy', 220, 'Main Course', '/images/paneer_butter_masala.png'),
  ('Butter Naan', 'Soft leavened bread brushed with butter', 40, 'Indian Breads', '/images/butter_naan.png'),
  ('Samosa', 'Crispy pastry filled with spiced potatoes and peas', 60, 'Starters', '/images/samosa.png'),
  ('Chicken Biryani', 'Aromatic basmati rice with tender chicken and spices', 280, 'Main Course', '/images/chicken_biryani.png'),
  ('Tandoori Chicken', 'Marinated chicken grilled in traditional clay oven', 320, 'Starters', '/images/tandoori_chicken.png'),
  ('Dal Makhani', 'Black lentils slow-cooked with butter and cream', 180, 'Main Course', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000&auto=format&fit=crop'),
  ('Gulab Jamun', 'Deep-fried milk dumplings soaked in rose syrup', 80, 'Desserts', 'https://images.unsplash.com/photo-1589119908995-c6800ffca830?q=80&w=1000&auto=format&fit=crop'),
  ('Mango Lassi', 'Refreshing yogurt drink with mango pulp', 70, 'Beverages', 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1000&auto=format&fit=crop'),
  ('Garlic Naan', 'Naan bread topped with fresh garlic and coriander', 50, 'Indian Breads', 'https://images.unsplash.com/photo-1601050690597-df056fb27791?q=80&w=1000&auto=format&fit=crop'),
  ('Masala Chai', 'Traditional Indian spiced tea', 40, 'Beverages', 'https://images.unsplash.com/photo-1571935445831-7000af7dc69d?q=80&w=1000&auto=format&fit=crop'),
  ('Chole Bhature', 'Spicy chickpeas served with deep-fried leavened bread', 150, 'Main Course', 'https://images.unsplash.com/photo-1626132646529-5006375bc912?q=80&w=1000&auto=format&fit=crop'),
  ('Pav Bhaji', 'Mashed vegetable curry served with buttered bread rolls', 140, 'Main Course', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1000&auto=format&fit=crop'),
  ('Rasgulla', 'Soft cottage cheese balls in thin sugar syrup', 90, 'Desserts', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1000&auto=format&fit=crop'),
  ('Lemonade', 'Fresh Indian style lime juice with mint', 50, 'Beverages', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop');