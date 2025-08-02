# Chat Electron App

本项目基于 Electron + Vite + Vue3，采用主进程与渲染进程物理分离结构，支持高效开发与一键打包。

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## 目录结构

- `src/main`      —— Electron 主进程代码
- `src/renderer`  —— 前端渲染进程（Vue3）
- `public`        —— 静态资源
- `release/bundled` —— Vite/Electron 打包产物
- `script/dev`    —— 开发环境启动脚本
- `script/release`—— 打包发布脚本

## 开发环境启动

```sh
npm install
npm run start
```
- 启动 Vite Dev Server 与 Electron，自动热更新。

## 打包生产环境

```sh
npm run mybuild
```
- 自动构建前端、主进程并用 electron-builder 打包，产物在 `release/` 目录。

## 常见问题与优化

- **白屏问题**：生产包需确保 Vite build 自动生成的 index.html 被 Electron 主进程加载。
- **首屏白屏优化**：主进程窗口创建时 `show: false`，页面 `ready-to-show` 后再显示，避免用户看到白屏。
- **路径配置**：@ alias 指向 src/renderer，vite.config.ts 已适配。

## 其它说明

- `.DS_Store` 等无关文件已自动忽略（见 .gitignore）。
- 更多配置见各脚本与配置文件注释。

---
如有其它问题请参考脚本注释或联系维护者。
