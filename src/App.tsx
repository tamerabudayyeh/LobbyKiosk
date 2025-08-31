import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KioskDisplayClean } from './components/KioskDisplayClean';
import { KioskDisplayPortraitNew } from './components/KioskDisplayPortraitNew';
import { AdminPanel } from './components/admin/AdminPanel';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<KioskDisplayClean />} />
          <Route path="/old" element={<KioskDisplayPortraitNew />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;