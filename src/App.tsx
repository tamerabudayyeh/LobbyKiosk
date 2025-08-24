import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Display } from './components/Display';
import { AdminPanel } from './components/admin/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Display />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;