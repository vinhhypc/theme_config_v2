import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import "highlight.js/styles/github.css";
import { Nav } from "@/components/nav";
import { Analytics } from "@vercel/analytics/react";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Theme Config";

export const metadata: Metadata = {
  title: appName,
  description:
    "Định nghĩa design system một lần, xuất bộ quy tắc markdown để mọi lần AI sinh code đều đồng bộ.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Set theme class before paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('designsync.appTheme');var d=t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <Nav />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
