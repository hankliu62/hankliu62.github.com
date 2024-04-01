const { Octokit } = require('octokit');
const { AccessToken, GitHubApiVersion, GithubOwner } = require('../constant');

const auth = AccessToken.join('');

/**
 * 根据获取所有的标签
 *
 * @param {*} repo
 * @returns
 */
async function fetchLabels(repo) {
  const octokit = new Octokit({
    auth: auth
  })

  const res = await octokit.request(`GET /repos/${GithubOwner}/${repo}/labels`, {
    owner: GithubOwner,
    repo: repo,
    per_page: 100,
    page: 1,
    headers: {
      'X-GitHub-Api-Version': GitHubApiVersion
    },
  });


  // 请求成功
  if (res.status === 200) {
    return res.data;
  } else {
    throw res;
  }
}

/**
 * 生成标签
 *
 * @param {*} repo
 * @param {*} name
 * @param {*} color
 * @param {*} description
 * @returns
 */
async function createLabel(repo, name, color, description) {
  const octokit = new Octokit({
    auth: auth
  })

  const res = await octokit.request(`POST /repos/${GithubOwner}/${repo}/labels`, {
    owner: GithubOwner,
    repo: repo,
    name: name,
    description: description,
    color: color,
    headers: {
      'X-GitHub-Api-Version': GitHubApiVersion
    },
  });

  return res;
}

/**
 * 获得所有标签的名称Set
 *
 * @param {*} repo
 * @returns
 */
async function getLabelsNameSet(repo) {
  const set = new Set()
  const issues = await fetchLabels(repo);
  for (const issue of issues) {
    set.add(issue.name.trim());
  }

  return set;
}

module.exports = {
  fetchLabels,
  getLabelsNameSet,
  createLabel,
}