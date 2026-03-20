import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, FileCheck, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BottomNav: React.FC = () => {
  const language = useStore((state) => state.language);

  const navItems = [
    { to: '/', icon: Home, label: { en: 'Home', bn: 'হোম' } },
    { to: '/practice', icon: BookOpen, label: { en: 'Practice', bn: 'অনুশীলন' } },
    { to: '/mock-test', icon: FileCheck, label: { en: 'Mock Test', bn: 'মক টেস্ট' } },
    { to: '/profile', icon: User, label: { en: 'Profile', bn: 'প্রোফাইল' } },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav className="bg-card/90 backdrop-blur-xl border border-border shadow-2xl shadow-primary/10 rounded-3xl w-full max-w-sm pointer-events-auto overflow-hidden">
        <div className="flex justify-around items-center p-2 relative">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 min-w-[72px] z-10',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon size={22} className={cn("mb-1 transition-transform duration-300", isActive && "scale-110")} />
                  <span className={cn("text-[10px] font-bengali transition-all duration-300", isActive ? "font-bold" : "font-medium")}>
                    {language === 'bilingual' ? (
                      <span className="flex flex-col items-center leading-[1.1]">
                        <span>{item.label.en}</span>
                        <span className="text-[8px] opacity-70 font-normal">{item.label.bn}</span>
                      </span>
                    ) : (
                      item.label[language as 'en' | 'bn'] || item.label.en
                    )}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
