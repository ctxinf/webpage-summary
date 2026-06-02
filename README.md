<h1 align="center" style="display: flex; flex-direction: row;justify-content:center; align-items: center; gap:.25em;">
 <img src="./assets/16.png" width="26"/>
 <span> Webpage Summary </span>
</h1>
<p align="center">Browser extension for summarizing webpage text content with AI (with your own Apikey)</p>




[![wakatime](https://wakatime.com/badge/user/6476bd96-6b6e-4943-b20d-e7f34889cb5a/project/34d281d5-2656-4ac2-a17c-4141f46d06f7.svg)](https://wakatime.com/badge/user/6476bd96-6b6e-4943-b20d-e7f34889cb5a/project/34d281d5-2656-4ac2-a17c-4141f46d06f7)

<p align="center">
  [<span>English</span>]
  [<a href="./docs/README_zh.md">简体中文</a>]
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
  - [3.2. Trigger](#32-trigger)
  - [3.3. Error Inspect](#33-error-inspect)
  - [3.4. Proxy for LLM Requests](#34-proxy-for-llm-requests)
- [4. Inspiration](#4-inspiration)
- [5. Feedback\&Suggestions](#5-feedbacksuggestions)
- [6. Contribution](#6-contribution)
- [7. Update History](#7-update-history)

## 1. Features

- 🔧 Custom LLM API
- 📝 Custom prompt templates
- ⚪ Simple, lightweight(1.9MB), no login, no service
- 🔒 Privacy-first – no telemetry or data collection
- ⚙ Configs
  - 📏 Limit context length
  - 🎛️ Multiple triggers: Auto Open / Floating Ball / Context Menu / Shortcut / Action Click
  - ⚡ Auto-start summary (Enable/Disable)
  - 🛠️ Site customization (glob, selectors, whitelist/blacklist)
  - ......
- 🌊Other
  -  👀 Token usage view
  -  🌐 Works with different site permissions setting



## 2. Install
[![](/docs/img/google-store.svg) Chrome Webstore](https://chromewebstore.google.com/detail/dhdnamkkepndgjimbpacmibkblndangk?utm_source=item-share-cp)

[![](/docs//img/edge.svg) Edge Addons](https://microsoftedge.microsoft.com/addons/detail/jidechjgegiafmcmmhlifebacppcfboe)

[![](/docs/img/firefox.svg) Firefox Addons](https://addons.mozilla.org/firefox/addon/webpage-summary/)


or download from [Github Releases](https://github.com/slow-groovin/webpage-summary/releases) and manually install

## 3. Usage

### 3.1. Quick Start

1.  Configure a model
![create model](/docs/img/create-model-anim.webp?width=500&height=300)
2.  Open a page, click summary
![summary](/docs/img/summary-anim.webp)
3.  Continue to chat, or try modifying configurations

### 3.2. Trigger

By default, the summary panel does not open automatically. You can open it in the following four ways:

1.  Click the floating ball in the lower right corner of the page (configurable: `Yes (default) / No` display)
2.  Click the action (popup) button, then click the "Summarize" button on the page (configurable: clicking the action (popup) button can `Open the panel directly / Open the popup page (default)`)
3.  Click "Summarize This Page" in the page's context menu
4.  (Manual configuration required) Configure a keyboard shortcut through the browser extension settings (not the plugin's options page). You can configure a shortcut trigger (recommended `Alt+S`)

> You can also configure `Auto open summary panel on new tab`

<br>

By default, the summary does not start automatically after opening the panel. You need to click the "Sum" button in the panel to start summarizing.

> You can configure `Auto begin summary` to automatically start summarizing when the panel is opened.

<br>

By default, the plugin has access to all sites.

> You can change the plugin's access permission to `On Click` in the browser settings:
> - Some browsers (such as Edge) can directly run the plugin's functionality on the page with one click of the action icon.
> - Other browsers (such as Chrome) acquire page permissions after clicking the action icon, but need to refresh the page to run the plugin's functionality on the page. However, it doesn't matter, you can one step run by the `Summarize This Page ⚡` button in the right-click menu (like `Immersive Translate` extension).

### 3.3. Error Inspect

Some errors may not be displayed through the UI. You can view the errors of the summary panel through the developer console of the current webpage.

View the logs of the plugin background through the developer console of the background (options) page.

Requests sent to the LLM API can also be viewed in the developer console of the background page.

### 3.4. Proxy for LLM Requests

This plugin does not provide proxy functionality itself. It can be used with other browser proxy plugins (similar to ProxySwitchOmega) to implement proxying of specified URL traffic.

## 4. Inspiration

Copying webpage content into a llm website, then entering prompts and viewing the results is a common workflow for many people today. A browser plugin is needed to replace this process.

Currently(*~2025.1), the following provide this functionality:

| Type                                                      | Product                                                | Cost            | Overview                                                                                                                 | Open Source | User Experience |
| --------------------------------------------------------- | ------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------- | --------------- |
| Small company commercial products                         | sider.ai, briefy.ai, monica.ai                         | ≈10$/m          | Want to create a complex all-in-one system, with endless telemetry                                                       | No          | Good            |
| Large model vendor plugin ends                            | Doubao plugin, Kimi plugin                             | Completely free | Doubao: Wants to create a complex all-in-one system, laggy, endless telemetry, cannot even be put on the extension store | No          | Good+           |
| Products listed in the app store by individual developers |                                                        | Free or ≈4$/m   | No maintenance, many are unavailable                                                                                     | No          | Poor            |
| Open source                                               | [chatGPTBox⚡](https://github.com/josStorer/chatGPTBox) | Free            | Supports multiple model configurations and has made specific website customizations                                      | **Yes**     | Good            |

[chatGPTBox](https://github.com/josStorer/chatGPTBox) is the only open-source, fully functional webpage summary plugin I found. It is a great project. The interface design of this project is inspired by it, but it lacks prompt customization features. In addition, its technology stack (React) is different from mine, so I decided to develop a new webpage summary browser plugin with my own technology stack (Vue, [wxt](https://github.com/wxt-dev/wxt), [vercel-ai-sdk](https://sdk.vercel.ai/)).

## 5. Feedback&Suggestions

🙌 Welcome any feedback or suggestions

If you have any suggestions for features, interface suggestions, bugs, questions, usage feedback, or any ideas, please submit them in the issue.

## 6. Contribution

Welcome to contribute to documentation, i18n support, UI, and features. Please refer to [CONTRIBUTING.md](CONTRIBUTING.md)

## 7. Update History

Please refer to [CHANGELOG](/CHANGELOG.md)
