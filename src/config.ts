import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

export interface ThemeColors {
  bg?: string
  fg?: string
  accent?: string
  line?: string
  muted?: string
  surface?: string
  border?: string
}

export interface MerxConfig {
  theme: string
  format: 'svg' | 'ascii' | 'png'
  outdir?: string
  ascii: {
    width: number
  }
  themes: Record<string, ThemeColors>
}

export const defaultConfig: MerxConfig = {
  theme: 'tokyo-night',
  format: 'svg',
  ascii: {
    width: 80
  },
  themes: {}
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content) as T
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`Error: Invalid JSON in ${filePath}`)
      console.error(error.message)
    }
    return null
  }
}

function deepMerge<T extends object>(...objects: (Partial<T> | null)[]): T {
  const result = {} as T

  for (const obj of objects) {
    if (!obj) continue

    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          (result as Record<string, unknown>)[key] = deepMerge(
            (result as Record<string, unknown>)[key] as object || {},
            value as object
          )
        } else {
          (result as Record<string, unknown>)[key] = value
        }
      }
    }
  }

  return result
}

export async function loadConfig(cliConfigPath?: string): Promise<MerxConfig> {
  const configs: (Partial<MerxConfig> | null)[] = [defaultConfig]

  // 1. Load user-level config (~/.merxrc)
  const homeRc = path.join(os.homedir(), '.merxrc')
  if (await exists(homeRc)) {
    configs.push(await readJson<Partial<MerxConfig>>(homeRc))
  }

  // 2. Load project-level config (./.merxrc)
  const projectRc = path.join(process.cwd(), '.merxrc')
  if (await exists(projectRc)) {
    configs.push(await readJson<Partial<MerxConfig>>(projectRc))
  }

  // 3. Load custom config path
  if (cliConfigPath && await exists(cliConfigPath)) {
    configs.push(await readJson<Partial<MerxConfig>>(cliConfigPath))
  }

  return deepMerge<MerxConfig>(...configs)
}

export function mergeCliOptions(
  config: MerxConfig,
  cliOptions: Partial<MerxConfig>
): MerxConfig {
  return deepMerge<MerxConfig>(config, cliOptions)
}
