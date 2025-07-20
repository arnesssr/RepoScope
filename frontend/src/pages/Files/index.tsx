import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileCode, Folder, Search, Download, Eye } from 'lucide-react'
import { FileBrowser } from '../../components/files/FileBrowser'
import { FileViewer } from '../../components/files/FileViewer'
import { FileSearch } from '../../components/files/FileSearch'
import { BreadcrumbNav } from '../../components/files/BreadcrumbNav'

interface FileNode {
  id: string
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  lastModified?: string
  language?: string
  children?: FileNode[]
}

interface FileContent {
  path: string
  content: string
  language: string
  size: number
  lines: number
}

const Files = () => {
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'tree' | 'flat'>('tree')

  const { data: fileTree, isLoading: isLoadingTree } = useQuery<FileNode>({
    queryKey: ['file-tree', currentPath],
    queryFn: async () => {
      // Mock data for now
      return {
        id: 'root',
        name: 'RepoScope',
        path: '/',
        type: 'directory',
        children: [
          {
            id: '1',
            name: 'src',
            path: '/src',
            type: 'directory',
            children: [
              {
                id: '11',
                name: 'components',
                path: '/src/components',
                type: 'directory',
                children: [
                  {
                    id: '111',
                    name: 'Button.tsx',
                    path: '/src/components/Button.tsx',
                    type: 'file',
                    size: 2345,
                    lastModified: new Date().toISOString(),
                    language: 'typescript'
                  },
                  {
                    id: '112',
                    name: 'Card.tsx',
                    path: '/src/components/Card.tsx',
                    type: 'file',
                    size: 1890,
                    lastModified: new Date().toISOString(),
                    language: 'typescript'
                  }
                ]
              },
              {
                id: '12',
                name: 'pages',
                path: '/src/pages',
                type: 'directory',
                children: [
                  {
                    id: '121',
                    name: 'index.tsx',
                    path: '/src/pages/index.tsx',
                    type: 'file',
                    size: 3456,
                    lastModified: new Date().toISOString(),
                    language: 'typescript'
                  }
                ]
              },
              {
                id: '13',
                name: 'App.tsx',
                path: '/src/App.tsx',
                type: 'file',
                size: 4567,
                lastModified: new Date().toISOString(),
                language: 'typescript'
              }
            ]
          },
          {
            id: '2',
            name: 'package.json',
            path: '/package.json',
            type: 'file',
            size: 1234,
            lastModified: new Date().toISOString(),
            language: 'json'
          },
          {
            id: '3',
            name: 'README.md',
            path: '/README.md',
            type: 'file',
            size: 5678,
            lastModified: new Date().toISOString(),
            language: 'markdown'
          },
          {
            id: '4',
            name: '.gitignore',
            path: '/.gitignore',
            type: 'file',
            size: 234,
            lastModified: new Date().toISOString(),
            language: 'text'
          }
        ]
      }
    },
    refetchInterval: false,
    refetchOnMount: false,
  })

  const { data: fileContent, isLoading: isLoadingContent } = useQuery<FileContent>({
    queryKey: ['file-content', selectedFile?.path],
    queryFn: async () => {
      if (!selectedFile || selectedFile.type !== 'file') {
        throw new Error('No file selected')
      }
      // Mock data for now
      return {
        path: selectedFile.path,
        content: `// This is a sample file content for ${selectedFile.name}\n\nimport React from 'react'\n\nconst Component = () => {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  )\n}\n\nexport default Component`,
        language: selectedFile.language || 'text',
        size: selectedFile.size || 0,
        lines: 13
      }
    },
    enabled: !!selectedFile && selectedFile.type === 'file',
  })

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'directory') {
      setCurrentPath(file.path)
      setSelectedFile(null)
    } else {
      setSelectedFile(file)
    }
  }

  const handleDownload = () => {
    if (selectedFile && selectedFile.type === 'file') {
      console.log('Downloading file:', selectedFile.name)
      // Implement download logic
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      {/* File Browser Sidebar */}
      <div className="w-80 border-r border-gray-800 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white mb-2">Files</h1>
          <FileSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search files..."
          />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoadingTree ? (
            <div className="p-4">
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 bg-gray-800 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <FileBrowser
              fileTree={fileTree}
              currentPath={currentPath}
              selectedFile={selectedFile}
              searchQuery={searchQuery}
              viewMode={viewMode}
              onFileSelect={handleFileSelect}
            />
          )}
        </div>
      </div>

      {/* File Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedFile ? (
          <>
            {/* File Header */}
            <div className="border-b border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <BreadcrumbNav
                    path={selectedFile.path}
                    onNavigate={(path) => {
                      setCurrentPath(path)
                      setSelectedFile(null)
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title="Download file"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    title="View raw"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>
              {selectedFile.type === 'file' && (
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                  <span>{selectedFile.language}</span>
                  <span>•</span>
                  <span>{(selectedFile.size || 0).toLocaleString()} bytes</span>
                  <span>•</span>
                  <span>{fileContent?.lines || 0} lines</span>
                </div>
              )}
            </div>

            {/* File Content */}
            <div className="flex-1 overflow-hidden">
              {isLoadingContent ? (
                <div className="p-8">
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-6 bg-gray-800 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : (
                <FileViewer
                  content={fileContent?.content || ''}
                  language={fileContent?.language || 'text'}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileCode className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">
                Select a file to view
              </h3>
              <p className="text-gray-400">
                Browse the file tree on the left to select a file
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Files
