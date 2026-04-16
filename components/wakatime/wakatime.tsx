"use client"

import {
  RiCodeLine,
  RiComputerLine,
  RiPaintLine,
  RiPulseLine,
  RiTerminalLine,
} from "@remixicon/react"

import { Section } from "@/components/section"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WakatimeCategories } from "./wakatime-categories"
import { WakatimeCodingActivity } from "./wakatime-coding-activity"
import { WakatimeEditors } from "./wakatime-editors"
import { WakatimeLanguages } from "./wakatime-languages"
import { WakatimeOperatingSystem } from "./wakatime-operating-system"

export function Wakatime() {
  return (
    <Section delay={0.05}>
      <Tabs defaultValue="coding-activity">
        <ScrollArea>
          <TabsList className="mb-3 w-auto gap-1 bg-transparent">
            <TabsTrigger
              className="flex-none rounded-lg whitespace-nowrap data-[state=active]:border data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-none"
              value="coding-activity"
            >
              <RiPulseLine
                aria-hidden="true"
                className="-ms-0.5 me-1.5 size-4 opacity-60"
              />
              Coding Activity
            </TabsTrigger>
            <TabsTrigger
              className="flex-none rounded-lg whitespace-nowrap data-[state=active]:border data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-none"
              value="languages"
            >
              <RiCodeLine
                aria-hidden="true"
                className="-ms-0.5 me-1.5 size-4 opacity-60"
              />
              Languages
            </TabsTrigger>
            <TabsTrigger
              className="flex-none rounded-lg whitespace-nowrap data-[state=active]:border data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-none"
              value="editors"
            >
              <RiTerminalLine
                aria-hidden="true"
                className="-ms-0.5 me-1.5 size-4 opacity-60"
              />
              Editors
            </TabsTrigger>
            <TabsTrigger
              className="flex-none rounded-lg whitespace-nowrap data-[state=active]:border data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-none"
              value="operating-systems"
            >
              <RiComputerLine
                aria-hidden="true"
                className="-ms-0.5 me-1.5 size-4 opacity-60"
              />
              Operating Systems
            </TabsTrigger>
            <TabsTrigger
              className="flex-none rounded-lg whitespace-nowrap data-[state=active]:border data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-none"
              value="categories"
            >
              <RiPaintLine
                aria-hidden="true"
                className="-ms-0.5 me-1.5 size-4 opacity-60"
              />
              Categories
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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
