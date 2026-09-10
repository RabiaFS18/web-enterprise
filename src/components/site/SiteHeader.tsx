import { Link } from "@tanstack/react-router";
import { ArrowRight, User } from "lucide-react";
import logo from "../../assets/rk-logo.png";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1220px] items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="R.K. Enterprises" className="h-11 w-auto" />
          <span className="hidden sm:block">
            <span className="block font-display text-lg font-bold leading-none text-primary">
              R.K. Enterprises
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              General Order Supplier · Event Management &amp; Contractor
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/products"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:block"
            activeProps={{ className: "text-primary" }}
          >
            Products
          </Link>
          <Link
            to="/services"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:block"
            activeProps={{ className: "text-primary" }}
          >
            Services
          </Link>
          <Link
            to="/"
            hash="about"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary sm:block"
          >
            About
          </Link>
          <Link
            to="/signin"
            className="hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary md:inline-flex"
          >
            <User className="h-4 w-4" strokeWidth={1.75} />
            Sign in
          </Link>
          <Link
            to="/"
            hash="contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Contact
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
