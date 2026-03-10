import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Mail, Lock, User as UserIcon, Loader2, Car, ShoppingBag, CheckCircle, MessageCircle, ArrowRight, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { firebaseService } from '../services/firebase';

export const Auth: React.FC = () => {
  const { language, login, toggleLanguage, hasPurchased, setHasPurchased, theme, toggleTheme } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPending, setShowPending] = useState(false);

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

          if (userData.status === 'pending') {
            setShowPending(true);
            setLoading(false);
            return;
          }
          
          // Sync store with user data
          useStore.setState({
            mockTestScores: userData.stats?.mockTestScores || [],
            wrongAnswers: userData.stats?.wrongAnswers || [],
            answeredQuestions: userData.stats?.answeredQuestions || [],
            purchases: userData.stats?.purchases || []
          });
          
          login({ name: userData.name, email, status: userData.status });
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
            status: 'pending',
            stats: {
              mockTestScores: [],
              wrongAnswers: [],
              answeredQuestions: [],
              purchases: []
            }
          });
          
          setShowPending(true);
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError(language === 'bn' ? 'একটি ত্রুটি ঘটেছে. আবার চেষ্টা করুন.' : 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePurchase = () => {
    setLoading(true);
    // Simulate purchase process
    setTimeout(() => {
      setHasPurchased(true);
      setLoading(false);
    }, 1500);
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
    signInInstead: { en: 'Sign in', bn: 'সাইন ইন করুন' },
    purchaseTitle: { en: 'Premium Access', bn: 'প্রিমিয়াম অ্যাক্সেস' },
    purchaseSubtitle: { en: 'Unlock all features and start your journey', bn: 'সব ফিচার আনলক করুন এবং আপনার যাত্রা শুরু করুন' },
    originalPrice: { en: 'Original Price: £4.99', bn: 'আসল দাম: £৪.৯৯' },
    offerPrice: { en: 'Special Offer: £2.99', bn: 'বিশেষ অফার: £২.৯৯' },
    purchaseBtn: { en: 'Purchase Now', bn: 'এখনই কিনুন' },
    pendingTitle: { en: 'Account Pending', bn: 'অ্যাকাউন্ট পেন্ডিং' },
    pendingSubtitle: { en: 'Your account is currently not active.', bn: 'আপনার অ্যাকাউন্ট বর্তমানে সক্রিয় নয়।' },
    contactWhatsApp: { en: 'Contact on WhatsApp for approval:', bn: 'অনুমোদনের জন্য হোয়াটসঅ্যাপে যোগাযোগ করুন:' },
    backToLogin: { en: 'Back to Login', bn: 'লগইনে ফিরে যান' }
  };

  if (showPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-bengali bg-background text-foreground relative overflow-hidden">
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <button onClick={toggleLanguage} className="h-8 px-3 flex items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors font-bold text-[10px] tracking-widest uppercase">
            {language === 'bn' ? 'বাংলা' : 'ENG'}
          </button>
          <button 
            onClick={toggleTheme} 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors" 
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm space-y-8 text-center"
        >
          <div className="bg-yellow-500/10 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto text-yellow-500">
            <Loader2 size={48} className="animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight uppercase">{t.pendingTitle[language]}</h1>
            <p className="text-muted-foreground font-medium">{t.pendingSubtitle[language]}</p>
          </div>
          
          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t.contactWhatsApp[language]}</p>
            <a 
              href="https://wa.me/447555346617" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-4 bg-green-500 text-white rounded-xl font-black text-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
            >
              <MessageCircle size={24} />
              07555346617
            </a>
          </div>

          <button 
            onClick={() => setShowPending(false)}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
          >
            {t.backToLogin[language]}
          </button>
        </motion.div>
      </div>
    );
  }

  if (!hasPurchased) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-bengali bg-background text-foreground relative overflow-hidden">
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <button onClick={toggleLanguage} className="h-8 px-3 flex items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors font-bold text-[10px] tracking-widest uppercase">
            {language === 'bn' ? 'বাংলা' : 'ENG'}
          </button>
          <button 
            onClick={toggleTheme} 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors" 
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="bg-primary/10 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto text-primary">
              <ShoppingBag size={48} />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight uppercase">{t.purchaseTitle[language]}</h1>
              <p className="text-muted-foreground font-medium text-sm">{t.purchaseSubtitle[language]}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">
              Offer
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-muted-foreground line-through text-lg font-bold">{t.originalPrice[language]}</p>
                <p className="text-4xl font-black text-primary">{t.offerPrice[language]}</p>
              </div>

              <div className="space-y-3">
                {[
                  { en: 'Full Access to All Questions', bn: 'সব প্রশ্নের পূর্ণ অ্যাক্সেস' },
                  { en: 'Unlimited Mock Tests', bn: 'আনলিমিটেড মক টেস্ট' },
                  { en: 'Progress Tracking', bn: 'অগ্রগতি ট্র্যাকিং' },
                  { en: 'Bangla Translation', bn: 'বাংলা অনুবাদ' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle size={18} className="text-green-500 shrink-0" />
                    <span>{feature[language]}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handlePurchase}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-lg uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <><ShoppingBag size={24} /> {t.purchaseBtn[language]}</>}
            </button>
          </div>

          <p className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Secure Payment • Instant Access
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-bengali bg-background text-foreground relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-2">
        <button 
          onClick={toggleLanguage} 
          className="h-8 px-3 flex items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors font-bold text-[10px] tracking-widest uppercase" 
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
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="bg-white w-24 h-24 rounded-2xl flex items-center justify-center mx-auto shadow-2xl border border-border overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 text-primary">
            <Car size={48} />
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
