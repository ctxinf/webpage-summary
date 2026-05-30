export type UiLocale = 'en' | 'zh-CN';

export const UI_LOCALE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: '简体中文', value: 'zh-CN' },
] as const satisfies Array<{ label: string; value: UiLocale }>;

const UI_LOCALE_OVERRIDE_STORAGE_KEY = 'webpage-summary-ui-locale';

type GeneralBooleanSettingMessageKey =
  | 'enableChatInputBox'
  | 'enableFloatingBall'
  | 'enableSummaryWindowDefault'
  | 'enableAutoBeginSummary'
  | 'enableAutoBeginSummaryByActionOrContextTrigger'
  | 'enableAutoBeginChatForAddSelectionToChat'
  | 'enableTokenUsageView'
  | 'enableCreateNewPanelButton'
  | 'enableContextMenuSummarizeThisPage'
  | 'enableContextMenuAddSelectionToChat';

type UiMessages = {
  common: {
    allChangesSaved: string;
    back: string;
    loadingSettings: string;
    off: string;
    on: string;
    save: string;
    saved: string;
    saving: string;
    success: string;
    unsavedChanges: string;
  };
  content: {
    badgeLabel: string;
    summary: string;
    untitledPage: string;
  };
  general: {
    loadFailed: string;
    restoreDefaults: string;
    saveFailed: string;
    savedToast: string;
    sections: Record<
      'contextMenu' | 'triggers',
      {
        description: string;
        title: string;
      }
    >;
    settings: Record<
      GeneralBooleanSettingMessageKey,
      {
        caution?: string;
        description: string;
        label: string;
      }
    >;
    summaryLanguage: {
      description: string;
      label: string;
    };
    title: string;
  };
  options: {
    debug: string;
    header: {
      defaultModel: string;
      defaultModelFailed: string;
      defaultPrompt: string;
      defaultPromptFailed: string;
      language: string;
      noModels: string;
      noPrompts: string;
    };
    navigation: Record<
      | 'exportImport'
      | 'general'
      | 'interface'
      | 'models'
      | 'prompts'
      | 'siteCustomization',
      string
    >;
    navigationLabel: string;
  };
  interface: {
    chatInputBox: {
      description: string;
      title: string;
    };
    floatingBall: {
      description: string;
      title: string;
    };
    panelLayout: {
      description: string;
      dialog: string;
      sidebar: string;
      title: string;
    };
    shortcuts: {
      model: string;
      prompt: string;
      title: string;
    };
    title: string;
  };
  pageExtraction: {
    defaultReadability: string;
    loadFailed: string;
    method: {
      description: string;
      title: string;
    };
    methods: Record<
      'dom-heuristic' | 'readability',
      {
        description: string;
        label: string;
      }
    >;
    saveFailed: string;
    savedToast: string;
    title: string;
  };
  prompts: {
    create: string;
    createFromPreset: string;
    createdToast: string;
    defaultBadge: string;
    delete: (name: string) => string;
    deleteConfirm: (name: string) => string;
    deleteFailed: string;
    deletedToast: string;
    edit: (name: string) => string;
    emptyDescription: string;
    emptyTitle: string;
    libraryDescription: string;
    libraryTitle: string;
    loadFailed: string;
    makeDefault: (name: string) => string;
    missingPromptId: string;
    moveDown: (name: string) => string;
    moveFailed: string;
    moveUp: (name: string) => string;
    name: string;
    nameDescription: string;
    namePlaceholder: string;
    promptNotFound: string;
    saveFailed: string;
    savedToast: string;
    selectDefaultFailed: string;
    systemMessage: string;
    systemMessageDescription: string;
    templateVariables: string;
    templateVariablesDescription: string;
    userMessage: string;
    userMessageDescription: string;
    variableDescriptions: Record<
      'articleUrl' | 'currentSelection' | 'summaryLanguage' | 'textContent',
      string
    >;
  };
  pageTitles: {
    createModel: string;
    createPrompt: string;
    editModel: string;
    editPrompt: string;
    exportImport: string;
    interface: string;
    models: string;
    prompts: string;
    siteCustomization: string;
    welcome: string;
  };
  popup: {
    connected: string;
    connectingCurrentPage: string;
    injectionPending: string;
    injectionStatus: string;
    noActiveTab: string;
    open: string;
    openOptions: string;
    pageFallback: string;
    pageSectionLabel: string;
    pageUrlFallback: string;
    textLength: string;
    unsupportedPage: string;
  };
  siteCustomization: {
    examplesTitle: string;
    examplesDescription: string;
    examples: { key: string; description: string }[];
    whitelist: string;
    blacklist: string;
    whitelistDescription: string;
    blacklistDescription: string;
    patternsLabel: string;
    onePerLine: string;
    whitelistPlaceholder: string;
    blacklistPlaceholder: string;
    customizationTitle: string;
    customizationDescription: string;
    addRule: string;
    noRules: string;
    noRulesDescription: string;
    newRuleFallback: string;
    matchPattern: string;
    matchPatternPlaceholder: string;
    useShadowRoot: string;
    selectorsNormal: string;
    selectorsHost: string;
    selectorsPlaceholderNormal: string;
    selectorsPlaceholderHost: string;
    shadowRootSelectors: string;
    shadowRootSelectorsPlaceholder: string;
    shadowRootTip: string;
  };
};

