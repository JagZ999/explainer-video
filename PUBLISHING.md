# Publishing to GitHub (first-time guide)

You only need to do steps 1–2 once. The repo is already initialized and committed locally.

## 1. Create a GitHub account
If you don't have one: https://github.com/signup

## 2. Create an empty repository on GitHub
- Go to https://github.com/new
- **Repository name:** `explainer-video`
- Keep it **Public** (so others can `/plugin marketplace add` it). You can choose Private if you prefer.
- **Do NOT** check "Add a README / .gitignore / license" (this repo already has them).
- Click **Create repository**. Leave that page open — it shows your repo URL, e.g. `https://github.com/JagZ/explainer-video.git`.

## 3. Personalize before pushing
Edit these and replace the placeholders:
- `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` → set `"name"` under `author`/`owner` to your name.
- `README.md` → replace `JagZ` with your GitHub username.

## 4. Connect this folder to your repo and push
From inside this `explainer-video/` folder, run (replace `JagZ`):
```bash
git remote add origin https://github.com/JagZ/explainer-video.git
git branch -M main
git push -u origin main
```
Git will ask you to authenticate the first time. Easiest option: install the GitHub CLI and log in once, which sets up credentials for you:
```bash
brew install gh        # if you don't have it
gh auth login          # choose GitHub.com → HTTPS → login in browser
git push -u origin main
```
(Alternatively, when prompted for a password, paste a **Personal Access Token** from
https://github.com/settings/tokens — not your account password.)

## 5. Tell people how to use it
Once pushed, anyone can install it in Claude Code:
```
/plugin marketplace add JagZ/explainer-video
/plugin install explainer-video@explainer-video
/explainer
```

## Updating later
After making changes:
```bash
git add -A
git commit -m "Describe your change"
git push
```
