import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export function TodaysEvents() {
  const events = [
    {
      id: 1,
      title: "Al-Diwan Specialty Restaurant",
      time: "19:30",
      location: "Al-Diwan Restaurant",
      description: "Soup of the day: Potato leek & Pumpkin sage soup",
      status: "LIVE",
      statusColor: "bg-green-500"
    },
    {
      id: 2,
      title: "Evening Jazz Performance",
      time: "21:00",
      location: "Lobby Bar",
      description: "Live jazz music featuring local artists",
      status: "UPCOMING",
      statusColor: "bg-blue-500"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-[#25407b] p-2 rounded-lg">
          <Calendar className="text-white" size={16} />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#221f20]">Today's Events</h2>
          <p className="text-[#949699] text-xs">Happening Now</p>
        </div>
      </div>

      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="border border-gray-100 rounded-lg p-2 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-[#25407b] text-sm">{event.title}</h3>
              <span className={`${event.statusColor} text-white text-xs px-2 py-1 rounded-full font-bold`}>
                {event.status}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-[#949699] text-xs mb-1">
              <div className="flex items-center gap-1">
                <Clock size={10} />
                {event.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={10} />
                {event.location}
              </div>
            </div>
            
            <p className="text-[#221f20] text-xs">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}