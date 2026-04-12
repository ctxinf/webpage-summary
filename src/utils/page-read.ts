import { Readability } from "@mozilla/readability";
import type { PageTextExtractMethod, WebpageContent, WebpageExtractMethod } from "../types/summary";

const CONTENT_HINT_RE = /article|content|entry|main|markdown|post|prose|readme|doc|documentation|story|text|body/i;
const NOISE_HINT_RE = /comment|footer|header|menu|nav|related|share|sidebar|subscribe|toolbar|breadcrumb|toc|search|banner|cookie/i;
const SEMANTIC_CANDIDATE_SELECTOR = [
  "article",
  "main",
  '[role="main"]',
  '[itemprop="articleBody"]',
  '[data-testid*="article"]',
  '[data-testid*="content"]',
  '[class*="article"]',
  '[class*="content"]',
  '[class*="markdown"]',
  '[class*="prose"]',
  '[class*="documentation"]',
  '[id*="article"]',
  '[id*="content"]',
  '[id*="main"]',
].join(", ");
const NOISE_SELECTOR = [
  "script",
  "style",
  "noscript",
  "template",
  "svg",
  "canvas",
  "header",
  "footer",
  "nav",
  "form",
  "dialog",
  "button",
  '[role="navigation"]',
  '[aria-hidden="true"]',
  '[hidden]',
  ".sr-only",
  ".visually-hidden",
].join(", ");
const CANDIDATE_TAGS = new Set(["ARTICLE", "MAIN", "SECTION", "DIV"]);

function getBaseMetadata(): Omit<WebpageContent, "textContent" | "content" | "length" | "excerpt" | "extractMethod"> {
  return {
    articleUrl: window.location.href,
    title: document.title || '',
    byline: '',
    dir: document.dir || '',
    siteName: (document.querySelector('meta[property="og:site_name"]') as HTMLMetaElement)?.content || window.location.hostname,
    lang: document.documentElement.lang || '',
    publishedTime:
      (document.querySelector('meta[property="article:published_time"]') as HTMLMetaElement)?.content || '',
  };
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function textContentToHtml(textContent: string) {
  return textContent
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => `<p>${escapeHtml(line)}</p>`)
    .join('\n');
}

function toWebpageContent(textContent: string, extractMethod: WebpageExtractMethod, overrides: Partial<WebpageContent> = {}): WebpageContent {
  const normalizedText = cleanString(textContent).trim();
  const readabilityTextLength = overrides.readabilityTextLength ?? normalizedText.length;

  return {
    ...getBaseMetadata(),
    content: textContentToHtml(normalizedText),
    textContent: normalizedText,
    length: normalizedText.length,
    inputTextLength: normalizedText.length,
    readabilityTextLength,
    excerpt: normalizedText.slice(0, 280),
    extractMethod,
    ...overrides,
  };
}

function getReadabilityArticle() {
  const documentClone = document.cloneNode(true);
  return new Readability(documentClone as Document, {}).parse();
}

function getElementText(element: Element) {
  const rawText = (element as HTMLElement).innerText || element.textContent || '';
  return cleanString(rawText).trim();
}

function isNoiseElement(element: HTMLElement) {
  if (element.matches(NOISE_SELECTOR)) {
    return true;
  }

  const hintText = `${element.id} ${element.className}`;
  return NOISE_HINT_RE.test(hintText) && !CONTENT_HINT_RE.test(hintText);
}

function isCandidateElement(element: HTMLElement) {
  if (isNoiseElement(element) || element.childElementCount === 0) {
    return false;
  }

  const textLength = getElementText(element).length;
  if (textLength < 280) {
    return false;
  }

  const blockCount = element.querySelectorAll('p, li, pre, blockquote').length;
  return blockCount >= 2 || textLength >= 700;
}

