import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      onClick={() => onClick(event)}
      onKeyPress={(e) => e.key === 'Enter' && onClick(event)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${event.title} on ${formatDate(event.start_time)} at ${event.location}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-luxury-gold group focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:ring-opacity-50"
    >
      {event.image_url && (
        <div className="h-40 overflow-hidden">
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-display font-medium text-luxury-dark mb-3 line-clamp-2 leading-tight">
          {event.title}
        </h3>
        <p className="text-sm font-body text-luxury-muted mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center text-luxury-charcoal">
            <Calendar className="w-4 h-4 mr-2 text-luxury-gold" />
            <span className="text-sm font-body">{formatDate(event.start_time)}</span>
          </div>
          <div className="flex items-center text-luxury-charcoal">
            <Clock className="w-4 h-4 mr-2 text-luxury-gold" />
            <span className="text-sm font-body">
              {formatTime(event.start_time)} - {formatTime(event.end_time)}
            </span>
          </div>
          <div className="flex items-center text-luxury-charcoal">
            <MapPin className="w-4 h-4 mr-2 text-luxury-gold" />
            <span className="text-sm font-body">{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};