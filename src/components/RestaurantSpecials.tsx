import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Star } from 'lucide-react';
import { RestaurantSpecial } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const RestaurantSpecials: React.FC = () => {
  const [specials, setSpecials] = useState<RestaurantSpecial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('RestaurantSpecials useEffect - isSupabaseConfigured:', isSupabaseConfigured);
    
    // Try to fetch from database first, then fall back to mock data
    fetchSpecials();
    
    // Set up real-time subscription only if Supabase is configured
    if (isSupabaseConfigured) {
      const subscription = supabase
        .channel('restaurant_specials')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_specials' }, () => {
          fetchSpecials();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const fetchSpecials = async () => {
    // Original database code - now using it again
    if (!isSupabaseConfigured) {
      console.log('Supabase not configured, using mock data');
      setSpecials(mockSpecials);
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching specials from Supabase...');
      const { data, error } = await supabase
        .from('restaurant_specials')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      console.log('Supabase data received:', data);
      
      // If no data from database, fallback to mock data
      if (!data || data.length === 0) {
        console.log('No restaurant specials data found in database, using mock data');
        setSpecials(mockSpecials);
      } else {
        console.log('Using database data:', data.length, 'items');
        setSpecials(data);
      }
    } catch (error) {
      console.error('Error fetching restaurant specials:', error);
      // Fallback to mock data on error
      console.log('Falling back to mock data due to error');
      setSpecials(mockSpecials);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-luxury-pearl">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mx-auto mb-4"></div>
            <p className="text-luxury-muted font-body">Loading today's specials...</p>
          </div>
        </div>
      </div>
    );
  }

  // Map old database categories to display sections
  const dishOfDay = specials.find(special => special.category === 'dish-of-day' || special.category === 'dish');
  const offers = specials.filter(special => special.category === 'offers' || special.category === 'soup');
  const specialties = specials.filter(special => special.category === 'specialties' || special.category === 'special');

  return (
    <div className="bg-luxury-pearl">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-light text-luxury-dark mb-4">
            Restaurant Specials
          </h2>
          <div className="w-16 h-0.5 bg-luxury-gold mx-auto mb-2"></div>
          <p className="text-luxury-muted font-body">Fresh ingredients, expertly prepared</p>
        </div>

        {/* Dish of the Day */}
        {dishOfDay && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-display font-light text-luxury-dark mb-4">Dish of the Day</h3>
              <div className="w-16 h-0.5 bg-luxury-gold mx-auto"></div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="relative h-64 md:h-full overflow-hidden">
                      <img 
                        src={dishOfDay.image_url} 
                        alt={dishOfDay.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="bg-white bg-opacity-95 text-luxury-dark px-4 py-2 rounded-full shadow-sm">
                          <span className="text-lg font-body font-bold">{dishOfDay.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <h4 className="text-2xl font-display font-medium text-luxury-dark mb-4">
                      {dishOfDay.title}
                    </h4>
                    <p className="text-luxury-muted font-body leading-relaxed mb-6">
                      {dishOfDay.description}
                    </p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-luxury-gold fill-current" />
                      ))}
                      <span className="text-sm font-body text-luxury-muted ml-2">Chef's Recommendation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Special Offers */}
        {offers.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-display font-light text-luxury-dark mb-4">Special Offers</h3>
              <div className="w-16 h-0.5 bg-luxury-gold mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={offer.image_url} 
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full shadow-sm">
                        <span className="text-xs font-body font-bold">{offer.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-lg font-display font-medium text-luxury-dark mb-2">
                      {offer.title}
                    </h4>
                    <p className="text-sm font-body text-luxury-muted leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurant Specialties */}
        {specialties.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-display font-light text-luxury-dark mb-4">Restaurant Specialties</h3>
              <div className="w-16 h-0.5 bg-luxury-gold mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialties.map((specialty) => (
                <div key={specialty.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={specialty.image_url} 
                      alt={specialty.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-white bg-opacity-95 text-luxury-dark px-3 py-1 rounded-full shadow-sm">
                        <span className="text-sm font-body font-medium">{specialty.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-lg font-display font-medium text-luxury-dark mb-2">
                      {specialty.title}
                    </h4>
                    <p className="text-sm font-body text-luxury-muted leading-relaxed mb-3">
                      {specialty.description}
                    </p>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-luxury-gold fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-luxury-gold fill-current" />
            ))}
          </div>
          <p className="text-2xl font-display font-light text-luxury-dark mb-3">Jerusalem's Culinary Crown Jewel</p>
          <p className="text-luxury-muted font-body max-w-2xl mx-auto">
            Executive Chef Yossi sources from Machane Yehuda Market and local artisans
          </p>
        </div>
      </div>
    </div>
  );
};

// Mock data
const mockSpecials: RestaurantSpecial[] = [
  {
    id: 'dish-of-day',
    category: 'dish-of-day',
    title: 'Mediterranean Lamb Tagine',
    description: 'Slow-cooked lamb with apricots, almonds, and aromatic spices, served with saffron couscous and fresh mint yogurt',
    price: '$34',
    image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    display_order: 1,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'business-lunch',
    category: 'offers',
    title: 'Business Lunch Special',
    description: 'Three-course executive lunch: soup, main course, and dessert with coffee. Perfect for business meetings.',
    price: '$28',
    image_url: 'https://images.unsplash.com/photo-1560963689-b5682b6440f8?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    display_order: 1,
    created_at: '',
    updated_at: ''
  },
  {
    id: 'happy-hour',
    category: 'offers',
    title: 'Happy Hour Special',
    description: 'Premium cocktails, wine selection, and appetizer platters. Available Monday-Friday 5:00-7:00 PM.',
    price: '20% Off',
    image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    display_order: 2,
    created_at: '',
    updated_at: ''
  },
  {
    id: '1',
    category: 'specialties',
    title: 'Signature Jerusalem Grill',
    description: 'Mixed grill featuring lamb kebab, chicken shawarma, and beef kufta with tahini and fresh pita',
    price: '$38',
    image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    display_order: 1,
    created_at: '',
    updated_at: ''
  },
  {
    id: '2',
    category: 'specialties',
    title: 'Pan-Seared Sea Bass',
    description: 'Fresh Mediterranean sea bass with lemon herb crust, roasted vegetables, and saffron cream sauce',
    price: '$32',
    image_url: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    display_order: 2,
    created_at: '',
    updated_at: ''
  },
  {
    id: '3',
    category: 'specialties',
    title: 'Dry-Aged Ribeye Steak',
    description: '28-day aged ribeye with bone marrow butter, truffle mashed potatoes, and seasonal vegetables',
    price: '$48',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    display_order: 3,
    created_at: '',
    updated_at: ''
  }
];