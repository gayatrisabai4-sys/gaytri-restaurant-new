import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { createOrder } from '@/db/api';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface CheckoutForm {
  customer_name: string;
  phone: string;
  address: string;
  payment_method: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const form = useForm<CheckoutForm>({
    defaultValues: {
      customer_name: '',
      phone: '',
      address: '',
      payment_method: 'cod',
    },
  });

  if (cartItems.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);

    const orderData = {
      customer_name: data.customer_name,
      phone: data.phone,
      address: data.address,
      payment_method: data.payment_method,
      total_amount: getTotalAmount(),
      items: cartItems.map(item => ({
        menu_item_id: item.menuItem.id,
        item_name: item.menuItem.name,
        quantity: item.quantity,
        unit_price: item.menuItem.price,
      })),
    };

    const order = await createOrder(orderData);

    if (order) {
      setOrderId(order.id);
      setOrderSuccess(true);
      clearCart();
      toast.success('Order placed successfully!');
    } else {
      toast.error('Order could not be placed. Please try again.');
    }

    setSubmitting(false);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <CheckCircle2 className="mb-4 h-16 w-16 text-secondary" />
              <h2 className="mb-2 text-2xl font-bold text-foreground">Order Placed Successfully!</h2>
              <p className="mb-6 text-muted-foreground">
                Thank you for your order. Your food will be delivered soon.
              </p>
              <div className="mb-6 rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono text-lg font-semibold">{orderId}</p>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/menu')}>Continue Shopping</Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="customer_name"
                      rules={{ required: 'Full name is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      rules={{
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit Indian mobile number',
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="10-digit mobile number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      rules={{ required: 'Delivery address is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your complete delivery address"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payment_method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cod" id="cod" />
                                <Label htmlFor="cod" className="cursor-pointer font-normal">
                                  Cash on Delivery (COD)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 opacity-50">
                                <RadioGroupItem value="upi" id="upi" disabled />
                                <Label htmlFor="upi" className="cursor-not-allowed font-normal">
                                  UPI <span className="text-xs text-muted-foreground">(Coming Soon)</span>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 opacity-50">
                                <RadioGroupItem value="card" id="card" disabled />
                                <Label htmlFor="card" className="cursor-not-allowed font-normal">
                                  Card <span className="text-xs text-muted-foreground">(Coming Soon)</span>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                      {submitting ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.menuItem.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.menuItem.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
