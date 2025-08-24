import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Wifi, Phone, Clock3, Users } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-luxury-white shadow-sm border-b border-gray-100">
      {/* Clean Essential Info Bar */}
      <div className="bg-luxury-cream py-3">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-luxury-gold" />
                <span className="text-luxury-charcoal font-medium">WiFi: Ambassador_Guest</span>
                <span className="text-luxury-muted">Password: Welcome2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock3 className="w-4 h-4 text-luxury-gold" />
                <span className="text-luxury-charcoal font-medium">Check-out: 11:00 AM</span>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-luxury-gold" />
                <span className="text-luxury-charcoal font-medium">Concierge: Ext. 0</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-luxury-gold" />
                <span className="text-luxury-charcoal font-medium">Emergency: Ext. 911</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Welcome Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-6xl font-display font-light text-luxury-dark mb-4 tracking-wide">
            Ambassador Jerusalem
          </h1>
          <div className="w-24 h-0.5 bg-luxury-gold mx-auto mb-6"></div>
          <p className="text-xl font-body text-luxury-muted font-light">
            Where Ancient Meets Modern
          </p>
        </div>
      </div>
      
      {/* Date, Time, and Weather Bar */}
      <div className="bg-luxury-pearl py-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-luxury-gold" />
                <span className="text-lg font-body text-luxury-dark font-medium">{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-luxury-gold" />
                <span className="text-2xl font-body text-luxury-dark font-light tabular-nums">{formatTime(currentTime)}</span>
              </div>
            </div>
            
            {/* Weather Widget */}
            <WeatherWidget />
          </div>
        </div>
      </div>
    </div>
  );
};