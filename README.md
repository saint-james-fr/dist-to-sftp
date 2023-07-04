# dist-to-sftp

dist-to-ftp is a simple command-line tool that enables you to connect to an SFTP server.

This straightforward tool simplifies the process of deploying your website or data to the desired location on the SFTP server.

Basic Usage:

- Start by setting up your FTP credentials in .env file - this can be skipped, see the options.
- Delete and upload all files to remote path folder.

**Beware!**
the script will indeed remove **all existing files** and directories on the server remote path.
See options to keep them.


##  Installation
To install dist-to-sftp, you can use npm or yarn:

```bash
# Using npm
npm install --save-dev dist-to-sftp
# Using yarn
yarn add -D dist-to-sftp
```

## Usage


Once installed, you can run the tool using the following command:

```bash
dist-to-sftp
```

Setting up env files is just filling up these environment variables. It will check for the presence of a .env file and of these variables inside.

``` plain
SFTP_HOST=
SFTP_USERNAME=
SFTP_PASSWORD=
SFTP_PATH=
```

## Options
The following options can be passed as command-line arguments:

```plain
-h, --help: Shows the help message.
-s, --skip: Skips the .env file setup.
-k, --keep: Doesn't delete files on the remote server (default: true).
-r, --remote: Specifies the remote path (requires a value).
-d, --dist: Specifies the local dist path (requires a value).
--host: Specifies the SFTP host (requires a value).
-u, --username: Specifies the SFTP username (requires a value).
-p, --password: Specifies the SFTP password (requires a value).
-f, --files: pass multiple paths - in addition to the dist folder
```


## Example

```bash
# Basic usage
dist-to-sftp -k

# A more advance usage
dist-to-sftp -r /www/my_website/ -d ./my_dirst_folder --host ftp.fake.hosting.domain.net -u my_username -p my_password

dist-to-sftp -f ./.htaccess
```



## Dependencies
The dist-to-ftp tool has the following dependencies:

- dotenv - version 16.1.4
- ssh2 - version 1.13.0

These dependencies will be automatically installed when you install dist-to-ftp.

## License
This package is licensed under the ISC License.
