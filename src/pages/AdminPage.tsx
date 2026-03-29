import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, ShoppingBag } from 'lucide-react';

export default function AdminPage() {
  const location = useLocation();

  const tabs = [
    { name: 'Menu Management', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Admin Panel</h1>
          <div className="flex space-x-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;
              return (
                <Link key={tab.path} to={tab.path}>
                  <Button variant={isActive ? 'default' : 'outline'} asChild>
                    <span>
                      <Icon className="mr-2 h-4 w-4" />
                      {tab.name}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
