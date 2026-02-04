---
name: beautiful-mermaid-integration
status: backlog
created: 2026-02-04T08:11:54Z
progress: 0%
prd: .claude/prds/beautiful-mermaid-integration.md
github:
---

# Epic: Beautiful-Mermaid 集成

## 概述

修复 Merx CLI 的渲染功能，将占位符实现替换为真正的 beautiful-mermaid API 调用，确保输出有效的 SVG 和 ASCII 图表。

## 问题背景

在首次实现 Merx CLI 时，由于没有事先研究 beautiful-mermaid 的 API，导致：
- render 命令使用占位符而非真实渲染
- 验收标准不够具体，占位符被误认为完成
- 缺少端到端验证

## 架构决策

| 决策 | 选择 | 理由 |
|------|------|------|
| API 调研优先 | 先读类型定义 | 避免假设 API 格式 |
| 验收标准具体化 | XML 验证 + 浏览器测试 | 确保输出真正可用 |
| 最小改动 | 只改 render.ts | 不引入新的复杂性 |

## 技术方案

### beautiful-mermaid RenderOptions

```typescript
interface RenderOptions {
  bg?: string       // 背景色
  fg?: string       // 前景色
  line?: string     // 线条色
  accent?: string   // 强调色
  muted?: string    // 弱化文本色
  surface?: string  // 表面色
  border?: string   // 边框色
  font?: string     // 字体
  padding?: number  // 画布内边距
  transparent?: boolean // 透明背景
}
```

### 修改点

1. **src/commands/render.ts**
   - 导入 `renderMermaid`, `renderMermaidAscii`
   - 替换占位符为 API 调用
   - 单文件和批量模式都需要修改

## 任务分解预览

- [ ] **任务 1**：API 调研和验证 - 确认 API 用法，创建测试用例
- [ ] **任务 2**：实现 SVG 渲染 - 替换占位符为 renderMermaid 调用
- [ ] **任务 3**：实现 ASCII 渲染 - 替换占位符为 renderMermaidAscii 调用
- [ ] **任务 4**：端到端测试 - 验证输出有效性

## 成功标准

| 标准 | 验收条件 |
|------|----------|
| SVG 有效 | 输出通过 xmllint 验证 |
| SVG 可显示 | 浏览器可正确渲染 |
| ASCII 有效 | 输出包含 box-drawing 字符 |
| 主题生效 | 颜色参数体现在输出中 |

## 估计工作量

| 任务 | 规模 | 复杂度 |
|------|------|--------|
| API 调研 | XS | 低 |
| SVG 渲染 | S | 低 |
| ASCII 渲染 | S | 低 |
| 端到端测试 | S | 低 |

**总计**：2-4 小时
