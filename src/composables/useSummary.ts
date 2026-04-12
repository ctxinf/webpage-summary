// packages/ext/src/composables/useStreamSummary.ts
import { sendConnectMessage } from '@/connect-messaging';
import { storage } from '#imports';
import { CoreMessage } from 'ai';
import { EventEmitter } from 'eventemitter3';
import { minimatch } from 'minimatch';
import { computed, onMounted, onUnmounted, Ref, ref, toRaw, watch } from 'vue';
import { toast } from '../components/ui/toast';
import { SITE_CUSTOMIZATION } from '../constants/storage-key';
import { ModelConfigItem } from '../types/config/model';
import { PromptConfigItem } from '../types/config/prompt';
import { SiteCumstomizationItem } from '../types/config/site-rules';
import { UIMessage } from '../types/message';
import { PageTextExtractMethod, TokenUsage, WebpageContent } from '../types/summary';
import { writeTextToClipboard, onSpaRouteChange } from '../utils/document';
import { handleConnectError } from '../utils/error-parse';
import { parsePageContent, textsBySelectors } from '../utils/page-read';
import { renderMessages } from '../utils/prompt';
import { getEnableAutoBeginSummary, getPageTextExtractMethod, getSummaryLanguage, usePageTextExtractMethod } from './general-config';
import { useModelConfigStorage } from './model-config';
import { usePromptConfigStorage, usePromptDefaultPreset } from './prompt';

