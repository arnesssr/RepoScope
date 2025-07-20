import React from 'react'
import { Folder, FileCode } from 'lucide-react'

interface FileBrowserProps {
  fileTree: any
  currentPath: string
  selectedFile: any
  searchQuery: string
  viewMode: 'tree' | 'flat'
  onFileSelect: (file: any) => void
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
  fileTree,
  currentPath,
  selectedFile,
  searchQuery,
  viewMode,
  onFileSelect
}) => {
  const renderFileTree = (node: any, level: number = 0) => {
    if (!node) return null

    const isSelected = selectedFile?.id === node.id
    const Icon = node.type === 'directory' ? Folder : FileCode
    const iconColor = node.type === 'directory' ? 'text-blue-400' : 'text-gray-400'

    return (
      <div key={node.id}>
        <div
          className={`
            flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded
            ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-gray-800 text-gray-300'}
          `}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => onFileSelect(node)}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'directory' && node.children && (
          <div>
            {node.children.map((child: any) => renderFileTree(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-2">
      {fileTree && renderFileTree(fileTree)}
    </div>
  )
}
