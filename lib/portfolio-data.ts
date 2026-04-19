export const siteLinks = {
  primaryCta: { href: "https://cal.com/milind", label: "Book time" },
  resume: { href: "https://resume.milind.app", label: "View resume" },
  github: { href: "https://github.com/thatbeautifuldream", label: "GitHub" },
  linkedin: { href: "https://www.linkedin.com/in/mishramilind/", label: "LinkedIn" },
  x: { href: "https://x.com/milindmishra_", label: "X/Twitter" },
}

export const heroStats = [
  { label: "users migrated through ChatGPT Imports", value: "10k+" },
  { label: "all-time users on AI Roadmap Generator", value: "5.6k+" },
  { label: "return rate on JSON Visualiser", value: "43%" },
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
    name: "AI Roadmap Generator",
    status: "Live",
    href: "https://airoadmapgenerator.com",
    github: "https://github.com/thatbeautifuldream/ai-roadmap-generator",
    description:
      "A full-stack AI product for generating personalized learning roadmaps with typed outputs and a visual node-based interface.",
    metrics: [
      { label: "All-time users", value: "5,600+" },
      { label: "Roadmaps generated", value: "500+" },
    ],
    highlights: [
      "Built the full stack: prompt design, typed parsing, canvas renderer, and responsive product UX.",
      "Optimized roadmap generation to feel fast enough for exploration, not just one-off use.",
    ],
    tags: ["Next.js", "TypeScript", "Canvas", "LLMs"],
  },
  {
    name: "JSON Visualiser",
    status: "Live",
    href: "https://jsonvisualiser.com",
    github: "https://github.com/thatbeautifuldream/jsonvisualiser",
    description:
      "A JSON debugging and visualization tool with tree and grid views for nested data exploration.",
    metrics: [
      { label: "Unique users", value: "143" },
      { label: "Return rate", value: "43%" },
    ],
    highlights: [
      "Made deeply nested payloads understandable without making the interface feel heavy.",
      "Balanced readability and rendering performance for large structures and smaller screens.",
    ],
    tags: ["React", "TypeScript", "D3.js"],
  },
  {
    name: "models.surf",
    status: "Live",
    href: "https://models.surf",
    github: "https://github.com/thatbeautifuldream/models",
    description:
      "A capability-first model discovery interface for developers choosing across rapidly changing AI models.",
    metrics: [{ label: "Project stage", value: "2026" }],
    highlights: [
      "Designed the interface around fit-for-purpose filtering, not model-list browsing.",
      "Used ranking and capability views to cut evaluation time for developers exploring options.",
    ],
    tags: ["Next.js", "AI tooling", "Search UX"],
  },
  {
    name: "Resume App",
    status: "Open source",
    href: "https://resume.milind.app",
    github: "https://github.com/thatbeautifuldream/resume",
    description:
      "A typed, hackable resume website with human-readable, ATS-friendly, and chat-friendly views from one structured source.",
    metrics: [{ label: "Modes from one dataset", value: "4" }],
    highlights: [
      "Treats a resume as product data, not styled text.",
      "Combines readable UI, APIs, and AI chat grounding from a single schema.",
    ],
    tags: ["Next.js", "shadcn/ui", "AI chat"],
  },
]

export const talks = [
  {
    title: "Building a Component Distribution System with shadcn Registry",
    event: "React Bangalore",
    date: "2025",
    href: "https://meetup.com/reactjs-bangalore/events/312620988",
    description:
      "A practical talk on shipping components with better distribution ergonomics.",
  },
  {
    title: "Mastering ViewTransition in React for Stunning UI Updates",
    event: "React Play Bengaluru",
    date: "2025",
    href: "https://meetup.com/reactplay-bengaluru/events/311437528",
    description:
      "View transitions, UI continuity, and interaction-led motion in React.",
  },
  {
    title: "AI for React Developers",
    event: "React Bangalore",
    date: "2025",
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
      "Improved utility and export affordances for markdown-heavy developer workflows.",  },
  {
    title: "Streamdown code and image download affordances",
    href: "https://github.com/vercel/streamdown/pull/102",
    context:
      "Added more complete download behavior for rendered content.",
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
