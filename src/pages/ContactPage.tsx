import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-foreground">Contact Us</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Phone</h3>
                    <a
                      href="tel:+919876543210"
                      className="text-muted-foreground hover:text-primary"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                    <Mail className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Email</h3>
                    <a
                      href="mailto:info@gaytrirestaurant.com"
                      className="text-muted-foreground hover:text-primary"
                    >
                      info@gaytrirestaurant.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Opening Hours</h3>
                    <p className="text-muted-foreground">Monday - Sunday</p>
                    <p className="text-muted-foreground">11:00 AM - 11:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                    <MapPin className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground">
                      123 Main Street, MG Road
                      <br />
                      Bangalore, Karnataka 560001
                      <br />
                      India
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Find Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB_LJOYJL-84SMuxNB7LtRGhxEQLjswvy0&language=en&region=cn&q=MG+Road+Bangalore+India"
                    allowFullScreen
                    title="Restaurant Location"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
