import React from 'react';
import { Moon, Sun, LogOut, Car } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const { theme, toggleTheme, language, toggleLanguage, logout } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="container mx-auto max-w-md px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
            <Car size={20} />
          </div>
          <h1 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
            {language === 'bn' ? 'ইউকে থিওরি টেস্ট' : 'UK THEORY'}
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={toggleLanguage} 
            className="h-8 px-2.5 flex items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors font-bold text-[10px] tracking-widest uppercase" 
            aria-label="Toggle Language"
          >
            {language === 'bn' ? 'বাংলা' : 'ENG'}
          </button>
          <button 
            onClick={toggleTheme} 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors" 
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button 
            onClick={logout} 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors" 
            aria-label="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
