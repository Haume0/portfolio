// Neden: TypeScript 7 @types paketlerini artık otomatik yüklemiyor; bun:test tipleri yalnızca bu dosyada gerekli.
/// <reference types="bun" />
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { describe, expect, test } from "bun:test";
import matter from "gray-matter";
import { renderToStaticMarkup } from "react-dom/server";
import MarkdownRenderer from "./md-renderer";

// Neden: Çalışma dizininde takip edilmeyen deneme klasörleri olabiliyor; snapshot yalnızca git'teki içeriği kilitlemeli.
const contentFiles = execFileSync(
  "git",
  ["ls-files", "public/blogs/*/index.md", "public/works/*/index.md"],
  { encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean);

describe("MarkdownRenderer", () => {
  test.each(contentFiles)("%s", (file) => {
    // Neden: Site gövdeyi lib/blogs.ts ve lib/projects.ts'teki gibi gray-matter ile frontmatter'dan ayırıp render ediyor.
    const { content } = matter(fs.readFileSync(file, "utf8"));
    const html = renderToStaticMarkup(<MarkdownRenderer content={content} />);
    expect(html).toMatchSnapshot();
    // Neden: react-markdown'ın hast node'u override'lardan DOM'a sızmamalı.
    expect(html).not.toContain('node="[object Object]"');
  });

  test("hi yazısı callout ve toggle üretir", () => {
    const { content } = matter(
      fs.readFileSync("public/blogs/hi/index.md", "utf8"),
    );
    const html = renderToStaticMarkup(<MarkdownRenderer content={content} />);
    expect(html).toContain('<div class="relative overflow-hidden bg-dark');
    expect(html).toContain("<details");
  });

  test("dilsiz fenced kod blok olarak render edilir", () => {
    const html = renderToStaticMarkup(
      <MarkdownRenderer content={"```\nconst a = 1\n```\n\nsatır içi `kod`"} />,
    );
    expect(html).toContain("<pre");
    expect(html).toMatch(/<pre[^>]*><code>const a = 1\n<\/code><\/pre>/);
    expect(html).toContain('<code class="bg-about/20');
  });
});
