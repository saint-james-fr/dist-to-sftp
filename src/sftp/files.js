import path from "path";
import fs from "fs";

const getDirectoryList = (sftp, remotePath) => {
  return new Promise((resolve, reject) => {
    sftp.readdir(remotePath, (err, list) => {
      if (err) {
        console.error(logger.getDirectoryListError(err));
        reject(err);
      } else {
        resolve(list);
      }
    });
  });
};

const deleteDirectory = async (sftp, remotePath) => {
  await cleanDirectory(sftp, remotePath);
  await new Promise((resolve, reject) => {
    sftp.rmdir(remotePath, (err) => {
      if (err) {
        console.error(logger.deleteDirectoryError(err));
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const deleteFile = (sftp, remotePath) => {
  return new Promise((resolve, reject) => {
    sftp.unlink(remotePath, (err) => {
      if (err) {
        console.error(logger.deleteFileError(err));
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const cleanDirectory = async (sftp, remotePath) => {
  const list = await getDirectoryList(sftp, remotePath);

  const deletePromises = list.map((item) => {
    const itemPath = path.join(remotePath, item.filename);

    if (item.longname.startsWith("d")) {
      // Item is a directory
      return deleteDirectory(sftp, itemPath);
    } else {
      // Item is a file
      return deleteFile(sftp, itemPath);
    }
  });

  await Promise.all(deletePromises);
};

const uploadFile = async (sftp, localPath, remotePath) => {
  return new Promise((resolve, reject) => {
    sftp.fastPut(localPath, remotePath, (err) => {
      if (err) {
        console.error(logger.uploadFileError(err));
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const createDirectory = (sftp, remotePath) => {
  return new Promise((resolve, reject) => {
    sftp.mkdir(remotePath, (err) => {
      if (err) {
        console.error(logger.createDirectoryError(err));
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const uploadDirectory = async (sftp, directory, remote) => {
  const localFiles = fs.readdirSync(directory);

  await Promise.all(
    localFiles.map(async (file) => {
      const relativePath = path.join(directory, file);
      const remotePath = path.join(remote, file);
      const stats = fs.statSync(relativePath);

      if (stats.isDirectory()) {
        await createDirectory(sftp, remotePath);
        await uploadDirectory(sftp, relativePath, remotePath);
      } else {
        await uploadFile(sftp, relativePath, remotePath);
      }
    })
  );
};

export const uploadFiles = async (sftp, filesArray, directory, remote) => {
  await Promise.all(
    filesArray.map(async (file) => {
      let remotePath;
      const relativePath = path.join(directory, file);
      const stats = fs.statSync(relativePath);
      if (stats.isDirectory()) {
        remotePath = path.join(remote, file);
        await createDirectory(sftp, remotePath);
        await uploadDirectory(sftp, relativePath, remotePath);
      } else {
        remotePath = path.join(remote, relativePath.split("/").slice(-1)[0]);
        await uploadFile(sftp, relativePath, remotePath);
      }
    })
  );
};
