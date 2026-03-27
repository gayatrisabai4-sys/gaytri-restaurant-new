import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/contexts/CartContext';
import { getMenuItems } from '@/db/api';
import type { MenuItem } from '@/types/types';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Indian Breads', 'Beverages', 'Desserts'];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    const items = await getMenuItems();
    setMenuItems(items);
    setLoading(false);
  };

  const filteredItems =
    selectedCategory === 'All'
      ? menuItems
      : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-foreground">Our Menu</h1>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="min-w-[100px]"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-2 h-6 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No items available in this category</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map(item => (
              <Card key={item.id} className="flex flex-col overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/300x200'}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {item.category}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <p className="text-xl font-bold text-primary">₹{item.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
