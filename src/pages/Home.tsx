import React from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { BookOpen, FileCheck, User, Award, ChevronRight } from 'lucide-react';

export const Home: React.FC = () => {
  const { language, mockTestScores, wrongAnswers } = useStore();

  const averageScore = mockTestScores.length > 0 
    ? Math.round(mockTestScores.reduce((a, b) => a + b, 0) / mockTestScores.length) 
    : 0;

  const t = {
    welcome: { en: 'Welcome back!', bn: 'স্বাগতম!' },
    subtitle: { en: 'Ready to pass your theory test?', bn: 'আপনার থিওরি টেস্ট পাস করতে প্রস্তুত?' },
    progress: { en: 'Your Progress', bn: 'আপনার অগ্রগতি' },
    avgScore: { en: 'Avg. Score', bn: 'গড় স্কোর' },
    testsTaken: { en: 'Tests Taken', bn: 'টেস্ট দেওয়া হয়েছে' },
    wrongAns: { en: 'To Review', bn: 'রিভিউ করার জন্য' },
    quickStart: { en: 'Quick Start', bn: 'দ্রুত শুরু করুন' },
    practice: { en: 'Practice By Category', bn: 'ক্যাটাগরি অনুযায়ী অনুশীলন' },
    mockTest: { en: 'Take a Mock Test', bn: 'একটি মক টেস্ট দিন' },
    profile: { en: 'Your Profile', bn: 'আপনার প্রোফাইল' },
  };

  const renderT = (item: { en: string; bn: string }, isSmall = false) => {
    if (language === 'bilingual') {
      return (
        <span className="flex flex-col">
          <span className={isSmall ? "text-xs" : ""}>{item.en}</span>
          <span className={isSmall ? "text-[10px] opacity-70 font-normal" : "text-sm opacity-70 font-normal"}>{item.bn}</span>
        </span>
      );
    }
    return item[language as 'en' | 'bn'] || item.en;
  };

  return (
    <div className="space-y-8 font-bengali animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-primary to-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">{renderT(t.welcome)}</h2>
          <p className="text-primary-foreground/80 font-medium">{renderT(t.subtitle)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight">
          <Award className="text-primary" />
          {renderT(t.progress)}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-5 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="text-4xl font-black text-primary tracking-tighter">{averageScore}<span className="text-lg text-muted-foreground font-medium">/50</span></div>
            <div className="text-sm font-medium text-muted-foreground mt-1">{renderT(t.avgScore, true)}</div>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-card p-4 rounded-3xl border border-border shadow-sm flex items-center justify-between px-6">
              <div className="text-sm font-medium text-muted-foreground">{renderT(t.testsTaken, true)}</div>
              <div className="text-2xl font-bold text-foreground">{mockTestScores.length}</div>
            </div>
            <div className="bg-card p-4 rounded-3xl border border-border shadow-sm flex items-center justify-between px-6">
              <div className="text-sm font-medium text-muted-foreground">{renderT(t.wrongAns, true)}</div>
              <div className="text-2xl font-bold text-destructive">{wrongAnswers.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">{renderT(t.quickStart)}</h3>
        <div className="grid grid-cols-1 gap-4">
          <Link to="/practice" className="bg-card hover:bg-accent/50 p-5 rounded-3xl border border-border flex items-center gap-4 transition-all duration-300 shadow-sm group">
            <div className="bg-blue-100 dark:bg-blue-500/20 p-4 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <BookOpen size={28} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">{renderT(t.practice)}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {language === 'bilingual' ? (
                  <span className="flex flex-col">
                    <span>Master all 14 DVSA categories</span>
                    <span className="text-xs opacity-70">১৪টি DVSA ক্যাটাগরিতে দক্ষতা অর্জন করুন</span>
                  </span>
                ) : (
                  language === 'bn' ? '১৪টি DVSA ক্যাটাগরিতে দক্ষতা অর্জন করুন' : 'Master all 14 DVSA categories'
                )}
              </p>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
          
          <Link to="/mock-test" className="bg-card hover:bg-accent/50 p-5 rounded-3xl border border-border flex items-center gap-4 transition-all duration-300 shadow-sm group">
            <div className="bg-emerald-100 dark:bg-emerald-500/20 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <FileCheck size={28} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">{renderT(t.mockTest)}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {language === 'bilingual' ? (
                  <span className="flex flex-col">
                    <span>50 questions, 57 minutes</span>
                    <span className="text-xs opacity-70">৫০টি প্রশ্ন, ৫৭ মিনিট</span>
                  </span>
                ) : (
                  language === 'bn' ? '৫০টি প্রশ্ন, ৫৭ মিনিট' : '50 questions, 57 minutes'
                )}
              </p>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>

          <Link to="/profile" className="bg-card hover:bg-accent/50 p-5 rounded-3xl border border-border flex items-center gap-4 transition-all duration-300 shadow-sm group">
            <div className="bg-purple-100 dark:bg-purple-500/20 p-4 rounded-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
              <User size={28} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">{renderT(t.profile)}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {language === 'bilingual' ? (
                  <span className="flex flex-col">
                    <span>View stats and settings</span>
                    <span className="text-xs opacity-70">পরিসংখ্যান এবং সেটিংস দেখুন</span>
                  </span>
                ) : (
                  language === 'bn' ? 'পরিসংখ্যান এবং সেটিংস দেখুন' : 'View stats and settings'
                )}
              </p>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};
