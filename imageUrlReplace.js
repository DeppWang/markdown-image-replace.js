const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
var content;

const replaceImageUrl = (imageUrl) => {
    axios.get(imageUrl, { responseType: 'stream' })
        .then(function (response) {
            const formData = new FormData();
            formData.append("file", response.data);
            const formHeaders = formData.getHeaders()
            const config = {
                headers: {
                    ...formHeaders
                },
            };
            const postURL = "https://imgkr.com/api/files/upload";
            axios.post(postURL, formData, config)
                .then(function (response) {
                    console.log(response.data.data);
                    // content.replace(imageUrl, response.data.data);
                    console.log(content.replace(imageUrl, response.data.data));
                });
        })
}


function replaceImageUrls() {
    const linkImgReg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)\.(jpg|gif|png)/g;
    const res = content.match(linkImgReg); // 匹配图片地址
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
        filterRes.forEach((val) => {
            replaceImageUrl(val);
        })
    }

}

function mir() {
    console.time("replacetime");
    content = fs.readFileSync('use-github-actions-to-achieve-hexo-blog-auto-deploy.md', 'utf-8');
    replaceImageUrls();
    console.log(console.timeEnd("replacetime"));
}

mir();