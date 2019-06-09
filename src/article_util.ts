import Config from 'src/config'

const config = new Config()

interface Article {
  link: string
  img: string
  title: string
  description: string
  id?: string
}

function get_article_id(link: string): string {
  let regexp = /wp\/([0-9]*)\.html/
  return regexp.test(link) ? regexp.exec(link)![1] : ''
}

function get_article_link(link: string): string {
  var id = get_article_id(link)
  return id ? `${config.cdn_addr}/liuli/content?id=${id}` : ''
}

export {get_article_id, get_article_link, Article}