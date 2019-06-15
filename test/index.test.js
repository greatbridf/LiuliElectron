import {Selector} from 'testcafe'
import fetch from 'node-fetch'

fixture `LiuliElectron index`
  .page('../static/index.html')

var page_one

test('First load', async t => {
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