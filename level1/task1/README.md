# Level 1 – Task 1: Development Environment Setup

## Objective
Install and configure all tools required for full-stack web development as part of the Codveda Technology Full-Stack Internship.

## Installed Tools

| Tool             | Version (this machine) | Purpose                                          |
|------------------|------------------------|--------------------------------------------------|
| Node.js          | v20.20.0               | JavaScript runtime for backend                   |
| npm              | 10.8.2                 | Package manager                                  |
| Git              | 2.52.0                 | Version control                                  |
| Visual Studio Code | latest               | Code editor                                      |
| MongoDB Atlas    | cloud                  | Cloud-hosted document database                   |
| Postman / Thunder Client | latest         | API testing                                      |
| Google Chrome    | latest                 | Browser & DevTools                               |

## Verifying the Setup

Run the following in PowerShell to confirm tools are available:

```powershell
node --version
npm --version
git --version
code --version
```

## MongoDB Atlas

This internship uses **MongoDB Atlas** (cloud) instead of a local MongoDB install:

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free **M0** cluster.
3. Add a database user and whitelist your IP (or `0.0.0.0/0` for development).
4. Copy the connection string – it looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>
   ```
5. Paste it into the `.env` file of any task that needs a database.

## Folder Structure (this repo)

See the [main README](../../README.md) for the full repository tree.

## Status
Environment is fully configured and verified.
