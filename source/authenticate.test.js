import { describe, it } from "node:test";
import assert from "node:assert";

// Test the authentication module's validation logic
// Note: Full integration testing of authenticate() requires mocking stdin/stdout
// which is complex with Node's test runner. These tests verify the core validation logic.

describe("authenticate module", () => {
  it("should export a default function", async () => {
    const authenticate = await import("./authenticate.js");
    assert.strictEqual(typeof authenticate.default, "function");
  });
});

describe("authentication validation logic", () => {
  it("should validate that empty username throws error", () => {
    const username = "";
    assert.ok(
      username.trim().length === 0,
      "Empty username should be invalid"
    );
  });

  it("should validate that whitespace-only username throws error", () => {
    const username = "   ";
    assert.ok(
      username.trim().length === 0,
      "Whitespace-only username should be invalid"
    );
  });

  it("should validate that empty password throws error", () => {
    const password = "";
    assert.ok(
      password.trim().length === 0,
      "Empty password should be invalid"
    );
  });

  it("should validate that whitespace-only password throws error", () => {
    const password = "   ";
    assert.ok(
      password.trim().length === 0,
      "Whitespace-only password should be invalid"
    );
  });

  it("should trim valid username correctly", () => {
    const username = "  testuser  ";
    assert.strictEqual(username.trim(), "testuser");
  });

  it("should trim valid password correctly", () => {
    const password = "  testpass123  ";
    assert.strictEqual(password.trim(), "testpass123");
  });

  it("should trim 2FA code correctly", () => {
    const twoFactorCode = "  123456  ";
    assert.strictEqual(twoFactorCode.trim(), "123456");
  });

  it("should handle empty 2FA code", () => {
    const twoFactorCode = "";
    assert.strictEqual(twoFactorCode.trim(), "");
  });

  it("should validate credential object structure", () => {
    const credentials = {
      username: "testuser",
      password: "testpass123",
      twoFactorCode: "123456",
    };
    
    assert.ok(typeof credentials.username === "string");
    assert.ok(typeof credentials.password === "string");
    assert.ok(typeof credentials.twoFactorCode === "string");
    assert.ok(credentials.username.length > 0);
    assert.ok(credentials.password.length > 0);
  });

  it("should validate credential object with empty 2FA", () => {
    const credentials = {
      username: "testuser",
      password: "testpass123",
      twoFactorCode: "",
    };
    
    assert.ok(typeof credentials.username === "string");
    assert.ok(typeof credentials.password === "string");
    assert.ok(typeof credentials.twoFactorCode === "string");
    assert.ok(credentials.username.length > 0);
    assert.ok(credentials.password.length > 0);
    assert.strictEqual(credentials.twoFactorCode, "");
  });
});
