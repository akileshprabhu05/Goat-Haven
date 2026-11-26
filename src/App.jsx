import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Customer Facing Pages
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';

// Admin Pages
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminInventory } from './pages/AdminInventory';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { UI } from './config/content';
import { PitchLines } from './components/common/PitchLines';

function NotFoundPage() {
  const N = UI.notFound404;
  return (
    <div className="on-dark relative overflow-hidden min-h-screen bg-turf text-chalk flex flex-col items-center justify-center p-6 text-center">
      <PitchLines className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] max-w-none text-chalk/[0.09] pointer-events-none" />
      <div className="relative">
        <p className="font-display font-black leading-none text-[clamp(8rem,32vw,16rem)] tracking-tight">{N.code}</p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-wide -mt-2">{N.heading}</h1>
        <p className="text-chalk/75 text-[15px] max-w-sm mx-auto mt-3 mb-8">{N.body}</p>
        <Link
          to="/"
          className="inline-flex px-7 py-3.5 rounded-xl bg-caution text-ink font-bold text-[15px] hover:bg-[#ffe04d] transition-colors"
        >
          {N.cta}
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Customer Routes */}
            <Route path="/"               element={<Home />} />
            <Route path="/products"       element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetails />} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Secure Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route index       element={<AdminDashboard />} />
              <Route path="products"  element={<AdminProducts />} />
              <Route path="inventory" element={<AdminInventory />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
