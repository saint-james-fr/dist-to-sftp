#!/usr/bin/env node

// scripts
import { initializeEnv } from "./env/env.js";
import { connectAndPerformOperations } from "./sftp/sftp.js";
// options
import { handleOptions } from "./options/options.js";

// Logs Messages
import { logger } from "./utils/logger.js";

// main function
async function run() {
  // Defaults Options
  process.env.DELETE_REMOTE = true;

  if (process.argv.length > 2) {
    const args = process.argv.slice(2);
    try {
      handleOptions(args);
    } catch (error) {
      console.error(error.message);
      console.error(logger.stopping);
      process.exit(1);
    }
  }

  if (process.env.SKIP_ENV_SETUP) {
    connectAndPerformOperations(true);
    return;
  }
  const ready = await initializeEnv();
  connectAndPerformOperations(ready);
}

run();
