import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";

export class GithubBackuper {
  #octokit: Octokit;
  #owner: string | null = null;

  constructor(token: string) {
    this.#octokit = new Octokit({ auth: token });
  }

  async getOwner(): Promise<string | undefined> {
    if (this.#owner) return this.#owner;
    try {
      const { data: user } = await this.#octokit.rest.users.getAuthenticated();
      this.#owner = user.login;
      return this.#owner;
    } catch {}
  }

  async listRepos() {
    try {
      // const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      //   per_page: 100,
      //   page: 1,
      // });
      const repos = await this.#octokit.paginate(this.#octokit.rest.repos.listForAuthenticatedUser, {
        visibility: "private", // Options: 'all', 'public', 'private'
        affiliation: "owner", // Shows only repos you own. Remove this line to see collabs/orgs too.
        per_page: 100,
      });
      return repos;
    } catch {}
    return [];
  }

  async listFiles(repoName: string) {
    const owner = await this.getOwner();
    if (!owner) return [];

    try {
      const { data } = await this.#octokit.repos.getContent({
        owner: owner,
        repo: repoName,
        path: "",
      });
      if (Array.isArray(data)) {
        return data;
      }
    } catch {}
    return [];
  }

  async getLastFileCommit(repoName: string, filePath: string) {
    const owner = await this.getOwner();
    if (!owner) return;

    try {
      const { data } = await this.#octokit.repos.listCommits({
        owner: owner,
        repo: repoName,
        path: filePath,
        per_page: 1,
        headers: {
          "If-None-Match": "", // Forces GitHub to bypass the cache
        },
      });
      return data[0];
      // console.debug("getLastFileCommit:data", data);
      // if (!Array.isArray(data) && data.type === "file") {
      //   return data;
      // }
    } catch {}
  }

  async getLastFileCommitDate(repoName: string, filePath: string): Promise<Date | undefined> {
    const commit = await this.getLastFileCommit(repoName, filePath);
    console.debug("getLastFileCommitDate:commit", commit);
    if (commit) {
      const dateStr = commit.commit.committer?.date;
      if (dateStr) {
        return new Date(dateStr);
      }
    }
  }

  async getFile(repoName: string, filePath: string) {
    const owner = await this.getOwner();
    if (!owner) return;

    try {
      const { data } = await this.#octokit.repos.getContent({
        owner: owner,
        repo: repoName,
        path: filePath,
        headers: {
          "If-None-Match": "", // Forces GitHub to bypass the cache
        },
      });
      if (!Array.isArray(data) && data.type === "file") {
        return data;
      }
    } catch {}
  }

  async getFileContent(repoName: string, filePath: string): Promise<string | undefined> {
    const owner = await this.getOwner();
    if (!owner) return;

    try {
      const { data } = await this.#octokit.repos.getContent({
        owner: owner,
        repo: repoName,
        path: filePath,
        headers: {
          "If-None-Match": "", // Forces GitHub to bypass the cache
        },
      });
      if (!Array.isArray(data) && data.type === "file") {
        return Base64.decode(data.content);
      }
    } catch {}
  }

  async putFileContent(repoName: string, filePath: string, text: string) {
    const owner = await this.getOwner();
    if (!owner) return false;

    let sha: string | undefined;
    try {
      // Raises error if file not exists
      const { data } = await this.#octokit.repos.getContent({
        owner: owner,
        repo: repoName,
        path: filePath,
      });
      if (!Array.isArray(data) && data.type === "file") {
        sha = data.sha;
      }
    } catch {}

    try {
      await this.#octokit.repos.createOrUpdateFileContents({
        owner: owner,
        repo: repoName,
        path: filePath,
        message: `Put ${filePath}`,
        content: Base64.encode(text),
        ...(sha && { sha }),
      });
      return true;
    } catch {}
    return false;
  }

  async deleteFile(repoName: string, filePath: string): Promise<boolean> {
    const owner = await this.getOwner();
    if (!owner) return false;

    try {
      const { data } = await this.#octokit.repos.getContent({
        owner,
        repo: repoName,
        path: filePath,
      });

      if (Array.isArray(data) || data.type !== "file") {
        return false;
      }

      await this.#octokit.repos.deleteFile({
        owner,
        repo: repoName,
        path: filePath,
        message: `Delete ${filePath}`,
        sha: data.sha,
      });

      return true;
    } catch {}
    return false;
  }
}
