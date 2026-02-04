import { defineCommand } from 'citty'
import { readInput } from '../utils/input'
import { writeOutput } from '../utils/output'
import { loadConfig } from '../config'
import { resolveTheme, getThemeNames } from '../utils/theme'
import { MerxError, ExitCode, formatError } from '../utils/errors'

export default defineCommand({
  meta: {
    name: 'render',
    description: 'Render Mermaid diagram to SVG or ASCII'
  },
  args: {
    file: {
      type: 'positional',
      description: 'Input .mmd file',
      required: false
    },
    output: {
      type: 'string',
      alias: 'o',
      description: 'Output file path'
    },
    ascii: {
      type: 'boolean',
      description: 'Output as ASCII art',
      default: false
    },
    theme: {
      type: 'string',
      description: `Theme name (${getThemeNames().slice(0, 3).join(', ')}...)`
    },
    bg: {
      type: 'string',
      description: 'Background color (hex)'
    },
    fg: {
      type: 'string',
      description: 'Foreground color (hex)'
    },
    accent: {
      type: 'string',
      description: 'Accent color (hex)'
    },
    line: {
      type: 'string',
      description: 'Line color (hex)'
    },
    muted: {
      type: 'string',
      description: 'Muted text color (hex)'
    },
    surface: {
      type: 'string',
      description: 'Surface color (hex)'
    },
    border: {
      type: 'string',
      description: 'Border color (hex)'
    }
  },
  async run({ args }) {
    const { file, output, ascii, theme, bg, fg, accent, line, muted, surface, border } = args

    try {
      // Load config and resolve theme
      const config = await loadConfig()
      const themeColors = resolveTheme(
        { theme, bg, fg, accent, line, muted, surface, border },
        config
      )

      // Read input (file or stdin)
      let input
      try {
        input = await readInput(file)
      } catch (error) {
        if (error instanceof Error && error.message.includes('ENOENT')) {
          throw new MerxError(
            `File not found: ${file}`,
            ExitCode.FILE_NOT_FOUND,
            'Check that the file path is correct and the file exists.'
          )
        }
        throw error
      }

      const content = input.content.trim()

      // Temporary: generate placeholder output (beautiful-mermaid integration will be completed in later tasks)
      // TODO: Integrate beautiful-mermaid with themeColors
      let result: string
      if (ascii) {
        // ASCII mode: output content itself as placeholder
        result = `[ASCII placeholder]\n${content}\n`
      } else {
        // SVG mode: generate placeholder SVG (with theme info)
        const source = input.source === 'file' ? input.filePath : 'stdin'
        const themeInfo = themeColors.bg ? `Theme: bg=${themeColors.bg}, fg=${themeColors.fg || 'default'}` : 'Theme: default'
        result = `<!-- Mermaid diagram from ${source} -->\n<!-- ${themeInfo} -->\n<!-- Content: ${content.substring(0, 50)}... -->\n`
      }

      // Write output
      let outPath
      try {
        outPath = await writeOutput(result, {
          output,
          inputFile: input.filePath,
          ascii
        })
      } catch (error) {
        if (error instanceof Error) {
          throw new MerxError(
            `Failed to write output: ${error.message}`,
            ExitCode.WRITE_ERROR,
            'Check that the output directory exists and you have write permissions.'
          )
        }
        throw error
      }

      // If wrote to file, display message
      if (outPath) {
        const source = input.source === 'file' ? input.filePath : 'stdin'
        console.error(`Rendered: ${source} -> ${outPath}`)
      }
    } catch (error) {
      // Handle MerxError with proper formatting and exit code
      if (error instanceof MerxError) {
        console.error(formatError(error))
        process.exit(error.code)
      }
      // Re-throw other errors for global handler
      throw error
    }
  }
})
