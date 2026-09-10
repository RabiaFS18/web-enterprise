import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { sceneStages } from "../../lib/site-data";

const ConstructionScene = lazy(() => import("./ConstructionScene"));

export function SceneBackground() {
  const progressRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState(sceneStages[0]);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      progressRef.current = p;
      const idx = Math.min(sceneStages.length - 1, Math.floor(p * sceneStages.length));
      setStage(sceneStages[idx]);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "auto",
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>
          {mounted && (
            <Suspense fallback={null}>
              <ConstructionScene progressRef={progressRef} />
            </Suspense>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/25 to-background/70" />
      <div className="pointer-events-none absolute bottom-5 left-5 hidden items-center gap-3 rounded-full glass-card px-4 py-2 md:flex">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {stage}
        </span>
      </div>
    </div>
  );
}
