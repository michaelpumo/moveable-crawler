import { Crawler } from './dist/moveable-crawler.js'

const startUrl = 'https://greggs.co.uk'
const crawler = new Crawler()
const pages = await crawler.crawl(startUrl, startUrl)

console.log(pages)
