import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') });

const testEmail = async () => {
  console.log('--- Email Diagnostic ---');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log(
    'EMAIL_USERNAME:',
    process.env.EMAIL_USERNAME ? 'Set' : 'Not Set'
  );
  console.log(
    'EMAIL_PASSWORD:',
    process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set'
  );

  let transporter;

  if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
    console.log('Mode: Real Email (Gmail)');
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    console.log('Mode: Development (Ethereal)');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      console.error('❌ Ethereal Account Creation Failed:', err);
      return;
    }
  }

  try {
    console.log('Attempting to send mail...');
    const info = await transporter.sendMail({
      from: '"Test" <noreply@test.com>',
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'If you see this, email is working.',
    });
    console.log('✅ Email Sent Successfully!');
    console.log('Message ID:', info.messageId);
    if (!process.env.EMAIL_USERNAME) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error: any) {
    console.error('❌ Email Failed to Send:');
    console.error(error.message);
    if (error.code === 'EAUTH') {
      console.error(
        '\n--> TIP: Check your Gmail App Password. It might be invalid or copied incorrectly.'
      );
    }
  }
};

testEmail();
