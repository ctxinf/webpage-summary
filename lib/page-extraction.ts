import { Readability } from '@mozilla/readability';
import type { PageTextExtractMethod } from '@/constants/page-extraction';
import { createLogger } from '@/lib/logger';

const logger = createLogger('lib:page-extraction');

import {
  findMatchingCustomization,
  loadSiteCustomization,
} from '@/lib/site-rules-storage';

export {
  PAGE_TEXT_EXTRACT_METHODS,
  isPageTextExtractMethod,
} from '@/constants/page-extraction';
export type { PageTextExtractMethod } from '@/constants/page-extraction';
export type WebpageExtractMethod = PageTextExtractMethod | 'selectors';

export type WebpageContent = {
  articleUrl: string;
  byline: string;
  content: string;
  dir: string;
  excerpt: string;
  extractMethod: WebpageExtractMethod;
  inputTextLength: number;
  lang: string;
  length: number;
  publishedTime: string;
  readabilityTextLength?: number;
  siteName: string;
  textContent: string;
  title: string;
};

const CONTENT_HINT_RE =
  /article|content|entry|main|markdown|post|prose|readme|doc|documentation|story|text|body/i;
const NOISE_HINT_RE =
  /comment|footer|header|menu|nav|related|share|sidebar|subscribe|toolbar|breadcrumb|toc|search|banner|cookie/i;
const SEMANTIC_CANDIDATE_SELECTOR = [
  'article',
  'main',
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
].join(', ');
const NOISE_SELECTOR = [
  'script',
  'style',
  'noscript',
  'template',
  'svg',
  'canvas',
  'header',
  'footer',
  'nav',
  'form',
  'dialog',
  'button',
  '[role="navigation"]',
  '[aria-hidden="true"]',
  '[hidden]',
  '.sr-only',
  '.visually-hidden',
].join(', ');
const CANDIDATE_TAGS = new Set(['ARTICLE', 'MAIN', 'SECTION', 'DIV']);

type CandidateMetrics = {
  bodyShare: number;
  calloutCount: number;
  headingCount: number;
  headingToParagraphRatio: number;
  hintText: string;
  interactiveCount: number;
  isSemanticRoot: boolean;
  linkTextLength: number;
  listItemCount: number;
  paragraphCount: number;
  textLength: number;
};

