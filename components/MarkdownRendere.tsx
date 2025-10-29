"use client";
import React, { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";
interface MarkdownRendererProps {
  content: string;
}

// Icon component for checkboxes and toggles
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13 4L6 11L3 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowIcon = ({ open }: { open?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    style={{
      transform: open ? "rotate(90deg)" : "rotate(0deg)",
      transition: "transform 0.2s",
    }}
  >
    <path
      d="M9 6L15 12L9 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="space-y-5 max-w-4xl mx-auto p-6">
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
          // Headings
          h1: ({ children, ...props }) => (
            <h1
              className="text-3xl sm:text-4xl font-extrabold text-milk mb-6 mt-8 first:mt-0 leading-tight"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-2xl sm:text-3xl font-bold text-milk mb-4 mt-6 first:mt-0 leading-tight"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-xl sm:text-2xl font-bold text-milk mb-3 mt-5 first:mt-0 leading-snug"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-lg sm:text-xl font-semibold text-milk mb-2 mt-4 first:mt-0 leading-snug"
              {...props}
            >
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5
              className="text-base sm:text-lg font-medium text-milk mb-2 mt-3 first:mt-0 leading-normal"
              {...props}
            >
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6
              className="text-base sm:text-lg text-milk/90 mb-2 mt-3 first:mt-0 leading-normal"
              {...props}
            >
              {children}
            </h6>
          ),

          // Text formatting
          u: ({ children, ...props }) => (
            <u
              className="underline decoration-works/60 underline-offset-2"
              {...props}
            >
              {children}
            </u>
          ),
          mark: ({ children, ...props }) => (
            <mark className="bg-works/30 text-milk px-1 rounded" {...props}>
              {children}
            </mark>
          ),
          small: ({ children, ...props }) => (
            <small className="text-sm text-milk/70" {...props}>
              {children}
            </small>
          ),
          em: ({ children, ...props }: any) => (
            <em className="text-milk/90 italic" {...props}>
              {children}
            </em>
          ),
          strong: ({ children, ...props }: any) => (
            <strong className="text-milk font-bold" {...props}>
              {children}
            </strong>
          ),
          del: ({ children, ...props }: any) => (
            <del className="text-milk/60 line-through" {...props}>
              {children}
            </del>
          ),

          // Paragraphs
          p: ({ children, ...props }) => (
            <p
              className="text-milk/80 text-base sm:text-lg leading-relaxed mb-4"
              {...props}
            >
              {children}
            </p>
          ),

          // Links
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-works underline decoration-works/40 underline-offset-2 hover:decoration-works transition-colors"
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
                  className="bg-about/20 text-works px-2 py-0.5 rounded-md text-[0.9em] font-mono border border-about/30"
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

          // Code blocks
          pre: ({ children, ...props }) => (
            <pre
              className="rounded-xl bg-dark p-4 overflow-x-auto text-sm font-mono leading-relaxed mb-4"
              {...props}
            >
              {children}
            </pre>
          ),

          // Blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 bg-works/10 border-works text-milk/90 pl-6 py-3 my-4 rounded-r-xl backdrop-blur-sm"
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
                className={`text-milk/80 leading-relaxed ${
                  isTaskList
                    ? "list-none space-y-2 [&_ul.contains-task-list]:pl-8 [&_ul.contains-task-list]:mt-2"
                    : "list-disc pl-6 space-y-1 marker:text-works marker:text-lg"
                } mb-4`}
                {...props}
              >
                {children}
              </ul>
            );
          },

          // Ordered lists
          ol: ({ children, ...props }) => (
            <ol
              className="text-milk/80 leading-relaxed list-decimal pl-6 space-y-1 mb-4 marker:text-works marker:font-bold"
              {...props}
            >
              {children}
            </ol>
          ),

          // List items with toggle functionality
          li: ({ children, ...props }: any) => {
            const isTaskItem = props.className?.includes("task-list-item");

            if (isTaskItem) {
              // Separate checkbox+text from nested ul
              const childArray = React.Children.toArray(children);
              const checkbox = childArray[0];
              const text = childArray[1];
              const nestedContent = childArray.slice(2);

              // Add pl-8 to nested ul elements
              const processedNested = React.Children.map(
                nestedContent,
                (child) => {
                  if (
                    React.isValidElement(child) &&
                    (child.type as any) === "ul"
                  ) {
                    return React.cloneElement(
                      child as React.ReactElement<any>,
                      {
                        className: `${(child.props as any).className || ""} pl-8 mt-2`,
                      },
                    );
                  }
                  return child;
                },
              );

              return (
                <li
                  {...props}
                  className="text-milk/90 leading-relaxed py-1 [&>ul]:pl-4 [&>ul]:mt-1.5"
                >
                  <div className="flex items-start gap-3">
                    {checkbox}
                    {text}
                  </div>
                  {processedNested}
                </li>
              );
            }

            const realChildren = React.Children.toArray(children).filter(
              (child) => !(typeof child === "string" && !child.trim()),
            );

            // Check if has nested content (toggle behavior)
            const hasNestedContent = realChildren.some((child) => {
              if (React.isValidElement(child)) {
                const type = child.type as any;
                return (
                  type === "ul" ||
                  type === "ol" ||
                  type === "p" ||
                  type === "blockquote"
                );
              }
              return false;
            });

            if (hasNestedContent && realChildren.length > 1) {
              let summaryContent = realChildren[0];
              const detailsContent = realChildren.slice(1);

              // Extract text from paragraph wrapper
              if (
                React.isValidElement(summaryContent) &&
                (summaryContent.type as any) === "p"
              ) {
                summaryContent = (summaryContent.props as any).children;
              }

              return (
                <details className="group my-1" {...props}>
                  <summary className="flex items-start gap-2 cursor-pointer hover:bg-dark/20 -ml-2 pl-2 pr-2 py-1 rounded-lg transition-colors list-none">
                    <span className="text-works mt-0.5 shrink-0">
                      <ArrowIcon />
                    </span>
                    <span className="flex-1 text-milk/90 leading-relaxed select-none">
                      {summaryContent}
                    </span>
                  </summary>
                  <div className="pl-7 mt-2 space-y-2">{detailsContent}</div>
                </details>
              );
            }

            return (
              <li className="text-milk/90 leading-relaxed py-1" {...props}>
                {children}
              </li>
            );
          },

          // Checkboxes
          input: ({ type, checked, ...props }: any) => {
            if (type === "checkbox") {
              return (
                <div
                  className={`size-5 shrink-0 mt-0.5 inline-flex items-center justify-center rounded border-2 transition-colors ${
                    checked
                      ? "bg-works border-works text-white"
                      : "bg-transparent border-milk/30"
                  }`}
                >
                  {checked && <CheckIcon />}
                </div>
              );
            }
            return <input type={type} {...props} />;
          },

          // Tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto rounded-xl border border-body/40 bg-grey/20 my-4">
              <table className="w-full border-collapse" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-dark/40" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-milk/10" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr
              className="hover:bg-dark/20 transition-colors duration-200"
              {...props}
            >
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th
              className="text-milk font-bold p-4 text-left border-r border-milk/10 last:border-r-0"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="text-milk/80 p-4 leading-relaxed border-r border-milk/10 last:border-r-0"
              {...props}
            >
              {children}
            </td>
          ),

          // Images
          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt || ""}
              className="rounded-xl max-w-full h-auto my-4"
              loading="lazy"
              {...props}
            />
          ),

          // Horizontal rule
          hr: ({ ...props }) => (
            <hr
              className="border-0 border-t-2 border-milk/10 my-8"
              {...props}
            />
          ),
          aside: ({ children, ...props }: any) => {
            const childArray = Array.isArray(children) ? children : [children];
            let icon: ReactNode = null;
            let content: ReactNode[] = [...childArray];

            const iconIndex = content.findIndex((child) => {
              if (
                React.isValidElement(child) &&
                (child.type as any).name === "img"
              ) {
                return true;
              }

              if (typeof child === "string") {
                const trimmed = child.trim();
                if (trimmed === "") return false;
                const emojiRegex =
                  /^(\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Extended_Pictographic}|\p{Emoji_Component}|\uFE0F|\u200D)+$/u;
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
                className="relative overflow-hidden bg-dark flex gap-3 rounded-2xl p-6 contain-content items-start"
                {...props}
              >
                {icon && (
                  <div className="absolute pointer-events-none inset-0 text-[20rem] *:size-full opacity-20 scale-900 blur-xl flex items-center justify-center">
                    {icon}
                  </div>
                )}
                {icon && (
                  <div className="shrink-0 relative text-3xl leading-none">
                    {icon}
                  </div>
                )}
                <div className="relative flex-1 *:first:mt-0 *:last:mb-0 [&>p]:leading-relaxed">
                  {finalContent}
                </div>
              </aside>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
