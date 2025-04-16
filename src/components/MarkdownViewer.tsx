
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const MarkdownViewer = ({ content, className }: MarkdownViewerProps) => {
  return (
    <div className={`markdown-viewer ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Custom styling for other markdown elements
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-medium mb-2" {...props} />,
          p: ({node, ...props}) => <p className="mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          table: ({node, ...props}) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-border" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => <thead className="bg-muted/50" {...props} />,
          th: ({node, ...props}) => (
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider" {...props} />
          ),
          td: ({node, ...props}) => <td className="px-3 py-2 whitespace-nowrap" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-primary pl-4 italic mb-4" {...props} />
          ),
          hr: ({node, ...props}) => <hr className="my-6 border-t border-border" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
