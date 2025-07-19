# Fix backend installation issues
Write-Host "Fixing backend installation..." -ForegroundColor Green

# Change to backend directory
Set-Location -Path ".\backend"

# Ensure we have pip updated
Write-Host "Updating pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install the simplified requirements
Write-Host "Installing simplified requirements..." -ForegroundColor Yellow
pip install -r requirements-simple.txt

Write-Host "`nInstallation complete!" -ForegroundColor Green
Write-Host "You can now run the backend with: python -m uvicorn app.main:app --reload" -ForegroundColor Cyan
