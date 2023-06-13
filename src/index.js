#!/usr/bin/env node

// scripts
import { initializeEnv } from "./env/env.js";
import { connectAndPerformOperations } from "./ftp/ftp.js";

// options
import { handleOptions } from "./options/options.js";
import { abort, skip } from "./options/optionsHandlers.js";

// main function
async function run() {
  handleOptions();
  if (abort) return;
  if (skip) {
    connectAndPerformOperations(true);
    return;
  }
  const ready = await initializeEnv();
  connectAndPerformOperations(ready);
}

run();
