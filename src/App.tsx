import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footer';

import routes from './routes';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { RouteGuard } from '@/components/common/RouteGuard';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <RouteGuard>
            <IntersectObserver />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {routes.map((route, index) => {
                    if (route.children) {
                      return (
                        <Route key={index} path={route.path} element={route.element}>
                          {route.children.map((child, childIndex) => (
                            <Route
                              key={childIndex}
                              path={child.path}
                              element={child.element}
                            />
                          ))}
                          <Route index element={<Navigate to={route.children[0].path} replace />} />
                        </Route>
                      );
                    }
                    return <Route key={index} path={route.path} element={route.element} />;
                  })}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
          </RouteGuard>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
