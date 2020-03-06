const replaceImageUrls = require('./replaceImageUrls');
const fs = require('fs');

function mir() {
    let content = fs.readFileSync('use-github-actions-to-achieve-hexo-blog-auto-deploy.md', 'utf-8');
    replaceImageUrls(content);
}
