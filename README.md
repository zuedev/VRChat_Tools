# vrctools

🎭 CLI tool for managing VRChat via the API.

## Installation

### Docker (Recommended for Isolated Usage)

Pull the latest image from GitHub Container Registry:

```bash
docker pull ghcr.io/zuedev/vrctools:latest
```

Run with a volume mount to persist authentication data:

```bash
docker run -it --rm \
  -v vrchat-data:/data \
  ghcr.io/zuedev/vrctools:latest avatars
```

Or using a local directory:

```bash
docker run -it --rm \
  -v $(pwd)/data:/data \
  ghcr.io/zuedev/vrctools:latest avatars
```

**Docker Usage Examples:**

```bash
# List all avatars
docker run -it --rm -v vrchat-data:/data ghcr.io/zuedev/vrctools:latest avatars

# Get current avatar
docker run -it --rm -v vrchat-data:/data ghcr.io/zuedev/vrctools:latest avatars current

# Delete avatars interactively
docker run -it --rm -v vrchat-data:/data ghcr.io/zuedev/vrctools:latest avatars delete
```

### Global Installation (Recommended)

Install globally to use the `vrctools` command anywhere:

```bash
npm install -g vrctools
```

Or from GitHub Packages:

```bash
npm install -g @zuedev/vrctools --registry=https://npm.pkg.github.com
```

### Local Development

```bash
npm install
```

## Usage

### Authentication

On first run, you'll be prompted to enter your VRChat credentials. These are stored locally in `data.json`.

### Commands

**Note:** If installed globally, use `vrctools` instead of `npm start`.

#### List all avatars

```bash
vrctools avatars
# or for local development:
npm start avatars
```

Fetches and displays all your avatars (both public and private) with pagination support.

#### Get current avatar

```bash
vrctools avatars current
# or for local development:
npm start avatars current
```

Displays information about your currently equipped avatar.

#### Delete avatars interactively

```bash
vrctools avatars delete
# or for local development:
npm start avatars delete
```

Cycles through all your avatars. Press "D" to delete the current avatar, or press Enter to skip.
