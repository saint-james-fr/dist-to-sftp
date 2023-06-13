#!/usr/bin/env node

import { initializeEnv } from "./env/env.js";
import { connectAndPerformOperations } from "./ftp/ftp.js";
import { handleOptions, skip } from "./options.js";

async function run() {
  handleOptions();
  if (skip) {
    connectAndPerformOperations(true);
    return;
  }
  const ready = await initializeEnv();
  connectAndPerformOperations(ready);
}

run();
