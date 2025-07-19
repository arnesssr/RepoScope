# Backend startup script for PowerShell
Write-Host "Starting RepoScope Backend..." -ForegroundColor Green

# Change to backend directory
Set-Location -Path ".\backend"

# Check if virtual environment exists
if (-Not (Test-Path ".\venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
# Try simplified requirements if full requirements fail
if (Test-Path ".\requirements-simple.txt") {
    Write-Host "Using simplified requirements for easier setup..." -ForegroundColor Cyan
    pip install -r requirements-simple.txt
} else {
    pip install -r requirements.txt
}

# Create .env file if it doesn't exist
if (-Not (Test-Path ".\.env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please edit backend\.env file with your API keys!" -ForegroundColor Red
}

# Start the backend
Write-Host "Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation available at http://localhost:8000/docs" -ForegroundColor Cyan
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
