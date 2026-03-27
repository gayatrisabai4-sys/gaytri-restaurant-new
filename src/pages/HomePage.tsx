import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils, Clock, DollarSign } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative flex min-h-[600px] items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://miaoda-site-img.s3cdn.medo.dev/images/KLing_4b44dd36-d567-4a39-97b2-d2577e728d23.jpg')`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">Gaytri Restaurant</h1>
          <p className="mb-8 text-2xl text-white md:text-3xl">Authentic Taste of India</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/menu">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <span>Order Now</span>
              </Button>
            </Link>
            <Link to="/menu">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                <span>View Menu</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Why Choose Us</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-border">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Utensils className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Authentic Recipes</h3>
                <p className="text-muted-foreground">
                  Traditional Indian recipes passed down through generations, prepared with love and
                  care.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Quick and reliable delivery service ensuring your food arrives hot and fresh at
                  your doorstep.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Best Prices</h3>
                <p className="text-muted-foreground">
                  Affordable pricing without compromising on quality. Enjoy delicious meals that fit
                  your budget.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Order?</h2>
          <p className="mb-8 text-lg">
            Browse our extensive menu and place your order for delivery or dine-in reservation.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/menu">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                <span>Browse Menu</span>
              </Button>
            </Link>
            <Link to="/reservation">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                asChild
              >
                <span>Book a Table</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
