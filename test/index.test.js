import {Selector} from 'testcafe'
import fetch from 'node-fetch'

fixture `LiuliElectron index`
  .page('../static/index.html')

var page_one

function get_article_id(link) {
  var regexp = /.*\/wp\/(.*).html/
  return regexp.test(link) ? regexp.exec(link)[1] : ''
}

test('Check first load', async t => {
  var json = fetch('https://interface.greatbridf.top/liuli/articles?page=1').then((resp)=>resp.json())
  page_one = (await json).data.articles
  var title = Selector('h4.card-title')
  var descr = Selector('p.card-text')
  var img = Selector('img.card-img-top')
  var list = Selector('.hacg-block .list-group-item-action')

  for (var i = 0; i < await list.count - 1; ++i) {
    await t
    .click(list.nth(i))
    .expect(title.textContent).eql(page_one[i].title)
    .expect(descr.textContent).eql(page_one[i].description)
    .expect(img.getAttribute('src')).eql(page_one[i].img)
  }
})

test('Check magnet link', async t => {
  var link = `https://interface.greatbridf.top/liuli/magnet?id=${get_article_id(page_one[0].link)}`
  var tmp = await fetch(link).then(resp=>resp.json())
  var server_links = tmp.data.magnets

  await t.click(Selector('.btn.btn-info'))

  var shown_links = Selector('#magnet .list-group-item')
  for (var i = 0; i < await shown_links.count; ++i) {
    await t
    .expect(shown_links.nth(i).innerText).eql(server_links[i])
  }
})