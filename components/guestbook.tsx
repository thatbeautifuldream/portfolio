"use client"

import { client, orpc } from "@/lib/orpc"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { RiDeleteBinLine, RiArrowRightUpLine } from "@remixicon/react"

const MAX_MESSAGE_LENGTH = 1000

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function Guestbook() {
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const { data: entries, isLoading } = useQuery(
    orpc.guestbook.list.queryOptions({
      input: { limit: 50, offset: 0 },
    })
  )

  const createMutation = useMutation({
    mutationFn: async (input: { name: string; message: string }) => {
      return await client.guestbook.create(input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.guestbook.list.queryOptions({
          input: { limit: 50, offset: 0 },
        }).queryKey,
      })
      setName("")
      setMessage("")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (input: { id: string }) => {
      return await client.guestbook.remove(input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.guestbook.list.queryOptions({
          input: { limit: 50, offset: 0 },
        }).queryKey,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    createMutation.mutate({ name: name.trim(), message: message.trim() })
  }

  const isSubmitDisabled =
    createMutation.isPending || !name.trim() || !message.trim()

  return (
    <div className="grid gap-16">
      <form
        onSubmit={handleSubmit}
        className="animate-fade-up flex flex-col gap-6"
        style={{ animationDelay: "200ms" }}
      >
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <label
              htmlFor="guestbook-name"
              className="text-sm text-muted-foreground"
            >
              Name
            </label>
            <input
              id="guestbook-name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="border-b border-border/60 bg-transparent px-0 py-2 text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none"
            />
          </div>
          <div className="grid gap-1.5">
            <label
              htmlFor="guestbook-message"
              className="text-sm text-muted-foreground"
            >
              Message
            </label>
            <textarea
              id="guestbook-message"
              name="message"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))
              }
              placeholder="Write something..."
              required
              rows={3}
              className="resize-none border-b border-border/60 bg-transparent px-0 py-2 text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none"
            />
            <span className="text-sm tabular-nums text-muted-foreground/60">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="inline-flex items-center gap-1.5 self-start rounded-4xl bg-foreground px-4 py-2 text-sm font-medium text-background no-underline hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign guestbook
          <RiArrowRightUpLine className="size-4" />
        </button>
        {createMutation.error && (
          <p className="text-sm text-destructive">
            Failed to sign guestbook. Please try again.
          </p>
        )}
      </form>

      <div
        className="animate-fade-up grid gap-8"
        style={{ animationDelay: "300ms" }}
      >
        <h2 className="text-lg font-semibold tracking-tight">Entries</h2>
        {isLoading ? (
          <div className="grid gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid gap-2">
                <div className="h-4 w-24 animate-pulse bg-muted" />
                <div className="h-3 w-16 animate-pulse bg-muted" />
                <div className="h-3 w-full animate-pulse bg-muted" />
              </div>
            ))}
          </div>
        ) : !entries?.data?.length ? (
          <p className="text-muted-foreground">
            No entries yet. Be the first to sign.
          </p>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-0 divide-y divide-border/40">
              {entries.data.map((entry) => (
                <motion.article
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="group grid gap-1.5 py-5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-base font-medium text-foreground">
                      {entry.name}
                    </span>
                    <span className="text-sm tabular-nums text-muted-foreground/60">
                      {formatDate(entry.createdAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        deleteMutation.mutate({ id: entry.id })
                      }
                      className="ml-auto opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive"
                      aria-label="Delete entry"
                    >
                      <RiDeleteBinLine className="size-4" />
                    </button>
                  </div>
                  <p className="max-w-[56ch] text-base text-pretty leading-relaxed text-muted-foreground">
                    {entry.message}
                  </p>
                </motion.article>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}