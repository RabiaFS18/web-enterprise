import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { supabase } from "../integrations/supabase/client";
import logo from "../assets/rk-logo.png";

const TITLE = "Sign in — R.K. Enterprises";
const DESC = "Client sign in for R.K. Enterprises contract holders and procurement partners.";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field =
    "mt-2 w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/25";
  const label = "text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError("Email ya password galat hai. Dobara try karo.");
      setLoading(false);
      return;
    }

    // Check if admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .single();

    setLoading(false);

    if (roleData?.role === "admin") {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="relative flex min-h-screen items-center px-5 pb-20 pt-28">
        <div className="mx-auto w-full max-w-md rounded-2xl glass-card p-8 md:p-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back to home
          </Link>
          <img src={logo} alt="R.K. Enterprises" className="mt-6 h-16 w-auto" />
          <h1 className="mt-5 font-display text-3xl font-bold">
            Client <span className="text-gradient-brand">sign in</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Contract holders can sign in to review quotations and deployment records.
          </p>

          <form className="mt-7" onSubmit={onSubmit}>
            <div>
              <label className={label} htmlFor="si-email">
                Email
              </label>
              <input
                id="si-email"
                type="email"
                required
                placeholder="you@company.com"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <label className={label} htmlFor="si-password">
                Password
              </label>
              <input
                id="si-password"
                type="password"
                required
                placeholder="••••••••"
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
