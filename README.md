# Emergency Management Daily Brief

An automated system that generates and emails daily emergency management situation reports for Austin, Texas using ChatGPT analysis.

## Features

- 🤖 **AI-Powered Analysis**: Uses OpenAI GPT (default: GPT-5) to generate comprehensive situation reports
- 📧 **Professional Email Reports**: Bootstrap-styled HTML emails with responsive design
- �� **Threat Level Indicators**: Color-coded banners using DHS Homeland Security Advisory System colors:
  - **LOW** (Green): Low risk of incidents
  - **GUARDED** (Blue): General risk, normal operations
  - **ELEVATED** (Yellow): Significant risk, heightened awareness needed
  - **HIGH** (Orange): High risk, serious concerns
  - **SEVERE** (Red): Severe risk, critical situation
- 📝 **Customizable Prompts**: Edit `prompt.txt` to adjust AI analysis without code changes
- ⚡ **Easy Scheduling**: Run manually or schedule via cron/Task Scheduler
- 🔧 **Configurable Model**: Change GPT model via environment variable

## Coverage Areas

The daily brief analyzes:
- Weather conditions and forecasts
- Power grid status (ERCOT)
- Cybersecurity threats
- Civil unrest and demonstrations
- Fire conditions and air quality
- Major incidents and public safety
- Public health concerns
- Critical infrastructure
- Special events

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key
- Email account with SMTP access

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create your `.env` file**:
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` with your credentials**:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-actual-api-key-here
   OPENAI_MODEL=gpt-5

   # Email Configuration
   EMAIL_FROM=your-email@example.com
   EMAIL_TO=recipient@example.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@example.com
   EMAIL_PASSWORD=your-app-password-here
   EMAIL_SECURE=false
   ```

### Email Setup

#### Gmail:
1. Enable 2FA on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in `EMAIL_PASSWORD`
4. Settings:
   - `EMAIL_HOST=smtp.gmail.com`
   - `EMAIL_PORT=587`
   - `EMAIL_SECURE=false`

#### Outlook/Hotmail:
- `EMAIL_HOST=smtp-mail.outlook.com`
- `EMAIL_PORT=587`
- `EMAIL_SECURE=false`

### OpenAI Model Options

Set `OPENAI_MODEL` in your `.env` file:
- `gpt-5` (default - latest model)
- `gpt-4o` (GPT-4 optimized)
- `gpt-4o-mini` (faster, cheaper)
- `gpt-3.5-turbo` (cheapest)

## Usage

### Run Once

```bash
npm start
```

### Schedule Automated Runs

#### macOS/Linux (cron)

Edit crontab:
```bash
crontab -e
```

Run twice daily (8 AM and 6 PM):
```cron
0 8 * * * cd /Users/chriskacerguis/Developer/dailybrief && /usr/local/bin/node index.js >> /tmp/dailybrief.log 2>&1
0 18 * * * cd /Users/chriskacerguis/Developer/dailybrief && /usr/local/bin/node index.js >> /tmp/dailybrief.log 2>&1
```

#### Windows (Task Scheduler)

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (daily at specific times)
4. Action: Start a program
   - Program: `C:\Program Files\nodejs\node.exe`
   - Arguments: `index.js`
   - Start in: Your project directory

## Customizing the Prompt

Edit `prompt.txt` to customize the AI analysis:
- Add or remove coverage areas
- Change focus or detail level
- Adjust threat assessment criteria
- Modify output format

No code changes needed - just edit and save!

## Project Structure

```
dailybrief/
├── index.js          # Main application
├── prompt.txt        # AI prompt (editable)
├── package.json      # Dependencies
├── .env             # Configuration (create from .env.example)
├── .env.example     # Template
├── .gitignore       # Git ignore
└── README.md        # This file
```

## Troubleshooting

**"Missing required environment variables"**
- Ensure `.env` file exists with all required variables

**"Failed to generate report"**
- Verify `OPENAI_API_KEY` is correct
- Check OpenAI account has credits
- Ensure internet connectivity

**"Failed to send email"**
- Verify SMTP settings
- For Gmail, use App Password (not regular password)
- Try `EMAIL_SECURE=true` with port 465, or `false` with 587

**Email not received**
- Check spam/junk folders
- Verify `EMAIL_TO` address
- Check email logs for bounces

## Cost Considerations

- **GPT-5**: ~$0.05-0.10 per report
- **GPT-4o**: ~$0.02-0.05 per report
- **GPT-4o-mini**: ~$0.01 per report
- Running twice daily = ~$3-6/month (GPT-5)

## Security

- Never commit `.env` to version control
- Keep API keys secure
- Use app-specific passwords for email
- Consider running on a secure server for automation

## License

MIT

---

**Note**: AI-generated reports should be verified through official sources before taking action.
