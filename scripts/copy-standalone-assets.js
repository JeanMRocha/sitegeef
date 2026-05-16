const fs = require("fs");
const path = require("path");

function copyRecursive(source, target) {
  if (!fs.existsSync(source)) {
    return false;
  }

  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(source, target, { recursive: true, force: true });
  return true;
}

const standaloneRoot = path.join(process.cwd(), ".next", "standalone");
const staticSource = path.join(process.cwd(), ".next", "static");
const staticTarget = path.join(standaloneRoot, ".next", "static");
const publicSource = path.join(process.cwd(), "public");
const publicTarget = path.join(standaloneRoot, "public");

let copied = false;

copied = copyRecursive(staticSource, staticTarget) || copied;
copied = copyRecursive(publicSource, publicTarget) || copied;

if (!copied) {
  console.log("[copy-standalone-assets] nothing to copy");
} else {
  console.log("[copy-standalone-assets] static and public assets synced");
}
