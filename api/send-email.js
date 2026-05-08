
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, text, html } = req.body;
  const apiKey = process.env.RESEND_API_KEY || 're_BaBgJxJJ_8xD7nSmxxkzHvaoTqLfEh6gw';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Site Management <onboarding@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        text: text,
        html: html || `<p>${text}</p>`,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
