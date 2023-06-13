#!/usr/bin/env node

// scripts
import { initializeEnv } from "./env/env.js";
import { connectAndPerformOperations } from "./ftp/ftp.js";

// options
import { handleOptions } from "./options/options.js";
import { abort, deleteRemote } from "./options/optionsHandlers.js";

// main function
async function run() {
  handleOptions();

  const ftpOptions = {
    envCheck: false,
    deleteRemote: deleteRemote,
  }

  if (abort) return;
  if (process.env.SKIP_ENV_SETUP) {
    ftpOptions.envCheck = true;
    connectAndPerformOperations(ftpOptions);
    return;
  }
  ftpOptions.envCheck = await initializeEnv();
  connectAndPerformOperations(ftpOptions);
}

run();
