import raw from "../../myData.json";

export type Role = string;

export interface PersonalInfo {
  name: string;
  title: string;
  role: Role[];
  location: { current: string; hometown: string };
  phone: string;
  email: string;
  github: string;
  portfolio: string;
  linkedin: string;
}

export interface EducationEntry {
  degree: string;
  school?: string;
  college?: string;
  university?: string;
  board?: string;
  stream?: string;
  year: number;
  location: string;
}

export interface ExperienceEntry {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  currentlyWorking: boolean;
  description: string;
  technologies: string[];
}

export interface ProjectEntry {
  name: string;
  category: string;
  description: string;
  technologies: string[];
  github: string;
  liveDemo: string;
}

export interface RawData {
  personalInfo: PersonalInfo;
  about: { shortDescription: string; description: string; interests: string[] };
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: Record<string, string[]>;
  projects: ProjectEntry[];
  expertise: { title: string; description: string }[];
  socialLinks: Record<string, string>;
  availability: {
    openToWork: boolean;
    interestedRoles: string[];
    preferredLocations: string[];
  };
}

export const data = raw as RawData;

const [firstName, ...restName] = data.personalInfo.name.split(" ");
export const shortName = firstName;
export const monogram = [firstName[0], restName[restName.length - 1]?.[0]]
  .filter(Boolean)
  .join("");

export const site = {
  name: data.personalInfo.name,
  shortName,
  monogram,
  roleLine: "AI engineer & full-stack developer",
  title: "AI Engineer & Full-Stack Developer",
  email: data.personalInfo.email,
  phone: data.personalInfo.phone,
  github: data.personalInfo.github,
  location: data.personalInfo.location.current,
  hometown: data.personalInfo.location.hometown,
  coords: "12.97° N, 77.59° E",
  base: "Bangalore",
  availability: data.availability.openToWork
    ? "Open to new work"
    : "Currently booked",
  year: 2026,
  revision: "rev. 2026",
};

export const nav = [
  { index: "01", label: "Work", href: "/#work" },
  { index: "02", label: "Services", href: "/services" },
  { index: "03", label: "About", href: "/about" },
  { index: "04", label: "Contact", href: "/contact" },
];

export const hero = {
  human: "I do AI.",
  machine:
    "AI engineering and full-stack development, when the idea needs to ship.",
  meta: [
    `${site.name} · ${site.roleLine}`,
    `Base camp · ${site.coords} · ${site.base}`,
    site.availability,
  ],
  notes: {
    human: "human · written by hand",
    machine: "machine · generated",
    terrain: "terrain · point anywhere to raise the hard part",
  },
  intro:
    "Building intelligent software since 2022 — now the work includes agents.",
  primaryCta: { label: "Send me the hard part", href: "/contact" },
  secondaryCta: { label: "See the work", href: "#work" },
};

export const manifesto = {
  label: "[01] Manifesto",
  figure: "fig. 01 · wireframe → production",
  lines: ["Build the model.", "Ship the product", "around it."],
  annotations: ["↤ 12 col ↦", "font-size: var(--step-4)", "ls −0.05em"],
  body: "Models are the easy part. I take an idea from a notebook to an interface people can actually use — agents, APIs and front ends that hold up in production, not just in a demo.",
};

export const workSection = {
  label: "[02] Selected work",
  aside: "Case studies and field reports",
  intro:
    "Some of this I can name. The rest stays under NDA, so there you’ll see how the thing was built, not whose it is.",
};

export interface WorkItem {
  slug: string;
  index: string;
  year: string;
  stack: string;
  title: string;
  client: string;
  summary: string;
  href?: string;
  action?: { label: string; kind: "pipeline" | "agent" | "stack" };
  art: "pipeline" | "agent" | "stack" | "blueprint";
}

export const workItems: WorkItem[] = [
  {
    slug: "youtube-automation-agent",
    index: "01",
    year: "2026",
    stack: "Python · LLMs · Agents · Automation",
    title: "A YouTube channel that runs itself",
    client: "Personal build · automation",
    summary:
      "An agent researches a technology topic, writes the script, records the voiceover and schedules the upload. Four stages, one prompt, and a human approval gate before anything goes public.",
    action: { label: "Run the pipeline", kind: "pipeline" },
    art: "pipeline",
  },
  {
    slug: "ai-agent-projects",
    index: "02",
    year: "2026",
    stack: "Python · LLMs · Tool calling · APIs",
    title: "Agents that use their own tools",
    client: "Experiments · research",
    summary:
      "A collection of agent experiments: planning loops, tool calls, memory, retrieval. Small enough to read in an afternoon, instrumented enough to see exactly where a model starts guessing.",
    action: { label: "Run an agent", kind: "agent" },
    art: "agent",
  },
  {
    slug: "full-stack-applications",
    index: "03",
    year: "2025",
    stack: "Next.js · React · Node · MongoDB",
    title: "Full-stack, end to end",
    client: "Product work · through agencies",
    summary:
      "Modern front ends over real APIs: auth, data models, server rendering and responsive layouts. The kind of build where the design survives contact with the database.",
    action: { label: "Open the stack", kind: "stack" },
    art: "stack",
  },
  {
    slug: "this-portfolio",
    index: "04",
    year: "2026",
    stack: "Next.js · GSAP · Lenis · Canvas",
    title: "mittalkumargupta.com, plotted",
    client: "Own site · Bangalore",
    summary:
      "A blueprint you can scroll: contour terrain in the hero, a pinned work stage, and a design system small enough to hold in one file. Built to be read on a phone as happily as on a 27-inch screen.",
    href: "/about",
    art: "blueprint",
  },
];

