import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../data/questions';
import { firebaseService } from '../services/firebase';

export interface Purchase {
  id: string;
  item: string;
  date: string;
  amount: number;
}

export interface User {
  name: string;
  email: string;
  status: 'pending' | 'approved';
}

export interface PracticeSettings {
  onlyNew: boolean;
  autoNext: boolean;
  alertIncorrect: boolean;
  maxQuestions: 10 | 20 | 30 | 40 | 50 | 'all';
}

interface AppState {
  language: Language;
  theme: 'light' | 'dark';
  wrongAnswers: string[]; // Array of question IDs
  mockTestScores: number[]; // Array of scores out of 50
  purchases: Purchase[];
  user: User | null;
  hasPurchased: boolean;
  answeredQuestions: string[]; // Array of question IDs answered correctly
  practiceSettings: PracticeSettings;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  addWrongAnswer: (id: string) => void;
  removeWrongAnswer: (id: string) => void;
  addAnsweredQuestion: (id: string) => void;
  updatePracticeSettings: (settings: Partial<PracticeSettings>) => void;
  addMockTestScore: (score: number) => void;
  addPurchase: (purchase: Purchase) => void;
  setHasPurchased: (value: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'bilingual',
      theme: 'light',
      wrongAnswers: [],
      mockTestScores: [],
      purchases: [],
      user: null,
      hasPurchased: false,
      answeredQuestions: [],
      practiceSettings: {
        onlyNew: false,
        autoNext: false,
        alertIncorrect: false,
        maxQuestions: 'all',
      },
      toggleLanguage: () => set((state) => {
        const nextLang: Record<Language, Language> = {
          en: 'bn',
          bn: 'bilingual',
          bilingual: 'en'
        };
        return { language: nextLang[state.language] };
      }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      addWrongAnswer: (id) => {
        set((state) => {
          const newWrongAnswers = state.wrongAnswers.includes(id) ? state.wrongAnswers : [...state.wrongAnswers, id];
          if (state.user) {
            firebaseService.updateUserStats(state.user.email, {
              wrongAnswers: newWrongAnswers,
              answeredQuestions: state.answeredQuestions,
              mockTestScores: state.mockTestScores,
              purchases: state.purchases
            }).catch(console.error);
          }
          return { wrongAnswers: newWrongAnswers };
        });
      },
      removeWrongAnswer: (id) => {
        set((state) => {
          const newWrongAnswers = state.wrongAnswers.filter(qId => qId !== id);
          if (state.user) {
            firebaseService.updateUserStats(state.user.email, {
              wrongAnswers: newWrongAnswers,
              answeredQuestions: state.answeredQuestions,
              mockTestScores: state.mockTestScores,
              purchases: state.purchases
            }).catch(console.error);
          }
          return { wrongAnswers: newWrongAnswers };
        });
      },
      addAnsweredQuestion: (id) => {
        set((state) => {
          const newAnswered = state.answeredQuestions.includes(id) 
            ? state.answeredQuestions 
            : [...state.answeredQuestions, id];
          
          if (state.user) {
            firebaseService.updateUserStats(state.user.email, {
              wrongAnswers: state.wrongAnswers,
              answeredQuestions: newAnswered,
              mockTestScores: state.mockTestScores,
              purchases: state.purchases
            }).catch(console.error);
          }
          return { answeredQuestions: newAnswered };
        });
      },
      updatePracticeSettings: (settings) => {
        set((state) => ({
          practiceSettings: { ...state.practiceSettings, ...settings }
        }));
      },
      addMockTestScore: (score) => {
        set((state) => {
          const newScores = [...state.mockTestScores, score];
          if (state.user) {
            firebaseService.updateUserStats(state.user.email, {
              wrongAnswers: state.wrongAnswers,
              answeredQuestions: state.answeredQuestions,
              mockTestScores: newScores,
              purchases: state.purchases
            }).catch(console.error);
          }
          return { mockTestScores: newScores };
        });
      },
      addPurchase: (purchase) => {
        set((state) => {
          const newPurchases = [...state.purchases, purchase];
          if (state.user) {
            firebaseService.updateUserStats(state.user.email, {
              wrongAnswers: state.wrongAnswers,
              answeredQuestions: state.answeredQuestions,
              mockTestScores: state.mockTestScores,
              purchases: newPurchases
            }).catch(console.error);
          }
          return { purchases: newPurchases };
        });
      },
      setHasPurchased: (value) => set({ hasPurchased: value }),
      login: (user) => set({ user }),
      logout: () => set({ user: null, wrongAnswers: [], answeredQuestions: [], mockTestScores: [], purchases: [], hasPurchased: false }),
    }),
    {
      name: 'uk-theory-test-bangla-storage',
    }
  )
);
