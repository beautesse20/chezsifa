/** Avertissement par courriel (facultatif) via Resend. Ne bloque jamais une commande. */
export async function notify(subject: string, text: string, to?: string | null) {
  const key = process.env.RESEND_API_KEY;
  const dest = to || process.env.NOTIFY_EMAIL;
  if (!key || !dest) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.NOTIFY_FROM || 'Chez Sifa <onboarding@resend.dev>', to: [dest], subject, text })
    });
  } catch (e) {
    console.error('notify failed', e);
  }
}