export function cleanExtractedText(input: string) {
  return input
    .replaceAll('\r', '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n[ \t]+\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
}

function getMetaContent(sourceDocument: Document, property: string) {
  return (
    sourceDocument.querySelector<HTMLMetaElement>(
      `meta[property="${property}"]`,
    )?.content ?? ''
  );
}

function getBaseMetadata(sourceDocument: Document) {
  return {
    articleUrl: sourceDocument.location?.href ?? location.href,
    byline: '',
    dir: sourceDocument.dir || '',
    lang: sourceDocument.documentElement.lang || '',
    publishedTime: getMetaContent(sourceDocument, 'article:published_time'),
    siteName:
      getMetaContent(sourceDocument, 'og:site_name') ||
      sourceDocument.location?.hostname ||
      location.hostname,
    title: sourceDocument.title || '',
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
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('\n');
}

function toWebpageContent(
  sourceDocument: Document,
  textContent: string,
  extractMethod: WebpageExtractMethod,
  overrides: Partial<WebpageContent> = {},
): WebpageContent {
  const normalizedText = cleanExtractedText(textContent);
  const readabilityTextLength =
    overrides.readabilityTextLength ?? normalizedText.length;

  return {
    ...getBaseMetadata(sourceDocument),
    content: textContentToHtml(normalizedText),
    excerpt: normalizedText.slice(0, 280),
    extractMethod,
    inputTextLength: normalizedText.length,
    length: normalizedText.length,
    readabilityTextLength,
    textContent: normalizedText,
    ...overrides,
  };
}

function getReadabilityArticle(sourceDocument: Document) {
  const documentClone = sourceDocument.cloneNode(true);
  return new Readability(documentClone as Document).parse();
}

function getElementText(element: Element) {
  const rawText = (element as HTMLElement).innerText || element.textContent || '';
  return cleanExtractedText(rawText);
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

  const blockCount = element.querySelectorAll(
    'p, li, pre, blockquote',
  ).length;
  return blockCount >= 2 || textLength >= 700;
}

function collectCandidateElements(sourceDocument: Document) {
  const body = sourceDocument.body;
  if (!body) {
    return [] as HTMLElement[];
  }

  const candidates = new Set<HTMLElement>();

  sourceDocument
    .querySelectorAll<HTMLElement>(SEMANTIC_CANDIDATE_SELECTOR)
    .forEach((element) => {
      if (isCandidateElement(element)) {
        candidates.add(element);
      }
    });

  const walker = sourceDocument.createTreeWalker(body, NodeFilter.SHOW_ELEMENT, {
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
      return isCandidateElement(node)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  });

  while (walker.nextNode()) {
    candidates.add(walker.currentNode as HTMLElement);
  }

  return Array.from(candidates);
}

function getCandidateMetrics(
  element: HTMLElement,
  bodyTextLength: number,
): CandidateMetrics {
  const textLength = getElementText(element).length;
  const paragraphCount = element.querySelectorAll('p').length;
  const listItemCount = element.querySelectorAll('li').length;
  const headingCount = element.querySelectorAll(
    'h1, h2, h3, h4, h5, h6',
  ).length;
  const calloutCount = element.querySelectorAll(
    'aside, blockquote, [role="note"], [data-callout], [class*="callout"], [class*="notice"], [class*="important"]',
  ).length;
  const linkTextLength = Array.from(element.querySelectorAll('a')).reduce(
    (total, link) => total + getElementText(link).length,
    0,
  );
  const interactiveCount = element.querySelectorAll(
    'button, input, select, textarea, [role="button"]',
  ).length;
  const hintText = `${element.id} ${element.className}`;
  const bodyShare = bodyTextLength > 0 ? textLength / bodyTextLength : 0;

  return {
    bodyShare,
    calloutCount,
    headingCount,
    headingToParagraphRatio: headingCount / Math.max(paragraphCount, 1),
    hintText,
    interactiveCount,
    isSemanticRoot: element.matches(
      'article, main, [role="main"], [itemprop="articleBody"]',
    ),
    linkTextLength,
    listItemCount,
    paragraphCount,
    textLength,
  };
}

function isHeadingHeavyComposite(metrics: CandidateMetrics) {
  return (
    metrics.paragraphCount >= 5 &&
    metrics.headingCount >= 4 &&
    metrics.headingToParagraphRatio > 0.4
  );
}

function scoreCandidate(element: HTMLElement, bodyTextLength: number) {
  const metrics = getCandidateMetrics(element, bodyTextLength);
  const {
    bodyShare,
    calloutCount,
    headingCount,
    hintText,
    interactiveCount,
    isSemanticRoot,
    linkTextLength,
    listItemCount,
    paragraphCount,
    textLength,
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

export function readabilityParseRead(sourceDocument: Document = document) {
  const article = getReadabilityArticle(sourceDocument);
  const articleTextContent = article?.textContent ?? '';

  if (!article || !articleTextContent) {
    return undefined;
  }

  return toWebpageContent(sourceDocument, articleTextContent, 'readability', {
    byline: article.byline || '',
    content: article.content || '',
    dir: article.dir || '',
    excerpt: article.excerpt || '',
    inputTextLength: articleTextContent.length,
    lang: article.lang || '',
    publishedTime: article.publishedTime || '',
    readabilityTextLength: articleTextContent.length,
    siteName: article.siteName || getBaseMetadata(sourceDocument).siteName,
    title: article.title || getBaseMetadata(sourceDocument).title,
  });
}

export function domHeuristicParseRead(sourceDocument: Document = document) {
  const readabilityArticle = getReadabilityArticle(sourceDocument);
  const readabilityTextLength = readabilityArticle?.textContent
    ? cleanExtractedText(readabilityArticle.textContent).length
    : undefined;
  const body = sourceDocument.body;

  if (!body) {
    return toWebpageContent(sourceDocument, '', 'dom-heuristic', {
      readabilityTextLength,
    });
  }

  const bodyText = getElementText(body);
  const bestCandidate = collectCandidateElements(sourceDocument)
    .map((element) => ({
      element,
      score: scoreCandidate(element, bodyText.length),
    }))
    .sort((left, right) => right.score - left.score)[0];
  const bestText = bestCandidate ? getElementText(bestCandidate.element) : '';

  return toWebpageContent(
    sourceDocument,
    bestText || bodyText,
    'dom-heuristic',
    { readabilityTextLength },
  );
}

export function parsePageContent(
  extractMethod: PageTextExtractMethod = 'readability',
  sourceDocument: Document = document,
) {
  switch (extractMethod) {
    case 'dom-heuristic':
      return domHeuristicParseRead(sourceDocument);
    case 'readability':
    default:
      return readabilityParseRead(sourceDocument);
  }
}

/**
 * Extract page content honoring user-configured site customization rules.
 *
 * If the current URL matches a customization rule's pattern, content is
 * pulled from the rule's CSS selectors (with optional Shadow DOM drill-down).
 * Otherwise falls back to the user's chosen extraction method.
 */
export async function extractWebpageContent(
  extractMethod: PageTextExtractMethod = 'readability',
  sourceDocument: Document = document,
): Promise<WebpageContent | undefined> {
  const customizations = await loadSiteCustomization();
  const url = sourceDocument.location ?? location;
  const matchedRule = findMatchingCustomization(url, customizations);
  // logger.debug('site custom:',url,matchedRule)s

  if (matchedRule) {
    return textsBySelectors(
      matchedRule.selectors,
      {
        shadowRootSelectors: matchedRule.shadowRootSelectors,
        useShadowRoot: matchedRule.useShadowRoot,
      },
      sourceDocument,
    );
  }
  return parsePageContent(extractMethod, sourceDocument);
}

export function textsBySelectors(
  selectors: string[],
  options: {
    shadowRootSelectors?: string[];
    useShadowRoot?: boolean;
  } = {},
  sourceDocument: Document = document,
) {
  if (!selectors.length) {
    return toWebpageContent(sourceDocument, '', 'selectors');
  }

  const processedElements = new Set<Element>();
  const uniqueTexts: string[] = [];

  function collectText(element: Element) {
    if (processedElements.has(element)) {
      return;
    }

    processedElements.add(element);
    const text = getElementText(element);
    if (text) {
      uniqueTexts.push(text);
    }
  }

  for (const selector of selectors) {
    try {
      if (options.useShadowRoot && options.shadowRootSelectors?.length) {
        sourceDocument.querySelectorAll(selector).forEach((host) => {
          for (const shadowSelector of options.shadowRootSelectors ?? []) {
            try {
              host.shadowRoot
                ?.querySelectorAll(shadowSelector)
                .forEach(collectText);
            } catch {
              logger.warn(`Invalid shadow root selector: ${shadowSelector}`);
            }
          }
        });
      } else {
        sourceDocument.querySelectorAll(selector).forEach(collectText);
      }
    } catch {
      logger.warn(`Invalid selector: ${selector}`);
    }
  }

  return toWebpageContent(sourceDocument, uniqueTexts.join('\n'), 'selectors');
}
