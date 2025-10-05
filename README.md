# VRChat_Tools

My set of VRChat-specific tools. Mostly uses the API.

## Installation

```bash
npm install
```

## Usage

### Authentication

On first run, you'll be prompted to enter your VRChat credentials. These are stored locally in `data.json`.

### Commands

#### List all avatars

```bash
npm start avatars
```

Fetches and displays all your avatars (both public and private) with pagination support.

#### Get current avatar

```bash
npm start avatars current
```

Displays information about your currently equipped avatar.

#### Delete avatars interactively

```bash
npm start avatars delete
```

Cycles through all your avatars. Press "D" to delete the current avatar, or press Enter to skip.
