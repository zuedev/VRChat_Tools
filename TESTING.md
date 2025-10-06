# Testing

This project uses Node.js's built-in test runner (available in Node.js 16+).

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (automatically re-run on file changes):

```bash
npm run test:watch
```

To run a specific test file:

```bash
node --test source/authenticate.test.js
```

## Test Structure

Tests are located alongside the source files with a `.test.js` extension:

- `source/authenticate.test.js` - Tests for the authentication module
- `source/main.test.js` - Tests for the main CLI logic

## Writing Tests

Tests use Node.js's built-in `node:test` module and `node:assert` for assertions:

```javascript
import { describe, it } from "node:test";
import assert from "node:assert";

describe("my feature", () => {
  it("should do something", () => {
    assert.strictEqual(1 + 1, 2);
  });
});
```

## Test Coverage

The test suite covers:

- ✅ Authentication input validation
- ✅ Credential trimming and sanitization
- ✅ Error handling for missing credentials
- ✅ Module structure and imports
- ✅ Command parsing logic
- ✅ Error handling patterns

## Mock Testing

For testing functions that rely on user input or external APIs, we use Node.js's built-in `mock` module:

```javascript
import { mock } from "node:test";

const mockFn = mock.fn(() => "result");
```

## CI/CD Integration

To integrate tests into your CI/CD pipeline, add the following to your workflow:

```yaml
- name: Run tests
  run: npm test
```
