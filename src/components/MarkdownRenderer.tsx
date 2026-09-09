'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ReactMarkdownProps {
  markdown: string
}

/**
 * Simple markdown renderer for lecture notes.
 * Supports: headers, bold, italic, links, code blocks, lists
 */
export function MarkdownRenderer({ markdown }: ReactMarkdownProps) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    // Simple markdown to HTML conversion
    let html = markdown
      // Code blocks (``` ... ```)
      .replace(/```([\s\S]*?)```/g, '<pre className="bg-gray-100 p-4 rounded overflow-x-auto"><code>$1</code></pre>')
      // Headers
      .replace(/^### (.*?)$/gm, '<h3 className="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 className="text-xl font-bold mt-6 mb-2">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 className="text-2xl font-bold mt-8 mb-2">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong className="font-bold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em className="italic">$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p className="mb-3">')
      .replace(/\n/g, '<br/>')

    html = `<p className="mb-3">${html}</p>`
    setHtml(html)
  }, [markdown])

  return (
    <div
      className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
