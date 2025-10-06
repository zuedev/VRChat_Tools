#!/usr/bin/env node
import { VRChat } from "vrchat";
import { KeyvFile } from "keyv-file";
import authenticate from "./authenticate.js";

// Application state to store runtime data
const state = {};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

// Initialize VRChat API client with authentication and persistent storage
const vrchat = new VRChat({
  application: {
    name: "zuedev/VRChat_Tools",
    version: "0.0.0",
    contact: "https://github.com/zuedev/VRChat_Tools",
  },
  authentication: {
    credentials: async () => await authenticate(),
  },
  keyv: new KeyvFile({
    filename: process.env.DATA_FILE || "./data.json", // Store auth tokens and cookies locally
  }),
});

// Authenticate and get current user info
try {
  const { data: user } = await vrchat.getCurrentUser({ throwOnError: true });
  state.currentUser = user;
  console.log(`Logged in as ${state.currentUser.displayName}.`);
} catch (error) {
  if (
    error.message.includes("Username is required") ||
    error.message.includes("Password is required")
  ) {
    console.error(`\n❌ ${error.message}`);
  } else if (
    error.statusCode === 401 ||
    error.message.includes("Invalid credentials")
  ) {
    console.error("\n❌ Authentication failed: Invalid username or password");
    console.error("Please check your credentials and try again.");
  } else if (error.statusCode === 403) {
    console.error(
      "\n❌ Authentication failed: Two-factor authentication required"
    );
    console.error("Please provide a valid 2FA code.");
  } else if (
    error.message.includes("ENOTFOUND") ||
    error.message.includes("network")
  ) {
    console.error(
      "\n❌ Authentication failed: Unable to connect to VRChat servers"
    );
    console.error("Please check your internet connection and try again.");
  } else {
    console.error("\n❌ Authentication failed:", error.message);
  }
  process.exit(1);
}

// Handle avatar-related commands
if (command === "avatars") {
  // Get currently equipped avatar
  if (commandArgs[0] === "current") {
    console.log("Getting current avatar...");
    const { data: avatar } = await vrchat.getOwnAvatar({
      path: { userId: state.currentUser.id },
      throwOnError: true,
    });
    console.log({
      id: avatar.id,
      name: avatar.name,
      authorName: avatar.authorName,
      thumbnailImageUrl: avatar.thumbnailImageUrl,
      version: avatar.version,
    });
  } else if (commandArgs[0] === "delete") {
    // Interactive avatar deletion mode
    console.log("Getting all avatars...");
    let allAvatars = [];
    let offset = 0;
    const n = 100; // Fetch 100 avatars per request

    // Paginate through all avatars
    while (true) {
      const { data: avatars } = await vrchat.searchAvatars({
        query: {
          user: "me",
          releaseStatus: "all", // Include both public and private avatars
          n,
          offset,
        },
        throwOnError: true,
      });

      // Stop if no more results
      if (avatars.length === 0) break;

      allAvatars = allAvatars.concat(avatars);

      // Stop if we got fewer results than requested (last page)
      if (avatars.length < n) break;

      offset += n;
    }

    console.log(`Found ${allAvatars.length} avatars.`);
    console.log('Press "D" to delete, or Enter to skip.\n');

    // Import readline for interactive prompts
    const readline = (await import("node:readline")).default;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (query) =>
      new Promise((resolve) => rl.question(query, resolve));

    let deletedCount = 0;

    // Cycle through each avatar
    for (let i = 0; i < allAvatars.length; i++) {
      const avatar = allAvatars[i];
      console.log(`\n[${i + 1}/${allAvatars.length}]`);
      console.log(`ID: ${avatar.id}`);
      console.log(`Name: ${avatar.name}`);
      console.log(`Author: ${avatar.authorName}`);
      console.log(`Version: ${avatar.version}`);
      console.log(`Release Status: ${avatar.releaseStatus}`);

      const answer = await question("\nAction (D to delete, Enter to skip): ");

      if (answer.trim().toUpperCase() === "D") {
        try {
          console.log("Deleting avatar...");
          await vrchat.deleteAvatar({
            path: { avatarId: avatar.id },
            throwOnError: true,
          });
          console.log("✓ Avatar deleted successfully");
          deletedCount++;
        } catch (error) {
          console.error("✗ Failed to delete avatar:", error.message);
        }
      } else {
        console.log("Skipped");
      }
    }

    rl.close();
    console.log(`\nDeletion complete. Deleted ${deletedCount} avatar(s).`);
  } else {
    // List all avatars with pagination
    console.log("Getting all avatars...");
    let allAvatars = [];
    let offset = 0;
    const n = 100; // Fetch 100 avatars per request

    // Paginate through all avatars
    while (true) {
      const { data: avatars } = await vrchat.searchAvatars({
        query: {
          user: "me",
          releaseStatus: "all", // Include both public and private avatars
          n,
          offset,
        },
        throwOnError: true,
      });

      // Stop if no more results
      if (avatars.length === 0) break;

      allAvatars = allAvatars.concat(avatars);

      // Stop if we got fewer results than requested (last page)
      if (avatars.length < n) break;

      offset += n;
    }

    // Display all fetched avatars
    console.log(`Found ${allAvatars.length} avatars.`);
    allAvatars.forEach((avatar) => {
      console.log({
        id: avatar.id,
        name: avatar.name,
        authorName: avatar.authorName,
        thumbnailImageUrl: avatar.thumbnailImageUrl,
        version: avatar.version,
      });
    });
  }
}

process.exit(0);
