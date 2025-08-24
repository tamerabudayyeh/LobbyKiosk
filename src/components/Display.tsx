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
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .gte('start_time', today)
        .lte('start_time', today + 'T23:59:59')
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
    <div className="min-h-screen bg-luxury-cream">
      <Header />
      
      <RestaurantSpecials />
      
      <AdCarousel ads={ads} />
      
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-light text-luxury-dark mb-4">
              Today's Events
            </h2>
            <div className="w-16 h-0.5 bg-luxury-gold mx-auto"></div>
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-2xl font-display font-light text-luxury-gold mb-6">Discover Jerusalem Today</p>
              <p className="text-lg font-body text-luxury-muted mb-2">Visit our concierge for personalized recommendations</p>
              <p className="text-base font-body text-luxury-muted opacity-75">Explore the Old City • Mahane Yehuda Market • Museum Quarter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={setSelectedEvent}
                />
              ))}
            </div>
          )}
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