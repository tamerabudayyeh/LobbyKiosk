import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Event, Ad, RestaurantSpecial } from '../../types';
import { EventForm } from './EventForm';
import { AdForm } from './AdForm';
import { RestaurantSpecialForm } from './RestaurantSpecialForm';
import { Plus, Edit, Trash2, Calendar, Image, ExternalLink, ChefHat } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [restaurantSpecials, setRestaurantSpecials] = useState<RestaurantSpecial[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);
  const [showRestaurantSpecialForm, setShowRestaurantSpecialForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [editingRestaurantSpecial, setEditingRestaurantSpecial] = useState<RestaurantSpecial | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'ads' | 'specials'>('events');

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchEvents();
      fetchAds();
      fetchRestaurantSpecials();
    }
  }, []);

  const fetchEvents = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
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
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRestaurantSpecials(data || []);
    } catch (error) {
      console.error('Error fetching restaurant specials:', error);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  const deleteRestaurantSpecial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this restaurant special?')) return;

    try {
      const { error } = await supabase
        .from('restaurant_specials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRestaurantSpecials();
    } catch (error) {
      console.error('Error deleting restaurant special:', error);
    }
  };

  const handleEventSave = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const handleAdSave = () => {
    setShowAdForm(false);
    setEditingAd(null);
    fetchAds();
  };

  const handleRestaurantSpecialSave = () => {
    setShowRestaurantSpecialForm(false);
    setEditingRestaurantSpecial(null);
    fetchRestaurantSpecials();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'dish':
        return { title: 'Dish of the Day', icon: '🍽️', color: 'bg-green-100 text-green-800' };
      case 'soup':
        return { title: 'Soup of the Day', icon: '🍲', color: 'bg-orange-100 text-orange-800' };
      case 'special':
        return { title: 'Special of the Day', icon: '⭐', color: 'bg-purple-100 text-purple-800' };
      default:
        return { title: 'Item', icon: '🍴', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Setup Required</h2>
          <p className="text-gray-600 mb-6">
            To access the admin panel, please click the "Connect to Supabase" button in the top right corner to set up your database connection.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Back to Display
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Hotel Lobby Admin Panel</h1>
                <p className="text-blue-100">Manage events, advertisements, and restaurant specials</p>
              </div>
              <a
                href="/"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Display
              </a>
            </div>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-4 font-medium transition-colors duration-200 ${
                  activeTab === 'events'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Events ({events.length})
              </button>
              <button
                onClick={() => setActiveTab('ads')}
                className={`px-6 py-4 font-medium transition-colors duration-200 ${
                  activeTab === 'ads'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Image className="w-4 h-4 inline mr-2" />
                Advertisements ({ads.length})
              </button>
              <button
                onClick={() => setActiveTab('specials')}
                className={`px-6 py-4 font-medium transition-colors duration-200 ${
                  activeTab === 'specials'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ChefHat className="w-4 h-4 inline mr-2" />
                Restaurant Specials ({restaurantSpecials.length})
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'events' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Events</h2>
                  <button
                    onClick={() => setShowEventForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </button>
                </div>
                
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">No events found</p>
                    <p className="text-gray-400">Add your first event to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              event.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {event.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{event.description}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>📅 {formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}</p>
                            <p>📍 {event.location}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setShowEventForm(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'ads' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Advertisements</h2>
                  <button
                    onClick={() => setShowAdForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Advertisement
                  </button>
                </div>
                
                {ads.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">No advertisements found</p>
                    <p className="text-gray-400">Add your first advertisement to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ads.map((ad) => (
                      <div key={ad.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-start">
                        <div className="flex space-x-4 flex-1">
                          <img 
                            src={ad.image_url} 
                            alt={ad.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                ad.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {ad.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            {ad.description && (
                              <p className="text-gray-600 mb-2">{ad.description}</p>
                            )}
                            <div className="text-sm text-gray-500">
                              <p>⏱️ Duration: {ad.duration}s | Order: {ad.display_order}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingAd(ad);
                              setShowAdForm(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAd(ad.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specials' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Restaurant Specials</h2>
                  <button
                    onClick={() => setShowRestaurantSpecialForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Special
                  </button>
                </div>
                
                {restaurantSpecials.length === 0 ? (
                  <div className="text-center py-12">
                    <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">No restaurant specials found</p>
                    <p className="text-gray-400">Add your first special to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {restaurantSpecials.map((special) => {
                      const categoryInfo = getCategoryInfo(special.category);
                      return (
                        <div key={special.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-start">
                          <div className="flex space-x-4 flex-1">
                            <img 
                              src={special.image_url} 
                              alt={special.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${categoryInfo.color}`}>
                                  {categoryInfo.icon} {categoryInfo.title}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  special.is_available 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {special.is_available ? 'Available' : 'Unavailable'}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{special.title}</h3>
                              <p className="text-gray-600 mb-2">{special.description}</p>
                              <div className="text-sm text-gray-500">
                                <p>📋 Order: {special.display_order} {special.price && `| 💰 ${special.price}`}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingRestaurantSpecial(special);
                                setShowRestaurantSpecialForm(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRestaurantSpecial(special.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showEventForm && (
        <EventForm
          event={editingEvent || undefined}
          onSave={handleEventSave}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
        />
      )}
      
      {showAdForm && (
        <AdForm
          ad={editingAd || undefined}
          onSave={handleAdSave}
          onCancel={() => {
            setShowAdForm(false);
            setEditingAd(null);
          }}
        />
      )}

      {showRestaurantSpecialForm && (
        <RestaurantSpecialForm
          special={editingRestaurantSpecial || undefined}
          onSave={handleRestaurantSpecialSave}
          onCancel={() => {
            setShowRestaurantSpecialForm(false);
            setEditingRestaurantSpecial(null);
          }}
        />
      )}
    </div>
  );
};