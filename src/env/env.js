import fs from "fs";
import readline from "readline";
import path from "path";

export function initializeEnv() {
  return new Promise(async (resolve) => {
    const rootDir = process.cwd();
    const envPath = path.join(rootDir, ".env");

    const envVariables = [
      { name: "SFTP_HOST", description: "SFTP server host" },
      { name: "SFTP_USERNAME", description: "SFTP server username" },
      { name: "SFTP_PASSWORD", description: "SFTP server password" },
      { name: "SFTP_PATH", description: "SFTP server path" },
    ];

    let existingEnv = {};
    let shouldModifyAll = false;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Check if .env file exists
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      existingEnv = parseEnvContent(envContent);

      // Check if all the variables are already set in the .env file
      const isAllVariablesSet = envVariables.every((envVar) =>
        existingEnv.hasOwnProperty(envVar.name)
      );

      if (isAllVariablesSet) {
        console.log(
          "\n✅    All variables are already set in the .env file.\n"
        );
        rl.close();
        resolve(true); // Operation completed successfully
        return;
      } else {
        console.log("\n⚠️    Some variables are missing in the .env file.\n");
      }

    } else {
      // Ask if the user wants to create a new .env file
      console.log("\n⚠️    No .env file found. Creating a new one.\n");
    }

    // Prompt the user to enter values for each environment variable
    for (const envVar of envVariables) {
      const existingValue = existingEnv[envVar.name];
      const answer = await askQuestion(rl, envVar.description, existingValue);
      existingEnv[envVar.name] = answer;
    }

    // Generate updated .env file content
    const updatedEnvContent = generateEnvContent(existingEnv);
    // Write the updated content to the .env file
    fs.writeFileSync(envPath, updatedEnvContent, "utf8");

    // Check if a Git repository exists and update .gitignore if needed
    checkAndUpdateGitIgnore(rootDir, envPath);

    rl.close();
    resolve(true); // Operation completed successfully
  });

  // Function to ask a yes/no question and resolve with a boolean answer
  function askYesNoQuestion(rl, question) {
    return new Promise((resolve) => {
      rl.question(`${question} (yY/nN): `, (answer) => {
        const lowerCaseAnswer = answer.toLowerCase().trim();
        resolve(lowerCaseAnswer === "y" || lowerCaseAnswer === "yes");
      });
    });
  }

  // Function to check and update .gitignore file
  function checkAndUpdateGitIgnore(rootDir, envPath) {
    const gitPath = path.join(rootDir, ".git");
    if (!fs.existsSync(gitPath)) {
      console.log(
        "⚠️    No Git repository found.\nMake sure you initialize a Git repository and add .env to your .gitignore file.\n"
      );
      return;
    }

    const gitIgnorePath = path.join(rootDir, ".gitignore");
    if (fs.existsSync(gitIgnorePath)) {
      const gitIgnoreContent = fs.readFileSync(gitIgnorePath, "utf8");
      if (!gitIgnoreContent.includes(".env")) {
        console.log(
          "✅    Adding .env to your .gitignore file. Make sure to commit the changes.\n"
        );
        fs.appendFileSync(gitIgnorePath, "\n.env\n", "utf8");
      } else {
        console.log(
          "ℹ️    .env is already included in your .gitignore file.\n"
        );
      }
    } else {
      console.log(
        "✏️    Creating .gitignore file and adding .env to it. Make sure to commit the changes.\n"
      );
      fs.writeFileSync(gitIgnorePath, ".env\n", "utf8");
    }
  }
}

// Function to ask a question and resolve with the answer
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

// Function to parse .env file content into key-value pairs
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

// Function to generate .env file content from key-value pairs
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
