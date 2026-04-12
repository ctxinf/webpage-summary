import { z } from 'zod'

export type PageTextExtractMethod = 'readability' | 'dom-heuristic'
export type WebpageExtractMethod = PageTextExtractMethod | 'selectors'

export type WebpageContent = {
  /**
   * text Content
   */
  textContent?: string,

  /**
   * html-like content for display/debug
   */
  content?: string,

  /**
   * extraction method used for the current page content
   */
  extractMethod?: WebpageExtractMethod,

  /**
   * current input content length used for prompt rendering
   */
  inputTextLength?: number,

  /**
   * @mozilla/readability extracted text length, regardless of active extract method
   */
  readabilityTextLength?: number,


  /**
   * webpage URL
   */
  articleUrl?: string,

  /**
   * @mozilla/readability parsed field: byline
   */
  byline?: string,
  /**
   * @mozilla/readability parsed field: dir
   */
  dir?: string,
  /**
   * @mozilla/readability parsed field: excerpt
   */
  excerpt?: string,
  /**
   * @mozilla/readability parsed field: lang
   */
  lang?: string,
  /**
   * @mozilla/readability parsed field: length
   */
  length?: number,
  /**
   * @mozilla/readability parsed field: publishedTime
   */
  publishedTime?: string,
  /**
   * @mozilla/readability parsed field: siteName
   */
  siteName?: string,

  /**
   * @mozilla/readability parsed field: title
   */
  title?: string
}

export type SummaryInput = WebpageContent & { summaryLanguage: string, currentSelection?: string, currentModel?: string }
export const SummaryInputSchema: z.ZodType<SummaryInput> = z.object({
  textContent: z.string(),
  summaryLanguage: z.string().min(2),
  currentSelection: z.string().optional(),
  currentModel: z.string().optional(),
  extractMethod: z.enum(['readability', 'dom-heuristic', 'selectors']).optional(),
  inputTextLength: z.number().optional(),
  readabilityTextLength: z.number().optional(),
})

export type TokenUsage = {
  inputToken: number,
  outputToken: number,
  cost?: number,
  unit?: string
}

export type InputContentLengthExceededStrategy = 'cut-preserve-front' | 'cut-preserve-end' | 'cut-preserve-middle' | 'nothing'


export type CallbackFunction = (...args: any[]) => any;