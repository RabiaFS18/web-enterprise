import {
  HardHat,
  Flame,
  Cctv,
  Scan,
  Sofa,
  ClipboardList,
  Sparkles,
  Package,
  Users,
  Building2,
  ShieldCheck,
  PartyPopper,
  Truck,
  Printer,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  "hard-hat": HardHat,
  flame: Flame,
  cctv: Cctv,
  scan: Scan,
  sofa: Sofa,
  clipboard: ClipboardList,
  sparkles: Sparkles,
  package: Package,
  users: Users,
  building: Building2,
  shield: ShieldCheck,
  party: PartyPopper,
  truck: Truck,
  printer: Printer,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = map[name] ?? Package;
  return <Cmp className={className} strokeWidth={1.75} />;
}
