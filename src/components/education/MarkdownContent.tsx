'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

type ComponentProps<T = React.ReactNode> = {
  children?: T;
  className?: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }: ComponentProps) => <h1 className="text-2xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
          h2: ({ children }: ComponentProps) => <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>,
          h3: ({ children }: ComponentProps) => <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h3>,
          p: ({ children }: ComponentProps) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
          ul: ({ children }: ComponentProps) => <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground">{children}</ul>,
          ol: ({ children }: ComponentProps) => <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground">{children}</ol>,
          li: ({ children }: ComponentProps) => <li className="ml-4">{children}</li>,
          code: ({ className, children }: ComponentProps) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            return isInline ? (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{children}</code>
            ) : (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                <code className={className}>{children}</code>
              </pre>
            );
          },
          pre: ({ children }: ComponentProps) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
          blockquote: ({ children }: ComponentProps) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">{children}</blockquote>
          ),
          table: ({ children }: ComponentProps) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-border">{children}</table>
            </div>
          ),
          th: ({ children }: ComponentProps) => <th className="px-4 py-2 text-left font-semibold bg-muted">{children}</th>,
          td: ({ children }: ComponentProps) => <td className="px-4 py-2 border-t border-border">{children}</td>,
          strong: ({ children }: ComponentProps) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }: ComponentProps) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}