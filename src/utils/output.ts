import { promises as fs } from 'node:fs'
import path from 'node:path'

export interface OutputOptions {
  output?: string
  inputFile?: string
  ascii?: boolean
}

export async function writeOutput(
  content: string,
  options: OutputOptions
): Promise<string | null> {
  const { output, inputFile, ascii } = options

  // ASCII 模式或无输出文件且无输入文件：输出到 stdout
  if (ascii || (!output && !inputFile)) {
    process.stdout.write(content)
    return null
  }

  // 确定输出路径
  const outPath = output || inputFile?.replace(/\.mmd$/, '.svg') || 'output.svg'

  // 确保目录存在
  const dir = path.dirname(outPath)
  if (dir && dir !== '.') {
    await fs.mkdir(dir, { recursive: true })
  }

  await fs.writeFile(outPath, content)
  return outPath
}
