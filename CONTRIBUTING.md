# Contributing

Thanks for looking. Issues and pull requests are welcome at [jslowack/herdr-ranch](https://github.com/jslowack/herdr-ranch). One person maintains this in their spare time, so the rules below keep the queue small and the review fast.

By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Report a security problem privately, as [SECURITY.md](SECURITY.md) explains.

## Issue first, then a pull request

1. **Open an issue** with the Bug or Idea form. It gets the `triage` label.
2. **Wait for triage.** The maintainer answers, and removes `triage` when the change is wanted. An issue can also close as `wontfix` or `duplicate`.
3. **Open a pull request** that says `Closes #<issue>`. Fixing a typo or a broken link needs no issue.

A pull request with no accepted issue may be closed without review. That isn't a judgment of the work: it protects your time.

## How a pull request moves

1. **Triage.** A pull request from someone outside the repository starts in triage: its checks don't run until the maintainer has read the diff and clicks **Approve and run workflows**. CI runs the code in the pull request, so the maintainer reads changes to `.github/`, `install.sh` and `tests/package.json` with extra care.
2. **Checks.** `test`, `install (ubuntu-latest)` and `install (macos-latest)` must pass before a merge.
3. **Review.** Expect an answer within a week. Answer the comments with new commits; don't force-push during a review.
4. **Merge.** The maintainer squash-merges with a [Conventional Commits](https://www.conventionalcommits.org) title, such as `fix(issues): keep the filter after a refresh`.

A pull request that waits on its author for 30 days is closed. Reopen it when you're back.

## Rules

- **One change per pull request.** A fix and a refactor are two pull requests.
- **Tests for logic.** New or changed logic gets a test in `tests/`.
- **Docs move with the code.** Update the mod's `RECIPE.md`, `docs/` and `CHANGELOG.md` when users notice the change.
- **Read only.** The mods don't write to Jira, Linear or GitHub. A change that adds a write needs an issue that agrees to it first.
- **No secrets.** Tokens only in the system's credential store or environment variables. Never commit a token, a real issue's content, or a screenshot that shows either.
- **No new dependencies** in a mod without an issue that agrees to it. A mod runs inside Herdr, with no install step.
- **AI agents are welcome, you're still the author.** Say in the pull request that you used one. Read, run and understand every line before you ask for a review.
- **Your contribution is MIT licensed,** like the rest of the repository.

## How the repository is laid out

- **One folder per mod** (`herdr-ranch-issues`, `herdr-ranch-prs`, `herdr-ranch-reviews`, `mod-buttons`), each with:
  - `RECIPE.md`: the brief another agent builds the mod from (what you see, how it behaves, what it's built from, when it's done). Keep it in step with the code.
  - `mods/<name>/`: the mod itself, as Herdr loads it.
  - `keys.json`: its keys, for users to merge into their own.
- **`shared/`:** code the Issues and Pull requests mods share. A mod can't import outside its own folder, so each mod keeps a copy. Edit the file in `shared/`, then copy it over the copies in `*/mods/*/`. `install.sh` and CI fail or warn on a stale copy.
- **`install.sh`:** links the mods into Herdr's mods folder (flags in [docs/reference.md](docs/reference.md#installsh-flags)).
- **`docs/`:** the [guide](docs/guide.md), the [reference](docs/reference.md), [Connect Jira](docs/connect-jira.md) and the images.
- **`tests/`:** logic tests under `node --test`, with stubs for Herdr's built-in modules (`herdr`, `gpui-kit`, `gpui-base`) in `tests/stubs/`.
- **[NOTES.md](NOTES.md):** what we learned about Herdr's render limits along the way.

## Working on a mod

1. Clone, then `./install.sh --layout`: the mods are linked, so an edit here hot-reloads in Herdr. The layout is copied: rerun `./install.sh --layout` after changing `mod-buttons`.
2. `herdr-app check ~/.config/herdr-app/mods/<name>` checks a mod.
3. Change `shared/` first, then copy it into each mod.

## Tests

```sh
cd tests && npm test
```

CI runs the tests, checks that every mod file parses (`node --check`), that the copies of `shared/` match, and runs `shellcheck` and a smoke test of `install.sh` on Linux and macOS.

Test the pure logic (grouping, parsing, prompts, sites); the UI isn't tested. Import the module from its mod folder; the stubs answer `exec`, `fetch` and files through `state` in `tests/stubs/herdr.mjs`.

## Style

- Plain, short sentences in docs and comments.
- No em dashes or en dashes in prose, comments or strings: use a colon, a comma, parentheses or two sentences.
- Read only toward Jira, Linear and GitHub: the mods don't write to them.
- Tokens only in the system's credential store or environment variables, never in Herdr's settings or on a command line.
- Add a line to [CHANGELOG.md](CHANGELOG.md) for a change users notice.
