# AE LanguageSwitcher (After Effects 语言一键切换脚本)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![After Effects](https://img.shields.io/badge/Adobe%20AE-2020--2025-orange.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-brightgreen.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/EricZhou05/AE_LanguageSwitcher/pulls)

用于一键切换 Adobe After Effects 界面语言的高效实用脚本面板。可智能自适应不同版本的 AE 以及安装路径，并在**简体中文 (zh_CN)** 与**英文 (en_US)** 之间快速无缝切换。

A lightweight and responsive ScriptUI panel for Adobe After Effects to switch interface language between Simplified Chinese (zh_CN) and English (en_US) in one click.

<p align="center">
  <img src="https://github.com/user-attachments/assets/76f709df-cbdd-4ffb-9b35-828635e8f23f" alt="AE LanguageSwitcher Demo Screenshot" width="700">
</p>

---

## ✨ 功能特性 (Features)

- **One-Click Switch (一键切换)**：摆脱繁琐的手动修改配置文件流程，自适应不同版本 AE 与多语言安装路径，点击按钮立刻完成语言切换。
- **Auto Restart (一键安全重启)**：支持一键快速安全重启 After Effects（工程未保存时会自动弹窗提醒，避免工作丢失）。
- **Auto Backup (自动备份与容灾)**：修改前自动将原始配置文件备份为 `application_bak.xml`，具备完备的异常回滚机制。
- **Dockable ScriptUI (可停靠响应式面板)**：基于原生 ScriptUI 打造，完美支持停靠在 AE 任意工作区，自动适配深浅色与高分辨率屏。
- **Permission Self-Check (权限自检与指引)**：主动检测 AE 脚本写入权限，若未开启会自动弹出友好指引。

---

## 🚀 安装步骤 (Installation & Setup)

1. **清理旧版**：若曾安装过旧版脚本，请先从脚本目录将其移除。
2. **放置脚本**：下载本仓库的 `语言一键切换 v3.0.jsx` 文件，复制到 After Effects 的 `ScriptUI Panels` 目录下：
   - **Windows 默认路径**:
     ```text
     C:\Program Files\Adobe\Adobe After Effects <版本号>\Support Files\Scripts\ScriptUI Panels
     ```
   - **macOS 默认路径**:
     ```text
     /Applications/Adobe After Effects <版本号>/Scripts/ScriptUI Panels
     ```
3. **加载面板**：启动 After Effects，在顶部菜单栏选择 **窗口 (Window)**，在菜单底部点击 **语言一键切换 v3.0** 即可打开面板。

---

## 📖 使用指南 (Usage & Quick Start)

1. 从 AE 顶部菜单 `Window -> 语言一键切换 v3.0` 启动面板（建议将其拖拽停靠在常用面板组旁）。
2. 在面板中点击目标语言按钮：
   - **切换为 中文 (zh_CN)**
   - **切换为 英文 (en_US)**
3. 弹出切换成功提示后，点击面板下方的 **一键重启 AE** 按钮生效配置（亦可手动重启软件）。

---

## 🏗️ 架构与实现原理 (Architecture & Internals)

1. **Path Deduction (安装目录与配置解析)**：
   - 脚本通过 `Folder.appPackage` 动态向上解析宿主执行环境，自动定位底层 `AMT/application.xml` 配置文件。
2. **Atomic XML Update (原子更新与回退保障)**：
   - 提取 `<Data key="installedLanguages">` 节点并替换目标语言代码；
   - 采用“先备份、后校验、再落盘”的原子写入流程，彻底杜绝因意外断电或权限中断导致的文件损坏。
3. **Responsive UI Engine (响应式组件布局)**：
   - 基于 ExtendScript 构建自适应容器流式排版，动态监听面板尺寸变化并实时重排按钮矩阵。

---

## 🧪 兼容性与测试验证 (Compatibility & Testing)

本脚本已在以下环境完成实机自动化与手工兼容性测试 (Test Matrix)：

| 操作系统 (OS) | Adobe After Effects 版本 | 测试状态 (Status) |
| :--- | :--- | :--- |
| Windows 10 / Windows 11 | AE 2020, 2021, 2022, 2023, 2024, 2025 | ✅ Passed (All Features) |
| macOS (Intel / Apple Silicon M1/M2/M3) | AE 2021, 2022, 2023, 2024 | ✅ Passed (All Features) |

---

## ⚙️ 权限与配置说明 (Configuration & Permissions)

为了使脚本能够正常读写配置文件，必须在 AE 中开启脚本文件访问权限：

1. 打开 AE 菜单：`编辑 (Edit)` > `首选项 (Preferences)` > `脚本和表达式 (Scripting & Expressions)`。
2. 勾选 **允许脚本写入文件和访问网络 (Allow Scripts to Write Files and Access Network)**。
3. 若 Windows 下遇到系统级 UAC 权限拦截，请右键 After Effects 图标并选择 **以管理员身份运行**。

---

## 🔧 故障排除 (Troubleshooting & FAQ)

- **Q: 脚本提示“无法自动推导 AE 安装路径”？**
  - 请确认脚本已放置在 `ScriptUI Panels` 目录下并通过 `Window` 菜单启动，请勿直接在调试控制台或通过“文件-脚本-运行脚本文件”单次执行。
- **Q: 语言切换后软件异常或配置损坏？**
  - 进入 AE 目录下的 `AMT` 文件夹，删除损坏的 `application.xml`，将自动生成的 `application_bak.xml` 复制并重命名回 `application.xml` 即可秒级复原。

---

## 👨‍💻 贡献与作者 (Authors & Contributing)

- **开发者**: 月月-0v0 / [@EricZhou05](https://github.com/EricZhou05)
- 欢迎提交 [Issue](https://github.com/EricZhou05/AE_LanguageSwitcher/issues) 反馈建议，或发起 [Pull Request](https://github.com/EricZhou05/AE_LanguageSwitcher/pulls) 参与贡献！

---

## 📄 开源许可 (License)

本项目遵循 [MIT License](LICENSE) 开源协议。
