"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import React, { ReactNode } from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[
        rehypeRaw,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: {
              className: ["anchor-link"],
            },
          },
        ],
        rehypeHighlight,
      ]}
      components={{
        // Headings with site-matching typography
        h1: ({ children, ...props }) => (
          <h1
            className="text-6xl sm:text-7xl *:font-extrabold text-milk mb-6 mt-16 first:mt-0 font-lato leading-[90%]"
            {...props}
          >
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2
            className="text-4xl sm:text-5xl *:font-bold text-milk mb-4 mt-12 font-sora leading-[90%]"
            {...props}
          >
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3
            className="text-2xl sm:text-3xl *:font-bold text-milk mb-3 mt-8 font-sora leading-tight"
            {...props}
          >
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4
            className="text-xl sm:text-2xl *:font-semibold text-milk mb-2 mt-6 font-sora leading-tight"
            {...props}
          >
            {children}
          </h4>
        ),
        h5: ({ children, ...props }) => (
          <h5
            className="text-lg sm:text-xl *:font-medium text-milk mb-2 mt-5 font-sora leading-normal"
            {...props}
          >
            {children}
          </h5>
        ),
        h6: ({ children, ...props }) => (
          <h6
            className="text-base sm:text-lg *:font-normal text-milk/90 mb-2 mt-4 font-sora leading-normal"
            {...props}
          >
            {children}
          </h6>
        ),

        // Paragraphs with proper spacing
        p: ({ children, ...props }) => (
          <p
            className="text-milk/80 font-sora text-base sm:text-lg leading-relaxed mb-4 font-normal"
            {...props}
          >
            {children}
          </p>
        ),

        // Links with hover effect
        a: ({ children, href, ...props }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-works no-underline hover:text-about transition-colors duration-200"
            {...props}
          >
            {children}
          </a>
        ),

        // Inline code
        code: ({ className, children, ...props }: any) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="bg-about/24 text-works px-2 py-1 rounded-lg font-mono text-sm font-semibold"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },

        // Code blocks with syntax highlighting
        pre: ({ children, ...props }) => (
          <pre
            className="bg-dark border border-body/50 rounded-xl p-5 overflow-x-auto my-6 shadow-lg"
            {...props}
          >
            {children}
          </pre>
        ),

        // Blockquotes with left border
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="border-l-4 border-works bg-grey/40 text-milk/90 pl-6 pr-4 py-5 my-6 rounded-r-xl font-lato backdrop-blur-sm"
            {...props}
          >
            {children}
          </blockquote>
        ),

        // Unordered lists
        ul: ({ children, ...props }: any) => {
          const isTaskList = props.className?.includes("contains-task-list");
          return (
            <ul
              className={`text-milk/80 font-lato space-y-2.5 my-5 ${
                isTaskList
                  ? "list-none pl-0"
                  : "list-disc pl-7 marker:text-works marker:text-lg"
              }`}
              {...props}
            >
              {children}
            </ul>
          );
        },

        // Ordered lists
        ol: ({ children, ...props }) => (
          <ol
            className="text-milk/80 font-lato space-y-2.5 my-5 list-decimal pl-7 marker:text-works marker:font-bold"
            {...props}
          >
            {children}
          </ol>
        ),

        // List items
        li: ({ children, ...props }: any) => {
          const isTaskItem = props.className?.includes("task-list-item");
          if (isTaskItem) {
            return (
              <li
                className="flex items-start gap-2 text-milk/90 my-1"
                {...props}
              >
                {children}
              </li>
            );
          }
          return (
            <li className="text-milk/90 leading-relaxed" {...props}>
              {children}
            </li>
          );
        },

        // Checkboxes for task lists
        input: ({ type, checked, ...props }: any) => {
          if (type === "checkbox") {
            return (
              <input
                type="checkbox"
                checked={checked}
                disabled
                className="mt-1 w-4 h-4 rounded border-2 border-works accent-works cursor-not-allowed"
                {...props}
              />
            );
          }
          return <input type={type} {...props} />;
        },

        // Tables
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-8 rounded-2xl border border-body/40 bg-grey/20">
            <table className="w-full border-collapse" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-dark/60" {...props}>
            {children}
          </thead>
        ),
        tbody: ({ children, ...props }) => (
          <tbody className="divide-y divide-body/40" {...props}>
            {children}
          </tbody>
        ),
        tr: ({ children, ...props }) => (
          <tr
            className="hover:bg-grey/30 transition-colors duration-200"
            {...props}
          >
            {children}
          </tr>
        ),
        th: ({ children, ...props }) => (
          <th
            className="text-milk font-bold font-sora p-4 text-left border-r border-body/40 last:border-r-0"
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td
            className="text-milk/80 font-lato p-4 border-r border-body/40 last:border-r-0"
            {...props}
          >
            {children}
          </td>
        ),

        // Images with responsive styling
        img: ({ src, alt, ...props }) => (
          <img
            src={src}
            alt={alt || ""}
            className=""
            loading="lazy"
            {...props}
          />
        ),

        // Horizontal rule
        hr: ({ ...props }) => (
          <hr className="border-0 border-t-2 border-body/30 my-12" {...props} />
        ),

        // Strong/Bold
        strong: ({ children, ...props }) => (
          <strong className="text-milk font-extrabold font-sora" {...props}>
            {children}
          </strong>
        ),

        // Emphasis/Italic
        em: ({ children, ...props }) => (
          <em className="text-milk/90 italic font-normal" {...props}>
            {children}
          </em>
        ),

        // Delete/Strikethrough
        del: ({ children, ...props }) => (
          <del className="text-milk/60 line-through" {...props}>
            {children}
          </del>
        ),

        // Custom aside component with icon background
        aside: ({ children, ...props }: any) => {
          const childArray = Array.isArray(children) ? children : [children];
          let icon: ReactNode = null;
          let content: ReactNode[] = [...childArray];

          const iconIndex = content.findIndex((child) => {
            // Case 1: Child is an image element
            if (
              React.isValidElement(child) &&
              (child.type as any).name === "img"
            ) {
              return true;
            }

            // Case 2: Child is a string containing just an emoji
            if (typeof child === "string") {
              const trimmed = child.trim();
              if (trimmed === "") return false;
              const emojiRegex =
                /^(\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Extended_Pictographic}|\p{Emoji_Component}|\uFE0F|\u200D|\u2640|\u2642)+$/u;
              return emojiRegex.test(trimmed);
            }
            return false;
          });

          if (iconIndex !== -1) {
            icon = content[iconIndex];
            content.splice(iconIndex, 1);
          }

          const finalContent = content.filter(
            (c) => !(typeof c === "string" && c.trim() === ""),
          );

          return (
            <aside
              className="relative bg-dark border border-body/30 flex h-max gap-3 rounded-2xl p-6 my-6 overflow-hidden group items-start"
              {...props}
            >
              {icon && (
                <div className="shrink-0 select-none pointer-events-none flex items-center justify-center text-4xl mt-1">
                  {icon}
                </div>
              )}
              <div className="relative z-10 flex-1 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
                {finalContent}
              </div>
            </aside>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
