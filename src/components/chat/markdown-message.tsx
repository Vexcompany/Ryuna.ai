"use client";

import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CodeBlock } from "@/components/chat/code-block";

const components: Components = {
  a: ({ node, children, ...props }) => {
    void node;
    return (
      <a {...props} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  },
  pre: ({ node, children, ...props }) => {
    void node;
    return <CodeBlock {...props}>{children}</CodeBlock>;
  },
};

function MarkdownMessageImpl({ content }: { content: string }) {
  return (
    <div className="ryuna-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const MarkdownMessage = memo(
  MarkdownMessageImpl,
  (prev, next) => prev.content === next.content,
);
