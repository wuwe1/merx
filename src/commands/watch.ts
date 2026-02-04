import { defineCommand } from 'citty'
import { watch } from 'chokidar'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { resolveInputFiles } from '../utils/input'

export default defineCommand({
  meta: {
    name: 'watch',
    description: 'Watch files and re-render on change'
  },
  args: {
    file: {
      type: 'positional',
      description: 'Input file or glob pattern',
      required: true
    },
    output: {
      type: 'string',
      alias: 'o',
      description: 'Output file (for single file watch)'
    },
    outdir: {
      type: 'string',
      description: 'Output directory'
    },
    theme: {
      type: 'string',
      description: 'Theme name'
    },
    ascii: {
      type: 'boolean',
      description: 'Output as ASCII',
      default: false
    }
  },
  async run({ args }) {
    const { file, output, outdir, theme, ascii } = args

    // Resolve file list
    const files = await resolveInputFiles(file)

    console.log(`Watching ${files.length} file(s)...`)
    console.log('Press Ctrl+C to stop.\n')

    // Function to render a single file
    async function renderFile(filePath: string) {
      try {
        const content = await fs.readFile(filePath, 'utf-8')
        const result = `<!-- Rendered ${filePath} at ${new Date().toISOString()} -->\n${content}`

        if (ascii) {
          console.log(`\n[${filePath}]`)
          console.log(content)
        } else {
          let outPath: string
          if (output && files.length === 1) {
            outPath = output
          } else if (outdir) {
            outPath = path.join(outdir, path.basename(filePath).replace(/\.mmd$/, '.svg'))
            await fs.mkdir(outdir, { recursive: true })
          } else {
            outPath = filePath.replace(/\.mmd$/, '.svg')
          }

          await fs.writeFile(outPath, result)
          console.log(`✓ ${filePath} → ${outPath}`)
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        console.error(`✗ ${filePath}: ${message}`)
      }
    }

    // Initial render
    for (const f of files) {
      await renderFile(f)
    }

    // Setup watcher
    const watcher = watch(files, {
      persistent: true,
      ignoreInitial: true
    })

    watcher.on('change', async (changedPath) => {
      console.log(`\n📝 Changed: ${changedPath}`)
      await renderFile(changedPath)
    })

    watcher.on('error', (error) => {
      const message = error instanceof Error ? error.message : String(error)
      console.error('Watch error:', message)
    })

    // Graceful exit
    process.on('SIGINT', () => {
      console.log('\n\nStopping watch...')
      watcher.close().then(() => process.exit(0))
    })

    // Keep process running
    await new Promise(() => {})
  }
})
