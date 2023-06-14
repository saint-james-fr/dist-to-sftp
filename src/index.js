#!/usr/bin/env node

// scripts
import { initializeEnv } from "./env/env.js";
import { connectAndPerformOperations } from "./sftp/sftp.js";

// options
import { handleOptions } from "./options/options.js";

// main function
async function run() {
  // Defaults Options
  process.env.DELETE_REMOTE = true;

  if (process.argv.length > 2) {
    const args = process.argv.slice(2);
    handleOptions(args);
  }

  if (process.env.SKIP_ENV_SETUP) {
    connectAndPerformOperations(true);
    return;
  }
  const ready = await initializeEnv();
  connectAndPerformOperations(ready);
}

run();
