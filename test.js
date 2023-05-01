import { Crawler } from './dist/moveable-crawler.js'

const startUrl = 'https://michaelpumo.com'
const crawler = new Crawler()
const pages = await crawler.crawl(startUrl, startUrl)

console.log(pages)
