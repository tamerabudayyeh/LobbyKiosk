import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Event, Ad } from '../types';
import { Header } from './Header';
import { EventCard } from './EventCard';
import { EventModal } from './EventModal';
import { AdCarousel } from './AdCarousel';
import { RestaurantSpecials } from './RestaurantSpecials';
import { AccessibilityPanel } from './AccessibilityPanel';

export const Display: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always fetch data, components will handle fallbacks
    fetchEvents();
    fetchAds();
    
    // Set up real-time subscriptions only if Supabase is configured
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

    return () => {
      eventsSubscription.unsubscribe();
      adsSubscription.unsubscribe();
    };
  }, []);

  const fetchEvents = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    
    try {
      const now = new Date().toISOString();
      
      // Get events that are currently active:
      // - start_time is before or equal to now
      // - end_time is after or equal to now
      // - is_active is true
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
    } finally {
      setLoading(false);
    }
  };

  const fetchAds = async () => {
    if (!isSupabaseConfigured) {
      // Use mock ads if Supabase is not configured
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
      
      // If no ads in database, use mock ads
      if (!data || data.length === 0) {
        console.log('No ads found in database, using mock ads');
        setAds(mockAds);
      } else {
        setAds(data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      // Fallback to mock ads on error
      setAds(mockAds);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
          <p className="text-lg font-body text-luxury-muted">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-luxury-cream">
      <Header />
      
      {/* Single Screen Information Grid - No Scrolling Required */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* Left Column: Restaurant Highlights */}
            <div className="col-span-4 space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-display font-light text-luxury-dark mb-2">
                    Today's Special
                  </h3>
                  <div className="w-12 h-0.5 bg-luxury-gold mx-auto"></div>
                </div>
                
                {/* Featured Dish - Compact Display */}
                <div className="space-y-3">
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80" 
                      alt="Mediterranean Lamb Tagine"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-white bg-opacity-95 text-luxury-dark px-2 py-1 rounded-full shadow-sm">
                        <span className="text-sm font-body font-bold">$34</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-lg font-display font-medium text-luxury-dark">
                    Mediterranean Lamb Tagine
                  </h4>
                  <p className="text-sm font-body text-luxury-muted line-clamp-2">
                    Slow-cooked lamb with apricots and aromatic spices, served with saffron couscous
                  </p>
                  <div className="text-center pt-2">
                    <p className="text-xs font-body text-luxury-gold">Restaurant open 6:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column: Featured Content */}
            <div className="col-span-5 space-y-4">
              {/* Today's Events or Ad Carousel */}
              {events.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-display font-light text-luxury-dark mb-2">
                      Today's Events
                    </h3>
                    <div className="w-12 h-0.5 bg-luxury-gold mx-auto"></div>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {events.slice(0, 3).map((event) => (
                      <div key={event.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <h4 className="text-base font-display font-medium text-luxury-dark mb-1">
                          {event.title}
                        </h4>
                        <p className="text-sm font-body text-luxury-muted mb-2">
                          {event.location} • {new Date(event.start_time).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}
                        </p>
                        {event.description && (
                          <p className="text-xs font-body text-luxury-muted line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {events.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-lg font-display font-light text-luxury-gold mb-3">Discover Jerusalem Today</p>
                      <p className="text-sm font-body text-luxury-muted mb-1">Visit our concierge for personalized recommendations</p>
                      <p className="text-xs font-body text-luxury-muted opacity-75">Old City • Mahane Yehuda Market • Museums</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full">
                  <AdCarousel ads={ads} />
                </div>
              )}
            </div>

            {/* Right Column: Essential Guest Services */}
            <div className="col-span-3 space-y-4">
              {/* Quick Services */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-display font-medium text-luxury-dark mb-3 text-center">
                  Guest Services
                </h3>
                <div className="space-y-3">
                  <div className="text-center py-2 bg-luxury-pearl rounded-lg">
                    <p className="text-sm font-body text-luxury-charcoal font-medium">Concierge</p>
                    <p className="text-lg font-body text-luxury-gold font-bold">Ext. 0</p>
                  </div>
                  <div className="text-center py-2 bg-luxury-pearl rounded-lg">
                    <p className="text-sm font-body text-luxury-charcoal font-medium">Check-out</p>
                    <p className="text-lg font-body text-luxury-gold font-bold">11:00 AM</p>
                  </div>
                  <div className="text-center py-2 bg-red-50 rounded-lg">
                    <p className="text-sm font-body text-red-600 font-medium">Emergency</p>
                    <p className="text-lg font-body text-red-600 font-bold">Ext. 911</p>
                  </div>
                </div>
              </div>
              
              {/* Jerusalem Highlights */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex-1">
                <h3 className="text-lg font-display font-medium text-luxury-dark mb-3 text-center">
                  Explore Jerusalem
                </h3>
                <div className="space-y-2">
                  <div className="text-center py-1">
                    <p className="text-sm font-body text-luxury-charcoal">Old City</p>
                    <p className="text-xs font-body text-luxury-muted">10 min walk</p>
                  </div>
                  <div className="text-center py-1">
                    <p className="text-sm font-body text-luxury-charcoal">Western Wall</p>
                    <p className="text-xs font-body text-luxury-muted">12 min walk</p>
                  </div>
                  <div className="text-center py-1">
                    <p className="text-sm font-body text-luxury-charcoal">Mahane Yehuda</p>
                    <p className="text-xs font-body text-luxury-muted">15 min drive</p>
                  </div>
                  <div className="text-center py-1">
                    <p className="text-sm font-body text-luxury-charcoal">Israel Museum</p>
                    <p className="text-xs font-body text-luxury-muted">20 min drive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
      
      <AccessibilityPanel />
    </div>
  );
};

// Mock data for fallback when Supabase is not configured or has no data
const mockAds: Ad[] = [
  {
    id: 'noodles-festival',
    title: 'Noodles Festival',
    description: 'Authentic Asian noodle dishes from around the world. Fresh ingredients, bold flavors, unforgettable experience.',
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
    description: 'Explore the ancient streets of the Old City. Private guided tours available at the concierge desk.',
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
    description: 'Relax and rejuvenate at our luxury spa. Book your treatment today for the ultimate wellness experience.',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    duration: 7,
    is_active: true,
    display_order: 3,
    created_at: '',
    updated_at: ''
  }
];