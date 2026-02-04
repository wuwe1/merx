import { promises as fs } from 'node:fs'

export async function readStdin(): Promise<string> {
  const chunks: Buffer[] = []

  return new Promise((resolve, reject) => {
    process.stdin.on('data', (chunk) => chunks.push(chunk))
    process.stdin.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    process.stdin.on('error', reject)
  })
}

export async function readInput(file?: string): Promise<{
  content: string
  source: 'file' | 'stdin'
  filePath?: string
}> {
  // 如果有文件参数，从文件读取
  if (file) {
    const content = await fs.readFile(file, 'utf-8')
    return { content, source: 'file', filePath: file }
  }

  // 检查是否有管道输入
  if (!process.stdin.isTTY) {
    const content = await readStdin()
    return { content, source: 'stdin' }
  }

  throw new Error('No input provided. Provide a file or pipe content.')
}
