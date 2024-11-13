# 预览

![preview](./preview.png)

# 简介

- 这是一个Firefox浏览器扩展，它对Bing搜索引擎的高级搜索语法进行了简单的封装，以便过滤搜索结果
- 为何基于Bing而非Google或百度？
  1. Google在中国大陆访问较为困难
  2. 百度搜索效果一言难尽
  3. 本人习惯使用Bing

- 画大饼：
  - [ ] 增加语法高亮
  - [ ] 移植到基于Chromium内核的浏览器上

# 安装

## 在线安装

- 请移步至[firefox addons](https://addons.mozilla.org/zh-CN/firefox/addon/bing-/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)，点击**添加到 Firefox**

## 离线安装

- 请移步至[releases](https://github.com/BreakTheMyth/bing-minus-minus/releases/)，下载**bing-minus-minus.xpi**文件，在**附加组件管理器**中点击**从文件安装附加组件...**

# 使用

## 快捷操作

- `Esc` ：**打开|关闭**搜索框
- `Enter` ：**搜索|确认选项**
- `Shift` + `Enter` ：换行
- `Alt` + `N` ：切换至下一条选项
- `Alt` + `P` ：切换至上一条选项
- `Alt` + `B` ：移动光标至前一个单词
- `Alt` + `F` ：移动光标至后一个单词
- `Ctrl` + `A` ：首次触发只选中光标上的单词
- `Ctrl` + `鼠标左键`点击**网址|标题**添加过滤规则

## 语法规则

- 参见：[高级搜索选项](https://support.microsoft.com/zh-cn/topic/%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E9%80%89%E9%A1%B9-b92e25f1-0085-4271-bdf9-14aaea720930), [运算符优先级](https://go.microsoft.com/fwlink?LinkId=279927), [高级搜索关键字](https://support.microsoft.com/zh-cn/topic/%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E5%AD%97-ea595928-5d63-4a0b-9c6b-0b769865e78a)