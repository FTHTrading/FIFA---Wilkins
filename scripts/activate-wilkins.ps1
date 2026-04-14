param(
    [string]$Brand = 'fthtrading-fifa-wilkins',
    [switch]$PagesOnly,
    [switch]$NoBrowser,
    [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$brandSource = Join-Path $RepoRoot ("branding\brands\{0}.json" -f $Brand)
$pagesBrandTarget = Join-Path $RepoRoot 'docs\brand.json'
$envFile = Join-Path $RepoRoot '.env'
$envExample = Join-Path $RepoRoot '.env.example'

function Assert-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found in PATH."
    }
}

if (-not (Test-Path $brandSource)) {
    throw "Brand pack not found: $brandSource"
}

Copy-Item $brandSource $pagesBrandTarget -Force
Write-Host "Synced brand pack '$Brand' to docs/brand.json" -ForegroundColor Cyan

if ($PagesOnly) {
    Write-Host 'Pages branding sync complete. No local services started.' -ForegroundColor Green
    exit 0
}

Assert-Command 'pnpm'
Assert-Command 'docker'

if (-not (Test-Path $envFile)) {
    Copy-Item $envExample $envFile -Force
    Write-Host 'Created .env from .env.example' -ForegroundColor Yellow
}

Push-Location $RepoRoot
try {
    if (-not $SkipInstall) {
        Write-Host 'Installing workspace dependencies...' -ForegroundColor Cyan
        pnpm install
    }

    Write-Host 'Starting PostgreSQL and Redis...' -ForegroundColor Cyan
    docker compose up -d postgres redis

    Write-Host 'Generating Prisma client...' -ForegroundColor Cyan
    pnpm db:generate

    Write-Host 'Running Prisma migrations...' -ForegroundColor Cyan
    pnpm db:migrate

    Write-Host 'Seeding Atlanta FIFA demo data...' -ForegroundColor Cyan
    pnpm db:seed:atlanta

    $devCommand = "Set-Location '$RepoRoot'; pnpm dev"
    Write-Host 'Launching Turborepo dev stack in a new PowerShell window...' -ForegroundColor Cyan
    Start-Process powershell -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $devCommand | Out-Null

    if (-not $NoBrowser) {
        Start-Process 'http://localhost:3000'
        Start-Process 'http://localhost:3003/dashboard'
        Start-Process 'http://localhost:4000/docs'
    }

    Write-Host ''
    Write-Host 'FIFA---Wilkins activation complete.' -ForegroundColor Green
    Write-Host 'Guest app:         http://localhost:3000' -ForegroundColor Gray
    Write-Host 'Admin CMS:         http://localhost:3001' -ForegroundColor Gray
    Write-Host 'Staff console:     http://localhost:3002' -ForegroundColor Gray
    Write-Host 'Revenue console:   http://localhost:3003/dashboard' -ForegroundColor Gray
    Write-Host 'Swagger:           http://localhost:4000/docs' -ForegroundColor Gray
}
finally {
    Pop-Location
}