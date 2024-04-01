const GitHubApiVersion = "2022-11-28";

const GithubOwner = "hankliu62";

// 博客Repo
const GithubRepoBlog = "hankliu62.github.com";

const AccessToken = (process.env.NEXT_GITHUB_BACKEND_TOKEN || '').split('');

module.exports = {
  AccessToken,
  GitHubApiVersion,
  GithubOwner,
  GithubRepoBlog
}