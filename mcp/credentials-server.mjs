#!/usr/bin/env node

/**
 * MCP Credentials Server
 *
 * Servidor MCP para gerenciar rotação de credenciais do GEEF
 * Permite integração com Claude para rotacionar credenciais automaticamente
 *
 * Uso:
 *   node mcp/credentials-server.mjs
 *
 * Recursos:
 *   - Validar credenciais
 *   - Fazer backup de .env
 *   - Rotacionar credenciais
 *   - Sincronizar com GitHub Secrets
 *   - Atualizar VPS via SSH
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const envPath = path.join(projectRoot, ".env");

/**
 * MCP Handler - Processa requests do Claude
 */
class CredentialsServer {
  constructor() {
    this.tools = {
      validate_credentials: {
        description: "Valida todas as credenciais no .env",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      backup_env: {
        description: "Faz backup do arquivo .env com timestamp",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      rotate_credential: {
        description: "Rotaciona uma credencial específica",
        inputSchema: {
          type: "object",
          properties: {
            credential_name: {
              type: "string",
              description:
                "Nome da credencial: GEEF_SUPABASE_SERVICE_ROLE_KEY, GEEF_LOG_INGEST_TOKEN, ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
            },
            new_value: {
              type: "string",
              description: "Novo valor da credencial",
            },
          },
          required: ["credential_name", "new_value"],
        },
      },
      get_credentials_status: {
        description: "Retorna status de todas as credenciais",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      update_github_secret: {
        description:
          "Fornece instruções para atualizar GitHub Secrets manualmente",
        inputSchema: {
          type: "object",
          properties: {
            secret_name: {
              type: "string",
              description: "Nome do secret no GitHub",
            },
            secret_value: {
              type: "string",
              description: "Novo valor do secret",
            },
          },
          required: ["secret_name", "secret_value"],
        },
      },
      generate_vps_update_script: {
        description:
          "Gera script SSH para atualizar credenciais na VPS automaticamente",
        inputSchema: {
          type: "object",
          properties: {
            credential_name: {
              type: "string",
              description: "Nome da credencial a atualizar",
            },
            new_value: {
              type: "string",
              description: "Novo valor",
            },
          },
          required: ["credential_name", "new_value"],
        },
      },
    };
  }

  /**
   * Validar credenciais
   */
  validateCredentials() {
    if (!fs.existsSync(envPath)) {
      return {
        status: "error",
        message: ".env não encontrado",
      };
    }

    const content = fs.readFileSync(envPath, "utf-8");
    const credentials = [
      {
        name: "GEEF_SUPABASE_SERVICE_ROLE_KEY",
        pattern: /^GEEF_SUPABASE_SERVICE_ROLE_KEY=(.+)$/m,
        critical: true,
      },
      {
        name: "SUPABASE_SERVICE_ROLE_KEY",
        pattern: /^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m,
        critical: true,
      },
      {
        name: "GEEF_LOG_INGEST_TOKEN",
        pattern: /^GEEF_LOG_INGEST_TOKEN=(.+)$/m,
        critical: true,
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
        pattern: /^NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)$/m,
        critical: false,
      },
    ];

    const results = [];
    let allValid = true;

    for (const cred of credentials) {
      const match = content.match(cred.pattern);
      const value = match?.[1];

      if (!value) {
        results.push({
          name: cred.name,
          status: "missing",
          critical: cred.critical,
        });
        if (cred.critical) allValid = false;
        continue;
      }

      if (value.includes("[") || value.includes("AQUI")) {
        results.push({
          name: cred.name,
          status: "placeholder",
          critical: cred.critical,
        });
        if (cred.critical) allValid = false;
        continue;
      }

      results.push({
        name: cred.name,
        status: "valid",
        critical: cred.critical,
        preview: value.substring(0, 30) + "...",
      });
    }

    return {
      status: allValid ? "success" : "warning",
      allValid,
      credentials: results,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fazer backup do .env
   */
  backupEnv() {
    if (!fs.existsSync(envPath)) {
      return {
        status: "error",
        message: ".env não encontrado",
      };
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(projectRoot, `.env.backup.${timestamp}`);

    fs.copyFileSync(envPath, backupPath);

    return {
      status: "success",
      backup_file: `.env.backup.${timestamp}`,
      backup_path: backupPath,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Rotacionar credencial
   */
  rotateCredential(credentialName, newValue) {
    if (!fs.existsSync(envPath)) {
      return {
        status: "error",
        message: ".env não encontrado",
      };
    }

    if (!newValue || newValue.length === 0) {
      return {
        status: "error",
        message: "Novo valor não pode estar vazio",
      };
    }

    // Validar nome da credencial
    const validCredentials = [
      "GEEF_SUPABASE_SERVICE_ROLE_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "GEEF_LOG_INGEST_TOKEN",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ];

    if (!validCredentials.includes(credentialName)) {
      return {
        status: "error",
        message: `Credencial inválida. Use uma de: ${validCredentials.join(", ")}`,
      };
    }

    // Fazer backup antes de modificar
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(projectRoot, `.env.backup.${timestamp}`);
    fs.copyFileSync(envPath, backupPath);

    // Ler e modificar .env
    let content = fs.readFileSync(envPath, "utf-8");
    const pattern = new RegExp(`^${credentialName}=.+$`, "m");

    if (!pattern.test(content)) {
      return {
        status: "error",
        message: `Credencial ${credentialName} não encontrada em .env`,
        backup_file: `.env.backup.${timestamp}`,
      };
    }

    content = content.replace(pattern, `${credentialName}=${newValue}`);
    fs.writeFileSync(envPath, content);

    return {
      status: "success",
      message: `${credentialName} atualizado com sucesso`,
      backup_file: `.env.backup.${timestamp}`,
      next_steps: [
        "1. Atualizar GitHub Secrets",
        "2. Atualizar VPS .env",
        "3. Restart do serviço na VPS",
        "4. Validar com: npm run collect:system-errors",
      ],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Obter status de credenciais
   */
  getCredentialsStatus() {
    return this.validateCredentials();
  }

  /**
   * Instruções para atualizar GitHub Secret
   */
  updateGithubSecret(secretName, secretValue) {
    return {
      status: "info",
      message: "GitHub Secrets deve ser atualizado manualmente via UI",
      instructions: {
        step1: "Acesse: https://github.com/Geef-EliasFrancis/sitegeef/settings/secrets/actions",
        step2: `Clique em "New repository secret" ou edite ${secretName}`,
        step3: `Nome: ${secretName}`,
        step4: `Valor: ${secretValue.substring(0, 30)}...`,
        step5: 'Clique em "Add secret"',
      },
      github_url: "https://github.com/Geef-EliasFrancis/sitegeef/settings/secrets/actions",
      secret_name: secretName,
      secret_preview: secretValue.substring(0, 30) + "...",
    };
  }

  /**
   * Gerar script SSH para VPS
   */
  generateVpsUpdateScript(credentialName, newValue) {
    const vpsHost = "204.216.166.12";
    const vpsUser = "ubuntu";
    const vpsPath = "/home/ubuntu/sitegeef";

    // Escapar valores para shell
    const escapedValue = newValue.replace(/'/g, "'\"'\"'");

    const script = `#!/bin/bash
# Script para rotacionar credencial na VPS
# Data: $(date)

set -e

echo "🔐 Conectando à VPS..."
ssh ${vpsUser}@${vpsHost} << 'EOFREMOTE'
  set -e
  cd ${vpsPath}

  echo "📝 Backup do .env..."
  cp .env .env.backup.\$(date +%Y%m%d-%H%M%S)

  echo "🔄 Atualizando ${credentialName}..."
  sed -i "s/^${credentialName}=.*\$/${credentialName}=${escapedValue}/" .env

  echo "🔄 Reiniciando serviço..."
  sudo -n systemctl restart sitegeef

  echo "✅ Aguardando startup..."
  sleep 3

  echo "🔍 Health check..."
  curl -fsS http://127.0.0.1:3500 > /dev/null && echo "✅ Serviço online"

  echo "✅ Sucesso!"
EOFREMOTE
`;

    return {
      status: "success",
      message: "Script SSH gerado",
      script,
      instructions: [
        "1. Salve o script em um arquivo (ex: update-vps.sh)",
        "2. Execute: bash update-vps.sh",
        "3. Monitore os logs da VPS",
      ],
      vps_details: {
        host: vpsHost,
        user: vpsUser,
        path: vpsPath,
        credential: credentialName,
      },
    };
  }

  /**
   * Processar ferramenta
   */
  async handleTool(toolName, toolInput) {
    try {
      switch (toolName) {
        case "validate_credentials":
          return this.validateCredentials();

        case "backup_env":
          return this.backupEnv();

        case "rotate_credential":
          return this.rotateCredential(
            toolInput.credential_name,
            toolInput.new_value
          );

        case "get_credentials_status":
          return this.getCredentialsStatus();

        case "update_github_secret":
          return this.updateGithubSecret(
            toolInput.secret_name,
            toolInput.secret_value
          );

        case "generate_vps_update_script":
          return this.generateVpsUpdateScript(
            toolInput.credential_name,
            toolInput.new_value
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
   * Listar ferramentas disponíveis
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
 * MCP Server Implementation
 */
class MCPServer {
  constructor() {
    this.credentialsServer = new CredentialsServer();
  }

  /**
   * Processar mensagem MCP
   */
  async processMessage(message) {
    const { jsonrpc, id, method, params } = message;

    try {
      let result;

      switch (method) {
        case "tools/list":
          result = {
            tools: this.credentialsServer.listTools(),
          };
          break;

        case "tools/call":
          result = await this.credentialsServer.handleTool(
            params.name,
            params.arguments || {}
          );
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

      return {
        jsonrpc,
        id,
        result,
      };
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

  /**
   * Iniciar servidor
   */
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

// Iniciar servidor
const server = new MCPServer();
server.start();
