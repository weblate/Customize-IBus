# 自定义 IBus

[![last-commit](https://img.shields.io/github/last-commit/HollowMan6/Customize-IBus)](https://github.com/HollowMan6/Customize-IBus/graphs/commit-activity)
[![release-date](https://img.shields.io/github/release-date/HollowMan6/Customize-IBus)](../../releases)

[![Followers](https://img.shields.io/github/followers/HollowMan6?style=social)](https://github.com/HollowMan6?tab=followers)
[![watchers](https://img.shields.io/github/watchers/HollowMan6/Customize-IBus?style=social)](https://github.com/HollowMan6/Customize-IBus/watchers)
[![stars](https://img.shields.io/github/stars/HollowMan6/Customize-IBus?style=social)](https://github.com/HollowMan6/Customize-IBus/stargazers)
[![forks](https://img.shields.io/github/forks/HollowMan6/Customize-IBus?style=social)](https://github.com/HollowMan6/Customize-IBus/network/members)

[![Open Source Love](https://img.shields.io/badge/-%E2%9D%A4%20Open%20Source-Green?style=flat-square&logo=Github&logoColor=white&link=https://hollowman6.github.io/fund.html)](https://hollowman6.github.io/fund.html)
[![GPL Licence](https://img.shields.io/badge/license-GPL-blue)](https://opensource.org/licenses/GPL-3.0/)
[![Repo-Size](https://img.shields.io/github/repo-size/HollowMan6/Customize-IBus.svg)](https://github.com/HollowMan6/Customize-IBus/archive/main.zip)

[![Total alerts](https://img.shields.io/lgtm/alerts/g/HollowMan6/Customize-IBus.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/HollowMan6/Customize-IBus/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/HollowMan6/Customize-IBus.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/HollowMan6/Customize-IBus/context:javascript)

(English version is down below)

在 GNOME Shell 中更改 IBus 的候选框方向、shell 主题、背景图片、字体和输入法默认语言。

![demo](img/demo.png)

## 安装

从 GNOME 扩展商店中获取：

[<img src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true" alt="Get it on GNOME Extensions" height="100" align="middle">][ego]

或者手动自行安装：

```bash
git clone https://github.com/HollowMan6/Customize-IBus.git
cd Customize-IBus && make install
```

或者[打包为 RPM](https://rpm-packaging-guide.github.io/)安装：

若为第一次打包，则执行

```bash
rpmdev-setuptree
```

随后，执行

```bash
wget https://github.com/HollowMan6/Customize-IBus/raw/main/gnome-shell-extension-customize-ibus.spec
rpmbuild --undefine=_disable_source_fetch -ba gnome-shell-extension-customize-ibus.spec
sudo dnf localinstall ~/rpmbuild/RPMS/noarch/gnome-shell-extension-customize-ibus-*.noarch.rpm
```

## 功能

![image](img/preference.png)

## 使用用户主题来更改 IBus 皮肤的实现

该功能已经被拆分，生成 IBus 皮肤样式表功能迁移到了[IBus-Theme](https://github.com/HollowMan6/IBus-Theme)。

目前该扩展支持导入该工具生成的样式表。

### _提示：_

1. 推荐使用 X11。如果你在 Wayland 中更改 IBus 主题，你的当前所有工作都将会丢失，因为 Wayland 下只支持通过重新登陆来重启 GNOME-shell。
2. 在 Fedora 和 Ubuntu，GNOME-shell [3.38](../../tree/3.38)(v3，v5，v9，v11(GNOME3.38 最终版))，40.0(v4，v8，v10，v12, v13)中通过了测试。
3. 对于那些不使用 GNOME 而是使用如 KDE，XFCE 等桌面环境的用户，更改 IBus GTK 主题也请使用我的另外一个项目[IBus-Theme](https://github.com/HollowMan6/IBus-Theme)。

## 更改 IBus 背景图片的实现

在[修复 Unity8-Wood 主题对 IBus 背景支持](https://github.com/openSUSE/mentoring/issues/158#issuecomment-813837436)时发现为`.candidate-popup-content`增加如下样式：

```css
background: url("assets/bg.png");
background-repeat: no-repeat;
background-size: cover;
```

即可实现对背景的修改。

进一步结合[ibus-font-setting](https://extensions.gnome.org/extension/1121/ibus-font-setting/)和[background-logo](https://pagure.io/background-logo-extension)，参考 GNOME-Shell 源代码中`candidate-popup-content`样式[对应组件](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/ibusCandidatePopup.js#L154)，并对其修改样式实现不重启 GNOME-Shell 进行 IBus 背景图片的修改。

## 备忘

- [x] 从[ibus-tweaker](https://github.com/tuberry/ibus-tweaker)中导入，去除与 IBus 无关功能。
- [x] 从用户主题中读取 IBus 相关样式
- [x] 将相关功能合并在一起。
- [x] V4: 从 GTK3 升级到 GTK4 来适配 GNOME40。
- [x] V8: 增加更改 IBus 背景图片功能。
- [x] 将从 GNOME-Shell 主题提取 IBus 样式功能剥离，使用 Python 下 CSS 解析器而并非正则表达式实现功能，生成额外 IBus 样式表供用户修改测试使用。
- [x] 本扩展改为接受用户提供的 IBus 样式表进行样式的应用。
- [ ] 重构代码。

## 致谢

1. [ibus-font-setting](https://extensions.gnome.org/extension/1121/ibus-font-setting/)
2. [ibus-tweaker](https://github.com/tuberry/ibus-tweaker)
3. [user-theme](https://gitlab.gnome.org/GNOME/gnome-shell-extensions/-/tree/master/extensions/user-theme)
4. [shell-restarter](https://github.com/koolskateguy89/gnome-shell-extension-shell-restarter)
5. [background-logo](https://pagure.io/background-logo-extension)

_该项目是谷歌编程之夏 (GSoC) 2021 于[OpenSUSE](https://github.com/openSUSE/mentoring/issues/158)社区成果的一部分。_

# Customize IBus

Customize IBus for orientation, shell theme, background picture, font and ascii mode auto-switch.

![demo](img/demo-en.png)

## Installation

[<img src="https://raw.githubusercontent.com/andyholmes/gnome-shell-extensions-badge/master/get-it-on-ego.svg?sanitize=true" alt="Get it on GNOME Extensions" height="100" align="middle">][ego]

Or manually:

```bash
git clone https://github.com/HollowMan6/Customize-IBus.git
cd Customize-IBus && make install
```

Or [Pack as RPM](https://rpm-packaging-guide.github.io/) to install：

If you are making RPM package for the first time, execute:

```bash
rpmdev-setuptree
```

then execute:

```bash
wget https://github.com/HollowMan6/Customize-IBus/raw/main/gnome-shell-extension-customize-ibus.spec
rpmbuild --undefine=_disable_source_fetch -ba gnome-shell-extension-customize-ibus.spec
sudo dnf localinstall ~/rpmbuild/RPMS/noarch/gnome-shell-extension-customize-ibus-*.noarch.rpm
```

## Features

![image](img/preference-en.png)

## Realization of Customizing IBus with User Theme

This function has been separated, generating IBus theme stylesheet has been moved to [IBus-Theme](https://github.com/HollowMan6/IBus-Theme).

Now this extension supports importing stylesheet generated by this tool.

### _NOTE:_

1. Recommend to use X11. If you change IME theme under Wayland, all your current work may be lost (Since Wayland only support relogin to restart the GNOME-shell).
2. Tested on Fedora and Ubuntu, GNOME-shell [3.38](../../tree/3.38)(v3, v5, v9, v11(final version for GNOME 3.38)), 40.0(v4, v8, v10, v12, v13).
3. For users who don't use GNOME but other desktop environments like KDE, XFCE, etc., please also use another project of mine [IBus-Theme](https://github.com/HollowMan6/IBus-Theme) to use a different GTK theme for IBus.

## Realization of Modifying IBus Background Picture

During [fixing Unity8-Wood theme and add support for IBus Backgound](https://github.com/openSUSE/mentoring/issues/158#issuecomment-813837436), I found that if I add the following style for class `.candidate-popup-content`：

```css
background: url("assets/bg.png");
background-repeat: no-repeat;
background-size: cover;
```

I can modify the background picture.

Further combining [ibus-font-setting](https://extensions.gnome.org/extension/1121/ibus-font-setting/) and [background-logo](https://pagure.io/background-logo-extension), referring to GNOME-Shell's source code, I found the [corresponding widget](https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/master/js/ui/ibusCandidatePopup.js#L154) for class `candidate-popup-content`, and modified the style to realize modifying IBus background picture without restarting GNOME-Shell.

## To-do

- [x] Import from [ibus-tweaker](https://github.com/tuberry/ibus-tweaker) and remove features unrelated to IBus.
- [x] Read from user themes and apply only for ibus.
- [x] Merge functions related together.
- [x] V4: Update from GTK3 to GTK4 to adapt for GNOME40.
- [x] V8: Add functionality to modify IBus Background picture.
- [x] Strip the current function of extracting IBus style from Gnome shell theme, implement using CSS parser libraries in Python instead of regular expression. Additional IBus style sheets are generated for users to modify and test.
- [x] Modify this extension to accept IBus style sheets provided by users for style application.
- [ ] Refactor code.

## Acknowledgements

1. [ibus-font-setting](https://extensions.gnome.org/extension/1121/ibus-font-setting/)
2. [ibus-tweaker](https://github.com/tuberry/ibus-tweaker)
3. [user-theme](https://gitlab.gnome.org/GNOME/gnome-shell-extensions/-/tree/master/extensions/user-theme)
4. [shell-restarter](https://github.com/koolskateguy89/gnome-shell-extension-shell-restarter)
5. [background-logo](https://pagure.io/background-logo-extension)

_This project is part of the achievement of the Google Summer of Code 2021 at [OpenSUSE](https://github.com/openSUSE/mentoring/issues/158)._

[ego]: https://extensions.gnome.org/extension/4112/customize-ibus/
