# Ryuna AI

A polished, modern AI chat web application. This milestone is a **frontend-only**
shell: the full interface is real, while AI responses, uploads, and search use
realistic mock state so every screen can be demonstrated.

> Simple on the surface, powerful underneath.

## Features

- ChatGPT-style chat interface with Ryuna's own visual identity
- Conversation sidebar grouped by Today / Yesterday / Previous 7 days / Older
- Search, rename, pin, delete conversations (with confirmation)
- Mobile drawer navigation and a dedicated mobile header
- Rich assistant messages: markdown, headings, lists, tables, links, inline
  code, and syntax-highlighted code blocks with copy buttons
- Message actions: copy, regenerate, like/dislike, more; user message editing
- Composer with attachment, image, and voice placeholders, model selector,
  stop-generation, and multiline support
- Polished states: empty, generating ("Ryuna is thinking"), error + retry,
  offline
- Compact AI model selector architected around a provider/model registry
- Settings dialog: theme, chat behavior, default model, response style,
  compact mode, animations, clear data
- Light / dark / system theme with persisted preference
- Local persistence for conversations, settings, and model via `localStorage`
- Responsive from 320px phones up to large desktops with comfortable targets

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4
- Radix UI primitives (dialog, dropdown, switch, tooltip) styled shadcn-style
- Lucide icons
- `react-markdown` + `remark-gfm` + `rehype-highlight`

No backend, database, authentication, or AI provider calls are implemented yet.

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000.

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Quality checks:

```bash
npm run lint
npm run typecheck
```

## Project structure

```text
src/
├── app/                 # App Router entry (layout + page)
├── components/
│   ├── chat/            # ChatContainer, MessageList, messages, composer, states
│   ├── sidebar/         # Sidebar, conversation list/item, search
│   ├── layout/          # AppShell, mobile header + drawer
│   ├── model/           # ModelSelector
│   ├── settings/        # SettingsDialog and rows
│   ├── providers/       # Theme + app providers
│   ├── brand/           # Ryuna logo/mark
│   └── ui/              # shadcn-style primitives
├── hooks/               # media query, auto-scroll, debounce, online status
├── lib/
│   ├── chat/            # store, providers registry, mock data, messages
│   ├── storage/         # localStorage layer + persistence
│   └── utils/           # cn, ids, dates/grouping
└── types/               # domain + future-facing provider interfaces
```

## Future integration points

The data layer is intentionally thin so later milestones can swap in real
backends without reshaping the UI:

- `lib/chat/providers.ts` models `AIProvider` / `AIModel` registries for
  OpenAI-compatible, OpenRouter, Gemini, Anthropic, and custom endpoints
- `lib/storage/*` isolates all persistence behind plain functions
- `types/` includes attachments, capabilities, streaming status, and message
  metadata ready for streaming, file uploads, vision, tools, and sync

## Notes

- Responses are simulated locally in `lib/chat/mock-data.ts`.
- Type `/error` in the composer to preview the error/retry state.
- Attachment, image, and voice buttons are UI placeholders ("Coming soon").
