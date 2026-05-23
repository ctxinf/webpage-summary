export type UiLocale = 'en' | 'zh-CN';

export const UI_LOCALE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: '简体中文', value: 'zh-CN' },
] as const satisfies Array<{ label: string; value: UiLocale }>;

const UI_LOCALE_OVERRIDE_STORAGE_KEY = 'webpage-summary-ui-locale';

type GeneralBooleanSettingMessageKey =
  | 'enableChatInputBox'
  | 'enableFloatingBall'
  | 'enablePopupClickTrigger'
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
      'contextMenu' | 'display' | 'panel' | 'triggers',
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
      | 'appearance'
      | 'exportImport'
      | 'general'
      | 'models'
      | 'pageExtraction'
      | 'prompts'
      | 'siteCustomization',
      string
    >;
    navigationLabel: string;
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
    appearance: string;
    createModel: string;
    createPrompt: string;
    editModel: string;
    editPrompt: string;
    exportImport: string;
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
        display: {
          description: 'Keep the summary panel focused on the controls you use.',
          title: 'Display',
        },
        panel: {
          description: 'Choose how summary controls appear inside the page.',
          title: 'Panel',
        },
        triggers: {
          description: 'Control when an open panel starts work automatically.',
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
          description: 'Show the context menu item for summarizing the page.',
          label: 'Summarize this page',
        },
        enableCreateNewPanelButton: {
          description: 'Show the control for creating another summary panel.',
          label: 'New panel button',
        },
        enableFloatingBall: {
          description: 'Show a page control for opening the summary panel.',
          label: 'Floating button',
        },
        enablePopupClickTrigger: {
          description:
            'Use the extension action click as a summary trigger instead of the popup panel.',
          label: 'Popup click opens summary',
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
        appearance: 'Appearance',
        exportImport: 'Export Import',
        general: 'General',
        models: 'Models',
        pageExtraction: 'Page Extraction',
        prompts: 'Prompts',
        siteCustomization: 'Site Customization',
      },
      navigationLabel: 'Options',
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
      appearance: 'Appearance Setting',
      createModel: 'Create Model',
      createPrompt: 'Create Prompt',
      editModel: 'Edit Model',
      editPrompt: 'Edit Prompt',
      exportImport: 'Export Import',
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
        display: {
          description: '保留你会使用的总结面板控件。',
          title: '显示',
        },
        panel: {
          description: '选择总结控件在页面中的呈现方式。',
          title: '面板',
        },
        triggers: {
          description: '控制面板打开后何时自动开始工作。',
          title: '触发方式',
        },
      },
      settings: {
        enableAutoBeginChatForAddSelectionToChat: {
          description: '选中的页面文本加入对话后自动开始聊天。',
          label: '加入选中文本后发送',
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
          description: '显示新建另一个总结面板的控件。',
          label: '新面板按钮',
        },
        enableFloatingBall: {
          description: '显示用于打开总结面板的页面控件。',
          label: '悬浮按钮',
        },
        enablePopupClickTrigger: {
          description: '将扩展按钮点击作为总结触发器，而不是打开弹窗面板。',
          label: '点击扩展按钮打开总结',
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
        appearance: '外观',
        exportImport: '导入导出',
        general: '通用',
        models: '模型',
        pageExtraction: '页面提取',
        prompts: '提示词',
        siteCustomization: '站点定制',
      },
      navigationLabel: '选项',
    },
    pageExtraction: {
      defaultReadability: '恢复默认 Readability',
      loadFailed: '页面提取设置加载失败。',
      method: {
        description: '选择组装总结输入前使用的通用页面提取路径。',
        title: '文本提取方式',
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
      appearance: '外观设置',
      createModel: '创建模型',
      createPrompt: '创建提示词',
      editModel: '编辑模型',
      editPrompt: '编辑提示词',
      exportImport: '导入导出',
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
