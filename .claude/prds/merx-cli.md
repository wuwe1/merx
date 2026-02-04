---
name: merx-cli
description: beautiful-mermaid 的命令行界面 - 在终端中将 Mermaid 图表渲染为 SVG 或 ASCII
status: backlog
created: 2026-02-04T02:39:03Z
---

# PRD: Merx CLI

## 执行摘要

Merx 是 [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) 的零配置命令行界面，可直接在终端中将 Mermaid 图表渲染为精美的 SVG 或 ASCII 艺术。它服务于开发者、技术写作者、CI/CD 流水线和 AI 编程助手，让他们无需离开命令行即可快速获得精美的图表渲染。

## 快速开始

```bash
# 渲染图表为 SVG
merx render diagram.mmd -o output.svg

# 管道输入并渲染
echo "graph LR; A --> B" | merx render

# 终端中输出 ASCII
merx render diagram.mmd --ascii
```

## 问题陈述

Mermaid 图表在技术文档中无处不在，但渲染它们通常需要：
- 基于浏览器的工具，启动缓慢
- 复杂的构建流水线和重型依赖
- 缺乏原生终端支持，无法快速预览

开发者需要一种快速、精美、零配置的方式，在现有的终端工作流中渲染 Mermaid 图表。

## 用户故事

### 主要用户

| 角色 | 需求 | 成功标准 |
|------|------|----------|
| **开发者** | 编码时快速预览图表 | `echo "graph LR; A-->B" \| merx` 在 200ms 内完成 |
| **技术写作者** | 批量渲染文档图表 | `merx render *.mmd --outdir ./images` |
| **CI/CD 流水线** | 自动化图表生成 | 退出码、stderr 错误输出、非交互模式 |
| **AI 编程助手** | 程序化图表渲染 | stdin/stdout、JSON 错误、确定性输出 |

### 用户旅程

**首次使用者：**
```bash
$ merx
# 显示有用的帮助信息，而非错误
```

**快速预览：**
```bash
$ merx render architecture.mmd --ascii
# 在终端中渲染 ASCII 图表
```

**生产构建：**
```bash
$ merx render docs/**/*.mmd --outdir ./dist/diagrams --theme github-light
# 使用一致的主题批量渲染所有图表
```

## CLI 界面设计

### 命令

| 命令 | 描述 |
|------|------|
| `merx render <file\|glob>` | 将 Mermaid 图表渲染为 SVG 或 ASCII |
| `merx themes` | 列出可用主题及颜色预览 |
| `merx init` | 生成 `.merxrc` 配置文件 |
| `merx watch <file\|glob>` | 监听文件变化并重新渲染 |
| `merx`（无参数） | 显示帮助和示例 |

### 全局标志

```
--help, -h        显示帮助
--version, -v     显示版本
--config <path>   配置文件路径（默认：.merxrc）
```

### Render 命令

```bash
merx render <file|glob> [flags]
```

**输出标志：**
```
-o, --output <file>     输出文件路径（默认：ASCII 输出到 stdout，SVG 输出到 <input>.svg）
--outdir <dir>          批量渲染的输出目录
--ascii                 渲染为 ASCII/Unicode 艺术到 stdout
--svg                   渲染为 SVG（默认）
--png                   渲染为 PNG（需要 sharp）
```

**主题标志：**
```
--theme <name>          内置主题名称（默认：tokyo-night）
--bg <color>            背景色（十六进制）
--fg <color>            前景色（十六进制）
--accent <color>        强调色（十六进制）
--line <color>          线条色（十六进制）
--muted <color>         弱化文本色（十六进制）
--surface <color>       表面色（十六进制）
--border <color>        边框色（十六进制）
```

**行为标志：**
```
--watch, -w             监听变化并重新渲染
--silent                抑制非错误输出
--no-color              禁用彩色输出
--width <n>             ASCII 的终端宽度（默认：自动检测）
```

### 示例

```bash
# 文件转 SVG
merx render diagram.mmd -o diagram.svg

# stdin 到 stdout（SVG）
echo "graph LR; A --> B" | merx render > output.svg

# ASCII 到终端
merx render diagram.mmd --ascii

# 带主题的批量渲染
merx render docs/*.mmd --outdir ./images --theme github-dark

# 自定义颜色
merx render diagram.mmd --bg "#1a1b26" --fg "#a9b1d6"

# 监听模式
merx watch diagram.mmd -o output.svg
```

## 配置文件

### `.merxrc`（JSON）

```json
{
  "theme": "tokyo-night",
  "format": "svg",
  "outdir": "./diagrams",
  "ascii": {
    "width": 80
  },
  "themes": {
    "my-brand": {
      "bg": "#ffffff",
      "fg": "#1a1a1a",
      "accent": "#0066cc"
    }
  }
}
```

### 优先级

1. CLI 标志（最高）
2. 当前目录的 `.merxrc`
3. 用户主目录的 `.merxrc`
4. 内置默认值

