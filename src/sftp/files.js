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
      return cleanDirectory(sftp, itemPath).then(() => sftp.rmdir(itemPath));
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

export const uploadDirectory = async (sftp, directory, remote) => {
  const localFiles = fs.readdirSync(directory);

  await Promise.all(
    localFiles.map(async (file) => {
      const relativePath = path.join(directory, file);
      const remotePath = path.join(remote, file);

      const stats = fs.statSync(relativePath);

      if (stats.isDirectory()) {
        await new Promise((resolve, reject) => {
          sftp.mkdir(remotePath, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        await uploadDirectory(sftp, relativePath, remotePath);
      } else {
        await new Promise((resolve, reject) => {
          sftp.fastPut(relativePath, remotePath, (err) => {
            console.log("remotePath from DIRECTORY", remotePath)
            console.log("relativePath from DIRECTORY", relativePath)
            if (err) reject(err);
            else resolve();
          });
        });
      }
    })
  );
};

export const uploadFiles = async (sftp, filesArray, directory, remote) => {
  console.log("filesArray", filesArray);
  console.log("directory", directory);

  await Promise.all(
    filesArray.map(async (file) => {
      const relativePath = path.join(directory, file);

      console.log("relativePath", relativePath);
      const stats = fs.statSync(relativePath);
      console.log("stats", stats);
      console.log("remote", remote)
      if (stats.isDirectory()) {
        await new Promise((resolve, reject) => {
          sftp.mkdir(remote, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        await uploadDirectory(sftp, relativePath, remote);
      } else {
        await new Promise((resolve, reject) => {
          let remotePath = path.join(remote, relativePath.split("/").slice(-1)[0]);
          console.log("remotePath FROM FILE", remotePath)
          console.log("RELATIVE PATH FROM FILE", relativePath)
          sftp.fastPut(relativePath, remotePath, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    })
  );
};
