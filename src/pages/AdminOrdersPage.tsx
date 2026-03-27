import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getOrders, getOrderItems, updateOrderStatus } from '@/db/api';
import type { Order, OrderItem } from '@/types/types';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ORDER_STATUSES = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);
    setLoading(false);
  };

  const loadOrderItems = async (orderId: string) => {
    if (!orderItems[orderId]) {
      const items = await getOrderItems(orderId);
      setOrderItems(prev => ({ ...prev, [orderId]: items }));
    }
  };

  const toggleOrderExpansion = async (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
      await loadOrderItems(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      toast.success('Order status updated');
      loadOrders();
    } else {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-muted text-muted-foreground';
      case 'preparing':
        return 'bg-primary/10 text-primary';
      case 'ready':
        return 'bg-secondary/10 text-secondary';
      case 'delivered':
        return 'bg-secondary text-secondary-foreground';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Order Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {orders.map(order => (
                        <>
                          <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleOrderExpansion(order.id)}
                              >
                                {expandedOrders.has(order.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {order.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>{order.customer_name}</TableCell>
                            <TableCell>{order.phone}</TableCell>
                            <TableCell className="font-semibold">
                              ₹{order.total_amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="uppercase">{order.payment_method}</TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={value => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue>
                                    <Badge className={getStatusColor(order.status)}>
                                      {order.status}
                                    </Badge>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {ORDER_STATUSES.map(status => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              {new Date(order.created_at).toLocaleDateString('en-IN')}
                            </TableCell>
                          </TableRow>
                          {expandedOrders.has(order.id) && (
                            <TableRow>
                              <TableCell colSpan={8} className="bg-muted/30 p-4">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="mb-2 font-semibold">Delivery Address:</h4>
                                    <p className="text-sm text-muted-foreground">{order.address}</p>
                                  </div>
                                  <div>
                                    <h4 className="mb-2 font-semibold">Order Items:</h4>
                                    {orderItems[order.id] ? (
                                      <div className="space-y-2">
                                        {orderItems[order.id].map(item => (
                                          <div
                                            key={item.id}
                                            className="flex justify-between text-sm"
                                          >
                                            <span>
                                              {item.item_name} × {item.quantity}
                                            </span>
                                            <span className="font-medium">
                                              ₹{(item.unit_price * item.quantity).toFixed(2)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">Loading...</p>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
