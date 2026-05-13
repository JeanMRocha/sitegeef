#!/usr/bin/env node

/**
 * MCP GitHub Server
 *
 * Integração com GitHub API para gerenciar repositórios, issues, PRs, etc.
 * Requer token de autenticação no .env: GITHUB_TOKEN
 *
 * Uso:
 *   node mcp/github-server.mjs
 */

import https from "node:https";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Configuração
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USER = "JeanMRocha";
const API_BASE = "https://api.github.com";

class GitHubServer {
  constructor() {
    if (!GITHUB_TOKEN) {
      console.error(
        "❌ GITHUB_TOKEN não configurado. Adicione ao .env ou variável de ambiente."
      );
      process.exit(1);
    }

    this.tools = {
      list_repos: {
        description: "Lista todos os repositórios do usuário",
        inputSchema: {
          type: "object",
          properties: {
            per_page: {
              type: "number",
              description: "Quantidade de repos por página (max 100)",
            },
          },
        },
      },
      get_repo: {
        description: "Retorna informações detalhadas de um repositório",
        inputSchema: {
          type: "object",
          properties: {
            repo_name: {
              type: "string",
              description: "Nome do repositório",
            },
          },
          required: ["repo_name"],
        },
      },
      list_issues: {
        description: "Lista issues de um repositório",
        inputSchema: {
          type: "object",
          properties: {
            repo_name: {
              type: "string",
              description: "Nome do repositório",
            },
            state: {
              type: "string",
              enum: ["open", "closed", "all"],
              description: "Estado das issues",
            },
          },
          required: ["repo_name"],
        },
      },
      list_prs: {
        description: "Lista pull requests de um repositório",
        inputSchema: {
          type: "object",
          properties: {
            repo_name: {
              type: "string",
              description: "Nome do repositório",
            },
            state: {
              type: "string",
              enum: ["open", "closed", "all"],
              description: "Estado dos PRs",
            },
          },
          required: ["repo_name"],
        },
      },
      get_commits: {
        description: "Lista commits recentes de um repositório",
        inputSchema: {
          type: "object",
          properties: {
            repo_name: {
              type: "string",
              description: "Nome do repositório",
            },
            per_page: {
              type: "number",
              description: "Número de commits (max 100)",
            },
          },
          required: ["repo_name"],
        },
      },
      create_issue: {
        description: "Cria uma nova issue",
        inputSchema: {
          type: "object",
          properties: {
            repo_name: {
              type: "string",
              description: "Nome do repositório",
            },
            title: {
              type: "string",
              description: "Título da issue",
            },
            body: {
              type: "string",
              description: "Descrição da issue (markdown)",
            },
            labels: {
              type: "array",
              description: "Labels (ex: ['bug', 'enhancement'])",
            },
          },
          required: ["repo_name", "title"],
        },
      },
      get_readme: {
        description: "Retorna conteúdo do README de um repositório",
        inputSchema: {
          type: "object",
          properties: {
            repo_name: {
              type: "string",
              description: "Nome do repositório",
            },
          },
          required: ["repo_name"],
        },
      },
      search_repos: {
        description: "Busca repositórios por palavra-chave",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Termo de busca",
            },
            per_page: {
              type: "number",
              description: "Quantidade de resultados",
            },
          },
          required: ["query"],
        },
      },
    };
  }

  /**
   * Fazer requisição HTTPS à API do GitHub
   */
  async request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "api.github.com",
        path,
        method,
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "User-Agent": "GEEF-MCP",
          Accept: "application/vnd.github.v3+json",
        },
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 400) {
              reject({
                status: res.statusCode,
                message: parsed.message || "Erro na requisição",
              });
            } else {
              resolve(parsed);
            }
          } catch {
            reject({
              status: res.statusCode,
              message: data,
            });
          }
        });
      });

      req.on("error", reject);

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * Listar repositórios
   */
  async listRepos(perPage = 30) {
    const repos = await this.request(
      "GET",
      `/users/${GITHUB_USER}/repos?per_page=${perPage}&sort=updated`
    );

    return {
      status: "success",
      total: repos.length,
      repos: repos.map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
        updated: r.updated_at,
        private: r.private,
      })),
    };
  }

  /**
   * Obter informações de um repositório
   */
  async getRepo(repoName) {
    const repo = await this.request("GET", `/repos/${GITHUB_USER}/${repoName}`);

    return {
      status: "success",
      repo: {
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        language: repo.language,
        topics: repo.topics,
        created: repo.created_at,
        updated: repo.updated_at,
        size: repo.size,
        open_issues: repo.open_issues_count,
        default_branch: repo.default_branch,
      },
    };
  }

  /**
   * Listar issues
   */
  async listIssues(repoName, state = "open") {
    const issues = await this.request(
      "GET",
      `/repos/${GITHUB_USER}/${repoName}/issues?state=${state}&per_page=30`
    );

    return {
      status: "success",
      total: issues.length,
      issues: issues.map((i) => ({
        number: i.number,
        title: i.title,
        state: i.state,
        created: i.created_at,
        updated: i.updated_at,
        labels: i.labels.map((l) => l.name),
        url: i.html_url,
      })),
    };
  }

  /**
   * Listar PRs
   */
  async listPRs(repoName, state = "open") {
    const prs = await this.request(
      "GET",
      `/repos/${GITHUB_USER}/${repoName}/pulls?state=${state}&per_page=30`
    );

    return {
      status: "success",
      total: prs.length,
      prs: prs.map((pr) => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        created: pr.created_at,
        updated: pr.updated_at,
        draft: pr.draft,
        url: pr.html_url,
        author: pr.user.login,
      })),
    };
  }

  /**
   * Obter commits
   */
  async getCommits(repoName, perPage = 10) {
    const commits = await this.request(
      "GET",
      `/repos/${GITHUB_USER}/${repoName}/commits?per_page=${perPage}`
    );

    return {
      status: "success",
      total: commits.length,
      commits: commits.map((c) => ({
        sha: c.sha.substring(0, 7),
        message: c.commit.message.split("\n")[0],
        author: c.commit.author.name,
        date: c.commit.author.date,
        url: c.html_url,
      })),
    };
  }

  /**
   * Criar issue
   */
  async createIssue(repoName, title, body, labels = []) {
    const issue = await this.request(
      "POST",
      `/repos/${GITHUB_USER}/${repoName}/issues`,
      {
        title,
        body,
        labels,
      }
    );

    return {
      status: "success",
      message: `Issue criada: #${issue.number}`,
      issue: {
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
      },
    };
  }

  /**
   * Obter README
   */
  async getReadme(repoName) {
    try {
      const file = await this.request(
        "GET",
        `/repos/${GITHUB_USER}/${repoName}/readme`
      );

      // Decodificar base64
      const content = Buffer.from(file.content, "base64").toString("utf-8");

      return {
        status: "success",
        content,
        path: file.path,
      };
    } catch (error) {
      return {
        status: "error",
        message: "README não encontrado",
      };
    }
  }

  /**
   * Buscar repositórios
   */
  async searchRepos(query, perPage = 10) {
    const result = await this.request(
      "GET",
      `/search/repositories?q=${encodeURIComponent(query)}+user:${GITHUB_USER}&per_page=${perPage}`
    );

    return {
      status: "success",
      total: result.total_count,
      repos: result.items.map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
      })),
    };
  }

  /**
   * Processar ferramenta
   */
  async handleTool(toolName, toolInput) {
    try {
      switch (toolName) {
        case "list_repos":
          return await this.listRepos(toolInput.per_page || 30);

        case "get_repo":
          return await this.getRepo(toolInput.repo_name);

        case "list_issues":
          return await this.listIssues(
            toolInput.repo_name,
            toolInput.state || "open"
          );

        case "list_prs":
          return await this.listPRs(toolInput.repo_name, toolInput.state || "open");

        case "get_commits":
          return await this.getCommits(
            toolInput.repo_name,
            toolInput.per_page || 10
          );

        case "create_issue":
          return await this.createIssue(
            toolInput.repo_name,
            toolInput.title,
            toolInput.body,
            toolInput.labels
          );

        case "get_readme":
          return await this.getReadme(toolInput.repo_name);

        case "search_repos":
          return await this.searchRepos(
            toolInput.query,
            toolInput.per_page || 10
          );

        default:
          return {
            status: "error",
            message: `Ferramenta desconhecida: ${toolName}`,
          };
      }
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  /**
   * Listar ferramentas
   */
  listTools() {
    return Object.entries(this.tools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));
  }
}

