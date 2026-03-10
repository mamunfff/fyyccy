import React from 'react';
import { useStore } from '../store/useStore';
import { User, Award, FileCheck, RotateCcw, LogOut, ShoppingBag, Calendar, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export const Profile: React.FC = () => {
  const { language, user, mockTestScores, wrongAnswers, purchases, logout } = useStore();

  const averageScore = mockTestScores.length > 0 
    ? Math.round(mockTestScores.reduce((a, b) => a + b, 0) / mockTestScores.length) 
    : 0;

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      logout();
    }
  };

  const t = {
    profile: { en: 'Profile', bn: 'প্রোফাইল' },
    stats: { en: 'Your Statistics', bn: 'আপনার পরিসংখ্যান' },
    avgScore: { en: 'Avg. Score', bn: 'গড় স্কোর' },
    testsTaken: { en: 'Tests Taken', bn: 'টেস্ট দেওয়া হয়েছে' },
    wrongAns: { en: 'To Review', bn: 'রিভিউ করার জন্য' },
    purchases: { en: 'Previous Purchases', bn: 'আগের কেনাকাটা' },
    noPurchases: { en: 'No purchases yet', bn: 'এখনও কোনো কেনাকাটা নেই' },
    buyPremium: { en: 'Buy Premium Access', bn: 'প্রিমিয়াম অ্যাক্সেস কিনুন' },
    logout: { en: 'Sign Out', bn: 'সাইন আউট করুন' },
    email: { en: 'Email', bn: 'ইমেইল' },
  };

  return (
    <div className="space-y-8 font-bengali animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-primary to-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border-4 border-white/30 shadow-lg">
          <User size={48} className="text-white" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-1 tracking-tight">{user?.name}</h2>
          <p className="text-primary-foreground/80 font-medium">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight">
          <Award className="text-primary" />
          {t.stats[language]}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-5 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-4xl font-black text-primary tracking-tighter">{averageScore}<span className="text-lg text-muted-foreground font-medium">/50</span></div>
            <div className="text-sm font-medium text-muted-foreground mt-1">{t.avgScore[language]}</div>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-card p-4 rounded-3xl border border-border shadow-sm flex items-center justify-between px-6">
              <div className="text-sm font-medium text-muted-foreground">{t.testsTaken[language]}</div>
              <div className="text-2xl font-bold text-foreground">{mockTestScores.length}</div>
            </div>
            <div className="bg-card p-4 rounded-3xl border border-border shadow-sm flex items-center justify-between px-6">
              <div className="text-sm font-medium text-muted-foreground">{t.wrongAns[language]}</div>
              <div className="text-2xl font-bold text-destructive">{wrongAnswers.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground p-5 rounded-3xl border border-destructive/20 flex items-center justify-center gap-3 transition-all duration-300 shadow-sm font-bold text-lg group"
        >
          <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
          {t.logout[language]}
        </button>
      </div>
    </div>
  );
};
