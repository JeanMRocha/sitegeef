/**
 * PDF Export Utilities
 * Generate PDF reports using html2pdf or print-friendly HTML
 */

interface PDFOptions {
  filename: string;
  title: string;
  subtitle?: string;
  data: string; // HTML content
}

/**
 * Generate HTML content for DRE Report
 */
export function generateDREHtml(
  mes: number,
  ano: number,
  receitas: { nome: string; valor: number }[],
  despesas: { nome: string; valor: number }[],
  resultado: number
): string {
  const mesNome = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);
  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);

  const receitasHtml = receitas
    .map(
      r => `
    <tr>
      <td>${r.nome}</td>
      <td style="text-align: right; color: #22c55e; font-weight: 500;">${formatCurrency(r.valor)}</td>
    </tr>
  `
    )
    .join('');

  const despesasHtml = despesas
    .map(
      d => `
    <tr>
      <td>${d.nome}</td>
      <td style="text-align: right; color: #ef4444; font-weight: 500;">${formatCurrency(d.valor)}</td>
    </tr>
  `
    )
    .join('');

  const resultadoColor = resultado >= 0 ? '#22c55e' : '#ef4444';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DRE - ${mesNome}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 2px solid #e5e5e5;
      padding-bottom: 20px;
    }
    h1 { font-size: 28px; color: #333; margin-bottom: 10px; }
    .period { font-size: 18px; color: #666; }
    .section { margin-bottom: 40px; }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ddd;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    tr:last-child td { border-bottom: none; }
    .total-row {
      background: #f9f9f9;
      font-weight: 600;
      font-size: 15px;
    }
    .total-row td:first-child { padding-left: 0; }
    .total-row td:last-child { padding-right: 0; }
    .resultado-box {
      background: rgba(34, 197, 94, 0.05);
      border-left: 4px solid ${resultadoColor};
      padding: 20px;
      margin-top: 30px;
      border-radius: 4px;
      text-align: center;
    }
    .resultado-box h3 { color: #666; font-size: 14px; margin-bottom: 10px; }
    .resultado-valor {
      font-size: 32px;
      font-weight: 700;
      color: ${resultadoColor};
    }
    footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    @media print {
      body { margin: 0; }
      .container { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📊 Demonstração de Resultado Financeiro</h1>
      <p class="period">${mesNome}</p>
    </header>

    <div class="section">
      <div class="section-title">💰 Receitas</div>
      <table>
        <tbody>
          ${receitasHtml}
          <tr class="total-row">
            <td>Total de Receitas</td>
            <td style="text-align: right; color: #22c55e;">${formatCurrency(totalReceitas)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">📉 Despesas</div>
      <table>
        <tbody>
          ${despesasHtml}
          <tr class="total-row">
            <td>Total de Despesas</td>
            <td style="text-align: right; color: #ef4444;">${formatCurrency(totalDespesas)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="resultado-box">
      <h3>Resultado Líquido</h3>
      <div class="resultado-valor">${formatCurrency(resultado)}</div>
    </div>

    <footer>
      <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
      <p>© 2026 GEEF - Grupo de Estudos Espíritas de Franquia</p>
    </footer>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Export function to trigger browser download
 * Works client-side only
 */
export function downloadPDF(htmlContent: string, filename: string) {
  if (typeof window === 'undefined') {
    console.error('downloadPDF deve ser chamado no lado do cliente');
    return;
  }

  // Try using html2pdf if available
  if ((window as any).html2pdf) {
    (window as any).html2pdf().set({ filename }).from(htmlContent).save();
    return;
  }

  // Fallback: Open in new window with print dialog
  const printWindow = window.open('', '', 'height=400,width=600');
  if (!printWindow) return;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();

  // Trigger print after content loads
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

/**
 * Generate Statistics Report HTML
 */
export function generateStatisticsHtml(
  stats: Record<string, number>,
  periodo: string
): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório de Estatísticas</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      background: #f5f5f5;
    }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
    h1 { text-align: center; color: #333; margin-bottom: 30px; }
    .period { text-align: center; color: #666; margin-bottom: 30px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-label { font-size: 12px; opacity: 0.9; margin-bottom: 8px; }
    .stat-value { font-size: 28px; font-weight: bold; }
    @media print {
      body { background: white; padding: 0; }
      .container { border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📈 Relatório de Estatísticas</h1>
    <p class="period">${periodo}</p>
    <div class="stats-grid">
      ${Object.entries(stats)
        .map(
          ([key, value]) => `
      <div class="stat-card">
        <div class="stat-label">${key.replace(/_/g, ' ').toUpperCase()}</div>
        <div class="stat-value">${value}</div>
      </div>
    `
        )
        .join('')}
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Client-side PDF download from HTML
 */
export async function exportReportToPDF(htmlContent: string, filename: string) {
  // This would require html2pdf library loaded in the client
  // Add to your _document.tsx or _app.tsx:
  // <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

  if (typeof window !== 'undefined' && (window as any).html2pdf) {
    const element = document.createElement('div');
    element.innerHTML = htmlContent;

    (window as any).html2pdf()
      .set({
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      })
      .from(element)
      .save();
  } else {
    // Fallback: browser print dialog
    const printWindow = window.open('', '', 'height=400,width=600');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
