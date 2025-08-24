import React, { useState, useEffect } from 'react';
import { Ad } from '../types';

interface AdCarouselProps {
  ads: Ad[];
}

export const AdCarousel: React.FC<AdCarouselProps> = ({ ads }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (ads.length === 0) return;

    const currentAd = ads[currentAdIndex];
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        setIsVisible(true);
      }, 300);
    }, currentAd.duration * 1000);

    return () => clearTimeout(timer);
  }, [currentAdIndex, ads]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  return (
    <div className="bg-gradient-to-br from-jerusalem-gold via-amber-600 to-orange-700 rounded-2xl overflow-hidden shadow-2xl">
      <div 
        className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="relative h-64">
          <img 
            src={currentAd.image_url} 
            alt={currentAd.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h3 className="text-lobby-subtitle font-display text-white mb-3 text-shadow-strong">
              {currentAd.title}
            </h3>
            {currentAd.description && (
              <p className="text-lobby-body font-body text-white text-opacity-95 leading-relaxed text-shadow-soft">
                {currentAd.description}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {ads.length > 1 && (
        <div className="flex justify-center space-x-2 p-4 bg-black bg-opacity-20">
          {ads.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentAdIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};