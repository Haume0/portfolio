import { Sora, Lato } from "next/font/google";
import "./globals.css";
import Contact from "@/components/Contact";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});
const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ["100", "300", "400", "700", "900"],
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
          content="haume, emin, erçoban, eminercbn, emin erçoban, portfolio, web developer, software engineer, web design, frontend developer, backend developer, full stack developer, cubidron"
        />
        <meta
          name="description"
          content="Welcome to Haume (Emin Erçoban)'s portfolio. Discover my projects and skills in web development and web design."
        />
        <meta name="language" content="English" />
        <meta name="author" content="Emin Erçoban" />
        <meta name="copyright" content="2024 Haume" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Haume Web Developer" />
        <meta property="og:url" content="haume.me" />
        <meta
          property="og:description"
          content="Welcome to my personal website. Explore my web development and design projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og.webp" />
        {/* prefeching grain texture */}
        <link rel="preload" href="/grain.webp" as="image" />
        <link rel="preload" href="/haume.svg" as="image" />
        <link rel="preload" href="/glowing-star.svg" as="image" />
        <link rel="preload" href="/star.svg" as="image" />
        <link rel="preload" href="/main.webp" as="image" />
        <title>Haume ▴ Emin Erçoban</title>
      </head>
      <body className={`${sora.variable} ${lato.variable} antialiased`}>
        <div
          className="fixed left-0 top-0 z-999 w-screen h-screen pointer-events-none mix-blend-overlay"
          style={{
            background: `url("/grain.webp") repeat`,
          }}></div>
        {children}
        <Contact />
      </body>
    </html>
  );
}