export const servicesSection = {
  label: "[03] Services",
  aside: "How I can help",
  allLabel: "All services →",
  allHref: "/services",
};

export interface ServiceItem {
  index: string;
  title: string;
  body: string;
  tags: string[];
  href: string;
}

export const services: ServiceItem[] = [
  {
    index: "01",
    title: "AI engineering & agents",
    body: "RAG systems, tool-using agents and automation that survives real data. Scoped around the one workflow worth automating, then made boring and reliable.",
    tags: ["LLM apps", "RAG", "Agents", "Python"],
    href: "/services#ai",
  },
  {
    index: "02",
    title: "Full-stack development",
    body: "Next.js and React on the front, Node and Python behind it, MongoDB underneath. Typed, tested and handed over with the docs your team needs to own it.",
    tags: ["Next.js", "React", "Node.js", "MongoDB"],
    href: "/services#fullstack",
  },
  {
    index: "03",
    title: "Product UI & design",
    body: "Interfaces designed in Figma and built as a system: tokens, components, motion and the small states nobody remembers to draw. Mobile included.",
    tags: ["Figma", "Design systems", "Motion", "React Native"],
    href: "/services#design",
  },
];

export const processSection = {
  label: "[04] How I work",
  aside: "Under NDA · anonymised",
  claim: ["Your idea on top.", "My code underneath."],
  steps: [
    {
      index: "01",
      title: "Brief",
      body: "A call, your notes, the constraints. I reply with questions and a first idea of scope.",
    },
    {
      index: "02",
      title: "Prototype",
      body: "The difficult part runs in a browser before anyone falls in love with a mock-up.",
    },
    {
      index: "03",
      title: "Build",
      body: "Staging from day one and a written list of decisions. No big reveal at the end.",
    },
    {
      index: "04",
      title: "Handover",
      body: "Docs, a clean repo, and a walkthrough for whoever picks it up next.",
    },
  ],
};

export const nowSection = {
  label: "[05] Now",
  aside: "What I’m working on",
  allLabel: "About me →",
  allHref: "/about",
  items: [
    {
      date: "AI in practice",
      title: "Agents that research, script and publish without a human in the loop",
      pillar: "Automation",
    },
    {
      date: "Machine learning",
      title: "Fine-tuning small models on consumer hardware, and when it beats a prompt",
      pillar: "Learning",
    },
    {
      date: "Web",
      title: "Interfaces for AI: streaming, uncertainty and the states nobody designs",
      pillar: "Building",
    },
  ],
};

export const ctaSection = {
  label: "[06] Next",
  aside: "30 minutes",
  title: ["Tell me what", "you’re building."],
  primary: { label: "Book a 30-min call", href: `mailto:${site.email}?subject=Let's%20talk` },
  secondary: { label: "Or send a brief", href: "/contact" },
};

export const footer = {
  claim: ["Got a project that needs to", "move?"],
  claimLink: "Let’s talk.",
  columns: [
    {
      title: "Site",
      links: [
        { label: "Work", href: "/#work" },
        { label: "Services", href: "/services" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Elsewhere",
      links: [
        { label: "GitHub", href: site.github, external: true },
        { label: "Email", href: `mailto:${site.email}`, external: true },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Send a brief", href: "/contact" },
        { label: "Book a call", href: `mailto:${site.email}?subject=Let's%20talk`, external: true },
      ],
    },
  ],
  stats: [
    { label: "Cookies", value: "0" },
    { label: "Banners", value: "0" },
    { label: "Trackers", value: "0" },
  ],
  signature: "I do AI.",
  bottom: `© ${site.year} ${site.name} · Designed and built in ${site.base}`,
  hints: "Press [G] for the grid · [⌘K] for everything else",
};

export const aboutPage = {
  label: "[01] About",
  aside: "The long version",
  title: ["Software engineer,", "mostly at the seam", "between AI and UI."],
  lead: data.about.description,
  interests: data.about.interests,
};

export const skillsGroups = [
  { key: "artificialIntelligence", label: "AI & machine learning" },
  { key: "frontendDevelopment", label: "Front end" },
  { key: "backendDevelopment", label: "Back end" },
  { key: "mobileDevelopment", label: "Mobile" },
  { key: "machineLearningFrameworks", label: "ML frameworks" },
  { key: "programmingLanguages", label: "Languages" },
  { key: "designTools", label: "Design" },
  { key: "otherTechnologies", label: "Other" },
].map((g) => ({
  ...g,
  items: (data.skills as Record<string, string[]>)[g.key] ?? [],
}));
