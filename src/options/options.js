import {
  helpHandler,
  skipHandler,
  keepHandler,
  remotePathHandler,
  distPathHandler,
  hostHandler,
  usernameHandler,
  passwordHandler,
} from "./optionsHandlers.js";

let args;
export const options = {};

// Helper function to generate an option object
function createOption(aliases, handler, description, hasValue = false) {
  const optionObject = { aliases, handler, description, hasValue };
  aliases.forEach((alias) => {
    options[alias] = optionObject;
  });
}

// Generate option objects using the createOption helper function

//help
createOption(["-h", "--help"], helpHandler, "Shows this message");

// skip
createOption(["-s", "--skip"], skipHandler, "Skips the .env file setup");

// keep
createOption(
  ["-k", "--keep"],
  keepHandler,
  "Don't delete files on remote. Default: true"
);

// remote path
createOption(
  ["-r", "--remote"],
  remotePathHandler,
  "Specify the remote path",
  true
);

// dist path
createOption(["-d", "--dist"], distPathHandler, "Specify the dist path", true);

// host
createOption(["--host"], hostHandler, "Specify the host", true);

// username
createOption(
  ["-u", "--username"],
  usernameHandler,
  "Specify the username",
  true
);

// password
createOption(
  ["-p", "--password"],
  passwordHandler,
  "Specify the password",
  true
);

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
      const hasValue = option.hasValue;

      if (hasValue) {
        const value = args[i + 1];
        if (!value) {
          console.log(`⚠️    Missing value for option: ${arg}`);
          continue;
        }
        handler(value);
        i++;
      } else {
        handler();
      }
    } else {
      console.log(`⚠️    Unknown option: ${arg}`);
      console.log("Stopping execution...");
      process.exit();
    }
  }
};
