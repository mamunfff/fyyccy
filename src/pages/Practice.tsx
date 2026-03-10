import React, { useState, useMemo, useEffect } from 'react';
import { useStore, PracticeSettings } from '../store/useStore';
import { questions, categories } from '../data/questions';
import { QuestionCard } from '../components/QuestionCard';
import { ChevronLeft, ChevronRight, ListFilter, LayoutGrid, Settings, Check, AlertCircle, Zap } from 'lucide-react';
import { cn } from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

export const Practice: React.FC = () => {
  const language = useStore((state) => state.language);
  const practiceSettings = useStore((state) => state.practiceSettings);
  const updatePracticeSettings = useStore((state) => state.updatePracticeSettings);
  const answeredQuestions = useStore((state) => state.answeredQuestions);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const filteredQuestions = useMemo(() => {
    let qs = selectedCategory === 'all'
      ? questions
      : selectedCategory 
        ? questions.filter(q => q.categoryId === selectedCategory)
        : [];

    if (practiceSettings.onlyNew) {
      qs = qs.filter(q => !answeredQuestions.includes(q.id));
    }

    // Shuffle for variety if it's a limited test? 
    // Or just slice. The user didn't ask for shuffle.
    
    if (practiceSettings.maxQuestions !== 'all' && qs.length > Number(practiceSettings.maxQuestions)) {
      qs = qs.slice(0, Number(practiceSettings.maxQuestions));
    }

    return qs;
  }, [selectedCategory, practiceSettings, answeredQuestions]);

  const currentQuestion = filteredQuestions[currentIndex];
  const nextQuestion = filteredQuestions[currentIndex + 1];

  useEffect(() => {
    if (nextQuestion && language === 'bn' && nextQuestion.text.bn === nextQuestion.text.en) {
      // Pre-translate the next question in the background
      import('../services/translationService').then(({ translationService }) => {
        translationService.translateQuestion(nextQuestion).catch(console.error);
      });
    }
  }, [currentIndex, language, nextQuestion]);

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!isCorrect && practiceSettings.alertIncorrect) {
      // Simple alert for now, could be a toast
      alert(language === 'bn' ? 'ভুল উত্তর! সঠিক উত্তরটি দেখুন।' : 'Incorrect answer! Check the correct one.');
    }

    if (isCorrect && practiceSettings.autoNext) {
      setTimeout(() => {
        handleNext();
      }, 1500); // Small delay to show correct state
    }
  };

  if (!selectedCategory) {
    return (
      <div className="space-y-6 font-bengali">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 p-3 rounded-2xl">
              <LayoutGrid className="text-primary" size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              {language === 'bn' ? 'ক্যাটাগরি নির্বাচন করুন' : 'SELECT CATEGORY'}
            </h2>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "p-3 rounded-2xl transition-all",
              showSettings ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            <Settings size={20} />
          </button>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card border border-border rounded-3xl p-6 mb-6 space-y-4 shadow-sm">
                <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Zap size={14} className="text-primary" />
                  {language === 'bn' ? 'প্র্যাকটিস সেটিংস' : 'PRACTICE SETTINGS'}
                </h3>
                
                <div className="grid gap-3">
                  <button
                    onClick={() => updatePracticeSettings({ onlyNew: !practiceSettings.onlyNew })}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", practiceSettings.onlyNew ? "bg-primary/20 text-primary" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400")}>
                        <Check size={16} />
                      </div>
                      <span className="font-bold text-sm">{language === 'bn' ? 'শুধুমাত্র নতুন প্রশ্ন' : 'Only new questions'}</span>
                    </div>
                    <div className={cn("w-10 h-5 rounded-full relative transition-colors", practiceSettings.onlyNew ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-700")}>
                      <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", practiceSettings.onlyNew ? "right-1" : "left-1")} />
                    </div>
                  </button>

                  <button
                    onClick={() => updatePracticeSettings({ autoNext: !practiceSettings.autoNext })}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", practiceSettings.autoNext ? "bg-primary/20 text-primary" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400")}>
                        <ChevronRight size={16} />
                      </div>
                      <span className="font-bold text-sm">{language === 'bn' ? 'অটো নেক্সট কোয়েশ্চেন' : 'Auto move next question'}</span>
                    </div>
                    <div className={cn("w-10 h-5 rounded-full relative transition-colors", practiceSettings.autoNext ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-700")}>
                      <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", practiceSettings.autoNext ? "right-1" : "left-1")} />
                    </div>
                  </button>

                  <button
                    onClick={() => updatePracticeSettings({ alertIncorrect: !practiceSettings.alertIncorrect })}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", practiceSettings.alertIncorrect ? "bg-primary/20 text-primary" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400")}>
                        <AlertCircle size={16} />
                      </div>
                      <span className="font-bold text-sm">{language === 'bn' ? 'ভুল উত্তরে অ্যালার্ট' : 'Alert if answer is incorrect'}</span>
                    </div>
                    <div className={cn("w-10 h-5 rounded-full relative transition-colors", practiceSettings.alertIncorrect ? "bg-primary" : "bg-zinc-300 dark:bg-zinc-700")}>
                      <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all", practiceSettings.alertIncorrect ? "right-1" : "left-1")} />
                    </div>
                  </button>

                  <div className="p-4 rounded-2xl bg-muted/30 space-y-3">
                    <span className="font-bold text-sm block">{language === 'bn' ? 'সর্বোচ্চ প্রশ্ন সংখ্যা' : 'Maximum number of questions'}</span>
                    <div className="flex flex-wrap gap-2">
                      {[10, 20, 30, 40, 50, 'all'].map((num) => (
                        <button
                          key={num}
                          onClick={() => updatePracticeSettings({ maxQuestions: num as any })}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-black transition-all",
                            practiceSettings.maxQuestions === num 
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                              : "bg-background border border-border text-muted-foreground hover:border-primary/50"
                          )}
                        >
                          {num === 'all' ? (language === 'bn' ? 'সব' : 'ALL') : num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid gap-3">
          <button
            onClick={() => { setSelectedCategory('all'); setCurrentIndex(0); }}
            className="bg-zinc-900 dark:bg-zinc-100 p-6 rounded-3xl text-left text-white dark:text-zinc-900 shadow-2xl shadow-zinc-900/20 dark:shadow-none hover:scale-[1.02] transition-all flex justify-between items-center group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
            <span className="font-black text-xl uppercase tracking-widest relative z-10">{language === 'bn' ? 'সব প্রশ্ন' : 'ALL QUESTIONS'}</span>
            <span className="text-xs font-black bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md relative z-10">{questions.length}</span>
          </button>
          
          {categories.map((cat, i) => {
            const count = questions.filter(q => q.categoryId === cat.id).length;
            return (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                key={cat.id}
                onClick={() => { 
                  if (count > 0) {
                    setSelectedCategory(cat.id); 
                    setCurrentIndex(0); 
                  }
                }}
                disabled={count === 0}
                className={cn(
                  "bg-card p-6 rounded-3xl border border-border text-left transition-all flex justify-between items-center group",
                  count > 0 ? "hover:border-primary hover:bg-zinc-50 dark:hover:bg-zinc-900" : "opacity-40 cursor-not-allowed grayscale"
                )}
              >
                <span className="font-bold text-base leading-tight pr-6">{cat.name[language]}</span>
                <span className={cn(
                  "text-[10px] font-black px-3 py-1.5 rounded-full transition-all shrink-0 uppercase tracking-widest",
                  count > 0 ? "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>{count}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  const categoryName = selectedCategory === 'all' 
    ? (language === 'bn' ? 'সব প্রশ্ন' : 'All Questions')
    : categories.find(c => c.id === selectedCategory)?.name[language];

  return (
    <div className="space-y-6 font-bengali pb-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 bg-muted/50 px-3 py-1.5 rounded-full transition-colors"
        >
          <ChevronLeft size={16} />
          {language === 'bn' ? 'ফিরে যান' : 'Back'}
        </button>
        <div className="text-sm font-bold bg-primary/10 text-primary px-4 py-1.5 rounded-full">
          {currentIndex + 1} <span className="text-primary/50 mx-1">/</span> {filteredQuestions.length}
        </div>
      </div>

      <div className="bg-gradient-to-r from-accent to-transparent p-4 rounded-2xl border border-accent flex justify-between items-center">
        <h3 className="font-bold text-foreground line-clamp-1 mr-4">{categoryName}</h3>
      </div>

      {currentQuestion ? (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard 
            question={currentQuestion} 
            onAnswer={handleAnswer}
          />
        </motion.div>
      ) : (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-3xl border border-border">
          {language === 'bn' ? 'কোনো প্রশ্ন পাওয়া যায়নি।' : 'No questions found.'}
        </div>
      )}

      <div className="flex justify-between gap-4 pt-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 py-4 rounded-2xl border-2 border-border font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-muted transition-colors text-foreground"
        >
          <ChevronLeft size={20} />
          {language === 'bn' ? 'আগেরটি' : 'Previous'}
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === filteredQuestions.length - 1}
          className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          {language === 'bn' ? 'পরবর্তী' : 'Next'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
