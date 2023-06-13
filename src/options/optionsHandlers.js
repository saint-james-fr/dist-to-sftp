import { options } from "./options.js";

export let abort;

export const helpHandler = () => {
  console.log("\nUsage: dist-to-sftp [options]\n");
  console.log("Options:");
  const uniqueOptions = {}; // Object to store unique options and their descriptions
  Object.keys(options).forEach((option) => {
    const { aliases, description } = options[option];
    const optionText = aliases.join(", ");
    uniqueOptions[description] = optionText;
  });
  Object.entries(uniqueOptions).forEach(([description, option]) => {
    console.log(`  ${option.padEnd(20)}${description}`);
  });
  abort = true;
};

export const skipHandler = () => {
  process.env.SKIP_ENV_SETUP = true;
};

export const keepHandler = () => {
  process.env.DELETE_REMOTE = false;
};

export const remotePathHandler = (value) => {
  process.env.OPTION_SFTP_PATH = value;
  process.env.SKIP_ENV_SETUP = true;
};

export const distPathHandler = (value) => {
  process.env.OPTION_DIST_PATH = value;
};

export const usernameHandler = (value) => {
  process.env.OPTION_SFTP_USERNAME = value;
  process.env.SKIP_ENV_SETUP = true;
};

export const passwordHandler = (value) => {
  process.env.OPTION_SFTP_PASSWORD = value;
  process.env.SKIP_ENV_SETUP = true;
};

export const hostHandler = (value) => {
  process.env.OPTION_SFTP_HOST = value;
  process.env.SKIP_ENV_SETUP = true;
};
