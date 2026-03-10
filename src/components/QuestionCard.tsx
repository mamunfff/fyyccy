import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../data/questions';
import { useStore } from '../store/useStore';
import { CheckCircle2, XCircle, Circle, Loader2 } from 'lucide-react';
import { cn } from './BottomNav';
import { motion } from 'framer-motion';
import { translationService } from '../services/translationService';

interface QuestionCardProps {
  question: Question;
  onAnswer?: (isCorrect: boolean) => void;
  showExplanation?: boolean;
  isReviewMode?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question: initialQuestion, 
  onAnswer, 
  showExplanation = true,
  isReviewMode = false
}) => {
  const language = useStore((state) => state.language);
  const addWrongAnswer = useStore((state) => state.addWrongAnswer);
  const removeWrongAnswer = useStore((state) => state.removeWrongAnswer);
  
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const translatingId = useRef<string | null>(null);

  useEffect(() => {
    setQuestion(initialQuestion);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [initialQuestion.id]);

  useEffect(() => {
    const translateIfNeeded = async () => {
      if (language === 'bn' && question.text.bn === question.text.en) {
        if (translatingId.current === question.id) return;
        translatingId.current = question.id;
        
        setIsTranslating(true);
        const translated = await translationService.translateQuestion(question);
        setQuestion(translated);
        setIsTranslating(false);
        translatingId.current = null;
      }
    };
    translateIfNeeded();
  }, [language, question.id, question.text.bn, question.text.en]);

  const handleOptionClick = (optionId: string) => {
    if (isAnswered && !isReviewMode) return;
    
    setSelectedOption(optionId);
    setIsAnswered(true);
    
    const isCorrect = optionId === question.correctOptionId;
    
    if (!isCorrect) {
      addWrongAnswer(question.id);
    } else {
      useStore.getState().addAnsweredQuestion(question.id);
      if (isReviewMode) {
        removeWrongAnswer(question.id);
      }
    }

    if (onAnswer) {
      onAnswer(isCorrect);
    }
  };

  return (
    <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm font-bengali">
      {question.imageUrl && (
        <div className="w-full h-56 bg-muted flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
          <img 
            src={question.imageUrl} 
            alt="Question reference" 
            className="max-h-full max-w-full object-contain rounded-2xl shadow-sm relative z-10"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      
      <div className="p-6 space-y-6 relative">
        {isTranslating && (
          <div className="absolute inset-0 bg-card/50 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="text-primary animate-spin" size={32} />
            <p className="text-sm font-bold text-primary">অনুবাদ করা হচ্ছে...</p>
          </div>
        )}
        
        <h3 className={cn(
          "text-xl font-semibold tracking-tight text-foreground",
          language === 'bn' ? "leading-relaxed" : "leading-snug"
        )}>
          {question.text[language]}
        </h3>
        
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.id === question.correctOptionId;
            const showCorrect = isAnswered && isCorrect;
            const showWrong = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={isAnswered && !isReviewMode}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 group",
                  !isAnswered && "border-transparent bg-muted/50 hover:bg-accent hover:border-primary/20",
                  showCorrect && "border-success bg-success/10 text-foreground",
                  showWrong && "border-destructive bg-destructive/10 text-foreground",
                  isAnswered && !isSelected && !isCorrect && "border-transparent bg-muted/30 opacity-50"
                )}
              >
                <div className="flex-shrink-0">
                  {!isAnswered && <Circle size={24} className="text-muted-foreground group-hover:text-primary/50 transition-colors" />}
                  {showCorrect && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <CheckCircle2 className="text-success" size={24} />
                    </motion.div>
                  )}
                  {showWrong && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <XCircle className="text-destructive" size={24} />
                    </motion.div>
                  )}
                </div>
                <span className={cn(
                  "font-medium text-base",
                  language === 'bn' ? "leading-relaxed" : "leading-normal"
                )}>
                  {option.text[language]}
                </span>
              </button>
            );
          })}
        </div>

        {isAnswered && showExplanation && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-5 bg-accent/50 rounded-2xl border border-accent"
          >
            <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
              {language === 'bn' ? 'ব্যাখ্যা' : 'Explanation'}
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
              {question.explanation[language]}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
