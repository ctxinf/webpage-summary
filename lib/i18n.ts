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
    contextMenu: {
      summarizeThisPage: string;
      addToChat: string;
      openSetting: string;
    };
  };
  content: {
    badgeLabel: string;
    summary: string;
    untitledPage: string;
    contentTokenCount: string;
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
  exportImport: {
    exportImportDescription: string;
    exportConfiguration: string;
    exportWithApiKeys: string;
    copyToClipboard: string;
    importConfiguration: string;
    importConfigurationDescription: string;
    readFromClipboard: string;
    dangerZone: string;
    resetConfigurationDescription: string;
    resetAllConfigurations: string;
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
  models: {
    createModelConfig: string;
    noModelConfigsYet: string;
    createOneBeforeBackgroundBridge: string;
    defaultBadge: string;
    provider: string;
    baseUrl: string;
    apiMode: string;
    maxInputTokens: string;
    price: string;
    useDefault: (name: string) => string;
    moveUp: (name: string) => string;
    moveDown: (name: string) => string;
    duplicate: (name: string) => string;
    edit: (name: string) => string;
    delete: (name: string) => string;
    deleteConfirm: (name: string) => string;
    deletedToast: string;
    deleteFailed: string;
    moveFailed: string;
    duplicatedToast: string;
    duplicateFailed: string;
    defaultChangedFailed: string;
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
    noActiveTab: string;
    openOptions: string;
    model: string;
    prompt: string;
    summary: string;
    page: string;
    openPanelAndStartSummary: string;
    copyPageContentToClipboard: string;
    extractFailed: string;
    copySuccess: string;
    copyFailed: string;
    invokeSummaryFailed: string;
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
      contextMenu: {
        summarizeThisPage: 'Summarize this page',
        addToChat: 'Add selection to chat',
        openSetting: 'Open Setting',
      },
    },
    content: {
      badgeLabel: 'Webpage Summary',
      summary: 'Summary',
      untitledPage: 'Untitled page',
      contentTokenCount: 'Content Token Count:',
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
            'Start message upon adding selected page text to the conversation.',
          label: 'Send selected text upon adding it',
        },
        enableAutoBeginSummary: {
          description: '',
          label: 'Begin summarizing immediately upon launch panel',
        },
        enableAutoBeginSummaryByActionOrContextTrigger: {
          description:
            '',
          label: 'Begin summarizing immediately upon trigger by context menu',
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
          label: 'Allow creating new panels',
        },
        enableFloatingBall: {
          description: 'Show a floating button positioned at the bottom-right for opening the summary panel.',
          label: 'Floating button',
        },
        enableSummaryWindowDefault: {
          caution: 'This changes the default behavior on every matching page.',
          description: '',
          label: 'Auto-open panel on new pages',
        },
        enableTokenUsageView: {
          description: 'Show token usage in the panel.',
          label: 'Token usage',
        },
      },
      summaryLanguage: {
        description: 'Language tag or locale used for generated summaries.',
        label: 'Summary Language',
      },
      title: 'General',
    },
    exportImport: {
      exportImportDescription: 'Here you can export, import, or reset all extension configurations, models, and prompt settings.',
      exportConfiguration: 'Export Configuration',
      exportWithApiKeys: 'Export with API Keys',
      copyToClipboard: 'Copy to Clipboard',
      importConfiguration: 'Import Configuration',
      importConfigurationDescription: 'Read configuration from clipboard. You can selectively override or append settings.',
      readFromClipboard: 'Read from Clipboard',
      dangerZone: 'Danger Zone',
      resetConfigurationDescription: 'Clear all extension configuration from local storage. Please ensure you have exported a backup before proceeding.',
      resetAllConfigurations: 'Reset All Configurations',
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
        exportImport: 'Config Manager',
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
        description: '',
        dialog: 'Floating Panel',
        sidebar: 'Sidebar',
        title: 'Panel layout mode',
      },
      shortcuts: {
        model: 'Model',
        prompt: 'Prompt',
        title: 'Shortcuts',
      },
      title: 'Interface',
    },
    models: {
      createModelConfig: 'Create Model Config',
      noModelConfigsYet: 'No model configs yet',
      createOneBeforeBackgroundBridge: 'Create one model config before the background bridge can call a provider.',
      defaultBadge: 'Default',
      provider: 'Provider',
      baseUrl: 'Base URL',
      apiMode: 'API Mode',
      maxInputTokens: 'Max Input Tokens',
      price: 'Price',
      useDefault: (name) => `Use ${name} by default`,
      moveUp: (name) => `Move up ${name}`,
      moveDown: (name) => `Move down ${name}`,
      duplicate: (name) => `Duplicate ${name}`,
      edit: (name) => `Edit ${name}`,
      delete: (name) => `Delete ${name}`,
      deleteConfirm: (name) => `Are you sure you want to delete "${name}"?`,
      deletedToast: 'Model deleted.',
      deleteFailed: 'Model could not be deleted.',
      moveFailed: 'Model could not be moved.',
      duplicatedToast: 'Model duplicated.',
      duplicateFailed: 'Model could not be duplicated.',
      defaultChangedFailed: 'Default model could not be changed.',
    },
    pageExtraction: {
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
            'Reader-mode extraction for articles. https://github.com/mozilla/readability',
          label: 'Readability',
        },
      },
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
      exportImport: 'Config Manager',
      interface: 'Interface',
      models: 'Models',
      prompts: 'Prompts',
      siteCustomization: 'Site Customization',
      welcome: 'Welcome',
    },
    popup: {
      noActiveTab: 'No active tab is available',
      openOptions: 'Settings',
      model: 'Model',
      prompt: 'Prompt',
      summary: 'Summary',
      page: 'Page',
      openPanelAndStartSummary: 'Open summary panel and start immediately',
      copyPageContentToClipboard: 'Copy page content to clipboard',
      extractFailed: 'Failed to extract page content',
      copySuccess: 'Copied page content to clipboard',
      copyFailed: 'Copy failed',
      invokeSummaryFailed: 'Failed to invoke summary',
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
      contextMenu: {
        summarizeThisPage: '总结此页',
        addToChat: '添加选中内容到聊天框',
        openSetting: '打开设置',
      },
    },
    content: {
      badgeLabel: '网页总结',
      summary: '总结',
      untitledPage: '无标题页面',
      contentTokenCount: '内容 Token 数:',
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
          description: '添加页面选中文本到对话后立即开始消息对话。',
          label: '添加后立即发送选中文本',
        },
        enableAutoBeginSummary: {
          description: '',
          label: '启动面板后立即开始总结',
        },
        enableAutoBeginSummaryByActionOrContextTrigger: {
          description: '',
          label: '通过右键菜单触发后立即开始总结',
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
          label: '允许创建新面板',
        },
        enableFloatingBall: {
          description: '在右下角显示用于打开总结面板的悬浮按钮。',
          label: '悬浮按钮',
        },
        enableSummaryWindowDefault: {
          caution: '这会改变每个匹配页面的默认行为。',
          description: '',
          label: '新页面自动打开面板',
        },
        enableTokenUsageView: {
          description: '显示 token 用量。',
          label: 'Token 用量',
        },
      },
      summaryLanguage: {
        description: '生成总结时使用的语言标签或区域设置。',
        label: '总结语言',
      },
      title: '通用设置',
    },
    exportImport: {
      exportImportDescription: '在这里您可以导出、导入或重置扩展的所有配置、模型和提示词设置。',
      exportConfiguration: '导出配置',
      exportWithApiKeys: '是否包含 API Keys？',
      copyToClipboard: '复制到剪贴板',
      importConfiguration: '导入配置',
      importConfigurationDescription: '从剪贴板读取配置。您可以逐条选择需要覆盖或添加的设置。',
      readFromClipboard: '从剪贴板读取',
      dangerZone: '危险操作',
      resetConfigurationDescription: '清除所有本地存储中的扩展配置。请在操作前确保您已经导出了需要的配置备份。',
      resetAllConfigurations: '重置所有配置',
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
        exportImport: '配置管理',
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
        description: '',
        dialog: '悬浮面板',
        sidebar: '侧边栏',
        title: '默认面板形式',
      },
      shortcuts: {
        model: '模型',
        prompt: '提示词',
        title: '快捷跳转',
      },
      title: '界面',
    },
    models: {
      createModelConfig: '创建模型配置',
      noModelConfigsYet: '暂无模型配置',
      createOneBeforeBackgroundBridge: '请先创建一个模型配置，以便后台脚本可以调用接口。',
      defaultBadge: '默认',
      provider: '提供商 (Provider)',
      baseUrl: '基础 URL',
      apiMode: 'API 模式',
      maxInputTokens: '最大输入 Token',
      price: '价格',
      useDefault: (name) => `将 ${name} 设为默认`,
      moveUp: (name) => `上移 ${name}`,
      moveDown: (name) => `下移 ${name}`,
      duplicate: (name) => `复制 ${name}`,
      edit: (name) => `编辑 ${name}`,
      delete: (name) => `删除 ${name}`,
      deleteConfirm: (name) => `确定要删除 "${name}" 吗？`,
      deletedToast: '模型已删除。',
      deleteFailed: '模型删除失败。',
      moveFailed: '模型移动失败。',
      duplicatedToast: '模型已复制。',
      duplicateFailed: '模型复制失败。',
      defaultChangedFailed: '默认模型切换失败。',
    },
    pageExtraction: {
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
          description: '按阅读模式提取文章内容。https://github.com/mozilla/readability',
          label: 'Readability',
        },
      },
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
      exportImport: '配置管理',
      interface: '界面',
      models: '模型',
      prompts: '提示词',
      siteCustomization: '站点定制',
      welcome: '欢迎',
    },
    popup: {
      noActiveTab: '没有可用的当前标签页',
      openOptions: '设置',
      model: '模型',
      prompt: '提示词',
      summary: '总结',
      page: 'Page',
      openPanelAndStartSummary: '打开总结面板并立即开始总结',
      copyPageContentToClipboard: '把页面内容复制到剪切板',
      extractFailed: '页面内容提取失败',
      copySuccess: '已复制页面内容到剪切板',
      copyFailed: '复制失败',
      invokeSummaryFailed: '无法触发总结',
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
  const override = getUiLocaleOverride();
  const browserLang = browser.i18n.getUILanguage();
  const resolved = resolveUiLocale(browserLang);
  const finalLocale = override ?? resolved;
  
  // console.log('[i18n Debug]', {
  //   override,
  //   browserLang,
  //   resolved,
  //   finalLocale,
  //   protocol: typeof window !== 'undefined' ? window.location.protocol : 'no-window'
  // });
  
  return finalLocale;
}

export function getUiMessages(locale = getUiLocale()) {
  return UI_MESSAGES[locale];
}
