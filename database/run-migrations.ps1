# run-migrations.ps1
# Script para executar migrations no Supabase local ou remoto
# Uso: .\run-migrations.ps1 -ConnectionString "postgresql://..."

param(
  [Parameter(Mandatory = $true)]
  [string]$ConnectionString
)

$migrations = Get-ChildItem -Path "migrations" -Filter "*.sql" | Sort-Object Name

foreach ($m in $migrations) {
  Write-Host "Executando $($m.Name)..." -ForegroundColor Yellow
  $sql = Get-Content $m.FullName -Raw
  psql $ConnectionString -c $sql
  if ($?) {
    Write-Host "  ✅ $($m.Name) executado com sucesso" -ForegroundColor Green
  } else {
    Write-Host "  ❌ Erro em $($m.Name)" -ForegroundColor Red
    exit 1
  }
}

# Seeds
$seeds = Get-ChildItem -Path "seeds" -Filter "*.sql" | Sort-Object Name
foreach ($s in $seeds) {
  Write-Host "Executando seed $($s.Name)..." -ForegroundColor Yellow
  $sql = Get-Content $s.FullName -Raw
  psql $ConnectionString -c $sql
  if ($?) {
    Write-Host "  ✅ $($s.Name) executado" -ForegroundColor Green
  }
}

Write-Host "`n🎯 Migrations concluídas com sucesso!" -ForegroundColor Cyan
