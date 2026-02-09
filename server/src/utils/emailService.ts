import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

// Create transporter outside the function to reuse connection pool
let transporter: nodemailer.Transporter;

const createTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
    const host = process.env.EMAIL_HOST || 'smtp-relay.brevo.com';
    const port = parseInt(process.env.EMAIL_PORT || '587');
    const secure = process.env.EMAIL_SECURE === 'true';

    console.log(
      `[EmailService] Configuring Transporter: Host=${host} Port=${port} Secure=${secure} User=${process.env.EMAIL_USERNAME}`
    );

    // Generic SMTP configuration (works for Brevo, Outlook, etc.)
    transporter = nodemailer.createTransport({
      host,
      port,
      secure, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
      logger: true,
      debug: true,
    } as any);
  } else {
    // Development: Create a test account automatically (Ethereal)
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
  }
  return transporter;
};

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailTransporter = await createTransporter();

  const mailOptions = {
    from:
      process.env.EMAIL_FROM || '"SVU Alumni Portal" <noreply@svualumni.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await mailTransporter.sendMail(mailOptions);

  console.log('--------------------------------------------------');
  if (process.env.EMAIL_USERNAME) {
    console.log('📨 MESSAGE SENT (Real Email)');
    console.log('--------------------------------------------------');
    console.log('Message ID: %s', info.messageId);
    console.log('Check your recipient inbox.');
  } else {
    console.log('📨 MESSAGE SENT (Ethereal Email)');
    console.log('--------------------------------------------------');
    console.log('Message ID: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  console.log('--------------------------------------------------');
};

export default sendEmail;
