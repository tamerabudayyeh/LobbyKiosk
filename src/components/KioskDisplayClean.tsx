import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Event, Ad, RestaurantSpecial } from '../types';
import { EventModal } from './EventModal';
import { fetchWeatherData } from '../services/weather';
import { Clock, Calendar, Utensils, ChefHat, Tag, Star, Info, ChevronRight, MapPin, Zap, Sparkles, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Wifi, Eye, EyeOff, Percent } from 'lucide-react';
import { SpecialsCarousel } from './SpecialsCarousel';
import { useSettings } from '../contexts/SettingsContext';

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
  const { showEvents } = useSettings();
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
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reloadCountdown, setReloadCountdown] = useState<number | null>(null);
  
  // Auto-refresh configuration (in seconds)
  const DATA_REFRESH_INTERVAL = 45; // 45 seconds for API data
  const PAGE_RELOAD_INTERVAL = 600; // 10 minutes for full page reload
  const RELOAD_WARNING_TIME = 10; // Show warning 10 seconds before reload

  // Filter data by category using actual database categories
  const offers = restaurantSpecials.filter(item => item.category === 'offers' && item.is_available);
  const dishOfTheDay = restaurantSpecials.filter(item => item.category === 'dish-of-day' && item.is_available);
  const todaysSpecials = restaurantSpecials.filter(item => item.category === 'specialties' && item.is_available);

  // Function to refresh all data with smooth transition
  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchEvents(),
        fetchAds(),
        fetchRestaurantSpecials(),
        loadWeatherData()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Brief transition
    }
  };

  useEffect(() => {
    // Initial data load
    refreshAllData();
    
    // Auto-refresh data at regular intervals
    const dataRefreshInterval = setInterval(() => {
      refreshAllData();
    }, DATA_REFRESH_INTERVAL * 1000);
    
    // Full page reload with countdown warning
    const pageReloadWarningTimeout = setTimeout(() => {
      // Start countdown 10 seconds before reload
      let countdown = RELOAD_WARNING_TIME;
      setReloadCountdown(countdown);
      
      const countdownInterval = setInterval(() => {
        countdown--;
        setReloadCountdown(countdown);
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          window.location.reload();
        }
      }, 1000);
    }, (PAGE_RELOAD_INTERVAL - RELOAD_WARNING_TIME) * 1000);
    
    // Refresh weather every 30 minutes
    const weatherInterval = setInterval(loadWeatherData, 30 * 60 * 1000);

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
      clearInterval(weatherInterval);
      clearInterval(dataRefreshInterval);
      clearTimeout(pageReloadWarningTimeout);
    };
  }, [ads.length]);

  const fetchEvents = async () => {
    if (!isSupabaseConfigured) return Promise.resolve();
    
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
    if (!isSupabaseConfigured) return Promise.resolve();
    
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
    if (!isSupabaseConfigured) return Promise.resolve();
    
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

  const loadWeatherData = async () => {
    const data = await fetchWeatherData();
    if (data) {
      setWeatherData(data);
    }
  };
  
  const getWeatherIcon = () => {
    if (!weatherData) return <Sun className="text-yellow-500 mb-4" size={64} />;
    
    switch(weatherData.icon) {
      case 'cloud-sun':
        return <Cloud className="text-gray-400 mb-4" size={64} />;
      case 'cloud-rain':
        return <CloudRain className="text-blue-500 mb-4" size={64} />;
      case 'cloud-snow':
        return <CloudSnow className="text-blue-200 mb-4" size={64} />;
      case 'cloud-lightning':
        return <CloudLightning className="text-purple-500 mb-4" size={64} />;
      case 'cloud-drizzle':
        return <CloudDrizzle className="text-blue-400 mb-4" size={64} />;
      case 'cloud-fog':
        return <CloudFog className="text-gray-500 mb-4" size={64} />;
      default:
        return <Sun className="text-yellow-500 mb-4" size={64} />;
    }
  };

  const currentAd = ads[currentAdIndex];
  const featuredOffer = offers[0];
  const featuredDish = dishOfTheDay[0];
  const allSpecials = todaysSpecials;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Reload Countdown Indicator */}
      {reloadCountdown !== null && (
        <div className="fixed top-4 right-4 bg-brand-blue text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-semibold">Refreshing display in {reloadCountdown}s...</span>
          </div>
        </div>
      )}
      
      <div className={`max-w-7xl mx-auto transition-opacity duration-500 ${isRefreshing ? 'opacity-80' : 'opacity-100'}`}>
        {/* Header with Weather */}
        <header className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <img 
                src="https://zwthhdmcbqcdfxfafzab.supabase.co/storage/v1/object/public/hotelsphotos/Jerusalem%20logo.png"
                alt="Ambassador Jerusalem Hotel Logo"
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-8">
              {/* Weather in Header */}
              <div className="flex items-center gap-3">
                {weatherData ? (
                  <>
                    {weatherData.icon === 'sun' ? <Sun className="text-yellow-500" size={36} /> :
                     weatherData.icon === 'cloud-sun' ? <Cloud className="text-gray-400" size={36} /> :
                     weatherData.icon === 'cloud-rain' ? <CloudRain className="text-blue-500" size={36} /> :
                     weatherData.icon === 'cloud-snow' ? <CloudSnow className="text-blue-200" size={36} /> :
                     weatherData.icon === 'cloud-lightning' ? <CloudLightning className="text-purple-500" size={36} /> :
                     weatherData.icon === 'cloud-drizzle' ? <CloudDrizzle className="text-blue-400" size={36} /> :
                     weatherData.icon === 'cloud-fog' ? <CloudFog className="text-gray-500" size={36} /> :
                     <Sun className="text-yellow-500" size={36} />}
                    <div>
                      <div className="text-2xl font-bold text-brand-dark">{weatherData.temperature}°C</div>
                      <div className="text-sm text-gray-600">{weatherData.condition}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Sun className="text-yellow-500" size={36} />
                    <div>
                      <div className="text-2xl font-bold text-brand-dark">24°C</div>
                      <div className="text-sm text-gray-600">Clear</div>
                    </div>
                  </>
                )}
              </div>
              <div className="text-right">
                <div className="text-4xl font-light text-brand-dark">{formatTime(currentTime)}</div>
                <div className="text-lg text-gray-600">{formatDate(currentTime)}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Featured Dish Card - Top Priority with Image */}
          <div className="col-span-6 row-span-2">
            <div 
              className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-brand-blue to-brand-navy h-full cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => featuredDish && handleContentClick(featuredDish, 'dish', 'Chef\'s Special')}
            >
              {/* Food Image Background */}
              <div className="absolute inset-0">
                {featuredDish?.image_url && (
                  <img 
                    src={featuredDish.image_url} 
                    alt={featuredDish.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/85 to-transparent"></div>
              </div>
              
              {/* Chef's Special Badge */}
              <div className="absolute top-4 left-4 bg-yellow-500 text-brand-dark px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <ChefHat size={16} />
                <span>TODAY'S FEATURED</span>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                
                {featuredDish && (
                  <>
                    <h3 className="text-3xl font-bold mb-3">{featuredDish.title}</h3>
                    <p className="text-blue-100 mb-4 text-lg leading-relaxed">
                      {featuredDish.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {featuredDish.price && (
                        <div className="text-yellow-400 text-3xl font-bold">{featuredDish.price}</div>
                      )}
                      <button className="bg-yellow-500 text-brand-dark px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
                        VIEW DETAILS
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Offers Card */}
          <div className="col-span-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 rounded-3xl p-6 h-full shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-3">
                  <Percent size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Special Offers</h3>
                  <p className="text-sm text-gray-600">Limited Time</p>
                </div>
              </div>

              <div className="space-y-3">
                {offers.length > 0 ? (
                  offers.slice(0, 3).map((offer, idx) => (
                    <div 
                      key={offer.id}
                      className="border border-amber-200 rounded-2xl p-3 hover:shadow-md transition-shadow cursor-pointer bg-white/50"
                      onClick={() => handleContentClick(offer, 'offer', 'Special Offer')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-brand-dark text-base">{offer.title}</h4>
                        {offer.price && (
                          <span className="text-amber-600 font-bold text-lg">{offer.price}</span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-2">{offer.description}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="border border-amber-200 rounded-2xl p-3 hover:shadow-md transition-shadow bg-white/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-brand-dark text-base">Happy Hour</h4>
                        <span className="text-amber-600 font-bold text-lg">50% OFF</span>
                      </div>
                      <p className="text-gray-700 text-sm">Premium cocktails and appetizers 5:00-7:00 PM</p>
                    </div>
                    <div className="border border-amber-200 rounded-2xl p-3 hover:shadow-md transition-shadow bg-white/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-brand-dark text-base">Weekend Special</h4>
                        <span className="text-amber-600 font-bold text-lg">30% OFF</span>
                      </div>
                      <p className="text-gray-700 text-sm">All dinner menu items Friday-Sunday</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Today's Events Card - Conditionally Rendered */}
          {showEvents && (
            <div className="col-span-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-blue rounded-2xl p-3">
                  <Calendar size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark">Today's Events</h3>
                  <p className="text-gray-500 text-sm">Happening Now</p>
                </div>
              </div>

              <div className="space-y-3">
                {events.length > 0 ? (
                  events.slice(0, 2).map((event, idx) => (
                    <div 
                      key={event.id}
                      className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-brand-blue text-lg">{event.title}</h4>
                        <span className={`${idx === 0 ? 'bg-green-500' : 'bg-blue-500'} text-white text-xs px-3 py-1 rounded-full font-bold`}>
                          {idx === 0 ? 'LIVE' : 'UPCOMING'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-500 text-sm mb-2">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{new Date(event.start_time).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                          })}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-brand-dark text-sm">{event.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500 text-lg">No events scheduled today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {/* Today's Specials Carousel */}
          {allSpecials.length > 0 && (
            <div className="col-span-12">
              <SpecialsCarousel 
                specials={allSpecials} 
                onItemClick={(special) => handleContentClick(special, 'special', 'Today\'s Special')}
              />
            </div>
          )}

          {/* Ad Carousel - Bottom */}
          {currentAd && (
            <div className="col-span-12">
              <div 
                className="bg-white border-2 border-brand-blue rounded-3xl p-8 shadow-xl cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden"
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
                  <div className="flex-1">
                    <h2 className="text-4xl font-bold mb-4 text-brand-blue">{currentAd.title}</h2>
                    <p className="text-xl text-gray-700 leading-relaxed">{currentAd.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {ads.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-3 rounded-full transition-all duration-300 ${
                          idx === currentAdIndex ? 'w-12 bg-brand-blue' : 'w-3 bg-gray-300'
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