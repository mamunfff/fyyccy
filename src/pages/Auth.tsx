import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { firebaseService } from '../services/firebase';
import { Logo } from '../components/Logo';

export const Auth: React.FC = () => {
  const { language, login, toggleLanguage } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email && password && (isLogin || name)) {
      setLoading(true);
      try {
        if (isLogin) {
          // Login
          const userData = await firebaseService.getUser(email);
          if (!userData) {
            setError(language === 'bn' ? 'অ্যাকাউন্ট পাওয়া যায়নি' : 'Account not found');
            setLoading(false);
            return;
          }
          if (userData.password !== password) {
            setError(language === 'bn' ? 'ভুল পাসওয়ার্ড' : 'Incorrect password');
            setLoading(false);
            return;
          }
          
          // Sync store with user data
          useStore.setState({
            mockTestScores: userData.stats?.mockTestScores || [],
            wrongAnswers: userData.stats?.wrongAnswers || []
          });
          
          login({ name: userData.name, email });
        } else {
          // Signup
          const existingUser = await firebaseService.getUser(email);
          if (existingUser) {
            setError(language === 'bn' ? 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে' : 'Account already exists with this email');
            setLoading(false);
            return;
          }
          
          await firebaseService.createUser(email, {
            name,
            email,
            password, // Storing plain text for demo purposes based on requirements
            stats: {
              mockTestScores: [],
              wrongAnswers: []
            }
          });
          
          useStore.setState({
            mockTestScores: [],
            wrongAnswers: []
          });
          
          login({ name, email });
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError(language === 'bn' ? 'একটি ত্রুটি ঘটেছে. আবার চেষ্টা করুন.' : 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const t = {
    loginTitle: { en: 'Welcome Back', bn: 'স্বাগতম' },
    signupTitle: { en: 'Create Account', bn: 'অ্যাকাউন্ট তৈরি করুন' },
    subtitle: { en: 'Sign in to continue your practice', bn: 'আপনার অনুশীলন চালিয়ে যেতে সাইন ইন করুন' },
    signupSubtitle: { en: 'Join us to start your practice', bn: 'আপনার অনুশীলন শুরু করতে আমাদের সাথে যোগ দিন' },
    name: { en: 'Full Name', bn: 'পুরো নাম' },
    email: { en: 'Email Address', bn: 'ইমেইল ঠিকানা' },
    password: { en: 'Password', bn: 'পাসওয়ার্ড' },
    loginBtn: { en: 'Sign In', bn: 'সাইন ইন করুন' },
    signupBtn: { en: 'Sign Up', bn: 'সাইন আপ করুন' },
    noAccount: { en: "Don't have an account?", bn: 'অ্যাকাউন্ট নেই?' },
    hasAccount: { en: 'Already have an account?', bn: 'ইতিমধ্যেই একটি অ্যাকাউন্ট আছে?' },
    createOne: { en: 'Create one', bn: 'তৈরি করুন' },
    signInInstead: { en: 'Sign in', bn: 'সাইন ইন করুন' }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-bengali bg-background text-foreground relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="absolute top-6 right-6">
        <button 
          onClick={toggleLanguage} 
          className="h-8 px-3 flex items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors font-bold text-[10px] tracking-widest uppercase" 
          aria-label="Toggle Language"
        >
          {language === 'bn' ? 'বাংলা' : 'ENG'}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="bg-white w-24 h-24 rounded-2xl flex items-center justify-center mx-auto shadow-2xl border border-border overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500">
            <Logo className="w-full h-full object-contain p-2" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight uppercase">
              {isLogin ? t.loginTitle[language] : t.signupTitle[language]}
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              {isLogin ? t.subtitle[language] : t.signupSubtitle[language]}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-bold text-center uppercase tracking-wider"
            >
              {error}
            </motion.div>
          )}
          
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t.name[language]}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground/50">
                  <UserIcon size={16} />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl focus:border-primary focus:ring-0 transition-all outline-none font-medium text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t.email[language]}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground/50">
                <Mail size={16} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl focus:border-primary focus:ring-0 transition-all outline-none font-medium text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{t.password[language]}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground/50">
                <Lock size={16} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl focus:border-primary focus:ring-0 transition-all outline-none font-medium text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/10 active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {isLogin ? t.loginBtn[language] : t.signupBtn[language]}
          </button>
        </form>

        <div className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {isLogin ? t.noAccount[language] : t.hasAccount[language]}{' '}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-primary hover:underline"
          >
            {isLogin ? t.createOne[language] : t.signInInstead[language]}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
