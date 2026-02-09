# Merx

Beautiful Mermaid diagrams from the terminal.

## Installation

```bash
npm install -g @wuwe1/merx
# or
npx @wuwe1/merx render diagram.mmd
```

## Quick Start

```bash
# Render to SVG
merx render diagram.mmd -o output.svg

# Pipe from stdin (use newlines, not semicolons)
echo -e "graph LR\n  A --> B" | merx render

# ASCII output
merx render diagram.mmd --ascii

# Batch render
merx render "docs/**/*.mmd" --outdir ./images
```

> **Note**: The Mermaid parser requires newline-separated syntax. Use `echo -e "graph LR\n  A --> B"` instead of `echo "graph LR; A --> B"`.

## Commands

### render

Render Mermaid diagrams to SVG or ASCII.

```bash
merx render <file|glob> [options]

Options:
  -o, --output <file>   Output file path
  --outdir <dir>        Output directory for batch rendering
  --ascii               Output as ASCII art
  --theme <name>        Theme name (default: tokyo-night-light)
  --bg <hex>            Background color
  --fg <hex>            Foreground color
  --accent <hex>        Accent color
  --line <hex>          Line color
  --muted <hex>         Muted text color
  --surface <hex>       Surface color
  --border <hex>        Border color
```

### themes

List available themes.

```bash
merx themes
merx themes --json
```

### init

Create a configuration file.

```bash
merx init
merx init --force
```

## Configuration

Create a `.merxrc` file (or run `merx init`):

```json
{
  "theme": "tokyo-night-light",
  "format": "svg",
  "ascii": {
    "width": 80
  },
  "themes": {
    "my-custom-theme": {
      "bg": "#1e1e2e",
      "fg": "#cdd6f4",
      "accent": "#cba6f7"
    }
  }
}
```

Configuration is loaded from (highest priority first):
1. CLI flags
2. Project `.merxrc` (current directory)
3. User `~/.merxrc` (home directory)
4. Built-in defaults

## Themes

18 built-in themes:

| Theme | Type |
|-------|------|
| tokyo-night-light | Light |
| tokyo-night | Dark |
| tokyo-night-storm | Dark |
| zinc-dark | Dark |
| github-light | Light |
| github-dark | Dark |
| dracula | Dark |
| nord | Dark |
| nord-light | Light |
| solarized-light | Light |
| solarized-dark | Dark |
| one-dark | Dark |
| catppuccin-mocha | Dark |
| catppuccin-latte | Light |
| rose-pine | Dark |
| ayu-dark | Dark |
| material-dark | Dark |
| night-owl | Dark |

Preview colors in your terminal:

```bash
merx themes
```

## Programmatic Usage

Merx can also be used as a library:

```typescript
import { renderMermaid, renderMermaidAscii, loadConfig, resolveTheme } from '@wuwe1/merx'

// Simple SVG rendering
const svg = await renderMermaid('graph LR\n  A --> B', {
  bg: '#1a1b26',
  fg: '#a9b1d6'
})

// ASCII rendering
const ascii = renderMermaidAscii('graph LR\n  A --> B')

// Use built-in themes
const config = await loadConfig()
const colors = resolveTheme({ theme: 'dracula' }, config)
const themed = await renderMermaid('graph TD\n  Start --> End', colors)
```

## Troubleshooting

### "No input provided"

You need to either pass a file or pipe content:

```bash
# From file
merx render diagram.mmd

# From stdin
echo -e "graph LR\n  A --> B" | merx render
```

### Parse errors

Mermaid syntax requires newlines between statements. Semicolons are not supported:

```bash
# Wrong
echo "graph LR; A --> B" | merx render

# Correct
echo -e "graph LR\n  A --> B" | merx render
```

### Invalid color values

Color flags expect hex format with a `#` prefix:

```bash
# Correct
merx render diagram.mmd --bg "#1a1b26"

# Wrong
merx render diagram.mmd --bg "blue"
merx render diagram.mmd --bg "1a1b26"
```

### Theme not found

Run `merx themes` to see all available themes. If a theme name doesn't match, the default theme is used with a warning.

## Development

```bash
# Clone and install
git clone https://github.com/wuwe1/merx.git
cd merx
npm install

# Build
npm run build

# Run tests (requires build first)
npm run build && npm test

# Dev mode (auto-rebuild on change)
npm run dev
```

## License

MIT
