$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverDir = Join-Path $repoRoot "server"
$clientDir = Join-Path $repoRoot "client"
$aiDir = Join-Path $repoRoot "ai-service"

if (-not (Test-Path $serverDir)) {
    throw "Missing directory: $serverDir"
}
if (-not (Test-Path $clientDir)) {
    throw "Missing directory: $clientDir"
}
if (-not (Test-Path $aiDir)) {
    throw "Missing directory: $aiDir"
}

$pythonCandidates = @(
    (Join-Path $aiDir ".venv\Scripts\python.exe"),
    (Join-Path (Split-Path $repoRoot -Parent) ".venv\Scripts\python.exe")
)

$pythonExe = $null
foreach ($candidate in $pythonCandidates) {
    if (Test-Path $candidate) {
        $pythonExe = $candidate
        break
    }
}

if (-not $pythonExe) {
    $pythonExe = "python"
}

Write-Host "Starting CyberShield development stack..." -ForegroundColor Cyan
Write-Host "Server: $serverDir" -ForegroundColor DarkCyan
Write-Host "Client: $clientDir" -ForegroundColor DarkCyan
Write-Host "AI: $aiDir" -ForegroundColor DarkCyan
Write-Host "Python: $pythonExe" -ForegroundColor DarkCyan

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$serverDir'; npm run dev"
)

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$clientDir'; npm run dev"
)

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$aiDir'; & '$pythonExe' -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
)

Write-Host "All three services were launched in separate PowerShell windows." -ForegroundColor Green
Write-Host "Close those windows (or press Ctrl+C in each) to stop services." -ForegroundColor Yellow
