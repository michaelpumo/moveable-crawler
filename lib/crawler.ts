import { IElement, Window } from 'happy-dom'

export class Crawler {
  #baseUrl: string
  #links: string[]

  constructor(url: string) {
    this.#baseUrl = this.#normalise(url)
    this.#links = []
  }

  #normalise(url: string) {
    const { hostname, pathname } = new URL(url)
    const full = `${hostname}${pathname}`

    return full.length && full.slice(-1) === '/' ? full.slice(0, -1) : full
  }

  async crawlPage(currentUrl: string) {
    console.log(`Crawling: ${currentUrl}`)

    try {
      const response = await fetch(currentUrl)

      if (response.status >= 400) {
        throw new Error(
          `Status of ${response.status} was not in the acceptable range`
        )
      }

      const contentType = response.headers.get('content-type')

      if (!contentType?.startsWith('text/html')) {
        throw new Error(`Content type of '${contentType}' is not HTML.`)
      }

      const html = await response.text()
      this.getUrls(html)
    } catch (error: any) {
      console.log(`${error.name}: ${error.message}`)
    }
  }

  getUrls(documentHtml: string) {
    const window = new Window()
    const document = window.document

    document.body.innerHTML = `${documentHtml}`

    console.log(document)

    const links: IElement[] = [...document.querySelectorAll('a')]

    console.log(this.#baseUrl, this.#links)

    for (const link of links) {
      // const { href } = link
      // console.log(href)
      console.log(link.getAttribute('href'))

      // if (link.startsWith('/')) {
      //   this.#links.push(`${this.#baseUrl}${link.href}`)
      // } else {
      //   this.#links.push(link.href)
      // }
    }
  }
}
