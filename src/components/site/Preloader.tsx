import { useEffect, useState } from "react";
import logo from "../../assets/rk-logo.png";

export function Preloader() {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        const next = p + Math.random() * 14 + 6;
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => setGone(true), 500);
          return 100;
        }
        return next;
      });
    }, 130);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = gone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-700 ${
        pct >= 100 ? "pointer-events-none opacity-0" : ""
      }`}
    >
      <div className="animate-logo-flip">
        <img src={logo} alt="R.K. Enterprises" className="h-44 w-auto drop-shadow-xl" />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.5em] text-muted-foreground">
        Born to Serve
      </p>
      <div className="mt-8 h-[3px] w-56 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-100"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="mt-3 font-display text-sm tabular-nums text-muted-foreground">
        {Math.round(Math.min(pct, 100))}%
      </span>
    </div>
  );
}
