---
name: ranch-last
description: Open your latest message for review in Herdr (the Reviews mod, beside your pane) and use the returned comments to revise it or continue.
allowed-tools: Bash(ranch-review:*)
disable-model-invocation: true
---

# Ranch Last

## Review

!`ranch-review last $ARGUMENTS`

## Your task

The output above will be one of:

1. The exact text `The user approved.`, or an "Approved with Notes" message. The user approved your last message. With notes, read them and carry them into later work: they are guidance, not a request to revise the message. Otherwise acknowledge with one sentence ("Approved.") and stop. Either way, do not begin any work.
2. Empty. The user dismissed the review. Acknowledge with one sentence ("Review dismissed.") and stop. Do not begin any work.
3. Feedback starting with `# Message Feedback`. Address it: the user reviewed your last message and left comments on specific parts of it.
4. A `ranch-review:` error saying the last message can't be read (an agent other than Claude Code or Codex). Run `ranch-review last --stdin` yourself with your last message on stdin, then handle its output as in 1 to 3.
