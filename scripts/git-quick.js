#!/usr/bin/env node
"use strict";

const readline = require("readline");
const { spawnSync } = require("child_process");

function runGit(args) {
  const result = spawnSync("git", args, { stdio: "inherit" });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Commento commit: ", (rawMessage) => {
  const message = rawMessage.trim();

  if (!message) {
    console.error("Errore: il commento del commit non puo essere vuoto.");
    rl.close();
    process.exit(1);
  }

  rl.close();

  runGit(["add", "."]);
  runGit(["commit", "-m", message]);
  runGit(["push", "origin", "main"]);
});
