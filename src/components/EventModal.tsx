import React from 'react';
import { X, Calendar, Clock, MapPin } from 'lucide-react';
import { Event } from '../types';

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative">
          {event.image_url && (
            <div className="h-64 overflow-hidden rounded-t-3xl">
              <img 
                src={event.image_url} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <div className="p-10">
          <h2 className="text-lobby-title font-display text-jerusalem-dark mb-6">
            {event.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center text-jerusalem-dark bg-jerusalem-cream p-4 rounded-xl">
              <Calendar className="w-6 h-6 mr-3 text-jerusalem-gold" />
              <div>
                <p className="text-lobby-caption font-body font-medium text-jerusalem-dark">Date</p>
                <p className="text-lobby-body font-body">{formatDate(event.start_time)}</p>
              </div>
            </div>
            <div className="flex items-center text-jerusalem-dark bg-jerusalem-cream p-4 rounded-xl">
              <Clock className="w-6 h-6 mr-3 text-jerusalem-gold" />
              <div>
                <p className="text-lobby-caption font-body font-medium text-jerusalem-dark">Time</p>
                <p className="text-lobby-body font-body">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </p>
              </div>
            </div>
            <div className="flex items-center text-jerusalem-dark bg-jerusalem-cream p-4 rounded-xl">
              <MapPin className="w-6 h-6 mr-3 text-jerusalem-gold" />
              <div>
                <p className="text-lobby-caption font-body font-medium text-jerusalem-dark">Location</p>
                <p className="text-lobby-body font-body">{event.location}</p>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <h3 className="text-lobby-subtitle font-display text-jerusalem-dark mb-4">Event Details</h3>
            <p className="text-lobby-body-lg font-body text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};