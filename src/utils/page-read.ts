import { Readability } from "@mozilla/readability";
import { omit } from "radash";


/**
 * use `@mozilla/readability` to get page content
 * @returns u
 */

export function simpleParseRead() {
  const documentClone = document.cloneNode(true);
  const _article = new Readability(documentClone as Document, {}).parse();
  if (!_article) {
    console.warn("article is null.")
    return
  }
  _article.textContent = cleanString(_article.textContent)
  const articleUrl = window.location.href;

  return {
    ..._article,
    articleUrl
  }
  // const author = _article.byline ?? "";
  // const authorLink = getMetaContentByProperty("article:author");
  // const domain = window.location.hostname;
  // console.log(articleUrl, author, authorLink, domain)
  // console.log(_article.title)
  // console.log(_article.content)
  // let showText=''

}


/**
 * get page content from selectors
 * @param selectors - CSS选择器字符串数组（普通模式下直接搜索，Shadow DOM 模式下作为宿主元素选择器）
 * @param options - 可选配置
 * @param options.useShadowRoot - 是否在 Shadow DOM 中搜索
 * @param options.shadowRootSelectors - 在 shadowRoot 内部搜索的选择器
 * @returns 所有去重文本用句号连接的字符串
 * 
 * @example
 * // 普通模式：直接在 document 中搜索
 * textsBySelectors(['.article-content', '#main-text'])
 * 
 * @example
 * // Shadow DOM 模式：先找宿主元素，再在其 shadowRoot 中搜索
 * // 等效于: document.querySelector('#app > div').shadowRoot.querySelector('#content')
 * textsBySelectors(['#app > div'], { useShadowRoot: true, shadowRootSelectors: ['#content'] })
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

  // Shadow DOM 模式：selectors 作为宿主选择器，shadowRootSelectors 在 shadowRoot 内搜索
  if (options?.useShadowRoot && options?.shadowRootSelectors?.length) {
    for (const hostSelector of selectors) {
      try {
        const hostElements = document.querySelectorAll(hostSelector);

        hostElements.forEach(host => {
          if (host.shadowRoot) {
            // 在该宿主的 shadowRoot 中搜索 shadowRootSelectors
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
              } catch (error) {
                console.warn(`Invalid shadow root selector: ${shadowSelector}`);
              }
            }
          }
        });
      } catch (error) {
        console.warn(`Invalid host selector: ${hostSelector}`);
      }
    }
  } else {
    // 普通模式：直接在 document 中搜索 selectors
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
      } catch (error) {
        console.warn(`Invalid selector: ${selector}`);
      }
    }
  }

  const textContent = uniqueTexts.map(t => `<p>${cleanString(t)}</p>`).join('\n');
  const content = textContent;
  const articleUrl = window.location.href;
  const title = document.title || '';
  const length = textContent.length;
  const excerpt = '';
  const byline = '';
  const dir = document.dir || '';
  const siteName = (document.querySelector('meta[property="og:site_name"]') as HTMLMetaElement)?.content || window.location.hostname;
  const lang = document.documentElement.lang || '';
  const publishedTime =
    (document.querySelector('meta[property="article:published_time"]') as HTMLMetaElement)?.content || '';

  return {
    articleUrl,
    title,
    content,
    textContent,
    length,
    excerpt,
    byline,
    dir,
    siteName,
    lang,
    publishedTime,
  };
}





/**
 * 将连续的\n ' '替换为单个
 * @param input 
 * @returns 
 */
export function cleanString(input: string): string {
  return input.replace(/(\n+\s+\n)|(\s{2,})/g, match => {
    if (match.includes('\n')) {
      return '\n';
    }
    return ' ';
  });
}