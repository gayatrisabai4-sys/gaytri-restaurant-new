import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="mb-4 h-24 w-24 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="mb-6 text-muted-foreground">Add some delicious items to get started!</p>
            <Link to="/menu">
              <Button size="lg" asChild>
                <span>Browse Menu</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map(item => (
                <Card key={item.menuItem.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.menuItem.image_url || 'https://via.placeholder.com/100'}
                          alt={item.menuItem.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{item.menuItem.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.menuItem.category}</p>
                          <p className="mt-1 text-lg font-bold text-primary">
                            ₹{item.menuItem.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center space-x-4">
                            <p className="font-semibold text-foreground">
                              ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removeFromCart(item.menuItem.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4">
              <Link to="/menu">
                <Button variant="outline" asChild>
                  <span>Continue Shopping</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/checkout" className="w-full">
                  <Button className="w-full" size="lg" asChild>
                    <span>Proceed to Checkout</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
