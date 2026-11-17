# Run the app locally on Windows.
#
# Usage (from the project root):
#   .\scripts\run.ps1                 # install if needed, generate Prisma client, start dev server
#   .\scripts\run.ps1 -Migrate        # also apply the schema to the DB in .env
#   .\scripts\run.ps1 -Seed           # also seed the DB (prisma/seed.ts)
#   .\scripts\run.ps1 -Prod           # production build, then npm start
#   .\scripts\run.ps1 -Prod -Migrate  # combine flags as needed

param(
    [switch]$Prod,
    [switch]$Migrate,
    [switch]$Seed
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Invoke-Step {
    param([string]$Title, [scriptblock]$Action)
    Write-Host "==> $Title" -ForegroundColor Cyan
    & $Action
    if ($LASTEXITCODE -ne 0) {
        throw "Step failed: $Title (exit code $LASTEXITCODE)"
    }
}

if (-not (Test-Path '.env')) {
    throw ".env not found in $root. Create it with DATABASE_URL before running."
}

if (-not (Test-Path 'node_modules')) {
    Invoke-Step 'Installing dependencies (npm ci)' { npm ci }
}

Invoke-Step 'Generating Prisma client' { npx prisma generate }

if ($Migrate) {
    $hasMigrations = (Test-Path 'prisma/migrations') -and
        (Get-ChildItem 'prisma/migrations' -Directory -ErrorAction SilentlyContinue |
            Where-Object { Test-Path (Join-Path $_.FullName 'migration.sql') })
    if ($hasMigrations) {
        Invoke-Step 'Applying migrations (migrate deploy)' { npx prisma migrate deploy }
    } else {
        Write-Host 'No migrations found in prisma/migrations, using db push instead.' -ForegroundColor Yellow
        Invoke-Step 'Syncing schema (db push)' { npx prisma db push --skip-generate }
    }
}

if ($Seed) {
    Invoke-Step 'Seeding database' { npx prisma db seed }
}

if ($Prod) {
    Invoke-Step 'Building for production' { npm run build }
    Invoke-Step 'Starting production server' { npm start }
} else {
    Invoke-Step 'Starting dev server' { npm run dev }
}
