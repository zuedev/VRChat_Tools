import { VRChat } from "vrchat";
import { KeyvFile } from "keyv-file";
import authenticate from "./authenticate.js";

const state = {};

const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

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
    filename: "./data.json",
  }),
});

const { data: user } = await vrchat.getCurrentUser({ throwOnError: true });
state.currentUser = user;
console.log(`Logged in as ${state.currentUser.displayName}.`);

if (command === "avatars") {
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
    console.log("Getting all avatars...");
    let allAvatars = [];
    let offset = 0;
    const n = 100;

    while (true) {
      const { data: avatars } = await vrchat.searchAvatars({
        query: { user: "me", releaseStatus: "all", n, offset },
        throwOnError: true,
      });

      if (avatars.length === 0) break;

      allAvatars = allAvatars.concat(avatars);

      if (avatars.length < n) break;

      offset += n;
    }

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
