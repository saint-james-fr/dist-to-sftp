import { Client } from "ssh2";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

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

  // check if dist folder exists
  const rootPath = process.cwd();
  const localDistPath =
    process.env.OPTION_DIST_PATH || path.resolve(rootPath, "./dist");
  const localDistExists = fs.existsSync(localDistPath);

  if (host && username && password && remotePath) {
    console.log("\n❌    Some credentials are missing.\n");
    return;
  }
  if (!localDistExists) {
    console.log(
      "\n❌    No dist directory found. Please run your build first.\n"
    );
    return;
  }

  const conn = new Client();

  try {
    console.log("\n🔌    Connecting to the SSH/SFTP server...\n");
    await new Promise((resolve, reject) => {
      conn.on("ready", resolve);
      conn.on("error", reject);

      conn.connect({
        host,
        port: 22,
        username,
        password,
      });
    });

    console.log("🔧    SSH/SFTP connection established.\n");

    const sftp = await new Promise((resolve, reject) => {
      conn.sftp((err, sftp) => {
        if (err) reject(err);
        else resolve(sftp);
      });
    });

    console.log("✅    SFTP session initialized.\n");

    const deleteFilesInDirectory = async (remotePath) => {
      const list = await new Promise((resolve, reject) => {
        sftp.readdir(remotePath, (err, list) => {
          if (err) reject(err);
          else resolve(list);
        });
      });

      const deletePromises = list.map((item) => {
        const itemPath = path.join(remotePath, item.filename);

        if (item.longname.startsWith("d")) {
          // Item is a directory
          return deleteFilesInDirectory(itemPath).then(() =>
            sftp.rmdir(itemPath)
          );
        } else {
          // Item is a file
          return new Promise((resolve, reject) => {
            sftp.unlink(itemPath, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      });

      await Promise.all(deletePromises);
    };

    if (process.env.DELETE_REMOTE) {
      await deleteFilesInDirectory(remotePath);
      console.log("🗑️    Existing files in the remote directory removed.\n");
    }

    const uploadDirectory = async (localPath, remotePath) => {
      const localFiles = fs.readdirSync(localPath);

      await Promise.all(
        localFiles.map(async (file) => {
          const localFilePath = path.join(localPath, file);
          const remoteFilePath = path.join(remotePath, file);

          const fileStats = fs.statSync(localFilePath);

          if (fileStats.isDirectory()) {
            await new Promise((resolve, reject) => {
              sftp.mkdir(remoteFilePath, (err) => {
                if (err) reject(err);
                else resolve();
              });
            });

            await uploadDirectory(localFilePath, remoteFilePath);
          } else {
            await new Promise((resolve, reject) => {
              sftp.fastPut(localFilePath, remoteFilePath, (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
          }
        })
      );
    };

    await uploadDirectory(localDistPath, remotePath);

    console.log(
      '📂    Contents of the local "dist" folder uploaded to the remote directory.\n'
    );

    // const localHtaccessPath = path.resolve(__dirname, "../.htaccess");

    // await new Promise((resolve, reject) => {
    //   sftp.fastPut(
    //     localHtaccessPath,
    //     path.join(remotePath, ".htaccess"),
    //     (err) => {
    //       if (err) reject(err);
    //       else resolve();
    //     }
    //   );
    // });

    // console.log('".htaccess" file uploaded to the remote directory.');

    sftp.end();
    conn.end();

    console.log("🔒    SFTP connection closed.\n");
  } catch (error) {
    console.error("❌    SFTP connection failed:\n", error);
  } finally {
    conn.end();
  }
}

// Call the connectAndPerformOperations function directly
connectAndPerformOperations();
