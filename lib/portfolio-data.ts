export const siteLinks = {
  primaryCta: { href: "https://cal.com/milind", label: "Book time" },
  resume: { href: "https://resume.milind.app", label: "View resume" },
  github: { href: "https://github.com/thatbeautifuldream", label: "GitHub" },
  linkedin: {
    href: "https://www.linkedin.com/in/mishramilind/",
    label: "LinkedIn",
  },
  x: { href: "https://x.com/milindmishra_", label: "X/Twitter" },
}

export const heroStats = [
  { label: "users across shipped products", value: "2m+" },
  { label: "products shipped from 0→1", value: "5+" },
  { label: "talks at React communities", value: "4*" },
]

export const roles = [
  {
    company: "Merlin AI by Foyer",
    role: "Product Engineer / Design Engineer",
    period: "Feb 2025 to present",
    location: "Bengaluru",
    summary:
      "Built and shipped AI-native product experiences across onboarding, chat history, model selection, and interaction-heavy surfaces.",
    highlights: [
      "Shipped ChatGPT Imports UI to improve migration and onboarding for 10,000+ users.",
      "Revamped chat history flows and dynamic row behavior to make large conversation archives easier to navigate.",
      "Built a richer model selector with motion and stronger information hierarchy.",
    ],
  },
  {
    company: "SARAL",
    role: "Software Engineer",
    period: "Dec 2024 to Feb 2025",
    location: "Bengaluru / remote",
    summary:
      "Improved internal product workflows for support, growth, and campaign execution in a fast-moving operations-heavy product.",
    highlights: [
      "Revamped the internal dashboard to improve visibility of campaign and support metrics.",
      "Built multi-select drag and drop for faster bulk operations.",
      "Created a content submission flow that reduced approval friction for campaign execution.",
    ],
  },
  {
    company: "Proof-of-Skill Protocol",
    role: "Founding Product Engineer",
    period: "Jun 2024 to Dec 2024",
    location: "Bengaluru",
    summary:
      "Led product engineering for an assessment and skill validation platform from MVP to deployment.",
    highlights: [
      "Owned MVP frontend flows across validators, candidates, and recruiters.",
      "Designed consensus-driven validator interfaces and real-time proctoring surfaces.",
      "Handled product and deployment end to end while the system was still taking shape.",
    ],
  },
]

