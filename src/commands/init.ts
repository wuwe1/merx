import { defineCommand } from 'citty'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const defaultRcContent = `{
  "theme": "tokyo-night",
  "format": "svg",
  "ascii": {
    "width": 80
  },
  "themes": {}
}
`

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Create a .merxrc configuration file'
  },
  args: {
    force: {
      type: 'boolean',
      alias: 'f',
      description: 'Overwrite existing config',
      default: false
    }
  },
  async run({ args }) {
    const rcPath = path.join(process.cwd(), '.merxrc')

    // 检查文件是否存在
    try {
      await fs.access(rcPath)
      if (!args.force) {
        console.error('.merxrc already exists. Use --force to overwrite.')
        process.exit(1)
      }
    } catch {
      // 文件不存在，继续
    }

    await fs.writeFile(rcPath, defaultRcContent)
    console.log('Created .merxrc')
    console.log('')
    console.log('Configuration options:')
    console.log('  theme   - Default theme name (e.g., "tokyo-night")')
    console.log('  format  - Output format: "svg", "ascii", or "png"')
    console.log('  ascii   - ASCII output settings')
    console.log('  themes  - Custom theme definitions')
  }
})
