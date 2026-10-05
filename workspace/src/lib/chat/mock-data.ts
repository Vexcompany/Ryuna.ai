import type { ChatMessage, Conversation } from "@/types";
import { DEFAULT_MODEL_ID } from "@/lib/chat/providers";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

interface Seed {
  id: string;
  title: string;
  age: number;
  updatedAge: number;
  modelId?: string;
  messages: Array<Omit<ChatMessage, "id" | "createdAt" | "status">>;
}

const SEEDS: Seed[] = [
  {
    id: "conv_quantum",
    title: "Explain quantum computing simply",
    age: 46 * MINUTE,
    updatedAge: 44 * MINUTE,
    messages: [
      {
        role: "user",
        content: "Can you explain quantum computing in a way that's easy to understand?",
      },
      {
        role: "assistant",
        modelId: "ryuna-1",
        content: `## Quantum computing, minus the math

Classical computers store information as **bits**, each being either \`0\` or \`1\`. A quantum computer uses **qubits**, which can exist in a blend of both at once.

### The three ideas that matter

1. **Superposition** - a qubit holds many possibilities until you measure it.
2. **Entanglement** - qubits can be linked so their outcomes stay correlated.
3. **Interference** - good paths amplify, wrong paths cancel out.

> Think of a classical computer as checking every maze corridor one at a time. A quantum computer explores many corridors at once, then uses interference to make the correct exit "louder".

### A tiny comparison

| Concept | Classical | Quantum |
| --- | --- | --- |
| Unit | Bit | Qubit |
| State | 0 or 1 | Superposition |
| Best at | Everyday tasks | Optimization, simulation |

Quantum computers are **not** faster at everything - they shine on specific problems like factoring large numbers or simulating molecules. You can read more on [Wikipedia](https://en.wikipedia.org/wiki/Quantum_computing).

Want me to go deeper on any of these?`,
      },
    ],
  },
  {
    id: "conv_email",
    title: "Draft a product update email",
    age: 3 * HOUR,
    updatedAge: 2 * HOUR,
    messages: [
      { role: "user", content: "Help me write a short email announcing our new dark mode." },
      {
        role: "assistant",
        modelId: "ryuna-1",
        content: `Here's a friendly, concise draft you can drop straight into your mail client:

**Subject:** Dark mode is here

Hi everyone,

Our new **dark mode** is live today. It softens contrast for late-night sessions and follows your system theme automatically.

- Enable it from **Settings -> Appearance**
- Your choice is remembered on every device
- Light and system modes still work exactly as before

Thanks for the feedback that shaped this release - keep it coming.

Best,
The Team`,
      },
      { role: "user", content: "Make it even shorter." },
      {
        role: "assistant",
        modelId: "ryuna-1",
        content: `**Subject:** Dark mode is live

Dark mode just shipped. Turn it on in **Settings -> Appearance** and we'll remember your choice. Reply with any feedback!`,
      },
    ],
  },
  {
    id: "conv_rsc",
    title: "Server vs Client Components in React",
    age: 1 * DAY + 2 * HOUR,
    updatedAge: 1 * DAY + HOUR,
    messages: [
      { role: "user", content: "When should I use a Server Component versus a Client Component?" },
      {
        role: "assistant",
        modelId: "gpt-5",
        content: `### Quick rule of thumb

Use a **Server Component** by default. Reach for a **Client Component** only when you need interactivity.

\`\`\`tsx
// Server Component (default)
export default async function Page() {
  const posts = await getPosts(); // data access stays on the server
  return <PostList posts={posts} />;
}
\`\`\`

Reasons to mark a file with \`"use client"\`:

1. Local state or event handlers
2. Browser-only APIs such as \`localStorage\`
3. Third-party hooks that rely on effects

Server Components keep the client bundle small, while Client Components power anything that responds to the user.`,
      },
    ],
  },
  {
    id: "conv_kyoto",
    title: "Plan a 3-day Kyoto itinerary",
    age: 4 * DAY,
    updatedAge: 4 * DAY,
    modelId: "gemini-2.5-pro",
    messages: [
      { role: "user", content: "Plan a relaxed 3-day trip to Kyoto focused on food and temples." },
      {
        role: "assistant",
        modelId: "gemini-2.5-pro",
        content: `## A relaxed Kyoto long weekend

**Day 1 - East side**
- Morning: **Fushimi Inari** before the crowds
- Afternoon: **Kiyomizu-dera** and the Higashiyama lanes
- Dinner: tofu kaiseki in **Gion**

**Day 2 - Arashiyama**
- Bamboo grove at sunrise
- Riverboat lunch on the **Katsura River**
- Evening soak at a local sento

**Day 3 - Central Kyoto**
- **Nishiki Market** food crawl
- **Nijo Castle** gardens
- Tea ceremony experience

Budget roughly \`¥18,000-25,000\` per day for food and transit.`,
      },
    ],
  },
  {
    id: "conv_postgres",
    title: "Flaky Postgres index usage",
    age: 12 * DAY,
    updatedAge: 12 * DAY,
    modelId: "claude-sonnet",
    messages: [
      { role: "user", content: "A query sometimes ignores its index. Why would that happen?" },
      {
        role: "assistant",
        modelId: "claude-sonnet",
        content: `The planner is deciding the index isn't worth it for that particular plan. Common causes:

1. **Stale statistics** - run \`ANALYZE\` on the table.
2. **Low selectivity** - if the filter matches most rows, a sequential scan is cheaper.
3. **Type mismatch** - comparing a \`text\` column to a \`uuid\` can silently disable the index.
4. **Parameter sniffing** - a generic plan may be chosen regardless of values.

Start by inspecting the actual plan:

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM events WHERE account_id = $1;
\`\`\``,
      },
    ],
  },
  {
    id: "conv_brand",
    title: "Name ideas for a coffee brand",
    age: 26 * DAY,
    updatedAge: 26 * DAY,
    messages: [
      { role: "user", content: "Give me some name ideas for a minimal third-wave coffee brand." },
      {
        role: "assistant",
        modelId: "ryuna-1",
        content: `A few directions, grouped by feel:

**Calm & minimal:** Ember, Still, Northbound, Half Light

**Craft-forward:** Bloom & Roast, Slow Pour, The Daily Grind Co.

**Place-driven:** Harbor Line, Cedar Row, Market Street Roasters

My favourite for a premium, quiet identity is **Half Light** - it photographs well on packaging and leaves room for a subtle logo mark.`,
      },
    ],
  },
];

