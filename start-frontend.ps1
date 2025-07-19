# Frontend startup script for PowerShell
Write-Host "Starting RepoScope Frontend..." -ForegroundColor Green

# Change to frontend directory
Set-Location -Path ".\frontend"

# Create .env file if it doesn't exist
if (-Not (Test-Path ".\.env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# Check if bun is installed
$bunInstalled = Get-Command bun -ErrorAction SilentlyContinue
if ($bunInstalled) {
    Write-Host "Using Bun package manager..." -ForegroundColor Cyan
    
    # Install dependencies
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    bun install
    
    # Start the frontend
    Write-Host "Starting Vite dev server on http://localhost:3000" -ForegroundColor Green
    bun run dev
} else {
    Write-Host "Bun not found, using npm..." -ForegroundColor Yellow
    
    # Install dependencies
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    # Start the frontend
    Write-Host "Starting Vite dev server on http://localhost:3000" -ForegroundColor Green
    npm run dev
}
