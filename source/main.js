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
    filename: "./data.json", // Store auth tokens and cookies locally
  }),
});

// Authenticate and get current user info
const { data: user } = await vrchat.getCurrentUser({ throwOnError: true });
state.currentUser = user;
console.log(`Logged in as ${state.currentUser.displayName}.`);

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
          offset
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
