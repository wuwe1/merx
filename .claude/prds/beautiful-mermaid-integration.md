---
name: beautiful-mermaid-integration
description: 集成 beautiful-mermaid 库实现真正的 Mermaid 图表渲染
status: backlog
created: 2026-02-04T08:11:54Z
---

# PRD: Beautiful-Mermaid 集成

## 执行摘要

当前 Merx CLI 的渲染功能使用占位符实现，需要正确集成 beautiful-mermaid 库以生成真正的 SVG 和 ASCII 输出。

## 问题陈述

### 当前状态
- render 命令输出的是注释占位符，不是有效的 SVG
- ASCII 模式只是原样输出输入内容
- 主题颜色参数没有被真正使用

### 根本原因
- 没有在实现前研究 beautiful-mermaid 的真实 API
- 验收标准不够具体（"渲染成功"而非"输出有效 SVG"）
- 缺少端到端验证测试

## 目标

1. 正确调用 `renderMermaid()` 生成有效 SVG
2. 正确调用 `renderMermaidAscii()` 生成 ASCII 图表
3. 正确传递主题颜色参数
4. 添加端到端测试验证输出

## 技术方案

### beautiful-mermaid API

```typescript
// SVG 渲染
import { renderMermaid } from 'beautiful-mermaid'

const svg = await renderMermaid('graph LR; A-->B', {
  bg: '#1a1b26',      // 背景色
  fg: '#a9b1d6',      // 前景色
  accent: '#7aa2f7',  // 强调色
  line: '#565f89',    // 线条色
  muted: '#565f89',   // 弱化文本色
  surface: '#24283b', // 表面色
  border: '#414868'   // 边框色
})

// ASCII 渲染
import { renderMermaidAscii } from 'beautiful-mermaid'

const ascii = renderMermaidAscii('graph LR; A-->B')
```

### 需要修改的文件

1. `src/commands/render.ts` - 替换占位符为真实 API 调用
2. `src/utils/theme.ts` - 确保主题颜色格式与 API 兼容

## 验收标准

### 功能验收
- [ ] `echo "graph LR; A-->B" | merx render` 输出有效 SVG
- [ ] 输出的 SVG 可以在浏览器中正确显示
- [ ] `merx render --ascii` 输出 ASCII 图表（非原样输出）
- [ ] `--theme` 和颜色标志正确应用到输出

### 技术验收
- [ ] `echo "graph LR; A-->B" | merx render | head -1` 输出以 `<svg` 开头
- [ ] SVG 通过 XML 验证：`xmllint --noout`
- [ ] ASCII 输出包含 box 字符（─│┌┐└┘等）

## 范围之外

- 支持所有 Mermaid 图表类型（仅保证 flowchart 工作）
- 性能优化
- 新功能添加
