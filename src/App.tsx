import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KioskDisplayPortraitNew } from './components/KioskDisplayPortraitNew';
import { AdminPanel } from './components/admin/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KioskDisplayPortraitNew />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;