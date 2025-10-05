import readline from "node:readline";

/**
 * Prompts the user to authenticate with VRChat using the console and returns the credentials.
 */
export default async function authenticate() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  console.log("We need to authenticate with VRChat.");

  const username = await question("Username: ");
  const password = await question("Password: ");
  const twoFactorCode = await question(
    "2FA Code (leave blank if not applicable): "
  );

  rl.close();

  return { username, password, twoFactorCode };
}
