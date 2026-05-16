// Supabase Edge Function: send-pending-notifications
// Triggered on schedule to send pending email notifications

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const resendApiKey = Deno.env.get('RESEND_API_KEY');

if (!supabaseUrl || !supabaseKey || !resendApiKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Notificacao {
  id: string;
  pessoa_id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  canal: string;
  status: string;
  modulo_origem?: string;
}

interface Pessoa {
  id: string;
  nome: string;
  email: string;
}

async function sendEmailViaResend(email: string, titulo: string, mensagem: string, tipo: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: 'notificacoes@geef.org',
      to: email,
      subject: `[${tipo.toUpperCase()}] ${titulo}`,
      html: generateHtmlEmail(titulo, mensagem, tipo),
      replyTo: 'contato@geef.org',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend API error: ${error.message}`);
  }

  return await response.json();
}

function generateHtmlEmail(titulo: string, mensagem: string, tipo: string): string {
  const colorMap: Record<string, string> = {
    sistema: '#3b82f6',
    alerta: '#ef4444',
    sucesso: '#22c55e',
    info: '#6366f1',
  };

  const color = colorMap[tipo] || '#3b82f6';

  return `
<html>
  <body style="font-family: Arial, sans-serif; background: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px;">
      <h2 style="color: ${color}; margin-top: 0;">${titulo}</h2>
      <p>${mensagem.replace(/\n/g, '<br>')}</p>
      <p style="color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
        © 2026 GEEF - Grupo de Estudos Espíritas de Franquia<br>
        <a href="https://geef.org" style="color: #3b82f6; text-decoration: none;">geef.org</a>
      </p>
    </div>
  </body>
</html>
  `;
}

async function processPendingNotifications() {
  console.log('Processing pending notifications...');

  // Fetch pending notifications with email channel
  const { data: notificacoes, error: fetchError } = await supabase
    .from('notificacoes')
    .select('id, pessoa_id, titulo, mensagem, tipo, canal, status, modulo_origem')
    .eq('canal', 'email')
    .eq('status', 'pendente')
    .limit(50);

  if (fetchError) {
    console.error('Error fetching notifications:', fetchError);
    throw fetchError;
  }

  if (!notificacoes || notificacoes.length === 0) {
    console.log('No pending notifications to process');
    return { processed: 0, successful: 0, failed: 0 };
  }

  console.log(`Found ${notificacoes.length} pending notifications`);

  let successful = 0;
  let failed = 0;

  for (const notif of notificacoes as Notificacao[]) {
    try {
      // Fetch person details
      const { data: pessoa, error: pessoaError } = await supabase
        .from('pessoas')
        .select('id, nome, email')
        .eq('id', notif.pessoa_id)
        .single();

      if (pessoaError || !pessoa) {
        console.error(`Person not found: ${notif.pessoa_id}`);
        failed++;
        continue;
      }

      const pessoaData = pessoa as Pessoa;

      // Send email via Resend
      const result = await sendEmailViaResend(
        pessoaData.email,
        notif.titulo,
        notif.mensagem,
        notif.tipo
      );

      // Update notification status to "enviado"
      const { error: updateError } = await supabase
        .from('notificacoes')
        .update({
          status: 'enviado',
          enviado_em: new Date().toISOString(),
        })
        .eq('id', notif.id);

      if (updateError) {
        console.error(`Error updating notification ${notif.id}:`, updateError);
        failed++;
      } else {
        console.log(`Notification sent: ${notif.id} → ${pessoaData.email}`);
        successful++;
      }
    } catch (error) {
      console.error(`Error processing notification ${notif.id}:`, error);

      // Update status to "falhou"
      await supabase
        .from('notificacoes')
        .update({
          status: 'falhou',
          enviado_em: new Date().toISOString(),
        })
        .eq('id', notif.id)
        .catch(err => console.error('Error updating failed status:', err));

      failed++;
    }
  }

  const result = {
    processed: notificacoes.length,
    successful,
    failed,
  };

  console.log('Processing complete:', result);
  return result;
}

// Handle the HTTP request
Deno.serve(async (req: Request) => {
  // Verify Authorization header (optional but recommended)
  const authHeader = req.headers.get('Authorization');
  const expectedToken = Deno.env.get('NOTIFICATION_FUNCTION_SECRET');

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await processPendingNotifications();
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notifications processed successfully',
        ...result,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
