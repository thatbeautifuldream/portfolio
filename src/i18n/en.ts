const en = {
  name: "Milind Kumar Mishra",
  tagline: "Product engineer building AI-native interfaces",
  description:
    "Product engineer building AI-native interfaces, product systems, and tools people return to.",
  city: "Bengaluru",
  back: { index: "Index" },
  footer: {
    location: "Bengaluru, India",
    timeSeparator: " in ",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    toggleTheme: "Toggle theme",
    latestCommit: (hash: string) => `Latest commit ${hash}`,
    source: "Source",
    switchLanguage: "हिन्दी में पढ़ें",
  },
  copyEmail: "Copy email address",
  copied: "Copied",
  github: {
    title: "GitHub",
    summary: (total: string) =>
      `${total} contributions in the last year across personal and work accounts`,
    total: (total: string) => `${total} contributions in the last year`,
    day: (count: number, formatted: string) =>
      `${count ? formatted : "No"} contribution${count === 1 ? "" : "s"}`,
  },
  home: {
    updated: (date: string) => `Updated ${date}`,
    hi: "Hi",
    im: "I'm",
    name: "Milind.",
    build: "I build the part of software",
    feels: "a person actually feels.",
    intro: [
      "Product engineer at ",
      " in ",
      ". I turn the messy middle of an idea into something you can actually use. 130+ releases across mobile, desktop, and web; one coding agent from zero to v1.0 in two weeks.",
    ],
    tools: [
      "The big picture matters. So does the way a button feels. My work has reached 2m+ people across five 0-to-1 products. On the side, I make tools for my own everyday friction, like ",
      " and ",
      ".",
    ],
    next: [
      "Currently exploring the space between engineering and design. Find me on ",
      ", ",
      " and ",
      ", read my ",
      ", ",
      ", or ",
      ".",
    ],
    jsonVisualiser: "JSON Visualiser",
    markdownVisualizer: "Markdown Visualizer",
    resume: "résumé",
    book: "book 15 minutes",
    email: "email me",
    projects: "Projects",
    writing: "Writing",
    work: "Work",
    talks: "Talks",
    more: "More",
    now: "now",
    gists: "Gists",
    snippets: (count: number) => `${count} snippets`,
    uses: "Uses",
    usesMeta: "Tools I rely on",
    contact: "Contact",
    contactMeta: "Say hello",
  },
  work: {
    title: "Work",
    schemaName: "Work Experience",
    description:
      "Work across startup environments. Different products and teams, but a consistent pull toward the surfaces people touch and the craft behind them.",
    meta: "Product and AI work across startup environments.",
    body: [
      "Different products and teams, but a consistent pull toward the surfaces people touch and the craft behind them. I'm still sharpening that instinct, and honestly, that's what keeps the work alive for me.",
      "I care most about the surfaces people actually touch. Good product engineering means understanding not just the code, but how users move through a system and where their mental models break down.",
    ],
    roles: {} as Record<
      string,
      {
        company?: string;
        role: string;
        period: string;
        location: string;
        summary: string;
        highlights: string[];
      }
    >,
  },
  talks: {
    title: "Talks",
    description:
      "Talks on React, motion systems, interface architecture, and AI for frontend engineers.",
    meta: "I share what I learn because it forces me to learn it deeper.",
    body: "These talks come from things I ran into firsthand and couldn't stop thinking about. Sharing them publicly keeps me honest, helps others experiment sooner, and sharpens my own understanding in a way that building alone never could.",
    openSource: "Open source",
    openSourceBody:
      "While building AI chat interfaces at Merlin, the core challenge was rendering streamed markdown responses cleanly. That led me to Streamdown, Vercel's open source markdown renderer built for AI streaming. These contributions came from real product gaps, not side quests.",
    contributions: "Contributions",
    items: {} as Record<
      string,
      { title: string; event: string; description: string }
    >,
    contributionTitles: {} as Record<string, string>,
  },
  contact: {
    title: "Contact",
    description: "Get in touch: email, GitHub, LinkedIn, or book a time.",
    meta: "If the work needs product judgment and implementation discipline, I'd like to hear about it.",
    body: "I'm most responsive on email and LinkedIn. If you have something interesting to discuss, I'd rather you send a detailed message than a generic introduction.",
    call: ["Or ", " if a call is easier."],
    book: "book 15 minutes",
    abroad: "Working with teams abroad",
    abroadBody: (city: string, country: string, timezone: string) =>
      `Based in ${city}, ${country} (${timezone}). I keep a 3–4 hour overlap with US mornings and most of the European workday, and I'm open to remote roles, B2B contractor, or EOR arrangements. Fluent in English.`,
    country: "India",
    elsewhere: "Elsewhere",
    links: {} as Record<string, string>,
  },
  privacy: {
    title: "Privacy",
    description: "How this personal site handles information and analytics.",
    meta: "A small site with a clear data boundary.",
    collects: "What this site collects",
    collectsBody:
      "The pages are primarily static content. When analytics are enabled, Google Analytics, Microsoft Clarity, and PostHog (when configured) load only after a visitor interacts with the page or after the idle fallback. Those services may receive page-view, device, browser, and interaction information according to their own policies. PostHog may also record sessions, with input values masked by default. The site does not ask visitors to create an account or submit a password.",
    contactInfo: "Contact information",
    contactInfoBody: [
      "If you email me, I receive the information you choose to include so I can reply. I use it for the conversation you initiated and do not sell personal information. For contact details, use the ",
      ".",
    ],
    contactPage: "contact page",
    choices: "Your choices",
    choicesBody: [
      "You can block analytics in your browser or disable JavaScript. The repository can also build the site with every analytics provider disabled using ",
      ".",
    ],
    note: "This page describes the behavior of this personal site as currently implemented and will be updated if that behavior changes.",
  },
  blog: {
    title: "Blog",
    heading: "Writing",
    description:
      "Notes on product engineering, AI interfaces, developer tools, and the journey of building products.",
    meta: "Notes on the journey of building products.",
    share: "Share",
    linkCopied: "Link copied",
    posts: "Posts",
  },
  gist: {
    title: "Gists",
    description: "Code snippets and quick solutions.",
    viewOnGitHub: "View on GitHub",
    snippets: "Snippets",
  },
  project: {
    title: "Projects",
    description: "Tools I build and use every day.",
  },
  uses: {
    title: "Uses",
    description:
      "The hardware, software, and services I use every day to build products.",
    meta: "The tools I reach for every day.",
    body: "Hardware, software, and services that survived long enough to become defaults. Each one links to why it stuck.",
    machine: "This machine",
    categories: {} as Record<string, string>,
  },
  canvas: {
    groups: {
      about: "About headline · About motion",
      pageHeader: "Page header",
      indexList: "Index list",
      code: "Code copy · Client enhancement",
      email: "Email link",
      footer: "Footer",
      coverage: "Coverage",
    },
    omissionsSummary: "Nonvisual and live-service omissions",
    omissionsIntro:
      "DocumentLayout is the real host. Layout and full page views are excluded: Layout mounts trackers, and pages compose these same components, sometimes with live data. No modal or portal components exist in this project.",
    codeSample: 'const message = "Hello, canvas";\nconsole.log(message);',
    controls: {
      zoomOut: "Zoom out",
      zoomIn: "Zoom in",
      zoomLevel: "Zoom",
      fit: "Fit all",
      reset: "Reset",
      theme: "Theme",
    },
  },
};

export type Dictionary = typeof en;

export default en;
