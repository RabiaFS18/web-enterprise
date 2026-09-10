export type Product = {
  title: string;
  category: string;
  description: string;
  icon: string;
};

export const products: Product[] = [
  {
    title: "Safety Gear & PPE",
    category: "Safety",
    description: "Helmets, fire suits, safety jackets, gloves, gum shoes and full site kits.",
    icon: "hard-hat",
  },
  {
    title: "Fire Fighting Equipment",
    category: "Fire",
    description: "Extinguishers, fire buckets, hose reels, alarm panels and refilling.",
    icon: "flame",
  },
  {
    title: "CCTV & Surveillance",
    category: "Security",
    description: "IP / HD camera systems, NVR storage, installation and maintenance.",
    icon: "cctv",
  },
  {
    title: "Detection Equipment",
    category: "Security",
    description: "Walk-through gates, hand-held metal detectors, vehicle inspection mirrors.",
    icon: "scan",
  },
  {
    title: "Office Furniture",
    category: "Furnishing",
    description: "Workstations, executive tables, chairs, storage and reception setups.",
    icon: "sofa",
  },
  {
    title: "Office Stationery",
    category: "Supply",
    description: "Complete monthly stationery contracts and consumable items.",
    icon: "clipboard",
  },
  {
    title: "Janitorial Supplies & Service",
    category: "Cleaning",
    description: "Cleaning chemicals, tissue, dispensers and housekeeping tools.",
    icon: "sparkles",
  },
  {
    title: "Electrical & Hardware",
    category: "Supply",
    description: "Cables, switchgear, lighting, tools and general hardware items.",
    icon: "package",
  },
  {
    title: "Uniforms & Workwear",
    category: "Furnishing",
    description: "Corporate uniforms, coveralls, security dress and branded workwear.",
    icon: "users",
  },
];

export const productCategories = [
  "All",
  "Safety",
  "Fire",
  "Security",
  "Furnishing",
  "Supply",
  "Cleaning",
];

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  intro: string;
  includes: string[];
};

export const services: Service[] = [
  {
    slug: "construction",
    title: "Construction",
    description: "Civil works, renovation and turnkey site execution with qualified crews.",
    icon: "building",
    intro:
      "Turnkey civil works handled end to end — from site clearing and foundations to finishing and handover, executed by supervised in-house crews.",
    includes: [
      "Civil & structural works",
      "Renovation and refurbishment",
      "Site supervision and project management",
      "Fit-out, flooring and finishing",
      "Material procurement for the site",
    ],
  },
  {
    slug: "safety-security",
    title: "Safety & Security",
    description: "Surveys, consultancy, trained security guards and equipment maintenance.",
    icon: "shield",
    intro:
      "Complete safety and security cover: risk surveys, equipment supply and installation, and trained guards on duty.",
    includes: [
      "Safety surveys and consultancy",
      "Trained security guards",
      "CCTV and access control systems",
      "Fire fighting equipment and refilling",
      "Periodic maintenance and records",
    ],
  },
  {
    slug: "event-management",
    title: "Event Management",
    description: "Complete organizational capacity to plan and run large-scale events.",
    icon: "party",
    intro:
      "Planning, setup and on-ground execution for corporate and large-scale public events of any size.",
    includes: [
      "Venue setup, staging and seating",
      "Sound, lighting and power backup",
      "Event staff, ushers and security",
      "Catering and hospitality arrangement",
      "Branding, panaflex and signage",
    ],
  },
  {
    slug: "general-order-supply",
    title: "General Order Supply",
    description: "Raw and ready material to factories, plus general procurement contracts.",
    icon: "package",
    intro:
      "Single-window procurement for raw and ready material, consumables and general order contracts.",
    includes: [
      "Raw and ready material to factories",
      "Office stationery contracts",
      "Electrical and hardware items",
      "Furniture and uniforms",
      "Scheduled monthly deliveries",
    ],
  },
  {
    slug: "manpower-services",
    title: "Manpower Services",
    description: "Skilled workforce, fire fighters, fire tender crews and canteen contracting.",
    icon: "users",
    intro:
      "Skilled and unskilled manpower deployed on contract, fully supervised and documented.",
    includes: [
      "Skilled and general labour",
      "Fire fighters and fire tender crews",
      "Canteen contracting and staff",
      "Technical and maintenance staff",
      "Payroll and compliance handling",
    ],
  },
  {
    slug: "janitorial-services",
    title: "Janitorial Services",
    description: "Cleaning staff deployment and daily facility housekeeping.",
    icon: "sparkles",
    intro:
      "Daily housekeeping teams with supplies and supervision to keep facilities spotless.",
    includes: [
      "Trained cleaning staff deployment",
      "Daily and deep cleaning schedules",
      "Cleaning chemicals and consumables",
      "Tissue and dispenser refilling",
      "Supervisor reporting",
    ],
  },
  {
    slug: "rent-a-car",
    title: "Rent A Car & Bullet Proof Vehicle",
    description:
      "Corporate vehicle rental with drivers, plus armoured and bullet proof vehicle solutions for VIP and corporate movement.",
    icon: "truck",
    intro:
      "Corporate transport on daily, monthly or long-term contracts, including armoured vehicles for sensitive movement.",
    includes: [
      "Cars, vans and coasters with drivers",
      "Bullet proof and armoured vehicles",
      "Airport pick and drop",
      "Monthly corporate contracts",
      "Trained and verified drivers",
    ],
  },
  {
    slug: "printing-branding",
    title: "Printing & Branding",
    description: "Offset & digital printing, panaflex, annual reports, flyers and cards.",
    icon: "printer",
    intro:
      "In-house coordinated printing and branding for everything from business cards to full annual reports.",
    includes: [
      "Offset and digital printing",
      "Panaflex, standees and signage",
      "Annual reports and brochures",
      "Flyers, cards and stationery",
      "Design and finishing support",
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const highlights = [
  {
    title: "Single-window vendor",
    description: "Supply, manpower and services under one contract.",
  },
  {
    title: "Trained teams",
    description: "Guards, fire crews, janitorial and technical staff.",
  },
  {
    title: "Nationwide delivery",
    description: "Manpower and supplies to different locations.",
  },
  {
    title: "Compliance first",
    description: "Safety surveys, documentation and maintenance records.",
  },
];

export const sceneStages = [
  "Site clearing & road works",
  "Foundation & columns",
  "Facade & glazing",
  "Handover & fit-out",
];
