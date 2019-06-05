import Config from './config'

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
  return regexp.exec(link)![1]
}

function get_article_link(link: string): string {
  return `${config.cdn_addr}/liuli/content?id=${get_article_id(link)}`;
}

export {get_article_id, get_article_link, Article}