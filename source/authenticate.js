import readline from "node:readline";

/**
 * Prompts the user for input with optional password masking.
 * @param {string} query - The prompt text
 * @param {boolean} hidden - Whether to hide the input (for passwords)
 * @returns {Promise<string>} The user's input
 */
function promptUser(query, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (hidden) {
      // Mute output for password input
      const stdin = process.stdin;
      stdin.on("data", (char) => {
        char = char.toString();
        if (char === "\n" || char === "\r" || char === "\r\n") {
          stdin.pause();
        } else if (char === "\u0003") {
          // Ctrl+C
          process.exit();
        }
      });
    }

    rl.question(query, (answer) => {
      rl.close();
      if (hidden) {
        // Move to new line after password entry
        process.stdout.write("\n");
      }
      resolve(answer);
    });

    if (hidden) {
      // Disable echo
      rl._writeToOutput = function () {
        // Only write the prompt on first call
        if (rl.line.length === 0) {
          rl.output.write(query);
        }
      };
    }
  });
}

/**
 * Prompts the user to authenticate with VRChat using the console and returns the credentials.
 * @throws {Error} If username or password is not provided
 */
export default async function authenticate() {
  console.log("We need to authenticate with VRChat.");

  const username = await promptUser("Username: ");

  // Validate username
  if (!username || username.trim().length === 0) {
    throw new Error(
      "Authentication failed: Username is required and cannot be empty"
    );
  }

  const password = await promptUser("Password: ", true);

  // Validate password
  if (!password || password.trim().length === 0) {
    throw new Error(
      "Authentication failed: Password is required and cannot be empty"
    );
  }

  const twoFactorCode = await promptUser(
    "2FA Code (leave blank if not applicable): "
  );

  return {
    username: username.trim(),
    password: password.trim(),
    twoFactorCode: twoFactorCode.trim(),
  };
}
