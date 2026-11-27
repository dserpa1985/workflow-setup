# Workflow Setup

A comprehensive GitHub Actions workflow for executing setup scripts with enhanced error handling, logging, and debugging capabilities.

## 📋 Features

✅ **Robust Execution**
- Automatic file validation before running
- Exit on error with proper error handling
- Command echo for debugging visibility

✅ **Smart Triggering**
- Only runs when `setup.sh` or workflow changes
- Manual trigger via `workflow_dispatch`
- Configurable branch targets (main/master)

✅ **Comprehensive Logging**
- Output capture to log files
- Artifact upload for later review
- GitHub Step Summary reports
- 7-day retention for artifacts

✅ **Debugging Tools**
- File permission display
- Script content preview (first 50 lines)
- Full command execution logging
- Detailed error messages

✅ **Professional Workflow**
- 30-minute timeout protection
- Minimal permissions scoping
- Success/failure notifications
- Job status reporting

## 🚀 Quick Start

### 1. Customize Your Setup Script

Edit `setup.sh` with your actual setup commands:

```bash
#!/bin/bash
set -e

echo "Running custom setup..."
# Add your commands here
npm install
npm run build
echo "✓ Setup complete!"
```

### 2. Commit and Push

```bash
git add setup.sh .github/workflows/run-setup.yml
git commit -m "Initial setup workflow"
git push origin main
```

### 3. Monitor Execution

- Go to **Actions** tab in your repository
- Click on the workflow run
- View logs and Step Summary report
- Download artifacts if needed

## 📁 File Structure

```
.
├── .github/
│   └── workflows/
│       └── run-setup.yml          # Main workflow file
├── setup.sh                        # Setup script (customize this)
└── README.md                       # This file
```

## ⚙️ Workflow Configuration

### Trigger Events

- **Push to main/master**: When `setup.sh` or workflow changes
- **Manual Trigger**: Via `workflow_dispatch` button

### Environment Variables

The workflow sets:
- `CI=true` - Indicates CI environment
- `GITHUB_ACTIONS=true` - GitHub Actions environment flag

### Timeout

- **Default**: 30 minutes
- **Edit**: Modify `timeout-minutes` in workflow file

## 📊 Outputs

### Artifacts

Uploaded to each workflow run:
- `setup-output.log` - Full script output
- `*.log` - Any additional log files
- **Retention**: 7 days

### Step Summary

GitHub generates an automatic summary containing:
- Workflow run link
- Branch and commit info
- Execution status
- Timestamp
- Next steps guide

## 🔧 Customization

### Add More Branches

Edit `.github/workflows/run-setup.yml`:

```yaml
on:
  push:
    branches:
      - main
      - master
      - develop        # Add more branches
```

### Monitor Specific File Changes

```yaml
on:
  push:
    paths:
      - 'setup.sh'
      - 'package.json'  # Add other files
      - '.github/workflows/run-setup.yml'
```

### Add Notifications

Add to the workflow after the failure step:

```yaml
- name: Slack Notification
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Caching

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-${{ hashFiles('package-lock.json') }}
```

## 🐛 Troubleshooting

### Script Not Found Error
- Ensure `setup.sh` exists in repository root
- Check file is committed and pushed

### Permission Denied
- The workflow automatically runs `chmod +x setup.sh`
- If still failing, check script syntax with `bash -n setup.sh`

### Script Fails Silently
- Check the `setup-output.log` in artifacts
- Review the full workflow run logs
- Add `set -x` to script for debug output

### Workflow Not Triggering
- Verify you pushed to `main` or `master`
- Check `setup.sh` was actually modified
- Use `workflow_dispatch` for manual trigger

## 📚 Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Best Practices](https://docs.github.com/en/actions/guides)

## 📝 Example Setup Scripts

### Node.js Project
```bash
#!/bin/bash
set -e
npm install
npm run lint
npm run test
npm run build
```

### Python Project
```bash
#!/bin/bash
set -e
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m pytest
```

### Docker Build
```bash
#!/bin/bash
set -e
docker build -t myapp:latest .
docker run myapp:latest npm test
```

## 🤝 Contributing

Feel free to customize and extend this workflow for your needs!

## 📄 License

This workflow template is provided as-is. Use and modify freely.

---

**Repository**: [dserpa1985/workflow-setup](https://github.com/dserpa1985/workflow-setup)
