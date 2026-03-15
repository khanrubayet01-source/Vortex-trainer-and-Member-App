import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

async function testGmail() {
  console.log('--- Gmail SMTP Test ---')
  console.log('Email:', process.env.GMAIL_EMAIL)
  console.log('App Password:', process.env.GMAIL_APP_PASSWORD ? '****' + process.env.GMAIL_APP_PASSWORD.slice(-4) : 'MISSING')

  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Error: GMAIL_EMAIL or GMAIL_APP_PASSWORD not found in .env.local')
    process.exit(1)
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  try {
    console.log('Verifying connection...')
    await transporter.verify()
    console.log('✅ Connection Success! SMTP is working.')

    console.log('Sending test email to yourself...')
    const info = await transporter.sendMail({
      from: `"Vortex Test" <${process.env.GMAIL_EMAIL}>`,
      to: process.env.GMAIL_EMAIL,
      subject: 'Vortex SMTP Test 🚀',
      text: 'If you see this, your Gmail App Password is working perfectly!',
      html: '<b>If you see this, your Gmail App Password is working perfectly!</b>',
    })

    console.log('✅ Email Sent! Message ID:', info.messageId)
    console.log('Check your inbox (and spam folder) at:', process.env.GMAIL_EMAIL)
  } catch (err: any) {
    console.error('❌ SMTP Error:', err)
    
    if (err.code === 'EAUTH') {
      console.log('\nPossible fixes:')
      console.log('1. Double check the GMAIL_APP_PASSWORD. It should be 16 characters.')
      console.log('2. Make sure 2FA is enabled on your Google account.')
      console.log('3. Ensure you are using an "App Password" (generated at security.google.com), not your regular password.')
    }
  }
}

testGmail()
