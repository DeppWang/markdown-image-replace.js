const fs = require('fs');
const path = require('path');
const request = require('request');
const url = require('url');
const FormData = require('form-data');
const axios = require('axios');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


var postOptions = (imageName, imageBuff) => {
    return {
        method: 'POST',
        url: `https://imgkr.com/api/files/upload`,
        headers: {
            contentType: 'multipart/form-data',
        },
        formData: {
            file: {
                value: imageBuff,
                options: {
                    filename: imageName
                }
            },
        }
    };
};


const getNewUrl2 = async (imageUrl) => {

    let response = await axios.get(imageUrl);
    let parsed = url.parse(imageUrl);
    let imageName = path.basename(parsed.pathname);
    const formData = new FormData();
    formData.append("file", Buffer.from(response.data, "utf-8"));
    console.log(formData);
    // const config = {
    //     headers: {
    //         "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
    //     },
    // };
    // const postURL = "https://imgkr.com/api/files/upload";
    // const result = await axios.post(postURL, formData, config);

    var postConfig = postOptions(imageName, new Blob(Buffer.from(response.data, 'utf-8'), { type: 'multipart/form-data' }));

    console.log(postConfig.formData.file);
    const result = await axios(postConfig);
    return result;
}

const getUploadedUrl = function (options) {
    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (body) {
                return resolve(JSON.parse(body).data);
            }
            if (error) {
                return reject(error);
            }
        });
    });
};

const getUploadedUrl2 = (options) =

async function getNewUrl(imageUrl) {
    const parsed = url.parse(imageUrl);
    const imageName = path.basename(parsed.pathname);

    const response = await axios.get(imageUrl);

    const postConfig = postOptions(imageName, Buffer.from(response.data, "utf-8"));
    const newUrl = await getUploadedUrl(postConfig);
    return newUrl;
}

async function replaceImageUrls(content) {
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
        await asyncForEach(filterRes, async (val) => {
            const newUrl = await getNewUrl(val);
            content = content.replace(val, newUrl);
        });
        return content;
    } else {
        return content;
    }
}

async function mir() {
    const content = fs.readFileSync('use-github-actions-to-achieve-hexo-blog-auto-deploy.md', 'utf-8');
    console.log(content);
    content = await replaceImageUrls(content);
    console.log(content);
    // let response = await axios.get('https://deppwang.oss-cn-beijing.aliyuncs.com/blog/2020-02-15-105934.png');
    // console.log(response.data);
}

mir();