import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';

export function Navbar() {
  const location = useLocation();
  const { getCartCount } = useCart();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = getCartCount();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reservation', path: '/reservation' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">Gayatri Restaurant</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? 'text-primary' : 'text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname.startsWith('/admin') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <span>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </span>
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="hidden items-center space-x-2 md:flex">
              <span className="text-sm text-muted-foreground">
                {profile?.username || 'User'}
              </span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button variant="ghost" size="icon" asChild>
                <span>
                  <User className="h-5 w-5" />
                </span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 pt-8">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium transition-colors hover:text-primary ${
                      location.pathname === link.path ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium transition-colors hover:text-primary ${
                      location.pathname.startsWith('/admin') ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <div className="border-t border-border pt-4">
                  {user ? (
                    <>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {profile?.username || 'User'}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full" asChild>
                        <span>
                          <User className="mr-2 h-4 w-4" />
                          Sign In
                        </span>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
