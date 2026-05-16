/**
 * Email Notification Service
 *
 * Sends transactional emails via Resend API for notification delivery
 */

interface EmailNotification {
  pessoaId: string;
  email: string;
  nome: string;
  titulo: string;
  mensagem: string;
  tipo: 'sistema' | 'alerta' | 'sucesso' | 'info';
  modulo_origem?: string;
  link_acao?: string;
}

export async function sendEmailNotification(notif: EmailNotification) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  const emailTemplate = generateEmailTemplate(notif);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'notificacoes@geef.org',
        to: notif.email,
        subject: `[${notif.tipo.toUpperCase()}] ${notif.titulo}`,
        html: emailTemplate,
        replyTo: 'contato@geef.org',
        tags: [
          {
            name: 'categoria',
            value: notif.tipo,
          },
          {
            name: 'modulo',
            value: notif.modulo_origem || 'sistema',
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error: String(error) };
  }
}

function generateEmailTemplate(notif: EmailNotification): string {
  const colorMap = {
    sistema: '#3b82f6',
    alerta: '#ef4444',
    sucesso: '#22c55e',
    info: '#6366f1',
  };

  const color = colorMap[notif.tipo];
  const emojiMap = {
    sistema: '⚙️',
    alerta: '⚠️',
    sucesso: '✓',
    info: 'ℹ️',
  };

  const emoji = emojiMap[notif.tipo];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
    .logo { font-size: 24px; font-weight: bold; color: #333; }
    .content { padding: 30px 0; }
    .notification-box {
      border-left: 4px solid ${color};
      background: #f9f9f9;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .notification-title { font-size: 18px; font-weight: 600; margin: 0 0 10px 0; color: #333; }
    .notification-message { font-size: 14px; color: #666; margin: 10px 0; }
    .meta { font-size: 12px; color: #999; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      background: ${color};
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: 500;
    }
    .footer { text-align: center; padding: 20px 0; border-top: 2px solid #f0f0f0; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🙏 GEEF</div>
      <p style="color: #666; margin: 5px 0 0 0;">Grupo de Estudos Espíritas de Franquia</p>
    </div>

    <div class="content">
      <div class="notification-box">
        <div class="notification-title">
          ${emoji} ${notif.titulo}
        </div>
        <div class="notification-message">
          ${notif.mensagem.replace(/\n/g, '<br>')}
        </div>
        ${notif.link_acao ? `<a href="${notif.link_acao}" class="cta-button">Acessar Portal</a>` : ''}
        <div class="meta">
          <p>Olá, ${notif.nome}!</p>
          <p>Esta é uma notificação do sistema GEEF.</p>
          ${notif.modulo_origem ? `<p>Módulo de origem: <strong>${notif.modulo_origem}</strong></p>` : ''}
        </div>
      </div>
    </div>

    <div class="footer">
      <p>© 2026 Grupo de Estudos Espíritas de Franquia (GEEF)</p>
      <p>Não responda este e-mail. Para dúvidas, contate: contato@geef.org</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Batch send notifications to multiple people
 */
export async function sendBatchEmailNotifications(notificacoes: EmailNotification[]) {
  const results = await Promise.all(
    notificacoes.map(notif => sendEmailNotification(notif))
  );

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    total: notificacoes.length,
    successful,
    failed,
    results,
  };
}
