import fs from "fs";
import { logger } from "../utils/logger.js";

export const runValidations = (
  host,
  username,
  password,
  remotePath,
  distPath
) => {
  // check if dist folder exists
  const localDistExists = fs.existsSync(distPath);

  if (!(host && username && password && remotePath)) {
    throw new Error(logger.missingCredentials);
  }
  if (!localDistExists) {
    throw new Error(logger.missingDistFolder)
  }
};
