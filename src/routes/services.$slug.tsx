import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { Reveal } from "../components/site/Reveal";
import { Icon } from "../components/site/icons";
import { getService, services } from "../lib/site-data";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service not found — R.K. Enterprises" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.service.title} — R.K. Enterprises`;
    const desc = loaderData.service.intro;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServiceDetail,
});

function ServiceNotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen items-center justify-center px-5 pt-28">
        <div className="rounded-2xl glass-card p-10 text-center">
          <h1 className="font-display text-3xl font-bold">Service not found</h1>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            All services
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main className="relative min-h-screen px-5 pb-24 pt-28">
        <div className="mx-auto w-full max-w-[1220px]">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            All services
          </Link>

          <Reveal>
            <span className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
              <Icon name={service.icon} className="h-6 w-6" />
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-tight md:text-6xl">
              {service.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {service.intro}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <section className="h-full rounded-2xl glass-card p-8">
                <h2 className="font-display text-2xl font-bold">What this service includes</h2>
                <ul className="mt-6 space-y-4">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm leading-relaxed text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal delay={90}>
              <aside className="flex h-full flex-col justify-between rounded-2xl glass-card p-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                    Get a quote
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-bold">
                    Need this for your organisation?
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Share your requirement and our team will prepare a scope and rate schedule for
                    you.
                  </p>
                </div>
                <Link
                  to="/"
                  hash="contact"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Send an enquiry
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </aside>
            </Reveal>
          </div>

          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold">Other services</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {others.map((s, i) => (
                <Reveal key={s.slug} delay={i * 70}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group flex h-full flex-col rounded-2xl glass-card p-6 transition-transform hover:-translate-y-1"
                  >
                    <Icon name={s.icon} className="h-5 w-5 text-primary" />
                    <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
