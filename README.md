# dist-to-sftp

dist-to-ftp is a simple command-line tool that enables you to connect to an SFTP server. Although it is currently in its rudimentary stage.

This straightforward tool simplifies the process of deploying your files to the desired location on the SFTP server.

- It begins by helping you set up your .env file and store your FTP credentials. Also, it prompts you to specify the path you intend to use.
- Then it starts the FTP script.

Please note that when executed, the script will remove **all existing files** and directories on the FTP server that correspond to the provided path.

Subsequently, it will upload the contents of the dist folder located at the root of your project.




##  Installation
To install dist-to-ftp, you can use npm or yarn:

```bash
npm install --save-dev dist-to-ftp
```

```bash
yarn add -D dist-to-ftp
```

Once installed, you can run the tool using the following command:

```bash
yarn dist-to-ftp
```

or

``` bash
npm run dist-to-ftp
```

The tool will guide you through the setup process, prompting you to enter the required FTP credentials and path.

``` plain
SFTP_HOST=
SFTP_USERNAME=
SFTP_PASSWORD=
SFTP_PATH=
```

Ensure that you have the necessary permissions and correct values in your .env file to establish a successful SFTP connection.

## Dependencies
The dist-to-ftp tool has the following dependencies:

dotenv - version 16.1.4
ssh2 - version 1.13.0

These dependencies will be automatically installed when you install dist-to-ftp.

## License
This package is licensed under the ISC License.
