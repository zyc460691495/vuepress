
### 初始化
1. 初始化环境
```bash
git init
npm init
```
2. 安装VuePress
```bash
# 安装 vuepress
npm install -D vuepress@next
# 安装打包工具和主题
npm install -D @vuepress/bundler-vite@next @vuepress/theme-default@next
# 
npm install -D sass-embedded
```
3. 创建docs目录
```bash
# docs 目录是你放置 Markdown 文件的地方，它同时也会作为 VuePress 的源文件目录。
# docs/.vuepress 是放置所有和 VuePress 相关的文件的地方。当前这里只有一个配置文件。默认还会在该目录下生成临时文件、缓存文件和构建输出文件。建议你把它们添加到 .gitignore 文件中。
mkdir docs
mkdir docs/.vuepress
```
4. 创建配置文件
```js
// docs/.vuepress/config.js
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme(),
})

```
5. 添加`.gitignore`
```
# VuePress 默认临时文件目录
.vuepress/.temp
# VuePress 默认缓存目录
.vuepress/.cache
# VuePress 默认构建生成的静态文件目录
.vuepress/dist
```

### Get Start
1. 启动服务器

可以在`package.json`中添加脚本命令。
```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```
![img.png](img.png)
运行`docs:dev`脚本可以启动开发服务器
```
npm run docs:dev
```
运行`docs:build`脚本可以构建你的网站,在`docs/.vuepress/dist`目录中可以找到构建生成的静态文件。
```
npm run docs:build
```
### 配置
#### 配置文件
配置文件的生效顺序：
1. 当前工作目录cwd下： `vuepress.config.ts`>`vuepress.config.js`>`vuepress.config.mjs`
2. 源文件目录sourceDir下：`.vuepress/config.ts`>`.vuepress/config.js`>`.vuepress/config.mjs`

也可以通过命令直接指定：`vuepress dev docs --config my-config.ts`
#### 配置项
   [配置参考](https://vuepress.vuejs.org/zh/reference/config.html)
#### 客户端配置文件
客户端配置文件`client.js`针对浏览器客户端，用户可以自己添加组件实现功能，生效顺序和服务端的一样
### 页面
docs下的每个markdown文件对应一个页面
#### 路由
vuepress会根据markdown文件自动生成对应的访问路径
相对路径	路由路径


| 文件路径                | 访问路径         |
|---------------------|--------------|
| /README.md、index.md | /            |
| /lalala.md          | /lalala.html |
| /haha/README.md     | /haha        |

默认配置下， README.md 和 index.md 都会被转换成 index.html ，并且其对应的路由路径都是由斜杠结尾的。然而，如果你想同时保留这两个文件，就可能会造成冲突。在这种情况下，你可以设置 pagePatterns(上面提到的config.js中的配置项) 来避免某个文件被 VuePress 处理，例如使用 ['**/*.md', '!**/README.md', '!.vuepress', '!node_modules'] 来排除所有的 README.md 文件。
#### FrontMatter

你肯定注意到 Frontmatter 中的字段和配置文件中的站点配置十分类似。你可以通过 Frontmatter 来覆盖当前页面的 lang, title, description 等属性。因此，你可以把 Frontmatter 当作页面级作用域的配置。
```
---
date: yyyy-MM-dd
lang: zh-CN
title: 页面的标题
description: 页面的描述
layout: 布局
---
```
#### 内容
页面的主要内容是使用 Markdown 书写的。VuePress 首先会将 Markdown 转换为 HTML ，然后将 HTML 作为 Vue 单文件组件的 `<template>` 。
