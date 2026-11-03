// Stacks of dependent pull requests, found in the list itself: a pull request whose base is
// another open pull request's head sits on top of it. Works for `gh stack` stacks and for
// stacks made by hand. Worked out once per load, never in a render.

// Only open pull requests of this repository: a fork's "fix" isn't the layer below, and a
// merged layer is no longer part of what still has to merge.
const member = (pr) => pr.state === "OPEN" && !pr.fork;

const isReady = (pr) => !pr.isDraft && pr.reviewDecision === "APPROVED" && pr.checks.fail === 0 && pr.checks.pending === 0;

// What keeps a layer from merging, checked in this order.
function blockerOf(pr) {
  if (pr.isDraft) return `#${pr.number} is a draft`;
  if (pr.checks.fail > 0) return `#${pr.number} ✗ ${pr.checks.fail} blocks merge`;
  if (pr.reviewDecision === "CHANGES_REQUESTED") return `#${pr.number} changes requested`;
  if (pr.checks.pending > 0) return `#${pr.number} checks running`;
  return `#${pr.number} waits on review`;
}

// The group of the least ready layer: your review first, then yours to fix, then ready only
// when every layer is.
function groupOf(prs) {
  const gs = new Set(prs.map((p) => p.group));
  if (gs.has("review")) return "review";
  if (gs.has("fix")) return "fix";
  return prs.every((p) => p.group === "ready") ? "ready" : "open";
}

// stacks(prs) -> [{ key, name, trunk, layers: [{ number, level }], group, blocker }], layers
// bottom first (depth-first, children by number), level from 1.
export function stacks(prs) {
  const open = prs.filter(member);
  const byHead = new Map(open.map((p) => [p.headRefName, p]));
  const children = new Map();
  for (const p of open) {
    const parent = byHead.get(p.baseRefName);
    if (parent && parent !== p) children.set(parent.number, [...(children.get(parent.number) ?? []), p]);
  }
  for (const list of children.values()) list.sort((a, b) => a.number - b.number);
  // A root's base is no open head; pull requests in a base cycle have no root and stay loose.
  const roots = open.filter((p) => !byHead.has(p.baseRefName) || byHead.get(p.baseRefName) === p).sort((a, b) => a.number - b.number);
  const out = [];
  for (const root of roots) {
    const layers = [], seen = new Set();
    const walk = (p, level) => {
      if (seen.has(p.number)) return;
      seen.add(p.number); layers.push({ pr: p, level });
      for (const c of children.get(p.number) ?? []) walk(c, level + 1);
    };
    walk(root, 1);
    if (layers.length < 2) continue;
    const members = layers.map((l) => l.pr);
    const first = members.find((p) => !isReady(p));
    out.push({
      key: `stack-${root.number}`, name: root.title, trunk: root.baseRefName,
      layers: layers.map((l) => ({ number: l.pr.number, level: l.level })),
      group: groupOf(members), blocker: first ? blockerOf(first) : "ready to merge",
    });
  }
  return out;
}

// The stack each pull request is a layer of.
export function stackOf(list) {
  const m = new Map();
  for (const s of list) for (const l of s.layers) m.set(l.number, s);
  return m;
}
