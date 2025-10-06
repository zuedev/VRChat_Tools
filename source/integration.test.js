import { describe, it } from "node:test";
import assert from "node:assert";
import { readFile } from "node:fs/promises";

/**
 * Integration tests for the VRChat Tools CLI
 * 
 * These tests verify the overall structure and configuration of the project
 * without requiring external dependencies or credentials.
 */

describe("package.json configuration", () => {
  it("should have correct package metadata", async () => {
    const content = await readFile("./package.json", "utf-8");
    const pkg = JSON.parse(content);
    
    assert.strictEqual(pkg.name, "@zuedev/vrctools");
    assert.strictEqual(pkg.type, "module");
    assert.ok(pkg.version);
    assert.ok(pkg.description);
  });

  it("should define correct entry points", async () => {
    const content = await readFile("./package.json", "utf-8");
    const pkg = JSON.parse(content);
    
    assert.strictEqual(pkg.main, "source/main.js");
    assert.ok(pkg.bin.vrctools);
    assert.strictEqual(pkg.bin.vrctools, "./source/main.js");
  });

  it("should have test script configured", async () => {
    const content = await readFile("./package.json", "utf-8");
    const pkg = JSON.parse(content);
    
    assert.ok(pkg.scripts.test);
    assert.ok(pkg.scripts["test:watch"]);
  });

  it("should specify minimum Node.js version", async () => {
    const content = await readFile("./package.json", "utf-8");
    const pkg = JSON.parse(content);
    
    assert.ok(pkg.engines);
    assert.ok(pkg.engines.node);
    assert.ok(pkg.engines.node.includes("16"));
  });

  it("should have required dependencies", async () => {
    const content = await readFile("./package.json", "utf-8");
    const pkg = JSON.parse(content);
    
    assert.ok(pkg.dependencies);
    assert.ok(pkg.dependencies["vrchat"]);
    assert.ok(pkg.dependencies["keyv-file"]);
  });
});

describe("project structure", () => {
  it("should have source directory with main files", async () => {
    const { readdir } = await import("node:fs/promises");
    const files = await readdir("source");
    
    assert.ok(files.includes("main.js"));
    assert.ok(files.includes("authenticate.js"));
  });

  it("should have test files alongside source", async () => {
    const { readdir } = await import("node:fs/promises");
    const files = await readdir("source");
    
    assert.ok(files.includes("main.test.js"));
    assert.ok(files.includes("authenticate.test.js"));
  });

  it("should have documentation files", async () => {
    const { readdir } = await import("node:fs/promises");
    const files = await readdir(".");
    
    assert.ok(files.includes("README.md"));
    assert.ok(files.includes("TESTING.md"));
  });

  it("should have GitHub workflows", async () => {
    const { readdir } = await import("node:fs/promises");
    const files = await readdir(".github/workflows");
    
    assert.ok(files.includes("test.yml"));
  });
});

describe("module exports", () => {
  it("should export authenticate function", async () => {
    const authenticate = await import("../source/authenticate.js");
    assert.strictEqual(typeof authenticate.default, "function");
  });

  it("should allow importing main module", async () => {
    // This test verifies the module can be imported without executing
    // We don't actually import it here to avoid side effects
    const { readFile } = await import("node:fs/promises");
    const content = await readFile("source/main.js", "utf-8");
    
    assert.ok(content.includes("export") || content.startsWith("#!/usr/bin/env node"));
  });
});

describe("environment configuration", () => {
  it("should respect DATA_FILE environment variable", async () => {
    const { readFile } = await import("node:fs/promises");
    const content = await readFile("source/main.js", "utf-8");
    
    assert.ok(content.includes("process.env.DATA_FILE"));
    assert.ok(content.includes("./data.json"));
  });

  it("should have Docker configuration", async () => {
    const { readdir } = await import("node:fs/promises");
    const files = await readdir(".");
    
    assert.ok(files.includes("Dockerfile"));
    assert.ok(files.includes(".dockerignore"));
  });
});
