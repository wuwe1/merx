import { defineCommand } from 'citty'
import { promises as fs } from 'node:fs'

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
    }
  },
  async run({ args }) {
    const { file, output, ascii } = args

    // 如果没有文件参数，显示帮助
    if (!file) {
      console.log('Usage: merx render <file.mmd> [options]')
      console.log('')
      console.log('Options:')
      console.log('  -o, --output <file>  Output file path')
      console.log('  --ascii              Output as ASCII art')
      return
    }

    // 检查文件是否存在
    try {
      await fs.access(file)
    } catch {
      console.error(`Error: File not found: ${file}`)
      process.exit(2)
    }

    // 读取文件内容
    const content = await fs.readFile(file, 'utf-8')

    // 临时：输出占位信息（beautiful-mermaid 集成将在后续任务中完成）
    // TODO: 集成 beautiful-mermaid
    const result = `<!-- Mermaid diagram from ${file} -->\n<!-- Content: ${content.substring(0, 50)}... -->`

    // 确定输出路径
    if (ascii) {
      // ASCII 模式：输出到 stdout
      console.log(`[ASCII placeholder for ${file}]`)
      console.log(content)
    } else if (output) {
      // 有指定输出文件
      await fs.writeFile(output, result)
      console.log(`Rendered: ${file} → ${output}`)
    } else {
      // 默认：同名 .svg 文件
      const outPath = file.replace(/\.mmd$/, '.svg')
      await fs.writeFile(outPath, result)
      console.log(`Rendered: ${file} → ${outPath}`)
    }
  }
})
