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
      badgeLabel: 'Webpage Summary', summary: '要約', reSummarize: '再要約', untitledPage: '無題のページ',
      contentTokenCount: 'コンテンツトークン数:', tokenViewerInfoTip: 'トークン化を視覚化します。実際には送信されません。', calculating: '計算中...',
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
      exportImportDescription: '拡張機能の設定をエクスポート、インポート、またはリセットします。',
      exportConfiguration: '設定のエクスポート', exportWithApiKeys: 'APIキーを含める', copyToClipboard: 'クリップボードにコピー',
      importConfiguration: '設定のインポート', importConfigurationDescription: 'クリップボードから読み込みます。', readFromClipboard: 'クリップボードから読み込む',
      dangerZone: '危険な操作', resetConfigurationDescription: 'すべての設定をクリアします。', resetAllConfigurations: 'すべての設定をリセット',
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
      useDefault: (name) => `デフォルトに設定`, moveUp: (name) => `上へ`, moveDown: (name) => `下へ`, duplicate: (name) => `複製`, edit: (name) => `編集`, delete: (name) => `削除`, deleteConfirm: (name) => `削除しますか？`, deletedToast: '削除しました。', deleteFailed: '失敗しました。', moveFailed: '失敗しました。', duplicatedToast: '複製しました。', duplicateFailed: '失敗しました。', defaultChangedFailed: '失敗しました。',
    },
    pageExtraction: {
      method: { description: 'テキストの抽出方法', title: 'テキスト抽出方法' },
      methods: { 'dom-heuristic': { description: 'DOMヒューリスティック。', label: 'DOMヒューリスティック' }, readability: { description: 'Readabilityモード', label: 'Readability' } },
    },
    prompts: {
      create: '作成', createFromPreset: 'プリセットから作成:', createdToast: '作成しました。', defaultBadge: 'デフォルト', delete: (name) => `削除`, deleteConfirm: (name) => `削除しますか？`, deleteFailed: '失敗しました。', deletedToast: '削除しました。', edit: (name) => `編集`, emptyDescription: 'プロンプトテンプレートを作成してください。', emptyTitle: 'テンプレートなし', libraryDescription: 'テンプレートの管理。', libraryTitle: 'プロンプトテンプレート', loadFailed: '読み込みに失敗しました。', makeDefault: (name) => `デフォルトに設定`, missingPromptId: 'IDがありません。', moveDown: (name) => `下へ`, moveFailed: '失敗しました。', moveUp: (name) => `上へ`, name: '名前', namePlaceholder: '記事の要約', promptNotFound: '見つかりません。', saveFailed: '保存に失敗しました。', savedToast: '保存しました。', selectDefaultFailed: '失敗しました。', systemMessage: 'System', systemMessageDescription: '動作を定義します。', templateVariables: 'テンプレート変数', templateVariablesDescription: 'プレースホルダーです。', userMessage: 'User', userMessageDescription: 'コンテキスト。',
      variableDescriptions: { articleUrl: 'URL', currentSelection: '選択テキスト', summaryLanguage: '言語', textContent: 'テキストコンテンツ' },
    },
    pageTitles: { createModel: 'モデル作成', createPrompt: 'プロンプト作成', editModel: 'モデル編集', editPrompt: 'プロンプト編集', exportImport: '設定管理', interface: 'インターフェース', models: 'モデル', prompts: 'プロンプト', siteCustomization: 'サイトカスタマイズ', welcome: 'ようこそ' },
    popup: { noActiveTab: 'タブなし', openOptions: '設定', model: 'モデル', prompt: 'プロンプト', summary: '要約', page: 'ページ', openPanelAndStartSummary: '要約を開始', copyPageContentToClipboard: 'コピー', extractFailed: '失敗しました', copySuccess: 'コピーしました', copyFailed: '失敗しました', invokeSummaryFailed: '失敗しました' },
    siteCustomization: {
      examplesTitle: '例', examplesDescription: 'glob構文', examples: [], whitelist: 'ホワイトリスト', blacklist: 'ブラックリスト', whitelistDescription: '一致するページでのみ実行します。', blacklistDescription: '一致するページでは実行しません。', patternsLabel: 'URL パターン', onePerLine: '1行に1つ', whitelistPlaceholder: '例: www.reddit.com', blacklistPlaceholder: '例: www.bing.com',
      customizationTitle: 'セレクター', customizationDescription: '特定のCSSセレクターを設定します。', addRule: 'ルールの追加', noRules: 'ルールなし', noRulesDescription: 'ルールを追加します。', newRuleFallback: '新規ルール', matchPattern: 'マッチパターン', matchPatternPlaceholder: 'minimatchパターン', useShadowRoot: 'Shadow DOMの検索', selectorsNormal: 'CSSセレクター', selectorsHost: 'ホストセレクター', selectorsPlaceholderNormal: '例: .text', selectorsPlaceholderHost: '例: #app', shadowRootSelectors: 'Shadow Root セレクター', shadowRootSelectorsPlaceholder: '例: #content', shadowRootTip: 'Shadow DOMの検索。'
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
      badgeLabel: 'Webpage Summary', summary: '요약', reSummarize: '다시 요약', untitledPage: '제목 없는 페이지',
      contentTokenCount: '콘텐츠 토큰 수:', tokenViewerInfoTip: '토큰화를 시각화합니다.', calculating: '계산 중...',
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
      exportImportDescription: '확장 프로그램 설정을 내보내기, 가져오기 또는 재설정합니다.',
      exportConfiguration: '설정 내보내기', exportWithApiKeys: 'API 키 포함', copyToClipboard: '클립보드에 복사',
      importConfiguration: '설정 가져오기', importConfigurationDescription: '클립보드에서 읽기.', readFromClipboard: '클립보드에서 읽기',
      dangerZone: '위험 구역', resetConfigurationDescription: '모든 설정을 지웁니다.', resetAllConfigurations: '모든 설정 재설정',
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
      useDefault: (name) => `기본으로 설정`, moveUp: (name) => `위로`, moveDown: (name) => `아래로`, duplicate: (name) => `복제`, edit: (name) => `편집`, delete: (name) => `삭제`, deleteConfirm: (name) => `삭제하시겠습니까?`, deletedToast: '삭제되었습니다.', deleteFailed: '실패했습니다.', moveFailed: '실패했습니다.', duplicatedToast: '복제되었습니다.', duplicateFailed: '실패했습니다.', defaultChangedFailed: '실패했습니다.',
    },
    pageExtraction: {
      method: { description: '텍스트 추출 방법', title: '텍스트 추출 방법' },
      methods: { 'dom-heuristic': { description: 'DOM 휴리스틱.', label: 'DOM 휴리스틱' }, readability: { description: 'Readability 모드', label: 'Readability' } },
    },
    prompts: {
      create: '생성', createFromPreset: '프리셋에서 생성:', createdToast: '생성되었습니다.', defaultBadge: '기본', delete: (name) => `삭제`, deleteConfirm: (name) => `삭제하시겠습니까?`, deleteFailed: '실패했습니다.', deletedToast: '삭제되었습니다.', edit: (name) => `편집`, emptyDescription: '프롬프트 템플릿을 생성하세요.', emptyTitle: '템플릿 없음', libraryDescription: '템플릿 관리.', libraryTitle: '프롬프트 템플릿', loadFailed: '로드 실패.', makeDefault: (name) => `기본으로 설정`, missingPromptId: 'ID가 없습니다.', moveDown: (name) => `아래로`, moveFailed: '실패했습니다.', moveUp: (name) => `위로`, name: '이름', namePlaceholder: '기사 요약', promptNotFound: '찾을 수 없습니다.', saveFailed: '저장 실패.', savedToast: '저장되었습니다.', selectDefaultFailed: '실패했습니다.', systemMessage: 'System', systemMessageDescription: '동작을 정의합니다.', templateVariables: '템플릿 변수', templateVariablesDescription: '자리 표시자입니다.', userMessage: 'User', userMessageDescription: '컨텍스트.',
      variableDescriptions: { articleUrl: 'URL', currentSelection: '선택 텍스트', summaryLanguage: '언어', textContent: '텍스트 콘텐츠' },
    },
    pageTitles: { createModel: '모델 생성', createPrompt: '프롬프트 생성', editModel: '모델 편집', editPrompt: '프롬프트 편집', exportImport: '설정 관리', interface: '인터페이스', models: '모델', prompts: '프롬프트', siteCustomization: '사이트 맞춤설정', welcome: '환영합니다' },
    popup: { noActiveTab: '활성 탭 없음', openOptions: '설정', model: '모델', prompt: '프롬프트', summary: '요약', page: '페이지', openPanelAndStartSummary: '요약 시작', copyPageContentToClipboard: '복사', extractFailed: '실패했습니다', copySuccess: '복사되었습니다', copyFailed: '실패했습니다', invokeSummaryFailed: '실패했습니다' },
    siteCustomization: {
      examplesTitle: '예시', examplesDescription: 'glob 구문', examples: [], whitelist: '화이트리스트', blacklist: '블랙리스트', whitelistDescription: '일치하는 페이지만 실행합니다.', blacklistDescription: '일치하는 페이지는 실행하지 않습니다.', patternsLabel: 'URL 패턴', onePerLine: '한 줄에 하나씩', whitelistPlaceholder: '예: www.reddit.com', blacklistPlaceholder: '예: www.bing.com',
      customizationTitle: '선택기', customizationDescription: '특정 CSS 선택기를 설정합니다.', addRule: '규칙 추가', noRules: '규칙 없음', noRulesDescription: '규칙을 추가하세요.', newRuleFallback: '새 규칙', matchPattern: '일치 패턴', matchPatternPlaceholder: 'minimatch 패턴', useShadowRoot: 'Shadow DOM 검색', selectorsNormal: 'CSS 선택기', selectorsHost: '호스트 선택기', selectorsPlaceholderNormal: '예: .text', selectorsPlaceholderHost: '예: #app', shadowRootSelectors: 'Shadow Root 선택기', shadowRootSelectorsPlaceholder: '예: #content', shadowRootTip: 'Shadow DOM 검색.'
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
      badgeLabel: 'Resumo da página', summary: 'Resumo', reSummarize: 'Re-resumir', untitledPage: 'Página sem título',
      contentTokenCount: 'Tokens:', tokenViewerInfoTip: 'Apenas visualização.', calculating: 'Calculando...',
    },
    general: {
      loadFailed: 'Falha ao carregar.', restoreDefaults: 'Restaurar padrões', saveFailed: 'Falha ao salvar.', savedToast: 'Salvo.',
      sections: { contextMenu: { description: 'Menu de contexto.', title: 'Menu de contexto' }, triggers: { description: 'Comportamento padrão.', title: 'Gatilhos' } },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: 'Enviar logo após adicionar.', label: 'Enviar ao adicionar' },
        enableAutoBeginSummary: { description: '', label: 'Resumir ao abrir' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: 'Resumir por menu' },
        enableChatInputBox: { description: 'Caixa de chat no painel.', label: 'Caixa de chat' },
        enableContextMenuAddSelectionToChat: { description: 'Adicionar ao chat.', label: 'Adicionar seleção ao chat' },
        enableContextMenuSummarizeThisPage: { description: 'Resumir esta página.', label: 'Resumir esta página' },
        enableCreateNewPanelButton: { description: 'Botão novo painel.', label: 'Novo painel' },
        enableFloatingBall: { description: 'Botão flutuante.', label: 'Botão flutuante' },
        enableSummaryWindowDefault: { caution: 'Muda todas as páginas.', description: '', label: 'Auto-abrir' },
        enableTokenUsageView: { description: 'Uso de tokens.', label: 'Tokens' },
      },
      summaryLanguage: { description: 'Idioma do resumo.', label: 'Idioma' }, title: 'Geral',
    },
    exportImport: {
      exportImportDescription: 'Gerenciar configurações.',
      exportConfiguration: 'Exportar', exportWithApiKeys: 'Com chaves de API', copyToClipboard: 'Copiar',
      importConfiguration: 'Importar', importConfigurationDescription: 'Da área de transferência.', readFromClipboard: 'Ler da área de transferência',
      dangerZone: 'Zona de Perigo', resetConfigurationDescription: 'Limpar tudo.', resetAllConfigurations: 'Resetar',
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
      useDefault: (name) => `Usar como padrão`, moveUp: (name) => `Subir`, moveDown: (name) => `Descer`, duplicate: (name) => `Duplicar`, edit: (name) => `Editar`, delete: (name) => `Deletar`, deleteConfirm: (name) => `Deletar?`, deletedToast: 'Deletado.', deleteFailed: 'Falha.', moveFailed: 'Falha.', duplicatedToast: 'Duplicado.', duplicateFailed: 'Falha.', defaultChangedFailed: 'Falha.',
    },
    pageExtraction: {
      method: { description: 'Método de extração', title: 'Extração' },
      methods: { 'dom-heuristic': { description: 'DOM', label: 'DOM' }, readability: { description: 'Readability', label: 'Readability' } },
    },
    prompts: {
      create: 'Criar', createFromPreset: 'Do preset:', createdToast: 'Criado.', defaultBadge: 'Padrão', delete: (name) => `Deletar`, deleteConfirm: (name) => `Deletar?`, deleteFailed: 'Falha.', deletedToast: 'Deletado.', edit: (name) => `Editar`, emptyDescription: 'Crie um prompt.', emptyTitle: 'Sem prompts', libraryDescription: 'Gerenciar templates.', libraryTitle: 'Prompts', loadFailed: 'Falha.', makeDefault: (name) => `Usar como padrão`, missingPromptId: 'Sem ID.', moveDown: (name) => `Descer`, moveFailed: 'Falha.', moveUp: (name) => `Subir`, name: 'Nome', namePlaceholder: 'Resumo', promptNotFound: 'Não encontrado.', saveFailed: 'Falha.', savedToast: 'Salvo.', selectDefaultFailed: 'Falha.', systemMessage: 'System', systemMessageDescription: 'Instruções.', templateVariables: 'Variáveis', templateVariablesDescription: 'Variáveis.', userMessage: 'User', userMessageDescription: 'Mensagem do usuário.',
      variableDescriptions: { articleUrl: 'URL', currentSelection: 'Seleção', summaryLanguage: 'Idioma', textContent: 'Conteúdo' },
    },
    pageTitles: { createModel: 'Criar modelo', createPrompt: 'Criar prompt', editModel: 'Editar modelo', editPrompt: 'Editar prompt', exportImport: 'Configurações', interface: 'Interface', models: 'Modelos', prompts: 'Prompts', siteCustomization: 'Personalização', welcome: 'Bem-vindo' },
    popup: { noActiveTab: 'Sem guia ativa', openOptions: 'Opções', model: 'Modelo', prompt: 'Prompt', summary: 'Resumo', page: 'Página', openPanelAndStartSummary: 'Iniciar resumo', copyPageContentToClipboard: 'Copiar conteúdo', extractFailed: 'Falha', copySuccess: 'Copiado', copyFailed: 'Falha', invokeSummaryFailed: 'Falha' },
    siteCustomization: {
      examplesTitle: 'Exemplos', examplesDescription: 'Padrões', examples: [], whitelist: 'Lista Branca', blacklist: 'Lista Negra', whitelistDescription: 'Apenas nestes.', blacklistDescription: 'Exceto nestes.', patternsLabel: 'Padrões', onePerLine: 'Um por linha', whitelistPlaceholder: 'ex: www.reddit.com', blacklistPlaceholder: 'ex: www.bing.com',
      customizationTitle: 'Seletores', customizationDescription: 'CSS.', addRule: 'Add regra', noRules: 'Sem regras', noRulesDescription: 'Adicione.', newRuleFallback: 'Nova', matchPattern: 'Padrão', matchPatternPlaceholder: 'Padrão', useShadowRoot: 'Shadow DOM', selectorsNormal: 'CSS', selectorsHost: 'Host', selectorsPlaceholderNormal: 'ex: .text', selectorsPlaceholderHost: 'ex: #app', shadowRootSelectors: 'Shadow Root', shadowRootSelectorsPlaceholder: 'ex: #content', shadowRootTip: 'Shadow DOM.'
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
      badgeLabel: 'Resumen de página', summary: 'Resumen', reSummarize: 'Re-resumir', untitledPage: 'Página sin título',
      contentTokenCount: 'Tokens:', tokenViewerInfoTip: 'Solo visualización.', calculating: 'Calculando...',
    },
    general: {
      loadFailed: 'Fallo al cargar.', restoreDefaults: 'Restaurar', saveFailed: 'Fallo al guardar.', savedToast: 'Guardado.',
      sections: { contextMenu: { description: 'Menú contextual.', title: 'Menú contextual' }, triggers: { description: 'Comportamiento.', title: 'Desencadenadores' } },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: 'Enviar inmediatamente al añadir.', label: 'Enviar al añadir' },
        enableAutoBeginSummary: { description: '', label: 'Resumir al abrir' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: 'Resumir por menú' },
        enableChatInputBox: { description: 'Caja de chat en el panel.', label: 'Caja de chat' },
        enableContextMenuAddSelectionToChat: { description: 'Añadir al chat.', label: 'Añadir selección al chat' },
        enableContextMenuSummarizeThisPage: { description: 'Resumir esta página.', label: 'Resumir esta página' },
        enableCreateNewPanelButton: { description: 'Botón nuevo panel.', label: 'Nuevo panel' },
        enableFloatingBall: { description: 'Botón flotante.', label: 'Botón flotante' },
        enableSummaryWindowDefault: { caution: 'Cambia todas las páginas.', description: '', label: 'Auto-abrir' },
        enableTokenUsageView: { description: 'Uso de tokens.', label: 'Tokens' },
      },
      summaryLanguage: { description: 'Idioma del resumen.', label: 'Idioma' }, title: 'General',
    },
    exportImport: {
      exportImportDescription: 'Gestionar configuraciones.',
      exportConfiguration: 'Exportar', exportWithApiKeys: 'Con claves de API', copyToClipboard: 'Copiar',
      importConfiguration: 'Importar', importConfigurationDescription: 'Del portapapeles.', readFromClipboard: 'Leer del portapapeles',
      dangerZone: 'Zona de Peligro', resetConfigurationDescription: 'Limpiar todo.', resetAllConfigurations: 'Resetear',
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
      useDefault: (name) => `Predeterminado`, moveUp: (name) => `Subir`, moveDown: (name) => `Bajar`, duplicate: (name) => `Duplicar`, edit: (name) => `Editar`, delete: (name) => `Eliminar`, deleteConfirm: (name) => `¿Eliminar?`, deletedToast: 'Eliminado.', deleteFailed: 'Fallo.', moveFailed: 'Fallo.', duplicatedToast: 'Duplicado.', duplicateFailed: 'Fallo.', defaultChangedFailed: 'Fallo.',
    },
    pageExtraction: {
      method: { description: 'Extracción', title: 'Extracción' },
      methods: { 'dom-heuristic': { description: 'DOM', label: 'DOM' }, readability: { description: 'Readability', label: 'Readability' } },
    },
    prompts: {
      create: 'Crear', createFromPreset: 'Del preset:', createdToast: 'Creado.', defaultBadge: 'Predeterminado', delete: (name) => `Eliminar`, deleteConfirm: (name) => `¿Eliminar?`, deleteFailed: 'Fallo.', deletedToast: 'Eliminado.', edit: (name) => `Editar`, emptyDescription: 'Crea un prompt.', emptyTitle: 'Sin prompts', libraryDescription: 'Templates.', libraryTitle: 'Prompts', loadFailed: 'Fallo.', makeDefault: (name) => `Predeterminado`, missingPromptId: 'Sin ID.', moveDown: (name) => `Bajar`, moveFailed: 'Fallo.', moveUp: (name) => `Subir`, name: 'Nombre', namePlaceholder: 'Resumen', promptNotFound: 'No encontrado.', saveFailed: 'Fallo.', savedToast: 'Guardado.', selectDefaultFailed: 'Fallo.', systemMessage: 'System', systemMessageDescription: 'Instrucciones.', templateVariables: 'Variables', templateVariablesDescription: 'Variables.', userMessage: 'User', userMessageDescription: 'Contexto.',
      variableDescriptions: { articleUrl: 'URL', currentSelection: 'Selección', summaryLanguage: 'Idioma', textContent: 'Contenido' },
    },
    pageTitles: { createModel: 'Crear modelo', createPrompt: 'Crear prompt', editModel: 'Editar modelo', editPrompt: 'Editar prompt', exportImport: 'Configuración', interface: 'Interfaz', models: 'Modelos', prompts: 'Prompts', siteCustomization: 'Sitios', welcome: 'Bienvenido' },
    popup: { noActiveTab: 'Sin pestaña', openOptions: 'Opciones', model: 'Modelo', prompt: 'Prompt', summary: 'Resumen', page: 'Página', openPanelAndStartSummary: 'Resumir', copyPageContentToClipboard: 'Copiar', extractFailed: 'Fallo', copySuccess: 'Copiado', copyFailed: 'Fallo', invokeSummaryFailed: 'Fallo' },
    siteCustomization: {
      examplesTitle: 'Ejemplos', examplesDescription: 'Patrones', examples: [], whitelist: 'Lista Blanca', blacklist: 'Lista Negra', whitelistDescription: 'Solo en estos.', blacklistDescription: 'Excepto estos.', patternsLabel: 'Patrones', onePerLine: 'Uno por línea', whitelistPlaceholder: 'ej: www.reddit.com', blacklistPlaceholder: 'ej: www.bing.com',
      customizationTitle: 'Selectores', customizationDescription: 'CSS.', addRule: 'Añadir', noRules: 'Sin reglas', noRulesDescription: 'Añade.', newRuleFallback: 'Nueva', matchPattern: 'Patrón', matchPatternPlaceholder: 'Patrón', useShadowRoot: 'Shadow DOM', selectorsNormal: 'CSS', selectorsHost: 'Host', selectorsPlaceholderNormal: 'ej: .text', selectorsPlaceholderHost: 'ej: #app', shadowRootSelectors: 'Shadow Root', shadowRootSelectorsPlaceholder: 'ej: #content', shadowRootTip: 'Shadow DOM.'
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
      badgeLabel: 'Résumé de la page', summary: 'Résumé', reSummarize: 'Re-résumer', untitledPage: 'Page sans titre',
      contentTokenCount: 'Tokens:', tokenViewerInfoTip: 'Visualisation uniquement.', calculating: 'Calcul...',
    },
    general: {
      loadFailed: 'Échec du chargement.', restoreDefaults: 'Restaurer', saveFailed: 'Échec de la sauvegarde.', savedToast: 'Enregistré.',
      sections: { contextMenu: { description: 'Menu contextuel.', title: 'Menu contextuel' }, triggers: { description: 'Comportement.', title: 'Déclencheurs' } },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: 'Envoyer immédiatement.', label: 'Envoyer lors de l\'ajout' },
        enableAutoBeginSummary: { description: '', label: 'Résumer à l\'ouverture' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: 'Résumer par menu' },
        enableChatInputBox: { description: 'Boîte de chat dans le panneau.', label: 'Boîte de chat' },
        enableContextMenuAddSelectionToChat: { description: 'Ajouter au chat.', label: 'Ajouter la sélection au chat' },
        enableContextMenuSummarizeThisPage: { description: 'Résumer cette page.', label: 'Résumer cette page' },
        enableCreateNewPanelButton: { description: 'Bouton nouveau panneau.', label: 'Nouveau panneau' },
        enableFloatingBall: { description: 'Bouton flottant.', label: 'Bouton flottant' },
        enableSummaryWindowDefault: { caution: 'Modifie toutes les pages.', description: '', label: 'Ouverture auto' },
        enableTokenUsageView: { description: 'Utilisation des tokens.', label: 'Tokens' },
      },
      summaryLanguage: { description: 'Langue du résumé.', label: 'Langue' }, title: 'Général',
    },
    exportImport: {
      exportImportDescription: 'Gérer les paramètres.',
      exportConfiguration: 'Exporter', exportWithApiKeys: 'Avec les clés API', copyToClipboard: 'Copier',
      importConfiguration: 'Importer', importConfigurationDescription: 'Depuis le presse-papiers.', readFromClipboard: 'Lire depuis le presse-papiers',
      dangerZone: 'Zone de Danger', resetConfigurationDescription: 'Tout effacer.', resetAllConfigurations: 'Réinitialiser',
      resetConfirm: 'Êtes-vous sûr ?', noChanges: 'Aucun changement', noChangesDesc: 'Les paramètres sont identiques.',
      reviewImport: 'Réviser', importedSuccess: (count) => `${count} importés.`,
      noImportSelected: 'Rien n\'est sélectionné.', resetSuccess: 'Réinitialisé.',
      importReviewTitle: 'Révision', confirmImport: 'Confirmer', acceptAll: 'Tout accepter', rejectAll: 'Rejeter', cancel: 'Annuler',
      configItem: 'Élément', oldValue: 'Ancien', newValue: 'Nouveau', action: 'Action', conflict: 'Conflit', addNew: 'Nouveau', overwrite: 'Écraser', accept: 'Accepter', skip: 'Ignorer', discard: 'Ignorer',
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
      useDefault: (name) => `Défaut`, moveUp: (name) => `Monter`, moveDown: (name) => `Descendre`, duplicate: (name) => `Dupliquer`, edit: (name) => `Modifier`, delete: (name) => `Supprimer`, deleteConfirm: (name) => `Supprimer ?`, deletedToast: 'Supprimé.', deleteFailed: 'Échec.', moveFailed: 'Échec.', duplicatedToast: 'Dupliqué.', duplicateFailed: 'Échec.', defaultChangedFailed: 'Échec.',
    },
    pageExtraction: {
      method: { description: 'Extraction', title: 'Extraction' },
      methods: { 'dom-heuristic': { description: 'DOM', label: 'DOM' }, readability: { description: 'Readability', label: 'Readability' } },
    },
    prompts: {
      create: 'Créer', createFromPreset: 'Du preset:', createdToast: 'Créé.', defaultBadge: 'Défaut', delete: (name) => `Supprimer`, deleteConfirm: (name) => `Supprimer ?`, deleteFailed: 'Échec.', deletedToast: 'Supprimé.', edit: (name) => `Modifier`, emptyDescription: 'Créez un prompt.', emptyTitle: 'Aucun prompt', libraryDescription: 'Templates.', libraryTitle: 'Prompts', loadFailed: 'Échec.', makeDefault: (name) => `Défaut`, missingPromptId: 'Sans ID.', moveDown: (name) => `Descendre`, moveFailed: 'Échec.', moveUp: (name) => `Monter`, name: 'Nom', namePlaceholder: 'Résumé', promptNotFound: 'Non trouvé.', saveFailed: 'Échec.', savedToast: 'Enregistré.', selectDefaultFailed: 'Échec.', systemMessage: 'System', systemMessageDescription: 'Instructions.', templateVariables: 'Variables', templateVariablesDescription: 'Variables.', userMessage: 'User', userMessageDescription: 'Contexte.',
      variableDescriptions: { articleUrl: 'URL', currentSelection: 'Sélection', summaryLanguage: 'Langue', textContent: 'Contenu' },
    },
    pageTitles: { createModel: 'Créer un modèle', createPrompt: 'Créer un prompt', editModel: 'Modifier un modèle', editPrompt: 'Modifier un prompt', exportImport: 'Paramètres', interface: 'Interface', models: 'Modèles', prompts: 'Prompts', siteCustomization: 'Sites', welcome: 'Bienvenue' },
    popup: { noActiveTab: 'Aucun onglet', openOptions: 'Options', model: 'Modèle', prompt: 'Prompt', summary: 'Résumé', page: 'Page', openPanelAndStartSummary: 'Résumer', copyPageContentToClipboard: 'Copier', extractFailed: 'Échec', copySuccess: 'Copié', copyFailed: 'Échec', invokeSummaryFailed: 'Échec' },
    siteCustomization: {
      examplesTitle: 'Exemples', examplesDescription: 'Modèles', examples: [], whitelist: 'Liste Blanche', blacklist: 'Liste Noire', whitelistDescription: 'Seulement ceux-ci.', blacklistDescription: 'Sauf ceux-ci.', patternsLabel: 'Modèles', onePerLine: 'Un par ligne', whitelistPlaceholder: 'ex: www.reddit.com', blacklistPlaceholder: 'ex: www.bing.com',
      customizationTitle: 'Sélecteurs', customizationDescription: 'CSS.', addRule: 'Ajouter', noRules: 'Aucune règle', noRulesDescription: 'Ajoutez.', newRuleFallback: 'Nouveau', matchPattern: 'Modèle', matchPatternPlaceholder: 'Modèle', useShadowRoot: 'Shadow DOM', selectorsNormal: 'CSS', selectorsHost: 'Hôte', selectorsPlaceholderNormal: 'ex: .text', selectorsPlaceholderHost: 'ex: #app', shadowRootSelectors: 'Shadow Root', shadowRootSelectorsPlaceholder: 'ex: #content', shadowRootTip: 'Shadow DOM.'
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
      badgeLabel: 'Webpage Summary', summary: 'Zusammenfassung', reSummarize: 'Neu zusammenfassen', untitledPage: 'Unbenannte Seite',
      contentTokenCount: 'Tokens:', tokenViewerInfoTip: 'Nur Visualisierung.', calculating: 'Berechnung...',
    },
    general: {
      loadFailed: 'Laden fehlgeschlagen.', restoreDefaults: 'Zurücksetzen', saveFailed: 'Speichern fehlgeschlagen.', savedToast: 'Gespeichert.',
      sections: { contextMenu: { description: 'Kontextmenü.', title: 'Kontextmenü' }, triggers: { description: 'Verhalten.', title: 'Auslöser' } },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: { description: 'Sofort senden.', label: 'Senden beim Hinzufügen' },
        enableAutoBeginSummary: { description: '', label: 'Zusammenfassen beim Öffnen' },
        enableAutoBeginSummaryByActionOrContextTrigger: { description: '', label: 'Zusammenfassen über Menü' },
        enableChatInputBox: { description: 'Chat-Box.', label: 'Chat-Box' },
        enableContextMenuAddSelectionToChat: { description: 'Zum Chat hinzufügen.', label: 'Auswahl zum Chat hinzufügen' },
        enableContextMenuSummarizeThisPage: { description: 'Diese Seite zusammenfassen.', label: 'Diese Seite zusammenfassen' },
        enableCreateNewPanelButton: { description: 'Neues Panel-Button.', label: 'Neues Panel' },
        enableFloatingBall: { description: 'Schwebender Button.', label: 'Schwebender Button' },
        enableSummaryWindowDefault: { caution: 'Ändert alle Seiten.', description: '', label: 'Auto-Öffnen' },
        enableTokenUsageView: { description: 'Token-Nutzung.', label: 'Tokens' },
      },
      summaryLanguage: { description: 'Sprache.', label: 'Sprache' }, title: 'Allgemein',
    },
    exportImport: {
      exportImportDescription: 'Einstellungen verwalten.',
      exportConfiguration: 'Exportieren', exportWithApiKeys: 'Mit API-Schlüsseln', copyToClipboard: 'Kopieren',
      importConfiguration: 'Importieren', importConfigurationDescription: 'Aus Zwischenablage.', readFromClipboard: 'Aus Zwischenablage lesen',
      dangerZone: 'Gefahrenzone', resetConfigurationDescription: 'Alles löschen.', resetAllConfigurations: 'Zurücksetzen',
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
      useDefault: (name) => `Standard`, moveUp: (name) => `Hoch`, moveDown: (name) => `Runter`, duplicate: (name) => `Duplizieren`, edit: (name) => `Bearbeiten`, delete: (name) => `Löschen`, deleteConfirm: (name) => `Löschen?`, deletedToast: 'Gelöscht.', deleteFailed: 'Fehlgeschlagen.', moveFailed: 'Fehlgeschlagen.', duplicatedToast: 'Dupliziert.', duplicateFailed: 'Fehlgeschlagen.', defaultChangedFailed: 'Fehlgeschlagen.',
    },
    pageExtraction: {
      method: { description: 'Extraktion', title: 'Extraktion' },
      methods: { 'dom-heuristic': { description: 'DOM', label: 'DOM' }, readability: { description: 'Readability', label: 'Readability' } },
    },
    prompts: {
      create: 'Erstellen', createFromPreset: 'Von Preset:', createdToast: 'Erstellt.', defaultBadge: 'Standard', delete: (name) => `Löschen`, deleteConfirm: (name) => `Löschen?`, deleteFailed: 'Fehlgeschlagen.', deletedToast: 'Gelöscht.', edit: (name) => `Bearbeiten`, emptyDescription: 'Erstellen Sie einen Prompt.', emptyTitle: 'Keine Prompts', libraryDescription: 'Templates.', libraryTitle: 'Prompts', loadFailed: 'Fehlgeschlagen.', makeDefault: (name) => `Standard`, missingPromptId: 'Keine ID.', moveDown: (name) => `Runter`, moveFailed: 'Fehlgeschlagen.', moveUp: (name) => `Hoch`, name: 'Name', namePlaceholder: 'Zusammenfassung', promptNotFound: 'Nicht gefunden.', saveFailed: 'Fehlgeschlagen.', savedToast: 'Gespeichert.', selectDefaultFailed: 'Fehlgeschlagen.', systemMessage: 'System', systemMessageDescription: 'Anweisungen.', templateVariables: 'Variablen', templateVariablesDescription: 'Variablen.', userMessage: 'User', userMessageDescription: 'Kontext.',
      variableDescriptions: { articleUrl: 'URL', currentSelection: 'Auswahl', summaryLanguage: 'Sprache', textContent: 'Inhalt' },
    },
    pageTitles: { createModel: 'Modell erstellen', createPrompt: 'Prompt erstellen', editModel: 'Modell bearbeiten', editPrompt: 'Prompt bearbeiten', exportImport: 'Einstellungen', interface: 'Schnittstelle', models: 'Modelle', prompts: 'Prompts', siteCustomization: 'Websites', welcome: 'Willkommen' },
    popup: { noActiveTab: 'Kein Tab', openOptions: 'Optionen', model: 'Modell', prompt: 'Prompt', summary: 'Zusammenfassung', page: 'Seite', openPanelAndStartSummary: 'Zusammenfassen', copyPageContentToClipboard: 'Kopieren', extractFailed: 'Fehlgeschlagen', copySuccess: 'Kopiert', copyFailed: 'Fehlgeschlagen', invokeSummaryFailed: 'Fehlgeschlagen' },
    siteCustomization: {
      examplesTitle: 'Beispiele', examplesDescription: 'Muster', examples: [], whitelist: 'Whitelist', blacklist: 'Blacklist', whitelistDescription: 'Nur diese.', blacklistDescription: 'Außer diese.', patternsLabel: 'Muster', onePerLine: 'Eines pro Zeile', whitelistPlaceholder: 'z.B. www.reddit.com', blacklistPlaceholder: 'z.B. www.bing.com',
      customizationTitle: 'Selektoren', customizationDescription: 'CSS.', addRule: 'Hinzufügen', noRules: 'Keine Regeln', noRulesDescription: 'Fügen Sie eine hinzu.', newRuleFallback: 'Neu', matchPattern: 'Muster', matchPatternPlaceholder: 'Muster', useShadowRoot: 'Shadow DOM', selectorsNormal: 'CSS', selectorsHost: 'Host', selectorsPlaceholderNormal: 'z.B. .text', selectorsPlaceholderHost: 'z.B. #app', shadowRootSelectors: 'Shadow Root', shadowRootSelectorsPlaceholder: 'z.B. #content', shadowRootTip: 'Shadow DOM.'
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
