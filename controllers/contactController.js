import { sendEmail } from '../utils/mailer.js';

// @desc    Public contact form -> send to ADMIN_EMAIL
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return res.status(200).json({ message: 'Message received (email not configured)' });
    }
    const subject = `New contact message from ${name}`;
    const html = `
      <div>
        <p>You have received a new message via the contact form.</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
        </ul>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `;
    await sendEmail({ to: adminEmail, subject, html });
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
