import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import ReservationPage from './pages/ReservationPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
  },
  {
    name: 'Menu',
    path: '/menu',
    element: <MenuPage />,
  },
  {
    name: 'Cart',
    path: '/cart',
    element: <CartPage />,
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: <CheckoutPage />,
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <ContactPage />,
  },
  {
    name: 'Reservation',
    path: '/reservation',
    element: <ReservationPage />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPage />,
    children: [
      {
        name: 'Admin Menu',
        path: '/admin/menu',
        element: <AdminMenuPage />,
      },
      {
        name: 'Admin Orders',
        path: '/admin/orders',
        element: <AdminOrdersPage />,
      },
    ],
  },
];

export default routes;
