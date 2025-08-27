import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Event, Ad } from '../types';
import { Clock, MapPin, Calendar, Utensils, Sparkles } from 'lucide-react';

interface KioskDisplayProps {}

export const KioskDisplay: React.FC<KioskDisplayProps> = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSpecialIndex, setCurrentSpecialIndex] = useState(0);

  const restaurantSpecials = [
    {
      name: "Breakfast Buffet",
      time: "7:00 AM - 11:00 AM",
      location: "Main Restaurant",
      price: "₪89",
      highlight: "Fresh pastries & local specialties"
    },
    {
      name: "Business Lunch",
      time: "12:00 PM - 3:00 PM", 
      location: "Lobby Lounge",
      price: "₪120",
      highlight: "3-course executive menu"
    },
    {
      name: "Happy Hour",
      time: "5:00 PM - 7:00 PM",
      location: "Rooftop Bar",
      price: "30% off",
      highlight: "Cocktails & tapas"
    },
    {
      name: "Chef's Dinner",
      time: "7:00 PM - 10:30 PM",
      location: "Main Restaurant", 
      price: "₪280",
      highlight: "5-course tasting menu"
    }
  ];

  useEffect(() => {
    fetchEvents();
    fetchAds();

    const eventsSubscription = supabase
      .channel('events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    const adsSubscription = supabase
      .channel('ads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ads' }, () => {
        fetchAds();
      })
      .subscribe();

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const adRotationInterval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % Math.max(1, ads.length));
    }, 8000);

    const eventRotationInterval = setInterval(() => {
      if (events.length > 0) {
        setCurrentEventIndex((prev) => (prev + 1) % events.length);
      }
    }, 6000);

    const specialRotationInterval = setInterval(() => {
      setCurrentSpecialIndex((prev) => (prev + 1) % restaurantSpecials.length);
    }, 10000);

    return () => {
      eventsSubscription.unsubscribe();
      adsSubscription.unsubscribe();
      clearInterval(clockInterval);
      clearInterval(adRotationInterval);
      clearInterval(eventRotationInterval);
      clearInterval(specialRotationInterval);
    };
  }, [ads.length, events.length]);

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
    if (!isSupabaseConfigured) {
      setAds(mockAds);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        setAds(mockAds);
      } else {
        setAds(data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      setAds(mockAds);
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
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const currentAd = ads[currentAdIndex] || mockAds[0];
  const currentEvent = events[currentEventIndex];
  const currentSpecial = restaurantSpecials[currentSpecialIndex];

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-luxury-cream via-white to-luxury-pearl flex flex-col">
      {/* Header - Compact */}
      <header className="bg-gradient-luxury-main text-white px-8 py-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-4xl font-display font-light tracking-wide">
              Ambassador Jerusalem
            </h1>
            <div className="h-8 w-px bg-luxury-gold opacity-50"></div>
            <p className="text-lg font-body text-luxury-gold">Welcome to Luxury</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-body font-light">{formatTime(currentTime)}</div>
            <div className="text-sm text-luxury-gold opacity-90">{formatDate(currentTime)}</div>
          </div>
        </div>
      </header>

      {/* Main Content Grid - No Scroll */}
      <div className="flex-1 p-6 grid grid-cols-3 gap-6">
        {/* Left Column - Featured Ad */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-xl h-full overflow-hidden">
            <div className="relative h-2/3">
              <img
                src={currentAd.image_url}
                alt={currentAd.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-2xl font-display text-white mb-2">{currentAd.title}</h3>
                <p className="text-white/90">{currentAd.description}</p>
              </div>
            </div>
            <div className="p-6 h-1/3 bg-gradient-to-br from-luxury-gold/10 to-transparent">
              <div className="flex items-center justify-center h-full">
                <div className="flex space-x-2">
                  {ads.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentAdIndex 
                          ? 'w-8 bg-luxury-gold' 
                          : 'w-2 bg-luxury-gold/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Events & Activities */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl shadow-xl h-full p-6 flex flex-col">
            <div className="flex items-center mb-4">
              <Calendar className="text-luxury-gold mr-3" size={28} />
              <h2 className="text-2xl font-display">Today's Highlights</h2>
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.slice(0, 3).map((event, index) => (
                    <div 
                      key={event.id}
                      className={`p-4 rounded-lg transition-all duration-500 ${
                        index === currentEventIndex % Math.min(3, events.length)
                          ? 'bg-luxury-gold/20 scale-105 shadow-lg'
                          : 'bg-gray-50'
                      }`}
                    >
                      <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {new Date(event.start_time).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </span>
                        <span className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="text-luxury-gold mx-auto mb-4" size={48} />
                    <p className="text-xl font-display text-luxury-gold mb-2">Discover Jerusalem</p>
                    <p className="text-gray-600">Visit our concierge for personalized recommendations</p>
                  </div>
                </div>
              )}

              {/* Quick Info Bar */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-luxury-gold/10 rounded-lg p-3">
                    <p className="font-semibold text-luxury-gold">Concierge</p>
                    <p>Ext. 0 • Lobby</p>
                  </div>
                  <div className="bg-luxury-gold/10 rounded-lg p-3">
                    <p className="font-semibold text-luxury-gold">Room Service</p>
                    <p>Ext. 2 • 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Restaurant & Services */}
        <div className="col-span-1 space-y-6">
          {/* Restaurant Special */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-1/2">
            <div className="flex items-center mb-4">
              <Utensils className="text-luxury-gold mr-3" size={28} />
              <h2 className="text-2xl font-display">Dining Now</h2>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-luxury-gold/20 to-luxury-gold/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{currentSpecial.name}</h3>
                  <span className="text-luxury-gold font-bold">{currentSpecial.price}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{currentSpecial.time}</p>
                <p className="text-sm font-medium">{currentSpecial.location}</p>
                <p className="text-sm text-luxury-gold mt-2">{currentSpecial.highlight}</p>
              </div>
              
              {/* Next up preview */}
              {restaurantSpecials[(currentSpecialIndex + 1) % restaurantSpecials.length] && (
                <div className="border border-gray-200 rounded-lg p-3 opacity-60">
                  <p className="text-xs text-gray-500 mb-1">Next:</p>
                  <p className="font-medium">
                    {restaurantSpecials[(currentSpecialIndex + 1) % restaurantSpecials.length].name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {restaurantSpecials[(currentSpecialIndex + 1) % restaurantSpecials.length].time}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Hotel Services */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex-1">
            <h2 className="text-xl font-display mb-4">Hotel Services</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm">Spa & Wellness</span>
                <span className="text-xs text-luxury-gold">9:00-21:00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm">Fitness Center</span>
                <span className="text-xs text-luxury-gold">24 Hours</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm">Business Center</span>
                <span className="text-xs text-luxury-gold">7:00-23:00</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm">Pool & Sundeck</span>
                <span className="text-xs text-luxury-gold">8:00-20:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-luxury-charcoal text-white px-8 py-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <span className="text-luxury-gold">WiFi: AmbassadorGuest</span>
            <span>•</span>
            <span>Password: Welcome2024</span>
          </div>
          <div className="flex space-x-6">
            <span>Weather: 24°C Sunny</span>
            <span>•</span>
            <span>Shabbat: 18:42</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const mockAds: Ad[] = [
  {
    id: 'noodles-festival',
    title: 'Noodles Festival',
    description: 'Authentic Asian cuisine, fresh ingredients, bold flavors.',
    image_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1200&q=80',
    duration: 8,
    is_active: true,
    display_order: 1,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'jerusalem-experience',
    title: 'Discover Jerusalem',
    description: 'Explore ancient streets with our guided tours.',
    image_url: 'https://images.unsplash.com/photo-1549813069-f95e44d7f498?auto=format&fit=crop&w=1200&q=80',
    duration: 6,
    is_active: true,
    display_order: 2,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'spa-wellness',
    title: 'Spa & Wellness',
    description: 'Relax and rejuvenate. Book your treatment today.',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    duration: 7,
    is_active: true,
    display_order: 3,
    created_at: '',
    updated_at: ''
  }
];