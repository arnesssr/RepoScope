import axios from 'axios';
import { Repository, AnalysisResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service methods
export const apiService = {
  // Repository methods
  async getRepositories(token: string): Promise<Repository[]> {
    const response = await apiClient.get('/api/repositories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.repositories;
  },

  // Analysis methods
  async analyzeRepository(repositoryFullName: string, token: string): Promise<AnalysisResult> {
    const response = await apiClient.post(`/api/repositories/${repositoryFullName}/analyze`, null, {
      params: { token },
    });
    return response.data;
  },

  // Get analysis status
  async getAnalysisStatus(analysisId: string): Promise<AnalysisResult> {
    const response = await apiClient.get(`/api/analysis/${analysisId}`);
    return response.data;
  },

  // Get repository analysis history
  async getRepositoryAnalyses(repositoryId: string): Promise<AnalysisResult[]> {
    const response = await apiClient.get(`/api/repositories/${repositoryId}/analyses`);
    return response.data;
  },

  // Auth methods (for future use when we implement proper auth)
  async getCurrentUser(token: string) {
    // TODO: Implement when we have proper JWT auth
    return null;
  },
};

export default apiService;
