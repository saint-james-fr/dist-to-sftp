import { options } from "./options.js";

export let skip;
export let abort;
export let deleteRemote = true;

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
  skip = true;
};

export const keepHandler = () => {
  deleteRemote = false;
};
