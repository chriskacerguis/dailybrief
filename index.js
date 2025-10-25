const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');
const OpenAI = require('openai');
require('dotenv').config();

// Threat level configurations with DHS colors
const THREAT_LEVELS = {
  LOW: {
    color: '#5cb85c',
    bgColor: '#d4edda',
    textColor: '#155724',
    label: 'Low - Green'
  },
  GUARDED: {
    color: '#5bc0de',
    bgColor: '#d1ecf1',
    textColor: '#0c5460',
    label: 'Guarded - Blue'
  },
  ELEVATED: {
    color: '#f0ad4e',
    bgColor: '#fff3cd',
    textColor: '#856404',
    label: 'Elevated - Yellow'
  },
  HIGH: {
    color: '#d9534f',
    bgColor: '#f8d7da',
    textColor: '#721c24',
    label: 'High - Orange'
  },
  SEVERE: {
    color: '#d9534f',
    bgColor: '#f8d7da',
    textColor: '#721c24',
    label: 'Severe - Red'
  }
};

async function loadPrompt() {
  try {
    const promptPath = path.join(__dirname, 'prompt.txt');
    const prompt = await fs.readFile(promptPath, 'utf-8');
    return prompt;
  } catch (error) {
    console.error('Error loading prompt file:', error);
    throw new Error('Failed to load prompt template');
  }
}

async function generateReport() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = await loadPrompt();
    
    const modelToUse = process.env.OPENAI_MODEL || "gpt-4o";
    console.log('Using model:', modelToUse);
    console.log('Generating situation report...');
    
    const completion = await openai.chat.completions.create({
      model: modelToUse,
      messages: [
        {
          role: "system",
          content: "You are an expert emergency management analyst providing situation reports."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 2500
    });

    const response = completion.choices[0].message.content;
    
    console.log('Raw response length:', response.length);
    console.log('Raw response:', response);
    
    // Remove markdown code blocks if present - handle all variations
    let cleanedResponse = response.trim();
    
    // Remove opening code blocks
    cleanedResponse = cleanedResponse.replace(/^```[a-z]*\n?/i, '');
    
    // Remove closing code blocks
    cleanedResponse = cleanedResponse.replace(/\n?```\s*$/i, '');
    
    // Clean up any remaining stray backticks
    cleanedResponse = cleanedResponse.trim();
    
    console.log('Response preview:', cleanedResponse.substring(0, 200) + '...');
    
    return cleanedResponse;
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Failed to generate report from OpenAI API');
  }
}

function parseThreatLevel(reportContent) {
  const match = reportContent.match(/THREAT_LEVEL:\s*(LOW|GUARDED|ELEVATED|HIGH|SEVERE)/i);
  if (match) {
    return match[1].toUpperCase();
  }
  return 'GUARDED';
}

function cleanReportContent(reportContent) {
  const cleaned = reportContent.replace(/THREAT_LEVEL:\s*(LOW|GUARDED|ELEVATED|HIGH|SEVERE)\s*/i, '').trim();
  console.log('Cleaned content length:', cleaned.length);
  console.log('Cleaned content preview:', cleaned.substring(0, 300));
  return cleaned;
}

function generateEmailHTML(reportContent, threatLevel) {
  const level = THREAT_LEVELS[threatLevel] || THREAT_LEVELS.GUARDED;
  const cleanContent = cleanReportContent(reportContent);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emergency Management Daily Brief - Austin, TX</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .email-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .threat-banner {
      padding: 30px;
      text-align: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      background: linear-gradient(135deg, ${level.color} 0%, ${level.color}dd 100%);
    }
    .threat-label {
      font-size: 14px;
      margin-top: 10px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .header-info {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 25px;
    }
    .footer {
      background-color: #343a40;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 12px;
    }
    h1, h2, h3, h4 {
      color: #333;
    }
    .alert-info {
      background-color: ${level.bgColor};
      border-left: 4px solid ${level.color};
      color: ${level.textColor};
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="threat-banner" style="background-color: ${level.color};">
      Threat Level: ${threatLevel}
      <div class="threat-label">${level.label}</div>
    </div>

    <div class="content">
      <div class="header-info">
        <h2 style="margin: 0; color: #333;">Emergency Management Daily Brief</h2>
        <p style="margin: 5px 0 0 0; color: #666;">
          <strong>Location:</strong> Austin, Texas<br>
          <strong>Date:</strong> ${currentDate}<br>
          <strong>Time:</strong> ${currentTime}
        </p>
      </div>

      <div class="alert-info">
        <strong>Current Threat Level: ${threatLevel}</strong> - ${level.label}
      </div>

      ${cleanContent}
    </div>

    <div class="footer">
      <p style="margin: 0;">Emergency Management Daily Brief System</p>
      <p style="margin: 5px 0 0 0;">This is an automated report. Do not reply to this email.</p>
      <p style="margin: 10px 0 0 0; font-size: 11px; opacity: 0.8;">Made with ❤️ by KJ5DJC in Austin, TX. <a href="https://github.com/chriskacerguis/dailybrief" style="color: #5bc0de; text-decoration: none;">GitHub</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

async function sendEmail(htmlContent, threatLevel) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `[${threatLevel}] Emergency Management Daily Brief - Austin, TX - ${currentDate}`,
      html: htmlContent
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

async function main() {
  try {
    console.log('=== Emergency Management Daily Brief Generator ===');
    console.log('Starting report generation...\n');

    const requiredEnvVars = [
      'OPENAI_API_KEY',
      'EMAIL_FROM',
      'EMAIL_TO',
      'EMAIL_HOST',
      'EMAIL_PORT',
      'EMAIL_USER',
      'EMAIL_PASSWORD'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}\nPlease create a .env file based on .env.example`);
    }

    const reportContent = await generateReport();
    console.log('✓ Report generated successfully\n');

    const threatLevel = parseThreatLevel(reportContent);
    console.log(`✓ Threat Level: ${threatLevel}\n`);

    const emailHTML = generateEmailHTML(reportContent, threatLevel);
    console.log('✓ Email template created\n');

    await sendEmail(emailHTML, threatLevel);
    console.log('✓ Email sent successfully\n');

    console.log('=== Daily Brief Complete ===');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, generateReport, generateEmailHTML, sendEmail };
