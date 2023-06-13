let args;
export let skip;

const skipHandler = () => {
  skip = true;
};

const helpHandler = () => {
  console.log("\nUsage: dist-to-sftp [options]\n");
  console.log("Options:");
  Object.keys(options).forEach((option) => {
    const { description } = options[option];
    console.log(`  ${option.padEnd(20)}${description}`);
  });
}

// Define an object to map options to handler functions
const options = {
  "-h": { handler: helpHandler, description: "Show this message" },
  "--help": { handler: helpHandler, description: "Show this message" },
  "-s": { handler: skipHandler, description: "Skip the .env file setup" },
  "--skip": { handler: skipHandler, description: "Skip the .env file setup" },
};

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
