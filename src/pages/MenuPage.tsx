import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { getMenuItems } from '@/db/api';
import type { MenuItem } from '@/types/types';
import { toast } from 'sonner';
import { Search, ShoppingCart, UtensilsCrossed } from 'lucide-react';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Indian Breads', 'Beverages', 'Desserts'];
const DEFAULT_FOOD_IMG = '/default-food.png';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    toast.success(`${item.name} added to cart! 🛒`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Our Menu</h1>
          </div>
          <p className="text-muted-foreground">
            Authentic Indian flavors made with love and tradition
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mx-auto mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="min-w-[100px] transition-all"
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )}

        {/* Menu Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UtensilsCrossed className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">No dishes found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search.`
                : 'No items available in this category.'}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map(item => (
              <Card
                key={item.id}
                className="group flex flex-col overflow-hidden border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Image */}
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <img
                      src={item.image_url || DEFAULT_FOOD_IMG}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => {
                        (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMG;
                      }}
                    />
                    <div className="absolute right-2 top-2">
                      <Badge variant="secondary" className="text-xs shadow-sm">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="flex-1 p-4">
                  <h3 className="mb-1 font-semibold text-foreground line-clamp-1">{item.name}</h3>
                  {item.description && (
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-primary">₹{item.price.toFixed(2)}</p>
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full gap-2 transition-all"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4" />
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
