import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  showEvents: boolean;
  setShowEvents: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showEvents, setShowEvents] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('kioskSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        return settings.showEvents ?? true;
      } catch {
        return true;
      }
    }
    return true;
  });

  // Save to localStorage whenever showEvents changes
  useEffect(() => {
    localStorage.setItem('kioskSettings', JSON.stringify({ showEvents }));
  }, [showEvents]);

  return (
    <SettingsContext.Provider value={{ showEvents, setShowEvents }}>
      {children}
    </SettingsContext.Provider>
  );
};