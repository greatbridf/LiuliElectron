import Config from 'src/config'
import { LiuliData } from './liuli';

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

function save_liuli_data(data: LiuliData): void {
  localStorage.setItem('liuli_data', JSON.stringify(data))
}

function load_liuli_data(): LiuliData|null {
  var json = localStorage.getItem('liuli_data')
  if (json) {
    return JSON.parse(json) as LiuliData
  } else {
    return null
  }
}

export {
  get_article_id,
  get_article_link,
  Article,
  save_liuli_data,
  load_liuli_data,
}
