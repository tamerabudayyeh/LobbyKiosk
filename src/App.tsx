import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KioskDisplayClean } from './components/KioskDisplayClean';
import { KioskDisplayPortraitNew } from './components/KioskDisplayPortraitNew';
import { AdminPanel } from './components/admin/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KioskDisplayClean />} />
        <Route path="/old" element={<KioskDisplayPortraitNew />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;