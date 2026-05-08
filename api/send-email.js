
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, text, html } = req.body;

  // Cấu hình Gmail SMTP
  // Khuyến khích dùng App Password (Mật khẩu ứng dụng) thay vì mật khẩu chính
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'meit8266@gmail.com',
      pass: process.env.GMAIL_PASS || 'niwmqdcidskahjfg',
    },
  });

  const mailOptions = {
    from: `"Site Management Notification" <${process.env.GMAIL_USER || 'meit8266@gmail.com'}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject: subject,
    text: text,
    html: html || `<p>${text}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message });
  }
}
