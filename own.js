const md = require('markdown-it')()
const mir = require('markdown-img-replacer')
const html = await mir(md, 'Image: ![alt text](https://example.com/image.png)', url => url + '?size=512')
