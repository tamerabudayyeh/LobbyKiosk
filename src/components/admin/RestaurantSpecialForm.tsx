import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { RestaurantSpecial } from '../../types';
import { Save, X } from 'lucide-react';

interface RestaurantSpecialFormProps {
  special?: RestaurantSpecial;
  onSave: () => void;
  onCancel: () => void;
}

export const RestaurantSpecialForm: React.FC<RestaurantSpecialFormProps> = ({ special, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    category: special?.category || 'dish-of-day' as 'dish-of-day' | 'offers' | 'specialties',
    title: special?.title || '',
    description: special?.description || '',
    image_url: special?.image_url || '',
    price: special?.price || '',
    display_order: special?.display_order || 0,
    is_available: special?.is_available ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let error;
      if (special) {
        const { error: updateError } = await supabase
          .from('restaurant_specials')
          .update(formData)
          .eq('id', special.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('restaurant_specials')
          .insert([formData]);
        error = insertError;
      }

      if (error) throw error;
      onSave();
    } catch (error) {
      console.error('Error saving restaurant special:', error);
      alert('Error saving restaurant special. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'dish-of-day':
        return { title: 'Dish of the Day', icon: '🍽️' };
      case 'offers':
        return { title: 'Special Offers', icon: '🎯' };
      case 'specialties':
        return { title: 'Restaurant Specialties', icon: '⭐' };
      default:
        return { title: 'Special', icon: '🍴' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {special ? 'Edit Restaurant Special' : 'Add New Restaurant Special'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'dish-of-day' | 'offers' | 'specialties' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dish-of-day">🍽️ Dish of the Day</option>
              <option value="offers">🎯 Special Offers</option>
              <option value="specialties">⭐ Restaurant Specialties</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {getCategoryInfo(formData.category).title}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Potato Leek Soup"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the dish, ingredients, and preparation..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (optional)
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., $24.99"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_available" className="ml-2 text-sm text-gray-700">
              Item is available
            </label>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Special'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};