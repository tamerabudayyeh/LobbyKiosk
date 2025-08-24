import React, { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
  color: string;
}

export const AmbientAnimations: React.FC = () => {
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Create subtle floating elements for peripheral motion
    const elements: FloatingElement[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      opacity: Math.random() * 0.15 + 0.05,
      animationDelay: Math.random() * 10,
      color: i % 2 === 0 ? '#C9A96E' : '#D4A574'
    }));
    
    setFloatingElements(elements);
  }, []);

  return (
    <>
      {/* Ambient floating elements for subtle peripheral motion */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full animate-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              backgroundColor: element.color,
              opacity: element.opacity,
              animationDelay: `${element.animationDelay}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Subtle corner accent animations */}
      <div className="fixed top-4 left-4 pointer-events-none z-10">
        <div className="w-3 h-3 bg-luxury-gold rounded-full animate-pulse-slow opacity-30"></div>
      </div>
      <div className="fixed top-4 right-4 pointer-events-none z-10">
        <div className="w-2 h-2 bg-luxury-gold-bright rounded-full animate-pulse-slow opacity-40" 
             style={{animationDelay: '2s'}}></div>
      </div>
      <div className="fixed bottom-4 left-4 pointer-events-none z-10">
        <div className="w-2 h-2 bg-luxury-gold-premium rounded-full animate-pulse-slow opacity-25" 
             style={{animationDelay: '4s'}}></div>
      </div>
      <div className="fixed bottom-4 right-4 pointer-events-none z-10">
        <div className="w-3 h-3 bg-luxury-gold rounded-full animate-pulse-slow opacity-35" 
             style={{animationDelay: '1s'}}></div>
      </div>

      {/* Gradient overlay animation for depth */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 via-transparent to-luxury-gold-bright/5 animate-gradient opacity-20"></div>
      </div>
    </>
  );
};