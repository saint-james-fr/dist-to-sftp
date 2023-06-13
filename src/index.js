#!/usr/bin/env node

// scripts
import { initializeEnv } from "./env/env.js";
import { connectAndPerformOperations } from "./ftp/ftp.js";

// options
import { handleOptions } from "./options/options.js";
import { abort } from "./options/optionsHandlers.js";

// main function
async function run() {
  // Defaults Options
  process.env.DELETE_REMOTE = true;

  handleOptions();
  if (abort) return;

  if (process.env.SKIP_ENV_SETUP) {
    connectAndPerformOperations(true);
    return;
  }
  const ready = await initializeEnv();
  connectAndPerformOperations(ready);
}

run();
