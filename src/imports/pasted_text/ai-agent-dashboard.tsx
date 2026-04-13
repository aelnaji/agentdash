Build a **dark-theme AI Agent Operations Dashboard** as a self-contained React + Tailwind CSS + shadcn/ui single-page app. All data is mock/static. Use `useState`, `useEffect`, `setInterval` for interactivity. Background: `#0d0f12`.

---

## LAYOUT — 3-column flex, full viewport height

---

### LEFT SIDEBAR — `w-64`

**Top nav**: Headquarters (active) · Tasks · Inbox · Files · Settings · Marketplace

**Action buttons**:
- `+ Add Agent` → opens Add Agent modal (see below)
- ⚙ Settings → opens Settings panel (see below)
- ⏸ Pause / ▶ Resume Business (toggle)

**Agent Roster** — the core of the sidebar:

Each agent row shows:
- **Status light** (left dot, 10px circle):
  - Pulsing GREEN = agent actively working
  - Pulsing RED/AMBER (alarm) = CEO has sent an unread question to this agent
  - GREY = idle
- Agent avatar circle (initials)
- Agent name + role
- Current task snippet (truncated)
- Small "CEO calling" badge (teal outline pill) that appears only when the CEO has actively selected/called this agent

Default agents:
```
AGENT-LEAD       | Technical Lead    | Task: Reviewing architecture plan
AGENT-BACKEND    | Backend Engineer  | Task: Designing database schema
AGENT-FRONTEND   | Frontend Engineer | Task: Building React component tree
AGENT-QA         | QA Engineer       | Task: Writing test coverage plan
```
All start as GREEN (working). Clicking a row selects the agent and opens their chat in the right panel.

---

### CENTER CANVAS — `flex-1`

**Top bar**: Date + time (live) · `● LIVE` badge · Team count · Active tasks · Utilization bar

**Agent Node Graph** (SVG, position: relative container, dot-grid bg):

Nodes arranged in a circle. CEO node sits at the bottom-center as a distinct gold hexagon/diamond shape labeled "CEO".

Each agent = circle node (64px), teal ring, initials avatar, name + role below.

**Visual behaviors**:
- When CEO "calls" an agent: an animated dashed line pulses from CEO node → that agent node. The agent node ring glows/pulses in gold.
- When agent has a pending CEO question (alarm): node ring turns red and pulses.
- When agent is working normally: node ring is steady teal with a slow breathing animation.
- All idle agents: grey ring, no animation.

Clicking any agent node = same as clicking their sidebar row (selects them, opens chat).

**Live Activity Feed** (bottom strip, monospace, auto-scrolls):
```
[12:43:41]  TOOL – Backend Agent: Ran command
[12:43:44]  TOOL – QA Agent: Read file
[12:43:47]  TOOL – Lead Agent: Found files
```
New mock entries append every 4 seconds. `TOOL` = teal pill. Feed pauses when Business is Paused.

---

### RIGHT PANEL — `w-96`

#### Top: Agent Selector + Status
Dropdown to select any agent. Shows selected agent's:
- Name, role, current task
- Status indicator (working / idle / CEO calling / alarm)

#### Chat Window (main area, scrollable)
Message bubbles:
- CEO messages: right-aligned, gold/amber bg
- Agent responses: left-aligned, dark card bg, agent avatar

**Behavior**:
- CEO types a message and sends → it appears as a CEO bubble
- If the message ends with `?` → it is flagged as a QUESTION:
  - The selected agent's status light turns RED (alarm) in sidebar and on the node graph
  - A notification badge appears on the agent row
  - After 3 seconds, a simulated auto-reply appears from the agent, and the alarm clears → light returns GREEN
- If the message does NOT end with `?` → it is treated as a directive:
  - Agent's node briefly pulses gold ("CEO calling" state for 2 seconds)
  - Then returns to green working state
  - Simulated agent acknowledgment appears after 2 seconds

**Input area** (bottom of chat):
- Agent selector dropdown (synced with top selector)
- Text input: placeholder "Message agent…"
- Send button
- Small legend below: `● Working  ● CEO Calling  ● Question Pending  ● Idle`

---

## ADD AGENT MODAL

Triggered by `+ Add Agent` button. Centered modal overlay.

Fields:
- Agent Name (text input)
- Role / Title (text input)
- Specialization (select: Backend · Frontend · QA · DevOps · Data · Research · Custom)
- Initial Task Description (textarea)
- Status on create (toggle: Active / Idle)

On submit: new agent appears in sidebar roster, on node graph (new node inserted), and in chat dropdown. New active agents start with green light.

---

## SETTINGS PANEL

Slide-in right drawer (or modal). Sections:

**General**
- Dashboard name (text input, default: "AI Operations HQ")
- CEO name (text input, default: "CEO")
- Auto-reply delay: slider 1–10 seconds

**Notifications**
- Toggle: Enable alarm lights (default ON)
- Toggle: Sound on question (default OFF — show as disabled/greyed)
- Toggle: Auto-clear alarms after reply (default ON)

**Display**
- Toggle: Show Live Feed (default ON)
- Toggle: Animate node connections (default ON)
- Toggle: Show task snippets in sidebar (default ON)

**Danger Zone**
- "Reset All Agents" button (red, clears added agents, resets to defaults)

---

## STYLE TOKENS

```
bg-primary:    #0d0f12
bg-card:       #161a1f
bg-hover:      #1e2329
border:        rgba(255,255,255,0.08)
accent-teal:   #00c9a7
accent-gold:   #f5a623
accent-red:    #ef4444
text-primary:  #e8eaed
text-muted:    #6b7280
font-mono:     'JetBrains Mono', monospace
```

**Status light CSS**:
```css
.light-green { background: #22c55e; box-shadow: 0 0 6px #22c55e; animation: pulse 2s infinite; }
.light-red   { background: #ef4444; box-shadow: 0 0 8px #ef4444; animation: pulse 0.8s infinite; }
.light-grey  { background: #4b5563; }
```

---

## KEY INTERACTIONS SUMMARY

| Action | Effect |
|---|---|
| Click agent (sidebar or node) | Selects agent, opens their chat |
| Send message ending in `?` | Alarm light ON → auto-reply after delay → alarm OFF |
| Send message (no `?`) | CEO calling badge ON for 2s → agent ack reply |
| Add Agent | New node + row, green light, in chat dropdown |
| Pause Business | All lights → grey, feed pauses, nodes stop animating |
| Settings change | Live-updates dashboard behavior |
| Reset All Agents | Restores 4 default agents only |