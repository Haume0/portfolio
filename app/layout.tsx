import { Sora, Lato, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Contact from "@/components/Contact";
import SmoothScroll from "@/components/SmoothScroll";

const sora = Sora({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sora",
  preload: true,
  subsets: ["latin", "latin-ext"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ["100", "300", "400", "700", "900"],
});
const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favico.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="revisit-after" content="4 days" />
        <meta
          name="keywords"
          content="haume, emin, erçoban, eminercbn, emin erçoban, portfolio, web developer, software engineer, web design, frontend developer, backend developer, full stack developer, cubidron, react, nextjs, typescript, javascript, modern web technologies, creative design, eye-catching projects, self-taught developer"
        />
        <meta
          name="description"
          content="I make dreams come true. Full-Stack Web Developer Emin Erçoban (Haume) creates creative and eye-catching web projects with modern technologies. 4 years of self-taught development experience."
        />
        <meta name="language" content="English" />
        <meta name="author" content="Emin Erçoban" />
        <meta name="copyright" content="2024 Haume" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Haume ▴ Emin Erçoban - I Make Dreams Come True"
        />
        <meta property="og:url" content="haume.me" />
        <meta
          property="og:description"
          content="Full-Stack Web Developer creating creative and eye-catching projects with modern technologies. 4 years of self-taught development experience. I make dreams come true through code."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Haume Portfolio" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Haume ▴ Emin Erçoban - I Make Dreams Come True"
        />
        <meta
          name="twitter:description"
          content="Full-Stack Web Developer creating creative and eye-catching projects with modern technologies. 4 years of self-taught development experience."
        />
        <meta name="twitter:image" content="/og.webp" />

        {/* Additional SEO tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="application-name" content="Haume Portfolio" />
        <meta name="apple-mobile-web-app-title" content="Haume Portfolio" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
        />
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Emin Erçoban",
            "alternateName": "Haume",
            "jobTitle": "Full-Stack Web Developer",
            "description": "Self-taught Full-Stack Web Developer with 4 years of experience creating creative and eye-catching projects with modern technologies",
            "url": "https://haume.me",
            "sameAs": [
              "https://github.com/eminercbn",
              "https://linkedin.com/in/eminercbn"
            ],
            "knowsAbout": [
              "Web Development",
              "Frontend Development",
              "Backend Development",
              "React",
              "Next.js",
              "TypeScript",
              "JavaScript",
              "Web Design"
            ],
            "workLocation": {
              "@type": "Place",
              "name": "Remote"
            }
          }`}
        </script>

        {/* prefeching grain texture */}
        <link rel="preload" href="/grain.webp" as="image" />
        <link rel="preload" href="/haume.svg" as="image" />
        <link rel="preload" href="/glowing-star.svg" as="image" />
        <link rel="preload" href="/star.svg" as="image" />
        <link rel="preload" href="/main.webp" as="image" />
        <title>
          Haume ▴ Emin Erçoban - Full-Stack Web Developer | I Make Dreams Come
          True
        </title>
      </head>
      <body
        className={`${sora.variable} ${lato.variable} ${jbmono.variable} bg-body max-w-full min-w-screen overflow-x-clip text-milk font-sora antialiased`}
      >
        <div
          className="fixed left-0 top-0 z-999 w-screen h-screen pointer-events-none mix-blend-overlay"
          style={{
            background: `url("/grain.webp") repeat`,
          }}
        ></div>
        <SmoothScroll />
        {children}
        <Contact />
      </body>
    </html>
  );
}
