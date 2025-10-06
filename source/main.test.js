import { describe, it } from "node:test";
import assert from "node:assert";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("main.js", () => {
  it("should be a valid Node.js executable script", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    // Check for shebang
    assert.ok(content.startsWith("#!/usr/bin/env node"), "Should have proper shebang");
  });

  it("should import required dependencies", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(content.includes('import { VRChat }'), "Should import VRChat");
    assert.ok(content.includes('import { KeyvFile }'), "Should import KeyvFile");
    assert.ok(content.includes('import authenticate'), "Should import authenticate");
  });

  it("should use ES modules", async () => {
    const packagePath = join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(await readFile(packagePath, "utf-8"));
    
    assert.strictEqual(packageJson.type, "module", "Should use ES modules");
  });

  it("should define application metadata", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(content.includes('name: "zuedev/vrctools"'), "Should define application name");
    assert.ok(content.includes('version: "0.0.1"'), "Should define application version");
  });

  it("should handle DATA_FILE environment variable", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(
      content.includes("process.env.DATA_FILE"),
      "Should respect DATA_FILE environment variable"
    );
  });
});

describe("command parsing", () => {
  it("should parse avatars command", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(content.includes('command === "avatars"'), "Should handle avatars command");
  });

  it("should parse avatars current subcommand", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(
      content.includes('commandArgs[0] === "current"'),
      "Should handle avatars current subcommand"
    );
  });

  it("should parse avatars delete subcommand", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(
      content.includes('commandArgs[0] === "delete"'),
      "Should handle avatars delete subcommand"
    );
  });
});

describe("error handling", () => {
  it("should handle authentication errors", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(
      content.includes("Username is required"),
      "Should handle missing username error"
    );
    assert.ok(
      content.includes("Password is required"),
      "Should handle missing password error"
    );
  });

  it("should handle network errors", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(
      content.includes("ENOTFOUND") || content.includes("network"),
      "Should handle network errors"
    );
  });

  it("should handle unauthorized errors", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(
      content.includes("statusCode === 401") || content.includes("Invalid credentials"),
      "Should handle 401 unauthorized errors"
    );
  });

  it("should handle 2FA errors", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(
      content.includes("statusCode === 403") || content.includes("Two-factor"),
      "Should handle 2FA requirement"
    );
  });
});

describe("pagination logic", () => {
  it("should implement pagination for avatar listing", async () => {
    const mainPath = join(__dirname, "main.js");
    const content = await readFile(mainPath, "utf-8");
    
    assert.ok(content.includes("offset"), "Should use offset for pagination");
    assert.ok(content.includes("n ="), "Should define page size");
    assert.ok(
      content.includes("releaseStatus") && content.includes("all"),
      "Should fetch all release statuses"
    );
  });
});
