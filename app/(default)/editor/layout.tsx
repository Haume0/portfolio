export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.NODE_ENV === "production") {
    const { notFound } = require("next/navigation");
    notFound();
  }
  return <>{children}</>;
}
