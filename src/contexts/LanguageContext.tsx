import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'he' | 'ar';

interface Translations {
  welcome: string;
  tagline: string;
  todaysEvents: string;
  noEvents: string;
  discoverJerusalem: string;
  conciergeRecommends: string;
  restaurantSpecials: string;
  soupsOfDay: string;
  mainDishes: string;
  premiumSpecials: string;
  wifiNetwork: string;
  password: string;
  checkOut: string;
  concierge: string;
  emergency: string;
  available247: string;
  lateCheckout: string;
  itemsAvailable: string;
  todaysFreshMenu: string;
  date: string;
  time: string;
  location: string;
  eventDetails: string;
  loading: string;
}

const translations: Record<Language, Translations> = {
  en: {
    welcome: 'Shalom & Welcome to the Ambassador Jerusalem',
    tagline: 'Where Ancient Meets Modern • Your Jerusalem Story Begins Here',
    todaysEvents: "Today's Events",
    noEvents: 'Discover Jerusalem Today',
    discoverJerusalem: 'Visit our concierge for personalized recommendations',
    conciergeRecommends: 'Explore the Old City • Mahane Yehuda Market • Museum Quarter',
    restaurantSpecials: 'Restaurant Specials',
    soupsOfDay: 'Soups of the Day',
    mainDishes: 'Main Dishes',
    premiumSpecials: 'Premium Specials',
    wifiNetwork: 'WiFi Network',
    password: 'Password',
    checkOut: 'Check Out',
    concierge: 'Concierge',
    emergency: 'Emergency',
    available247: '24/7 Available',
    lateCheckout: 'Late checkout available',
    itemsAvailable: 'Items Available',
    todaysFreshMenu: "Today's Fresh Menu",
    date: 'Date',
    time: 'Time',
    location: 'Location',
    eventDetails: 'Event Details',
    loading: 'Preparing your Jerusalem experience...'
  },
  he: {
    welcome: 'שלום וברוכים הבאים לאמבסדור ירושלים',
    tagline: 'המקום בו העתיק פוגש את המודרני • הסיפור הירושלמי שלך מתחיל כאן',
    todaysEvents: 'אירועי היום',
    noEvents: 'גלה את ירושלים היום',
    discoverJerusalem: 'בקרו בקונסיירז׳ להמלצות אישיות',
    conciergeRecommends: 'העיר העתיקה • שוק מחנה יהודה • רובע המוזיאונים',
    restaurantSpecials: 'מיוחדים מהמסעדה',
    soupsOfDay: 'מרקי היום',
    mainDishes: 'מנות עיקריות',
    premiumSpecials: 'מיוחדים פרימיום',
    wifiNetwork: 'רשת WiFi',
    password: 'סיסמה',
    checkOut: 'צ׳ק אאוט',
    concierge: 'קונסיירז׳',
    emergency: 'חירום',
    available247: 'זמין 24/7',
    lateCheckout: 'צ׳ק אאוט מאוחר זמין',
    itemsAvailable: 'פריטים זמינים',
    todaysFreshMenu: 'התפריט הטרי של היום',
    date: 'תאריך',
    time: 'שעה',
    location: 'מיקום',
    eventDetails: 'פרטי האירוע',
    loading: 'מכינים את חוויית ירושלים שלך...'
  },
  ar: {
    welcome: 'أهلاً وسهلاً في أمباسادور القدس',
    tagline: 'حيث يلتقي القديم بالحديث • قصتك في القدس تبدأ هنا',
    todaysEvents: 'فعاليات اليوم',
    noEvents: 'اكتشف القدس اليوم',
    discoverJerusalem: 'قم بزيارة الكونسيرج للحصول على توصيات شخصية',
    conciergeRecommends: 'البلدة القديمة • سوق محانيه يهودا • حي المتاحف',
    restaurantSpecials: 'عروض المطعم الخاصة',
    soupsOfDay: 'شوربات اليوم',
    mainDishes: 'الأطباق الرئيسية',
    premiumSpecials: 'العروض المميزة',
    wifiNetwork: 'شبكة WiFi',
    password: 'كلمة المرور',
    checkOut: 'تسجيل المغادرة',
    concierge: 'الكونسيرج',
    emergency: 'طوارئ',
    available247: 'متاح 24/7',
    lateCheckout: 'تسجيل مغادرة متأخر متاح',
    itemsAvailable: 'عناصر متاحة',
    todaysFreshMenu: 'قائمة اليوم الطازجة',
    date: 'التاريخ',
    time: 'الوقت',
    location: 'الموقع',
    eventDetails: 'تفاصيل الفعالية',
    loading: 'نحضر تجربتك في القدس...'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const value = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: language === 'he' || language === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={value.isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};