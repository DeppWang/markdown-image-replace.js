1. 下载图片到本地

   -  找到所有图片链接存放在 List 中：遍历文章每一行，判断是否有图片链接，并返回图片链接（利用正则表达式）
   - 下载图片到本地
2. 上传图片

   - 上传图片到指定图床，获得指定新图床链接，将原链接和新链接对应，存放在 Map 中
3. 替换文件链接
   - 遍历文章每一行，判断是否有原链接，有就替换。replaceAll(oldPic, newPic); replaceAll 方法先匹配，再执行。



Markdown-image-replacer

- 将指定 markdown 格式的图片链接替换为 Html 格式

哪里可以借鉴：

- 关于如何找到所有的 图片链接？借助 markdown-it 找到所有的图片链接



1. 找到文章的所有链接
2. 输入一个地址，指定图床，替换为一个新的地址
3. 替换文章的所欲链接

