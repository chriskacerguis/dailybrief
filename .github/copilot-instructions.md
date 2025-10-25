# GitHub Copilot Instructions for Daily Brief

## Project Overview
This is an emergency management situation report generator for Austin, TX. It uses OpenAI's GPT models to generate daily briefs that are sent via email with color-coded threat level banners based on the DHS Homeland Security Advisory System.

## Key Architecture Decisions

### Model Configuration
- **Default Model**: `gpt-4o` (not gpt-5, as it returns empty responses)
- **Model Parameter**: Use `max_completion_tokens` instead of `max_tokens`
- **Temperature**: Do NOT set temperature parameter for gpt-4o/gpt-5 models (only default value of 1 is supported)
- **Model Selection**: Configurable via `OPENAI_MODEL` environment variable

### Prompt System
- The AI prompt is stored in `prompt.txt` for easy customization without code changes
- Must return content starting with `THREAT_LEVEL: [LOW|GUARDED|ELEVATED|HIGH|SEVERE]`
- HTML content should NOT be wrapped in code blocks, html/head/body tags
- Use semantic HTML tags: `<h3>`, `<h4>`, `<p>`, `<ul>`, `<li>`, etc.

### Threat Levels (DHS Colors)
```javascript
LOW:      Green  (#5cb85c)
GUARDED:  Blue   (#5bc0de)
ELEVATED: Yellow (#f0ad4e)
HIGH:     Orange (#d9534f)
SEVERE:   Red    (#d9534f)
```

### Email Configuration
- Uses Nodemailer with SMTP
- Bootstrap 5.3.0 for styling (loaded from CDN)
- Inline styles for email client compatibility
- Color-coded banner matches threat level

## Code Patterns

### When Adding New Features
1. **Environment Variables**: Add to `.env.example` with descriptive comments
2. **Error Handling**: Use try/catch and throw descriptive errors
3. **Logging**: Use console.log for progress, console.error for errors
4. **Module Exports**: Export functions for potential testing

### Content Cleaning
Always clean GPT responses to remove:
- Markdown code blocks (```html, ```)
- Leading/trailing whitespace
- The `THREAT_LEVEL:` prefix before inserting into email

### Email HTML
- Use inline styles (email clients don't support external CSS well)
- Test color values against threat levels
- Keep max-width at 800px for readability
- Use semantic HTML for accessibility

## Dependencies

### Core Dependencies
- `openai`: ^4.68.0+ (latest version to avoid punycode deprecation)
- `nodemailer`: ^6.9.7+ (latest version)
- `dotenv`: ^16.4.5+

### Avoiding Deprecation Warnings
- Always use latest versions of openai and nodemailer packages
- Do NOT use `node --no-deprecation` flags; fix the actual dependency issues

## Common Tasks

### Testing Email Output
```bash
npm start
```

### Customizing the Report
Edit `prompt.txt` - no code changes needed

### Changing GPT Model
Update `OPENAI_MODEL` in `.env`:
- `gpt-4o` (recommended default)
- `gpt-4o-mini` (cheaper, faster)
- `gpt-4-turbo` (previous generation)

### Scheduling
- macOS/Linux: Use cron
- Windows: Use Task Scheduler
- See README.md for examples

## File Structure
```
dailybrief/
├── index.js          # Main application logic
├── prompt.txt        # AI prompt (user-editable)
├── package.json      # Dependencies
├── .env             # Configuration (NOT in git)
├── .env.example     # Configuration template
├── .gitignore       # Git ignore rules
└── README.md        # Documentation
```

## Environment Variables (Required)
```env
OPENAI_API_KEY=sk-...           # Required: OpenAI API key
OPENAI_MODEL=gpt-4o             # Optional: defaults to gpt-4o
EMAIL_FROM=sender@example.com   # Required
EMAIL_TO=recipient@example.com  # Required
EMAIL_HOST=smtp.gmail.com       # Required
EMAIL_PORT=587                  # Required
EMAIL_USER=user@example.com     # Required
EMAIL_PASSWORD=app-password     # Required (use app password for Gmail)
EMAIL_SECURE=false              # Optional: true for port 465, false for 587
```

## Best Practices

### When Suggesting Code Changes
1. Always preserve the threat level color scheme
2. Maintain Bootstrap compatibility
3. Keep prompt.txt customizable and separate from code
4. Use environment variables for configuration
5. Include error handling with descriptive messages
6. Log progress to console for debugging

### When Debugging
1. Check `Raw response length:` in console output
2. Verify `OPENAI_MODEL` being used
3. Ensure no markdown code blocks in output
4. Check threat level parsing with regex
5. Validate HTML structure in email template

### Security Reminders
- Never commit `.env` file
- Use app-specific passwords for email
- Keep API keys secure
- Validate all environment variables before use

## Known Issues
- **gpt-5**: Returns empty responses; use gpt-4o instead
- **Temperature**: Newer models don't support custom temperature values
- **max_tokens**: Use `max_completion_tokens` for newer models

## Testing Checklist
- [ ] Email sends successfully
- [ ] Threat level banner shows correct color
- [ ] Content is not empty
- [ ] No markdown code blocks in email
- [ ] Footer includes KJ5DJC credit
- [ ] Bootstrap styles load correctly
- [ ] Responsive on mobile
- [ ] No deprecation warnings
