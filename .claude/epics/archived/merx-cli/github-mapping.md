# GitHub Issue Mapping

## Epic

- #1 - Epic: Merx CLI - https://github.com/wuwe1/merx/issues/1

## Tasks

| Issue | Title | Local File |
|-------|-------|------------|
| #2 | 项目初始化 | [2.md](2.md) |
| #3 | CLI 入口和 render 命令 | [3.md](3.md) |
| #4 | stdin/stdout 支持 | [4.md](4.md) |
| #5 | 配置系统 | [5.md](5.md) |
| #6 | 主题和颜色标志 | [6.md](6.md) |
| #7 | 批量渲染 | [7.md](7.md) |
| #8 | 辅助命令 (themes, init) | [8.md](8.md) |
| #9 | watch 命令 | [9.md](9.md) |
| #10 | 错误处理和退出码 | [10.md](10.md) |
| #11 | 构建和发布 | [11.md](11.md) |

## Dependency Graph

```
#2 项目初始化
 │
 ├──→ #3 render 命令 ──→ #4 stdin/stdout
 │         │
 │         ├──→ #6 主题标志 ─┐
 │         ├──→ #7 批量渲染 ─┼──→ #11 构建发布
 │         ├──→ #9 watch ────┤
 │         └──→ #10 错误处理 ┘
 │
 └──→ #5 配置系统 ──→ #6 主题标志
              │
              └──→ #8 辅助命令 ──→ #11
```

## Synced

- Last sync: 2026-02-04T02:51:33Z
