#!/usr/bin/env node

import { initializeEnv } from "./env/env.js";
import { connectAndPerformOperations } from "./ftp/ftp.js";

let args;

const testing = (value) => {
  console.log(value);
};

// Define an object to map options to handler functions
const optionHandlers = {
  "--option": testing,
  "--test": testing,
  // Add more options and their corresponding handler functions here
};



const handleOptions = () => {
  if (process.argv.length > 2) {
    args = process.argv.slice(2);
  }
  // Parse and handle the command-line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const handler = optionHandlers[arg];

    if (handler) {
      const value = args[i + 1]; // Get the next argument as the value for the option
      handler(value);
      i++; // Skip the next argument since it has been consumed as the value
    }

    // Add more conditions or error handling if needed
  }
}


async function run() {
  handleOptions();
  const ready = await initializeEnv();
  connectAndPerformOperations(ready);
}

run();
