import path from "path";
import fs from "fs";

export const cleanDirectory = async (sftp, remotePath) => {
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
      return cleanDirectory(itemPath).then(() => sftp.rmdir(itemPath));
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

export const uploadDirectory = async (sftp, localPath, remotePath) => {
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

export const uploadFiles = async (sftp, files, localPath, remotePath) => {
  await Promise.all(
    files.map(async (file) => {
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
