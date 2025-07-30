import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

interface QualityIssue {
  id: string;
  description: string;
  severity: string;
}

const CodeQuality = () => {
  const { token } = useAuthStore();
  const [issues, setIssues] = useState<QualityIssue[]>([]);

  const { data, isLoading } = useQuery<QualityIssue[]>({
    queryKey: ['code-quality'],
    queryFn: async () => {
      const repoName = 'sample-repo';  // Replace with your repo name
      const response = await apiService.getQualityIssues(repoName, 'all', token!);
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setIssues(data);
    }
  }, [data]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Code Quality Analysis</h1>
      <p className="text-gray-400 mb-4">Review and improve code quality</p>

      {isLoading && <div>Loading...</div>}

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-medium text-white">Quality Issues</h2>
        <ul className="list-disc px-6 text-gray-400">
          {issues.map(issue => (
            <li key={issue.id} className="mb-2">
              <strong className="text-red-500">[{issue.severity.toUpperCase()}]</strong> {issue.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CodeQuality;
