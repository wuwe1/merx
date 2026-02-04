import { defineCommand } from 'citty'
import { getBuiltinThemes } from '../utils/theme'

// ANSI 转义码帮助函数
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '128;128;128'
  return `${parseInt(result[1], 16)};${parseInt(result[2], 16)};${parseInt(result[3], 16)}`
}

function colorBlock(hex: string): string {
  return `\x1b[48;2;${hexToRgb(hex)}m  \x1b[0m`
}

export default defineCommand({
  meta: {
    name: 'themes',
    description: 'List available themes'
  },
  args: {
    json: {
      type: 'boolean',
      description: 'Output as JSON',
      default: false
    }
  },
  run({ args }) {
    const themes = getBuiltinThemes()

    if (args.json) {
      console.log(JSON.stringify(themes, null, 2))
      return
    }

    console.log('Available themes:\n')
    for (const [name, colors] of Object.entries(themes)) {
      const bgBlock = colors.bg ? colorBlock(colors.bg) : '  '
      const fgBlock = colors.fg ? colorBlock(colors.fg) : '  '
      const accentBlock = colors.accent ? colorBlock(colors.accent) : '  '
      console.log(`  ${bgBlock}${fgBlock}${accentBlock} ${name}`)
    }
    console.log('\nUsage: merx render diagram.mmd --theme <name>')
  }
})
