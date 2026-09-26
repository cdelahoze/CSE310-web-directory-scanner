import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "TakTaim Web Explorer",
  description: "Web file viewer with TypeScript and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}