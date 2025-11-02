import nodemailer from 'nodemailer';

let transporter = null;

export const initMailer = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('Email disabled: missing SMTP_* env vars');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE || '').toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
};

export const sendEmail = async ({ to, subject, html, from }) => {
  try {
    if (!transporter) initMailer();
    if (!transporter) return { sent: false, reason: 'not_configured' };
    const info = await transporter.sendMail({
      from: from || process.env.MAIL_FROM || 'HomeSphere <no-reply@homesphere.local>',
      to,
      subject,
      html,
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('sendEmail error:', err?.message);
    return { sent: false, reason: err?.message };
  }
};
