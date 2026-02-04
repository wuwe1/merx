import { describe, it, expect } from 'vitest'
import { spawnSync } from 'node:child_process'
import { writeFileSync, unlinkSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const PROJECT_ROOT = join(__filename, '../..')
const CLI = 'node'
const CLI_SCRIPT = join(PROJECT_ROOT, 'dist/cli.mjs')
const DIAGRAM = 'graph LR\n  A --> B'

function runCLI(args: string[], input?: string): { stdout: string; stderr: string; status: number } {
  const options: Parameters<typeof spawnSync>[2] = {
    encoding: 'utf-8' as const,
    cwd: PROJECT_ROOT
  }
  if (input !== undefined) {
    options.input = input
  }
  const result = spawnSync(CLI, [CLI_SCRIPT, ...args], options)
  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    status: result.status || 0
  }
}

describe('merx render', () => {
  it('renders SVG from stdin', () => {
    const { stdout } = runCLI(['render'], DIAGRAM)
    expect(stdout).toContain('<svg')
    expect(stdout).toContain('</svg>')
  })

  it('renders ASCII from stdin', () => {
    const { stdout } = runCLI(['render', '--ascii'], DIAGRAM)
    expect(stdout).toMatch(/[┌┐└┘│─►]/)
  })

  it('renders file to output', () => {
    const inputFile = join('/tmp', 'merx-test-input.mmd')
    const outputFile = join('/tmp', 'merx-test-output.svg')

    writeFileSync(inputFile, 'graph TD\n  Start --> End')

    try {
      runCLI(['render', inputFile, '-o', outputFile])
      expect(existsSync(outputFile)).toBe(true)
      const content = readFileSync(outputFile, 'utf-8')
      expect(content).toContain('<svg')
    } finally {
      if (existsSync(inputFile)) unlinkSync(inputFile)
      if (existsSync(outputFile)) unlinkSync(outputFile)
    }
  })

  it('applies theme colors', () => {
    const { stdout } = runCLI(['render', '--theme', 'tokyo-night'], DIAGRAM)
    expect(stdout).toContain('#1a1b26')
  })
})

describe('merx themes', () => {
  it('lists available themes', () => {
    const { stdout, stderr } = runCLI(['themes'])
    const output = stdout + stderr
    expect(output).toContain('tokyo-night')
  })

  it('outputs JSON with --json flag', () => {
    const { stdout } = runCLI(['themes', '--json'])
    const parsed = JSON.parse(stdout)
    expect(parsed).toHaveProperty('tokyo-night')
    expect(parsed['tokyo-night']).toHaveProperty('bg')
  })
})
