/**
 * 将本地Markdown文件创建或者更新到github issues中
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { createIssue, updateIssue, getIssuesTitleMap } = require('./libs/issues');
const { getLabelsNameSet } = require('./libs/labels');
const { GithubRepoBlog } = require('./constant');

// 从指定时间开始format: YYYY-MM-DDTHH:MM:SSZ.
const SinceDate = '2016-02-04T12:00:00';


/**
 * 获取待提交的文章路径列表
 * 该函数会读取'file_list_to_commit.txt'文件，文件中每一行记录了一个文章的相对路径，
 * 并检查这些文件是否存在。最后返回一个包含所有存在文章路径的数组。
 *
 * @returns {Promise<Array<string>>} 返回一个Promise，该Promise解析为一个包含所有有效文章路径的数组。
 */
function getArticles() {
  return new Promise(function (resolve) {

    // 计算提交文件列表文件的绝对路径
    const commitFile = path.join(process.cwd(), 'file_list_to_commit.txt');
    // 初始化文章路径列表
    const articlePaths = [];

    // 创建读取流来读取提交文件列表
    const readStream = fs.createReadStream(commitFile);
    const rl = readline.createInterface({
      input: readStream,
      output: process.stdout,
      terminal: false
    });

    // 对读取的每一行进行处理
    rl.on('line', (line) => {
      // 尝试匹配行中的文章路径
      const matched = /source\/_posts\/(.+\.md)$/.exec(line)
      // 如果匹配成功，则处理该路径
      if (matched && matched.length) {
        // 计算文章的绝对路径
        const filePath = path.join(process.cwd(), 'source', '_posts', matched[1]);
        // 检查文件是否存在
        const dirStat = fs.statSync(filePath);
        if (dirStat.isFile()) {
          // 如果文件存在，则加入到文章路径列表中
          articlePaths.push(filePath);
        } else {
          // 如果文件不存在，则打印错误信息
          console.log(`文件不存在: ${filePath}`);
        }
      }
    });

    // 当读取流关闭时，打印文章路径列表并解析Promise
    rl.on('close', async () => {
      console.log('文件读取完毕，提交的文章列表: ', articlePaths);
      resolve(articlePaths);
    });
  })
}

/**
 * 生成文章列表
 * @param {Array} articlePaths - 文章路径数组
 * @param {Set} labelSet - 标签集合，用于筛选文章标签
 * @returns {Array} 按时间排序的文章列表对象数组
 */
async function generateArticles(articlePaths, labelSet) {
  const articles = [];
  for (const articlePath of articlePaths) {
    // 读取文章内容
    let article = await fs.readFileSync(articlePath, "utf-8");
    let title;
    let date;
    let tags;
    const apiOptions = { labels: ['blog'] };

    // 解析文章头部信息（标题、标签、日期）
    const labelMatched = /^---([\d\D]*?)---/.exec(article.trim());
    if (labelMatched && labelMatched.length) {
      const items = labelMatched[1].split(/\n/g).filter(Boolean);
      for (const text of items) {
        const [item, key, value] = /(\w*?):([\d\D]+)/.exec(text);
        if (key === 'title') {
          title = value.trim();
        } else if (key === 'tag') {
          // 处理标签，匹配标签集合并加入apiOptions的labels中
          tags = value.trim().replace(/\[/g, '').replace(/\]/g, '').split(/[,，]/).filter(Boolean).map((item) => item.trim());
          for (const tag of tags) {
            if (labelSet.has(tag)) {
              apiOptions.labels.push(tag);
            }
          }
        } else if (key === 'date') {
          date = value.trim();
        }
      }

      // 移除文章头部信息
      article = article.trim().replace(/^---([\d\D]*?)---/, '');
    }

    // 检查文章日期，排除早于指定日期的文章
    if (date && new Date(date).valueOf() < new Date(SinceDate).valueOf()) {
      console.log(`${title} date(${date}) is older than ${SinceDate}`);
      continue;
    }

    // 添加处理后文章信息到数组
    articles.push({
      title,
      content: article,
      apiOptions,
      ts: date ? new Date(date).valueOf() : 0,
    })
  }

  // 按时间戳降序排序文章列表
  return articles.sort((pre, next) => pre.ts - next.ts);
}

/**
 * 异步执行创建或更新GitHub仓库中文章的函数
 * 无参数
 * 无返回值
 */
async function run() {
  // 获取所有文章的路径
  const articlePaths = await getArticles();

  // 获取GitHub仓库中已有的问题（Issue）标题映射
  const titleMap = await getIssuesTitleMap(GithubRepoBlog);
  console.log("fetched issues count", titleMap.size);

  // 获取GitHub仓库中所有标签（Label）的集合
  const labelSet = await getLabelsNameSet(GithubRepoBlog);

  // 根据文章路径和标签集生成文章对象数组，并取第一个文章对象
  const articles = await generateArticles(articlePaths, labelSet);
  console.log("articles count", articles.length, articles.map(item => item.title));

  // 如果存在文章，则开始创建或更新文章
  if (articles.length) {
    let index = 0;
    /**
     * 异步循环创建或更新文章
     * 无参数
     * 无返回值
     */
    async function loopCreateArticle() {
      if (index === articles.length) {
        return; // 结束循环
      }

      // 获取当前处理的文章对象
      const article = articles[index]
      const title = article.title.trim(); // 文章标题
      let content = (article.content || '').trim(); // 文章内容

      // 检查GitHub仓库中是否存在相同标题的Issue
      const findIssue = titleMap.get(title);
      if (findIssue) {
        // 如果存在，判断是否需要更新内容
        if (findIssue.body && findIssue.body.trim() !== content) {
          // 如果内容不一致，则更新Issue内容
          const res = await updateIssue(
            GithubRepoBlog,
            findIssue.number,
            content,
            article.apiOptions,
          );

          console.log('update', index, res.status, title);
        } else {
          // 如果内容一致，跳过更新，处理下一篇文章
          index ++;
          loopCreateArticle();
          return;
        }
      } else {
        try {
          // 如果不存在相同标题的Issue，则创建新Issue
          const res = await createIssue(
            GithubRepoBlog,
            title,
            content,
            article.apiOptions,
          );
          console.log("create", index, res.status, title);
        } catch (e) {
          // 如果获取失败，则使用文章内容作为默认内容
          console.log('create error', e);
        }
      }

      index++; // 处理下一篇文章
      setTimeout(loopCreateArticle, 1000); // 延时1秒后继续处理
    }

    loopCreateArticle(); // 开始处理文章
  }
}

run();
