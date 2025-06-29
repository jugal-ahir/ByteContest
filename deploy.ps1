# ByteContest Deployment Script for Windows
# This script helps prepare your application for deployment

Write-Host "🚀 ByteContest Deployment Preparation" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not found. Please initialize git first:" -ForegroundColor Red
    Write-Host "   git init" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Yellow
    Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Yellow
    Write-Host "   git remote add origin your-github-repo-url" -ForegroundColor Yellow
    exit 1
}

# Check if all required files exist
Write-Host "📋 Checking required files..." -ForegroundColor Cyan

$requiredFiles = @(
    "server/package.json",
    "client/package.json",
    "server/src/index.ts",
    "client/src/main.tsx",
    "render.yaml",
    "DEPLOYMENT_GUIDE.md"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        exit 1
    }
}

# Check environment files
Write-Host ""
Write-Host "🔧 Environment Configuration:" -ForegroundColor Cyan
if (Test-Path "server/.env") {
    Write-Host "✅ Server .env found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Server .env not found - you'll need to set environment variables in Render" -ForegroundColor Yellow
}

if (Test-Path "client/.env") {
    Write-Host "✅ Client .env found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Client .env not found - you'll need to set environment variables in Render" -ForegroundColor Yellow
}

# Check if code is committed
Write-Host ""
Write-Host "📦 Git Status:" -ForegroundColor Cyan
$gitStatus = git status --porcelain
if ($gitStatus -eq $null) {
    Write-Host "✅ All changes are committed" -ForegroundColor Green
} else {
    Write-Host "⚠️  You have uncommitted changes. Please commit them before deploying:" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Yellow
    Write-Host "   git commit -m 'Prepare for deployment'" -ForegroundColor Yellow
}

# Check if remote is set
Write-Host ""
Write-Host "🌐 Remote Repository:" -ForegroundColor Cyan
try {
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl) {
        Write-Host "✅ Remote origin is set" -ForegroundColor Green
        Write-Host "   URL: $remoteUrl" -ForegroundColor Gray
    } else {
        Write-Host "❌ No remote origin set. Please add your GitHub repository:" -ForegroundColor Red
        Write-Host "   git remote add origin your-github-repo-url" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ No remote origin set. Please add your GitHub repository:" -ForegroundColor Red
    Write-Host "   git remote add origin your-github-repo-url" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Green
Write-Host "1. Push your code to GitHub:" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Follow the deployment guide:" -ForegroundColor White
Write-Host "   Get-Content DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Deploy on Render.com:" -ForegroundColor White
Write-Host "   - Go to render.com" -ForegroundColor Yellow
Write-Host "   - Connect your GitHub repository" -ForegroundColor Yellow
Write-Host "   - Deploy backend first, then frontend" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Set environment variables in Render dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Test all features after deployment" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan 