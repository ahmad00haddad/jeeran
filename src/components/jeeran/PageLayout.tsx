import { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";

export function PageLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <TopBar />
      <Header />
      <main className="flex-1">
        <section className="bg-deep text-cream grain-strong py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="font-display text-3xl md:text-5xl font-bold">{title}</h1>
            {subtitle && <p className="mt-3 text-cream/80 text-sm md:text-base">{subtitle}</p>}
          </div>
        </section>
        <article className="max-w-3xl mx-auto px-4 py-10 md:py-14 space-y-6 leading-loose text-foreground/90">
          {children}
        </article>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl font-bold text-primary">{title}</h2>
      <div className="space-y-3 text-sm md:text-base">{children}</div>
    </section>
  );
}
