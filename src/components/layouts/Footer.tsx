import { Link } from 'react-router-dom';
import { Phone, Mail, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Gaytri Restaurant</h3>
            <p className="text-sm text-muted-foreground">
              Authentic Taste of India. Experience the rich flavors and traditional recipes that
              make Indian cuisine truly special.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link to="/menu" className="text-sm text-muted-foreground hover:text-primary">
                Menu
              </Link>
              <Link to="/reservation" className="text-sm text-muted-foreground hover:text-primary">
                Reservation
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Contact Us</h3>
            <div className="flex flex-col space-y-3">
              <a
                href="tel:+919876543210"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </a>
              <a
                href="mailto:info@gaytrirestaurant.com"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                <span>info@gaytrirestaurant.com</span>
              </a>
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p>Mon - Sun</p>
                  <p>11:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Gaytri Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
