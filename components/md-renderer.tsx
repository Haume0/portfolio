"use client";
import React from "react";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown, { type ExtraProps } from "react-markdown";
import { markdownClasses } from "@/components/markdown-classes";
import { type CalloutIcon, notionRemarkPlugins } from "@/lib/notion-markdown";
interface MarkdownRendererProps {
  content: string;
}

const InsideCodeBlock = React.createContext(false);

// Icon component for checkboxes and toggles
const CheckIcon = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
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
    aria-hidden="true"
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

// Neden: Callout ikonu görsel olduğunda markdown görselleriyle aynı img çıktısını kullanıyor.
const MarkdownImage = ({
  src,
  alt,
  node: _,
  ...props
}: React.ComponentProps<"img"> & ExtraProps) => (
  <img
    src={src}
    alt={alt || ""}
    className={markdownClasses.image}
    loading="lazy"
    {...props}
  />
);

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className={markdownClasses.root}>
      <ReactMarkdown
        remarkPlugins={notionRemarkPlugins}
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
        // Neden: react-markdown her override'a hast node'unu geçiriyor; DOM'a node="[object Object]" olarak sızmasın diye her override onu ayırıyor.
        components={{
          // Headings
          h1: ({ children, node: _, ...props }) => (
            <h1 className={markdownClasses.heading[1]} {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, node: _, ...props }) => (
            <h2 className={markdownClasses.heading[2]} {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, node: _, ...props }) => (
            <h3 className={markdownClasses.heading[3]} {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, node: _, ...props }) => (
            <h4 className={markdownClasses.heading[4]} {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, node: _, ...props }) => (
            <h5 className={markdownClasses.heading[5]} {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, node: _, ...props }) => (
            <h6 className={markdownClasses.heading[6]} {...props}>
              {children}
            </h6>
          ),

          // Text formatting
          u: ({ children, node: _, ...props }) => (
            <u
              className="underline decoration-works/60 underline-offset-2"
              {...props}
            >
              {children}
            </u>
          ),
          mark: ({ children, node: _, ...props }) => (
            <mark className="bg-works/30 text-milk px-1 rounded" {...props}>
              {children}
            </mark>
          ),
          small: ({ children, node: _, ...props }) => (
            <small className="text-sm text-milk/70" {...props}>
              {children}
            </small>
          ),
          em: ({ children, node: _, ...props }) => (
            <em className={markdownClasses.italic} {...props}>
              {children}
            </em>
          ),
          strong: ({ children, node: _, ...props }) => (
            <strong className={markdownClasses.bold} {...props}>
              {children}
            </strong>
          ),
          del: ({ children, node: _, ...props }) => (
            <del className={markdownClasses.strike} {...props}>
              {children}
            </del>
          ),

          // Paragraphs
          p: ({ children, node: _, ...props }) => (
            <p className={markdownClasses.paragraph} {...props}>
              {children}
            </p>
          ),

          // Links
          a: ({ children, href, node: _, ...props }) => (
            <a
              href={href}
              target={href?.includes("//") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={markdownClasses.link}
              {...props}
            >
              {children}
            </a>
          ),

          // Inline code
          code: ({ className, children, node: _, ...props }) => {
            // Neden: Satır içi/blok ayrımı yapıdan gelir; dilsiz fenced kodun da sınıfı yok ama <pre> içinde.
            const isInline = !React.use(InsideCodeBlock);
            if (isInline) {
              return (
                <code className={markdownClasses.code} {...props}>
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
          pre: ({ children, node: _, ...props }) => (
            <pre className={markdownClasses.codeBlock} {...props}>
              <InsideCodeBlock value={true}>{children}</InsideCodeBlock>
            </pre>
          ),

          // Blockquotes
          blockquote: ({ children, node: _, ...props }) => (
            <blockquote className={markdownClasses.blockquote} {...props}>
              {children}
            </blockquote>
          ),

          // Unordered lists
          ul: ({ children, node: _, ...props }) => {
            const isTaskList = props.className?.includes("contains-task-list");

            return (
              <ul
                className={
                  isTaskList
                    ? "text-milk/80 leading-relaxed list-none space-y-2 [&_ul.contains-task-list]:pl-8 [&_ul.contains-task-list]:mt-2 mb-4"
                    : markdownClasses.bulletList
                }
                {...props}
              >
                {children}
              </ul>
            );
          },

          // Ordered lists
          ol: ({ children, node: _, ...props }) => (
            <ol className={markdownClasses.orderedList} {...props}>
              {children}
            </ol>
          ),

          // Toggle kararını lib/notion-markdown verir; li yalnızca data-toggle bayrağını okur.
          li: ({ children, node: _, "data-toggle": toggle, ...props }: any) => {
            const isTaskItem = props.className?.includes("task-list-item");

            // Neden: Task list görünümü (dış ul'un sınıflarını kaybetmesi, iç ul'a pl-8 eklenmemesi) karar verilene kadar bilerek olduğu gibi bırakıldı.
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
                <li {...props} className={markdownClasses.taskItem}>
                  <div className="flex items-start gap-3">
                    {checkbox}
                    {text}
                  </div>
                  {processedNested}
                </li>
              );
            }

            if (toggle) {
              const [summary, ...detailsContent] = React.Children.toArray(
                children,
              ).filter(
                (child) => !(typeof child === "string" && !child.trim()),
              );
              // Neden: Plugin özet paragrafını her zaman ilk çocukta <summary> element'i olarak verir; burada yalnızca içeriği alınır.
              const summaryContent = (
                summary as React.ReactElement<{ children?: React.ReactNode }>
              ).props.children;

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
              <li className={markdownClasses.listItem} {...props}>
                {children}
              </li>
            );
          },

          // Checkboxes
          input: ({ type, checked, node: _, ...props }) => {
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
          table: ({ children, node: _, ...props }) => (
            <div className="overflow-x-auto rounded-xl border border-body/40 bg-grey/20 my-4">
              <table className="w-full border-collapse" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, node: _, ...props }) => (
            <thead className="bg-dark/40" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, node: _, ...props }) => (
            <tbody className="divide-y divide-milk/10" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, node: _, ...props }) => (
            <tr
              className="hover:bg-dark/20 transition-colors duration-200"
              {...props}
            >
              {children}
            </tr>
          ),
          th: ({ children, node: _, ...props }) => (
            <th
              className="text-milk font-bold p-4 text-left border-r border-milk/10 last:border-r-0"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, node: _, ...props }) => (
            <td
              className="text-milk/80 p-4 leading-relaxed border-r border-milk/10 last:border-r-0"
              {...props}
            >
              {children}
            </td>
          ),

          // Images
          img: MarkdownImage,

          // Horizontal rule
          hr: ({ node: _, ...props }) => (
            <hr className={markdownClasses.horizontalRule} {...props} />
          ),
          // Callout'u lib/notion-markdown tanır; ikon buraya veri olarak gelir.
          aside: ({
            children,
            node: _,
            "data-callout-icon": iconJson,
            ...props
          }: any) => {
            const calloutIcon: CalloutIcon | null = iconJson
              ? JSON.parse(iconJson)
              : null;
            const icon =
              calloutIcon?.type === "image" ? (
                <MarkdownImage
                  src={calloutIcon.src}
                  alt={calloutIcon.alt}
                  width={calloutIcon.width}
                />
              ) : (
                calloutIcon?.value
              );

            return (
              <div className={markdownClasses.callout.container} {...props}>
                {icon && (
                  <div className={markdownClasses.callout.iconBackground}>
                    {icon}
                  </div>
                )}
                {icon && (
                  <div className={markdownClasses.callout.icon}>{icon}</div>
                )}
                <div className={markdownClasses.callout.content}>
                  {children}
                </div>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
