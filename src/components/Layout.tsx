import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout: React.FC = () => {
  const theme = useStore((state) => state.theme);
  const location = useLocation();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex-1 bg-background text-foreground pb-24 transition-colors duration-300">
        <Header />
        <main className="container mx-auto p-4 max-w-md relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
