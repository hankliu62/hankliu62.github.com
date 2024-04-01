const { Octokit } = require('octokit');
const { AccessToken, GitHubApiVersion, GithubOwner } = require('../constant');

const auth = AccessToken.join('');

/**
 * 根据分页获取数据
 *
 * @param {*} page
 * @returns
 */
async function fetchIssues(page, repo, options = {}) {
  const octokit = new Octokit({
    auth: auth
  })

  const res = await octokit.request(`GET /repos/${GithubOwner}/${repo}/issues`, {
    owner: GithubOwner,
    repo,
    per_page: 30,
    page: page,
    headers: {
      'X-GitHub-Api-Version': GitHubApiVersion
    },
    direction: 'asc',
    ...options,
  });


  // 请求成功
  if (res.status === 200) {
    return res.data;
  } else {
    throw res;
  }
}

/**
 * 获取所有问题
 * @returns
 */
async function fetchAllIssues(repo, options = {}) {
  return new Promise((resolve, reject) => {
    // 问题列表
    const questions = [];
    let page = 1;
    async function loopFetchIssue() {
      const currentQuestions = await fetchIssues(page, repo, options);
      if (currentQuestions.length) {
        for (const question of currentQuestions) {
          questions.push(question);
        }
        page ++;
        setTimeout(loopFetchIssue, 100);
      } else {
        resolve(questions);
      }
    }

    loopFetchIssue();
  });
}

/**
 * 生成问题
 *
 * @param {*} repo
 * @param {*} title
 * @param {*} answer
 * @param {*} options
 * @returns
 */
async function createIssue(repo, title, answer, options = {}) {
  const octokit = new Octokit({
    auth: auth
  })

  const res = await octokit.request(`POST /repos/${GithubOwner}/${repo}/issues`, {
    owner: GithubOwner,
    repo: repo,
    title: title,
    body: answer,
    assignees: [
      GithubOwner
    ],
    headers: {
      'X-GitHub-Api-Version': GitHubApiVersion
    },
    ...options,
  });

  return res;
}

/**
 * 生成问题
 *
 * @param {*} repo
 * @param {*} id
 * @param {*} options
 * @returns
 */
async function closeIssue(repo, id, options = {}) {
  const octokit = new Octokit({
    auth: auth
  })

  const res = await octokit.request(`POST /repos/${GithubOwner}/${repo}/issues/${id}`, {
    owner: GithubOwner,
    repo: repo,
    issue_number: +id,
    state: "closed",
    state_reason: "completed",
    headers: {
      'X-GitHub-Api-Version': GitHubApiVersion
    },
    ...options,
  });

  return res;
}

/**
 * 更新问题
 *
 * @param {*} repo
 * @param {*} id
 * @param {*} body
 * @param {*} options
 * @returns
 */
async function updateIssue(repo, id, body, options = {}) {
  const octokit = new Octokit({
    auth: auth
  })

  const res = await octokit.request(`POST /repos/${GithubOwner}/${repo}/issues/${id}`, {
    owner: GithubOwner,
    repo: repo,
    issue_number: +id,
    body: body,
    headers: {
      'X-GitHub-Api-Version': GitHubApiVersion
    },
    ...options,
  });

  return res;
}

/**
 * 获得所有问题的名称Set
 *
 * @param {*} repo
 * @param {*} options
 * @returns
 */
async function getIssuesTitleSet(repo, options = {}) {
  const set = new Set()
  const issues = await fetchAllIssues(repo, options);
  for (const issue of issues) {
    set.add(issue.title.trim());
  }

  return set;
}

/**
 * 获得所有问题的名称Map
 *
 * @param {*} repo
 * @param {*} options
 * @returns
 */
async function getIssuesTitleMap(repo, options = {}) {
  const map = new Map()
  const issues = await fetchAllIssues(repo, options);
  for (const issue of issues) {
    map.set(issue.title.trim(), issue);
  }

  return map;
}


module.exports = {
  fetchIssues,
  fetchAllIssues,
  createIssue,
  closeIssue,
  updateIssue,
  getIssuesTitleSet,
  getIssuesTitleMap,
}