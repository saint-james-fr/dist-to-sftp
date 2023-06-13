#!/usr/bin/env node

import { initializeEnv } from "./env/env.js";
import { connectAndPerformOperations } from "./ftp/ftp.js";

async function run() {
  const ready = await initializeEnv();
  connectAndPerformOperations(ready);
}

run();
