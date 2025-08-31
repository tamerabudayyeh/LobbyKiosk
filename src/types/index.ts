export interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ad {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  duration: number; // in seconds
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface RestaurantSpecial {
  id: string;
  category: 'offers' | 'dish' | 'special';
  title: string;
  description: string;
  image_url: string;
  price?: string;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}