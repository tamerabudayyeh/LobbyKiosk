import React from 'react';
import { Utensils } from 'lucide-react';

export function RestaurantHours() {
  const hours = [
    { meal: 'Breakfast', time: '7:00-11:00' },
    { meal: 'Lunch', time: '12:00-15:00' },
    { meal: 'Dinner', time: '19:00-22:30' }
  ];

  return (
    <div className="bg-[#25407b] rounded-xl shadow-lg p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
          <Utensils size={18} />
        </div>
        <h2 className="text-lg font-bold">Restaurant Hours</h2>
      </div>

      <div className="space-y-2">
        {hours.map((schedule, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="font-medium text-sm">{schedule.meal}</span>
            <span className="text-blue-100 text-sm">{schedule.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}