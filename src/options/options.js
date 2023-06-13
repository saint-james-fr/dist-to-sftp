import {
  helpHandler,
  skipHandler,
  keepHandler,
  remotePathHandler,
  distPathHandler,
  hostHandler,
  usernameHandler,
  passwordHandler,
  filesHandler
} from "./optionsHandlers.js";

let args;
export const options = {};


// Generate option objects using the createOption helper function

//help
createOption(["-h", "--help"], helpHandler, "Shows this message");

// skip
createOption(["-s", "--skip"], skipHandler, "Skips the .env file setup");

// keep
createOption(
  ["-k", "--keep"],
  keepHandler,
  "Don't delete files on remote."
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

// files
createOption(["-f", "--files"], filesHandler, "Specify multiple file paths", true);


export const handleOptions = () => {
  if (process.argv.length > 2) {
    args = process.argv.slice(2);
  }

  // options contains the --files option, which can have multiple values
  // so we need to handle it differently

  if (args.includes("-f") || args.includes("--files")) {
    // find index
    const index = args.findIndex((arg) => arg === "-f" || arg === "--files");
    // remove the option from the args array
    args.splice(index, 1);
    // find the next element of arg beginning with "-"
    let nextArgIndex = args.findIndex((arg) => arg.startsWith("-"));
    // if nextArgIndex == undefined there are no more options
    // so we set it to the length of the args array
    if (nextArgIndex === -1) {
      nextArgIndex = args.length;
    }

    // if nextArgIndex == index, thre are no values for the --files option
    if (nextArgIndex === index) {
      console.log(`⚠️    Missing value for option: ${args[index]}`);
      return;
    }
    const filesPaths = args.slice(index, nextArgIndex);
    console.log("filesPaths", filesPaths)
    // remove the file paths from the args array
    args.splice(index, nextArgIndex - index);
    // pass the file paths to the filesHandler as an array
    filesHandler(filesPaths);
  }
  console.log("args", args)

  // Parse and handle the remaining command-line arguments
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
        if (arg === '-f' || arg === '--files') {
          const fileValues = [];
          while (value && !options[value]) {
            fileValues.push(value);
            i++;
            value = args[i + 1];
          }
          handler(fileValues.join(','));
        } else {
          handler(value);
        }
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

// Helper function to generate an option object
function createOption(aliases, handler, description, hasValue = false) {
  const optionObject = { aliases, handler, description, hasValue };
  aliases.forEach((alias) => {
    options[alias] = optionObject;
  });
}
