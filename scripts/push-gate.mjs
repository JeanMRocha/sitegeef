#!/usr/bin/env node

const approved = process.env.GEEF_PUSH_APPROVED === "1";
const reason = (process.env.GEEF_PUSH_APPROVAL_REASON || "").trim();

if (!approved || reason.length === 0) {
  console.error(
    [
      "Push blocked by manual gate.",
      "Set GEEF_PUSH_APPROVED=1 and GEEF_PUSH_APPROVAL_REASON before pushing.",
      "Example:",
      '  $env:GEEF_PUSH_APPROVED="1"; $env:GEEF_PUSH_APPROVAL_REASON="reviewed and approved"; git push',
    ].join("\n"),
  );
  process.exit(1);
}

console.log(`Push approved: ${reason}`);
