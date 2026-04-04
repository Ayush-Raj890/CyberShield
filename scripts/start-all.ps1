$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Server = Join-Path $Root 'server'
$Client = Join-Path $Root 'client'
$Ai = Join-Path $Root 'ai-service'

Write-Host 'Starting CyberShield services...'
Write-Host ''

if (-not (Test-Path (Join-Path $Server 'node_modules'))) {
  Write-Host '[1/3] Installing server dependencies...'
  Push-Location $Server
  npm install
  Pop-Location
}

if (-not (Test-Path (Join-Path $Client 'node_modules'))) {
  Write-Host '[2/3] Installing client dependencies...'
  Push-Location $Client
  npm install
  Pop-Location
}

$AiVenv = Join-Path $Ai '.venv'
$AiPython = Join-Path $AiVenv 'Scripts\python.exe'
if (-not (Test-Path $AiPython)) {
  throw 'Missing ai-service\\.venv. Create it first with: cd ai-service; python -m venv .venv'
}

Write-Host '[3/3] Launching server, client, and AI service...'

Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$Server'; npm run dev" | Out-Null
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$Client'; npm run dev" | Out-Null
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$Ai'; & '$AiPython' -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" | Out-Null

Write-Host ''
Write-Host 'Launched. Keep the three windows open.'
