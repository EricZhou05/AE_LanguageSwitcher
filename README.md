# After Effects 语言一键切换脚本

![GitHub License](https://img.shields.io/github/license/EricZhou05/AE_LanguageSwitcher)

用于一键切换Adobe After Effects界面语言的实用脚本。可自适应不同版本的AE以及安装目录，并快速地在**简体中文 (zh_CN)** 和**英文 (en_US)** 之间切换软件的界面语言。

<p align="center">
  <img src="https://github.com/user-attachments/assets/76f709df-cbdd-4ffb-9b35-828635e8f23f" alt="PixPin">
</p>

## ✨ 功能特性

- **一键切换**：摆脱手改配置文件，点击按钮立刻切换！脚本可以自适应不同版本的AE与不同的安装目录。
- **一键重启**：自动关闭并重启AE（工程未保存时会提示再重启）。
- **自动备份**：自动备份原始配置文件为 `application_bak.xml`，以防意外发生。 
- **响应式布局**：自动调整布局，完美适配各种工作区。
- **可停靠面板**：像AE原生面板一样停靠在工作区中，方便随时调用。
- **权限检查**：主动检测所需权限，并引导用户开启相应设置。
- **清晰的用户提示**：无论是切换成功还是发生错误，都会有明确的弹窗提示。

## 🚀 安装步骤

1.  **如果曾安装过旧版脚本，请先从将其删除。**
2.  将 `语言一键切换 v3.0.jsx` 文件复制到 After Effects 的 `ScriptUI Panels` 文件夹中。
    * **Windows 路径示例**:
        `C:\Program Files\Adobe\Adobe After Effects 2024\Support Files\Scripts\ScriptUI Panels`
    * **macOS 路径示例**:
        `/Applications/Adobe After Effects 2024/Scripts/ScriptUI Panels`
3.  重启 After Effects。
4.  在顶部菜单栏选择 **窗口 (Window)** ，在菜单的最下方找到并点击 **语言一键切换 v2.4.jsx** 来运行脚本。

## 📖 使用方法

1.  从 **窗口 (Window)** 菜单启动脚本面板。
2.  在弹出的面板中，点击你想要切换的目标语言按钮：
    * **切换为 中文**
    * **切换为 英文**
3.  切换成功后，点击【附加功能】区域的 “**一键重启 AE**” 按钮，脚本将自动关闭并重启 After Effects，使设置生效。也可以选择手动重启AE。

## ⚠️ 注意事项

### 脚本权限

为了让脚本能成功修改配置文件，必须开启 AE 的脚本文件读写权限。

- **操作路径**: `编辑 (Edit)` > `首选项 (Preferences)` > `脚本和表达式 (Scripting & Expressions)`
- **勾选项**: 勾选 **允许脚本写入文件和访问网络 (Allow Scripts to Write Files and Access Network)**

脚本在运行时会自动检查此项，如果未开启，会弹出相应对话框提示设置。

### 管理员权限

在 Windows 系统上，如果遇到因文件权限不足而导致的“创建备份文件失败”或“写入失败”的错误，请尝试以下操作：
1.  完全关闭 After Effects。
2.  右键点击桌面上的 After Effects 图标。
3.  选择 **“以管理员身份运行”**。
4.  再次运行此脚本进行语言切换。

## 🔧 故障排除

- **脚本报错“无法自动推导AE安装路径”**:
    - 请确保脚本确实放置在正确的 `ScriptUI Panels` 文件夹内。
    - 确保您是通过AE的“窗口”菜单运行脚本，而不是直接将代码粘贴到AE的控制台中执行。

- **切换后软件无法启动或出现异常**:
    - 极少发生的情况，若出现，可以通过手动恢复备份文件来解决。
    - 进入AE安装目录下的 `AMT` 文件夹 (例如 `C:\Program Files\Adobe\Adobe After Effects 2024\Support Files\AMT`)。
    - 删除已损坏的 `application.xml` 文件。
    - 将 `application_bak.xml` 文件复制一份，并将其重命名为 `application.xml`。
    - 重启 After Effects 即可恢复到切换前的状态。

## 👨‍💻 作者

-   月月-0v0
-   EricZhou