export const projects = [
  {
    name: "Expense Agent",
    status: "Active",
    href: "https://expense.milind.fyi",
    github: "https://api.expense.milind.fyi/docs",
    description:
      "Full-stack AI bookkeeping agent that tracks expenses, income, and savings through natural conversation across a Next.js 16 PWA, a Telegram bot, and an MCP server, all backed by a single Express API and unified PostgreSQL ledger.",
    metrics: [
      { label: "Transports", value: "REST · BOT · MCP" },
      { label: "Stack", value: "Next.js 16 · Express · Postgres" },
    ],
    highlights: [
      "Architected and shipped the entire stack solo as a Bun and Turbo monorepo, with the Postgres schema, Express API, Next.js PWA frontend, Telegram bot, and MCP server all sharing one domain layer.",
      "Designed a unified transactions ledger in PostgreSQL with Drizzle ORM that powers expenses, income, and savings together, with multi-currency FX conversion resolved at query time.",
      "Built conversational ingestion on AI SDK 6 with receipt vision, voice memo transcription via Whisper, and Composio-backed Gmail extraction so the agent can read inbox receipts on demand.",
      "Wired OpenTelemetry plus Langfuse across every transport, and auto-generated OpenAPI types from express-zod-api endpoints to keep the frontend perfectly in sync with the API.",
    ],
    tags: [
      "TypeScript",
      "Next.js",
      "Express",
      "PostgreSQL",
      "Drizzle",
      "AI SDK",
      "Telegram Bot",
      "MCP",
      "Better Auth",
      "PWA",
    ],
  },
  {
    name: "JSON Visualiser",
    status: "Live",
    href: "https://jsonvisualiser.com",
    github: "https://github.com/thatbeautifuldream/jsonvisualiser",
    description:
      "JSON inspection and visualization tool for debugging deeply nested payloads across tree and grid views.",
    metrics: [
      { label: "Return rate", value: "43%" },
      { label: "Power user sessions", value: "49" },
    ],
    highlights: [
      "Built a unified inspection workflow that combines validation, formatting, and multi-view exploration for complex payloads.",
      "Implemented tree and grid renderers optimized for nested JSON structures with efficient expand and collapse interactions.",
    ],
    tags: ["React", "TypeScript", "D3.js"],
  },
  {
    name: "Markdown Visualizer",
    status: "Live",
    href: "https://markdownvisualizer.com",
    github: "https://github.com/thatbeautifuldream/markdownvisualizer",
    description:
      "Markdown editing and preview tool for fast iteration on technical writing workflows.",
    metrics: [],
    highlights: [
      "Built a low-latency editing and preview workflow to reduce context switching while drafting markdown-heavy content.",
      "Implemented rendering and editing utilities that keep technical writing workflows responsive and predictable.",
    ],
    tags: ["React", "TypeScript", "Markdown"],
  },
  {
    name: "attnui",
    status: "In progress",
    href: "https://attnui.com",
    github: "https://github.com/thatbeautifuldream/ui",
    description:
      "A passion project and my design engineering playground. A component library where I work through motion, interaction quality, and the small details that make interfaces feel finished.",
    metrics: [
      { label: "Components", value: "3" },
      { label: "Registry", value: "attnui.com/r/registry.json" },
    ],
    highlights: [
      "Where I experiment with interaction design, motion systems, and the craft I want to bring to every product I touch.",
      "Production-ready primitives built to raise my own bar for what polished frontend work looks like.",
    ],
    tags: ["React", "TypeScript", "Motion", "Design Systems"],
  },
]

export const talks = [
  {
    title: "Building a Component Distribution System with shadcn Registry",
    event: "React Bangalore",
    date: "Jan 31, 2026",
    href: "https://meetup.com/reactjs-bangalore/events/312620988",
    description:
      "A practical talk on shipping components with better distribution ergonomics.",
  },
  {
    title: "Mastering ViewTransition in React for Stunning UI Updates",
    event: "React Play Bengaluru",
    date: "Nov 15, 2025",
    href: "https://meetup.com/reactplay-bengaluru/events/311437528",
    description:
      "View transitions, UI continuity, and interaction-led motion in React.",
  },
  {
    title: "Building Real-Time Applications with Reactive Databases",
    event: "React Play Bengaluru",
    date: "May 17, 2025",
    href: "https://meetup.com/reactplay-bengaluru/events/307690438",
    description:
      "View transitions, UI continuity, and interaction-led motion in React.",
  },
  {
    title: "AI for React Developers",
    event: "React Bangalore",
    date: "April 12, 2025",
    href: "https://meetup.com/reactjs-bangalore/events/306320480",
    description:
      "A product-minded frontend intro to AI SDK workflows and patterns.",
  },
]

export const contributions = [
  {
    title: "Streamdown table copy and CSV / markdown download options",
    href: "https://github.com/vercel/streamdown/pull/99",
    context:
      "Improved utility and export affordances for markdown-heavy developer workflows.",
  },
  {
    title: "Streamdown code and image download affordances",
    href: "https://github.com/vercel/streamdown/pull/102",
    context: "Added more complete download behavior for rendered content.",
  },
  {
    title: "AI Elements speech-to-text prompt input",
    href: "https://github.com/vercel/ai-elements/pull/112",
    context:
      "Extended prompt input ergonomics in an AI-facing interface primitive set.",
  },
]

export const contactLinks = [
  {
    label: "GitHub",
    href: "https://github.com/thatbeautifuldream",
    copy: "Open source work, side projects, and product experiments.",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/mishramilind",
    copy: "Professional profile and current work context.",
  },
  {
    label: "X/Twitter",
    href: "https://x.com/milindmishra_",
    copy: "Thoughts, links, and occasional product or interface observations.",
  },
]
