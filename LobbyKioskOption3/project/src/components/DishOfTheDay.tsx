import React from 'react';
import { ChefHat, Star } from 'lucide-react';

export function DishOfTheDay() {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-xl bg-gradient-to-br from-[#25407b] to-[#11233e] text-white h-40">
      {/* Food Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800" 
          alt="Jerusalem Mixed Grill"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#25407b]/85 to-transparent"></div>
      </div>
      
      <div className="absolute top-3 left-3 bg-yellow-500 text-[#25407b] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
        <ChefHat size={14} />
        CHEF'S SPECIAL
      </div>
      
      <div className="relative z-10 p-4 h-full flex flex-col justify-end">
        <div className="flex items-center gap-1 mb-2">
          <Star className="text-yellow-400" size={18} fill="currentColor" />
          <Star className="text-yellow-400" size={18} fill="currentColor" />
          <Star className="text-yellow-400" size={18} fill="currentColor" />
          <Star className="text-yellow-400" size={18} fill="currentColor" />
          <Star className="text-yellow-400" size={18} fill="currentColor" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">Jerusalem Mixed Grill</h3>
        <p className="text-blue-100 mb-3 text-sm leading-relaxed">
          Traditional mixed grill with lamb kebab, chicken, and beef served with fresh pita and hummus
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-yellow-400 text-2xl font-bold">₪85</div>
          <button className="bg-yellow-500 text-[#25407b] px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors text-sm">
            ORDER NOW
          </button>
        </div>
      </div>
    </div>
  );
}