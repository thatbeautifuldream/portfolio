"use client"

import {
  RiCodeLine,
  RiComputerLine,
  RiPaintLine,
  RiPulseLine,
  RiTerminalLine,
} from "@remixicon/react"

import { Section } from "@/components/section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WakatimeCategories } from "./wakatime-categories"
import { WakatimeCodingActivity } from "./wakatime-coding-activity"
import { WakatimeEditors } from "./wakatime-editors"
import { WakatimeLanguages } from "./wakatime-languages"
import { WakatimeOperatingSystem } from "./wakatime-operating-system"

const tabs = [
  { value: "coding-activity", label: "Coding Activity", icon: RiPulseLine },
  { value: "languages", label: "Languages", icon: RiCodeLine },
  { value: "editors", label: "Editors", icon: RiTerminalLine },
  {
    value: "operating-systems",
    label: "Operating Systems",
    icon: RiComputerLine,
  },
  { value: "categories", label: "Categories", icon: RiPaintLine },
] as const

export function Wakatime() {
  return (
    <Section delay={0.05}>
      <Tabs defaultValue="coding-activity">
        <TabsList className="mb-3 w-full gap-1 bg-transparent md:w-fit">
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-1 rounded-lg data-[state=active]:border data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-none md:flex-none md:whitespace-nowrap"
            >
              <Icon
                aria-hidden="true"
                className="size-4 shrink-0 opacity-60 md:-ms-0.5 md:me-1.5"
              />
              <span className="sr-only md:not-sr-only">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="coding-activity">
          <WakatimeCodingActivity />
        </TabsContent>
        <TabsContent value="languages">
          <WakatimeLanguages />
        </TabsContent>
        <TabsContent value="editors">
          <WakatimeEditors />
        </TabsContent>
        <TabsContent value="operating-systems">
          <WakatimeOperatingSystem />
        </TabsContent>
        <TabsContent value="categories">
          <WakatimeCategories />
        </TabsContent>
      </Tabs>
    </Section>
  )
}
