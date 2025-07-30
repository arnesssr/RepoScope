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

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Request headers:', config.headers);
    console.log('Request params:', config.params);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url);
    console.error('Error details:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Repository methods
async analyzeDependencies(repoName: string, token: string) {
    return apiClient.post(`/api/dependencies/analyze`, { repoName }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getDependencyGraph(repoName: string, includeDev: boolean, token: string) {
    return apiClient.get(`/api/dependencies/graph`, {
      params: { repoName, includeDev },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getDependencyReport(reportId: string, token: string) {
    return apiClient.get(`/api/dependencies/reports/${reportId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async analyzeSecurity(repoName: string, token: string) {
    return apiClient.post(`/api/security/analyze`, null, {
      params: { repo_name: repoName },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getVulnerabilities(repoName: string, severity?: string, token: string) {
    return apiClient.get(`/api/security/vulnerabilities`, {
      params: { repo_name: repoName, severity },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getSecurityReport(reportId: string, token: string) {
    return apiClient.get(`/api/security/report/${reportId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getSecurityMetrics(repoName: string, token: string) {
    return apiClient.get(`/api/security/metrics`, {
      params: { repo_name: repoName },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async scanDependencies(repoName: string, token: string) {
    return apiClient.post(`/api/security/scan/dependencies`, null, {
      params: { repo_name: repoName },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async analyzePerformance(repoName: string, token: string) {
    return apiClient.post(`/api/performance/analyze`, { repoName }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getPerformanceMetrics(repoName: string, timeRange: number, token: string) {
    return apiClient.get(`/api/performance/metrics`, {
      params: { repoName, timeRange },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getPerformanceReport(reportId: string, token: string) {
    return apiClient.get(`/api/performance/report/${reportId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getPerformanceTrends(repoName: string, metric: string, period: number, token: string) {
    return apiClient.get(`/api/performance/trends`, {
      params: { repoName, metric, period },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async profileCode(repoName: string, filePath: string, functionName: string, token: string) {
    return apiClient.post(`/api/performance/profile`, {
      repoName, filePath, functionName
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getBenchmarks(repoName: string, token: string) {
    return apiClient.get(`/api/performance/benchmarks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async analyzeQuality(repoName: string, token: string) {
    return apiClient.post(`/api/quality/analyze`, { repoName }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getQualityMetrics(repoName: string, metricType: string, token: string) {
    return apiClient.get(`/api/quality/metrics`, {
      params: { repoName, metricType },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getQualityReport(reportId: string, token: string) {
    return apiClient.get(`/api/quality/report/${reportId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getQualityIssues(repoName: string, severity: string, token: string) {
    return apiClient.get(`/api/quality/issues`, {
      params: { repoName, severity },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getPredictions(repoName: string, token: string) {
    return apiClient.get(`/api/insights/predictions`, {
      params: { repoName },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getTrends(repoName: string, token: string) {
    return apiClient.get(`/api/insights/trends`, {
      params: { repoName },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getContributorInsights(repoName: string, token: string) {
    return apiClient.get(`/api/insights/contributor-insights`, {
      params: { repoName },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  async getRepositories(token: string): Promise<Repository[]> {
    console.log('Getting repositories with token:', token ? 'Token exists' : 'No token');
    console.log('API_BASE_URL:', API_BASE_URL);
    
    try {
      const response = await apiClient.get('/api/repositories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Repository API response:', response.data);
      return response.data.repositories || [];
    } catch (error) {
      console.error('Repository API error:', error);
      // Don't fall back to mock data - let the error propagate
      throw error;
    }
  },

  // Analysis methods
  async analyzeRepository(repositoryFullName: string, token: string): Promise<AnalysisResult> {
    const response = await apiClient.post(`/api/repositories/${repositoryFullName}/analyze`, null, {
      params: { token }
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
