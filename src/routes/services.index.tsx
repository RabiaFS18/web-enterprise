import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { Reveal } from "../components/site/Reveal";
import { Icon } from "../components/site/icons";
import { services } from "../lib/site-data";

const TITLE = "Services — R.K. Enterprises";
const DESC =
  "Construction, safety & security, event management, general order supply, manpower, janitorial services, rent a car and printing services by R.K. Enterprises, Karachi.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
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
              What we do
            </p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-tight md:text-6xl">
              Services we <span className="text-gradient-brand">operate</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              From site construction to security consultancy and event execution — managed by our
              own supervised teams. Open any service to see what it covers.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 70}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group flex h-full flex-col rounded-2xl glass-card p-7 transition-transform hover:-translate-y-1"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <h2 className="mt-6 font-display text-xl font-bold">{s.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    View details
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
