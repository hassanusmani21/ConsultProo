import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './data/DataContext';
import PublicApp from './PublicApp';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<PublicApp />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
