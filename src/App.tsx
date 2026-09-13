import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './data/DataContext';
import PublicApp from './PublicApp';
import AdminApp from './admin/AdminApp';
import { AuthProvider } from './admin/auth/AuthContext';
import CheckoutPage from './pages/CheckoutPage';
import DirectCheckoutPage from './pages/DirectCheckoutPage';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/buy/:productId" element={<DirectCheckoutPage />} />
            <Route path="/checkout/:collection/:productId" element={<CheckoutPage />} />
            <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
            <Route path="*" element={<PublicApp />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DataProvider>
  );
}
