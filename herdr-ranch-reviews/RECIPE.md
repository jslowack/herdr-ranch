# Reviews · Herdr Ranch

Comment on a Markdown file, or on an agent's last message, in Herdr, and send the comments back to the agent. A native replacement for `plannotator annotate` and `plannotator last`: same skills shape, same feedback text, no browser.

An agent runs `ranch-review annotate <file>` (or `ranch-review last`). The review opens as a dialog over Herdr; the command waits until you send, approve or dismiss, then prints the outcome for the agent.

## What you see

### The review (a dialog)

- **Header:** the file name (or "Last message"), the agent and its state ("agent waiting", "waiting", "sent", "not delivered") and the path, a **Rendered | Source** toggle, **Dismiss**, then **Approve** (no comments) or **Send N comments** (with comments), and **×**. **⌘⇧↵** does what the main button shows. **×** only closes the dialog: the review keeps waiting, with its unsent comments, in the list.
- **The document, left:** rendered Markdown, one row per block (heading, paragraph, list item, code, quote, table). Each list item is its own block. Its source lines and the numbers of its comments (or 👍) show on the right. A click on a block opens a comment on it; a block with a comment opens that comment. Source shows the plain lines.
- **The comments, right:** one card per comment, block comments by line and then by when they were added, general comments last. A click on a card edits it and outlines its block. **+ General comment** for the whole document.
- **The comment box:** a text area (⌘↵ saves, ⌘⇧↵ saves and sends), **👍 Looks good** (block comments: adds Plannotator's quick label instead), **Cancel**, **Save**. ⌘V with an image on the clipboard adds a screenshot as a thumbnail (× removes it); the agent gets its path.
- **After sending:** the dialog closes. When the agent didn't take the feedback, the review shows "not delivered" with **Copy feedback**.

### The list (the Reviews button)

- **Header:** "Reviews", the shown space's name (or "every space"), **This space | All** (remembered), a cog, ↻, and × when open as a window. A review is in a space when its agent runs there, or its folder is the space's folder or inside it.
- **Waiting on you:** open reviews, newest first, with what, the agent, and "asked 5m ago". A click opens the review.
- **Sent:** the newest sent reviews (as many as the cog says), with "done 1h ago" and their comment count. Approved and dismissed reviews are not listed.
- **×** on a row turns into a red confirm (**Dismiss** for an open review, **Remove** for a sent one) with **Cancel**.
- **Button count** (mod-buttons): open reviews, through `shared("mod-badges")["herdr-ranch-reviews"]`.

### The cog

**New review:** Open it (the dialog opens at once) | Notify only (a toast that opens the list, and the count). **Sent shown:** None | 10 | 25 | 50. Stored in `shared("mod-settings")["herdr-ranch-reviews"]` (`open`, `sent`, `scope`).

**Keys:** Cmd+Shift+I opens Reviews (`keys.json`).

**Needs:** Node.js 18+ for the CLI, and macOS for screenshots (AppleScript reads the clipboard). Optional: the [mod-buttons](../mod-buttons/RECIPE.md) layout for the **Reviews** button.

## How it behaves

- **`ranch-review annotate <file> [--json]`** and **`ranch-review last [--stdin] [--json]`** (`bin/ranch-review.mjs`, linked to `~/.local/bin` by `install.sh`). The skills `/ranch-annotate` and `/ranch-last` (`skills/`, linked to `~/.claude/skills`) run them, like Plannotator's skills.
- **The agent:** `HC_TERMINAL_ID` names its terminal; `herdr-app ls` gives its pane, app, space and tab. When `ls` answers nothing, the focused pane is used.
- **A review** is a JSON file in `~/.config/herdr-app/data/herdr-ranch-reviews/<id>.json`: the text, the agent, `status` (open, sent, approved, dismissed), the unsent comments (`draft`), the result, and the waiting CLI's process id. Screenshots go to `img/` next to it.
- **Opening:** the CLI runs `herdr-app do pane.split` with `{ mod, props: { launch } }` beside the agent; that pane opens the dialog (1240 px wide, 90% high), or with Notify only posts the toast, and closes itself.
- **⌘⇧↵:** a key binding (`cx.bind_keys`, context `RanchReview`) to the action `ranch_review_send`, so it works inside the comment box too.
- **Delivery:** the CLI checks the file every 400 ms and prints the outcome when it changes: the feedback, "The user approved.", or nothing (dismissed); `--json` prints `{ decision, feedback, annotationCount }`. When the CLI no longer runs, the mod pastes "I reviewed … in Herdr." plus the feedback into the agent's terminal (`hc send --if idle`, retried for 2 minutes); if that fails too, the review shows "not delivered".
- **Feedback text:** Plannotator's format (`# File Feedback`, `## 1. (lines 3-4) Feedback on: "…"`, `> comment`, `> Screenshot: <path>`, `---`), so skills and agents that know Plannotator's output keep working.
- **The last message:** Claude Code: the session's transcript (`CLAUDE_CODE_SESSION_ID`, else `~/.claude/sessions/<pid>.json`, else the folder's newest transcript), the last assistant message with text. Codex: the newest rollout log under `~/.codex/sessions` for this folder. Anything else: `--stdin`.
- **Clean-up:** each CLI run removes finished reviews and screenshots older than 7 days (`KEEP_DAYS`).
- **Refresh:** `watchFolder` on the reviews folder, and every 30 seconds.

## Built from

- `bin/ranch-review.mjs` (the CLI), `mods/herdr-ranch-reviews/main.js` (the list and the dialog), `mods/herdr-ranch-reviews/reviews.js` (blocks, feedback text, transcripts; shared by both, tested in `tests/reviews.test.mjs`).
- `skills/ranch-annotate/SKILL.md`, `skills/ranch-last/SKILL.md`.
- `mod.json`: `place: none`, a window overlay (70% × 85%), `button: { label: "Reviews", icon: "reviews.svg", opens: "panel", order: 35 }`.
- herdr: `openOverlay`, `closeOverlay`, `run` (`pane.close`), `panes`, `props`, `exec`, `hc`, `readTextFile`, `writeTextFile`, `watchFolder`, `appHome`, `notify`, `shared`, `setShared`, `theme`.
- gpui-base: `TextView.markdown`, `TextareaState` / `Textarea`.

## Watch out

- **Block level only:** text selection is off. Herdr's `TextView` paints its selection over the text, and a mod can't read what's selected.
- **No scroll to a block:** clicking a comment outlines its block but doesn't scroll to it. The only element a mod can scroll from code is a virtual list, which needs a fixed height for every row.
- **Local spaces only:** remote spaces are [#2](https://github.com/jslowack/herdr-ranch/issues/2).
- **No code review:** `plannotator review` has no counterpart.

## Done when

- `herdr-app check mods/herdr-ranch-reviews` passes and `cd tests && npm test` passes.
- `/ranch-annotate README.md` in Claude Code opens the dialog beside the agent; a comment and **Send** return `# File Feedback` to the agent.
- `/ranch-last` opens the agent's last answer; **Approve** returns "The user approved.".
- Stopping the agent's command, then sending, pastes the feedback into its prompt.
