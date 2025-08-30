import React, { useState, useEffect } from 'react';
import { RestaurantSpecial } from '../types';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface SpecialsCarouselProps {
  specials: RestaurantSpecial[];
  onItemClick: (special: RestaurantSpecial) => void;
}

export const SpecialsCarousel: React.FC<SpecialsCarouselProps> = ({ specials, onItemClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || specials.length <= 4) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 4) % specials.length);
    }, 20000); // Auto-advance every 20 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, specials.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const newIndex = prev - 4;
      return newIndex < 0 ? Math.max(0, specials.length - 4) : newIndex;
    });
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const newIndex = prev + 4;
      return newIndex >= specials.length ? 0 : newIndex;
    });
  };

  const visibleSpecials = specials.slice(currentIndex, currentIndex + 4);
  
  // Fill with empty slots if less than 4 items
  while (visibleSpecials.length < 4 && specials.length > 0) {
    const remainingCount = 4 - visibleSpecials.length;
    const additionalItems = specials.slice(0, remainingCount);
    visibleSpecials.push(...additionalItems);
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-xl p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-3">
            <Star size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Today's Specials</h3>
            <p className="text-sm text-gray-600">Chef's Premium Selection</p>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        {specials.length > 4 && (
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
              aria-label="Previous specials"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
              aria-label="Next specials"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </div>
        )}
      </div>

      {/* Specials Grid */}
      <div className="grid grid-cols-4 gap-4">
        {visibleSpecials.map((special, index) => (
          <div
            key={`${special.id}-${index}`}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            onClick={() => onItemClick(special)}
          >
            {/* Image */}
            <div className="h-32 overflow-hidden">
              <img
                src={special.image_url}
                alt={special.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h4 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                {special.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {special.description}
              </p>
              {special.price && (
                <div className="text-xl font-bold text-amber-600">
                  {special.price}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {specials.length > 4 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(specials.length / 4) }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === Math.floor(currentIndex / 4) 
                  ? 'w-8 bg-amber-500' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};