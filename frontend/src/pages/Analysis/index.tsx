import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Play, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAnalysisStore } from '../../stores/analysisStore';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/ui/Card';
import { AnalysisResults } from '../../components/analysis/AnalysisResults';

const Analysis = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { 
    currentAnalysis, 
    isAnalyzing, 
    analysisError,
    selectedRepository,
    analyzeRepository,
    setSelectedRepository,
    clearAnalysis
  } = useAnalysisStore();

  useEffect(() => {
    if (repoId && repoId !== selectedRepository) {
      setSelectedRepository(repoId);
      clearAnalysis();
    }
  }, [repoId, selectedRepository, setSelectedRepository, clearAnalysis]);

  const handleAnalyze = async () => {
    if (!repoId || !token) return;
    
    try {
      await analyzeRepository(repoId, token);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!repoId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <p className="text-gray-400 mb-4">No repository selected</p>
          <Button onClick={handleBack}>Go to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Repository Analysis
            </h1>
            <p className="text-gray-400">
              Analyzing: <span className="text-cyan-400 font-mono">{repoId}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {currentAnalysis && (
              <Button
                onClick={handleAnalyze}
                variant="secondary"
                icon={RefreshCw}
                disabled={isAnalyzing}
              >
                Re-analyze
              </Button>
            )}
            {!currentAnalysis && !isAnalyzing && (
              <Button
                onClick={handleAnalyze}
                icon={Play}
              >
                Start Analysis
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {isAnalyzing && (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Analyzing Repository...
            </h3>
            <p className="text-gray-400 max-w-md">
              This may take a few minutes depending on the repository size. 
              We're analyzing commit history, code patterns, and generating insights.
            </p>
          </div>
        </Card>
      )}

      {analysisError && !isAnalyzing && (
        <Card className="p-8 border-red-500/20">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-red-400 mb-2">
              Analysis Failed
            </h3>
            <p className="text-gray-400 mb-4">{analysisError}</p>
            <Button onClick={handleAnalyze} variant="secondary">
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {currentAnalysis && !isAnalyzing && (
        <AnalysisResults analysis={currentAnalysis} />
      )}

      {!currentAnalysis && !isAnalyzing && !analysisError && (
        <Card className="p-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              No Analysis Available
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Click "Start Analysis" to analyze this repository and generate insights 
              about its development patterns, code quality, and project planning.
            </p>
            <Button onClick={handleAnalyze} icon={Play} size="lg">
              Start Analysis
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Analysis;
