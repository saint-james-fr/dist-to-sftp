export const logger = {
  // CLI Errors
  stopping: "Stopping execution...",
  missingValueForOption: (option) =>
    `⚠️    Missing value for option: ${option}`,
  unknownOption: (option) => `⚠️    Unknown option: ${option}`,
  // SFTP errors
  missingCredentials: "\n❌    Some credentials are missing.\n",
  missingDistFolder:
    "\n❌    No dist directory found. Please make sure you provided correct path from root of your project. \nEx './dist'.\n",
  sftpError: (err) => `\n❌    SFTP error: ${err}\n`,
  // Options Errors
  missingEnvVariables: "\n⚠️    Some variables are missing in the .env file.\n",
  missingEnvFile:"\n⚠️    No .env file found. Creating a new one.\n",
  missingGitRepository: "⚠️    No Git repository found.\nMake sure you initialize a Git repository and add .env to your .gitignore file.\n",
  // Files Errors
  cleanDirectoryError: (err) => `\n❌    Error cleaning directory: ${err}\n`,
  uploadDirectoryError: (err) => `\n❌    Error uploading directory: ${err}\n`,
  getDirectoryListError: (err) => `\n❌    Error getting folder's content: ${err}\n`,
  deleteDirectoryError: (err) => `\n❌    Error deleting directory: ${err}\n`,
  deleteFileError: (err) => `\n❌    Error deleting file: ${err}\n`,
  createDirectoryError: (err) => `\n❌    Error creating directory: ${err}\n`,
  uploadFileError: (err) => `\n❌    Error uploading file: ${err}\n`,
  uploadFilesError: (err) => `\n❌    Error uploading files: ${err}\n`,
  // Success
  envSuccess: "✅    Environment variables loaded.\n",
  gitIgnoreSuccess: "✅    Adding .env to your .gitignore file. Make sure to commit the changes.\n",
  gitIgnoreInfo: "ℹ️    .env is already included in your .gitignore file.\n",
  gitIgnoreCreate: "✏️    Creating .gitignore file and adding .env to it. Make sure to commit the changes.\n",
  connectInit: "\n🔌    Connecting to the SSH/SFTP server...\n",
  connectSuccess: "🔧    SSH/SFTP connection established.\n",
  closeSuccess: "🔒    SFTP connection closed.\n",
  sftpSuccess: "✅    SFTP session initialized.\n",
  removeSuccess: "🗑️     Existing files on the server removed.\n",
  distUploadSuccess:
    '📂    Contents of "dist" folder uploaded to the server.\n',
  filesUploadSuccess:
    "📂    Files passed via  -f/--files options uploaded to the server.\n",
};
