import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalysisResult } from '../types';
import apiService from '../services/api';

interface AnalysisState {
  // Current analysis
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  
  // Analysis history
  analysisHistory: Record<string, AnalysisResult[]>; // keyed by repository ID
  
  // Selected repository
  selectedRepository: string | null;
  
  // Actions
  analyzeRepository: (repositoryId: string, token: string) => Promise<void>;
  setSelectedRepository: (repositoryId: string | null) => void;
  clearAnalysis: () => void;
  loadAnalysisHistory: (repositoryId: string) => Promise<void>;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      currentAnalysis: null,
      isAnalyzing: false,
      analysisError: null,
      analysisHistory: {},
      selectedRepository: null,

      analyzeRepository: async (repositoryId: string, token: string) => {
        set({ isAnalyzing: true, analysisError: null });
        
        try {
          const result = await apiService.analyzeRepository(repositoryId, token);
          
          set((state) => ({
            currentAnalysis: result,
            isAnalyzing: false,
            analysisHistory: {
              ...state.analysisHistory,
              [repositoryId]: [result, ...(state.analysisHistory[repositoryId] || [])]
            }
          }));
        } catch (error) {
          set({
            isAnalyzing: false,
            analysisError: error instanceof Error ? error.message : 'Analysis failed'
          });
          throw error;
        }
      },

      setSelectedRepository: (repositoryId: string | null) => {
        set({ selectedRepository: repositoryId });
      },

      clearAnalysis: () => {
        set({
          currentAnalysis: null,
          analysisError: null,
          isAnalyzing: false
        });
      },

      loadAnalysisHistory: async (repositoryId: string) => {
        try {
          const history = await apiService.getRepositoryAnalyses(repositoryId);
          set((state) => ({
            analysisHistory: {
              ...state.analysisHistory,
              [repositoryId]: history
            }
          }));
        } catch (error) {
          console.error('Failed to load analysis history:', error);
        }
      }
    }),
    {
      name: 'reposcope-analysis',
      partialize: (state) => ({
        selectedRepository: state.selectedRepository,
        analysisHistory: state.analysisHistory
      })
    }
  )
);
