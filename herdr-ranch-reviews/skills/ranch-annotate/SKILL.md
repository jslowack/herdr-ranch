---
name: ranch-annotate
description: Open a Markdown file for review in Herdr (the Reviews mod, beside your pane) and then respond to the returned comments.
allowed-tools: Bash(ranch-review:*)
disable-model-invocation: true
---

# Ranch Annotate

## Review

!`ranch-review annotate $ARGUMENTS`

## Your task

The output above will be one of:

1. The exact text `The user approved.`, or an "Approved with Notes" message. The user approved the file. With notes, read them and carry them into later work: they are guidance, not a request to revise the file. Otherwise acknowledge with one sentence ("Approved.") and stop. Either way, do not begin any work.
2. Empty. The user dismissed the review. Acknowledge with one sentence ("Review dismissed.") and stop. Do not begin any work.
3. Feedback starting with `# File Feedback`. Address it: the user reviewed the file and left comments on specific lines.
4. A `ranch-review:` error saying the file can't be read. The user described what to review in their own words: work out which Markdown file they mean, run `ranch-review annotate <path>` yourself, then handle its output as in 1 to 3.
