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
        // Headings - Haume tasarımı ile uyumlu
        h1: ({ children, ...props }) => (
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-milk mb-4 mt-12 first:mt-0  leading-tight"
            {...props}
          >
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2
            className="text-2xl sm:text-3xl font-bold text-milk mb-3 mt-10  leading-tight"
            {...props}
          >
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3
            className="text-xl sm:text-2xl font-bold text-milk mb-3 mt-8  leading-snug"
            {...props}
          >
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4
            className="text-lg sm:text-xl font-semibold text-milk mb-2 mt-6  leading-snug"
            {...props}
          >
            {children}
          </h4>
        ),
        h5: ({ children, ...props }) => (
          <h5
            className="text-base sm:text-lg font-medium text-milk mb-2 mt-5  leading-normal"
            {...props}
          >
            {children}
          </h5>
        ),
        h6: ({ children, ...props }) => (
          <h6
            className="text-base sm:text-lg text-milk/90 mb-2 mt-4  leading-normal"
            {...props}
          >
            {children}
          </h6>
        ),

        // Text formatting tags
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

        // Paragraflar - Daha geniş satır aralığı
        p: ({ children, ...props }) => (
          <p
            className="text-milk/80  text-base sm:text-lg leading-relaxed mb-5"
            {...props}
          >
            {children}
          </p>
        ),

        // Linkler - Works renginde
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

        // Inline code - Works/About renkleri
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

        // Code blocks - Dark arka plan
        pre: ({ children, ...props }) => (
          <pre
            className="rounded-xl bg-dark overflow-x-auto my-6 text-sm font-mono *:leading-relaxed *:tracking-wider"
            {...props}
          >
            {children}
          </pre>
        ),

        // Blockquotes - Works border ile
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="border-l-4 border-works bg-grey/30 text-milk/90 pl-6 pr-4 rounded-r-xl  backdrop-blur-sm"
            {...props}
          >
            {children}
          </blockquote>
        ),

        // Unordered lists - Works marker
        ul: ({ children, ...props }: any) => {
          const isTaskList = props.className?.includes("contains-task-list");
          return (
            <ul
              className={`text-milk/80  leading-relaxed my-4 ${
                isTaskList
                  ? "list-none pl-0 space-y-2"
                  : "list-disc pl-7 space-y-2 marker:text-works marker:text-lg"
              }`}
              {...props}
            >
              {children}
            </ul>
          );
        },

        em: ({ children, ...props }: any) => (
          <em className="text-milk/80 italic  leading-relaxed my-4" {...props}>
            {children}
          </em>
        ),

        // Ordered lists
        ol: ({ children, ...props }) => (
          <ol
            className="text-milk/80  leading-relaxed my-4 list-decimal pl-7 space-y-2 marker:text-works marker:font-bold"
            {...props}
          >
            {children}
          </ol>
        ),

        // List items - Toggle özelliği
        li: ({ children, ...props }: any) => {
          const isTaskItem = props.className?.includes("task-list-item");

          if (isTaskItem) {
            return (
              <li
                className="flex items-start gap-2 text-milk/90 leading-relaxed"
                {...props}
              >
                {children}
              </li>
            );
          }

          const realChildren = React.Children.toArray(children).filter(
            (child) => !(typeof child === "string" && !child.trim()),
          );

          // Nested content varsa toggle
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
              <details
                className="list-none hover:bg-dark/20 -ml-7 group my-1"
                {...props}
              >
                <summary className="flex items-center gap-2 cursor-pointer hover:bg-dark/40 px-2 py-1 rounded-lg transition-colors [&>*]:m-0">
                  <Icon
                    icon="material-symbols-light:play-arrow"
                    className="text-2xl text-works group-open:rotate-90 transition-transform duration-200 shrink-0"
                  />
                  <span className="flex-1 *:mb-0 select-none text-milk/90 leading-relaxed">
                    {summaryContent}
                  </span>
                </summary>
                <div className="pl-9 mt-2">{detailsContent}</div>
              </details>
            );
          }

          return (
            <li className="text-milk/90 leading-relaxed" {...props}>
              {children}
            </li>
          );
        },

        // Checkboxes - Works rengi
        input: ({ type, checked, ...props }: any) => {
          if (type === "checkbox") {
            return (
              <input
                type="checkbox"
                checked={checked}
                disabled
                className="mt-1 w-4 h-4 rounded border-2 border-works accent-works cursor-not-allowed shrink-0"
                {...props}
              />
            );
          }
          return <input type={type} {...props} />;
        },

        // Tables - Site tasarımı ile uyumlu
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-8 rounded-2xl border border-body/40 bg-grey/20">
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
          <tr className="bg-dark/20 transition-colors duration-200" {...props}>
            {children}
          </tr>
        ),
        th: ({ children, ...props }) => (
          <th
            className="text-milk font-bold  p-4 text-left border-r border-milk/10 last:border-r-0"
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td
            className="text-milk/80  p-4 leading-relaxed border-r border-milk/10 last:border-r-0"
            {...props}
          >
            {children}
          </td>
        ),

        // Images - Rounded corner
        img: ({ src, alt, ...props }) => (
          <img
            src={src}
            alt={alt || ""}
            className="rounded-xl max-w-full h-auto my-6 "
            loading="lazy"
            {...props}
          />
        ),

        // Horizontal rule
        hr: ({ ...props }) => (
          <hr className="border-0 border-milk/10 border-t-2 my-12" {...props} />
        ),

        // Callout - Site tasarımı ile
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
              className="relative bg-dark border border-body/30 flex gap-3 rounded-2xl p-6 my-6 overflow-hidden items-start backdrop-blur-sm"
              {...props}
            >
              {icon && (
                <div className="shrink-0 text-3xl leading-none">{icon}</div>
              )}
              <div className="flex-1 [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&>p]:leading-relaxed">
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
