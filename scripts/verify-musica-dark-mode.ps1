# Script de Verificação — Música em Dark Mode
# Uso: PowerShell .\scripts\verify-musica-dark-mode.ps1

Write-Host "🎵 VERIFICAÇÃO DE MÚSICA EM DARK MODE" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

$testsPassed = 0
$testsFailed = 0

# Teste 1: Servidor respondendo?
Write-Host "✓ TESTE 1: Servidor respondendo?" -ForegroundColor Yellow
try {
    $response = curl -I http://localhost:3500 2>&1 | Select-String "HTTP"
    if ($response) {
        Write-Host "  ✅ Servidor HTTP OK" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "  ❌ Servidor não respondeu" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "  ❌ Erro ao conectar" -ForegroundColor Red
    $testsFailed++
}

# Teste 2: Página de música carregando?
Write-Host ""
Write-Host "✓ TESTE 2: Página de música?" -ForegroundColor Yellow
try {
    $musicResponse = curl -s http://localhost:3500/musicas/quanta-luz-28f689e1 2>&1
    if ($musicResponse -like "*musica-display*") {
        Write-Host "  ✅ Página carrega com estrutura correta" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "  ❌ Estrutura HTML não encontrada" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "  ❌ Erro ao buscar página" -ForegroundColor Red
    $testsFailed++
}

# Teste 3: CSS com cor dark mode?
Write-Host ""
Write-Host "✓ TESTE 3: CSS com cor creme (#f4efe7)?" -ForegroundColor Yellow
try {
    $cssCheck = Get-Content "styles/globals.css" -ErrorAction Stop | Select-String "#f4efe7"
    if ($cssCheck) {
        Write-Host "  ✅ Cor encontrada no CSS" -ForegroundColor Green
        Write-Host "     Linhas: $($cssCheck.LineNumber -join ', ')" -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "  ❌ Cor não encontrada no CSS" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "  ❌ Erro ao ler CSS" -ForegroundColor Red
    $testsFailed++
}

# Teste 4: Seletores musicais presentes?
Write-Host ""
Write-Host "✓ TESTE 4: Seletores de música?" -ForegroundColor Yellow
try {
    $selectors = @(
        "musica-display-verse-content",
        "musica-display-header-16x9",
        "musica-display-chorus-text"
    )

    $found = 0
    foreach ($selector in $selectors) {
        if ((Get-Content "styles/globals.css" -ErrorAction Stop) -like "*$selector*") {
            Write-Host "  ✅ .$selector encontrado" -ForegroundColor Green
            $found++
        }
    }

    if ($found -eq 3) {
        $testsPassed++
    } else {
        Write-Host "  ⚠️  Apenas $found/$($selectors.Length) seletores encontrados" -ForegroundColor Yellow
        $testsFailed++
    }
} catch {
    Write-Host "  ❌ Erro ao validar seletores" -ForegroundColor Red
    $testsFailed++
}

# Resultado
Write-Host ""
Write-Host "=" * 60
Write-Host "RESULTADO:" -ForegroundColor Cyan
Write-Host "  ✅ Passou: $testsPassed/4" -ForegroundColor Green
Write-Host "  ❌ Falhou: $testsFailed/4" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 TUDO OK! Mudanças aplicadas corretamente." -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Acesse: http://localhost:3500/musicas/quanta-luz-28f689e1" -ForegroundColor White
    Write-Host "2. Ative dark mode (localStorage ou DevTools)" -ForegroundColor White
    Write-Host "3. Verifique se a letra está em CREME CLARO" -ForegroundColor White
} else {
    Write-Host "❌ Alguns testes falharam. Veja doc: docs/TROUBLESHOOTING_MUSICA_DARK_MODE.md" -ForegroundColor Red
}

Write-Host ""
