Security guidance for this repository

1) Sensitive file found
- A file named `.env.local` exists in the repository root and currently contains a MongoDB connection string.
- Action: rotate those credentials immediately in your Atlas/DB provider.

2) Remove secrets from the repo (recommended steps)
- If the secret was ever committed, simply deleting the file is not enough — it remains in Git history.
- Recommended (careful, destructive):
  - Use `git filter-repo` to remove the secret from history (preferred) or `git filter-branch` (older).
  - Example using `git filter-repo` (install first):

    git clone --mirror <repo-url> repo-mirror.git
    cd repo-mirror.git
    git filter-repo --path .env.local --invert-paths
    git push --force

- Alternatively, remove file and rotate credentials, then consider using `BFG Repo-Cleaner` as a simpler option.

3) Prevent future leaks
- `.gitignore` already includes `.env*` but double-check before committing.
- Use environment variable management on deployment platforms (Vercel, Render, Render Secrets, GitHub Actions secrets).
- Do not commit any credentials to the repo.

4) Test MongoDB connection locally
- Use the provided script `scripts/test-mongo.js` which tries `process.env.MONGODB_URI` or falls back to `mongodb://localhost:27017/cakeshop`.
- Example local test with Atlas URI (replace values):

  MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/cakeshop?retryWrites=true&w=majority" node scripts/test-mongo.js

5) Next steps I can take for you
- Remove or redact the `.env.local` file here and create a sanitized `.env.local.example` (I can do this).
- Help rotate credentials and provide recommended `git filter-repo` commands (I can generate exact commands for your environment).

If you want me to redact the local `.env.local` in this workspace and create a sanitized `.env.local.example`, confirm and I will apply the change now.
