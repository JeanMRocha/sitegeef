# Script para rodar servidor em foreground
# Mantenha este terminal ABERTO enquanto testa

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "SERVIDOR EM FOREGROUND - MANTENHA ESTE TERMINAL ABERTO" -ForegroundColor Yellow
Write-Host "=" * 70
Write-Host ""

# Mata processos antigos
Write-Host "Limpando..."
Get-Process | Where-Object { $_.ProcessName -like "*node*" -or $_.ProcessName -like "*npm*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Remove cache
Remove-Item -Recurse -Force 'C:\Projetos\site-geef\.next' -ErrorAction SilentlyContinue

cd 'C:\Projetos\site-geef'

Write-Host "Iniciando... (aguarde 'Ready in XXXms')" -ForegroundColor Green
Write-Host ""

npm run dev
