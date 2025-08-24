import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Type, Contrast, Volume2, VolumeX, Settings } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  audioEnabled: boolean;
}

export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    audioEnabled: false
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply settings to document
    applySettings(settings);
  }, [settings]);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast mode
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large text mode
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {/* Accessibility Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-14 h-14 rounded-full shadow-sm border border-gray-200 transition-all duration-300 flex items-center justify-center
            ${isOpen 
              ? 'bg-luxury-gold text-white rotate-180' 
              : 'bg-white text-luxury-charcoal hover:bg-luxury-cream'
            }
          `}
          aria-label="Accessibility Options"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-6 min-w-[280px] animate-fadeIn">
          <h3 className="text-lg font-display font-medium text-luxury-dark mb-4 text-center">
            Accessibility Options
          </h3>
          
          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Contrast className="w-4 h-4 text-luxury-gold" />
                <span className="text-sm font-body text-luxury-charcoal">High Contrast</span>
              </div>
              <button
                onClick={() => toggleSetting('highContrast')}
                className={`
                  w-10 h-5 rounded-full transition-colors duration-300 relative
                  ${settings.highContrast ? 'bg-luxury-gold' : 'bg-gray-300'}
                `}
              >
                <div className={`
                  w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300
                  ${settings.highContrast ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                <Type className="w-4 h-4 text-luxury-gold" />
                <span className="text-sm font-body text-luxury-charcoal">Large Text</span>
              </div>
              <button
                onClick={() => toggleSetting('largeText')}
                className={`
                  w-10 h-5 rounded-full transition-colors duration-300 relative
                  ${settings.largeText ? 'bg-luxury-gold' : 'bg-gray-300'}
                `}
              >
                <div className={`
                  w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300
                  ${settings.largeText ? 'translate-x-6' : 'translate-x-1'}
                `} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <EyeOff className="w-5 h-5 text-jerusalem-gold" />
                <span className="text-lobby-body font-body text-gray-700">Reduce Motion</span>
              </div>
              <button
                onClick={() => toggleSetting('reducedMotion')}
                className={`
                  w-12 h-6 rounded-full transition-colors duration-300 relative
                  ${settings.reducedMotion ? 'bg-jerusalem-gold' : 'bg-gray-300'}
                `}
              >
                <div className={`
                  w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300
                  ${settings.reducedMotion ? 'translate-x-7' : 'translate-x-1'}
                `} />
              </button>
            </div>

            {/* Audio Assistance */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {settings.audioEnabled ? (
                  <Volume2 className="w-5 h-5 text-jerusalem-gold" />
                ) : (
                  <VolumeX className="w-5 h-5 text-jerusalem-gold" />
                )}
                <span className="text-lobby-body font-body text-gray-700">Audio Assistance</span>
              </div>
              <button
                onClick={() => toggleSetting('audioEnabled')}
                className={`
                  w-12 h-6 rounded-full transition-colors duration-300 relative
                  ${settings.audioEnabled ? 'bg-jerusalem-gold' : 'bg-gray-300'}
                `}
              >
                <div className={`
                  w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300
                  ${settings.audioEnabled ? 'translate-x-7' : 'translate-x-1'}
                `} />
              </button>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-jerusalem-stone border-opacity-30">
            <p className="text-lobby-caption font-body text-gray-500 text-center">
              Settings are automatically saved
            </p>
          </div>
        </div>
      )}
    </>
  );
};