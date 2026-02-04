import type { ThemeColors, MerxConfig } from '../config'

// 内置主题（占位 - beautiful-mermaid 将提供实际主题）
const builtinThemes: Record<string, ThemeColors> = {
  'tokyo-night': { bg: '#1a1b26', fg: '#a9b1d6', accent: '#7aa2f7' },
  'github-dark': { bg: '#0d1117', fg: '#c9d1d9', accent: '#58a6ff' },
  'github-light': { bg: '#ffffff', fg: '#24292f', accent: '#0969da' },
  'dracula': { bg: '#282a36', fg: '#f8f8f2', accent: '#bd93f9' },
  'nord': { bg: '#2e3440', fg: '#eceff4', accent: '#88c0d0' },
  'monokai': { bg: '#272822', fg: '#f8f8f2', accent: '#a6e22e' },
  'solarized-dark': { bg: '#002b36', fg: '#839496', accent: '#268bd2' },
  'solarized-light': { bg: '#fdf6e3', fg: '#657b83', accent: '#268bd2' },
  'one-dark': { bg: '#282c34', fg: '#abb2bf', accent: '#61afef' },
  'gruvbox-dark': { bg: '#282828', fg: '#ebdbb2', accent: '#fabd2f' },
  'catppuccin-mocha': { bg: '#1e1e2e', fg: '#cdd6f4', accent: '#89b4fa' },
  'rose-pine': { bg: '#191724', fg: '#e0def4', accent: '#c4a7e7' },
  'ayu-dark': { bg: '#0a0e14', fg: '#b3b1ad', accent: '#ffb454' },
  'material-dark': { bg: '#263238', fg: '#eeffff', accent: '#82aaff' },
  'night-owl': { bg: '#011627', fg: '#d6deeb', accent: '#82aaff' }
}

export function getBuiltinTheme(name: string): ThemeColors | undefined {
  return builtinThemes[name]
}

export function getBuiltinThemes(): Record<string, ThemeColors> {
  return { ...builtinThemes }
}

export function getThemeNames(): string[] {
  return Object.keys(builtinThemes)
}

export interface ThemeArgs {
  theme?: string
  bg?: string
  fg?: string
  accent?: string
  line?: string
  muted?: string
  surface?: string
  border?: string
}

export function resolveTheme(args: ThemeArgs, config: MerxConfig): ThemeColors {
  // 1. 从 --theme 参数或配置获取基础主题
  const themeName = args.theme || config.theme
  let base = getBuiltinTheme(themeName) || config.themes?.[themeName] || {}

  // 如果主题不存在，显示警告
  if (args.theme && !getBuiltinTheme(args.theme) && !config.themes?.[args.theme]) {
    console.error(`Warning: Unknown theme "${args.theme}". Using default.`)
    console.error(`Available themes: ${getThemeNames().join(', ')}`)
    base = getBuiltinTheme('tokyo-night') || {}
  }

  // 2. 覆盖单独的颜色标志
  return {
    ...base,
    ...(args.bg && { bg: args.bg }),
    ...(args.fg && { fg: args.fg }),
    ...(args.accent && { accent: args.accent }),
    ...(args.line && { line: args.line }),
    ...(args.muted && { muted: args.muted }),
    ...(args.surface && { surface: args.surface }),
    ...(args.border && { border: args.border })
  }
}
