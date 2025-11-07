# Repository Guidelines

## 项目结构与模块

- Monorepo：pnpm + Turbo。应用在 `apps/*`：`host-app`(Vue 3 / Module Federation)、`react-app`、`vue-app`、`svelte-app`、`backend`(Hono + tRPC)。库在 `packages/*`：`api`(tRPC 路由)、`db`(Drizzle + Postgres)、`ui`(Lit)、`tsconfig`。
- 源码：`apps/*/src`、`packages/*/src`；静态资源：`apps/*/public`、`packages/ui/public`。

## 构建、开发与测试

- 安装：`pnpm i`
- 全局开发：`pnpm dev`；单包：`pnpm --filter @zenith/react-app dev` 或 `pnpm -C apps/react-app dev`
- 构建：`pnpm build`；单包构建：同上执行 `build`
- Lint：`pnpm lint`
- 测试：`pnpm test`（Turbo 聚合）。各包需自备 `test` 脚本（推荐 Vitest）
- 数据库（`@zenith/db`）：`pnpm --filter @zenith/db db:generate|db:migrate|db:push|db:studio`

## 代码风格与命名

- TypeScript、ESM、Node >= 18；不写兼容性/Polyfill 代码。
- Prettier：2 空格、分号、单引号、`printWidth=80`、`trailingComma=es5`。
- ESLint：`@typescript-eslint` + `prettier`，启用 `no-unused-vars`（下划线前缀参数忽略）。
- 命名：组件 `PascalCase`（.tsx/.vue/.svelte），函数/变量 `camelCase`，文件/目录 `kebab-case`，环境变量 `UPPER_SNAKE_CASE`，通用类型集中于 `types.ts`。

## 测试规范

- 单测：Vitest；文件名 `*.test.ts(x)` 或 `__tests__` 目录，就近放置。
- E2E：Playwright（可选）。新增功能至少覆盖关键路径。
- 覆盖率目标由模块维护者设定，但别敷衍。

## 提交与 PR

- 使用 Conventional Commits：`feat|fix|refactor|docs|test|chore|ci|build`，作用域示例：`feat(host-app): expose dashboard remote`。
- PR 要求：清晰描述、关联 Issue、UI 变更附截图；涉及数据库需说明迁移影响；CI 全绿；小步提交、可回滚。

## 安全与配置

- 勿提交密钥。使用 `.env`（`packages/db/drizzle.config.ts` 读取 `DATABASE_URL`）。
- Turbo 监测 `**/.env.*local`；本地变量写到 `*.local` 文件。

