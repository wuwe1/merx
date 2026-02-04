export const ExitCode = {
  SUCCESS: 0,
  PARSE_ERROR: 1,
  FILE_NOT_FOUND: 2,
  INVALID_OPTIONS: 3,
  WRITE_ERROR: 4
} as const

export type ExitCodeType = typeof ExitCode[keyof typeof ExitCode]

export class MerxError extends Error {
  constructor(
    message: string,
    public code: ExitCodeType,
    public hint?: string
  ) {
    super(message)
    this.name = 'MerxError'
  }
}

export function formatError(error: unknown): string {
  if (error instanceof MerxError) {
    let msg = `Error: ${error.message}`
    if (error.hint) {
      msg += `\n\nHint: ${error.hint}`
    }
    return msg
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`
  }

  return `Error: ${String(error)}`
}

// Mermaid parse error formatting (placeholder - will integrate with beautiful-mermaid)
export interface MermaidParseError {
  line: number
  column: number
  message: string
  source: string
}

export function formatMermaidError(error: MermaidParseError): string {
  const { line, column, message, source } = error

  const lines = source.split('\n')
  const contextStart = Math.max(0, line - 2)
  const contextEnd = Math.min(lines.length, line + 1)
  const context = lines.slice(contextStart, contextEnd)

  const lineNumbers = context.map((_, i) => {
    const num = contextStart + i + 1
    const marker = num === line ? '>' : ' '
    return `${marker} ${num.toString().padStart(3)} | `
  })

  const pointer = ' '.repeat(column + 7) + '^^^'

  return `
Error: Invalid Mermaid syntax at line ${line}

${lineNumbers.map((ln, i) => ln + context[i]).join('\n')}
${pointer}

${message}
`.trim()
}

// Global error handler
export function setupErrorHandler(): void {
  process.on('uncaughtException', (error) => {
    console.error(formatError(error))
    const code = error instanceof MerxError ? error.code : ExitCode.PARSE_ERROR
    process.exit(code)
  })

  process.on('unhandledRejection', (reason) => {
    console.error(formatError(reason))
    process.exit(ExitCode.PARSE_ERROR)
  })
}
