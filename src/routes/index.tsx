import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { SceneBackground } from "../components/site/SceneBackground";
import { Preloader } from "../components/site/Preloader";
import { Reveal } from "../components/site/Reveal";
import { Icon } from "../components/site/icons";
import { highlights, products, services } from "../lib/site-data";
import logo from "../assets/rk-logo.png";

const TITLE = "R.K. Enterprises — General Order Supplier & Event Management, Karachi";
const DESC =
  "R.K. Enterprises delivers general order supply, safety & security systems, manpower, janitorial services and full-scale event management from Karachi, Pakistan.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Home,
});

const heroWords = [
  { text: "We", brand: true },
  { text: "supply,", brand: true },
  { text: "secure", brand: true },
  { text: "and", brand: false },
  { text: "build", brand: false },
  { text: "for", brand: false },
  { text: "business.", brand: false },
];

const stats = [
  { value: "2011", label: "Serving since" },
  { value: "13+", label: "Service verticals" },
  { value: "24/7", label: "Support desk" },
  { value: "100%", label: "Client focus" },
];

function Home() {
  return (
    <>
      <Preloader />
      <SceneBackground />
      <SiteHeader />

      <main id="top" className="relative">
        <Hero />
        <ProductsPreview />
        <Services />
        <About />
        <Contact />
      </main>

      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="flex min-h-screen items-center px-5 pt-28">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl rounded-2xl glass-card p-8 md:p-11">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-foreground">
              Karachi, Pakistan · Born to Serve
            </span>
          </Reveal>

          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.03] md:text-7xl">
            {heroWords.map((w, i) => (
              <span key={w.text} className="inline-block overflow-hidden align-bottom">
                <span
                  className={`inline-block ${w.brand ? "text-gradient-brand" : ""}`}
                  style={{
                    animation: `logo-fade 0.75s cubic-bezier(0.22,1,0.36,1) ${i * 70}ms both`,
                  }}
                >
                  {w.text}
                </span>
                &nbsp;
              </span>
            ))}
          </h1>

          <Reveal delay={120}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              R.K. Enterprises delivers general order supply, safety &amp; security systems,
              manpower, janitorial services and full-scale event management — one accountable vendor
              for the whole requirement.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                View products
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Request a quotation
              </a>
            </div>
          </Reveal>

          <div className="mt-9 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={80 * i}>
                <div>
                  <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground whitespace-nowrap">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  highlight,
  copy,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  copy: string;
}) {
  return (
    <Reveal>
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
        {title} <span className="text-gradient-brand">{highlight}</span>
      </h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{copy}</p>
    </Reveal>
  );
}

function ProductsPreview() {
  return (
    <section id="products" className="px-5 py-24">
      <div className="mx-auto w-full max-w-[1220px]">
        <SectionHead
          eyebrow="What we supply"
          title="Products &"
          highlight="equipment"
          copy="A glimpse of what we procure and deliver — the full catalogue with every category lives on our products page."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <article className="h-full rounded-2xl glass-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {p.category}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
          >
            View all products
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="px-5 py-24">
      <div className="mx-auto w-full max-w-[1220px]">
        <SectionHead
          eyebrow="What we do"
          title="Services we"
          highlight="operate"
          copy="From site construction to security consultancy and event execution — managed by our own supervised teams."
        />

        <div className="mt-10 overflow-hidden rounded-2xl glass-card">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Link
                key={s.title}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group block border-b border-border/70 p-7 transition-colors last:border-b-0 hover:bg-secondary/50 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:odd:border-r lg:[&:nth-child(-n+4)]:border-b lg:[&:nth-child(n+5)]:border-b-0 lg:border-r lg:[&:nth-child(4n)]:border-r-0"
              >
                <Reveal delay={(i % 4) * 70}>
                  <Icon name={s.icon} className="h-6 w-6 text-primary" />
                  <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    View details
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </span>
                </Reveal>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            View all services
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="px-5 py-24">
      <div className="mx-auto grid w-full max-w-[1220px] gap-6 lg:grid-cols-[1.05fr_1fr]">
        <Reveal>
          <div className="h-full rounded-2xl glass-card p-9 md:p-10">
            <h2 className="font-display text-4xl font-bold md:text-5xl">
              Our <span className="text-gradient-brand">aim</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              To provide better supplies, general services and event management to our clients and
              achieve their maximum level of satisfaction — when and where required.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We introduce a new era of services and business techniques to earn a renowned name in
              the business community.
            </p>
            <div className="mt-8 border-t border-border pt-5">
              <p className="font-display text-lg font-bold text-primary">
                MAJ Rizwan Khan (Retd)
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Proprietor
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 80}>
              <div className="h-full rounded-2xl glass-card p-6">
                <h3 className="font-display text-lg font-bold">{h.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {h.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  const field =
    "mt-2 w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/25";
  const label =
    "text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground";

  return (
    <section id="contact" className="px-5 pb-24 pt-4">
      <div className="mx-auto w-full max-w-[1220px] rounded-2xl glass-card p-8 md:p-12">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-4xl font-bold md:text-5xl">
                Send us an <span className="text-gradient-brand">enquiry</span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Share your requirement and our team will respond with a detailed quotation.
              </p>
            </Reveal>

            <form className="mt-8" onSubmit={onSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="name">
                    Name *
                  </label>
                  <input id="name" name="name" required placeholder="Your full name" className={field} />
                </div>
                <div>
                  <label className={label} htmlFor="email">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className={field}
                  />
                </div>
                <div>
                  <label className={label} htmlFor="phone">
                    Phone
                  </label>
                  <input id="phone" name="phone" placeholder="0300-0000000" className={field} />
                </div>
                <div>
                  <label className={label} htmlFor="company">
                    Company
                  </label>
                  <input id="company" name="company" placeholder="Company name" className={field} />
                </div>
              </div>

              <div className="mt-5">
                <label className={label} htmlFor="requirement">
                  Requirement *
                </label>
                <textarea
                  id="requirement"
                  name="requirement"
                  required
                  rows={4}
                  placeholder="Tell us what you need — items, quantity, timeline."
                  className={field}
                />
              </div>

              <button
                type="submit"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {sent ? "Enquiry received" : "Send enquiry"}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
              {sent && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Thank you — we will get back to you shortly.
                </p>
              )}
            </form>
          </div>

          <div className="space-y-6 lg:pt-4">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
              <p className="text-sm leading-relaxed text-foreground">
                M-31, Mezzanine, Fort Sultan, Opp. Air Port Telephone Exchange, Shahra-e-Faisal,
                Karachi.
              </p>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
              <p className="text-sm leading-relaxed text-foreground">
                <a href="tel:+922134680935" className="hover:text-primary">
                  021-34680935
                </a>{" "}
                ·{" "}
                <a href="tel:+922134680936" className="hover:text-primary">
                  021-34680936
                </a>
                <br />
                <a href="tel:+923493196151" className="hover:text-primary">
                  0349-3196151
                </a>
                <br />
                <span className="text-muted-foreground">Fax: 021-34680935</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
              <a
                href="mailto:rk_enterprises2011@hotmail.com"
                className="text-sm text-foreground hover:text-primary"
              >
                rk_enterprises2011@hotmail.com
              </a>
            </div>
            <img src={logo} alt="R.K. Enterprises" className="h-24 w-auto opacity-90" />
          </div>
        </div>
      </div>
    </section>
  );
}
