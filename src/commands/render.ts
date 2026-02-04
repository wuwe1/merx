import { defineCommand } from 'citty'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { renderMermaid, renderMermaidAscii } from 'beautiful-mermaid'
import { readInput, resolveInputFiles } from '../utils/input'
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
    },
    outdir: {
      type: 'string',
      description: 'Output directory for batch rendering'
    }
  },
  async run({ args }) {
    const { file, output, ascii, theme, bg, fg, accent, line, muted, surface, border, outdir } = args

    try {
      // Load config and resolve theme
      const config = await loadConfig()
      const themeColors = resolveTheme(
        { theme, bg, fg, accent, line, muted, surface, border },
        config
      )

      // Check if file is a glob pattern for batch rendering
      if (file) {
        const files = await resolveInputFiles(file)

        // Batch rendering mode
        if (files.length > 1) {
          console.error(`Rendering ${files.length} files...`)

          let success = 0
          let failed = 0

          for (const f of files) {
            try {
              // Read file content
              const content = (await fs.readFile(f, 'utf-8')).trim()

              // Render using beautiful-mermaid
              let result: string
              if (ascii) {
                result = renderMermaidAscii(content)
              } else {
                result = await renderMermaid(content, {
                  bg: themeColors.bg,
                  fg: themeColors.fg,
                  accent: themeColors.accent,
                  line: themeColors.line,
                  muted: themeColors.muted,
                  surface: themeColors.surface,
                  border: themeColors.border
                })
              }

              // Determine output path
              const ext = ascii ? '.txt' : '.svg'
              let outPath: string
              if (outdir) {
                await fs.mkdir(outdir, { recursive: true })
                const basename = path.basename(f).replace(/\.mmd$/, ext)
                outPath = path.join(outdir, basename)
              } else {
                outPath = f.replace(/\.mmd$/, ext)
              }

              await fs.writeFile(outPath, result)
              console.error(`  + ${f} -> ${outPath}`)
              success++
            } catch (error) {
              const message = error instanceof Error ? error.message : String(error)
              console.error(`  x ${f}: ${message}`)
              failed++
            }
          }

          console.error(`\n${success}/${files.length} files rendered${failed > 0 ? `, ${failed} failed` : ''}`)
          return
        }
      }

      // Single file or stdin mode
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

      // Render using beautiful-mermaid
      let result: string
      if (ascii) {
        result = renderMermaidAscii(content)
      } else {
        result = await renderMermaid(content, {
          bg: themeColors.bg,
          fg: themeColors.fg,
          accent: themeColors.accent,
          line: themeColors.line,
          muted: themeColors.muted,
          surface: themeColors.surface,
          border: themeColors.border
        })
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
