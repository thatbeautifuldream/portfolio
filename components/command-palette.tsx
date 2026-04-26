"use client"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { RiArrowRightUpLine } from "@remixicon/react"
import Fuse from "fuse.js"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Action = {
  id: string
  label: string
  description: string
  href: string
  keywords: string
  category: string
  external?: boolean
}

const actions: Action[] = [
  {
    id: "home",
    label: "Home",
    description: "Go to homepage",
    href: "/",
    keywords: "home index landing",
    category: "Navigation",
  },
  {
    id: "work",
    label: "Work",
    description: "Work experience",
    href: "/work",
    keywords: "work experience career jobs",
    category: "Navigation",
  },
  {
    id: "projects",
    label: "Projects",
    description: "Projects and products",
    href: "/projects",
    keywords: "projects products builds",
    category: "Navigation",
  },
  {
    id: "talks",
    label: "Talks",
    description: "Conference talks and meetups",
    href: "/talks",
    keywords: "talks conferences speaking",
    category: "Navigation",
  },
  {
    id: "blog",
    label: "Blog",
    description: "Blog posts",
    href: "/blog",
    keywords: "blog posts articles writing",
    category: "Navigation",
  },
  {
    id: "gist",
    label: "Gist",
    description: "Code snippets and gists",
    href: "/gist",
    keywords: "gist code snippets",
    category: "Navigation",
  },
  {
    id: "tweets",
    label: "Tweets",
    description: "Embedded tweets gallery",
    href: "/tweets",
    keywords: "tweets twitter x social",
    category: "Navigation",
  },
  {
    id: "contact",
    label: "Contact",
    description: "Get in touch",
    href: "/contact",
    keywords: "contact email reach",
    category: "Navigation",
  },
  {
    id: "guestbook",
    label: "Guestbook",
    description: "Leave a message",
    href: "/guestbook",
    keywords: "guestbook message sign",
    category: "Navigation",
  },
  {
    id: "wakatime",
    label: "Wakatime",
    description: "Coding activity dashboard",
    href: "/wakatime",
    keywords: "wakatime coding activity stats",
    category: "Analytics & Stats",
  },
  {
    id: "spotify",
    label: "Spotify",
    description: "Now playing and top tracks",
    href: "/spotify",
    keywords: "spotify music listening tracks",
    category: "Analytics & Stats",
  },
  {
    id: "github",
    label: "GitHub",
    description: "Open source work",
    href: "https://github.com/thatbeautifuldream",
    keywords: "github code open source",
    category: "Social Media",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Professional profile",
    href: "https://linkedin.com/in/mishramilind",
    keywords: "linkedin professional network",
    category: "Social Media",
    external: true,
  },
  {
    id: "x",
    label: "X / Twitter",
    description: "Thoughts and links",
    href: "https://x.com/milindmishra_",
    keywords: "x twitter social microblog",
    category: "Social Media",
    external: true,
  },
  {
    id: "cal",
    label: "Book time",
    description: "Schedule a call",
    href: "https://cal.com/milind",
    keywords: "cal book schedule meeting call",
    category: "Contact",
    external: true,
  },
  {
    id: "resume",
    label: "Resume",
    description: "View resume",
    href: "https://resume.milind.app",
    keywords: "resume cv career",
    category: "Contact",
    external: true,
  },
]

const fuse = new Fuse<Action>([...actions], {
  keys: ["label", "description", "keywords"],
  threshold: 0.3,
})

const categories = [...new Set(actions.map((a) => a.category))]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runAction = (action: Action) => {
    setOpen(false)
    if (action.external || action.href.startsWith("http")) {
      window.open(action.href, "_blank", "noopener")
    } else {
      router.push(action.href)
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {categories.map((category) => (
          <CommandGroup key={category} heading={category}>
            {actions
              .filter((a) => a.category === category)
              .map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={() => runAction(action)}
                  keywords={[action.keywords, action.description]}
                >
                  <span>{action.label}</span>
                  {action.external && (
                    <RiArrowRightUpLine className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
                  )}
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
