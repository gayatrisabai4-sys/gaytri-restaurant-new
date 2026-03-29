import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
} from '@/db/api';
import type { MenuItem } from '@/types/types';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const CATEGORIES = ['Starters', 'Main Course', 'Indian Breads', 'Beverages', 'Desserts'];
const DEFAULT_FOOD_IMG = '/default-food.png';

interface MenuItemForm {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const form = useForm<MenuItemForm>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: 'Main Course',
      image_url: '',
    },
  });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    // Admin sees ALL items including unavailable
    const items = await getAllMenuItems();
    setMenuItems(items);
    setLoading(false);
  };

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      form.reset({
        name: item.name,
        description: item.description ?? '',
        price: item.price,
        category: item.category,
        image_url: item.image_url ?? '',
      });
    } else {
      setEditingItem(null);
      form.reset({
        name: '',
        description: '',
        price: 0,
        category: 'Main Course',
        image_url: '',
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = async (data: MenuItemForm) => {
    if (editingItem) {
      const updated = await updateMenuItem(editingItem.id, {
        ...data,
        available: editingItem.available,
      });
      if (updated) {
        toast.success('Menu item updated successfully');
        await loadMenuItems();
        setDialogOpen(false);
      } else {
        toast.error('Failed to update menu item');
      }
    } else {
      const created = await createMenuItem({ ...data, available: true });
      if (created) {
        toast.success('Menu item created successfully');
        await loadMenuItems();
        setDialogOpen(false);
      } else {
        toast.error('Failed to create menu item');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteMenuItem(id);
    if (success) {
      toast.success('Menu item deleted');
      await loadMenuItems();
    } else {
      toast.error('Failed to delete menu item');
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    setTogglingId(item.id);
    const success = await toggleMenuItemAvailability(item.id, !item.available);
    if (success) {
      toast.success(`${item.name} is now ${!item.available ? 'available' : 'unavailable'}`);
      await loadMenuItems();
    } else {
      toast.error('Failed to update availability');
    }
    setTogglingId(null);
  };

  const availableCount = menuItems.filter(i => i.available).length;
  const unavailableCount = menuItems.filter(i => !i.available).length;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{menuItems.length}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-secondary">{availableCount}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-destructive">{unavailableCount}</p>
              <p className="text-sm text-muted-foreground">Unavailable</p>
            </CardContent>
          </Card>
        </div>

        {/* Header with Add Button */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Menu Items</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: 'Name is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Item name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      rules={{
                        required: 'Price is required',
                        min: { value: 0, message: 'Price must be positive' },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Item description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : menuItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No menu items found. Add your first item!
                      </TableCell>
                    </TableRow>
                  ) : (
                    menuItems.map(item => (
                      <TableRow
                        key={item.id}
                        className={!item.available ? 'opacity-60' : undefined}
                      >
                        <TableCell>
                          <img
                            src={item.image_url || DEFAULT_FOOD_IMG}
                            alt={item.name}
                            className="h-12 w-12 rounded-md object-cover border border-border"
                            onError={e => {
                              (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMG;
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.available ? 'default' : 'secondary'}
                            className={
                              item.available
                                ? 'bg-secondary/10 text-secondary border-secondary/20'
                                : 'bg-destructive/10 text-destructive border-destructive/20'
                            }
                          >
                            {item.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            {/* Toggle Availability */}
                            <Button
                              variant="ghost"
                              size="icon"
                              title={item.available ? 'Mark Unavailable' : 'Mark Available'}
                              disabled={togglingId === item.id}
                              onClick={() => handleToggleAvailability(item)}
                            >
                              {item.available ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-secondary" />
                              )}
                            </Button>

                            {/* Edit */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            {/* Delete */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{item.name}&quot;? This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
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
