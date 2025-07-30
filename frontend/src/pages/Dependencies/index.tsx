import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

interface DependencyNode {
  id: string;
  name: string;
  version: string;
  vulnerabilities: number;
}

interface DependencyGraph {
  nodes: DependencyNode[];
  links: Array<{ source: string, target: string }>;
}

const Dependencies = () => {
  const { token } = useAuthStore();
  const [graph, setGraph] = useState<DependencyGraph | null>(null);

  const { data, isLoading } = useQuery<DependencyGraph>({
    queryKey: ['dependency-graph'],
    queryFn: async () => {
      const repoName = 'sample-repo';  // Replace with actual repository name
      const response = await apiService.getDependencyGraph(repoName, false, token!);
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setGraph(data);
    }
  }, [data]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Dependency Analysis</h1>
      <p className="text-gray-400 mb-4">Visualize and analyze project dependencies</p>

      {isLoading && <div>Loading...</div>}

      {graph && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-white">Dependency Graph</h2>
          <p className="text-gray-400">Nodes: {graph.nodes.length}</p>
          <p className="text-gray-400 mb-4">Vulnerabilities: {graph.nodes.reduce((a, b) => a + b.vulnerabilities, 0)}</p>
          {/* Visualization Placeholder */}
          <div className="w-full h-64 bg-gray-700 rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default Dependencies;

