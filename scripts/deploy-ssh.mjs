#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const argv = new Set(process.argv.slice(2));
const dryRun = argv.has("--dry-run");
const skipBuild = argv.has("--skip-build");

const deploy = {
  host: requiredEnv("DEPLOY_HOST"),
  user: requiredEnv("DEPLOY_USER"),
  path: requiredEnv("DEPLOY_PATH"),
  port: Number(process.env.DEPLOY_PORT || 22),
  keyPath: process.env.DEPLOY_KEY_PATH?.trim() || "",
  service: process.env.DEPLOY_SERVICE?.trim() || "sitegeef",
};

if (!Number.isInteger(deploy.port) || deploy.port <= 0) {
  fail(`Invalid DEPLOY_PORT: ${process.env.DEPLOY_PORT || ""}`);
}

const repoRoot = process.cwd();
const localArchives = [];
process.on("exit", () => {
  for (const archive of localArchives) {
    try {
      fs.rmSync(archive, { force: true });
    } catch {
      // Ignore cleanup failures.
    }
  }
});
const buildArtifacts = [
  {
    label: "standalone",
    sourceDir: path.join(repoRoot, ".next", "standalone"),
    archive: path.join(os.tmpdir(), `sitegeef-standalone-${Date.now()}.tar.gz`),
    remote: "standalone",
    contents: ".",
  },
  {
    label: "static",
    sourceDir: path.join(repoRoot, ".next"),
    archive: path.join(os.tmpdir(), `sitegeef-static-${Date.now()}.tar.gz`),
    remote: "standalone/.next",
    contents: "static",
  },
  {
    label: "public",
    sourceDir: path.join(repoRoot, "public"),
    archive: path.join(os.tmpdir(), `sitegeef-public-${Date.now()}.tar.gz`),
    remote: "standalone/public",
    contents: ".",
  },
];

if (!skipBuild) {
  run("npm", ["run", "build"], { cwd: repoRoot });
}

for (const artifact of buildArtifacts) {
  if (!fs.existsSync(artifact.sourceDir)) {
    fail(`Missing build artifact: ${artifact.sourceDir}`);
  }
  run("tar", ["-C", artifact.sourceDir, "-czf", artifact.archive, artifact.contents], {
    cwd: repoRoot,
  });
  localArchives.push(artifact.archive);
}

const remoteTmpDir = `/tmp/sitegeef-deploy-${Date.now()}`;
const liveDir = `${deploy.path}/standalone`;
const stageDir = `${deploy.path}/standalone.next`;
const backupDir = `${deploy.path}/standalone.prev`;

const sshBaseArgs = [
  "-p",
  String(deploy.port),
  "-o",
  "BatchMode=yes",
];

if (deploy.keyPath) {
  sshBaseArgs.push("-i", deploy.keyPath);
}

if (dryRun) {
  console.log(
    JSON.stringify(
      {
        deploy,
        remoteTmpDir,
        liveDir,
        stageDir,
        backupDir,
        artifacts: buildArtifacts.map(({ label, sourceDir, archive, remote }) => ({
          label,
          source: sourceDir,
          archive,
          remote,
        })),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

run("ssh", [...sshBaseArgs, `${deploy.user}@${deploy.host}`, `mkdir -p ${shellQuote(remoteTmpDir)}`], {
  cwd: repoRoot,
});

for (const artifact of buildArtifacts) {
  const remotePath = `${remoteTmpDir}/${path.basename(artifact.archive)}`;
  run(
    "scp",
    [
      "-P",
      String(deploy.port),
      "-o",
      "BatchMode=yes",
      ...(deploy.keyPath ? ["-i", deploy.keyPath] : []),
      artifact.archive,
      `${deploy.user}@${deploy.host}:${remotePath}`,
    ],
    { cwd: repoRoot },
  );

  artifact.remoteArchive = remotePath;
}

const remoteScript = [
  "set -e",
  `service_name=${shellQuote(deploy.service)}`,
  `remote_tmp_dir=${shellQuote(remoteTmpDir)}`,
  `live_dir=${shellQuote(liveDir)}`,
  `stage_dir=${shellQuote(stageDir)}`,
  `backup_dir=${shellQuote(backupDir)}`,
  "cleanup() {",
  "  rm -rf \"$remote_tmp_dir\"",
  "}",
  "trap cleanup EXIT",
  "rm -rf \"$stage_dir\"",
  "mkdir -p \"$stage_dir\" \"$stage_dir/.next\" \"$stage_dir/public\"",
  ...buildArtifacts.map((artifact) => {
    const targetDir = artifact.remote === "standalone"
      ? "$stage_dir"
      : artifact.remote === "standalone/.next"
        ? "$stage_dir/.next"
        : "$stage_dir/public";
    return `tar -xzf ${shellQuote(`${remoteTmpDir}/${path.basename(artifact.archive)}`)} -C ${targetDir}`;
  }),
  `sudo -n systemctl stop "$service_name"`,
  'if [ -d "$live_dir" ]; then rm -rf "$backup_dir"; mv "$live_dir" "$backup_dir"; fi',
  'mv "$stage_dir" "$live_dir"',
  'if ! sudo -n systemctl start "$service_name"; then',
  '  echo "failed to start service after deploy, restoring previous release" >&2',
  '  rm -rf "$live_dir"',
  '  if [ -d "$backup_dir" ]; then',
  '    mv "$backup_dir" "$live_dir"',
  '    sudo -n systemctl start "$service_name"',
  '  fi',
  '  exit 1',
  'fi',
  "for _ in 1 2 3 4 5 6 7 8 9 10; do",
  '  if curl -fsS --max-time 5 http://127.0.0.1:3500 >/dev/null; then',
  '    rm -rf "$backup_dir"',
  "    exit 0",
  "  fi",
  "  sleep 3",
  "done",
  'echo "Origin did not become ready on localhost:3500" >&2',
  'exit 1',
].join("\n");

run("ssh", [...sshBaseArgs, `${deploy.user}@${deploy.host}`, remoteScript], {
  cwd: repoRoot,
});

console.log(
  [
    "Deploy concluido com sucesso.",
    `Host: ${deploy.user}@${deploy.host}`,
    `Service: ${deploy.service}`,
    `Path: ${deploy.path}`,
  ].join("\n"),
);

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    fail(`Missing required environment variable: ${name}`);
  }
  return value;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    fail(`${command} failed with exit code ${result.status ?? "unknown"}`);
  }
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
