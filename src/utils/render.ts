import { renderMermaid, renderMermaidAscii } from 'beautiful-mermaid'
import type { ThemeColors } from '../config'

export interface RenderInput {
  content: string
  ascii: boolean
  themeColors: ThemeColors
}

export async function renderDiagram({ content, ascii, themeColors }: RenderInput): Promise<string> {
  if (ascii) {
    return renderMermaidAscii(content)
  }

  return renderMermaid(content, {
    bg: themeColors.bg,
    fg: themeColors.fg,
    accent: themeColors.accent,
    line: themeColors.line,
    muted: themeColors.muted,
    surface: themeColors.surface,
    border: themeColors.border
  })
}
