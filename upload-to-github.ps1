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

# Function to check if command succeeded
function Test-Command {
    param($Command, $Description)
    Write-Host "$Description..." -ForegroundColor Cyan
    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed with exit code $LASTEXITCODE"
        }
        Write-Host "✓ Success" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Failed: $_" -ForegroundColor Red
        return $false
    }
}

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
if (-not (Test-Command "git init" "Step 1: Initializing Git repository")) {
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Add all files
if (-not (Test-Command "git add ." "Step 2: Adding all files to Git")) {
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Create initial commit
$commitMessage = "Initial commit: UK Government Services Platform`n`n- Complete government services platform with MP search`n- Newsletter subscription system with email templates`n- Citizen rights and voting information`n- Legal compliance pages (Privacy Policy, Cookie Policy)`n- Responsive design with accessibility features`n- Created by Ibrahim Altaqatqa (owl47d@gmail.com)"

if (-not (Test-Command "git commit -m `"$commitMessage`"" "Step 3: Creating initial commit")) {
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 4: Set main branch
if (-not (Test-Command "git branch -M main" "Step 4: Setting up main branch")) {
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
if (-not (Test-Command "git remote add origin $repoUrl" "Step 5: Adding remote origin")) {
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 7: Push to GitHub
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "Note: You may be prompted for GitHub authentication." -ForegroundColor Yellow

try {
    git push -u origin main
    if ($LASTEXITCODE -ne 0) {
        throw "Push failed"
    }
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