### 默认值

| 设置 | 默认值 |
|------|--------|
| `theme` | `tokyo-night` |
| `format` | `svg` |
| `ascii.width` | 终端宽度或 80 |

## 输出行为

### SVG 输出
- **有 `-o`：** 写入指定文件
- **无 `-o`：** 写入 `<input>.svg`（同目录）
- **stdin 无 `-o`：** 写入 stdout

### ASCII 输出
- 始终写入 stdout
- 遵循 `--width` 或自动检测终端宽度
- 非 TTY 时回退到 80 列

### PNG 输出
- 需要 `sharp` 作为可选依赖
- 缺失时显示错误和安装指引

### 错误处理

```bash
# 解析错误 → stderr，带行号
$ merx render broken.mmd
Error: 第 3 行 Mermaid 语法无效
  graph LR;
  A --> B
  C ---> D  # 箭头语法无效
       ^^^

Hint: 使用 --> 作为箭头，而非 --->
```

### 退出码

| 码 | 含义 |
|----|------|
| 0 | 成功 |
| 1 | Mermaid 解析错误 |
| 2 | 文件未找到 |
| 3 | 选项无效 |
| 4 | 输出写入错误 |

## 技术架构

### 运行时要求
- Node.js 18+ 或 Bun
- ESM 优先，TypeScript 源码

### 依赖

```json
{
  "dependencies": {
    "beautiful-mermaid": "^1.0.0",
    "citty": "^0.1.0"
  },
  "optionalDependencies": {
    "sharp": "^0.33.0"
  }
}
```

**为什么选择 citty？** 零依赖、TypeScript 优先、出色的子命令支持，由 UnJS 团队构建。

### 包结构

```
merx/
├── src/
│   ├── cli.ts          # 入口点
│   ├── commands/
│   │   ├── render.ts
│   │   ├── themes.ts
│   │   ├── init.ts
│   │   └── watch.ts
│   ├── config.ts       # 配置加载
│   └── utils/
│       ├── output.ts   # 输出处理
│       └── errors.ts   # 错误格式化
├── package.json
└── tsconfig.json
```

### 二进制

```json
{
  "name": "merx",
  "bin": {
    "merx": "./dist/cli.js"
  }
}
```

## 开发者体验

### 首次运行体验

```bash
$ merx

  Merx - 终端中的精美 Mermaid 图表

  用法:
    merx render <file>     渲染图表为 SVG
    merx render --ascii    渲染为 ASCII 艺术
    merx themes            列出可用主题
    merx init              创建配置文件

  示例:
    merx render diagram.mmd -o output.svg
    echo "graph LR; A-->B" | merx render --ascii
    merx render *.mmd --outdir ./images

  运行 merx --help 查看完整选项。
```

### 自动检测

| 特性 | 检测方法 |
|------|----------|
| 管道输入 | `!process.stdin.isTTY` |
| 终端宽度 | `process.stdout.columns` |
| 颜色支持 | `process.stdout.hasColors()` |

### Shell 补全

```bash
# 生成补全脚本
merx completions bash > /etc/bash_completion.d/merx
merx completions zsh > ~/.zsh/completions/_merx
merx completions fish > ~/.config/fish/completions/merx.fish
```

## 分发与安装

```bash
# 全局安装
npm install -g merx

# 一次性执行
npx merx render diagram.mmd
bunx merx render diagram.mmd

# 项目依赖
npm install --save-dev merx
```

## 成功标准

| 指标 | 目标 |
|------|------|
| 零配置渲染 | `echo "graph LR; A-->B" \| merx` 可用 |
| 性能 | 简单图表 < 200ms |
| 主题访问 | 所有 15 个内置主题可通过 `--theme` 访问 |
| 错误清晰度 | 解析错误显示行号和建议 |
| CI/CD 就绪 | 正确的退出码，错误输出到 stderr |

## 范围之外（v2+）

- **实时预览服务器** - 在浏览器中打开 SVG，支持热重载
- **Mermaid LSP 集成** - 编辑器诊断
- **Markdown 扫描** - 从 .md 文件中提取 mermaid 代码块
- **PDF 输出** - 直接生成 PDF
- **交互式主题构建器** - 基于终端的主题设计器

## 依赖项

| 依赖 | 类型 | 用途 |
|------|------|------|
| beautiful-mermaid | 直接依赖 | 核心渲染引擎 |
| citty | 直接依赖 | CLI 框架 |
| sharp | 可选依赖 | PNG 输出 |

## 约束与假设

### 约束
- 必须在 Node.js 18+ 和 Bun 中运行
- 无 DOM 依赖（beautiful-mermaid 要求）
- 二进制大小应保持在 5MB 以下

### 假设
- 用户具备基本的终端使用知识
- 假设用户了解 Mermaid 语法（非教学工具）
- beautiful-mermaid API 稳定