function buildMessages(
  seed: Seed,
  conversationUpdatedAt: number,
): ChatMessage[] {
  const count = seed.messages.length;
  return seed.messages.map((message, index) => ({
    ...message,
    id: `${seed.id}_msg_${index}`,
    createdAt:
      conversationUpdatedAt - (count - 1 - index) * (MINUTE + 5 * 1000),
    status: "complete" as const,
  }));
}

export function createSeedConversations(now: number = Date.now()): Conversation[] {
  return SEEDS.map((seed) => {
    const updatedAt = now - seed.updatedAge;
    return {
      id: seed.id,
      title: seed.title,
      messages: buildMessages(seed, updatedAt),
      createdAt: now - seed.age,
      updatedAt,
      modelId: seed.modelId ?? DEFAULT_MODEL_ID,
    };
  });
}

const GENERIC_REPLIES: string[] = [
  `Great question - here's how I'd approach it.

### A simple plan

1. **Clarify the goal** - what does success look like?
2. **Break it down** - split the work into the smallest useful steps.
3. **Start small** - ship one piece, learn, then expand.

\`\`\`text
small step -> feedback -> refine -> next step
\`\`\`

Tell me more and I can tailor this to your situation.`,
  `Here's a concise take.

- The core idea is easy to grasp once you separate **what** from **how**.
- Start with the smallest version that could work, then iterate.
- Keep the feedback loop short so mistakes stay cheap.

Want me to expand any of these points into detail?`,
  `### Here's my answer

I'd frame this around three questions:

| Question | Why it matters |
| --- | --- |
| What problem? | Keeps scope honest |
| Who benefits? | Guides priorities |
| What's next? | Turns ideas into action |

If you share a bit more context, I'll get specific.`,
];

let replyCursor = 0;

export function getMockReply(prompt: string): string {
  const lower = prompt.toLowerCase();
  const wordCount = lower.trim().split(/\s+/).length;

  if (/(code|function|bug|typescript|react|python|javascript|hello world)/.test(lower)) {
    return `Here's a small, focused example to get you moving:

\`\`\`ts
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait = 200,
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
\`\`\`

Use \`debounce\` around anything you don't want firing on every keystroke. Want me to adapt it for your exact case?`;
  }
  if (/(email|write|draft|message)/.test(lower)) {
    return `Here's a clean draft:

**Subject:** Quick update

Hi there,

Thanks for your patience. I wanted to share a short update so we stay aligned.

- What changed
- Why it matters
- What's next

Happy to adjust the tone or length - just say the word.`;
  }
  if (/(plan|itinerary|schedule|trip)/.test(lower)) {
    return `Here's a lightweight plan you can adapt:

**Day 1** - arrive, settle in, low-key dinner nearby
**Day 2** - the main activity, booked in advance
**Day 3** - flexible morning, then travel home

Rule of thumb: one anchor per day, everything else stays optional.`;
  }
  if (wordCount <= 4 && /^(hi|hey|hello|yo|hiya)\b/.test(lower)) {
    return "Hey! I'm Ryuna. Ask me anything - writing, code, planning, or just thinking out loud.";
  }

  const reply = GENERIC_REPLIES[replyCursor % GENERIC_REPLIES.length];
  replyCursor += 1;
  return reply;
}
