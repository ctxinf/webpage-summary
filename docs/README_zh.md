
<h1 align="center" style="display: flex; flex-direction: row;justify-content:center; align-items: center; gap:.25em;">
 <img src="../assets/16.png" width="26"/>
 <span> 网页总结 Webpage Summary </span>
</h1>
<p align="center">使用AI对网页文本内容进行总结的浏览器扩展 (使用您自己的Apikey)</p>


[![wakatime](https://wakatime.com/badge/user/6476bd96-6b6e-4943-b20d-e7f34889cb5a/project/34d281d5-2656-4ac2-a17c-4141f46d06f7.svg)](https://wakatime.com/badge/user/6476bd96-6b6e-4943-b20d-e7f34889cb5a/project/34d281d5-2656-4ac2-a17c-4141f46d06f7)

<p align="center">
  [<a href="/README.md">English</a>]
  [<span>简体中文</span>]
</p>

<p align="center">
[<a href="https://chromewebstore.google.com/detail/dhdnamkkepndgjimbpacmibkblndangk?utm_source=item-share-cp">
  <img src="/docs/img/google-store.svg" alt="Chrome Webstore">Chrome Webstore
</a>]
[<a href="https://microsoftedge.microsoft.com/addons/detail/jidechjgegiafmcmmhlifebacppcfboe">
  <img src="/docs/img/edge.svg" alt="Edge Addons">Edge Addons
</a>]
[<a href="https://addons.mozilla.org/firefox/addon/webpage-summary/">
  <img src="/docs/img/firefox.svg" alt="Firefox Addons">Firefox Addons
</a>]
</p>

<img src="/docs/img/screenshot.png">

<details>
  <summary>
    👉 Demo GIFs & Videos
  </summary>

  ![summary](/docs/img/summary-anim.webp)
  
  https://github.com/user-attachments/assets/2a610cb2-e268-46a5-ab06-064a2037abfe

</details>

- [1. Features](#1-features)
- [2. Install](#2-install)
- [3. Usage](#3-usage)
  - [3.1. Quick Start](#31-quick-start)
  - [3.2. trigger](#32-trigger)
  - [3.3. error inspect](#33-error-inspect)
  - [3.4. 让llm请求走proxy](#34-让llm请求走proxy)
- [4. 启发](#4-启发)
- [5. 反馈和建议](#5-反馈和建议)
- [6. 贡献](#6-贡献)
- [7. 更新历史](#7-更新历史)


## 1. Features

- 🔧 自定义 LLM API
- 📝 自定义 prompt 模板
- ⚪ 简单、轻量 (1.9MB)、没有登录、没有远程后台服务
- 🔒 隐私优先 – 无遥测或数据收集
- ⚙ 配置
  - 📏 限制上下文长度
  - 🎛️ 多种触发方式：自动打开 / 悬浮球 / 右键菜单 / 快捷键 / 图标点击
  - ⚡ 自动开始总结 (启用/禁用)
  - 🛠️ 站点自定义 (glob, 选择器, 白名单/黑名单)
  - ......
- 🌊 其他
  - 👀 查看Token使用情况
  - 🌐 适用于不同的站点权限设置


## 2. Install
[![](/docs/img/google-store.svg) Chrome Webstore](https://chromewebstore.google.com/detail/dhdnamkkepndgjimbpacmibkblndangk?utm_source=item-share-cp)

[![](/docs//img/edge.svg) Edge Addons](https://microsoftedge.microsoft.com/addons/detail/jidechjgegiafmcmmhlifebacppcfboe)

[![](/docs/img/firefox.svg) Firefox Addons](https://addons.mozilla.org/firefox/addon/webpage-summary/)

或者手动下载安装 [Github Relases](https://github.com/slow-groovin/webpage-summary/releases)

## 3. Usage
### 3.1. Quick Start

1.  配置一个模型
![create model](/docs/img/create-model-anim.webp?width=500&height=300)
2.  打开一个页面，点击总结
![summary](/docs/img/summary-anim.webp)
3.  继续聊天，或者尝试调整配置




### 3.2. trigger
默认情况下, 总结面板不会自动打开, 可以用以下4种方式打开总结面板:
1. 点击页面右侧下方悬浮球 (可配置`是(默认)/否`显示)
2. 点击action(popup)按钮, 然后点击页面内的`总结当前页`按钮 (可配置点击action(popup)按钮`直接打开面板/打开popup页面(默认)`)
3. 在页面右键菜单中点击 `"总结此页"`
4. (需手动配置) 通过浏览器扩展快捷键配置(非插件后台配置), 您可以配置一个快捷键 trigger (推荐`Alt+S`)

> 您也可以配置 `新页面自动打开总结面板`

<br>

默认情况下, 打开面板后不会自动开始总结, 需要点击面板中的 `"总结"` 按钮开始总结
> 您可以配置 `自动开始总结`, 在面板打开时自动开始总结

<br>

默认情况下, 插件具有所有站点的访问权限

您可以在浏览器配置中将插件访问权限改为 `单击时`:
- 某些浏览器(如Edge), 可以通过一次点击插件按钮, 使插件的功能直接在页面上运行
- 其它的浏览器(如Chrome), 点击插件按钮之后获取了页面权限, 但是需要刷新之后才能在页面上运行插件功能, 但是没关系, 您可以通过右键菜单里的`总结此页`按钮直接在页面上运行插件功能(从`沉浸式翻译`那里学的)




### 3.3. error inspect
某些报错可能没有通过 UI 显示, 可以通过当前网页的开发者控制台查看总结面板的报错.

通过后台 (options) 页面的开发者控制台查看插件后台的日志

发送向 llm api 的请求也在后台页面的开发者控制台中查看

### 3.4. 让llm请求走proxy
这个插件本身不提供 proxy 功能, 可以搭配其它浏览器 proxy 插件 (类似于 ProxySwitchOmega), 实现指定 url 流量通过代理


## 4. 启发
把网页内容复制进大模型网站, 然后输入提示词并查看结果, 这是无数人今天日常要做的事情, 需要一个浏览器插件让这个过程简化一点

在当前(*~2025.1), 提供这个功能的有:

| 类型                           | 产品                                                   | 费用                                       | 概述                                                                             | 是否开源 | 使用体验 |
| ------------------------------ | ------------------------------------------------------ | ------------------------------------------ | -------------------------------------------------------------------------------- | -------- | -------- |
| 小型公司的商业产品             | sider.ai, briefy.ai, monica.ai                         | ≈10$/m                                     | 想要打造all in one的复杂系统，无时无刻的遥测                                     | 否       | 好       |
| 大模型厂商插件端               | 豆包插件,Kimi浏览器                                    | 完全免费(但是必须要问一下But at what cost) | 豆包：想要打造all in one的复杂系统，卡顿，无时无刻的遥测，甚至无法在应用商店上架 | 否       | 佳       |
| 个人开发者在应用商店上架的产品 |                                                        | 免费或≈4$/m                                | 没有维护，很多不可用                                                             | 否       | 差       |
| 开源                           | [chatGPTBox⚡](https://github.com/josStorer/chatGPTBox) | 免费                                       | 支持多种模型配置并做了特定网站的定制                                             | **是**   | 好       |



[chatGPTBox](https://github.com/josStorer/chatGPTBox) 是我找到的唯一一款开源的完整可用的网页总结插件, 是一个很棒的项目, 本项目的界面设计受其启发, 但是它缺少 prompt 定制功能, 加上它的技术栈 (React) 与我不同, 因此我决定用自己的技术栈 (vue, [wxt](https://github.com/wxt-dev/wxt), [vercel-ai-sdk](https://sdk.vercel.ai/)) 开发一个新的网页总结浏览器插件



## 5. 反馈和建议
🙌欢迎任何反馈或建议

如果有任何关于功能建议, 界面建议, Bug, 疑惑, 使用反馈, 任何想法点子, 请在 issue 中提出


## 6. 贡献
欢迎在文档, 多语言, 界面, 功能上进行贡献, 请参考[CONTRIBUTING.md](CONTRIBUTING.md)

## 7. 更新历史
请参考 [CHANGELOG](/CHANGELOG.md)
