import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../data/questions';
import { firebaseService } from '../services/firebase';

export interface User {
  name: string;
  email: string;
}

interface AppState {
  language: Language;
  theme: 'light' | 'dark';
  wrongAnswers: string[]; // Array of question IDs
  mockTestScores: number[]; // Array of scores out of 50
  user: User | null;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  addWrongAnswer: (id: string) => void;
  removeWrongAnswer: (id: string) => void;
  addMockTestScore: (score: number) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'bn',
      theme: 'light',
      wrongAnswers: [],
      mockTestScores: [],
      user: null,
      toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'bn' : 'en' })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      addWrongAnswer: (id) => {
        set((state) => {
          const newWrongAnswers = state.wrongAnswers.includes(id) ? state.wrongAnswers : [...state.wrongAnswers, id];
          if (state.user) {
            firebaseService.updateUserStats(state.user.email, {
              wrongAnswers: newWrongAnswers,
              mockTestScores: state.mockTestScores
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
              mockTestScores: state.mockTestScores
            }).catch(console.error);
          }
          return { wrongAnswers: newWrongAnswers };
        });
      },
      addMockTestScore: (score) => {
        set((state) => {
          const newScores = [...state.mockTestScores, score];
          if (state.user) {
            firebaseService.updateUserStats(state.user.email, {
              wrongAnswers: state.wrongAnswers,
              mockTestScores: newScores
            }).catch(console.error);
          }
          return { mockTestScores: newScores };
        });
      },
      login: (user) => set({ user }),
      logout: () => set({ user: null, wrongAnswers: [], mockTestScores: [] }),
    }),
    {
      name: 'uk-theory-test-bangla-storage',
    }
  )
);
