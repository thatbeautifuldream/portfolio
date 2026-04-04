import { ReactNode } from "react";
import Link from "next/link";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background flex flex-col isolate">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/blog"
            className="text-sm font-medium text-foreground hover:text-foreground/80"
          >
            Blog
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6">
        {children}
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-center text-sm text-muted-foreground">
            Built by{" "}
            <Link
              href="https://milind.app"
              className="font-medium text-foreground hover:text-foreground/80"
            >
              Milind Mishra
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
