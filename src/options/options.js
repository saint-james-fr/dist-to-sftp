import { helpHandler, skipHandler } from "./optionsHandlers.js";

let args;
export const options = {};

// Generate option objects using the createOption helper function
createOption(["-h", "--help"], helpHandler, "Shows this message");
createOption(["-s", "--skip"], skipHandler, "Skips the .env file setup");

export const handleOptions = () => {
  if (process.argv.length > 2) {
    args = process.argv.slice(2);
  }
  // Parse and handle the command-line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const option = options[arg];

    if (option) {
      const handler = option.handler;
      const hasValue = option.hasOwnProperty("value");

      if (hasValue) {
        const value = args[i + 1]; // Get the next argument as the value for the option
        handler(value);
        i++; // Skip the next argument since it has been consumed as the value
      } else {
        handler();
      }
    } else {
      console.log(`⚠️    Unknown option: ${arg}`);
    }
  }
};

// Helper function to generate an option object
function createOption (aliases, handler, description) {
  const optionObject = { aliases, handler, description };
  aliases.forEach((alias) => {
    options[alias] = optionObject;
  });
};