function collectCandidateElements() {
  const body = document.body;
  if (!body) {
    return [] as HTMLElement[];
  }

  const candidates = new Set<HTMLElement>();

  document.querySelectorAll<HTMLElement>(SEMANTIC_CANDIDATE_SELECTOR).forEach(element => {
    if (isCandidateElement(element)) {
      candidates.add(element);
    }
  });

  const walker = document.createTreeWalker(body, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (!(node instanceof HTMLElement)) {
        return NodeFilter.FILTER_SKIP;
      }
      if (isNoiseElement(node)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (!CANDIDATE_TAGS.has(node.tagName)) {
        return NodeFilter.FILTER_SKIP;
      }
      return isCandidateElement(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });

  while (walker.nextNode()) {
    candidates.add(walker.currentNode as HTMLElement);
  }

  return Array.from(candidates);
}

type CandidateMetrics = {
  textLength: number;
  paragraphCount: number;
  listItemCount: number;
  headingCount: number;
  calloutCount: number;
  linkTextLength: number;
  interactiveCount: number;
  hintText: string;
  bodyShare: number;
  headingToParagraphRatio: number;
  isSemanticRoot: boolean;
};

function getCandidateMetrics(element: HTMLElement, bodyTextLength: number): CandidateMetrics {
  const textLength = getElementText(element).length;
  const paragraphCount = element.querySelectorAll('p').length;
  const listItemCount = element.querySelectorAll('li').length;
  const headingCount = element.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
  const calloutCount = element.querySelectorAll('aside, blockquote, [role="note"], [data-callout], [class*="callout"], [class*="notice"], [class*="important"]').length;
  const linkTextLength = Array.from(element.querySelectorAll('a')).reduce((total, link) => total + getElementText(link).length, 0);
  const interactiveCount = element.querySelectorAll('button, input, select, textarea, [role="button"]').length;
  const hintText = `${element.id} ${element.className}`;
  const bodyShare = bodyTextLength > 0 ? textLength / bodyTextLength : 0;

  return {
    textLength,
    paragraphCount,
    listItemCount,
    headingCount,
    calloutCount,
    linkTextLength,
    interactiveCount,
    hintText,
    bodyShare,
    headingToParagraphRatio: headingCount / Math.max(paragraphCount, 1),
    isSemanticRoot: element.matches('article, main, [role="main"], [itemprop="articleBody"]'),
  };
}

function isHeadingHeavyComposite(metrics: CandidateMetrics) {
  return metrics.paragraphCount >= 5 && metrics.headingCount >= 4 && metrics.headingToParagraphRatio > 0.4;
}

function scoreCandidate(element: HTMLElement, bodyTextLength: number) {
  const metrics = getCandidateMetrics(element, bodyTextLength);
  const {
    textLength,
    paragraphCount,
    listItemCount,
    headingCount,
    calloutCount,
    linkTextLength,
    interactiveCount,
    hintText,
    bodyShare,
    isSemanticRoot,
  } = metrics;

  if (textLength < 280) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = textLength;
  score += paragraphCount * 140;
  score += Math.min(listItemCount, 30) * 35;
  score += Math.min(headingCount, 12) * 50;
  score += Math.min(calloutCount, 8) * 90;

  if (element.matches('article')) {
    score += 260;
  }
  if (element.matches('main, [role="main"], [itemprop="articleBody"]')) {
    score += 220;
  }
  if (CONTENT_HINT_RE.test(hintText)) {
    score += 180;
  }
  if (NOISE_HINT_RE.test(hintText)) {
    score -= 260;
  }

  const linkDensity = textLength === 0 ? 1 : linkTextLength / textLength;
  score -= linkDensity * 1200;
  score -= interactiveCount * 25;

  if (bodyShare > 0.92) {
    score -= isSemanticRoot ? 900 : 1200;
  } else if (bodyShare > 0.85 && !isSemanticRoot) {
    score -= 1000;
  }

  if (isHeadingHeavyComposite(metrics)) {
    score -= 450;
  }

  if (paragraphCount === 0 && listItemCount === 0) {
    score -= 250;
  }

  return score;
}

/**
 * use `@mozilla/readability` to get page content
 */
export function simpleParseRead() {
  const article = getReadabilityArticle();
  if (!article) {
    console.warn("article is null.")
    return
  }

  return toWebpageContent(article.textContent, 'readability', {
    ...article,
    content: article.content,
    inputTextLength: article.textContent.length,
    readabilityTextLength: article.textContent.length,
    byline: article.byline,
    dir: article.dir,
    excerpt: article.excerpt,
    lang: article.lang,
    publishedTime: article.publishedTime,
    siteName: article.siteName,
    title: article.title,
  })
}

export function domHeuristicParseRead() {
  const readabilityArticle = getReadabilityArticle();
  const readabilityTextLength = readabilityArticle?.textContent
    ? cleanString(readabilityArticle.textContent).trim().length
    : undefined;
  const body = document.body;
  if (!body) {
    return toWebpageContent('', 'dom-heuristic', {
      readabilityTextLength,
    });
  }

  const bodyText = getElementText(body);
  const bestCandidate = collectCandidateElements()
    .map(element => ({ element, score: scoreCandidate(element, bodyText.length) }))
    .sort((left, right) => right.score - left.score)[0];

  const bestText = bestCandidate ? getElementText(bestCandidate.element) : '';
  if (bestText) {
    return toWebpageContent(bestText, 'dom-heuristic', {
      readabilityTextLength,
    });
  }

  return toWebpageContent(bodyText, 'dom-heuristic', {
    readabilityTextLength,
  });
}

export function parsePageContent(extractMethod: PageTextExtractMethod = 'readability') {
  switch (extractMethod) {
    case 'dom-heuristic':
      return domHeuristicParseRead();
    case 'readability':
    default:
      return simpleParseRead();
  }
}

/**
 * get page content from selectors
 * @param selectors - CSS选择器字符串数组（普通模式下直接搜索，Shadow DOM 模式下作为宿主元素选择器）
 * @param options - 可选配置
 * @param options.useShadowRoot - 是否在 Shadow DOM 中搜索
 * @param options.shadowRootSelectors - 在 shadowRoot 内部搜索的选择器
 * @returns 所有去重文本用句号连接的字符串
 */
export function textsBySelectors(
  selectors: string[],
  options?: {
    useShadowRoot?: boolean;
    shadowRootSelectors?: string[];
  }
) {
  if (!selectors.length) return '';

  const processedElements = new Set<Element>();
  const uniqueTexts: string[] = [];

  if (options?.useShadowRoot && options?.shadowRootSelectors?.length) {
    for (const hostSelector of selectors) {
      try {
        const hostElements = document.querySelectorAll(hostSelector);

        hostElements.forEach(host => {
          if (host.shadowRoot) {
            for (const shadowSelector of options.shadowRootSelectors!) {
              try {
                const elements = host.shadowRoot.querySelectorAll(shadowSelector);

                elements.forEach(el => {
                  if (!processedElements.has(el)) {
                    processedElements.add(el);
                    const text = el.textContent?.trim();
                    if (text && text.length > 0) {
                      uniqueTexts.push(text);
                    }
                  }
                });
              } catch (_error) {
                console.warn(`Invalid shadow root selector: ${shadowSelector}`);
              }
            }
          }
        });
      } catch (_error) {
        console.warn(`Invalid host selector: ${hostSelector}`);
      }
    }
  } else {
    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);

        elements.forEach(el => {
          if (!processedElements.has(el)) {
            processedElements.add(el);
            const text = el.textContent?.trim();
            if (text && text.length > 0) {
              uniqueTexts.push(text);
            }
          }
        });
      } catch (_error) {
        console.warn(`Invalid selector: ${selector}`);
      }
    }
  }

  const textContent = uniqueTexts.map(text => cleanString(text)).join('\n');

  return toWebpageContent(textContent, 'selectors');
}

export function cleanString(input: string): string {
  return input
    .replaceAll('\r', '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n[ \t]+\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map(line => line.trim())
    .join('\n');
}