---
name: merx-cli
status: backlog
created: 2026-02-04T02:42:24Z
updated: 2026-02-04T02:51:33Z
progress: 0%
prd: .claude/prds/merx-cli.md
github: https://github.com/wuwe1/merx/issues/1
---

# Epic: Merx CLI

## 概述

实现 Merx CLI —— beautiful-mermaid 的命令行界面。核心目标是提供零配置、高性能的 Mermaid 图表渲染工具，支持 SVG 和 ASCII 输出，可通过 stdin/stdout 与其他工具无缝集成。

## 架构决策

| 决策 | 选择 | 理由 |
|------|------|------|
| CLI 框架 | citty | 零依赖、TypeScript 优先、UnJS 生态系统 |
| 模块系统 | ESM | 现代标准，Node 18+ 原生支持 |
| 配置格式 | JSON (.merxrc) | 简单、无需额外解析器 |
| 构建工具 | unbuild | UnJS 生态，与 citty 配合良好 |
| 渲染引擎 | beautiful-mermaid | 核心依赖，提供 SVG/ASCII 渲染 |

## 技术方法

### CLI 架构

```
src/
├── cli.ts              # 入口点，citty 主命令定义
├── commands/
│   ├── render.ts       # 核心渲染命令
│   ├── themes.ts       # 主题列表命令
│   ├── init.ts         # 配置初始化命令
│   └── watch.ts        # 文件监听命令
├── config.ts           # 配置加载（.merxrc + CLI 合并）
└── utils/
    ├── input.ts        # stdin/文件/glob 输入处理
    ├── output.ts       # stdout/文件输出处理
    └── errors.ts       # 错误格式化和退出码
```

### 核心数据流

```
输入源 (stdin | file | glob)
    ↓
配置合并 (CLI flags > .merxrc > defaults)
    ↓
beautiful-mermaid 渲染
    ↓
输出目标 (stdout | file | outdir)
```

### 配置优先级实现

```typescript
// config.ts
interface MerxConfig {
  theme: string
  format: 'svg' | 'ascii' | 'png'
  outdir?: string
  ascii: { width: number }
  themes: Record<string, ThemeColors>
}

// 加载顺序：defaults → ~/.merxrc → ./.merxrc → CLI flags
```

## 实施策略

### 阶段划分

1. **阶段 1：核心渲染** - render 命令 + 基本 I/O
2. **阶段 2：配置系统** - .merxrc 加载 + 主题支持
3. **阶段 3：辅助命令** - themes、init、watch
4. **阶段 4：发布准备** - 构建、测试、文档

### 风险缓解

| 风险 | 缓解措施 |
|------|----------|
| beautiful-mermaid API 变更 | 锁定版本，添加集成测试 |
| 跨平台兼容性 | CI 测试 Linux/macOS/Windows |
| 性能不达标 | 早期基准测试，优化热路径 |

## 任务分解预览

将创建以下任务（限制在 10 个以内）：

- [ ] **任务 1**：项目初始化 - package.json、tsconfig、unbuild 配置
- [ ] **任务 2**：CLI 入口和 render 命令 - citty 集成、基本文件渲染
- [ ] **任务 3**：stdin/stdout 支持 - 管道输入检测、输出路由
- [ ] **任务 4**：配置系统 - .merxrc 加载、配置合并逻辑
- [ ] **任务 5**：主题和颜色标志 - --theme、自定义颜色标志
- [ ] **任务 6**：批量渲染 - glob 支持、--outdir
- [ ] **任务 7**：辅助命令 - themes、init
- [ ] **任务 8**：watch 命令 - 文件监听、重新渲染
- [ ] **任务 9**：错误处理和退出码 - 友好错误消息、标准退出码
- [ ] **任务 10**：构建和发布 - npm 发布配置、二进制入口

## 依赖项

### 外部依赖

| 包 | 版本 | 用途 |
|----|------|------|
| beautiful-mermaid | ^1.0.0 | 核心渲染引擎 |
| citty | ^0.1.0 | CLI 框架 |
| chokidar | ^3.5.0 | 文件监听（watch 命令） |
| fast-glob | ^3.3.0 | glob 模式匹配 |

### 可选依赖

| 包 | 版本 | 用途 |
|----|------|------|
| sharp | ^0.33.0 | PNG 输出 |

### 开发依赖

| 包 | 版本 | 用途 |
|----|------|------|
| unbuild | ^2.0.0 | 构建工具 |
| typescript | ^5.0.0 | 类型检查 |
| vitest | ^1.0.0 | 测试框架 |

## 成功标准（技术）

| 标准 | 验收条件 |
|------|----------|
| 性能 | `echo "graph LR; A-->B" \| merx` < 200ms |
| 零配置 | 无 .merxrc 时使用合理默认值 |
| 退出码 | 错误时返回非零退出码 |
| 测试覆盖 | 核心路径 > 80% 覆盖率 |
| 包大小 | 安装后 < 5MB（不含 sharp） |

## 估计工作量

| 阶段 | 任务数 | 复杂度 |
|------|--------|--------|
| 阶段 1：核心渲染 | 3 | 中 |
| 阶段 2：配置系统 | 2 | 低 |
| 阶段 3：辅助命令 | 3 | 低 |
| 阶段 4：发布准备 | 2 | 低 |

**关键路径**：任务 1 → 任务 2 → 任务 3（核心功能必须先完成）

## 已创建的任务

- [ ] #2 - 项目初始化 (parallel: false, 2-3h)
- [ ] #3 - CLI 入口和 render 命令 (parallel: false, 4-6h)
- [ ] #4 - stdin/stdout 支持 (parallel: false, 2-3h)
- [ ] #5 - 配置系统 (parallel: true, 2-3h)
- [ ] #6 - 主题和颜色标志 (parallel: true, 2-3h)
- [ ] #7 - 批量渲染 (parallel: true, 3-4h)
- [ ] #8 - 辅助命令 themes/init (parallel: true, 2-3h)
- [ ] #9 - watch 命令 (parallel: true, 2-3h)
- [ ] #10 - 错误处理和退出码 (parallel: true, 2-3h)
- [ ] #11 - 构建和发布 (parallel: false, 3-4h)

**总任务数**：10
**并行任务数**：6 (#5-#10)
**顺序任务数**：4 (#2-#4, #11)
**估计总工作量**：25-35 小时