/**
 * MCP Server
 */
class MCPServer {
  constructor() {
    this.github = new GitHubServer();
  }

  async processMessage(message) {
    const { jsonrpc, id, method, params } = message;

    try {
      let result;

      switch (method) {
        case "tools/list":
          result = { tools: this.github.listTools() };
          break;

        case "tools/call":
          result = await this.github.handleTool(params.name, params.arguments || {});
          break;

        default:
          return {
            jsonrpc,
            id,
            error: {
              code: -32601,
              message: `Method not found: ${method}`,
            },
          };
      }

      return { jsonrpc, id, result };
    } catch (error) {
      return {
        jsonrpc,
        id,
        error: {
          code: -32603,
          message: error.message,
        },
      };
    }
  }

  start() {
    process.stdin.setEncoding("utf8");
    let buffer = "";

    process.stdin.on("data", async (chunk) => {
      buffer += chunk;

      while (true) {
        const newlineIndex = buffer.indexOf("\n");
        if (newlineIndex === -1) break;

        const line = buffer.substring(0, newlineIndex);
        buffer = buffer.substring(newlineIndex + 1);

        if (!line.trim()) continue;

        try {
          const message = JSON.parse(line);
          const response = await this.processMessage(message);
          process.stdout.write(JSON.stringify(response) + "\n");
        } catch (error) {
          process.stdout.write(
            JSON.stringify({
              jsonrpc: "2.0",
              error: {
                code: -32700,
                message: "Parse error",
              },
            }) + "\n"
          );
        }
      }
    });

    process.stdin.on("end", () => {
      process.exit(0);
    });
  }
}

const server = new MCPServer();
server.start();
