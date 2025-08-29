import React from 'react';
import { Header } from './components/Header';
import { DishOfTheDay } from './components/DishOfTheDay';
import { TodaysEvents } from './components/TodaysEvents';
import { RestaurantSpecials } from './components/RestaurantSpecials';
import { WeatherWidget } from './components/WeatherWidget';
import { RestaurantHours } from './components/RestaurantHours';
import { WiFiInfo } from './components/WiFiInfo';
import { useCurrentTime } from './hooks/useCurrentTime';

function App() {
  const { currentTime, currentDate } = useCurrentTime();

  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      <Header currentTime={currentTime} currentDate={currentDate} />
      
      <main className="p-2 max-w-md mx-auto space-y-2 h-full">
        {/* Featured Dish - Hero placement for maximum impact */}
        <DishOfTheDay />
        
        {/* Restaurant Specials - Visual advertising with photos */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <RestaurantSpecials />
          </div>
          <div className="space-y-2">
            <WeatherWidget />
            <RestaurantHours />
          </div>
        </div>
        
        {/* Bottom section - Practical information */}
        <div className="grid grid-cols-2 gap-2">
          <TodaysEvents />
          <WiFiInfo />
        </div>
      </main>
    </div>
  );
}

export default App;