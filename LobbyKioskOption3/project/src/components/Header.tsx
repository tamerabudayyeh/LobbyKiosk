import React from 'react';
import { Clock } from 'lucide-react';

interface HeaderProps {
  currentTime: string;
  currentDate: string;
}

export function Header({ currentTime, currentDate }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-[#25407b] to-[#4c70b7] text-white p-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Ambassador Jerusalem</h1>
          <p className="text-blue-100 text-sm font-light">Your Luxury Experience</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Clock size={24} />
            {currentTime}
          </div>
          <p className="text-blue-100 text-sm">{currentDate}</p>
        </div>
      </div>
    </header>
  );
}