import React from 'react'

interface FileViewerProps {
  content: string
  language: string
}

export const FileViewer: React.FC<FileViewerProps> = ({ content, language }) => {
  return (
    <div className="h-full bg-gray-900 p-4 overflow-auto">
      <pre className="text-sm text-gray-300 font-mono">
        <code>{content}</code>
      </pre>
    </div>
  )
}
