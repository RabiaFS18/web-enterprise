export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1220px] flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} R.K. Enterprises. All rights reserved.</p>
        <p className="font-semibold uppercase tracking-[0.32em]">Born to Serve</p>
      </div>
    </footer>
  );
}
