import type { ThemeColors, MerxConfig } from '../config'

// 内置主题 - 与 beautiful-mermaid 库对齐
const builtinThemes: Record<string, ThemeColors> = {
  'tokyo-night-light': { bg: '#d5d6db', fg: '#343b58', line: '#34548a', accent: '#34548a', muted: '#9699a3' },
  'tokyo-night': { bg: '#1a1b26', fg: '#a9b1d6', line: '#3d59a1', accent: '#7aa2f7', muted: '#565f89' },
  'tokyo-night-storm': { bg: '#24283b', fg: '#a9b1d6', line: '#3d59a1', accent: '#7aa2f7', muted: '#565f89' },
  'zinc-dark': { bg: '#18181B', fg: '#FAFAFA' },
  'github-light': { bg: '#ffffff', fg: '#1f2328', line: '#d1d9e0', accent: '#0969da', muted: '#59636e' },
  'github-dark': { bg: '#0d1117', fg: '#e6edf3', line: '#3d444d', accent: '#4493f8', muted: '#9198a1' },
  'dracula': { bg: '#282a36', fg: '#f8f8f2', line: '#6272a4', accent: '#bd93f9', muted: '#6272a4' },
  'nord': { bg: '#2e3440', fg: '#d8dee9', line: '#4c566a', accent: '#88c0d0', muted: '#616e88' },
  'nord-light': { bg: '#eceff4', fg: '#2e3440', line: '#aab1c0', accent: '#5e81ac', muted: '#7b88a1' },
  'solarized-light': { bg: '#fdf6e3', fg: '#657b83', line: '#93a1a1', accent: '#268bd2', muted: '#93a1a1' },
  'solarized-dark': { bg: '#002b36', fg: '#839496', line: '#586e75', accent: '#268bd2', muted: '#586e75' },
  'one-dark': { bg: '#282c34', fg: '#abb2bf', line: '#4b5263', accent: '#c678dd', muted: '#5c6370' },
  'catppuccin-mocha': { bg: '#1e1e2e', fg: '#cdd6f4', line: '#585b70', accent: '#cba6f7', muted: '#6c7086' },
  'catppuccin-latte': { bg: '#eff1f5', fg: '#4c4f69', line: '#9ca0b0', accent: '#8839ef', muted: '#9ca0b0' },
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
