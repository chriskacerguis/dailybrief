# Quick Setup Guide

Your Emergency Management Daily Brief app is ready! Here's what you need to do:

## Step 1: Configure Your Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   - **OPENAI_API_KEY**: Get from https://platform.openai.com/api-keys
   - **OPENAI_MODEL**: Set to `gpt-5` (default) or other model
   - **EMAIL_***: Your SMTP email configuration

## Step 2: Test the App

```bash
npm start
```

## What You Get

✅ Automated emergency management reports for Austin, TX
✅ Color-coded threat levels (DHS Homeland Security colors)
✅ Professional Bootstrap-styled HTML emails
✅ Customizable AI prompts (edit `prompt.txt`)
✅ Configurable GPT model via environment variable

## Key Files

- `index.js` - Main application
- `prompt.txt` - Edit this to customize AI analysis (no code changes needed!)
- `.env` - Your configuration (NEVER commit this!)
- `README.md` - Full documentation

## Default Model

The app defaults to **GPT-5** as requested. You can change this in `.env`:
```
OPENAI_MODEL=gpt-5
```

## Next Steps

1. Set up your `.env` file
2. Run `npm start` to test
3. Check your email for the report
4. Customize `prompt.txt` as needed
5. Set up cron/Task Scheduler for automation (see README.md)

Enjoy your automated daily briefs! 🚀
