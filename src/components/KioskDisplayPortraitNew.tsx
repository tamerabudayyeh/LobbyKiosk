import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Event, Ad, RestaurantSpecial } from '../types';
import { EventModal } from './EventModal';
import { Clock, Calendar, Utensils, ChefHat, Tag, Star, Info, ChevronRight, MapPin, Zap, Sparkles } from 'lucide-react';


interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: any;
  type: 'dish' | 'special' | 'offer' | 'ad';
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, title, content, type }) => {
  if (!isOpen || !content) return null;

  const getModalColors = () => {
    switch (type) {
      case 'dish':
        return {
          header: 'bg-gradient-brand-main',
          price: 'text-brand-blue',
          button: 'bg-gradient-brand-main'
        };
      case 'special':
        return {
          header: 'bg-gradient-to-r from-brand-blue-medium to-brand-blue',
          price: 'text-brand-blue-medium',
          button: 'bg-gradient-to-r from-brand-blue-medium to-brand-blue'
        };
      case 'offer':
        return {
          header: 'bg-gradient-to-r from-brand-dark to-brand-navy',
          price: 'text-brand-dark',
          button: 'bg-gradient-to-r from-brand-dark to-brand-navy'
        };
      default:
        return {
          header: 'bg-gradient-brand-main',
          price: 'text-brand-blue',
          button: 'bg-gradient-brand-main'
        };
    }
  };

  const colors = getModalColors();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-scaleIn shadow-2xl">
        <div className={`${colors.header} text-white p-8 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-display font-bold text-white text-shadow-strong mb-2">{title}</h2>
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="animate-pulse text-white" />
              <span className="text-xl text-white/90">{type === 'dish' ? 'Culinary Excellence' : type === 'special' ? 'Signature Creation' : type === 'offer' ? 'Limited Time' : 'Featured Content'}</span>
            </div>
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
                    <div className={`text-5xl font-bold ${colors.price} animate-pulse-slow`}>{content.price}</div>
                  </div>
                </div>
              )}
              {type === 'ad' && content.duration && (
                <div className="bg-brand-blue rounded-xl p-4 border border-brand-blue-dark">
                  <p className="text-white font-semibold">📺 Display duration: {content.duration} seconds</p>
                </div>
              )}
              {type === 'dish' && (
                <div className="bg-brand-blue rounded-xl p-4 border border-brand-blue-dark">
                  <p className="text-white font-semibold">👨‍🍳 Chef's recommendation - Fresh ingredients daily</p>
                </div>
              )}
              {type === 'special' && (
                <div className="bg-brand-blue-medium rounded-xl p-4 border border-brand-blue-dark">
                  <p className="text-white font-semibold">⭐ Signature dish - Exclusively at Ambassador Jerusalem</p>
                </div>
              )}
              {type === 'offer' && (
                <div className="bg-brand-dark rounded-xl p-4 border border-brand-navy">
                  <p className="text-white font-semibold">⚡ Limited time offer - Don't miss out!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
          <button
            onClick={onClose}
            className={`w-full ${colors.button} text-white py-4 rounded-2xl font-bold text-xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const KioskDisplayPortraitNew: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [restaurantSpecials, setRestaurantSpecials] = useState<RestaurantSpecial[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [modalType, setModalType] = useState<'dish' | 'special' | 'offer' | 'ad' | 'event'>('dish');
  const [modalTitle, setModalTitle] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

    const eventRotationInterval = setInterval(() => {
      if (events.length > 0) {
        setCurrentEventIndex((prev) => (prev + 1) % events.length);
      }
    }, 10000);

    return () => {
      eventsSubscription.unsubscribe();
      adsSubscription.unsubscribe();
      restaurantSubscription.unsubscribe();
      clearInterval(clockInterval);
      clearInterval(adRotationInterval);
      clearInterval(eventRotationInterval);
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
  const currentEvent = events[currentEventIndex];
  
  // Get first items from each category
  const featuredDish = dishesOfTheDay[0];
  const featuredOffer = specialOffers[0];
  const featuredSpecialty = specialties[0];

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 flex flex-col">
      {/* Compact Header - F-Pattern Top Priority Zone */}
      <header className="bg-gradient-brand-main text-white px-6 py-3 shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-display font-light tracking-wide text-white text-shadow-soft">Ambassador Jerusalem</h1>
            <div className="h-6 w-px bg-white/30"></div>
            <div className="text-sm font-light text-white/90">Your Luxury Experience</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-light text-white">{formatTime(currentTime)}</div>
            <div className="text-sm text-white/80">{formatDate(currentTime)}</div>
          </div>
        </div>
      </header>

      {/* Main Content Grid - Behavioral Science Optimized Layout */}
      <div className="flex-1 p-4">
        <div className="h-full grid grid-cols-12 grid-rows-6 gap-3">
          
          {/* PRIMARY AD ZONE - F-Pattern Hotspot (Top-Left) - Behavioral Priority #1 */}
          <div 
            className="col-span-6 row-span-2 bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 group magnetic-hover"
            onClick={() => currentAd && handleContentClick(currentAd, 'ad', 'Featured Promotion')}
          >
            {currentAd ? (
              <>
                <div className="relative h-full">
                  <img
                    src={currentAd.image_url}
                    alt={currentAd.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Attention-Grabbing Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold w-fit mb-2 animate-pulse">
                      ✨ FEATURED
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2 text-shadow-strong">{currentAd.title}</h2>
                    <p className="text-sm text-white/90 mb-3 line-clamp-2">{currentAd.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <Info size={16} className="text-white" />
                        <span className="text-sm text-white font-semibold">Tap for Details</span>
                      </div>
                      <div className="flex gap-1">
                        {ads.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              idx === currentAdIndex ? 'w-6 bg-yellow-400' : 'w-2 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <Sparkles className="text-gray-400 mx-auto mb-4 animate-pulse" size={48} />
                  <p className="text-xl text-gray-500">Loading featured content...</p>
                </div>
              </div>
            )}
          </div>

          {/* DISH OF THE DAY - Brand Colors Zone (Top-Right) - Priority #2 */}
          <div 
            className="col-span-3 row-span-2 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 group magnetic-hover border border-brand-blue/30"
            onClick={() => featuredDish && handleContentClick(featuredDish, 'dish', 'Dish of the Day')}
          >
            <div className="h-full flex flex-col">
              {/* Header with brand colors */}
              <div className="bg-gradient-brand-main text-white p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat size={20} />
                    <div>
                      <h3 className="text-lg font-bold text-white">Today's Special</h3>
                      <p className="text-white/80 text-xs">Chef's Pick</p>
                    </div>
                  </div>
                  <Sparkles className="text-yellow-300 animate-pulse" size={16} />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4">
                {featuredDish ? (
                  <div className="h-full flex flex-col">
                    <h4 className="text-lg font-bold text-brand-dark mb-2 line-clamp-1">{featuredDish.title}</h4>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{featuredDish.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-2xl font-bold text-brand-blue">{featuredDish.price}</div>
                      <ChevronRight className="text-brand-blue" size={20} />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <ChefHat className="text-gray-400 mx-auto mb-2" size={32} />
                      <p className="text-sm text-gray-500">Check back soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RESTAURANT SPECIALTIES - Brand Colors Zone (Middle-Right) - Priority #3 */}
          <div 
            className="col-span-3 row-span-2 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 group magnetic-hover border border-brand-blue-medium/30"
            onClick={() => featuredSpecialty && handleContentClick(featuredSpecialty, 'special', "Chef's Specialty")}
          >
            <div className="h-full flex flex-col">
              {/* Header with brand colors */}
              <div className="bg-gradient-to-r from-brand-blue-medium to-brand-blue text-white p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={20} />
                    <div>
                      <h3 className="text-lg font-bold text-white">Chef's Specialty</h3>
                      <p className="text-white/80 text-xs">Premium</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4">
                {featuredSpecialty ? (
                  <div className="h-full flex flex-col">
                    <h4 className="text-lg font-bold text-brand-dark mb-2 line-clamp-1">{featuredSpecialty.title}</h4>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{featuredSpecialty.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-2xl font-bold text-brand-blue">{featuredSpecialty.price}</div>
                      <ChevronRight className="text-brand-blue" size={20} />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Star className="text-gray-400 mx-auto mb-2" size={32} />
                      <p className="text-sm text-gray-500">Ask your waiter</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* EVENTS SECTION - Information Flow (Middle-Left) - Priority #4 */}
          <div className="col-span-6 row-span-2 bg-white rounded-2xl shadow-xl p-4 border border-gray-200">
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-brand-main rounded-full p-2">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">Today's Events</h3>
                  <p className="text-gray-600 text-sm">Happening Now</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                {currentEvent ? (
                  <div 
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 cursor-pointer hover:shadow-lg transition-all border border-blue-200"
                    onClick={() => handleEventClick(currentEvent)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-bold text-brand-dark line-clamp-1">{currentEvent.title}</h4>
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        LIVE
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(currentEvent.start_time).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                      {currentEvent.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{currentEvent.location}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 line-clamp-1 text-sm">{currentEvent.description}</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="text-gray-400 mx-auto mb-2" size={32} />
                    <h4 className="text-lg font-semibold text-gray-600 mb-1">No Events Today</h4>
                    <p className="text-gray-500 text-sm">Check back tomorrow</p>
                  </div>
                )}
                
                {/* Additional events */}
                {events.length > 1 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 border-t pt-2">Coming Up</h4>
                    {events.slice(1, 2).map((event) => (
                      <div 
                        key={event.id}
                        className="bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors border-l-2 border-brand-blue"
                        onClick={() => handleEventClick(event)}
                      >
                        <h5 className="font-semibold text-brand-dark line-clamp-1 text-sm">{event.title}</h5>
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                          <Clock size={10} />
                          {new Date(event.start_time).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SPECIAL OFFERS - Brand Colors Zone */}
          <div 
            className="col-span-4 row-span-1 bg-gradient-to-r from-brand-dark to-brand-navy rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 group magnetic-hover"
            onClick={() => featuredOffer && handleContentClick(featuredOffer, 'offer', 'Limited Time Offer')}
          >
            <div className="h-full p-4 text-white relative">
              <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                LIMITED
              </div>
              <div className="h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="animate-pulse" size={24} />
                  <h3 className="text-xl font-bold">Special Offer</h3>
                </div>
                {featuredOffer ? (
                  <div>
                    <h4 className="text-lg font-bold mb-2 line-clamp-1">{featuredOffer.title}</h4>
                    <p className="text-white/80 mb-3 line-clamp-2 text-sm">{featuredOffer.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-yellow-300">{featuredOffer.price}</div>
                      <ChevronRight className="text-white" size={20} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg mb-1 text-white">Amazing deals coming soon!</p>
                    <p className="text-white/70 text-sm">Check back later</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RESTAURANT HOURS - Trust Building Zone */}
          <div className="col-span-4 row-span-1 bg-gradient-brand-main rounded-2xl shadow-xl p-4 text-white">
            <div className="h-full flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Utensils size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Restaurant Hours</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-yellow-300">Breakfast</div>
                      <div className="text-white/90">7:00-11:00</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-yellow-300">Lunch</div>
                      <div className="text-white/90">12:00-15:00</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-yellow-300">Dinner</div>
                      <div className="text-white/90">19:00-22:30</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GUEST SERVICES - Trust & Convenience Zone */}
          <div className="col-span-4 row-span-1 bg-gradient-to-r from-brand-blue to-brand-blue-dark rounded-2xl shadow-xl p-4 text-white">
            <div className="h-full flex items-center">
              <div className="grid grid-cols-3 gap-3 w-full text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-1">
                    <Info size={20} />
                  </div>
                  <div className="font-bold text-sm text-yellow-300">Concierge</div>
                  <div className="text-white/90 text-xs">Extension 0</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-1">
                    <Zap size={20} />
                  </div>
                  <div className="font-bold text-sm text-yellow-300">WiFi</div>
                  <div className="text-white/90 text-xs">AmbassadorGuest</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 mb-1">
                    <Star size={20} />
                  </div>
                  <div className="font-bold text-sm text-yellow-300">Password</div>
                  <div className="text-white/90 text-xs">Welcome2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* WEATHER & LOCAL INFO - Contextual Information */}
          <div className="col-span-4 row-span-1 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-xl p-4 border border-blue-200">
            <div className="h-full flex items-center justify-center">
              <div className="text-center w-full">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="bg-blue-500 rounded-full p-1">
                    <Sparkles className="text-white" size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark">Jerusalem Today</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/60 rounded-lg px-3 py-2">
                    <div className="font-semibold text-gray-700 text-sm">Weather</div>
                    <div className="text-blue-600 font-bold text-sm">24°C Sunny</div>
                  </div>
                  <div className="bg-white/60 rounded-lg px-3 py-2">
                    <div className="font-semibold text-gray-700 text-sm">Old City</div>
                    <div className="text-blue-600 font-bold text-sm">10 min walk</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={!!selectedContent && modalType !== 'event'}
        onClose={() => setSelectedContent(null)}
        title={modalTitle}
        content={selectedContent}
        type={modalType as any}
      />

      {/* Event Modal */}
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