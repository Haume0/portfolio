"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import React, { ReactNode } from "react";
import { Icon } from "@iconify/react";

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
        // Headings - Notion benzeri
        h1: ({ children, ...props }) => (
          <h1
            className="text-[2.5rem] font-bold text-white mb-2 mt-8 first:mt-0 leading-[1.2]"
            {...props}
          >
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2
            className="text-[1.875rem] font-semibold text-white mb-1 mt-6 leading-[1.3]"
            {...props}
          >
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3
            className="text-[1.5rem] font-semibold text-white mb-1 mt-4 leading-[1.3]"
            {...props}
          >
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4
            className="text-[1.25rem] font-semibold text-white mb-1 mt-3 leading-[1.4]"
            {...props}
          >
            {children}
          </h4>
        ),
        h5: ({ children, ...props }) => (
          <h5
            className="text-[1.125rem] font-medium text-white mb-1 mt-2 leading-[1.4]"
            {...props}
          >
            {children}
          </h5>
        ),
        h6: ({ children, ...props }) => (
          <h6
            className="text-base font-medium text-white/90 mb-1 mt-2 leading-[1.5]"
            {...props}
          >
            {children}
          </h6>
        ),

        // Paragraflar - Notion stilleri
        p: ({ children, ...props }) => (
          <p
            className="text-white/80 text-base leading-[1.65] mb-1 mt-0"
            {...props}
          >
            {children}
          </p>
        ),

        // Linkler - underline ile
        a: ({ children, href, ...props }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline decoration-white/40 underline-offset-2 hover:decoration-white/80 transition-colors"
            {...props}
          >
            {children}
          </a>
        ),

        // Inline code - Notion benzeri
        code: ({ className, children, ...props }: any) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="bg-white/10 text-[#eb5757] px-1.5 py-0.5 rounded text-[0.85em] font-mono tracking-wider leading-relaxed"
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

        // Code blocks - syntax highlight ile
        pre: ({ children, ...props }) => (
          <pre
            className="bg-[#2f3437] *:leading-snug *:-tracking-tight font-mono rounded-md overflow-x-auto my-4 text-sm"
            {...props}
          >
            {children}
          </pre>
        ),

        // Blockquotes - Notion'daki gibi sol border
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="border-l-[3px] border-white/30 pl-4 my-2 text-white/80"
            {...props}
          >
            {children}
          </blockquote>
        ),

        // Unordered lists - Notion'daki gibi bullet
        ul: ({ children, ...props }: any) => {
          const isTaskList = props.className?.includes("contains-task-list");
          return (
            <ul
              className={`text-white/80 my-1 ${
                isTaskList
                  ? "list-none pl-0"
                  : "list-disc pl-7 marker:text-white/50"
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
            className="text-white/80 my-1 list-decimal pl-7 marker:text-white/50"
            {...props}
          >
            {children}
          </ol>
        ),

        // List items - Notion toggle özelliği
        li: ({ children, ...props }: any) => {
          const isTaskItem = props.className?.includes("task-list-item");

          if (isTaskItem) {
            return (
              <li className="flex items-start gap-2" {...props}>
                {children}
              </li>
            );
          }

          const realChildren = React.Children.toArray(children).filter(
            (child) => !(typeof child === "string" && !child.trim()),
          );

          // Nested content varsa toggle yap
          if (realChildren.length > 1) {
            let summaryContent = realChildren[0];
            const detailsContent = realChildren.slice(1);

            if (
              React.isValidElement(summaryContent) &&
              (summaryContent.type as any) === "p"
            ) {
              summaryContent = summaryContent.props.children;
            }

            return (
              <details className="list-none -ml-7 group my-0.5" {...props}>
                <summary className="flex items-start gap-1 cursor-pointer hover:bg-white/5 px-1 py-0.5 rounded transition-colors [&>*]:m-0">
                  <Icon
                    icon="material-symbols:play-arrow"
                    className="text-lg mt-[0.15rem] group-open:rotate-90 transition-transform duration-150 text-white/40 shrink-0"
                  />
                  <span className="flex-1 select-none">{summaryContent}</span>
                </summary>
                <div className="pl-6 mt-0.5">{detailsContent}</div>
              </details>
            );
          }

          return (
            <li className="my-0.5" {...props}>
              {children}
            </li>
          );
        },

        // Checkboxes - Notion toggle list gibi
        input: ({ type, checked, ...props }: any) => {
          if (type === "checkbox") {
            return (
              <input
                type="checkbox"
                checked={checked}
                disabled
                className="mt-[0.3rem] w-4 h-4 rounded border-2 border-white/30 checked:bg-blue-500 checked:border-blue-500 cursor-not-allowed shrink-0"
                {...props}
              />
            );
          }
          return <input type={type} {...props} />;
        },

        // Tables - Notion benzeri basit stil
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-4 border border-white/10 rounded">
            <table className="w-full border-collapse text-left" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-white/5" {...props}>
            {children}
          </thead>
        ),
        tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
        tr: ({ children, ...props }) => (
          <tr className="border-b border-white/10" {...props}>
            {children}
          </tr>
        ),
        th: ({ children, ...props }) => (
          <th
            className="px-3 py-2 text-sm font-semibold text-white/90 border-r border-white/10 last:border-r-0"
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td
            className="px-3 py-2 text-sm text-white/70 border-r border-white/10 last:border-r-0"
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
            className="rounded max-w-full h-auto my-2"
            loading="lazy"
            {...props}
          />
        ),

        // Horizontal rule
        hr: ({ ...props }) => (
          <hr className="border-0 border-t border-white/10 my-6" {...props} />
        ),

        // Strong - Notion'da sadece bold
        strong: ({ children, ...props }) => (
          <strong className="font-semibold text-white" {...props}>
            {children}
          </strong>
        ),

        // Emphasis
        em: ({ children, ...props }) => (
          <em className="italic" {...props}>
            {children}
          </em>
        ),

        // Strikethrough
        del: ({ children, ...props }) => (
          <del className="line-through opacity-60" {...props}>
            {children}
          </del>
        ),

        // Callout - Notion callout blokları gibi
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
              className="bg-white/5 flex gap-2.5 rounded px-4 py-3 my-2 items-start"
              {...props}
            >
              {icon && (
                <div className="shrink-0 text-xl leading-none">{icon}</div>
              )}
              <div className="flex-1 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&>p]:mb-1">
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
