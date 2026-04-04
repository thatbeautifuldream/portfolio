---
title: Building AI Interfaces That Feel Human
description: Lessons from shipping AI-native products to 2M+ users — onboarding, model selection, chat histories, and the interaction details that make AI feel less robotic.
category: Product
date: "2025-04-05"
---

# Building AI Interfaces That Feel Human

After working on Merlin AI and other AI-native products, I've learned that the difference between a tool people tolerate and one they love often comes down to interaction quality.

## The Onboarding Gap

Most AI products dump users into a chat interface with zero context. The first experience is a blank cursor blinking at you, daring you to figure out what this thing does.

We approached onboarding differently:

1. **Show, don't tell** — Pre-filled example prompts that demonstrate actual value
2. **Progressive disclosure** — Reveal complexity as users need it, not all at once
3. **Model guidance** — Help users choose the right model for their task (more on this below)

## Model Selection as a UX Problem

With 40% of users never switching from the default model, model selection became a design challenge, not just a technical one.

The solution wasn't better documentation. It was:
- **Contextual suggestions** — "Use this model for code, this one for creative writing"
- **Plain language labels** — Not "GPT-4-turbo" but "Best for complex reasoning"
- **Smart defaults** — Remember what users actually use, not what they say they want

## Chat Histories Are Product Strategy

When we shipped ChatGPT history import, 3,500+ users migrated their conversations in the first week. This taught me:

- **Data portability builds trust** — Users invest time in conversations; let them own that
- **History is context** — Past chats inform future interactions
- **Migration is a feature** — Not a technical afterthought

## The Small Things

The details that users mention unprompted:
- Streaming markdown that renders as it arrives (latency under 200ms)
- Smooth 60fps animations on model switching
- Dark mode that doesn't flash on load
- Keyboard shortcuts for power users

None of these are revolutionary. But together, they make the difference between a tool and a companion.

## What's Next

AI interfaces are still in their infancy. We're figuring out the grammar of human-AI interaction in real-time. The products that win won't just be smarter — they'll be more thoughtful about how they present that intelligence.

The goal isn't to make AI feel human. It's to make AI feel *considered*.
