# VRChat_Tools

My set of VRChat-specific tools. Mostly uses the API.

## Installation

### Global Installation (Recommended)

Install globally to use the `vrchat-tools` command anywhere:

```bash
npm install -g vrchat-tools
```

Or from GitHub Packages:

```bash
npm install -g @zuedev/vrchat-tools --registry=https://npm.pkg.github.com
```

### Local Development

```bash
npm install
```

## Usage

### Authentication

On first run, you'll be prompted to enter your VRChat credentials. These are stored locally in `data.json`.

### Commands

**Note:** If installed globally, use `vrchat-tools` instead of `npm start`.

#### List all avatars

```bash
vrchat-tools avatars
# or for local development:
npm start avatars
```

Fetches and displays all your avatars (both public and private) with pagination support.

#### Get current avatar

```bash
vrchat-tools avatars current
# or for local development:
npm start avatars current
```

Displays information about your currently equipped avatar.

#### Delete avatars interactively

```bash
vrchat-tools avatars delete
# or for local development:
npm start avatars delete
```

Cycles through all your avatars. Press "D" to delete the current avatar, or press Enter to skip.
