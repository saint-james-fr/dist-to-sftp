let options;
export let skip;

const skipHandler = () => {
  skip = true;
};

// Define an object to map options to handler functions
const optionsObject = {
  "-s": skipHandler,
  "--skip": skipHandler
};

export const handleOptions = () => {
  if (process.argv.length > 2) {
    options = process.argv.slice(2);
  }
  // Parse and handle the command-line arguments
  for (let i = 0; i < options.length; i++) {
    const arg = options[i];
    const handler = optionsObject[arg];

    if (handler) {
      const value = options[i + 1]; // Get the next argument as the value for the option
      handler(value);
      i++; // Skip the next argument since it has been consumed as the value
    } else {
      console.log(`⚠️    Unknown option: ${arg}`);
    }
  }
};