const UI_MESSAGES: Record<UiLocale, UiMessages> = {
  en: {
    common: {
      allChangesSaved: 'All changes are saved.',
      back: 'Back',
      loadingSettings: 'Loading settings...',
      off: 'Off',
      on: 'On',
      save: 'Save',
      saved: 'Saved',
      saving: 'Saving',
      success: 'Success',
      unsavedChanges: 'Unsaved changes',
    },
    content: {
      badgeLabel: 'Webpage Summary',
      summary: 'Summary',
      untitledPage: 'Untitled page',
    },
    general: {
      loadFailed: 'General settings failed to load.',
      restoreDefaults: 'Restore defaults',
      saveFailed: 'General settings failed to save.',
      savedToast: 'General settings saved.',
      sections: {
        contextMenu: {
          description: 'Choose which page menu entries the extension exposes.',
          title: 'Context Menu',
        },

        triggers: {
          description: 'Control default behavior of the panel and when it starts work automatically.',
          title: 'Triggers',
        },
      },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: {
          description:
            'Start chat automatically after selected page text is added to the conversation.',
          label: 'Send selected text after adding it',
        },
        enableAutoBeginSummary: {
          description: 'Begin summarizing as soon as the summary panel opens.',
          label: 'Start summary after panel opens',
        },
        enableAutoBeginSummaryByActionOrContextTrigger: {
          description:
            'Begin summarizing when the extension action or a context menu opens the panel.',
          label: 'Start after action or context trigger',
        },
        enableChatInputBox: {
          description: 'Show the chat input inside the summary panel.',
          label: 'Chat input box',
        },
        enableContextMenuAddSelectionToChat: {
          description:
            'Show the context menu item for adding selected text to chat.',
          label: 'Add selection to chat',
        },
        enableContextMenuSummarizeThisPage: {
          description:
            'Show the context menu item for summarizing the page.',
          label: 'Summarize this page',
        },
        enableCreateNewPanelButton: {
          description: 'Show a button to create an additional summary panel.',
          label: 'Allow new panels',
        },
        enableFloatingBall: {
          description: 'Show a page control for opening the summary panel.',
          label: 'Floating button',
        },
        enableSummaryWindowDefault: {
          caution: 'This changes the default behavior on every matching page.',
          description: 'Open the summary panel as a page starts.',
          label: 'Open panel on new pages',
        },
        enableTokenUsageView: {
          description: 'Show token usage information in the panel header.',
          label: 'Token usage',
        },
      },
      summaryLanguage: {
        description: 'Language tag or locale used for generated summaries.',
        label: 'Summary Language',
      },
      title: 'General Setting',
    },
    options: {
      debug: 'Debug',
      header: {
        defaultModel: 'Default model',
        defaultModelFailed: 'Default model could not be changed.',
        defaultPrompt: 'Default prompt',
        defaultPromptFailed: 'Default prompt could not be changed.',
        language: 'Language',
        noModels: 'No model configs',
        noPrompts: 'No prompt templates',
      },
      navigation: {
        exportImport: 'Export Import',
        general: 'General',
        interface: 'Interface',
        models: 'Models',
        prompts: 'Prompts',
        siteCustomization: 'Site Customization',
      },
      navigationLabel: 'Options',
    },
    interface: {
      chatInputBox: {
        description: 'Show the chat input box at the bottom of the summary panel by default.',
        title: 'Enable chat input box by default',
      },
      floatingBall: {
        description: 'Show a page control for opening the summary panel.',
        title: 'Floating button',
      },
      panelLayout: {
        description: 'Choose the default layout form for the summary panel.',
        dialog: 'Floating Panel',
        sidebar: 'Sidebar',
        title: 'Panel layout mode',
      },
      shortcuts: {
        model: 'Model settings',
        prompt: 'Prompt settings',
        title: 'Shortcuts',
      },
      title: 'Interface',
    },
    pageExtraction: {
      defaultReadability: 'Default readability',
      loadFailed: 'Page extraction settings failed to load.',
      method: {
        description:
          'Select the general extraction path used before summary input is assembled.',
        title: 'Text Extraction Method',
      },
      methods: {
        'dom-heuristic': {
          description:
            'Scores semantic DOM containers to keep long visible content such as documentation callouts and notes.',
          label: 'DOM heuristic',
        },
        readability: {
          description:
            'Reader-mode extraction for articles. This remains the default input path.',
          label: 'Readability',
        },
      },
      saveFailed: 'Page extraction settings failed to save.',
      savedToast: 'Page extraction settings saved.',
      title: 'Page Extraction',
    },
    prompts: {
      create: 'Create prompt',
      createFromPreset: 'Start from preset:',
      createdToast: 'Prompt created.',
      defaultBadge: 'Default',
      delete: (name) => `Delete ${name}`,
      deleteConfirm: (name) => `Delete "${name}"?`,
      deleteFailed: 'Prompt could not be deleted.',
      deletedToast: 'Prompt deleted.',
      edit: (name) => `Edit ${name}`,
      emptyDescription:
        'Create a prompt template before summary input is assembled.',
      emptyTitle: 'No prompt templates yet',
      libraryDescription:
        'Keep reusable system and user templates here, choose one default, and order them for later pickers.',
      libraryTitle: 'Prompt Templates',
      loadFailed: 'Prompt settings failed to load.',
      makeDefault: (name) => `Use ${name} by default`,
      missingPromptId: 'Prompt ID is missing.',
      moveDown: (name) => `Move ${name} down`,
      moveFailed: 'Prompt order could not be changed.',
      moveUp: (name) => `Move ${name} up`,
      name: 'Name',
      nameDescription: 'Use a short label that works in prompt pickers.',
      namePlaceholder: 'Article summary',
      promptNotFound: 'Prompt was not found.',
      saveFailed: 'Prompt failed to save.',
      savedToast: 'Prompt saved.',
      selectDefaultFailed: 'Default prompt could not be changed.',
      systemMessage: 'System message',
      systemMessageDescription:
        'Instructions for summary behavior, output language, and output format.',
      templateVariables: 'Template Variables',
      templateVariablesDescription:
        'These placeholders are rendered when the summary request is built.',
      userMessage: 'User message',
      userMessageDescription:
        'Page input wrapper and task context sent with extracted content.',
      variableDescriptions: {
        articleUrl: 'URL of the page being summarized.',
        currentSelection: 'Current page selection when one exists.',
        summaryLanguage: 'Configured output language or locale.',
        textContent: 'Extracted page text used as summary input.',
      },
    },
    pageTitles: {
      createModel: 'Create Model',
      createPrompt: 'Create Prompt',
      editModel: 'Edit Model',
      editPrompt: 'Edit Prompt',
      exportImport: 'Export Import',
      interface: 'Interface',
      models: 'Models',
      prompts: 'Prompts',
      siteCustomization: 'Site Customization',
      welcome: 'Welcome',
    },
    popup: {
      connected: 'Connected',
      connectingCurrentPage: 'Connecting to the current page',
      injectionPending: 'Waiting',
      injectionStatus: 'Injection status',
      noActiveTab: 'No active tab is available',
      open: 'Open',
      openOptions: 'Settings',
      pageFallback: 'Current page',
      pageSectionLabel: 'Current page',
      pageUrlFallback: 'Open a webpage to inspect injection status',
      textLength: 'Text length',
      unsupportedPage: 'This page does not support injection yet',
    },
    siteCustomization: {
      examplesTitle: 'Match Pattern Examples',
      examplesDescription: 'Supports modern glob syntax (picomatch).',
      examples: [
        { key: 'example.com', description: 'example.com' },
        { key: '*.example.com', description: 'a.example.com, b.example.com' },
        {
          key: '**.example.com',
          description: 'a.example.com, b.example.com, a.b.example.com',
        },
        {
          key: 'example.com/articles/*',
          description: 'example.com/articles/1, example.com/articles/2',
        },
      ],
      whitelist: 'Whitelist',
      blacklist: 'Blacklist',
      whitelistDescription:
        'When enabled, the extension will only be injected into pages matching these patterns.',
      blacklistDescription:
        'When enabled, the extension will NOT be injected into pages matching these patterns.',
      patternsLabel: 'URL Patterns',
      onePerLine: 'one per line',
      whitelistPlaceholder:
        'e.g. \nwww.reddit.com\nwww.reddit.com/r/**/comments/**\n*.news.com\n**.quora.com',
      blacklistPlaceholder: 'e.g. \nwww.bing.com\n*.visa.com\n**.google.com',
      customizationTitle: 'Selector Overrides',
      customizationDescription:
        'For sites where the default extractor fails, pin the page content to specific CSS selectors.',
      addRule: 'Add rule',
      noRules: 'No selector overrides yet',
      noRulesDescription:
        "Add a rule when a site's content lives inside unusual structures (e.g. Shadow DOM) that the default extractor can't read cleanly.",
      newRuleFallback: 'New Rule',
      matchPattern: 'Match Pattern',
      matchPatternPlaceholder: 'minimatch pattern, e.g. www.reddit.com, *.reddit.com',
      useShadowRoot: 'Drill into Shadow DOM',
      selectorsNormal: 'CSS selectors',
      selectorsHost: 'Host selectors',
      selectorsPlaceholderNormal: 'e.g. \n.text-neutral-content\n#comment-tree',
      selectorsPlaceholderHost: 'e.g. \n#app > div\n.shadow-host-element',
      shadowRootSelectors: 'Shadow root selectors',
      shadowRootSelectorsPlaceholder: 'e.g. \n#content\n.article-body',
      shadowRootTip:
        'For each element matched by the CSS selectors above, these selectors are queried inside element.shadowRoot.',
    },
  },
  'zh-CN': {
    common: {
      allChangesSaved: '所有更改均已保存。',
      back: '返回',
      loadingSettings: '正在加载设置...',
      off: '关闭',
      on: '开启',
      save: '保存',
      saved: '已保存',
      saving: '保存中',
      success: '成功',
      unsavedChanges: '有未保存的更改',
    },
    content: {
      badgeLabel: '网页总结',
      summary: '总结',
      untitledPage: '无标题页面',
    },
    general: {
      loadFailed: '通用设置加载失败。',
      restoreDefaults: '恢复默认值',
      saveFailed: '通用设置保存失败。',
      savedToast: '通用设置已保存。',
      sections: {
        contextMenu: {
          description: '选择扩展在页面菜单中提供哪些入口。',
          title: '右键菜单',
        },

        triggers: {
          description: '控制面板的默认行为以及何时自动开始工作。',
          title: '触发',
        },
      },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: {
          description: '添加选中文本后立即发送。',
          label: '添加选中文本后立即发送',
        },
        enableAutoBeginSummary: {
          description: '总结面板打开后立即开始总结。',
          label: '面板打开后开始总结',
        },
        enableAutoBeginSummaryByActionOrContextTrigger: {
          description: '通过扩展按钮或右键菜单打开面板时开始总结。',
          label: '通过按钮或菜单触发后开始',
        },
        enableChatInputBox: {
          description: '在总结面板中显示聊天输入框。',
          label: '聊天输入框',
        },
        enableContextMenuAddSelectionToChat: {
          description: '显示将选中文本加入聊天的菜单项。',
          label: '加入选中文本到聊天',
        },
        enableContextMenuSummarizeThisPage: {
          description: '显示总结当前页面的菜单项。',
          label: '总结当前页面',
        },
        enableCreateNewPanelButton: {
          description: '显示新建额外的另一个总结面板的按钮。',
          label: '允许新建面板',
        },
        enableFloatingBall: {
          description: '显示用于打开总结面板的页面控件。',
          label: '悬浮按钮',
        },
        enableSummaryWindowDefault: {
          caution: '这会改变每个匹配页面的默认行为。',
          description: '页面开始加载时打开总结面板。',
          label: '新页面默认打开面板',
        },
        enableTokenUsageView: {
          description: '在面板头部显示 token 用量信息。',
          label: 'Token 用量',
        },
      },
      summaryLanguage: {
        description: '生成总结时使用的语言标签或区域设置。',
        label: '总结语言',
      },
      title: '通用设置',
    },
    options: {
      debug: '调试',
      header: {
        defaultModel: '默认模型',
        defaultModelFailed: '默认模型切换失败。',
        defaultPrompt: '默认提示词',
        defaultPromptFailed: '默认提示词切换失败。',
        language: '语言',
        noModels: '还没有模型配置',
        noPrompts: '还没有提示词模板',
      },
      navigation: {
        exportImport: '导入导出',
        general: '通用',
        interface: '界面',
        models: '模型',
        prompts: '提示词',
        siteCustomization: '站点定制',
      },
      navigationLabel: '选项',
    },
    interface: {
      chatInputBox: {
        description: '默认在总结面板底部展示对话输入框，你可以随时输入新的提问或指令。',
        title: '默认开启对话输入框',
      },
      floatingBall: {
        description: '在网页中显示一个可以随时打开总结面板的悬浮控制球。',
        title: '悬浮球',
      },
      panelLayout: {
        description: '选择总结面板默认在页面中展开的交互形式。',
        dialog: '悬浮面板',
        sidebar: '侧边栏',
        title: '默认面板形式',
      },
      shortcuts: {
        model: '模型设置',
        prompt: '提示词设置',
        title: '快捷跳转',
      },
      title: '界面',
    },
    pageExtraction: {
      defaultReadability: '恢复默认 Readability',
      loadFailed: '页面提取设置加载失败。',
      method: {
        description: '获取页面内容的算法',
        title: '页面内容提取方式',
      },
      methods: {
        'dom-heuristic': {
          description:
            '按语义 DOM 容器打分，保留文档提示块、注释等较长的可见内容。',
          label: 'DOM 启发式',
        },
        readability: {
          description: '按阅读模式提取文章内容，这仍是默认输入路径。',
          label: 'Readability',
        },
      },
      saveFailed: '页面提取设置保存失败。',
      savedToast: '页面提取设置已保存。',
      title: '页面提取',
    },
    prompts: {
      create: '创建提示词',
      createFromPreset: '从预置开始：',
      createdToast: '提示词已创建。',
      defaultBadge: '默认',
      delete: (name) => `删除 ${name}`,
      deleteConfirm: (name) => `确认删除“${name}”？`,
      deleteFailed: '提示词删除失败。',
      deletedToast: '提示词已删除。',
      edit: (name) => `编辑 ${name}`,
      emptyDescription: '先创建一个提示词模板，再组装总结输入。',
      emptyTitle: '还没有提示词模板',
      libraryDescription:
        '在这里管理可复用的 system 和 user 模板，选择默认项，并调整后续选择器中的顺序。',
      libraryTitle: '提示词模板',
      loadFailed: '提示词设置加载失败。',
      makeDefault: (name) => `将 ${name} 设为默认提示词`,
      missingPromptId: '缺少提示词 ID。',
      moveDown: (name) => `下移 ${name}`,
      moveFailed: '提示词顺序调整失败。',
      moveUp: (name) => `上移 ${name}`,
      name: '名称',
      nameDescription: '使用一个适合在提示词选择器中展示的短名称。',
      namePlaceholder: '文章总结',
      promptNotFound: '未找到提示词。',
      saveFailed: '提示词保存失败。',
      savedToast: '提示词已保存。',
      selectDefaultFailed: '默认提示词切换失败。',
      systemMessage: 'System 消息',
      systemMessageDescription: '定义总结行为、输出语言和输出格式。',
      templateVariables: '模板变量',
      templateVariablesDescription: '组装总结请求时会渲染这些占位符。',
      userMessage: 'User 消息',
      userMessageDescription: '包裹页面输入并补充任务上下文。',
      variableDescriptions: {
        articleUrl: '当前总结页面的 URL。',
        currentSelection: '页面中当前存在的选中文本。',
        summaryLanguage: '配置的输出语言或区域设置。',
        textContent: '作为总结输入的页面提取文本。',
      },
    },
    pageTitles: {
      createModel: '创建模型',
      createPrompt: '创建提示词',
      editModel: '编辑模型',
      editPrompt: '编辑提示词',
      exportImport: '导入导出',
      interface: '界面',
      models: '模型',
      prompts: '提示词',
      siteCustomization: '站点定制',
      welcome: '欢迎',
    },
    popup: {
      connected: '已连接',
      connectingCurrentPage: '正在连接当前页面',
      injectionPending: '等待中',
      injectionStatus: '注入状态',
      noActiveTab: '没有可用的当前标签页',
      open: '打开',
      openOptions: '设置',
      pageFallback: '当前页面',
      pageSectionLabel: '当前页面',
      pageUrlFallback: '打开任意网页后查看注入状态',
      textLength: '文本长度',
      unsupportedPage: '当前页面暂不支持注入',
    },
    siteCustomization: {
      examplesTitle: '匹配规则示例',
      examplesDescription: '支持现代 glob 语法 (picomatch)。',
      examples: [
        { key: 'example.com', description: '匹配 example.com' },
        { key: '*.example.com', description: '匹配 a.example.com, b.example.com' },
        {
          key: '**.example.com',
          description: '匹配 a.example.com, b.example.com, a.b.example.com',
        },
        {
          key: 'example.com/articles/*',
          description: '匹配 example.com/articles/1, example.com/articles/2',
        },
      ],
      whitelist: '白名单',
      blacklist: '黑名单',
      whitelistDescription: '开启后，插件只会注入到白名单内的网页中。',
      blacklistDescription: '开启后，插件不会注入到黑名单内的网页中。',
      patternsLabel: '匹配规则',
      onePerLine: '每行一个',
      whitelistPlaceholder:
        '例如：\nwww.reddit.com\nwww.reddit.com/r/**/comments/**\n*.news.com\n**.quora.com',
      blacklistPlaceholder: '例如：\nwww.bing.com\n*.visa.com\n**.google.com',
      customizationTitle: '站点定制',
      customizationDescription:
        '由于各网站结构不同，自动提取正文有时会失败。您可以在这里为特定站点设置 CSS 选择器，以便插件更准确地获取内容。',
      addRule: '添加规则',
      noRules: '暂无站点定制规则',
      noRulesDescription:
        '为那些自动提取内容失败的站点（如内容被 Shadow DOM 包裹的站点）添加选择器规则。',
      newRuleFallback: '新规则',
      matchPattern: '匹配规则',
      matchPatternPlaceholder: '支持 minimatch 语法，如 www.reddit.com, *.reddit.com',
      useShadowRoot: '穿透 Shadow DOM',
      selectorsNormal: 'CSS 选择器',
      selectorsHost: '宿主选择器',
      selectorsPlaceholderNormal: '例如：\n.text-neutral-content\n#comment-tree',
      selectorsPlaceholderHost: '例如：\n#app > div\n.shadow-host-element',
      shadowRootSelectors: 'Shadow Root 内部选择器',
      shadowRootSelectorsPlaceholder: '例如：\n#content\n.article-body',
      shadowRootTip:
        '从上述选择器匹配到的元素内部进入 shadowRoot 并应用这些选择器。',
    },
  },
};

export function resolveUiLocale(language: string | undefined): UiLocale {
  return language?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

export function isUiLocale(value: string | null | undefined): value is UiLocale {
  return value === 'en' || value === 'zh-CN';
}

function canUseExtensionLocalStorage() {
  if (typeof window === 'undefined') return false;

  return [
    'chrome-extension:',
    'moz-extension:',
    'ms-browser-extension:',
    'safari-web-extension:',
  ].includes(window.location.protocol);
}

export function getUiLocaleOverride(): UiLocale | null {
  if (!canUseExtensionLocalStorage()) return null;

  try {
    const storedLocale = window.localStorage.getItem(UI_LOCALE_OVERRIDE_STORAGE_KEY);

    return isUiLocale(storedLocale) ? storedLocale : null;
  } catch {
    return null;
  }
}

export function setUiLocaleOverride(locale: UiLocale) {
  if (!canUseExtensionLocalStorage()) return;

  window.localStorage.setItem(UI_LOCALE_OVERRIDE_STORAGE_KEY, locale);
}

export function getUiLocale() {
  return getUiLocaleOverride() ?? resolveUiLocale(browser.i18n.getUILanguage());
}

export function getUiMessages(locale = getUiLocale()) {
  return UI_MESSAGES[locale];
}
