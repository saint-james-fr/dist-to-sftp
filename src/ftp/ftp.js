import { fileURLToPath } from "url";
import { Client } from "ssh2";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const host = process.env.SFTP_HOST;
const username = process.env.SFTP_USERNAME;
const password = process.env.SFTP_PASSWORD;
const remotePath = process.env.SFTP_PATH;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localDistPath = path.resolve(__dirname, "../dist");

async function connectAndPerformOperations() {
  const conn = new Client();

  try {
    console.log("Connecting to the SSH/SFTP server...");
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

    console.log("SSH/SFTP connection established.");

    const sftp = await new Promise((resolve, reject) => {
      conn.sftp((err, sftp) => {
        if (err) reject(err);
        else resolve(sftp);
      });
    });

    console.log("SFTP session initialized.");

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

    await deleteFilesInDirectory(remotePath);

    console.log("Existing files in the remote directory removed.");

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
      'Contents of the local "dist" folder uploaded to the remote directory.'
    );

    const localHtaccessPath = path.resolve(__dirname, "../.htaccess");

    await new Promise((resolve, reject) => {
      sftp.fastPut(
        localHtaccessPath,
        path.join(remotePath, ".htaccess"),
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    console.log('".htaccess" file uploaded to the remote directory.');

    sftp.end();
    conn.end();

    console.log("SFTP connection closed.");
  } catch (error) {
    console.error("SFTP connection failed:", error);
  } finally {
    conn.end();
  }
}

// Call the connectAndPerformOperations function directly
connectAndPerformOperations();
