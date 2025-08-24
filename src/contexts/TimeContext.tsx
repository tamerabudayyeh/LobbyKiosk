import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
type DiningPeriod = 'breakfast' | 'lunch' | 'dinner' | 'lateNight';

interface TimeTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  greeting: string;
  ambiance: string;
  focus: DiningPeriod;
  recommendations: string[];
}

const timeThemes: Record<TimeOfDay, TimeTheme> = {
  morning: {
    colors: {
      primary: 'from-amber-400 to-orange-500',
      secondary: 'from-yellow-200 to-amber-300',
      accent: 'text-amber-700',
      background: 'from-amber-50 to-orange-50'
    },
    greeting: 'Good Morning',
    ambiance: 'Start Your Jerusalem Adventure',
    focus: 'breakfast',
    recommendations: [
      'Visit the Western Wall at sunrise',
      'Explore Machane Yehuda Market',
      'Walk the Old City ramparts'
    ]
  },
  afternoon: {
    colors: {
      primary: 'from-jerusalem-gold to-amber-600',
      secondary: 'from-amber-200 to-jerusalem-stone',
      accent: 'text-jerusalem-dark',
      background: 'from-jerusalem-cream to-amber-50'
    },
    greeting: 'Good Afternoon',
    ambiance: 'Discover Jerusalem\'s Heart',
    focus: 'lunch',
    recommendations: [
      'Tour the Israel Museum',
      'Stroll through Yemin Moshe',
      'Visit Mount of Olives viewpoint'
    ]
  },
  evening: {
    colors: {
      primary: 'from-blue-900 to-jerusalem-gold',
      secondary: 'from-blue-100 to-amber-100',
      accent: 'text-blue-900',
      background: 'from-blue-50 to-amber-50'
    },
    greeting: 'Good Evening',
    ambiance: 'Savor Jerusalem\'s Flavors',
    focus: 'dinner',
    recommendations: [
      'Enjoy rooftop dining views',
      'Experience the Light Festival',
      'Walk illuminated city walls'
    ]
  },
  night: {
    colors: {
      primary: 'from-indigo-900 to-purple-800',
      secondary: 'from-indigo-100 to-purple-100',
      accent: 'text-indigo-900',
      background: 'from-indigo-50 to-purple-50'
    },
    greeting: 'Good Night',
    ambiance: 'Peaceful Jerusalem Evenings',
    focus: 'lateNight',
    recommendations: [
      'Relax in our spa sanctuary',
      'Enjoy quiet moments in the garden',
      'Prepare for tomorrow\'s adventures'
    ]
  }
};

interface TimeContextType {
  currentTime: Date;
  timeOfDay: TimeOfDay;
  diningPeriod: DiningPeriod;
  theme: TimeTheme;
  getTimeBasedContent: () => {
    greeting: string;
    ambiance: string;
    recommendations: string[];
    primaryFocus: DiningPeriod;
  };
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

const getTimeOfDay = (hour: number): TimeOfDay => {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
};

const getDiningPeriod = (hour: number): DiningPeriod => {
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 23) return 'dinner';
  return 'lateNight';
};

export const TimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const timeOfDay = getTimeOfDay(hour);
  const diningPeriod = getDiningPeriod(hour);
  const theme = timeThemes[timeOfDay];

  const getTimeBasedContent = () => ({
    greeting: theme.greeting,
    ambiance: theme.ambiance,
    recommendations: theme.recommendations,
    primaryFocus: theme.focus
  });

  const value = {
    currentTime,
    timeOfDay,
    diningPeriod,
    theme,
    getTimeBasedContent
  };

  return (
    <TimeContext.Provider value={value}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};