import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { questions, Question } from '../data/questions';
import { QuestionCard } from '../components/QuestionCard';
import { Timer, AlertCircle, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';
import { cn } from '../components/BottomNav';
import { motion } from 'framer-motion';

const TEST_DURATION_MINUTES = 57;
const PASS_MARK = 43;
const TOTAL_QUESTIONS = 50;

export const MockTest: React.FC = () => {
  const { language, addMockTestScore } = useStore();
  const [testState, setTestState] = useState<'intro' | 'running' | 'results'>('intro');
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_MINUTES * 60);

  useEffect(() => {
    let timer: number;
    if (testState === 'running' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testState === 'running') {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [testState, timeLeft]);

  const startTest = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => shuffled[i % shuffled.length]);
    
    setTestQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(TEST_DURATION_MINUTES * 60);
    setTestState('running');
  };

  const handleAnswer = (isCorrect: boolean) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: isCorrect }));
    
    setTimeout(() => {
      if (currentIndex < TOTAL_QUESTIONS - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishTest();
      }
    }, 1000);
  };

  const finishTest = () => {
    setTestState('results');
    const score = Object.values(answers).filter(Boolean).length;
    addMockTestScore(score);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (testState === 'intro') {
    return (
      <div className="space-y-8 font-bengali text-center py-8 animate-in fade-in">
        <div className="bg-primary/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
          <Timer size={56} className="text-primary relative z-10" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          {language === 'bn' ? 'মক টেস্ট' : 'Mock Test'}
        </h2>
        <div className="space-y-4 text-muted-foreground max-w-sm mx-auto text-left bg-card p-8 rounded-3xl border border-border shadow-sm">
          <p className="flex items-center gap-3 font-medium">
            <div className="bg-green-100 dark:bg-green-500/20 p-2 rounded-lg text-green-600 dark:text-green-400"><CheckCircle2 size={20} /></div>
            {language === 'bn' ? '৫০টি বহুনির্বাচনী প্রশ্ন' : '50 multiple choice questions'}
          </p>
          <p className="flex items-center gap-3 font-medium">
            <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg text-blue-600 dark:text-blue-400"><Timer size={20} /></div>
            {language === 'bn' ? 'সময়: ৫৭ মিনিট' : 'Time: 57 minutes'}
          </p>
          <p className="flex items-center gap-3 font-medium">
            <div className="bg-orange-100 dark:bg-orange-500/20 p-2 rounded-lg text-orange-600 dark:text-orange-400"><AlertCircle size={20} /></div>
            {language === 'bn' ? 'পাস মার্ক: ৪৩/৫০' : 'Pass mark: 43/50'}
          </p>
        </div>
        <button
          onClick={startTest}
          className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          {language === 'bn' ? 'টেস্ট শুরু করুন' : 'Start Test'}
        </button>
      </div>
    );
  }

  if (testState === 'results') {
    const score = Object.values(answers).filter(Boolean).length;
    const passed = score >= PASS_MARK;

    return (
      <div className="space-y-8 font-bengali text-center py-8 animate-in zoom-in-95 duration-500">
        <div className={cn(
          "w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-6 border-8 relative",
          passed ? "border-success/30 bg-success/10 text-success" : "border-destructive/30 bg-destructive/10 text-destructive"
        )}>
          {passed ? <CheckCircle2 size={80} /> : <XCircle size={80} />}
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight">
          {passed 
            ? (language === 'bn' ? 'অভিনন্দন! আপনি পাস করেছেন' : 'Congratulations! You Passed')
            : (language === 'bn' ? 'দুঃখিত, আপনি ফেল করেছেন' : 'Sorry, You Failed')
          }
        </h2>
        
        <div className="text-7xl font-black my-6 tracking-tighter">
          {score}<span className="text-3xl text-muted-foreground font-medium">/50</span>
        </div>
        
        <p className="text-lg text-muted-foreground mb-8 font-medium">
          {passed 
            ? (language === 'bn' ? 'দারুণ কাজ! আসল পরীক্ষার জন্য আপনি প্রস্তুত।' : 'Great job! You are ready for the real test.')
            : (language === 'bn' ? 'হতাশ হবেন না। আরও অনুশীলন করুন।' : 'Don\'t give up. Keep practicing.')
          }
        </p>

        <button
          onClick={() => setTestState('intro')}
          className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <RefreshCcw size={24} />
          {language === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
        </button>
      </div>
    );
  }

  const currentQ = testQuestions[currentIndex];

  return (
    <div className="space-y-6 font-bengali pb-8">
      <div className="flex items-center justify-between bg-card/80 backdrop-blur-md p-4 rounded-3xl border border-border shadow-sm sticky top-[88px] z-10">
        <div className={cn(
          "flex items-center gap-2 font-mono font-bold text-xl px-4 py-2 rounded-2xl transition-colors",
          timeLeft < 300 ? "bg-destructive/10 text-destructive animate-pulse" : "bg-primary/10 text-primary"
        )}>
          <Timer size={24} />
          <span>{formatTime(timeLeft)}</span>
        </div>
        <div className="text-sm font-bold bg-muted px-4 py-2 rounded-2xl">
          {currentIndex + 1} <span className="text-muted-foreground mx-1">/</span> {TOTAL_QUESTIONS}
        </div>
      </div>

      <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex) / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      {currentQ && (
        <motion.div
          key={`${currentIndex}-${currentQ.id}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard 
            question={currentQ} 
            onAnswer={handleAnswer}
            showExplanation={false}
          />
        </motion.div>
      )}
    </div>
  );
};
