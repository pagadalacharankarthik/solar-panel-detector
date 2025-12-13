# GitHub Repository Setup Guide

This guide will help you clean up your project and push it to GitHub as a professional repository.

## 0. Prerequisites (Install Git) 🛠️

If you see `git: The term 'git' is not recognized`, you need to install it first.

Run these commands in your PowerShell:

```powershell
# 1. Install Git
winget install -e --id Git.Git

# 2. Install Git LFS
winget install -e --id GitHub.GitLFS

# 3. RESTART TERMINAL (Close and Re-open PowerShell)
```

## 1. Cleanup Unnecessary Files 🧹

Before pushing, remove large files and temporary data to keep your repo clean.

**Delete these files/folders if they exist:**
*   `solar panels.v1i.yolov8.zip` (The 38MB dataset zip)
*   `test/` (This looks like a Roboflow export folder, safe to delete if you have the zip)
*   `README.roboflow.txt`
*   `README.dataset.txt`
*   `.gitignore`

## 2. Initialize Git & LFS 🛠️

Run these commands **in order**. You must initialize the repository *before* setting up LFS.

```powershell
# 1. Initialize Git (MUST DO THIS FIRST)
git init

# 2. Setup Large File Support (For 176MB model)
git lfs install
git lfs track "*.pt"
git add .gitattributes

# 3. Add all files
git add .

# 4. Commit (Save)
git commit -m "Initial commit of Solar Panel Detector"
```

---

## 3. Push to GitHub 🚀

1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click the **+** icon (top right) -> **New repository**.
3.  Name it: `solar-panel-detector`.
4.  Description: "AI-powered rooftop solar panel detection using Mask R-CNN and reacting satellite imagery."
5.  **Public** is usually best for hackathons.
6.  **Do NOT** initialize with README, .gitignore, or License (you already have them).
7.  Click **Create repository**.
8.  Copy the commands under "**…or push an existing repository from the command line**". It will look like this:

```bash
git remote add origin https://github.com/YOUR_USERNAME/solar-panel-detector.git
git branch -M main
git push -u origin main
```

Run those 3 commands in your terminal.

---

## 4. Final Verification ✅

Refresh your GitHub page. You should see:
*   Your code structured in `antigravity/`
*   Your beautiful `README.md` on the front page.
*   Your `Training_Notebook.ipynb` for judges to review methodology.

**Congratulations! Your project is live.** 🎉
