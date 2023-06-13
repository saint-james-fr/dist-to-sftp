import fs from "fs";
import path from "path";


export const runValidations = (host, username, password, remotePath, distPath) => {
  // check if dist folder exists
  const localDistExists = fs.existsSync(distPath);

  if (!(host && username && password && remotePath)) {
    console.log("\n❌    Some credentials are missing.\n");
    return false;
  }
  if (!localDistExists) {
    console.log(
      "\n❌    No dist directory found. Please make sure you provided correct path from root of your project. \nEx './dist'.\n"
    );
    return false;
  }
  return true;
};
