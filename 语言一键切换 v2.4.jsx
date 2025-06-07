/**
 * @file AE_Language_Switcher_v2.4.jsx
 * @author 月月-0v0, EricZhou
 * @version 2.4.0
 *
 * --- 安装和使用 ---
 * 1. 【重要】如果安装过旧版，请先删除。将此 .jsx 文件放入 AE 的 "ScriptUI Panels" 文件夹。
 * (Windows 示例: C:\Program Files\Adobe\Adobe After Effects 2024\Support Files\Scripts\ScriptUI Panels)
 * (macOS 示例: /Applications/Adobe After Effects 2024/Scripts/ScriptUI Panels)
 * 2. 重启 After Effects。
 * 3. 在顶部 "窗口" (Window) 菜单的最下方，点击运行此脚本。
 */

(function createDockablePanel(thisObj) {
    function getScriptFolderCorrectedPath() {
        if (!$.fileName) {
            return null;
        }
        try {
            var originalPath = new File($.fileName).path;
            var decodedPath = File.decode(originalPath);
            var finalPath = decodedPath;
            if (decodedPath.match(/^\/([a-zA-Z])\//)) {
                var driveLetter = decodedPath.charAt(1).toUpperCase();
                finalPath = driveLetter + ":" + decodedPath.substring(2);
            }
            return finalPath;
        } catch (e) {
            return null;
        }
    }

    function getAmtFolderPathFromScriptLocation() {
        var scriptFolderPath = getScriptFolderCorrectedPath();
        if (!scriptFolderPath) {
            return null;
        }
        try {
            var scriptUIFolder = new Folder(scriptFolderPath);
            if (scriptUIFolder.parent && scriptUIFolder.parent.parent) {
                var supportFilesFolder = scriptUIFolder.parent.parent;
                var amtFolder = new Folder(supportFilesFolder.fsName + "/AMT");
                if (amtFolder.exists) {
                    return amtFolder.fsName;
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    function hasWritePermissions() {
        var securitySetting = app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
        if (securitySetting === 1) {
            return true;
        } else {
            alert("【脚本权限不足】\n\n请先启用AE的脚本文件读写权限。\n\n操作步骤：\n1. 打开AE首选项 (编辑 > 首选项 > 脚本和表达式...)。\n2. 勾选【允许脚本写入文件和访问网络】选项。\n3. 点击“确定”后，再次运行此脚本。");
            return false;
        }
    }

    function buildUI(panel) {
        if (!panel) return;

        var targetFolderPath = getAmtFolderPathFromScriptLocation();

        function performLanguageSwitch(targetLang) {
            try {
                var targetLangName = (targetLang === 'zh_CN') ? '中文' : '英文';
                var amtFolder = new Folder(targetFolderPath);
                var appXmlFile = new File(amtFolder.fsName + "/application.xml");
                var bakXmlFile = new File(amtFolder.fsName + "/application_bak.xml");

                if (!bakXmlFile.exists) {
                    if (!appXmlFile.exists) {
                        alert("错误：关键文件 application.xml 不存在，无法创建备份。");
                        return;
                    }
                    if (!appXmlFile.copy(bakXmlFile.fsName)) {
                        alert("【文件权限错误】\n\n创建备份文件失败，通常是因为操作系统的文件权限不足。\n\n【解决方法】\n请关闭 After Effects，然后右键点击AE图标 -> 以管理员身份运行，再重新运行此脚本。");
                        return;
                    }
                }
                
                if (!appXmlFile.exists) {
                    alert("错误：application.xml 文件不存在，无法执行修改。");
                    return;
                }

                appXmlFile.open("r");
                appXmlFile.encoding = "UTF-8";
                var originalContent = appXmlFile.read();
                appXmlFile.close();

                var langRegex = /<Data key="installedLanguages">(\w{2}_\w{2})<\/Data>/i;
                var match = originalContent.match(langRegex);

                if (!match) {
                    alert("错误：在 application.xml 中未能找到语言设置。\n文件可能已损坏或格式不兼容。");
                    return;
                }

                var currentLang = match[1];
                if (currentLang.toLowerCase() === targetLang.toLowerCase()) {
                    alert("提示：当前语言已是 " + targetLangName + "，无需切换。");
                    return;
                }

                var newContent = originalContent.replace(langRegex, '<Data key="installedLanguages">' + targetLang + '</Data>');

                appXmlFile.open("w");
                appXmlFile.encoding = "UTF-8";
                var writeSuccess = appXmlFile.write(newContent);
                appXmlFile.close();

                if (writeSuccess) {
                    alert("切换成功！\n\n语言已设置为 " + targetLangName + " 。\n请完全重启 After Effects使设置生效。");
                } else {
                    alert("【严重错误】写入 application.xml 失败！\n\n文件可能已损坏或被占用。\n\n如果软件无法启动，请到以下目录：\n" + targetFolderPath + "\n手动将 application_bak.xml 复制并重命名为 application.xml 来恢复。");
                }

            } catch (e) {
                alert("发生未知脚本错误：\n" + e.toString());
            }
        }

        panel.text = "author: 月月-0v0";
        panel.orientation = "column";
        panel.alignChildren = ["center", "top"];
        panel.spacing = 10;
        panel.margins = 15;

        if (!targetFolderPath) {
            var errorText = panel.add("statictext", [0, 0, 310, 80], "错误：无法自动推导AE安装路径！\n\n请确认：\n1. 此脚本放置在正确的 'ScriptUI Panels' 文件夹内。\n2. AE是以文件形式运行此脚本，而非直接粘贴代码到控制台。\n3. 以管理员身份运行AE后重试。", { multiline: true });
            errorText.alignment = "center";
        } else {
            var buttonGroup = panel.add("group");
            buttonGroup.orientation = "row";
            buttonGroup.spacing = 10;

            var switchToCNBtn = buttonGroup.add("button", undefined, "切换为 中文 (zh_CN)");
            switchToCNBtn.size = [150, 40];

            var switchToENBtn = buttonGroup.add("button", undefined, "切换为 英文 (en_US)");
            switchToENBtn.size = [150, 40];

            var helpText = panel.add('statictext', [0, 0, 310, 20], "提示：切换后需要重启AE才能生效。");
            helpText.alignment = "left";
            
            switchToCNBtn.onClick = function() {
                if (hasWritePermissions()) {
                    performLanguageSwitch('zh_CN');
                }
            };

            switchToENBtn.onClick = function() {
                if (hasWritePermissions()) {
                    performLanguageSwitch('en_US');
                }
            };
        }

        panel.layout.layout(true);
        return panel;
    }

    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "语言一键切换", undefined, { resizeable: false });
    if (pal) {
        buildUI(pal);
    }

})(this);