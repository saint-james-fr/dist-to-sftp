import {
  helpHandler,
  skipHandler,
  keepHandler,
  remotePathHandler,
  distPathHandler,
  hostHandler,
  usernameHandler,
  passwordHandler,
  filesHandler,
} from "./optionsHandlers.js";

import { logger } from "../utils/logger.js";

export const options = {};

// Generate option objects using the createOption helper function

//help
createOption(["-h", "--help"], helpHandler, "Shows this message");

// skip
createOption(["-s", "--skip"], skipHandler, "Skips the .env file setup");

// keep
createOption(["-k", "--keep"], keepHandler, "Don't delete files on remote.");

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
createOption(
  ["-f", "--files"],
  filesHandler,
  "Specify multiple file paths",
  true
);

export const handleOptions = (args) => {
  // options contains the --files option, which can have multiple values
  // so we need to handle it differently
  let argsCopy;
  let optionsLeft;

  // -f --files option
  if (args.includes("-f") || args.includes("--files")) {
    // find index
    const index = args.findIndex((arg) => arg === "-f" || arg === "--files");
    // copy array to avoid mutating the original
    argsCopy = [...args];
    // remove the option from the args array
    argsCopy.splice(index, 1);
    // find the next element of arg beginning with "-"
    let nextArgIndex = argsCopy.findIndex((arg) => arg.startsWith("-"));
    // if nextArgIndex == undefined there are no more options
    // so we set it to the length of the argsCopy array
    if (nextArgIndex === -1) {
      nextArgIndex = argsCopy.length;
    }

    // if nextArgIndex == index, thre are no values for the --files option
    if (nextArgIndex === index) {
      throw new Error(logger.missingValueForOption(args[index]));
    }

    const filesPaths = argsCopy.slice(index, nextArgIndex);
    // remove the file paths from the args array
    argsCopy.splice(index, nextArgIndex - index);
    // pass the file paths to the filesHandler as an array
    filesHandler(filesPaths);

    if (argsCopy.length > 0) {
      handleOptions(argsCopy);
    } else {
      return;
    }
  }

  optionsLeft = argsCopy || args;
  // Parse and handle the remaining command-line options left
  for (let i = 0; i < optionsLeft.length; i++) {
    const arg = optionsLeft[i];
    const option = options[arg];

    if (option) {
      const handler = option.handler;
      const hasValue = option.hasValue;

      // hanles options with values
      if (hasValue) {
        let value = args[i + 1];
        if (!value) {
          throw new Error(logger.missingValueForOption(arg));
        } else {
          handler(value);
          i++;
        }
      } else {
        handler();
      }
    } else {
      throw new Error(logger.unknownOption(arg));
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
