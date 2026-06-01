import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete";
import { UpdateMonitor } from "@/components/ui/UpdateMonitor";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScoutVision — Football Player Scouting Platform",
  description:
    "Search, compare, and scout football players across 2,300+ leagues with 60+ statistics powered by Sportmonks API v3.",
};

const navLinks = [
  { href: "/players", label: "Players" },
  { href: "/compare", label: "Compare" },
  { href: "/shortlists", label: "Shortlists" },
  { href: "/scout-builder", label: "Scout Builder" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <header
          className="sticky top-0 z-50 border-b"
          style={{
            height: "64px",
            background: "#FFFFFF",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="mx-auto flex h-full max-w-screen-2xl items-center gap-6 px-6">
            <Link
              href="/"
              className="text-xl font-bold flex-shrink-0"
              style={{ color: "#111827" }}
            >
              ScoutVision
            </Link>

            <div className="hidden md:flex flex-1 max-w-[40%]">
              <SearchAutocomplete className="w-full" />
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-black/5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 ml-2">
              <UpdateMonitor />
              <button
                className="rounded-full h-8 w-8 flex items-center justify-center transition-colors hover:bg-black/5"
                aria-label="User profile"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
            </div>

            <div className="ml-auto md:hidden">
              <MobileNav />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-screen-2xl min-h-screen bg-[var(--color-bg)]">
          {children}
        </main>

        <footer
          className="border-t py-8"
          style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
        >
          <div className="mx-auto max-w-screen-2xl px-6 text-center">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              ScoutVision · Powered by Sportmonks API v3 · 2,300+ leagues · 60+ statistics
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

function MobileNav() {
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none rounded-lg p-2 hover:bg-black/5">
        <svg
          width="24" height="24" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </summary>
      <div
        className="absolute right-0 top-full mt-2 w-48 rounded-xl border p-3 shadow-xl z-50"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5"
            style={{ color: "var(--color-text)" }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
