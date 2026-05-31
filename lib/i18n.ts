export type UiLocale = 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko' | 'pt' | 'es' | 'fr' | 'de';

export const UI_LOCALE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
  { label: 'Português', value: 'pt' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
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
    unknownError: string;
    collapse: string;
    more: string;
    contextMenu: {
      summarizeThisPage: string;
      addToChat: string;
      openSetting: string;
    };
  };
  content: {
    badgeLabel: string;
    summary: string;
    reSummarize: string;
    untitledPage: string;
    contentTokenCount: string;
    tokenViewerInfoTip: string;
    calculating: string;
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
    resetConfirm: string;
    noChanges: string;
    noChangesDesc: string;
    reviewImport: string;
    importedSuccess: (count: number) => string;
    noImportSelected: string;
    resetSuccess: string;
    importReviewTitle: string;
    confirmImport: string;
    acceptAll: string;
    rejectAll: string;
    cancel: string;
    configItem: string;
    oldValue: string;
    newValue: string;
    action: string;
    conflict: string;
    addNew: string;
    overwrite: string;
    accept: string;
    skip: string;
    discard: string;
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
      unknownError: 'An unknown error occurred. Please try again.',
      collapse: 'Collapse',
      more: 'More...',
      contextMenu: {
        summarizeThisPage: 'Summarize this page',
        addToChat: 'Add selection to chat',
        openSetting: 'Open Setting',
      },
    },
    content: {
      badgeLabel: 'Webpage Summary',
      summary: 'Summary',
      reSummarize: 'Re-summarize',
      untitledPage: 'Untitled Page',
      contentTokenCount: 'Content Tokens:',
      tokenViewerInfoTip: 'This interface is for visualising tokenisation only. Dragging the slider here does not change the actual text sent to the LLM.',
      calculating: 'Calculating...',
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
      resetConfirm: 'Are you sure you want to clear all configurations? This action cannot be undone.',
      noChanges: 'No changes detected',
      noChangesDesc: 'The configuration in the clipboard is exactly the same as the current configuration.',
      reviewImport: 'Please review the configuration to be imported',
      importedSuccess: (count) => `Successfully imported ${count} configuration items.`,
      noImportSelected: 'No configurations selected for import.',
      resetSuccess: 'All configurations have been cleared.',
      importReviewTitle: 'Import Review',
      confirmImport: 'Confirm Import',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      cancel: 'Cancel',
      configItem: 'Config Item',
      oldValue: 'Old Value',
      newValue: 'New Value',
      action: 'Action',
      conflict: 'Conflict',
      addNew: 'New',
      overwrite: 'Overwrite',
      accept: 'Accept',
      skip: 'Skip',
      discard: 'Discard',
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
      unknownError: '发生未知错误，请重试',
      collapse: '收起',
      more: '更多...',
      contextMenu: {
        summarizeThisPage: '总结此页',
        addToChat: '添加选中内容到聊天框',
        openSetting: '打开设置',
      },
    },
    content: {
      badgeLabel: '网页总结',
      summary: '总结',
      reSummarize: '重新总结',
      untitledPage: '未命名页面',
      contentTokenCount: '内容 Token 数:',
      tokenViewerInfoTip: '此界面仅用于可视化分词效果。在此处的拖动调节不会改变实际发送给大语言模型的文本内容。',
      calculating: '计算中...',
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
        description: '总结输出的语言',
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
      resetConfirm: '确定要清除所有配置吗？此操作无法撤销。',
      noChanges: '未发现任何变更',
      noChangesDesc: '剪贴板中的配置与当前配置完全一致。',
      reviewImport: '请审阅即将导入的配置',
      importedSuccess: (count) => `成功导入了 ${count} 项配置。`,
      noImportSelected: '未选择任何配置进行导入。',
      resetSuccess: '所有配置已被清除。',
      importReviewTitle: '导入审阅 (Import Review)',
      confirmImport: '确认导入',
      acceptAll: '全部接受',
      rejectAll: '全部拒绝',
      cancel: '取消',
      configItem: '配置项',
      oldValue: '旧的值',
      newValue: '新的值',
      action: '操作',
      conflict: '冲突',
      addNew: '新增',
      overwrite: '覆盖',
      accept: '接受',
      skip: '跳过',
      discard: '放弃',
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
  'zh-TW': {
    common: {
      allChangesSaved: '所有變更均已儲存。',
      back: '返回',
      loadingSettings: '正在載入設定...',
      off: '關閉',
      on: '開啟',
      save: '儲存',
      saved: '已儲存',
      saving: '儲存中',
      success: '成功',
      unsavedChanges: '有未儲存的變更',
      unknownError: '發生未知錯誤，請重試',
      collapse: '收合',
      more: '更多...',
      contextMenu: {
        summarizeThisPage: '總結此頁',
        addToChat: '加入選取內容到聊天框',
        openSetting: '開啟設定',
      },
    },
    content: {
      badgeLabel: '網頁總結',
      summary: '總結',
      reSummarize: '重新總結',
      untitledPage: '未命名頁面',
      contentTokenCount: '內容 Token 數:',
      tokenViewerInfoTip: '此介面僅用於視覺化分詞效果。在此處的拖動調節不會改變實際發送給大語言模型的文本內容。',
      calculating: '計算中...',
    },
    general: {
      loadFailed: '一般設定載入失敗。',
      restoreDefaults: '還原預設值',
      saveFailed: '一般設定儲存失敗。',
      savedToast: '一般設定已儲存。',
      sections: {
        contextMenu: { description: '選擇擴充套件在頁面選單中提供哪些入口。', title: '右鍵選單' },
        triggers: { description: '控制面板的預設行為以及何時自動開始工作。', title: '觸發' },
      },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: '將頁面選取文字加入對話後立即開始訊息對話。', label: '加入後立即發送選取文字' },
        enableAutoBeginSummary: { description: '', label: '啟動面板後立即開始總結' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: '透過右鍵選單觸發後立即開始總結' },
        enableChatInputBox: { description: '在總結面板中顯示聊天輸入框。', label: '聊天輸入框' },
        enableContextMenuAddSelectionToChat: { description: '顯示將選取文字加入聊天的選單項目。', label: '加入選取文字到聊天' },
        enableContextMenuSummarizeThisPage: { description: '顯示總結當前頁面的選單項目。', label: '總結當前頁面' },
        enableCreateNewPanelButton: { description: '顯示建立額外的另一個總結面板的按鈕。', label: '允許建立新面板' },
        enableFloatingBall: { description: '在右下角顯示用於開啟總結面板的懸浮按鈕。', label: '懸浮按鈕' },
        enableSummaryWindowDefault: { caution: '這會改變每個匹配頁面的預設行為。', description: '', label: '新頁面自動開啟面板' },
        enableTokenUsageView: { description: '顯示 token 用量。', label: 'Token 用量' },
      },
      summaryLanguage: { description: '總結輸出的語言', label: '總結語言' },
      title: '一般設定',
    },
    exportImport: {
      exportImportDescription: '在這裡您可以匯出、匯入或重設擴充套件的所有設定、模型和提示詞設定。',
      exportConfiguration: '匯出設定',
      exportWithApiKeys: '是否包含 API Keys？',
      copyToClipboard: '複製到剪貼簿',
      importConfiguration: '匯入設定',
      importConfigurationDescription: '從剪貼簿讀取設定。您可以逐條選擇需要覆蓋或加入的設定。',
      readFromClipboard: '從剪貼簿讀取',
      dangerZone: '危險操作',
      resetConfigurationDescription: '清除所有本機儲存中的擴充套件設定。請在操作前確保您已經匯出了需要的設定備份。',
      resetAllConfigurations: '重設所有設定',
      resetConfirm: '確定要清除所有設定嗎？此操作無法復原。',
      noChanges: '未發現任何變更',
      noChangesDesc: '剪貼簿中的設定與目前設定完全一致。',
      reviewImport: '請審閱即將匯入的設定',
      importedSuccess: (count) => `成功匯入了 ${count} 項設定。`,
      noImportSelected: '未選擇任何設定進行匯入。',
      resetSuccess: '所有設定已被清除。',
      importReviewTitle: '匯入審閱',
      confirmImport: '確認匯入',
      acceptAll: '全部接受',
      rejectAll: '全部拒絕',
      cancel: '取消',
      configItem: '設定項目',
      oldValue: '舊的值',
      newValue: '新的值',
      action: '操作',
      conflict: '衝突',
      addNew: '新增',
      overwrite: '覆蓋',
      accept: '接受',
      skip: '跳過',
      discard: '放棄',
    },
    options: {
      debug: '除錯',
      header: {
        defaultModel: '預設模型', defaultModelFailed: '預設模型切換失敗。',
        defaultPrompt: '預設提示詞', defaultPromptFailed: '預設提示詞切換失敗。',
        language: '語言', noModels: '還沒有模型設定', noPrompts: '還沒有提示詞模板',
      },
      navigation: { exportImport: '設定管理', general: '一般', interface: '介面', models: '模型', prompts: '提示詞', siteCustomization: '站點客製化' },
      navigationLabel: '選項',
    },
    interface: {
      chatInputBox: { description: '預設在總結面板底部展示對話輸入框，你可以隨時輸入新的提問或指令。', title: '預設開啟對話輸入框' },
      floatingBall: { description: '在網頁中顯示一個可以隨時開啟總結面板的懸浮控制球。', title: '懸浮球' },
      panelLayout: { description: '', dialog: '懸浮面板', sidebar: '側邊欄', title: '預設面板形式' },
      shortcuts: { model: '模型', prompt: '提示詞', title: '快捷跳轉' },
      title: '介面',
    },
    models: {
      createModelConfig: '建立模型設定', noModelConfigsYet: '暫無模型設定',
      createOneBeforeBackgroundBridge: '請先建立一個模型設定，以便後台腳本可以呼叫 API。',
      defaultBadge: '預設', provider: '供應商', baseUrl: '基礎 URL', apiMode: 'API 模式', maxInputTokens: '最大輸入 Token', price: '價格',
      useDefault: (name) => `將 ${name} 設為預設`, moveUp: (name) => `上移 ${name}`, moveDown: (name) => `下移 ${name}`,
      duplicate: (name) => `複製 ${name}`, edit: (name) => `編輯 ${name}`, delete: (name) => `刪除 ${name}`,
      deleteConfirm: (name) => `確定要刪除 "${name}" 嗎？`, deletedToast: '模型已刪除。', deleteFailed: '模型刪除失敗。',
      moveFailed: '模型移動失敗。', duplicatedToast: '模型已複製。', duplicateFailed: '模型複製失敗。', defaultChangedFailed: '預設模型切換失敗。',
    },
    pageExtraction: {
      method: { description: '獲取頁面內容的演算法', title: '頁面內容提取方式' },
      methods: {
        'dom-heuristic': { description: '按語義 DOM 容器打分，保留文件提示塊、註解等較長的可見內容。', label: 'DOM 啟發式' },
        readability: { description: '按閱讀模式提取文章內容。', label: 'Readability' },
      },
    },
    prompts: {
      create: '建立提示詞', createFromPreset: '從預置開始：', createdToast: '提示詞已建立。', defaultBadge: '預設',
      delete: (name) => `刪除 ${name}`, deleteConfirm: (name) => `確認刪除“${name}”？`, deleteFailed: '提示詞刪除失敗。', deletedToast: '提示詞已刪除。',
      edit: (name) => `編輯 ${name}`, emptyDescription: '先建立一個提示詞模板，再組裝總結輸入。', emptyTitle: '還沒有提示詞模板',
      libraryDescription: '在這裡管理可重複使用的 system 和 user 模板，選擇預設項，並調整後續選擇器中的順序。', libraryTitle: '提示詞模板',
      loadFailed: '提示詞設定載入失敗。', makeDefault: (name) => `將 ${name} 設為預設提示詞`, missingPromptId: '缺少提示詞 ID。',
      moveDown: (name) => `下移 ${name}`, moveFailed: '提示詞順序調整失敗。', moveUp: (name) => `上移 ${name}`,
      name: '名稱', namePlaceholder: '文章總結', promptNotFound: '未找到提示詞。', saveFailed: '提示詞儲存失敗。', savedToast: '提示詞已儲存。',
      selectDefaultFailed: '預設提示詞切換失敗。', systemMessage: 'System 訊息', systemMessageDescription: '定義總結行為、輸出語言和輸出格式。',
      templateVariables: '模板變數', templateVariablesDescription: '組裝總結請求時會渲染這些佔位符。', userMessage: 'User 訊息',
      userMessageDescription: '包裹頁面輸入並補充任務上下文。',
      variableDescriptions: {
        articleUrl: '當前總結頁面的 URL。', currentSelection: '頁面中當前存在的選取文字。', summaryLanguage: '設定的輸出語言。', textContent: '作為總結輸入的頁面提取文字。',
      },
    },
    pageTitles: { createModel: '建立模型', createPrompt: '建立提示詞', editModel: '編輯模型', editPrompt: '編輯提示詞', exportImport: '設定管理', interface: '介面', models: '模型', prompts: '提示詞', siteCustomization: '站點客製化', welcome: '歡迎' },
    popup: { noActiveTab: '沒有可用的當前分頁', openOptions: '設定', model: '模型', prompt: '提示詞', summary: '總結', page: 'Page', openPanelAndStartSummary: '開啟總結面板並立即開始總結', copyPageContentToClipboard: '複製頁面內容到剪貼簿', extractFailed: '頁面內容提取失敗', copySuccess: '已複製頁面內容', copyFailed: '複製失敗', invokeSummaryFailed: '無法觸發總結' },
    siteCustomization: {
      examplesTitle: '匹配規則範例', examplesDescription: '支援現代 glob 語法 (picomatch)。',
      examples: [ { key: 'example.com', description: '匹配 example.com' }, { key: '*.example.com', description: '匹配 a.example.com' }, { key: '**.example.com', description: '匹配 a.example.com, a.b.example.com' }, { key: 'example.com/articles/*', description: '匹配 example.com/articles/1' } ],
      whitelist: '白名單', blacklist: '黑名單', whitelistDescription: '開啟後，套件只會注入到白名單內的網頁。', blacklistDescription: '開啟後，套件不會注入到黑名單內的網頁。', patternsLabel: '匹配規則', onePerLine: '每行一個',
      whitelistPlaceholder: '例如：\nwww.reddit.com\n*.news.com', blacklistPlaceholder: '例如：\nwww.bing.com\n*.visa.com',
      customizationTitle: '站點客製化', customizationDescription: '為特定站點設定 CSS 選擇器，以便套件更準確地獲取內容。', addRule: '加入規則', noRules: '暫無站點客製化規則', noRulesDescription: '為自動提取內容失敗的站點加入選擇器規則。',
      newRuleFallback: '新規則', matchPattern: '匹配規則', matchPatternPlaceholder: '支援 minimatch 語法', useShadowRoot: '穿透 Shadow DOM', selectorsNormal: 'CSS 選擇器', selectorsHost: '宿主選擇器',
      selectorsPlaceholderNormal: '例如：\n.text-neutral-content', selectorsPlaceholderHost: '例如：\n#app > div', shadowRootSelectors: 'Shadow Root 內部選擇器', shadowRootSelectorsPlaceholder: '例如：\n#content', shadowRootTip: '從上述選擇器匹配到的元素內部進入 shadowRoot 並應用這些選擇器。'
    },
  },
  'ja': {
    common: {
      allChangesSaved: 'すべての変更が保存されました。', back: '戻る', loadingSettings: '設定を読み込み中...',
      off: 'オフ', on: 'オン', save: '保存', saved: '保存済み', saving: '保存中', success: '成功',
      unsavedChanges: '未保存の変更', unknownError: '不明なエラーが発生しました', collapse: '折りたたむ', more: 'さらに...',
      contextMenu: { summarizeThisPage: 'このページを要約', addToChat: '選択範囲をチャットに追加', openSetting: '設定を開く' },
    },
    content: {
      badgeLabel: 'ウェブページ要約', summary: '要約', reSummarize: '再要約', untitledPage: '無題のページ',
      contentTokenCount: 'コンテンツトークン数:', tokenViewerInfoTip: 'このビューはトークン化を視覚化するためのものです。ここでの操作は、実際にLLMへ送信されるテキストには影響しません。', calculating: '計算中...',
    },
    general: {
      loadFailed: '設定の読み込みに失敗しました。', restoreDefaults: 'デフォルトに戻す', saveFailed: '保存に失敗しました。', savedToast: '設定を保存しました。',
      sections: { contextMenu: { description: 'コンテキストメニューに表示する項目を選択します。', title: 'コンテキストメニュー' }, triggers: { description: 'パネルのデフォルト動作を設定します。', title: 'トリガー' } },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: '選択したテキストをチャットに追加した直後に送信します。', label: '追加直後に送信' },
        enableAutoBeginSummary: { description: '', label: 'パネル起動後すぐに要約を開始' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: 'コンテキストメニューからトリガー後すぐに要約' },
        enableChatInputBox: { description: '要約パネルにチャット入力ボックスを表示します。', label: 'チャット入力ボックス' },
        enableContextMenuAddSelectionToChat: { description: 'チャットに追加するメニュー項目を表示します。', label: '選択範囲をチャットに追加' },
        enableContextMenuSummarizeThisPage: { description: 'ページを要約するメニュー項目を表示します。', label: 'このページを要約' },
        enableCreateNewPanelButton: { description: '新しい要約パネルを作成するボタンを表示します。', label: '新規パネルの作成を許可' },
        enableFloatingBall: { description: 'パネルを開くためのフローティングボタンを表示します。', label: 'フローティングボタン' },
        enableSummaryWindowDefault: { caution: '全ての一致するページで動作が変わります。', description: '', label: '新しいページでパネルを自動で開く' },
        enableTokenUsageView: { description: 'トークン使用量を表示します。', label: 'トークン使用量' },
      },
      summaryLanguage: { description: '出力言語', label: '要約の言語' }, title: '一般設定',
    },
    exportImport: {
      exportImportDescription: '拡張機能のすべての設定・モデル・プロンプト設定をエクスポート、インポート、またはリセットできます。',
      exportConfiguration: '設定のエクスポート', exportWithApiKeys: 'APIキーを含める', copyToClipboard: 'クリップボードにコピー',
      importConfiguration: '設定のインポート', importConfigurationDescription: 'クリップボードから設定を読み込みます。各項目を個別に選択して上書き・追加できます。', readFromClipboard: 'クリップボードから読み込む',
      dangerZone: '危険な操作', resetConfigurationDescription: 'ローカルストレージ内のすべての拡張機能設定を削除します。操作前に必要な設定をエクスポートしてください。', resetAllConfigurations: 'すべての設定をリセット',
      resetConfirm: '設定をリセットしてもよろしいですか？', noChanges: '変更なし', noChangesDesc: '現在の設定と同じです。',
      reviewImport: 'インポートする設定を確認してください', importedSuccess: (count) => `${count}件のアイテムをインポートしました。`,
      noImportSelected: 'アイテムが選択されていません。', resetSuccess: 'すべての設定がクリアされました。',
      importReviewTitle: 'インポートの確認', confirmImport: 'インポートの確認', acceptAll: 'すべて受け入れる', rejectAll: 'すべて拒否する', cancel: 'キャンセル',
      configItem: '設定項目', oldValue: '元の値', newValue: '新しい値', action: 'アクション', conflict: '競合', addNew: '新規追加', overwrite: '上書き', accept: '承認', skip: 'スキップ', discard: '破棄',
    },
    options: {
      debug: 'デバッグ', header: { defaultModel: 'デフォルトモデル', defaultModelFailed: '失敗しました。', defaultPrompt: 'デフォルトプロンプト', defaultPromptFailed: '失敗しました。', language: '言語', noModels: 'モデルなし', noPrompts: 'プロンプトなし' },
      navigation: { exportImport: '設定の管理', general: '一般', interface: 'インターフェース', models: 'モデル', prompts: 'プロンプト', siteCustomization: 'サイトのカスタマイズ' }, navigationLabel: 'オプション',
    },
    interface: {
      chatInputBox: { description: 'チャット入力を表示します。', title: 'チャット入力ボックス' },
      floatingBall: { description: 'フローティングボタンを表示します。', title: 'フローティングボタン' },
      panelLayout: { description: '', dialog: 'フローティングパネル', sidebar: 'サイドバー', title: 'パネルのレイアウト' },
      shortcuts: { model: 'モデル', prompt: 'プロンプト', title: 'ショートカット' }, title: 'インターフェース',
    },
    models: {
      createModelConfig: 'モデル設定を作成', noModelConfigsYet: 'モデル設定なし', createOneBeforeBackgroundBridge: 'モデル設定を作成してください。',
      defaultBadge: 'デフォルト', provider: 'プロバイダー', baseUrl: 'ベースURL', apiMode: 'API モード', maxInputTokens: '最大入力トークン', price: '価格',
      useDefault: (name) => `${name} をデフォルトに設定`, moveUp: (name) => `${name} を上へ`, moveDown: (name) => `${name} を下へ`, duplicate: (name) => `${name} を複製`, edit: (name) => `${name} を編集`, delete: (name) => `${name} を削除`, deleteConfirm: (name) => `「${name}」を削除しますか？`, deletedToast: '削除しました。', deleteFailed: 'モデルの削除に失敗しました。', moveFailed: 'モデルの移動に失敗しました。', duplicatedToast: '複製しました。', duplicateFailed: 'モデルの複製に失敗しました。', defaultChangedFailed: 'デフォルトモデルの切り替えに失敗しました。',
    },
    pageExtraction: {
      method: { description: 'テキストの抽出方法', title: 'テキスト抽出方法' },
      methods: { 'dom-heuristic': { description: 'セマンティック DOM コンテナをスコアリングし、コードブロックやコメントなど長い可視コンテンツを優先して保持します。', label: 'DOM ヒューリスティック' }, readability: { description: 'リーダーモードで記事コンテンツを抽出します。', label: 'Readability' } },
    },
    prompts: {
      create: 'プロンプトを作成', createFromPreset: 'プリセットから作成:', createdToast: '作成しました。', defaultBadge: 'デフォルト', delete: (name) => `${name} を削除`, deleteConfirm: (name) => `「${name}」を削除しますか？`, deleteFailed: 'プロンプトの削除に失敗しました。', deletedToast: '削除しました。', edit: (name) => `${name} を編集`, emptyDescription: 'プロンプトテンプレートを作成して要約入力を組み立ててください。', emptyTitle: 'テンプレートなし', libraryDescription: '再利用可能な system・user テンプレートを管理し、デフォルトを選択してセレクターの並び順を調整します。', libraryTitle: 'プロンプトテンプレート', loadFailed: '読み込みに失敗しました。', makeDefault: (name) => `${name} をデフォルトプロンプトに設定`, missingPromptId: 'IDがありません。', moveDown: (name) => `${name} を下へ`, moveFailed: 'プロンプト順序の変更に失敗しました。', moveUp: (name) => `${name} を上へ`, name: '名前', namePlaceholder: '記事の要約', promptNotFound: '見つかりません。', saveFailed: '保存に失敗しました。', savedToast: '保存しました。', selectDefaultFailed: 'デフォルトプロンプトの切り替えに失敗しました。', systemMessage: 'System メッセージ', systemMessageDescription: '要約の動作、出力言語、出力フォーマットを定義します。', templateVariables: 'テンプレート変数', templateVariablesDescription: '要約リクエスト組み立て時にこれらのプレースホルダーが展開されます。', userMessage: 'User メッセージ', userMessageDescription: 'ページの入力をラップし、タスクのコンテキストを補足します。',
      variableDescriptions: { articleUrl: '現在要約中のページのURL。', currentSelection: 'ページ上で現在選択中のテキスト。', summaryLanguage: '設定された出力言語。', textContent: '要約入力として使用するページ抽出テキスト。' },
    },
    pageTitles: { createModel: 'モデル作成', createPrompt: 'プロンプト作成', editModel: 'モデル編集', editPrompt: 'プロンプト編集', exportImport: '設定管理', interface: 'インターフェース', models: 'モデル', prompts: 'プロンプト', siteCustomization: 'サイトカスタマイズ', welcome: 'ようこそ' },
    popup: { noActiveTab: 'タブなし', openOptions: '設定', model: 'モデル', prompt: 'プロンプト', summary: '要約', page: 'ページ', openPanelAndStartSummary: '要約を開始', copyPageContentToClipboard: 'コピー', extractFailed: '失敗しました', copySuccess: 'コピーしました', copyFailed: '失敗しました', invokeSummaryFailed: '失敗しました' },
    siteCustomization: {
      examplesTitle: 'マッチパターンの例', examplesDescription: '最新の glob 構文 (picomatch) をサポートしています。', examples: [ { key: 'example.com', description: 'example.com に一致' }, { key: '*.example.com', description: 'a.example.com に一致' }, { key: '**.example.com', description: 'a.example.com、a.b.example.com に一致' }, { key: 'example.com/articles/*', description: 'example.com/articles/1 に一致' } ], whitelist: 'ホワイトリスト', blacklist: 'ブラックリスト', whitelistDescription: '有効にすると、拡張機能はホワイトリスト内のページにのみ挿入されます。', blacklistDescription: '有効にすると、拡張機能はブラックリスト内のページには挿入されません。', patternsLabel: 'URL パターン', onePerLine: '1行に1つ', whitelistPlaceholder: '例:\nwww.reddit.com\n*.news.com', blacklistPlaceholder: '例:\nwww.bing.com\n*.visa.com',
      customizationTitle: 'サイトのカスタマイズ', customizationDescription: '特定のサイトに CSS セレクターを設定し、拡張機能がより正確にコンテンツを取得できるようにします。', addRule: 'ルールを追加', noRules: 'カスタマイズルールなし', noRulesDescription: '自動抽出がうまくいかないサイト用にセレクタールールを追加します。', newRuleFallback: '新規ルール', matchPattern: 'マッチパターン', matchPatternPlaceholder: 'minimatch 構文をサポート', useShadowRoot: 'Shadow DOM を穿通', selectorsNormal: 'CSS セレクター', selectorsHost: 'ホストセレクター', selectorsPlaceholderNormal: '例:\n.text-neutral-content', selectorsPlaceholderHost: '例:\n#app > div', shadowRootSelectors: 'Shadow Root 内部セレクター', shadowRootSelectorsPlaceholder: '例:\n#content', shadowRootTip: '上記のセレクターに一致した要素内部から shadowRoot に進入し、これらのセレクターを適用します。'
    },
  },
  'ko': {
    common: {
      allChangesSaved: '모든 변경 사항이 저장되었습니다.', back: '뒤로', loadingSettings: '설정 로드 중...',
      off: '끄기', on: '켜기', save: '저장', saved: '저장됨', saving: '저장 중', success: '성공',
      unsavedChanges: '저장되지 않은 변경 사항', unknownError: '알 수 없는 오류가 발생했습니다.', collapse: '접기', more: '더보기...',
      contextMenu: { summarizeThisPage: '이 페이지 요약', addToChat: '채팅에 선택 항목 추가', openSetting: '설정 열기' },
    },
    content: {
      badgeLabel: '웹페이지 요약', summary: '요약', reSummarize: '다시 요약', untitledPage: '제목 없는 페이지',
      contentTokenCount: '콘텐츠 토큰 수:', tokenViewerInfoTip: '이 뷰어는 토큰화를 시각화하기 위한 것입니다. 여기서의 조작은 실제로 LLM에 전송되는 텍스트에 영향을 주지 않습니다.', calculating: '계산 중...',
    },
    general: {
      loadFailed: '설정 로드 실패.', restoreDefaults: '기본값 복원', saveFailed: '저장 실패.', savedToast: '설정이 저장되었습니다.',
      sections: { contextMenu: { description: '컨텍스트 메뉴 항목을 선택합니다.', title: '컨텍스트 메뉴' }, triggers: { description: '패널의 기본 동작을 설정합니다.', title: '트리거' } },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: '채팅에 선택한 텍스트를 추가한 후 바로 전송합니다.', label: '추가 후 바로 전송' },
        enableAutoBeginSummary: { description: '', label: '패널 실행 후 바로 요약 시작' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: '컨텍스트 메뉴 트리거 후 바로 요약 시작' },
        enableChatInputBox: { description: '요약 패널에 채팅 입력 상자를 표시합니다.', label: '채팅 입력 상자' },
        enableContextMenuAddSelectionToChat: { description: '채팅에 추가하는 메뉴 항목을 표시합니다.', label: '채팅에 선택 항목 추가' },
        enableContextMenuSummarizeThisPage: { description: '페이지를 요약하는 메뉴 항목을 표시합니다.', label: '이 페이지 요약' },
        enableCreateNewPanelButton: { description: '새 요약 패널 생성 버튼을 표시합니다.', label: '새 패널 생성 허용' },
        enableFloatingBall: { description: '패널 열기를 위한 플로팅 버튼을 표시합니다.', label: '플로팅 버튼' },
        enableSummaryWindowDefault: { caution: '일치하는 모든 페이지에서 동작이 변경됩니다.', description: '', label: '새 페이지에서 패널 자동 열기' },
        enableTokenUsageView: { description: '토큰 사용량을 표시합니다.', label: '토큰 사용량' },
      },
      summaryLanguage: { description: '출력 언어', label: '요약 언어' }, title: '일반 설정',
    },
    exportImport: {
      exportImportDescription: '확장 프로그램의 모든 설정, 모델, 프롬프트 구성을 내보내기, 가져오기 또는 재설정할 수 있습니다.',
      exportConfiguration: '설정 내보내기', exportWithApiKeys: 'API 키 포함', copyToClipboard: '클립보드에 복사',
      importConfiguration: '설정 가져오기', importConfigurationDescription: '클립보드에서 설정을 읽어옵니다. 각 항목을 개별적으로 선택하여 덮어쓰거나 추가할 수 있습니다.', readFromClipboard: '클립보드에서 읽기',
      dangerZone: '위험 구역', resetConfigurationDescription: '로컬 스토리지의 모든 확장 프로그램 설정을 삭제합니다. 작업 전에 필요한 설정을 내보내 두세요.', resetAllConfigurations: '모든 설정 재설정',
      resetConfirm: '설정을 재설정하시겠습니까?', noChanges: '변경 사항 없음', noChangesDesc: '현재 설정과 같습니다.',
      reviewImport: '가져올 설정을 확인하세요', importedSuccess: (count) => `${count}개 항목을 가져왔습니다.`,
      noImportSelected: '선택된 항목이 없습니다.', resetSuccess: '모든 설정이 지워졌습니다.',
      importReviewTitle: '가져오기 검토', confirmImport: '가져오기 확인', acceptAll: '모두 수락', rejectAll: '모두 거부', cancel: '취소',
      configItem: '설정 항목', oldValue: '기존 값', newValue: '새 값', action: '작업', conflict: '충돌', addNew: '새로 추가', overwrite: '덮어쓰기', accept: '수락', skip: '건너뛰기', discard: '버리기',
    },
    options: {
      debug: '디버그', header: { defaultModel: '기본 모델', defaultModelFailed: '실패했습니다.', defaultPrompt: '기본 프롬프트', defaultPromptFailed: '실패했습니다.', language: '언어', noModels: '모델 없음', noPrompts: '프롬프트 없음' },
      navigation: { exportImport: '설정 관리', general: '일반', interface: '인터페이스', models: '모델', prompts: '프롬프트', siteCustomization: '사이트 사용자 지정' }, navigationLabel: '옵션',
    },
    interface: {
      chatInputBox: { description: '채팅 입력 상자를 표시합니다.', title: '채팅 입력 상자' },
      floatingBall: { description: '플로팅 버튼을 표시합니다.', title: '플로팅 버튼' },
      panelLayout: { description: '', dialog: '플로팅 패널', sidebar: '사이드바', title: '패널 레이아웃' },
      shortcuts: { model: '모델', prompt: '프롬프트', title: '바로 가기' }, title: '인터페이스',
    },
    models: {
      createModelConfig: '모델 설정 생성', noModelConfigsYet: '모델 설정 없음', createOneBeforeBackgroundBridge: '모델 설정을 생성하세요.',
      defaultBadge: '기본', provider: '제공자', baseUrl: '기본 URL', apiMode: 'API 모드', maxInputTokens: '최대 입력 토큰', price: '가격',
      useDefault: (name) => `${name}을(를) 기본으로 설정`, moveUp: (name) => `${name} 위로 이동`, moveDown: (name) => `${name} 아래로 이동`, duplicate: (name) => `${name} 복제`, edit: (name) => `${name} 편집`, delete: (name) => `${name} 삭제`, deleteConfirm: (name) => `"${name}"을(를) 삭제하시겠습니까?`, deletedToast: '삭제되었습니다.', deleteFailed: '모델 삭제에 실패했습니다.', moveFailed: '모델 이동에 실패했습니다.', duplicatedToast: '복제되었습니다.', duplicateFailed: '모델 복제에 실패했습니다.', defaultChangedFailed: '기본 모델 변경에 실패했습니다.',
    },
    pageExtraction: {
      method: { description: '텍스트 추출 방법', title: '텍스트 추출 방법' },
      methods: { 'dom-heuristic': { description: '시맨틱 DOM 컨테이너를 점수로 평가하여 코드 블록, 주석 등 긴 가시 콘텐츠를 우선 보존합니다.', label: 'DOM 휴리스틱' }, readability: { description: '리더 모드로 기사 콘텐츠를 추출합니다.', label: 'Readability' } },
    },
    prompts: {
      create: '프롬프트 생성', createFromPreset: '프리셋에서 생성:', createdToast: '생성되었습니다.', defaultBadge: '기본', delete: (name) => `${name} 삭제`, deleteConfirm: (name) => `"${name}"을(를) 삭제하시겠습니까?`, deleteFailed: '프롬프트 삭제에 실패했습니다.', deletedToast: '삭제되었습니다.', edit: (name) => `${name} 편집`, emptyDescription: '프롬프트 템플릿을 먼저 생성한 후 요약 입력을 조합하세요.', emptyTitle: '템플릿 없음', libraryDescription: '재사용 가능한 system 및 user 템플릿을 관리하고, 기본값을 선택하며 세렉터 순서를 조정합니다.', libraryTitle: '프롬프트 템플릿', loadFailed: '프롬프트 설정 로드에 실패했습니다.', makeDefault: (name) => `${name}을(를) 기본 프롬프트로 설정`, missingPromptId: 'ID가 없습니다.', moveDown: (name) => `${name} 아래로`, moveFailed: '프롬프트 순서 변경에 실패했습니다.', moveUp: (name) => `${name} 위로`, name: '이름', namePlaceholder: '기사 요약', promptNotFound: '프롬프트를 찾을 수 없습니다.', saveFailed: '프롬프트 저장에 실패했습니다.', savedToast: '저장되었습니다.', selectDefaultFailed: '기본 프롬프트 변경에 실패했습니다.', systemMessage: 'System 메시지', systemMessageDescription: '요약의 동작, 출력 언어, 출력 형식을 정의합니다.', templateVariables: '템플릿 변수', templateVariablesDescription: '요약 요청 조합 시 이 자리 표시자들이 렌더링됩니다.', userMessage: 'User 메시지', userMessageDescription: '페이지 입력을 감싸고 작업 컨텍스트를 보완합니다.',
      variableDescriptions: { articleUrl: '현재 요약 중인 페이지의 URL입니다.', currentSelection: '페이지에서 현재 선택된 텍스트입니다.', summaryLanguage: '설정된 출력 언어입니다.', textContent: '요약 입력으로 사용되는 페이지 추출 텍스트입니다.' },
    },
    pageTitles: { createModel: '모델 생성', createPrompt: '프롬프트 생성', editModel: '모델 편집', editPrompt: '프롬프트 편집', exportImport: '설정 관리', interface: '인터페이스', models: '모델', prompts: '프롬프트', siteCustomization: '사이트 맞춤설정', welcome: '환영합니다' },
    popup: { noActiveTab: '활성 탭 없음', openOptions: '설정', model: '모델', prompt: '프롬프트', summary: '요약', page: '페이지', openPanelAndStartSummary: '요약 시작', copyPageContentToClipboard: '복사', extractFailed: '실패했습니다', copySuccess: '복사되었습니다', copyFailed: '실패했습니다', invokeSummaryFailed: '실패했습니다' },
    siteCustomization: {
      examplesTitle: '매칭 규칙 예시', examplesDescription: '최신 glob 구문 (picomatch) 을 지원합니다.', examples: [ { key: 'example.com', description: 'example.com 에 일치' }, { key: '*.example.com', description: 'a.example.com 에 일치' }, { key: '**.example.com', description: 'a.example.com, a.b.example.com 에 일치' }, { key: 'example.com/articles/*', description: 'example.com/articles/1 에 일치' } ], whitelist: '화이트리스트', blacklist: '블랙리스트', whitelistDescription: '활성화하면 확장 프로그램은 화이트리스트 내 페이지에만 삽입됩니다.', blacklistDescription: '활성화하면 확장 프로그램은 블랙리스트 내 페이지에는 삽입되지 않습니다.', patternsLabel: '매칭 규칙', onePerLine: '한 줄에 하나씩', whitelistPlaceholder: '예:\nwww.reddit.com\n*.news.com', blacklistPlaceholder: '예:\nwww.bing.com\n*.visa.com',
      customizationTitle: '사이트 사용자 지정', customizationDescription: '특정 사이트에 CSS 선택기를 설정하여 확장 프로그램이 콘텐츠를 더 정확하게 가져올 수 있도록 합니다.', addRule: '규칙 추가', noRules: '사용자 지정 규칙 없음', noRulesDescription: '자동 추출이 실패한 사이트에 선택기 규칙을 추가하세요.', newRuleFallback: '새 규칙', matchPattern: '매칭 패턴', matchPatternPlaceholder: 'minimatch 구문 지원', useShadowRoot: 'Shadow DOM 관통', selectorsNormal: 'CSS 선택기', selectorsHost: '호스트 선택기', selectorsPlaceholderNormal: '예:\n.text-neutral-content', selectorsPlaceholderHost: '예:\n#app > div', shadowRootSelectors: 'Shadow Root 내부 선택기', shadowRootSelectorsPlaceholder: '예:\n#content', shadowRootTip: '위 선택기로 일치된 요소 내부에서 shadowRoot로 진입하여 이 선택기들을 적용합니다.'
    },
  },
  'pt': {
    common: {
      allChangesSaved: 'Todas as alterações foram salvas.', back: 'Voltar', loadingSettings: 'Carregando...',
      off: 'Desligado', on: 'Ligado', save: 'Salvar', saved: 'Salvo', saving: 'Salvando', success: 'Sucesso',
      unsavedChanges: 'Alterações não salvas', unknownError: 'Ocorreu um erro desconhecido.', collapse: 'Recolher', more: 'Mais...',
      contextMenu: { summarizeThisPage: 'Resumir esta página', addToChat: 'Adicionar ao chat', openSetting: 'Abrir configurações' },
    },
    content: {
      badgeLabel: 'Resumo da página', summary: 'Resumo', reSummarize: 'Resumir novamente', untitledPage: 'Página sem título',
      contentTokenCount: 'Tokens:', tokenViewerInfoTip: 'Esta interface serve apenas para visualizar a tokenização. Os ajustes aqui não alteram o texto real enviado ao modelo de linguagem.', calculating: 'Calculando...',
    },
    general: {
      loadFailed: 'Falha ao carregar.', restoreDefaults: 'Restaurar padrões', saveFailed: 'Falha ao salvar.', savedToast: 'Salvo.',
      sections: { contextMenu: { description: 'Escolha quais entradas a extensão oferece no menu de contexto da página.', title: 'Menu de contexto' }, triggers: { description: 'Controla o comportamento padrão do painel e quando ele inicia automaticamente.', title: 'Gatilhos' } },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: 'Envia a mensagem imediatamente após adicionar a seleção ao chat.', label: 'Enviar ao adicionar' },
        enableAutoBeginSummary: { description: '', label: 'Resumir ao abrir o painel' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: 'Resumir ao acionar pelo menu' },
        enableChatInputBox: { description: 'Exibe a caixa de entrada de chat no painel de resumo.', label: 'Caixa de chat' },
        enableContextMenuAddSelectionToChat: { description: 'Exibe o item de menu para adicionar seleção ao chat.', label: 'Adicionar seleção ao chat' },
        enableContextMenuSummarizeThisPage: { description: 'Exibe o item de menu para resumir a página atual.', label: 'Resumir esta página' },
        enableCreateNewPanelButton: { description: 'Exibe o botão para criar um painel de resumo adicional.', label: 'Permitir criar novo painel' },
        enableFloatingBall: { description: 'Exibe um botão flutuante no canto inferior direito para abrir o painel.', label: 'Botão flutuante' },
        enableSummaryWindowDefault: { caution: 'Isso altera o comportamento padrão em todas as páginas correspondentes.', description: '', label: 'Abrir painel automaticamente em novas páginas' },
        enableTokenUsageView: { description: 'Exibe o uso de tokens.', label: 'Uso de tokens' },
      },
      summaryLanguage: { description: 'Idioma do resumo.', label: 'Idioma' }, title: 'Geral',
    },
    exportImport: {
      exportImportDescription: 'Aqui você pode exportar, importar ou redefinir todas as configurações, modelos e prompts da extensão.',
      exportConfiguration: 'Exportar configurações', exportWithApiKeys: 'Incluir chaves de API?', copyToClipboard: 'Copiar para a área de transferência',
      importConfiguration: 'Importar configurações', importConfigurationDescription: 'Lê as configurações da área de transferência. Você pode selecionar individualmente quais itens deseja sobrescrever ou adicionar.', readFromClipboard: 'Ler da área de transferência',
      dangerZone: 'Zona de Perigo', resetConfigurationDescription: 'Remove todas as configurações da extensão no armazenamento local. Certifique-se de exportar um backup antes de prosseguir.', resetAllConfigurations: 'Redefinir todas as configurações',
      resetConfirm: 'Tem certeza?', noChanges: 'Sem mudanças', noChangesDesc: 'As configurações são as mesmas.',
      reviewImport: 'Revisar', importedSuccess: (count) => `${count} importados.`,
      noImportSelected: 'Nada selecionado.', resetSuccess: 'Resetado.',
      importReviewTitle: 'Revisão', confirmImport: 'Confirmar', acceptAll: 'Aceitar tudo', rejectAll: 'Rejeitar', cancel: 'Cancelar',
      configItem: 'Item', oldValue: 'Antigo', newValue: 'Novo', action: 'Ação', conflict: 'Conflito', addNew: 'Novo', overwrite: 'Sobrescrever', accept: 'Aceitar', skip: 'Pular', discard: 'Descartar',
    },
    options: {
      debug: 'Debug', header: { defaultModel: 'Modelo padrão', defaultModelFailed: 'Falha.', defaultPrompt: 'Prompt padrão', defaultPromptFailed: 'Falha.', language: 'Idioma', noModels: 'Sem modelos', noPrompts: 'Sem prompts' },
      navigation: { exportImport: 'Configurações', general: 'Geral', interface: 'Interface', models: 'Modelos', prompts: 'Prompts', siteCustomization: 'Sites' }, navigationLabel: 'Opções',
    },
    interface: {
      chatInputBox: { description: 'Mostrar caixa de entrada.', title: 'Caixa de chat' },
      floatingBall: { description: 'Botão flutuante.', title: 'Botão flutuante' },
      panelLayout: { description: '', dialog: 'Flutuante', sidebar: 'Barra lateral', title: 'Layout' },
      shortcuts: { model: 'Modelo', prompt: 'Prompt', title: 'Atalhos' }, title: 'Interface',
    },
    models: {
      createModelConfig: 'Criar modelo', noModelConfigsYet: 'Sem modelos', createOneBeforeBackgroundBridge: 'Crie um modelo.',
      defaultBadge: 'Padrão', provider: 'Provedor', baseUrl: 'Base URL', apiMode: 'Modo API', maxInputTokens: 'Tokens máx', price: 'Preço',
      useDefault: (name) => `Definir ${name} como padrão`, moveUp: (name) => `Mover ${name} para cima`, moveDown: (name) => `Mover ${name} para baixo`, duplicate: (name) => `Duplicar ${name}`, edit: (name) => `Editar ${name}`, delete: (name) => `Excluir ${name}`, deleteConfirm: (name) => `Excluir "${name}"?`, deletedToast: 'Modelo excluído.', deleteFailed: 'Falha ao excluir o modelo.', moveFailed: 'Falha ao mover o modelo.', duplicatedToast: 'Modelo duplicado.', duplicateFailed: 'Falha ao duplicar o modelo.', defaultChangedFailed: 'Falha ao alterar o modelo padrão.',
    },
    pageExtraction: {
      method: { description: 'Algoritmo para obter o conteúdo da página', title: 'Método de extração de conteúdo' },
      methods: { 'dom-heuristic': { description: 'Pontua containers DOM semânticos e preserva conteúdos visíveis mais longos, como blocos de código e comentários.', label: 'DOM Heurístico' }, readability: { description: 'Extrai o conteúdo do artigo no modo leitura.', label: 'Readability' } },
    },
    prompts: {
      create: 'Criar prompt', createFromPreset: 'A partir de um preset:', createdToast: 'Prompt criado.', defaultBadge: 'Padrão', delete: (name) => `Excluir ${name}`, deleteConfirm: (name) => `Excluir "${name}"?`, deleteFailed: 'Falha ao excluir o prompt.', deletedToast: 'Prompt excluído.', edit: (name) => `Editar ${name}`, emptyDescription: 'Crie um template de prompt para montar a entrada do resumo.', emptyTitle: 'Nenhum template de prompt', libraryDescription: 'Gerencie templates reutilizáveis de system e user, selecione o padrão e ajuste a ordem nos seletores.', libraryTitle: 'Templates de prompt', loadFailed: 'Falha ao carregar as configurações de prompt.', makeDefault: (name) => `Definir ${name} como prompt padrão`, missingPromptId: 'ID do prompt ausente.', moveDown: (name) => `Mover ${name} para baixo`, moveFailed: 'Falha ao reordenar o prompt.', moveUp: (name) => `Mover ${name} para cima`, name: 'Nome', namePlaceholder: 'Resumo de artigo', promptNotFound: 'Prompt não encontrado.', saveFailed: 'Falha ao salvar o prompt.', savedToast: 'Prompt salvo.', selectDefaultFailed: 'Falha ao alterar o prompt padrão.', systemMessage: 'Mensagem System', systemMessageDescription: 'Define o comportamento, o idioma de saída e o formato do resumo.', templateVariables: 'Variáveis de template', templateVariablesDescription: 'Esses marcadores são substituídos ao montar a requisição de resumo.', userMessage: 'Mensagem User', userMessageDescription: 'Envolve a entrada da página e complementa o contexto da tarefa.',
      variableDescriptions: { articleUrl: 'URL da página sendo resumida.', currentSelection: 'Texto atualmente selecionado na página.', summaryLanguage: 'Idioma de saída configurado.', textContent: 'Texto extraído da página usado como entrada do resumo.' },
    },
    pageTitles: { createModel: 'Criar modelo', createPrompt: 'Criar prompt', editModel: 'Editar modelo', editPrompt: 'Editar prompt', exportImport: 'Configurações', interface: 'Interface', models: 'Modelos', prompts: 'Prompts', siteCustomization: 'Personalização', welcome: 'Bem-vindo' },
    popup: { noActiveTab: 'Sem guia ativa', openOptions: 'Opções', model: 'Modelo', prompt: 'Prompt', summary: 'Resumo', page: 'Página', openPanelAndStartSummary: 'Iniciar resumo', copyPageContentToClipboard: 'Copiar conteúdo', extractFailed: 'Falha', copySuccess: 'Copiado', copyFailed: 'Falha', invokeSummaryFailed: 'Falha' },
    siteCustomization: {
      examplesTitle: 'Exemplos de regras de correspondência', examplesDescription: 'Suporta a sintaxe glob moderna (picomatch).', examples: [ { key: 'example.com', description: 'Corresponde a example.com' }, { key: '*.example.com', description: 'Corresponde a a.example.com' }, { key: '**.example.com', description: 'Corresponde a a.example.com, a.b.example.com' }, { key: 'example.com/articles/*', description: 'Corresponde a example.com/articles/1' } ], whitelist: 'Lista de permissões', blacklist: 'Lista de bloqueios', whitelistDescription: 'Quando ativado, a extensão é injetada apenas nas páginas da lista de permissões.', blacklistDescription: 'Quando ativado, a extensão não é injetada nas páginas da lista de bloqueios.', patternsLabel: 'Regras de correspondência', onePerLine: 'Uma por linha', whitelistPlaceholder: 'ex.:\nwww.reddit.com\n*.news.com', blacklistPlaceholder: 'ex.:\nwww.bing.com\n*.visa.com',
      customizationTitle: 'Personalização de sites', customizationDescription: 'Configure seletores CSS para sites específicos, para que a extensão extraia o conteúdo com mais precisão.', addRule: 'Adicionar regra', noRules: 'Nenhuma regra personalizada', noRulesDescription: 'Adicione regras de seletores para sites onde a extração automática falha.', newRuleFallback: 'Nova regra', matchPattern: 'Padrão de correspondência', matchPatternPlaceholder: 'Suporta sintaxe minimatch', useShadowRoot: 'Penetrar Shadow DOM', selectorsNormal: 'Seletores CSS', selectorsHost: 'Seletores de host', selectorsPlaceholderNormal: 'ex.:\n.text-neutral-content', selectorsPlaceholderHost: 'ex.:\n#app > div', shadowRootSelectors: 'Seletores internos do Shadow Root', shadowRootSelectorsPlaceholder: 'ex.:\n#content', shadowRootTip: 'Entra no shadowRoot a partir dos elementos correspondentes aos seletores acima e aplica estes seletores.'
    },
  },
  'es': {
    common: {
      allChangesSaved: 'Todos los cambios han sido guardados.', back: 'Atrás', loadingSettings: 'Cargando...',
      off: 'Apagado', on: 'Encendido', save: 'Guardar', saved: 'Guardado', saving: 'Guardando', success: 'Éxito',
      unsavedChanges: 'Cambios no guardados', unknownError: 'Ocurrió un error desconocido.', collapse: 'Contraer', more: 'Más...',
      contextMenu: { summarizeThisPage: 'Resumir esta página', addToChat: 'Añadir al chat', openSetting: 'Abrir configuración' },
    },
    content: {
      badgeLabel: 'Resumen de página', summary: 'Resumen', reSummarize: 'Volver a resumir', untitledPage: 'Página sin título',
      contentTokenCount: 'Tokens:', tokenViewerInfoTip: 'Esta interfaz es solo para visualizar la tokenización. Los ajustes aquí no modifican el texto que se envía realmente al modelo de lenguaje.', calculating: 'Calculando...',
    },
    general: {
      loadFailed: 'Fallo al cargar.', restoreDefaults: 'Restaurar', saveFailed: 'Fallo al guardar.', savedToast: 'Guardado.',
      sections: { contextMenu: { description: 'Elige qué entradas ofrece la extensión en el menú contextual de la página.', title: 'Menú contextual' }, triggers: { description: 'Controla el comportamiento predeterminado del panel y cuándo empieza a trabajar automáticamente.', title: 'Desencadenadores' } },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: 'Envía el mensaje inmediatamente después de añadir la selección al chat.', label: 'Enviar al añadir' },
        enableAutoBeginSummary: { description: '', label: 'Resumir al abrir el panel' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: 'Resumir al activar desde el menú' },
        enableChatInputBox: { description: 'Muestra la caja de entrada de chat en el panel de resumen.', label: 'Caja de chat' },
        enableContextMenuAddSelectionToChat: { description: 'Muestra el elemento de menú para añadir la selección al chat.', label: 'Añadir selección al chat' },
        enableContextMenuSummarizeThisPage: { description: 'Muestra el elemento de menú para resumir la página actual.', label: 'Resumir esta página' },
        enableCreateNewPanelButton: { description: 'Muestra el botón para crear un panel de resumen adicional.', label: 'Permitir crear nuevo panel' },
        enableFloatingBall: { description: 'Muestra un botón flotante en la esquina inferior derecha para abrir el panel.', label: 'Botón flotante' },
        enableSummaryWindowDefault: { caution: 'Esto cambia el comportamiento predeterminado en todas las páginas coincidentes.', description: '', label: 'Abrir panel automáticamente en páginas nuevas' },
        enableTokenUsageView: { description: 'Muestra el uso de tokens.', label: 'Uso de tokens' },
      },
      summaryLanguage: { description: 'Idioma del resumen.', label: 'Idioma' }, title: 'General',
    },
    exportImport: {
      exportImportDescription: 'Aquí puedes exportar, importar o restablecer todas las configuraciones, modelos y ajustes de prompts de la extensión.',
      exportConfiguration: 'Exportar configuración', exportWithApiKeys: '¿Incluir claves de API?', copyToClipboard: 'Copiar al portapapeles',
      importConfiguration: 'Importar configuración', importConfigurationDescription: 'Lee la configuración desde el portapapeles. Puedes seleccionar individualmente qué elementos sobrescribir o añadir.', readFromClipboard: 'Leer del portapapeles',
      dangerZone: 'Zona de Peligro', resetConfigurationDescription: 'Elimina todas las configuraciones de la extensión en el almacenamiento local. Asegúrate de exportar un respaldo antes de continuar.', resetAllConfigurations: 'Restablecer toda la configuración',
      resetConfirm: '¿Estás seguro?', noChanges: 'Sin cambios', noChangesDesc: 'Las configuraciones son iguales.',
      reviewImport: 'Revisar', importedSuccess: (count) => `${count} importados.`,
      noImportSelected: 'Nada seleccionado.', resetSuccess: 'Reseteado.',
      importReviewTitle: 'Revisión', confirmImport: 'Confirmar', acceptAll: 'Aceptar todo', rejectAll: 'Rechazar', cancel: 'Cancelar',
      configItem: 'Item', oldValue: 'Antiguo', newValue: 'Nuevo', action: 'Acción', conflict: 'Conflicto', addNew: 'Nuevo', overwrite: 'Sobrescribir', accept: 'Aceptar', skip: 'Saltar', discard: 'Descartar',
    },
    options: {
      debug: 'Debug', header: { defaultModel: 'Modelo predeterminado', defaultModelFailed: 'Fallo.', defaultPrompt: 'Prompt predeterminado', defaultPromptFailed: 'Fallo.', language: 'Idioma', noModels: 'Sin modelos', noPrompts: 'Sin prompts' },
      navigation: { exportImport: 'Configuraciones', general: 'General', interface: 'Interfaz', models: 'Modelos', prompts: 'Prompts', siteCustomization: 'Sitios' }, navigationLabel: 'Opciones',
    },
    interface: {
      chatInputBox: { description: 'Caja de chat.', title: 'Caja de chat' },
      floatingBall: { description: 'Botón flotante.', title: 'Botón flotante' },
      panelLayout: { description: '', dialog: 'Flotante', sidebar: 'Barra lateral', title: 'Diseño' },
      shortcuts: { model: 'Modelo', prompt: 'Prompt', title: 'Atajos' }, title: 'Interfaz',
    },
    models: {
      createModelConfig: 'Crear modelo', noModelConfigsYet: 'Sin modelos', createOneBeforeBackgroundBridge: 'Crea un modelo.',
      defaultBadge: 'Predeterminado', provider: 'Proveedor', baseUrl: 'Base URL', apiMode: 'Modo API', maxInputTokens: 'Tokens máx', price: 'Precio',
      useDefault: (name) => `Usar ${name} como predeterminado`, moveUp: (name) => `Subir ${name}`, moveDown: (name) => `Bajar ${name}`, duplicate: (name) => `Duplicar ${name}`, edit: (name) => `Editar ${name}`, delete: (name) => `Eliminar ${name}`, deleteConfirm: (name) => `¿Eliminar "${name}"?`, deletedToast: 'Modelo eliminado.', deleteFailed: 'Error al eliminar el modelo.', moveFailed: 'Error al mover el modelo.', duplicatedToast: 'Modelo duplicado.', duplicateFailed: 'Error al duplicar el modelo.', defaultChangedFailed: 'Error al cambiar el modelo predeterminado.',
    },
    pageExtraction: {
      method: { description: 'Algoritmo para obtener el contenido de la página', title: 'Método de extracción de contenido' },
      methods: { 'dom-heuristic': { description: 'Puntúa contenedores DOM semánticos y conserva contenido visible más extenso, como bloques de código y comentarios.', label: 'DOM Heurístico' }, readability: { description: 'Extrae el contenido del artículo en modo lectura.', label: 'Readability' } },
    },
    prompts: {
      create: 'Crear prompt', createFromPreset: 'A partir de un preset:', createdToast: 'Prompt creado.', defaultBadge: 'Predeterminado', delete: (name) => `Eliminar ${name}`, deleteConfirm: (name) => `¿Eliminar "${name}"?`, deleteFailed: 'Error al eliminar el prompt.', deletedToast: 'Prompt eliminado.', edit: (name) => `Editar ${name}`, emptyDescription: 'Crea primero una plantilla de prompt para montar la entrada del resumen.', emptyTitle: 'Sin plantillas de prompt', libraryDescription: 'Gestiona plantillas reutilizables de system y user, selecciona la predeterminada y ajusta el orden en los selectores.', libraryTitle: 'Plantillas de prompt', loadFailed: 'Error al cargar la configuración de prompts.', makeDefault: (name) => `Usar ${name} como prompt predeterminado`, missingPromptId: 'Falta el ID del prompt.', moveDown: (name) => `Bajar ${name}`, moveFailed: 'Error al reordenar el prompt.', moveUp: (name) => `Subir ${name}`, name: 'Nombre', namePlaceholder: 'Resumen de artículo', promptNotFound: 'Prompt no encontrado.', saveFailed: 'Error al guardar el prompt.', savedToast: 'Prompt guardado.', selectDefaultFailed: 'Error al cambiar el prompt predeterminado.', systemMessage: 'Mensaje System', systemMessageDescription: 'Define el comportamiento del resumen, el idioma de salida y el formato de salida.', templateVariables: 'Variables de plantilla', templateVariablesDescription: 'Estos marcadores se sustituyen al construir la solicitud de resumen.', userMessage: 'Mensaje User', userMessageDescription: 'Envuelve la entrada de la página y complementa el contexto de la tarea.',
      variableDescriptions: { articleUrl: 'URL de la página que se está resumiendo.', currentSelection: 'Texto actualmente seleccionado en la página.', summaryLanguage: 'Idioma de salida configurado.', textContent: 'Texto extraído de la página usado como entrada del resumen.' },
    },
    pageTitles: { createModel: 'Crear modelo', createPrompt: 'Crear prompt', editModel: 'Editar modelo', editPrompt: 'Editar prompt', exportImport: 'Configuración', interface: 'Interfaz', models: 'Modelos', prompts: 'Prompts', siteCustomization: 'Sitios', welcome: 'Bienvenido' },
    popup: { noActiveTab: 'Sin pestaña', openOptions: 'Opciones', model: 'Modelo', prompt: 'Prompt', summary: 'Resumen', page: 'Página', openPanelAndStartSummary: 'Resumir', copyPageContentToClipboard: 'Copiar', extractFailed: 'Fallo', copySuccess: 'Copiado', copyFailed: 'Fallo', invokeSummaryFailed: 'Fallo' },
    siteCustomization: {
      examplesTitle: 'Ejemplos de reglas de coincidencia', examplesDescription: 'Compatible con la sintaxis glob moderna (picomatch).', examples: [ { key: 'example.com', description: 'Coincide con example.com' }, { key: '*.example.com', description: 'Coincide con a.example.com' }, { key: '**.example.com', description: 'Coincide con a.example.com, a.b.example.com' }, { key: 'example.com/articles/*', description: 'Coincide con example.com/articles/1' } ], whitelist: 'Lista de permitidos', blacklist: 'Lista de bloqueados', whitelistDescription: 'Si está activado, la extensión solo se inyecta en las páginas de la lista de permitidos.', blacklistDescription: 'Si está activado, la extensión no se inyecta en las páginas de la lista de bloqueados.', patternsLabel: 'Reglas de coincidencia', onePerLine: 'Una por línea', whitelistPlaceholder: 'ej.:\nwww.reddit.com\n*.news.com', blacklistPlaceholder: 'ej.:\nwww.bing.com\n*.visa.com',
      customizationTitle: 'Personalización de sitios', customizationDescription: 'Configura selectores CSS para sitios específicos para que la extensión obtenga el contenido con mayor precisión.', addRule: 'Añadir regla', noRules: 'Sin reglas personalizadas', noRulesDescription: 'Añade reglas de selectores para los sitios donde falla la extracción automática.', newRuleFallback: 'Nueva regla', matchPattern: 'Patrón de coincidencia', matchPatternPlaceholder: 'Compatible con sintaxis minimatch', useShadowRoot: 'Penetrar Shadow DOM', selectorsNormal: 'Selectores CSS', selectorsHost: 'Selectores de host', selectorsPlaceholderNormal: 'ej.:\n.text-neutral-content', selectorsPlaceholderHost: 'ej.:\n#app > div', shadowRootSelectors: 'Selectores internos del Shadow Root', shadowRootSelectorsPlaceholder: 'ej.:\n#content', shadowRootTip: 'Entra en el shadowRoot desde los elementos coincidentes con los selectores anteriores y aplica estos selectores.'
    },
  },
  'fr': {
    common: {
      allChangesSaved: 'Toutes les modifications ont été enregistrées.', back: 'Retour', loadingSettings: 'Chargement...',
      off: 'Désactivé', on: 'Activé', save: 'Enregistrer', saved: 'Enregistré', saving: 'Enregistrement', success: 'Succès',
      unsavedChanges: 'Modifications non enregistrées', unknownError: 'Une erreur inconnue s\'est produite.', collapse: 'Réduire', more: 'Plus...',
      contextMenu: { summarizeThisPage: 'Résumer cette page', addToChat: 'Ajouter au chat', openSetting: 'Ouvrir les paramètres' },
    },
    content: {
      badgeLabel: 'Résumé de la page', summary: 'Résumé', reSummarize: 'Résumer à nouveau', untitledPage: 'Page sans titre',
      contentTokenCount: 'Tokens :', tokenViewerInfoTip: 'Cette interface sert uniquement à visualiser la tokenisation. Les ajustements ici ne modifient pas le texte réellement envoyé au modèle de langage.', calculating: 'Calcul en cours...',
    },
    general: {
      loadFailed: 'Échec du chargement.', restoreDefaults: 'Restaurer', saveFailed: 'Échec de la sauvegarde.', savedToast: 'Enregistré.',
      sections: { contextMenu: { description: 'Choisissez les entrées que l\'extension propose dans le menu contextuel de la page.', title: 'Menu contextuel' }, triggers: { description: 'Contrôle le comportement par défaut du panneau et quand il commence à travailler automatiquement.', title: 'Déclencheurs' } },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: 'Envoie le message immédiatement après l\'ajout de la sélection au chat.', label: 'Envoyer lors de l\'ajout' },
        enableAutoBeginSummary: { description: '', label: 'Résumer à l\'ouverture du panneau' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: 'Résumer après déclenchement depuis le menu' },
        enableChatInputBox: { description: 'Affiche la boîte de saisie de chat dans le panneau de résumé.', label: 'Boîte de chat' },
        enableContextMenuAddSelectionToChat: { description: 'Affiche l\'élément de menu pour ajouter la sélection au chat.', label: 'Ajouter la sélection au chat' },
        enableContextMenuSummarizeThisPage: { description: 'Affiche l\'élément de menu pour résumer la page actuelle.', label: 'Résumer cette page' },
        enableCreateNewPanelButton: { description: 'Affiche le bouton pour créer un panneau de résumé supplémentaire.', label: 'Autoriser la création d\'un nouveau panneau' },
        enableFloatingBall: { description: 'Affiche un bouton flottant en bas à droite pour ouvrir le panneau.', label: 'Bouton flottant' },
        enableSummaryWindowDefault: { caution: 'Cela modifie le comportement par défaut sur toutes les pages correspondantes.', description: '', label: 'Ouvrir automatiquement le panneau sur les nouvelles pages' },
        enableTokenUsageView: { description: 'Affiche l\'utilisation des tokens.', label: 'Utilisation des tokens' },
      },
      summaryLanguage: { description: 'Langue du résumé.', label: 'Langue' }, title: 'Général',
    },
    exportImport: {
      exportImportDescription: 'Ici vous pouvez exporter, importer ou réinitialiser tous les paramètres, modèles et configurations de prompts de l\'extension.',
      exportConfiguration: 'Exporter la configuration', exportWithApiKeys: 'Inclure les clés API ?', copyToClipboard: 'Copier dans le presse-papiers',
      importConfiguration: 'Importer la configuration', importConfigurationDescription: 'Lit la configuration depuis le presse-papiers. Vous pouvez sélectionner individuellement les éléments à écraser ou à ajouter.', readFromClipboard: 'Lire depuis le presse-papiers',
      dangerZone: 'Zone de danger', resetConfigurationDescription: 'Supprime tous les paramètres de l\'extension dans le stockage local. Assurez-vous d\'exporter une sauvegarde avant de continuer.', resetAllConfigurations: 'Réinitialiser tous les paramètres',
      resetConfirm: 'Êtes-vous sûr ?', noChanges: 'Aucun changement', noChangesDesc: 'Les paramètres sont identiques.',
      reviewImport: 'Réviser', importedSuccess: (count) => `${count} importés.`,
      noImportSelected: 'Rien n\'est sélectionné.', resetSuccess: 'Réinitialisé.',
      importReviewTitle: 'Révision', confirmImport: 'Confirmer', acceptAll: 'Tout accepter', rejectAll: 'Rejeter', cancel: 'Annuler',
      configItem: 'Élément', oldValue: 'Ancienne valeur', newValue: 'Nouvelle valeur', action: 'Action', conflict: 'Conflit', addNew: 'Ajouter', overwrite: 'Écraser', accept: 'Accepter', skip: 'Ignorer', discard: 'Abandonner',
    },
    options: {
      debug: 'Debug', header: { defaultModel: 'Modèle par défaut', defaultModelFailed: 'Échec.', defaultPrompt: 'Prompt par défaut', defaultPromptFailed: 'Échec.', language: 'Langue', noModels: 'Aucun modèle', noPrompts: 'Aucun prompt' },
      navigation: { exportImport: 'Paramètres', general: 'Général', interface: 'Interface', models: 'Modèles', prompts: 'Prompts', siteCustomization: 'Sites' }, navigationLabel: 'Options',
    },
    interface: {
      chatInputBox: { description: 'Boîte de chat.', title: 'Boîte de chat' },
      floatingBall: { description: 'Bouton flottant.', title: 'Bouton flottant' },
      panelLayout: { description: '', dialog: 'Flottant', sidebar: 'Barre latérale', title: 'Mise en page' },
      shortcuts: { model: 'Modèle', prompt: 'Prompt', title: 'Raccourcis' }, title: 'Interface',
    },
    models: {
      createModelConfig: 'Créer un modèle', noModelConfigsYet: 'Aucun modèle', createOneBeforeBackgroundBridge: 'Créez un modèle.',
      defaultBadge: 'Défaut', provider: 'Fournisseur', baseUrl: 'Base URL', apiMode: 'Mode API', maxInputTokens: 'Tokens max', price: 'Prix',
      useDefault: (name) => `Définir ${name} par défaut`, moveUp: (name) => `Monter ${name}`, moveDown: (name) => `Descendre ${name}`, duplicate: (name) => `Dupliquer ${name}`, edit: (name) => `Modifier ${name}`, delete: (name) => `Supprimer ${name}`, deleteConfirm: (name) => `Supprimer « ${name} » ?`, deletedToast: 'Modèle supprimé.', deleteFailed: 'Échec de la suppression du modèle.', moveFailed: 'Échec du déplacement du modèle.', duplicatedToast: 'Modèle dupliqué.', duplicateFailed: 'Échec de la duplication du modèle.', defaultChangedFailed: 'Échec du changement de modèle par défaut.',
    },
    pageExtraction: {
      method: { description: 'Algorithme pour obtenir le contenu de la page', title: 'Méthode d\'extraction du contenu' },
      methods: { 'dom-heuristic': { description: 'Évalue les conteneurs DOM sémantiques et conserve le contenu visible plus long, comme les blocs de code et les commentaires.', label: 'DOM Heuristique' }, readability: { description: 'Extrait le contenu de l\'article en mode lecture.', label: 'Readability' } },
    },
    prompts: {
      create: 'Créer un prompt', createFromPreset: 'À partir d\'un preset :', createdToast: 'Prompt créé.', defaultBadge: 'Défaut', delete: (name) => `Supprimer ${name}`, deleteConfirm: (name) => `Supprimer « ${name} » ?`, deleteFailed: 'Échec de la suppression du prompt.', deletedToast: 'Prompt supprimé.', edit: (name) => `Modifier ${name}`, emptyDescription: 'Créez d\'abord un modèle de prompt pour assembler l\'entrée du résumé.', emptyTitle: 'Aucun modèle de prompt', libraryDescription: 'Gérez les modèles system et user réutilisables, sélectionnez le défaut et ajustez l\'ordre dans les sélecteurs.', libraryTitle: 'Modèles de prompt', loadFailed: 'Échec du chargement des paramètres de prompt.', makeDefault: (name) => `Définir ${name} comme prompt par défaut`, missingPromptId: 'ID du prompt manquant.', moveDown: (name) => `Descendre ${name}`, moveFailed: 'Échec de la réorganisation du prompt.', moveUp: (name) => `Monter ${name}`, name: 'Nom', namePlaceholder: 'Résumé d\'article', promptNotFound: 'Prompt introuvable.', saveFailed: 'Échec de l\'enregistrement du prompt.', savedToast: 'Prompt enregistré.', selectDefaultFailed: 'Échec du changement de prompt par défaut.', systemMessage: 'Message System', systemMessageDescription: 'Définit le comportement du résumé, la langue de sortie et le format de sortie.', templateVariables: 'Variables de modèle', templateVariablesDescription: 'Ces espaces réservés sont remplacés lors de la construction de la requête de résumé.', userMessage: 'Message User', userMessageDescription: 'Encapsule l\'entrée de la page et complète le contexte de la tâche.',
      variableDescriptions: { articleUrl: 'URL de la page en cours de résumé.', currentSelection: 'Texte actuellement sélectionné sur la page.', summaryLanguage: 'Langue de sortie configurée.', textContent: 'Texte extrait de la page utilisé comme entrée du résumé.' },
    },
    pageTitles: { createModel: 'Créer un modèle', createPrompt: 'Créer un prompt', editModel: 'Modifier un modèle', editPrompt: 'Modifier un prompt', exportImport: 'Paramètres', interface: 'Interface', models: 'Modèles', prompts: 'Prompts', siteCustomization: 'Sites', welcome: 'Bienvenue' },
    popup: { noActiveTab: 'Aucun onglet', openOptions: 'Options', model: 'Modèle', prompt: 'Prompt', summary: 'Résumé', page: 'Page', openPanelAndStartSummary: 'Résumer', copyPageContentToClipboard: 'Copier', extractFailed: 'Échec', copySuccess: 'Copié', copyFailed: 'Échec', invokeSummaryFailed: 'Échec' },
    siteCustomization: {
      examplesTitle: 'Exemples de règles de correspondance', examplesDescription: 'Compatible avec la syntaxe glob moderne (picomatch).', examples: [ { key: 'example.com', description: 'Correspond à example.com' }, { key: '*.example.com', description: 'Correspond à a.example.com' }, { key: '**.example.com', description: 'Correspond à a.example.com, a.b.example.com' }, { key: 'example.com/articles/*', description: 'Correspond à example.com/articles/1' } ], whitelist: 'Liste blanche', blacklist: 'Liste noire', whitelistDescription: 'Activé, l\'extension s\'injecte uniquement dans les pages de la liste blanche.', blacklistDescription: 'Activé, l\'extension ne s\'injecte pas dans les pages de la liste noire.', patternsLabel: 'Règles de correspondance', onePerLine: 'Une par ligne', whitelistPlaceholder: 'ex. :\nwww.reddit.com\n*.news.com', blacklistPlaceholder: 'ex. :\nwww.bing.com\n*.visa.com',
      customizationTitle: 'Personnalisation des sites', customizationDescription: 'Configurez des sélecteurs CSS pour des sites spécifiques afin que l\'extension récupère le contenu avec plus de précision.', addRule: 'Ajouter une règle', noRules: 'Aucune règle personnalisée', noRulesDescription: 'Ajoutez des règles de sélecteurs pour les sites où l\'extraction automatique échoue.', newRuleFallback: 'Nouvelle règle', matchPattern: 'Modèle de correspondance', matchPatternPlaceholder: 'Syntaxe minimatch supportée', useShadowRoot: 'Pénétrer le Shadow DOM', selectorsNormal: 'Sélecteurs CSS', selectorsHost: 'Sélecteurs hôte', selectorsPlaceholderNormal: 'ex. :\n.text-neutral-content', selectorsPlaceholderHost: 'ex. :\n#app > div', shadowRootSelectors: 'Sélecteurs internes du Shadow Root', shadowRootSelectorsPlaceholder: 'ex. :\n#content', shadowRootTip: 'Entre dans le shadowRoot à partir des éléments correspondant aux sélecteurs ci-dessus et applique ces sélecteurs.'
    },
  },
  'de': {
    common: {
      allChangesSaved: 'Alle Änderungen wurden gespeichert.', back: 'Zurück', loadingSettings: 'Lade...',
      off: 'Aus', on: 'Ein', save: 'Speichern', saved: 'Gespeichert', saving: 'Speichern...', success: 'Erfolg',
      unsavedChanges: 'Ungespeicherte Änderungen', unknownError: 'Ein unbekannter Fehler ist aufgetreten.', collapse: 'Zuklappen', more: 'Mehr...',
      contextMenu: { summarizeThisPage: 'Diese Seite zusammenfassen', addToChat: 'Zum Chat hinzufügen', openSetting: 'Einstellungen öffnen' },
    },
    content: {
      badgeLabel: 'Webseiten-Zusammenfassung', summary: 'Zusammenfassung', reSummarize: 'Neu zusammenfassen', untitledPage: 'Unbenannte Seite',
      contentTokenCount: 'Tokens:', tokenViewerInfoTip: 'Diese Ansicht dient nur zur Visualisierung der Tokenisierung. Anpassungen hier ändern nicht den tatsächlich an das Sprachmodell gesendeten Text.', calculating: 'Wird berechnet...',
    },
    general: {
      loadFailed: 'Laden fehlgeschlagen.', restoreDefaults: 'Zurücksetzen', saveFailed: 'Speichern fehlgeschlagen.', savedToast: 'Gespeichert.',
      sections: { contextMenu: { description: 'Wählen Sie, welche Einträge die Erweiterung im Seitenkontextmenü anbietet.', title: 'Kontextmenü' }, triggers: { description: 'Steuert das Standardverhalten des Panels und wann es automatisch startet.', title: 'Auslöser' } },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: 'Sendet die Nachricht sofort nach dem Hinzufügen der Auswahl zum Chat.', label: 'Beim Hinzufügen senden' },
        enableAutoBeginSummary: { description: '', label: 'Beim Öffnen des Panels sofort zusammenfassen' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: 'Nach Auslösung über Menü sofort zusammenfassen' },
        enableChatInputBox: { description: 'Zeigt die Chat-Eingabebox im Zusammenfassungspanel an.', label: 'Chat-Eingabebox' },
        enableContextMenuAddSelectionToChat: { description: 'Zeigt den Menüeintrag zum Hinzufügen der Auswahl zum Chat.', label: 'Auswahl zum Chat hinzufügen' },
        enableContextMenuSummarizeThisPage: { description: 'Zeigt den Menüeintrag zum Zusammenfassen der aktuellen Seite.', label: 'Diese Seite zusammenfassen' },
        enableCreateNewPanelButton: { description: 'Zeigt die Schaltfläche zum Erstellen eines weiteren Zusammenfassungspanels.', label: 'Neues Panel erstellen erlauben' },
        enableFloatingBall: { description: 'Zeigt eine schwebende Schaltfläche in der unteren rechten Ecke zum Öffnen des Panels.', label: 'Schwebende Schaltfläche' },
        enableSummaryWindowDefault: { caution: 'Dies ändert das Standardverhalten auf allen übereinstimmenden Seiten.', description: '', label: 'Panel auf neuen Seiten automatisch öffnen' },
        enableTokenUsageView: { description: 'Zeigt den Token-Verbrauch an.', label: 'Token-Verbrauch' },
      },
      summaryLanguage: { description: 'Sprache.', label: 'Sprache' }, title: 'Allgemein',
    },
    exportImport: {
      exportImportDescription: 'Hier können Sie alle Einstellungen, Modelle und Prompt-Konfigurationen der Erweiterung exportieren, importieren oder zurücksetzen.',
      exportConfiguration: 'Konfiguration exportieren', exportWithApiKeys: 'API-Schlüssel einschließen?', copyToClipboard: 'In die Zwischenablage kopieren',
      importConfiguration: 'Konfiguration importieren', importConfigurationDescription: 'Liest die Konfiguration aus der Zwischenablage. Sie können einzeln auswählen, welche Einträge überschrieben oder hinzugefügt werden sollen.', readFromClipboard: 'Aus Zwischenablage lesen',
      dangerZone: 'Gefahrenzone', resetConfigurationDescription: 'Löscht alle Erweiterungseinstellungen im lokalen Speicher. Stellen Sie sicher, dass Sie vorher ein Backup exportiert haben.', resetAllConfigurations: 'Alle Einstellungen zurücksetzen',
      resetConfirm: 'Sind Sie sicher?', noChanges: 'Keine Änderungen', noChangesDesc: 'Einstellungen sind identisch.',
      reviewImport: 'Überprüfen', importedSuccess: (count) => `${count} importiert.`,
      noImportSelected: 'Nichts ausgewählt.', resetSuccess: 'Zurückgesetzt.',
      importReviewTitle: 'Überprüfung', confirmImport: 'Bestätigen', acceptAll: 'Alle akzeptieren', rejectAll: 'Ablehnen', cancel: 'Abbrechen',
      configItem: 'Element', oldValue: 'Alt', newValue: 'Neu', action: 'Aktion', conflict: 'Konflikt', addNew: 'Neu', overwrite: 'Überschreiben', accept: 'Akzeptieren', skip: 'Überspringen', discard: 'Verwerfen',
    },
    options: {
      debug: 'Debug', header: { defaultModel: 'Standardmodell', defaultModelFailed: 'Fehlgeschlagen.', defaultPrompt: 'Standard-Prompt', defaultPromptFailed: 'Fehlgeschlagen.', language: 'Sprache', noModels: 'Keine Modelle', noPrompts: 'Keine Prompts' },
      navigation: { exportImport: 'Einstellungen', general: 'Allgemein', interface: 'Schnittstelle', models: 'Modelle', prompts: 'Prompts', siteCustomization: 'Websites' }, navigationLabel: 'Optionen',
    },
    interface: {
      chatInputBox: { description: 'Chat-Box.', title: 'Chat-Box' },
      floatingBall: { description: 'Schwebender Button.', title: 'Schwebender Button' },
      panelLayout: { description: '', dialog: 'Schwebend', sidebar: 'Seitenleiste', title: 'Layout' },
      shortcuts: { model: 'Modell', prompt: 'Prompt', title: 'Tastenkombinationen' }, title: 'Schnittstelle',
    },
    models: {
      createModelConfig: 'Modell erstellen', noModelConfigsYet: 'Keine Modelle', createOneBeforeBackgroundBridge: 'Erstellen Sie ein Modell.',
      defaultBadge: 'Standard', provider: 'Anbieter', baseUrl: 'Base URL', apiMode: 'API-Modus', maxInputTokens: 'Max Tokens', price: 'Preis',
      useDefault: (name) => `${name} als Standard festlegen`, moveUp: (name) => `${name} nach oben`, moveDown: (name) => `${name} nach unten`, duplicate: (name) => `${name} duplizieren`, edit: (name) => `${name} bearbeiten`, delete: (name) => `${name} löschen`, deleteConfirm: (name) => `„${name}" löschen?`, deletedToast: 'Modell gelöscht.', deleteFailed: 'Modell konnte nicht gelöscht werden.', moveFailed: 'Modell konnte nicht verschoben werden.', duplicatedToast: 'Modell dupliziert.', duplicateFailed: 'Modell konnte nicht dupliziert werden.', defaultChangedFailed: 'Standardmodell konnte nicht geändert werden.',
    },
    pageExtraction: {
      method: { description: 'Algorithmus zur Ermittlung des Seiteninhalts', title: 'Inhaltsextraktionsmethode' },
      methods: { 'dom-heuristic': { description: 'Bewertet semantische DOM-Container und bevorzugt längere sichtbare Inhalte wie Codeblöcke und Kommentare.', label: 'DOM-Heuristik' }, readability: { description: 'Extrahiert Artikelinhalte im Lesemodus.', label: 'Readability' } },
    },
    prompts: {
      create: 'Prompt erstellen', createFromPreset: 'Von Preset:', createdToast: 'Prompt erstellt.', defaultBadge: 'Standard', delete: (name) => `${name} löschen`, deleteConfirm: (name) => `„${name}" löschen?`, deleteFailed: 'Prompt konnte nicht gelöscht werden.', deletedToast: 'Prompt gelöscht.', edit: (name) => `${name} bearbeiten`, emptyDescription: 'Erstellen Sie zuerst eine Prompt-Vorlage, um die Zusammenfassungseingabe zusammenzustellen.', emptyTitle: 'Keine Prompt-Vorlagen', libraryDescription: 'Verwalten Sie wiederverwendbare System- und User-Vorlagen, wählen Sie die Standardoption und passen Sie die Reihenfolge in den Selektoren an.', libraryTitle: 'Prompt-Vorlagen', loadFailed: 'Prompt-Einstellungen konnten nicht geladen werden.', makeDefault: (name) => `${name} als Standard-Prompt festlegen`, missingPromptId: 'Prompt-ID fehlt.', moveDown: (name) => `${name} nach unten`, moveFailed: 'Prompt-Reihenfolge konnte nicht geändert werden.', moveUp: (name) => `${name} nach oben`, name: 'Name', namePlaceholder: 'Artikelzusammenfassung', promptNotFound: 'Prompt nicht gefunden.', saveFailed: 'Prompt konnte nicht gespeichert werden.', savedToast: 'Prompt gespeichert.', selectDefaultFailed: 'Standard-Prompt konnte nicht geändert werden.', systemMessage: 'System-Nachricht', systemMessageDescription: 'Definiert das Zusammenfassungsverhalten, die Ausgabesprache und das Ausgabeformat.', templateVariables: 'Vorlagenvariablen', templateVariablesDescription: 'Diese Platzhalter werden beim Zusammenstellen der Zusammenfassungsanfrage ersetzt.', userMessage: 'User-Nachricht', userMessageDescription: 'Umhüllt die Seiteneingabe und ergänzt den Aufgabenkontext.',
      variableDescriptions: { articleUrl: 'URL der aktuell zusammengefassten Seite.', currentSelection: 'Aktuell auf der Seite ausgewählter Text.', summaryLanguage: 'Konfigurierte Ausgabesprache.', textContent: 'Aus der Seite extrahierter Text als Zusammenfassungseingabe.' },
    },
    pageTitles: { createModel: 'Modell erstellen', createPrompt: 'Prompt erstellen', editModel: 'Modell bearbeiten', editPrompt: 'Prompt bearbeiten', exportImport: 'Einstellungen', interface: 'Schnittstelle', models: 'Modelle', prompts: 'Prompts', siteCustomization: 'Websites', welcome: 'Willkommen' },
    popup: { noActiveTab: 'Kein Tab', openOptions: 'Optionen', model: 'Modell', prompt: 'Prompt', summary: 'Zusammenfassung', page: 'Seite', openPanelAndStartSummary: 'Zusammenfassen', copyPageContentToClipboard: 'Kopieren', extractFailed: 'Fehlgeschlagen', copySuccess: 'Kopiert', copyFailed: 'Fehlgeschlagen', invokeSummaryFailed: 'Fehlgeschlagen' },
    siteCustomization: {
      examplesTitle: 'Beispiele für Übereinstimmungsregeln', examplesDescription: 'Unterstützt moderne Glob-Syntax (picomatch).', examples: [ { key: 'example.com', description: 'Entspricht example.com' }, { key: '*.example.com', description: 'Entspricht a.example.com' }, { key: '**.example.com', description: 'Entspricht a.example.com, a.b.example.com' }, { key: 'example.com/articles/*', description: 'Entspricht example.com/articles/1' } ], whitelist: 'Whitelist', blacklist: 'Blacklist', whitelistDescription: 'Aktiviert wird die Erweiterung nur in Seiten der Whitelist injiziert.', blacklistDescription: 'Aktiviert wird die Erweiterung nicht in Seiten der Blacklist injiziert.', patternsLabel: 'Übereinstimmungsregeln', onePerLine: 'Eine pro Zeile', whitelistPlaceholder: 'z. B.:\nwww.reddit.com\n*.news.com', blacklistPlaceholder: 'z. B.:\nwww.bing.com\n*.visa.com',
      customizationTitle: 'Website-Anpassung', customizationDescription: 'Legen Sie CSS-Selektoren für bestimmte Websites fest, damit die Erweiterung Inhalte präziser abrufen kann.', addRule: 'Regel hinzufügen', noRules: 'Keine Anpassungsregeln', noRulesDescription: 'Fügen Sie Selektor-Regeln für Websites hinzu, bei denen die automatische Extraktion fehlschlägt.', newRuleFallback: 'Neue Regel', matchPattern: 'Übereinstimmungsmuster', matchPatternPlaceholder: 'Minimatch-Syntax wird unterstützt', useShadowRoot: 'Shadow DOM durchdringen', selectorsNormal: 'CSS-Selektoren', selectorsHost: 'Host-Selektoren', selectorsPlaceholderNormal: 'z. B.:\n.text-neutral-content', selectorsPlaceholderHost: 'z. B.:\n#app > div', shadowRootSelectors: 'Shadow Root interne Selektoren', shadowRootSelectorsPlaceholder: 'z. B.:\n#content', shadowRootTip: 'Betritt den shadowRoot der durch obige Selektoren gefundenen Elemente und wendet diese Selektoren an.'
    },
  },

};

export function resolveUiLocale(language: string | undefined): UiLocale {
  if (!language) return 'en';
  const lang = language.toLowerCase();
  if (lang.startsWith('zh-tw') || lang.startsWith('zh-hk') || lang.startsWith('zh-hant')) return 'zh-TW';
  if (lang.startsWith('zh')) return 'zh-CN';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('pt')) return 'pt';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('de')) return 'de';
  return 'en';
}

export function isUiLocale(value: string | null | undefined): value is UiLocale {
  return value === 'en' || value === 'zh-CN' || value === 'zh-TW' || value === 'ja' || value === 'ko' || value === 'pt' || value === 'es' || value === 'fr' || value === 'de';
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
