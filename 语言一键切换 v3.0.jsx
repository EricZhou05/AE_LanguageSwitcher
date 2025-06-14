/**
 * @file AE_Language_Switcher_v3.0.jsx
 * @author 月月-0v0 & EricZhou
 * @version 3.0
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
        if (!$.fileName) return null;
        try {
            var finalPath = File.decode(new File($.fileName).path);
            if (finalPath.match(/^\/([a-zA-Z])\//)) {
                finalPath = finalPath.charAt(1).toUpperCase() + ":" + finalPath.substring(2);
            }
            return finalPath;
        } catch (e) { return null; }
    }

    function findAEPaths() {
        var scriptUIPath = getScriptFolderCorrectedPath();
        if (!scriptUIPath) return null;

        var supportFilesPath = new Folder(scriptUIPath).parent;
        var aeRootPath = new Folder(supportFilesPath).parent;

        if (supportFilesPath.name !== "Scripts" || aeRootPath.name.indexOf("Adobe After Effects") === -1) {
             var scriptPath = new Folder(scriptUIPath).parent;
             supportFilesPath = new Folder(scriptPath).parent;
             aeRootPath = new Folder(supportFilesPath).parent;
        }

        return {
            root: aeRootPath.fsName,
            supportFiles: supportFilesPath.fsName,
            scriptUI: scriptUIPath,
            amt: supportFilesPath.fsName + "/AMT"
        };
    }

    function findAEExecutable(aeRootPath) {
        var aeRootFolder = new Folder(aeRootPath);
        var files = aeRootFolder.getFiles();
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file instanceof File) {
                 if ($.os.indexOf("Windows") > -1) {
                    if (file.name.toLowerCase() === "afterfx.exe") return file.fsName;
                } else {
                     if (file.name.match(/Adobe After Effects \d{4}\.app/)) return file.fsName;
                }
            }
        }
        var supportFolder = new Folder(aeRootPath + "/Support Files");
        if (supportFolder.exists){
            files = supportFolder.getFiles();
             for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file instanceof File && $.os.indexOf("Windows") > -1 && file.name.toLowerCase() === "afterfx.exe") {
                    return file.fsName;
                }
            }
        }
        return null;
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

    function performLanguageSwitch(targetLang) {
        try {
            var targetLangName = (targetLang === 'zh_CN') ? '中文' : '英文';
            var amtFolder = new Folder(aePaths.amt);
            var appXmlFile = new File(amtFolder.fsName + "/application.xml");
            var bakXmlFile = new File(amtFolder.fsName + "/application_bak.xml");

            if (!bakXmlFile.exists) {
                if (!appXmlFile.exists) {
                    alert("错误：关键文件 application.xml 不存在，无法创建备份。\n路径: " + appXmlFile.fsName);
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
                langRegex = /<Data key="installedLanguages">([a-zA-Z0-9_,]+)<\/Data>/i;
                match = originalContent.match(langRegex);
                if (!match) {
                    alert("错误：在 application.xml 中未能找到语言设置。\n文件可能已损坏或格式不兼容。");
                    return;
                }
            }

            var currentLang = match[1].split(',')[0]; 
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
                alert("切换成功！\n\n语言已设置为 " + targetLangName + " 。\n请重启 After Effects 使设置生效。");
            } else {
                alert("【严重错误】写入 application.xml 失败！\n\n文件可能已损坏或被占用。\n\n如果软件无法启动，请到以下目录：\n" + aePaths.amt + "\n手动将 application_bak.xml 复制并重命名为 application.xml 来恢复。");
            }

        } catch (e) {
            alert("发生未知脚本错误：\n" + e.toString());
        }
    }


    function openURL(url) {
        try {
            if ($.os.indexOf("Windows") > -1) {
                system.callSystem("cmd.exe /c start \"\" \"" + url + "\"");
            } else {
                system.callSystem("open \"" + url + "\"");
            }
        } catch (e) {
            alert("无法打开链接，请手动访问：\n" + url, "错误");
        }
    }

    function restartAE() {
        var aeExecutablePath = findAEExecutable(aePaths.root);
        if (!aeExecutablePath) {
            alert("错误：无法找到 After Effects 主程序！无法自动重启。", "重启失败");
            return;
        }

        try {
            if ($.os.indexOf("Windows") > -1) {
                var batContent = '@echo off\r\n' +
                                'chcp 65001 > nul\r\n' +
                                'echo. & echo 正在关闭 After Effects... \r\n' +
                                'echo (如果弹出保存提示，请操作后等待脚本自动重启)\r\n' +
                                'taskkill /IM AfterFX.exe\r\n\r\n' +
                                ':waitloop\r\n' +
                                'tasklist /FI "IMAGENAME eq AfterFX.exe" 2>NUL | find /I /N "AfterFX.exe" >NUL\r\n' +
                                'if "%ERRORLEVEL%"=="0" (\r\n' +
                                '    timeout /t 1 /nobreak > NUL\r\n' +
                                '    goto waitloop\r\n' +
                                ')\r\n\r\n' +
                                'echo. & echo After Effects 已关闭，正在重新启动...\r\n' +
                                'start "" "' + aeExecutablePath + '"\r\n' +
                                'del "%~f0"';
                var batFile = new File(Folder.temp.fsName + "/ae_smart_restart.bat");
                batFile.open("w");
                batFile.encoding = "UTF-8";
                batFile.write(batContent);
                batFile.close();
                batFile.execute();
            } else {
                 var shContent = '#!/bin/bash\n' +
                                'echo "正在关闭 After Effects..."\n' +
                                'osascript -e \'tell application "Adobe After Effects" to quit\'\n' +
                                'while pgrep -x "Adobe After Effects"; do\n' +
                                '    sleep 1\n' +
                                'done\n' +
                                'echo "After Effects 已关闭，正在重新启动..."\n' +
                                'open "' + aeExecutablePath + '"\n' +
                                'rm "$0"';
                var shFile = new File(Folder.temp.fsName + "/ae_smart_restart.sh");
                shFile.open("w");
                shFile.encoding = "UTF-8";
                shFile.write(shContent);
                shFile.close();
                shFile.execute();
            }
        } catch (e) {
            alert("重启过程中发生错误：\n" + e.toString(), "错误");
        }
    }

    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "AE语言一键切换 v3.0", undefined, { resizeable: true, closeButton: true });
    if (pal === null) return;
    
    pal.orientation = "column";
    pal.alignChildren = ["fill", "top"];
    pal.spacing = 10;
    pal.margins = 15;
    
    var panel = pal.add("panel", undefined, "语言切换");
    panel.orientation = "column";
    panel.alignChildren = ["fill", "top"];
    panel.spacing = 10;
    panel.margins = 10;
    
    var aePaths = findAEPaths();
    var buttonGroup = null;
    var extraButtonGroup = null;

    if (!aePaths || !aePaths.amt) {
        var errorText = panel.add("statictext", undefined, "错误：无法自动推导AE安装路径！\n\n请确认：\n1. 此脚本放置在正确的 'ScriptUI Panels' 文件夹内。\n2. AE是以文件形式运行此脚本，而非直接粘贴代码到控制台。\n3. 以管理员身份运行AE后重试。", { multiline: true });
        errorText.alignment = "left";
    } else {
        buttonGroup = panel.add("group");
        buttonGroup.orientation = "row";
        buttonGroup.alignChildren = ["fill", "center"];
        buttonGroup.spacing = 10;

        var switchToCNBtn = buttonGroup.add("button", undefined, "切换为 中文");
        switchToCNBtn.helpTip = "将AE界面语言切换为简体中文(zh_CN)";

        var switchToENBtn = buttonGroup.add("button", undefined, "切换为 英文");
        switchToENBtn.helpTip = "将AE界面语言切换为美式英文(en_US)";
        
        var helpText = panel.add('statictext', undefined, "提示：重启AE生效");
        helpText.alignment = "left";
        
        var extraPanel = pal.add("panel", undefined, "附加功能");
        extraPanel.orientation = "column";
        extraPanel.alignChildren = ["fill", "top"];
        extraPanel.spacing = 10;
        extraPanel.margins = 10;

        extraButtonGroup = extraPanel.add("group");
        extraButtonGroup.orientation = "row";
        extraButtonGroup.alignChildren = ["fill", "center"];
        extraButtonGroup.spacing = 10;
        
        var restartBtn = extraButtonGroup.add("button", undefined, "一键重启 AE");
        restartBtn.helpTip = "点击后将关闭并自动重启AE";
        
        var homepageBtn = extraButtonGroup.add("button", undefined, "访问仓库主页");
        homepageBtn.helpTip = "https://github.com/EricZhou05/AE_LanguageSwitcher";
        
        switchToCNBtn.onClick = function() { if (hasWritePermissions()) performLanguageSwitch('zh_CN'); };
        switchToENBtn.onClick = function() { if (hasWritePermissions()) performLanguageSwitch('en_US'); };
        restartBtn.onClick = restartAE;
        homepageBtn.onClick = function() { openURL("https://github.com/EricZhou05/AE_LanguageSwitcher"); };
    }

    var authorText = pal.add('statictext', undefined, 'v3.0 by 月月-0v0');
    authorText.alignment = 'right';

    var currentOrientation = "row";
    function updateLayout() {
        if (!buttonGroup) return;

        var newOrientation = (pal.size.height > pal.size.width) ? "column" : "row";
        
        if (newOrientation === "column") {
            pal.minimumSize = [170, 200];
        } else {
            pal.minimumSize = [320, 150];
        }

        if (newOrientation !== currentOrientation) {
            currentOrientation = newOrientation;
            
            buttonGroup.orientation = currentOrientation;
            if (extraButtonGroup) extraButtonGroup.orientation = currentOrientation;
            
            var alignment = (currentOrientation === "column") ? ["fill", "top"] : ["fill", "center"];
            buttonGroup.alignChildren = alignment;
            if (extraButtonGroup) extraButtonGroup.alignChildren = alignment;
            
            pal.layout.layout(true);
        }
    }

    pal.onResizing = pal.onResize = function() { 
        if (this.layout) {
            updateLayout();
            this.layout.resize(); 
        }
    };

    pal.layout.layout(true);
    updateLayout();
    pal.layout.resize();

    if (pal instanceof Window) {
        pal.center();
        pal.show();
    }
    
})(this);