# Security policy

## Report a vulnerability

Don't open a public issue. Report it privately: **[Report a vulnerability](https://github.com/jslowack/herdr-ranch/security/advisories/new)** (the repository's Security tab).

Tell us the mod, what an attacker can do, and the steps to reproduce it. You get an answer within a week. We fix it in a private fork, release, then publish the advisory with credit to you, unless you'd rather not be named.

## What counts

The mods run inside Herdr with your shell and your tokens. These are in scope:

- A way to read or leak a Jira, Linear or GitHub token.
- A way for an issue, a pull request or a review comment to run a command on your machine, or to make an agent run one you didn't ask for.
- A way for `install.sh` to write outside the folders it documents.

Bugs in Herdr itself go to Herdr's maintainers.

## Supported versions

Only the latest release gets fixes.
