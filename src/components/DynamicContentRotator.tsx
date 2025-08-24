import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Coffee, Wine, Star, MapPin, Camera } from 'lucide-react';

interface TimeBasedContent {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  icon: React.ReactNode;
  gradient: string;
  timeRange: string;
}

interface RotatingQuote {
  text: string;
  author: string;
  category: 'cuisine' | 'jerusalem' | 'hospitality' | 'travel';
}

export const DynamicContentRotator: React.FC = () => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Time-based content that changes throughout the day
  const timeBasedContent: TimeBasedContent[] = [
    {
      id: 'morning',
      title: 'Good Morning',
      subtitle: 'Start Your Jerusalem Adventure',
      content: 'Experience the awakening city with our morning specials and fresh coffee',
      icon: <Sun className="w-8 h-8" />,
      gradient: 'bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-400',
      timeRange: '6:00-11:00'
    },
    {
      id: 'brunch',
      title: 'Brunch Time',
      subtitle: 'Leisurely Morning Delights',
      content: 'Indulge in our weekend brunch buffet with Jerusalem\'s finest ingredients',
      icon: <Coffee className="w-8 h-8" />,
      gradient: 'bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-400',
      timeRange: '11:00-15:00'
    },
    {
      id: 'afternoon',
      title: 'Afternoon Exploration',
      subtitle: 'Discover Ancient Wonders',
      content: 'Perfect time to explore the Old City and Mahane Yehuda Market',
      icon: <MapPin className="w-8 h-8" />,
      gradient: 'bg-gradient-to-r from-blue-300 via-sky-300 to-cyan-400',
      timeRange: '15:00-18:00'
    },
    {
      id: 'golden-hour',
      title: 'Golden Hour',
      subtitle: 'Capture Jerusalem\'s Beauty',
      content: 'The most photogenic time in Jerusalem - perfect for memorable moments',
      icon: <Camera className="w-8 h-8" />,
      gradient: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500',
      timeRange: '18:00-20:00'
    },
    {
      id: 'evening',
      title: 'Evening Elegance',
      subtitle: 'Fine Dining Experience',
      content: 'Join us for an exquisite dinner featuring Mediterranean cuisine',
      icon: <Wine className="w-8 h-8" />,
      gradient: 'bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500',
      timeRange: '20:00-23:00'
    },
    {
      id: 'night',
      title: 'Peaceful Night',
      subtitle: 'Rest & Rejuvenation',
      content: 'Unwind in luxury comfort after a day of Jerusalem discoveries',
      icon: <Moon className="w-8 h-8" />,
      gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600',
      timeRange: '23:00-6:00'
    }
  ];

  // Rotating inspirational quotes
  const rotatingQuotes: RotatingQuote[] = [
    {
      text: "Jerusalem is the city where the past and present dance together in harmony.",
      author: "Chef Yossi",
      category: "jerusalem"
    },
    {
      text: "Every dish tells a story of tradition, innovation, and passion.",
      author: "Culinary Philosophy",
      category: "cuisine"
    },
    {
      text: "Hospitality is not about perfection. It's about making people feel welcomed.",
      author: "Ambassador Jerusalem",
      category: "hospitality"
    },
    {
      text: "Travel makes one modest. You see what a tiny place you occupy in the world.",
      author: "Gustave Flaubert",
      category: "travel"
    },
    {
      text: "In Jerusalem, every stone whispers ancient stories to those who listen.",
      author: "Local Wisdom",
      category: "jerusalem"
    },
    {
      text: "Cooking is love made visible, especially when shared with strangers who become friends.",
      author: "Kitchen Wisdom",
      category: "cuisine"
    },
    {
      text: "True luxury is not in what you have, but in how you make others feel.",
      author: "Hospitality Creed",
      category: "hospitality"
    },
    {
      text: "A journey is best measured in friends, rather than miles.",
      author: "Tim Cahill",
      category: "travel"
    }
  ];

  // Get current time-based content
  const getCurrentContent = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 11) return timeBasedContent[0]; // Morning
    if (hour >= 11 && hour < 15) return timeBasedContent[1]; // Brunch
    if (hour >= 15 && hour < 18) return timeBasedContent[2]; // Afternoon
    if (hour >= 18 && hour < 20) return timeBasedContent[3]; // Golden hour
    if (hour >= 20 && hour < 23) return timeBasedContent[4]; // Evening
    return timeBasedContent[5]; // Night
  };

  // Rotate through additional content every 8 seconds
  useEffect(() => {
    const contentTimer = setInterval(() => {
      setCurrentContentIndex((prev) => (prev + 1) % timeBasedContent.length);
    }, 8000);
    return () => clearInterval(contentTimer);
  }, [timeBasedContent.length]);

  // Rotate quotes every 12 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % rotatingQuotes.length);
    }, 12000);
    return () => clearInterval(quoteTimer);
  }, [rotatingQuotes.length]);

  const currentContent = getCurrentContent();
  const alternateContent = timeBasedContent[currentContentIndex];
  const currentQuote = rotatingQuotes[currentQuoteIndex];

  return (
    <div className="bg-gradient-luxury-soft py-16">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Main Time-Based Content Banner */}
        <div className={`${currentContent.gradient} rounded-3xl p-8 mb-12 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-500 animate-scaleIn`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full animate-float">
                {currentContent.icon}
              </div>
              <div>
                <h3 className="text-3xl font-display font-light mb-2 animate-textReveal">
                  {currentContent.title}
                </h3>
                <p className="text-xl opacity-90 animate-slideInLeft animation-delay-200">
                  {currentContent.subtitle}
                </p>
                <p className="text-lg opacity-80 mt-2 animate-slideInLeft animation-delay-400">
                  {currentContent.content}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentContent.timeRange}</span>
                </div>
              </div>
              <div className="mt-2 text-2xl font-mono font-bold">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Rotating Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Rotating Inspirational Quote */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 animate-fadeIn animation-delay-200 magnetic-hover">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center animate-heartbeat">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <blockquote className="text-lg font-body text-luxury-dark leading-relaxed mb-4 animate-textReveal">
                  "{currentQuote.text}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <cite className="text-sm font-medium text-luxury-gold animate-slideInLeft animation-delay-300">
                    — {currentQuote.author}
                  </cite>
                  <span className="bg-luxury-gold/10 text-luxury-gold text-xs px-3 py-1 rounded-full font-medium capitalize">
                    {currentQuote.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Time Period Preview */}
          <div className={`${alternateContent.gradient} rounded-2xl p-8 text-white shadow-lg animate-fadeIn animation-delay-400 magnetic-hover`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full animate-pulse-slow">
                {alternateContent.icon}
              </div>
              <div>
                <h4 className="text-xl font-display font-medium animate-slideInLeft">
                  Coming Up: {alternateContent.title}
                </h4>
                <p className="text-sm opacity-80 animate-slideInLeft animation-delay-200">
                  {alternateContent.timeRange}
                </p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed animate-slideInLeft animation-delay-300">
              {alternateContent.content}
            </p>
          </div>
        </div>

        {/* Daily Highlights Ticker */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-fadeIn animation-delay-600">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-gold-accent rounded-full flex items-center justify-center animate-golden-shimmer">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-display font-medium text-luxury-dark mb-2 animate-textReveal">
                Today's Highlights
              </h4>
              <div className="flex items-center space-x-6 text-sm text-luxury-muted">
                <div className="flex items-center space-x-2 animate-slideInLeft animation-delay-200">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse"></div>
                  <span>Fresh Market Selections Available</span>
                </div>
                <div className="flex items-center space-x-2 animate-slideInLeft animation-delay-400">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse"></div>
                  <span>Old City Tours: 9 AM & 2 PM</span>
                </div>
                <div className="flex items-center space-x-2 animate-slideInLeft animation-delay-600">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse"></div>
                  <span>Evening Wine Tasting: 7 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};