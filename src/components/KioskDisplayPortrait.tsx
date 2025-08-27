import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Event, Ad } from '../types';
import { EventModal } from './EventModal';
import { Clock, MapPin, Calendar, Utensils, Wifi, Sun, Star, ChefHat, Tag, Sparkles } from 'lucide-react';

interface RestaurantSpecial {
  id: string;
  category: 'soup' | 'dish' | 'special';
  title: string;
  description: string;
  image_url: string;
  price?: string;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const KioskDisplayPortrait: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [restaurantSpecials, setRestaurantSpecials] = useState<RestaurantSpecial[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSpecialtyIndex, setCurrentSpecialtyIndex] = useState(0);
  const [currentDishIndex, setCurrentDishIndex] = useState(0);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentEventPage, setCurrentEventPage] = useState(0);

  // Filter data by category (map existing categories to display sections)
  const dishesOfTheDay = restaurantSpecials.filter(item => item.category === 'dish' && item.is_available);
  const specialOffers = restaurantSpecials.filter(item => item.category === 'soup' && item.is_available);
  const specialties = restaurantSpecials.filter(item => item.category === 'special' && item.is_available);

  useEffect(() => {
    fetchEvents();
    fetchAds();
    fetchRestaurantSpecials();

    const eventsSubscription = supabase
      .channel('events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
      .subscribe();

    const adsSubscription = supabase
      .channel('ads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ads' }, fetchAds)
      .subscribe();

    const restaurantSubscription = supabase
      .channel('restaurant_specials')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_specials' }, fetchRestaurantSpecials)
      .subscribe();

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const adRotationInterval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % Math.max(1, ads.length || 1));
    }, 8000);

    const specialtyRotationInterval = setInterval(() => {
      if (specialties.length > 0) {
        setCurrentSpecialtyIndex((prev) => (prev + 1) % specialties.length);
      }
    }, 10000);

    const dishRotationInterval = setInterval(() => {
      if (dishesOfTheDay.length > 0) {
        setCurrentDishIndex((prev) => (prev + 1) % dishesOfTheDay.length);
      }
    }, 12000);

    const offerRotationInterval = setInterval(() => {
      if (specialOffers.length > 0) {
        setCurrentOfferIndex((prev) => (prev + 1) % specialOffers.length);
      }
    }, 9000);

    const eventPageInterval = setInterval(() => {
      if (events.length > 1) {
        setCurrentEventPage((prev) => (prev + 1) % Math.ceil(events.length / 1));
      }
    }, 8000);

    return () => {
      eventsSubscription.unsubscribe();
      adsSubscription.unsubscribe();
      restaurantSubscription.unsubscribe();
      clearInterval(clockInterval);
      clearInterval(adRotationInterval);
      clearInterval(specialtyRotationInterval);
      clearInterval(dishRotationInterval);
      clearInterval(offerRotationInterval);
      clearInterval(eventPageInterval);
    };
  }, [ads.length, events.length, specialties.length, dishesOfTheDay.length, specialOffers.length]);

  const fetchEvents = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .lte('start_time', now)
        .gte('end_time', now)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchAds = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const fetchRestaurantSpecials = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const { data, error } = await supabase
        .from('restaurant_specials')
        .select('*')
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRestaurantSpecials(data || []);
    } catch (error) {
      console.error('Error fetching restaurant specials:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const currentAd = ads[currentAdIndex];
  const currentDish = dishesOfTheDay[currentDishIndex];
  const currentOffer = specialOffers[currentOfferIndex];
  const currentSpecialty = specialties[currentSpecialtyIndex];
  const currentEvent = events[currentEventPage];

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-white via-gray-50 to-gray-100 flex flex-col">
      {/* Header - Minimal but Elegant */}
      <header className="bg-gradient-brand-main text-white px-6 py-4 shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-light tracking-wide text-shadow-luxury">
              Ambassador Jerusalem
            </h1>
            <p className="text-lg text-brand-blue opacity-90 mt-1">Welcome to Luxury</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-light text-brand-blue animate-pulse-slow">{formatTime(currentTime)}</div>
            <div className="text-sm opacity-90">{formatDate(currentTime)}</div>
          </div>
        </div>
      </header>

      {/* Main Content - Large and Attractive */}
      <div className="flex-1 p-6 flex flex-col gap-6">
        
        {/* Row 1: Featured Ad + Dish of the Day - 30% height */}
        <div className="flex gap-6 h-[30%]">
          {/* Featured Ad - Left */}
          <div className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden relative group hover:scale-105 transition-transform duration-300">
            {currentAd ? (
              <>
                <img
                  src={currentAd.image_url}
                  alt={currentAd.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h2 className="text-3xl font-bold text-white mb-3 text-shadow-strong animate-textReveal">{currentAd.title}</h2>
                  <p className="text-lg text-white/90 animate-fadeIn animation-delay-200">{currentAd.description}</p>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {ads.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        idx === currentAdIndex ? 'w-8 bg-white animate-shimmer' : 'w-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-blue text-white px-4 py-2 rounded-full text-sm font-bold animate-breathe">
                    Featured
                  </span>
                </div>
              </>
            ) : null}
          </div>

          {/* Dish of the Day - Right */}
          <div className="flex-1 bg-white rounded-2xl shadow-2xl p-6 flex flex-col hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <ChefHat className="text-brand-blue animate-float" size={32} />
              <h3 className="text-2xl font-bold text-brand-dark">Featured Dish</h3>
            </div>
            {currentDish ? (
              <div className="flex-1 bg-gradient-to-br from-brand-blue/20 to-brand-blue/5 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Star className="text-brand-blue animate-pulse" size={24} />
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-2xl text-brand-dark">{currentDish.title}</h4>
                  <p className="text-lg text-gray-700 leading-relaxed">{currentDish.description}</p>
                  <div className="flex justify-between items-end">
                    <p className="text-3xl font-bold text-brand-blue animate-golden-shimmer">{currentDish.price}</p>
                    <Sparkles className="text-brand-blue animate-bounce" size={28} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p className="text-xl">Loading...</p>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Restaurant Specialties + Special Offers - 25% height */}
        <div className="flex gap-6 h-[25%]">
          {/* Restaurant Specialty - Left */}
          <div className="flex-1 bg-white rounded-2xl shadow-2xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Utensils className="text-brand-blue animate-float" size={28} />
                <h3 className="text-2xl font-bold text-brand-dark">Chef's Specialty</h3>
              </div>
              {specialties.length > 1 && (
                <div className="flex gap-1">
                  {specialties.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === currentSpecialtyIndex ? 'w-6 bg-brand-blue' : 'w-1 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            {currentSpecialty ? (
              <div className="bg-gradient-to-r from-amber-50 to-transparent rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-xl mb-2 text-brand-dark">{currentSpecialty.title}</h4>
                    <p className="text-base text-gray-700 leading-relaxed">{currentSpecialty.description}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-2xl font-bold text-brand-blue">{currentSpecialty.price}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-xl">No specialties available</p>
              </div>
            )}
          </div>

          {/* Special Offers - Right */}
          <div className="flex-1 bg-white rounded-2xl shadow-2xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Tag className="text-brand-blue animate-float" size={28} />
                <h3 className="text-2xl font-bold text-brand-dark">Special Deal</h3>
              </div>
              {currentOffer && (
                <span className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-full font-bold animate-pulse">
                  Limited Time
                </span>
              )}
            </div>
            {currentOffer ? (
              <div className="bg-gradient-to-r from-red-50 to-transparent rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Sparkles className="text-red-500 animate-bounce" size={24} />
                </div>
                <h4 className="font-bold text-xl mb-2 text-brand-dark">{currentOffer.title}</h4>
                <p className="text-base text-gray-700 leading-relaxed mb-3">{currentOffer.description}</p>
                <div className="text-2xl font-bold text-red-600">{currentOffer.price}</div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-xl">No offers available</p>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Today's Events - Clickable - 30% height */}
        <div className="h-[30%] bg-white rounded-2xl shadow-2xl p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-brand-blue animate-float" size={32} />
              <h3 className="text-3xl font-bold text-brand-dark">Today's Events</h3>
              <span className="text-lg text-gray-500 ml-4 animate-pulse">(Tap for details)</span>
            </div>
            {events.length > 1 && (
              <div className="flex gap-1">
                {events.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentEventPage ? 'w-6 bg-brand-blue' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          {currentEvent ? (
            <button
              onClick={() => setSelectedEvent(currentEvent)}
              className="w-full bg-gradient-to-br from-gray-50 to-gray-100 hover:from-brand-blue/30 hover:to-brand-blue/20 rounded-2xl p-6 text-left transition-all hover:scale-105 hover:shadow-xl cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-2xl text-brand-dark mb-3 group-hover:text-brand-blue transition-colors">
                    {currentEvent.title}
                  </h4>
                  <div className="flex items-center gap-6 text-lg text-gray-600 mb-3">
                    <span className="flex items-center gap-2">
                      <Clock size={20} className="text-brand-blue" />
                      {new Date(currentEvent.start_time).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={20} className="text-brand-blue" />
                      {currentEvent.location}
                    </span>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed line-clamp-2">
                    {currentEvent.description}
                  </p>
                </div>
                <div className="ml-6">
                  <div className="bg-brand-blue/20 rounded-full p-4 group-hover:bg-brand-blue/40 transition-colors">
                    <Star className="text-brand-blue" size={32} />
                  </div>
                </div>
              </div>
            </button>
          ) : events.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Star className="text-brand-blue mx-auto mb-6 animate-pulse" size={64} />
                <p className="text-2xl font-display text-brand-blue mb-4">Discover Jerusalem Today</p>
                <p className="text-lg text-gray-600">Visit our concierge for personalized recommendations</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Bottom Bar - WiFi & Weather - 15% height */}
        <div className="bg-gradient-brand-main text-white rounded-2xl px-8 py-4 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Wifi size={24} className="text-brand-blue animate-pulse" />
              <div>
                <p className="text-xl font-semibold">Free WiFi Available</p>
                <p className="text-sm opacity-90">Network: AmbassadorGuest • Password: Welcome2024</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-xl font-semibold">Jerusalem Weather</p>
                <p className="text-sm opacity-90">Perfect day to explore</p>
              </div>
              <div className="flex items-center gap-2">
                <Sun size={32} className="text-brand-blue animate-float" />
                <span className="text-2xl font-bold">24°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};