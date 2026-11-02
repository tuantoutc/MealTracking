<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# Frontend Rules

## React Form Number Input Guideline
When creating or editing number input fields in React/Next.js:
- NEVER initialize numeric input state as a number `0` with `onChange={(e) => setVal(Number(e.target.value))}`. When the user clears the input with backspace, `Number("")` evaluates to `0`, causing `0` to persist and leading to bugs like `"0200"`.
- ALWAYS store form input state as a string (or `number | ''`).
- In `onChange`, allow empty string `""`, strip leading zeros with `val.replace(/^0+(?=\d)/, '')`, and only parse to number on form submission.
