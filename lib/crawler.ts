import { JSDOM } from 'jsdom'

export class Crawler {
  #pages: {
    [key: string]: number
  }

  constructor() {
    this.#pages = {}
  }

  async crawl(baseUrl: string, currentURL: string) {
    const currentUrlObj = new URL(currentURL)
    const baseUrlObj = new URL(baseUrl)

    if (currentUrlObj.hostname !== baseUrlObj.hostname) {
      return this.#pages
    }

    const normalizedURL = this.#normalizeUrl(currentURL)

    if (this.#pages[normalizedURL]) {
      this.#pages[normalizedURL]++
      return this.#pages
    }

    this.#pages[normalizedURL] = 1

    // console.info(`Crawling ${currentURL}`)

    let htmlBody = ''

    try {
      const response = await fetch(currentURL)

      if (response.status >= 400) {
        throw new Error(
          `Status of ${response.status} was not in the acceptable range`
        )
      }

      const contentType = response.headers.get('content-type')

      if (!contentType?.startsWith('text/html')) {
        throw new Error(`Content type of '${contentType}' is not HTML.`)
      }

      htmlBody = await response.text()
    } catch (error: any) {
      // console.error(error.message)
      console.log('AAA')
      return this.#pages
    }

    const nextUrls = this.#getUrls(htmlBody, baseUrl)

    for (const nextUrl of nextUrls) {
      await this.crawl(baseUrl, nextUrl)
    }

    return this.#pages
  }

  #getUrls(htmlBody: string, baseUrl: string) {
    const urls: string[] = []
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')

    for (const link of links) {
      const href = link.getAttribute('href')
      const path = href?.trim()

      if (
        path &&
        path.slice(0, 1) !== '#' &&
        path.slice(0, 7) !== 'mailto:' &&
        path.length
      ) {
        // console.log(path)
        if (path.slice(0, 1) === '/') {
          try {
            urls.push(new URL(path, baseUrl).href)
          } catch (error: any) {
            console.error(`${error.message}: ${path}`)
          }
        } else {
          try {
            urls.push(new URL(path).href)
            console.log(new URL(path).href)
          } catch (error: any) {
            console.error(`${error.message}: ${path}`)
          }
        }
      }
    }

    return urls
  }

  #normalizeUrl(url: string) {
    const urlObj = new URL(url)
    const fullPath = `${urlObj.host}${urlObj.pathname}`

    return fullPath.length && fullPath.slice(-1) === '/'
      ? fullPath.slice(0, -1)
      : fullPath
  }
}
