# Merx

Beautiful Mermaid diagrams from the terminal.

## Installation

```bash
npm install -g merx
# or
npx merx render diagram.mmd
```

## Quick Start

```bash
# Render to SVG
merx render diagram.mmd -o output.svg

# Pipe from stdin
echo "graph LR; A --> B" | merx render

# ASCII output
merx render diagram.mmd --ascii

# Batch render
merx render "docs/**/*.mmd" --outdir ./images

# Watch mode
merx watch diagram.mmd
```

## Commands

### render

Render Mermaid diagrams to SVG or ASCII.

```bash
merx render <file|glob> [options]

Options:
  -o, --output <file>   Output file path
  --outdir <dir>        Output directory for batch rendering
  --ascii               Output as ASCII art
  --theme <name>        Theme name (default: tokyo-night)
  --bg, --fg, etc.      Custom colors
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

### watch

Watch files and re-render on change.

```bash
merx watch <file|glob> [options]
```

## Configuration

Create a `.merxrc` file:

```json
{
  "theme": "tokyo-night",
  "format": "svg",
  "ascii": {
    "width": 80
  }
}
```

## Themes

15 built-in themes available: tokyo-night, github-dark, github-light, dracula, nord, monokai, solarized-dark, solarized-light, one-dark, gruvbox-dark, catppuccin-mocha, rose-pine, ayu-dark, material-dark, night-owl.

## License

MIT
