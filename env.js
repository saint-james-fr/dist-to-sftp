import fs from "fs";
import readline from "readline";
import path from "path";
import { packageDirectory } from "pkg-dir";

export async function initializeEnv() {
  const rootDir = await packageDirectory();
  const envPath = path.join(rootDir, ".env");

  const envVariables = [
    { name: "SFTP_HOST", description: "SFTP server host" },
    { name: "SFTP_USERNAME", description: "SFTP server username" },
    { name: "SFTP_PASSWORD", description: "SFTP server password" },
    { name: "SFTP_PATH", description: "SFTP server path" },
  ];

  let existingEnv = {};
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    existingEnv = parseEnvContent(envContent);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const shouldModifyAll = await askYesNoQuestion(
    rl,
    ".env file and FTP variables founds. Do you want to change the values?"
  );
  if (!shouldModifyAll) {
    rl.close();
    return;
  }

  for (const envVar of envVariables) {
    const existingValue = existingEnv[envVar.name];
    const answer = await askQuestion(rl, envVar.description, existingValue);
    existingEnv[envVar.name] = answer;
  }

  const updatedEnvContent = generateEnvContent(existingEnv);
  fs.writeFileSync(envPath, updatedEnvContent, "utf8");

  checkAndUpdateGitIgnore(rootDir, envPath);

  rl.close();
}

function askYesNoQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/Y or n/N): `, (answer) => {
      const lowerCaseAnswer = answer.toLowerCase().trim();
      resolve(lowerCaseAnswer === "y" || lowerCaseAnswer === "yes");
    });
  });
}

function checkAndUpdateGitIgnore(rootDir, envPath) {
  const gitPath = path.join(rootDir, '.git');
  if (!fs.existsSync(gitPath)) {
    console.log('No Git repository found. Don\'t forget to add .env to your .gitignore file.');
    return;
  }

  const gitIgnorePath = path.join(rootDir, '.gitignore');
  if (fs.existsSync(gitIgnorePath)) {
    const gitIgnoreContent = fs.readFileSync(gitIgnorePath, 'utf8');
    if (!gitIgnoreContent.includes('.env')) {
      fs.appendFileSync(gitIgnorePath, '\n.env\n', 'utf8');
    }
  } else {
    fs.writeFileSync(gitIgnorePath, '.env\n', 'utf8');
  }
}


function askQuestion(rl, question, existingValue) {
  return new Promise((resolve) => {
    const defaultValue = existingValue
      ? ` (current value: ${existingValue})`
      : "";
    rl.question(
      `Please enter the value for ${question}${defaultValue}: `,
      (answer) => {
        resolve(answer);
      }
    );
  });
}

function parseEnvContent(content) {
  const env = {};
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      const value = match[2] || "";
      env[key] = value;
    }
  }
  return env;
}

function generateEnvContent(env) {
  let content = "";
  for (const key in env) {
    if (env.hasOwnProperty(key)) {
      const value = env[key];
      content += `${key}=${value}\n`;
    }
  }
  return content;
}
