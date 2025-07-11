@echo off
echo ========================================
echo UK Government Services - GitHub Upload
echo ========================================
echo.
echo This script will help you upload your project to GitHub.
echo Make sure you have:
echo 1. Created a new repository on GitHub
echo 2. Have Git installed
echo 3. Are logged into GitHub
echo.
pause

echo.
echo Step 1: Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo Error: Git initialization failed. Make sure Git is installed.
    pause
    exit /b 1
)

echo.
echo Step 2: Adding all files to Git...
git add .
if %errorlevel% neq 0 (
    echo Error: Failed to add files to Git.
    pause
    exit /b 1
)

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial commit: UK Government Services Platform - Complete government services platform with MP search, Newsletter subscription system with email templates, Citizen rights and voting information, Legal compliance pages, Responsive design with accessibility features, Created by Ibrahim Altaqatqa (owl47d@gmail.com)"
if %errorlevel% neq 0 (
    echo Error: Failed to create commit.
    pause
    exit /b 1
)

echo.
echo Step 4: Setting up main branch...
git branch -M main
if %errorlevel% neq 0 (
    echo Error: Failed to set main branch.
    pause
    exit /b 1
)

echo.
echo Now you need to add your GitHub repository URL.
echo Example: https://github.com/YOUR_USERNAME/uk-government-services.git
echo.
set /p repo_url="Enter your GitHub repository URL: "

echo.
echo Step 5: Adding remote origin...
git remote add origin %repo_url%
if %errorlevel% neq 0 (
    echo Error: Failed to add remote origin.
    pause
    exit /b 1
)

echo.
echo Step 6: Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo Error: Failed to push to GitHub. You may need to authenticate.
    echo Try running: gh auth login
    echo Or use a Personal Access Token
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Your project has been uploaded to GitHub!
echo ========================================
echo.
echo Your repository should now be available at:
echo %repo_url%
echo.
echo Next steps:
echo 1. Visit your GitHub repository
echo 2. Enable GitHub Pages for live demo
echo 3. Add topics/tags for better discoverability
echo 4. Share your project!
echo.
pause