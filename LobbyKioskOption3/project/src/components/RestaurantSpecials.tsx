import React from 'react';
import { Percent, Clock } from 'lucide-react';

export function RestaurantSpecials() {
  return (
    <div className="space-y-3">
      {/* Happy Hour Special with Photo */}
      <div className="relative overflow-hidden rounded-xl shadow-lg h-32">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Happy Hour Drinks"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-orange-500/70"></div>
        </div>
        
        <div className="absolute top-2 left-2 bg-yellow-500 text-orange-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Clock size={12} />
          LIMITED TIME
        </div>
        
        <div className="relative z-10 p-3 h-full flex flex-col justify-end">
          <h3 className="text-white text-lg font-bold mb-1">Happy Hour</h3>
          <p className="text-orange-100 text-sm mb-2">5:00 PM - 7:00 PM Daily</p>
          <div className="flex items-center justify-between">
            <div className="text-yellow-300 text-xl font-bold">50% OFF</div>
            <span className="text-orange-100 text-sm">All Beverages</span>
          </div>
        </div>
      </div>

      {/* Dinner Special with Photo */}
      <div className="relative overflow-hidden rounded-xl shadow-lg h-32">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Gourmet Dinner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#25407b]/90 to-[#4c70b7]/70"></div>
        </div>
        
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Percent size={12} />
          SAVE 30%
        </div>
        
        <div className="relative z-10 p-3 h-full flex flex-col justify-end">
          <h3 className="text-white text-lg font-bold mb-1">Dinner Menu</h3>
          <p className="text-blue-100 text-sm mb-2">All Main Courses</p>
          <div className="flex items-center justify-between">
            <div className="text-green-300 text-xl font-bold">30% OFF</div>
            <span className="text-blue-100 text-sm">Until 10 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}