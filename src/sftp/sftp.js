import { cleanDirectory, uploadDirectory, uploadFiles } from "./files.js";
import { runValidations } from "./validations.js";
import {logger } from "../utils/logger.js";

import { Client } from "ssh2";
import dotenv from "dotenv";
import path from "path";

export async function connectAndPerformOperations(ready) {
  if (!ready) return;

  // load environment variables
  dotenv.config();
  const host = process.env.OPTION_SFTP_HOST || process.env.SFTP_HOST;
  const username =
    process.env.OPTION_SFTP_USERNAME || process.env.SFTP_USERNAME;
  const password =
    process.env.OPTION_SFTP_PASSWORD || process.env.SFTP_PASSWORD;
  const remotePath = process.env.OPTION_SFTP_PATH || process.env.SFTP_PATH;

  //root path of the project
  const rootPath = process.cwd();

  // dist path
  let distPath = process.env.OPTION_DIST_PATH || "./dist";
  distPath = path.resolve(rootPath, distPath);

  const connect = async (conn) => {
    return new Promise((resolve, reject) => {
      conn.on("ready", resolve);
      conn.on("error", reject);

      conn.connect({
        host,
        port: 22,
        username,
        password,
      });
    });
  };

  const configSFTP = async (conn) => {
    return new Promise((resolve, reject) => {
      conn.sftp((err, sftp) => {
        if (err) reject(err);
        else resolve(sftp);
      });
    });
  };

  const disconnect = (sftp, conn) => {
    sftp.end();
    conn.end();
  };


  // FLOW
  try {
    runValidations(host, username, password, remotePath, distPath);
  } catch (err) {
    console.log(err.message);
    console.log(logger.stopping);
    process.exit();
  }

  const connexion = new Client();

  try {
    console.log(logger.connectInit);

    // CONNEXION
    await connect(connexion);
    console.log(logger.connectSuccess);

    // SFTP SESSION
    const sftp = await configSFTP(connexion);
    console.log(logger.sftpSuccess);

    // OPTION --KEEP OR -K
    if (process.env.DELETE_REMOTE !== "false") {
      await cleanDirectory(sftp, remotePath);
      console.log(logger.removeSuccess);
    }

    // UPLOAD DIST FOLDER
    await uploadDirectory(sftp, distPath, remotePath);
    console.log(
      distUploadSuccess
    );

    // UPLOAD --FILES
    if (process.env.OPTION_FILES) {
      const files = JSON.parse(process.env.OPTION_FILES);
      await uploadFiles(sftp, files, rootPath, remotePath);
      console.log(
        logger.filesUploadSuccess
      );
    }

    disconnect(sftp, connexion);

    console.log(logger.closeSuccess);
  } catch (error) {
    console.error(logger.sftpError(error));
  } finally {
    connexion.end();
  }
}
