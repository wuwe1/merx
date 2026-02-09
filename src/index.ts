// Library entry point - public API for programmatic usage

export { renderMermaid, renderMermaidAscii, parseMermaid } from 'beautiful-mermaid'
export type { RenderOptions, AsciiRenderOptions, DiagramColors, ThemeName } from 'beautiful-mermaid'

export { loadConfig, defaultConfig } from './config'
export type { ThemeColors, MerxConfig } from './config'

export { getBuiltinThemes, getThemeNames, getBuiltinTheme, resolveTheme } from './utils/theme'
export type { ThemeArgs } from './utils/theme'
