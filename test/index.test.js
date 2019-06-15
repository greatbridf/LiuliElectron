import {Selector, RequestMock} from 'testcafe'

fixture `LiuliElectron index`
  .page('../static/index.html')

const header = {
  'access-control-allow-origin': '*'
}

const first_data = {
  code: 200,
  msg: 'OK',
  data: {
    articles: [
      {
        title: 'Test one title',
        description: 'Test one description',
        img: 'https://static.greatbridf.top/img_one',
        link: 'https://www.liuli.in/wp/12345.html'
      },
      {
        title: 'Test two title',
        description: 'Test two description',
        img: 'https://static.greatbridf.top/img_two',
        link: 'https://www.liuli.in/wp/54321.html'
      },
    ],
    magnets: null
  }
}

const second_data = {
  code: 200,
  msg: 'OK',
  data: {
    articles: [
      {
        title: 'Test three title',
        description: 'Test three description',
        img: 'https://static.greatbridf.top/img_three',
        link: 'https://www.liuli.in/wp/98765.html'
      },
      {
        title: 'Test one title',
        description: 'Test one description',
        img: 'https://static.greatbridf.top/img_one',
        link: 'https://www.liuli.in/wp/12345.html'
      },
      {
        title: 'Test two title',
        description: 'Test two description',
        img: 'https://static.greatbridf.top/img_two',
        link: 'https://www.liuli.in/wp/54321.html'
      },
    ],
  }
}

const magnet_data = {
  code: 200,
  msg: 'OK',
  data: {
    magnets: [
      'magnet one',
      'magnet two',
    ],
  }
}

const second_mock = RequestMock()
.onRequestTo(/https:\/\/interface\.greatbridf\.top\/liuli\/articles\/.*/)
.respond(JSON.stringify(second_data), 200, header)
.onRequestTo(/https:\/\/interface\.greatbridf\.top\/liuli\/magnet\/.*/)
.respond(JSON.stringify(magnet_data), 200, header)

test('First load', async t => {
  const first_mock = RequestMock()
  .onRequestTo(/https:\/\/interface\.greatbridf\.top\/liuli\/articles.*/)
  .respond(JSON.stringify(first_data), 200, header)
  .onRequestTo(/https:\/\/interface\.greatbridf\.top\/liuli\/magnet.*/)
  .respond(JSON.stringify(magnet_data), 200, header)

  await t
  .addRequestHooks(first_mock)
  .expect(Selector('h4.card-title').innerText).eql(first_data.data.articles[0].title)
  .expect(Selector('p.card-text').innerText).eql(first_data.data.articles[0].description)
  .expect(Selector('img.card-img-top').getAttribute('src')).eql(first_data.data.articles[0].img)
  // TODO check link
  .click('.btn.btn-info')
  .expect(Selector('div.modal-body a.list-group-item').innerText).eql(magnet_data.data.magnets[0])
})