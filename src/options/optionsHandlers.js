import { options } from "./options.js";

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
  process.exit();
};

export const skipHandler = () => {
  process.env.SKIP_ENV_SETUP = true;
};

export const keepHandler = () => {
  process.env.DELETE_REMOTE = false;
};

export const remotePathHandler = (value) => {
  process.env.OPTION_SFTP_PATH = value;
};

export const distPathHandler = (value) => {
  process.env.OPTION_DIST_PATH = value;
};

export const usernameHandler = (value) => {
  process.env.OPTION_SFTP_USERNAME = value;
};

export const passwordHandler = (value) => {
  process.env.OPTION_SFTP_PASSWORD = value;
};

export const hostHandler = (value) => {
  process.env.OPTION_SFTP_HOST = value;
};

export const filesHandler = (values) => {
  // values is an array of strings
  process.env.OPTION_FILES = JSON.stringify(values);
}
