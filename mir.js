const fs = require('fs');
const path = require('path');
const request = require('request');
const url = require('url');
const MarkdownIt = require('markdown-it')();

function imageUrls(tokens, urls) {
  // For every token
  tokens.map((token) => {
    // fuse replacer for tokens with the image type

    if (token.type === 'image') {
      let imageUrl = token.attrGet('src');

      // If the token has an image URL, replace it
      if (imageUrl) {
        urls.push(imageUrl);
      }
    }

    // travel down the tree: find & replace all URLs of the token's children as well
    if (token.children) {
      imageUrls(token.children, urls);
    }
  });
}

async function replaceImageUrls(content) {
  const linkImgReg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)\.(jpg|gif|png)/g;
  const res = content.match(linkImgReg); // 匹配到图片、链接和脚注
  if (res === null) {
    return content;
  }

  const filterRes = res.filter((val) => {

    if (val.indexOf('mmbiz.qpic.cn') > 0 || val.indexOf('imgkr.cn-bj.ufileos.com') > 0) {
      return false;
    }
    return true;
  }); // 过滤掉微信和图壳的图片地址

  if (filterRes.length > 0) {
    await asyncForEach(filterRes, async (val) => {
      let newUrl = await getNewUrl(val);
      content = content.replace(val, newUrl);
    });
    return content;
  } else {
    return content;
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function test() {

  const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
  const start = async () => {
    await asyncForEach([1, 2, 3], async (num) => {
      await waitFor(50);
      console.log(num);
    });
    console.log('Done');
  }
  start();
}

const getImageBuffer = function (options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, buffer) => {
      if (buffer) {
        return resolve(buffer);
      }
      if (error) {
        console.log("图片网址错误：请检查！ " + error); // 网址错误，跳过当前替换
        return -1;
      }
    });
  });
};

const postOptions = (imageName, imageBuff) => {
  return {
    method: 'POST',
    url: `https://imgkr.com/api/files/upload`,
    headers: {
      contentType: 'multipart/form-data',
    },
    formData: {
      file: {
        value: imageBuff,
        option: {
          filename: imageName
        }
      },
    }
  };
};

const getUploadedUrl = function (options) {
  return new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (body) {
        return resolve(JSON.parse(body).data);
      }
      if (error) {
        console.log(error);
      }
    });
  });
};

async function getNewUrl(imageUrl) {
  let parsed = url.parse(imageUrl);
  let imageName = path.basename(parsed.pathname);
  const options = {
    url: 'https://cors-anywhere.herokuapp.com/' + imageUrl,
    encoding: null
  };
  let imageBuffer = await getImageBuffer(options);
  if (imageBuffer === -1) {
    return false;
  }
  const postConfig = postOptions(imageName, imageBuffer);
  let newUrl = await getUploadedUrl(postConfig);
  return newUrl;
}
/**
 * Replaces image URLs in a markdown string.
 *
 * @param {MarkdownIt} markdown_it A markdownit instance, tailored to your project.
 * @param {string} markdown The markdown string to replace the images of.
 * @param {(url: string) => string | Promise<string>} replacer Called for every
 * image in the markdown string. The URL is replaced with the returned string.
 *
 * @returns {Promise<string>} The modified markdown in HTML format.
 */
async function mir() {

  let content = fs.readFileSync('use-github-actions-to-achieve-hexo-blog-auto-deploy.md', 'utf-8');
  // const parsed = MarkdownIt.parse(content, { references: {} });
  // let urls = [];
  // imageUrls(parsed, urls);
  // console.log(urls);
  // console.log(urls.length);


  content = await replaceImageUrls(content);
  console.log(content);

  // test();

  // let newUrl = await getNewUrl('https://deppng.oss-cn-beijing.aliyuncs.com/blog/2020-02-17-084920.png');
  // console.log(newUrl);
}

mir();

module.exports = mir;


