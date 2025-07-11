# UK Government Services - GitHub Upload Script
# PowerShell version for better error handling

Write-Host "========================================" -ForegroundColor Green
Write-Host "UK Government Services - GitHub Upload" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "This script will help you upload your project to GitHub." -ForegroundColor Yellow
Write-Host "Make sure you have:" -ForegroundColor Yellow
Write-Host "1. Created a new repository on GitHub" -ForegroundColor White
Write-Host "2. Have Git installed" -ForegroundColor White
Write-Host "3. Are logged into GitHub" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"

# Check if Git is installed
Write-Host "Checking if Git is installed..." -ForegroundColor Cyan
try {
    $gitVersion = git --version
    Write-Host "✓ Git found: $gitVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Git not found. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Step 1: Initialize Git repository
Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Cyan
try {
    git init
    if ($LASTEXITCODE -ne 0) { throw "Git init failed" }
    Write-Host "✓ Success" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to initialize Git repository" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Add all files
Write-Host "Step 2: Adding all files to Git..." -ForegroundColor Cyan
try {
    git add .
    if ($LASTEXITCODE -ne 0) { throw "Git add failed" }
    Write-Host "✓ Success" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to add files" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Create initial commit
Write-Host "Step 3: Creating initial commit..." -ForegroundColor Cyan
$commitMessage = "Initial commit: UK Government Services Platform - Complete government services platform with MP search, newsletter subscription, and legal compliance pages. Created by Ibrahim Altaqatqa."
try {
    git commit -m $commitMessage
    if ($LASTEXITCODE -ne 0) { throw "Git commit failed" }
    Write-Host "✓ Success" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to create commit" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 4: Set main branch
Write-Host "Step 4: Setting up main branch..." -ForegroundColor Cyan
try {
    git branch -M main
    if ($LASTEXITCODE -ne 0) { throw "Branch setup failed" }
    Write-Host "✓ Success" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to set main branch" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 5: Get repository URL
Write-Host ""
Write-Host "Now you need to add your GitHub repository URL." -ForegroundColor Yellow
Write-Host "Example: https://github.com/YOUR_USERNAME/uk-government-services.git" -ForegroundColor Gray
Write-Host ""
$repoUrl = Read-Host "Enter your GitHub repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "✗ Repository URL cannot be empty." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 6: Add remote origin
Write-Host "Step 5: Adding remote origin..." -ForegroundColor Cyan
try {
    git remote add origin $repoUrl
    if ($LASTEXITCODE -ne 0) { throw "Remote add failed" }
    Write-Host "✓ Success" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to add remote origin" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 7: Push to GitHub
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "Note: You may be prompted for GitHub authentication." -ForegroundColor Yellow

try {
    git push -u origin main
    if ($LASTEXITCODE -ne 0) { throw "Push failed" }
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to push to GitHub." -ForegroundColor Red
    Write-Host "This might be due to authentication issues." -ForegroundColor Yellow
    Write-Host "Try one of these solutions:" -ForegroundColor Yellow
    Write-Host "1. Run: gh auth login" -ForegroundColor White
    Write-Host "2. Use a Personal Access Token" -ForegroundColor White
    Write-Host "3. Set up SSH keys" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "SUCCESS! Your project has been uploaded to GitHub!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your repository is now available at:" -ForegroundColor Yellow
Write-Host $repoUrl -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit your GitHub repository" -ForegroundColor White
Write-Host "2. Enable GitHub Pages for live demo" -ForegroundColor White
Write-Host "3. Add topics/tags for better discoverability:" -ForegroundColor White
Write-Host "   react, typescript, government, uk-government, mp-search, newsletter" -ForegroundColor Gray
Write-Host "4. Add the repository to your portfolio" -ForegroundColor White
Write-Host "5. Share your project!" -ForegroundColor White
Write-Host ""
Write-Host "Repository created by: Ibrahim Altaqatqa (owl47d@gmail.com)" -ForegroundColor Magenta
Write-Host "Location: Manchester, UK" -ForegroundColor Magenta
Write-Host ""
Read-Host "Press Enter to exit"