export function useSummary() {
  function formatCurrentModelDebug() {
    if (!currentModel.value) {
      return ''
    }

    const { name, providerType, modelName } = currentModel.value
    return `${name} [${providerType}/${modelName}]`
  }

  const uiMessages = ref<UIMessage[]>([])
  const messages = ref<CoreMessage[]>([])
  const { pageTextExtractMethod } = usePageTextExtractMethod()

  const isRunning = ref(false)
  const isFailed = ref(false)
  const isPreparing = ref(true)

  const status = computed<'preparing' | 'failed' | 'ready' | 'running'>(() => {
    if (isRunning.value) {
      return 'running'
    }

    if (isFailed.value || error.value) {
      return 'failed'
    }

    if (isPreparing.value) {
      return 'preparing'
    }

    return 'ready'
  })
  const error = ref<any>()
  let stopFunction: CallableFunction | null = null

  /**
   * Expose both the trim function and the active slice range so preview and actual input stay in sync.
   */
  const textContentTrimmer = ref<{ trim: (s: string) => string, range: [number, number] }>({
    trim: (content: string): string => content,
    range: [0, Number.MAX_SAFE_INTEGER],
  })

  const modelStorage = useModelConfigStorage()
  const promptStorage = usePromptConfigStorage()

  const currentModel = ref<ModelConfigItem | null>()
  const currentPrompt = ref<PromptConfigItem | null>()

  const promptPreset = usePromptDefaultPreset()
  const tokenUsage = ref<TokenUsage>(createEmptyTokenUsage())
  const lastRenderedSummaryInputSignature = ref('')

  const webpageContent: Ref<WebpageContent | undefined> = ref()
  initWebpageContent()//async process

  const event = new EventEmitter()

  function onPrepareDone(onReadyHook: () => void) {
    event.once('prepare-done', onReadyHook)
  }

  function onChunk(onChunkHook: (chunk: unknown) => void) {
    event.on('chunk', onChunkHook)
  }

  function verfiyReady() {
    if (status.value === 'ready') {
      return true
    }
    if (status.value === 'preparing') {
      toast({ title: 'Please wait for the config-reading to be ready', variant: 'warning' })
    } else if (status.value === 'running') {
      return false
    }
    return true
  }

  function specialCaseCheck() {
    if (currentModel.value?.providerType === 'moonshot(web)' && ['kimi', 'k1'].includes(currentModel.value!.modelName)) {
      toast({ variant: 'warning', title: 'kimi/k1 model has been deprecated by moonshot web. Please change to the newest model.', duration: 10000 })
    }
  }

  async function initWebpageContent() {
    return initWebpageContentByMethod()
  }

  async function initWebpageContentByMethod(extractMethodOverride?: PageTextExtractMethod) {
    const [configs, resolvedExtractMethod] = await Promise.all([
      storage.getItem<SiteCumstomizationItem[]>(SITE_CUSTOMIZATION),
      extractMethodOverride ? Promise.resolve(extractMethodOverride) : getPageTextExtractMethod(),
    ])

    const matchOne = configs?.find(c => c.enable
      &&
      (
        minimatch(window.location.hostname, c.pattern)
        ||
        minimatch(window.location.hostname + window.location.pathname, c.pattern)
      )
    )

    if (matchOne) {
      webpageContent.value = textsBySelectors(matchOne.selectors, {
        useShadowRoot: matchOne.useShadowRoot,
        shadowRootSelectors: matchOne.shadowRootSelectors,
      })
      return
    }

    webpageContent.value = parsePageContent(resolvedExtractMethod)
    return webpageContent.value
  }

  function getTrimmedText(sourceText: string) {
    return textContentTrimmer.value.trim(sourceText)
  }

  function getSummaryInputSignature(sourceText: string) {
    const [start, end] = textContentTrimmer.value.range
    return [webpageContent.value?.extractMethod ?? '', start, end, sourceText].join('\n')
  }

  async function ensureSummaryMessages() {
    if (!webpageContent.value) {
      throw new Error('webpage content is empty')
    }

    const sourceText = webpageContent.value.textContent ?? ''
    const signature = getSummaryInputSignature(sourceText)
    const hasRenderedMessages = messages.value.length > 0

    if (!hasRenderedMessages) {
      await initMessages()
      return false
    }

    if (signature === lastRenderedSummaryInputSignature.value) {
      return false
    }

    messages.value = []
    uiMessages.value = []
    tokenUsage.value = createEmptyTokenUsage()
    await initMessages()
    return true
  }

  let disconnectOnSPARouteChange: Function
  onMounted(async () => {
    /*listen SPA change, update webpageContent
    */
    disconnectOnSPARouteChange = onSpaRouteChange(() => {
      initWebpageContent()
      stop();
      messages.value = [] //reset messages
      uiMessages.value = [] //reset ui messages
      lastRenderedSummaryInputSignature.value = ''

    }).disconnect

    try {
      currentModel.value = await modelStorage.getDefaultItem()
      currentPrompt.value = await promptStorage.getDefaultItem()
      isFailed.value = !(currentModel.value && currentPrompt.value && webpageContent.value)
      isPreparing.value = false
      event.emit('prepare-done')
      if (await getEnableAutoBeginSummary()) {
        refreshSummary()
      }
    } catch (e) {
      error.value = (e)
      event.emit('prepare-done')
    }
  })

  onUnmounted(() => {
    disconnectOnSPARouteChange?.()
  })

  watch(pageTextExtractMethod, async (nextMethod, prevMethod) => {
    if (!nextMethod) {
      return
    }

    if (nextMethod === prevMethod) {
      return
    }

    await handleExtractMethodChanged(nextMethod)
  })

  async function handleExtractMethodChanged(extractMethod: PageTextExtractMethod) {
    const hadConversation = uiMessages.value.some(message => !message.hide)

    await stop()
    await initWebpageContentByMethod(extractMethod)

    messages.value = []
    uiMessages.value = []
    lastRenderedSummaryInputSignature.value = ''
    tokenUsage.value = createEmptyTokenUsage()
    error.value = undefined
    isFailed.value = !(currentModel.value && currentPrompt.value && webpageContent.value)

    if (hadConversation && currentModel.value && currentPrompt.value && webpageContent.value) {
      await refreshSummary()
    }
  }

  async function initMessages() {
    if (!currentModel.value || !currentPrompt.value) {
      throw new Error('Model or Prompt is not ready')
    }
    messages.value = [
      { role: 'system', content: currentPrompt.value?.systemMessage ?? promptPreset.systemMessage },
      { role: 'user', content: currentPrompt.value?.userMessage ?? promptPreset.userMessage },
    ]
    /*
     * render and deal with content length exceed
     */

    if (webpageContent.value) {
      const sourceText = webpageContent.value.textContent ?? ''
      const trimmedText = getTrimmedText(sourceText)
      const summaryInput = {
        ...webpageContent.value,
        textContent: trimmedText,
        inputTextLength: trimmedText.length,
        summaryLanguage: await getSummaryLanguage(),
        currentSelection: window.getSelection()?.toString() || '',
        currentModel: formatCurrentModelDebug(),
      }
      renderMessages(messages.value, summaryInput)
      lastRenderedSummaryInputSignature.value = getSummaryInputSignature(sourceText)
    } else {
      throw new Error('webpage content is empty')
    }

    //init ui messages with first two message hidden
    uiMessages.value = messages.value.map(m => ({
      at: Date.now(),
      content: m.content as string,
      role: m.role as 'system' | 'user',
      hide: true,
    }))
  }

  async function refreshSummary() {
    try {
      const didResetMessages = await ensureSummaryMessages()
      if (!didResetMessages && messages.value.length && messages.value[messages.value.length - 1].role === 'assistant') {
        messages.value.pop();
      }
      await chat('', 'assistant', true)

    } catch (e) {
      console.error(e)
      error.value = handleConnectError(e)
    }

  }

  async function copyMessages() {
    const text = uiMessages.value.map(m => m.role + ':  ' + m.content).join('\n' + '-'.repeat(50) + '\n')
    await writeTextToClipboard(text)
    toast({ title: 'copied to clipboard success!', variant: 'success' })
  }

  async function chat(content: string, role: 'user' | 'assistant', skipEnsureSummaryMessages = false) {
    if (!verfiyReady()) {
      return
    }
    specialCaseCheck()

    if (!skipEnsureSummaryMessages) {
      await ensureSummaryMessages()
    }
    /*content can be '', for reusing this function to trigger initial summary with the first two messages.    */
    if (content) {
      messages.value.push({
        role: role, content: content,
      })

      //show user input message
      if (role === 'user') {
        uiMessages.value.push({ role: 'user', content: content, at: Date.now() })
      }
    }

    //show latest assitant message
    uiMessages.value.push({ role: 'assistant', content: '', at: Date.now() })

    isRunning.value = true
    const { textStream, tokenUsage: newTokenUsage, stop } = await sendConnectMessage(
      'streamTextViaConnect',
      {
        modelConfig: toRaw(currentModel.value!), //firefox will throw if it is a proxy object
        messages: toRaw(messages.value),
      },
      {
        onError: (e) => {
          isRunning.value = false
          isPreparing.value = false
          isFailed.value = true

          error.value = handleConnectError(e)
        },
      }
    )
    let onChunkHandler = (c: unknown) => {
      uiMessages.value[uiMessages.value.length - 1].content += c as string
      event.emit('chunk', c)
    }
    textStream.onChunk(onChunkHandler)

    stopFunction = () => {
      stop()
      onChunkHandler = () => { }
    }

    textStream.onChunkComplete(async () => {
      isRunning.value = false
      stopFunction = null

      /*push to messages */
      messages.value.push({ role: 'assistant', content: uiMessages.value[uiMessages.value.length - 1].content })

      /*calc token usage */
      const { inputToken, outputToken } = await newTokenUsage
      const cost = (currentModel.value?.inputTokenPrice ?? 0) * inputToken / 100_0000 + (currentModel.value?.outputTokenPrice ?? 0) * outputToken / 100_0000

      tokenUsage.value = {
        inputToken: tokenUsage.value.inputToken + inputToken,
        outputToken: tokenUsage.value.outputToken + outputToken,
        cost: cost,
        unit: currentModel.value?.priceUnit,
      }
    })
  }

  async function stop() {
    isRunning.value = false
    if (!stopFunction) {
      return
    }
    stopFunction()
    stopFunction = null
  }

  async function resetMessages() {
    await initMessages()
    tokenUsage.value = createEmptyTokenUsage()
    toast({ title: 'reset summary.', variant: 'success' })
  }

  function createEmptyTokenUsage(): TokenUsage {
    return { inputToken: 0, outputToken: 0, cost: 0 }
  }

  return {
    status,
    error,
    uiMessages,
    webpageContent,
    onChunk,
    onPrepareDone: onPrepareDone,
    chat,
    stop,
    refreshSummary,
    currentModel,
    currentPrompt,
    tokenUsage,
    pageTextExtractMethod,
    textContentTrimmer,
    copyMessages,
    resetMessages,
  }
}
