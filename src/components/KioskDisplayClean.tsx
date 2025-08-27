import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Event, Ad, RestaurantSpecial } from '../types';
import { EventModal } from './EventModal';
import { Clock, Calendar, Utensils, ChefHat, Tag, Star, Info, ChevronRight, MapPin, Zap, Sparkles, Sun, Wifi, Eye, EyeOff, Percent } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: any;
  type: 'dish' | 'special' | 'offer' | 'ad';
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, title, content, type }) => {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-scaleIn shadow-2xl">
        <div className="bg-gradient-brand-main text-white p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-display font-bold text-white text-shadow-strong mb-2">{title}</h2>
          </div>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-300px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {content.image_url && (
                <img 
                  src={content.image_url} 
                  alt={content.title} 
                  className="w-full h-80 object-cover rounded-2xl mb-6 shadow-lg"
                />
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-brand-dark mb-4">{content.title}</h3>
              <p className="text-xl text-gray-700 leading-relaxed">{content.description}</p>
              {content.price && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-2">Price</p>
                    <div className="text-5xl font-bold text-brand-blue animate-pulse-slow">{content.price}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gradient-brand-main text-white py-4 rounded-2xl font-bold text-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const KioskDisplayClean: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [restaurantSpecials, setRestaurantSpecials] = useState<RestaurantSpecial[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [modalType, setModalType] = useState<'dish' | 'special' | 'offer' | 'ad'>('dish');
  const [modalTitle, setModalTitle] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Filter data by category using actual database categories
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
    }, 12000);

    return () => {
      eventsSubscription.unsubscribe();
      adsSubscription.unsubscribe();
      restaurantSubscription.unsubscribe();
      clearInterval(clockInterval);
      clearInterval(adRotationInterval);
    };
  }, [ads.length]);

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

  const handleContentClick = (content: any, type: 'dish' | 'special' | 'offer' | 'ad', title: string) => {
    setSelectedContent(content);
    setModalType(type);
    setModalTitle(title);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const currentAd = ads[currentAdIndex];
  const featuredDish = dishesOfTheDay[0];
  const featuredOffer = specialOffers[0];
  const featuredSpecialty = specialties[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-display font-light text-brand-dark">Ambassador Jerusalem</h1>
              <p className="text-lg text-gray-600 mt-1">Your Luxury Hotel Experience</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-light text-brand-dark">{formatTime(currentTime)}</div>
              <div className="text-lg text-gray-600">{formatDate(currentTime)}</div>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Featured Dish Card - Top Priority with Image */}
          <div className="col-span-6 row-span-2">
            <div 
              className="bg-brand-blue rounded-3xl p-6 h-full cursor-pointer hover:scale-[1.02] transition-transform text-white relative overflow-hidden"
              onClick={() => featuredDish && handleContentClick(featuredDish, 'dish', 'Chef\'s Special')}
            >
              <div className="absolute top-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Star size={16} />
                <span>FEATURED</span>
              </div>
              <div className="pt-12">
                <h2 className="text-2xl font-semibold mb-1">Chef's Special</h2>
                {featuredDish ? (
                  <>
                    <h3 className="text-3xl font-bold mb-4">{featuredDish.title}</h3>
                    {featuredDish.image_url && (
                      <div className="rounded-2xl overflow-hidden mb-4 h-48">
                        <img 
                          src={featuredDish.image_url} 
                          alt={featuredDish.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <p className="text-white/90 text-lg leading-relaxed mb-4">{featuredDish.description}</p>
                    {featuredDish.price && (
                      <div className="text-3xl font-bold text-yellow-300">{featuredDish.price}</div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xl text-white/70">Check back soon for today's special</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Weather Card */}
          <div className="col-span-3">
            <div className="bg-white rounded-3xl p-6 h-full shadow-lg">
              <div className="flex flex-col items-center justify-center h-full">
                <Sun className="text-yellow-500 mb-4" size={64} />
                <div className="text-5xl font-bold text-brand-dark mb-2">24°C</div>
                <div className="text-xl text-gray-600">Sunny</div>
                <div className="text-lg text-gray-500 mt-4">Jerusalem Today</div>
              </div>
            </div>
          </div>

          {/* Restaurant Hours */}
          <div className="col-span-3">
            <div className="bg-brand-blue rounded-3xl p-6 h-full shadow-lg text-white">
              <div className="flex items-center gap-3 mb-4">
                <Utensils size={28} />
                <h3 className="text-2xl font-bold">Restaurant Hours</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg">Breakfast</span>
                  <span className="text-xl font-semibold">7:00-11:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg">Lunch</span>
                  <span className="text-xl font-semibold">12:00-15:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg">Dinner</span>
                  <span className="text-xl font-semibold">19:00-22:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Offers Card */}
          <div className="col-span-3">
            <div 
              className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-6 h-full shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => featuredOffer && handleContentClick(featuredOffer, 'offer', 'Special Offer')}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-400 rounded-2xl p-3">
                  <Percent size={24} className="text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Special Offers</h3>
                  <p className="text-sm text-gray-600">Limited Time</p>
                </div>
              </div>
              {featuredOffer ? (
                <div>
                  <h4 className="text-2xl font-bold text-brand-dark mb-2">{featuredOffer.title}</h4>
                  <p className="text-gray-700 mb-4">{featuredOffer.description}</p>
                  {featuredOffer.price && (
                    <div className="text-3xl font-bold text-yellow-600">{featuredOffer.price}</div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h4 className="text-2xl font-bold text-brand-dark mb-2">30% off</h4>
                    <p className="text-gray-700">Dinner Menu</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-dark mb-1">Happy Hour</h4>
                    <p className="text-gray-600">5:00 PM - 7:00 PM</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">50% off</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* WiFi Network Card */}
          <div className="col-span-3">
            <div className="bg-white border-2 border-blue-200 border-dashed rounded-3xl p-6 h-full shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500 rounded-2xl p-3">
                  <Wifi size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">WiFi Network</h3>
                  <p className="text-sm text-gray-600">Complimentary Internet</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Network Name</p>
                  <p className="text-xl font-bold text-brand-blue">Ambassador_Guest</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Password</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-brand-blue">
                      {showPassword ? 'Ambassador' : '••••••••••••'}
                    </p>
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-brand-blue transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Events Card */}
          <div className="col-span-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-blue rounded-2xl p-3">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Today's Events</h3>
                  <p className="text-gray-600">Happening Now</p>
                </div>
              </div>
              <div className="space-y-4">
                {events.length > 0 ? (
                  events.slice(0, 2).map((event, idx) => (
                    <div 
                      key={event.id}
                      className="border-l-4 border-brand-blue pl-4 cursor-pointer hover:bg-gray-50 transition-colors py-2"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-brand-dark mb-1">{event.title}</h4>
                          <div className="flex items-center gap-4 text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              <span>{new Date(event.start_time).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false 
                              })}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700">{event.description}</p>
                        </div>
                        {idx === 0 && (
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            LIVE
                          </div>
                        )}
                        {idx === 1 && (
                          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            UPCOMING
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className="border-l-4 border-brand-blue pl-4 py-2">
                      <h4 className="text-xl font-bold text-brand-dark mb-1">Al-Diwan Specialty Restaurant</h4>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>19:30</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>Al-Diwan Restaurant</span>
                        </div>
                      </div>
                      <p className="text-gray-700">Soup of the day: Potato leek & Pumpkin sage soup</p>
                    </div>
                    <div className="border-l-4 border-gray-300 pl-4 py-2">
                      <h4 className="text-xl font-bold text-brand-dark mb-1">Evening Jazz Performance</h4>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>21:00</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>Lobby Bar</span>
                        </div>
                      </div>
                      <p className="text-gray-700">Live jazz music featuring local artists</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ad Carousel - Bottom */}
          {currentAd && (
            <div className="col-span-12">
              <div 
                className="bg-gradient-to-r from-brand-blue to-brand-navy rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden"
                onClick={() => handleContentClick(currentAd, 'ad', 'Featured Promotion')}
              >
                <div className="flex items-center gap-8">
                  {currentAd.image_url && (
                    <div className="w-64 h-48 rounded-2xl overflow-hidden flex-shrink-0">
                      <img 
                        src={currentAd.image_url}
                        alt={currentAd.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 text-white">
                    <h2 className="text-4xl font-bold mb-4">{currentAd.title}</h2>
                    <p className="text-xl text-white/90 leading-relaxed">{currentAd.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {ads.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-3 rounded-full transition-all duration-300 ${
                          idx === currentAdIndex ? 'w-12 bg-yellow-400' : 'w-3 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DetailModal
        isOpen={!!selectedContent && modalType !== 'event'}
        onClose={() => setSelectedContent(null)}
        title={modalTitle}
        content={selectedContent}
        type={modalType}
      />

      {showEventModal && selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};