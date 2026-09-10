import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { Reveal } from "../components/site/Reveal";
import { Icon } from "../components/site/icons";
import { productCategories, products } from "../lib/site-data";

const TITLE = "Products & Equipment — R.K. Enterprises";
const DESC =
  "Safety gear, fire fighting equipment, CCTV, detection systems, office furniture, stationery, janitorial supplies, electrical hardware and uniforms supplied by R.K. Enterprises.";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [active, setActive] = useState("All");
  const list = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <SiteHeader />

      <main className="relative min-h-screen px-5 pb-24 pt-28">
        <div className="mx-auto w-full max-w-[1220px]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back to home
          </Link>

          <Reveal>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
              Full catalogue
            </p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-tight md:text-6xl">
              Products &amp; <span className="text-gradient-brand">equipment</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Everything we procure and deliver against your service contract. Brands and detailed
              specifications are supplied on request.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-wrap gap-2">
            {productCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                  active === c
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface text-foreground hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p, i) => (
              <Reveal key={p.title} delay={(i % 4) * 70}>
                <article className="h-full rounded-2xl glass-card p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {p.category}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold">{p.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
