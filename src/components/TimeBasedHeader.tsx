import React from 'react';
import { Sunrise, Sun, Sunset, Moon, MapPin, Clock } from 'lucide-react';
import { useTime } from '../contexts/TimeContext';
import { useLanguage } from '../contexts/LanguageContext';

export const TimeBasedHeader: React.FC = () => {
  const { timeOfDay, theme, getTimeBasedContent } = useTime();
  const { t } = useLanguage();
  const content = getTimeBasedContent();

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sunrise className="w-8 h-8 text-amber-500 animate-float" />;
      case 'afternoon':
        return <Sun className="w-8 h-8 text-yellow-500 animate-float" />;
      case 'evening':
        return <Sunset className="w-8 h-8 text-orange-500 animate-float" />;
      case 'night':
        return <Moon className="w-8 h-8 text-blue-300 animate-float" />;
    }
  };

  return (
    <div className={`bg-gradient-to-r ${theme.colors.primary} text-white p-6 rounded-2xl shadow-2xl mb-8 animate-fadeIn`}>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          {getTimeIcon()}
          <h2 className="text-lobby-title font-display text-white">
            {content.greeting}, Jerusalem
          </h2>
        </div>
        
        <p className="text-lobby-subtitle font-body text-yellow-200 mb-6">
          {content.ambiance}
        </p>

        {/* Time-based recommendations */}
        <div className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 ${theme.colors.background}`}>
          <div className="flex items-center justify-center space-x-2 mb-3">
            <MapPin className="w-5 h-5 text-yellow-300" />
            <span className="text-lobby-body font-body font-medium text-yellow-100">
              Perfect Time For:
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {content.recommendations.map((rec, index) => (
              <div 
                key={index}
                className="text-center p-2 bg-white bg-opacity-5 rounded-lg animate-slideInLeft"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <span className="text-lobby-caption font-body text-white opacity-90">
                  {rec}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};