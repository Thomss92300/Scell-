export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const RESEND_KEY = 're_BDXzqmTc_LEKH4UYPtqA1qNiUJZmXw2K1';
  const FROM = 'Scellé <contact@xn--scell-fsa.fr>';
  const ADMIN = 'tolivier28pro@gmail.com';

  try {
    const { type, data } = await req.json();

    let emailPayload;

    if (type === 'confirmation') {
      const { nom, email, offre, delai, date_envoi, prix } = data;
      const dateFormatted = new Date(date_envoi).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

      emailPayload = {
        from: FROM,
        to: [email],
        subject: '✉️ Ta lettre est scellée — Scellé',
        html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#faf7f2;padding:40px;">
          <p style="font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#9e9589;text-align:center;">S C E L L É</p>
          <h1 style="font-size:28px;font-weight:400;color:#1a1714;">Ta lettre est scellée</h1>
          <p style="color:#9e9589;">Elle sera conservée précieusement jusqu'au jour choisi.</p>
          <p style="color:#1a1714;">Bonjour ${nom},</p>
          <p style="color:#1a1714;">Ta lettre a bien été reçue et sera imprimée, mise sous enveloppe et conservée avec soin.</p>
          <table style="width:100%;background:#f5f0e8;padding:20px;margin:20px 0;">
            <tr><td style="color:#9e9589;">Offre</td><td style="text-align:right;color:#1a1714;">${offre}</td></tr>
            <tr><td style="color:#9e9589;">Délai</td><td style="text-align:right;color:#1a1714;">${delai}</td></tr>
            <tr><td style="color:#9e9589;">Date d'envoi</td><td style="text-align:right;color:#1a1714;">${dateFormatted}</td></tr>
            <tr><td style="color:#1a1714;font-size:15px;padding-top:10px;">Total</td><td style="text-align:right;color:#1a1714;font-size:15px;padding-top:10px;">${prix} €</td></tr>
          </table>
          <p style="color:#9e9589;font-size:13px;">Ta lettre ne sera jamais lue avant toi.</p>
          <p style="text-align:center;color:#9e9589;font-size:11px;letter-spacing:3px;margin-top:32px;">S C E L L É · Lettres du futur</p>
        </div>`
      };

      // Notification admin
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: [ADMIN],
          subject: `📬 Nouvelle commande — ${nom}`,
          html: `<p><strong>Nouvelle commande !</strong></p>
            <p>Nom : ${nom}</p>
            <p>Email : ${email}</p>
            <p>Offre : ${offre}</p>
            <p>Délai : ${delai}</p>
            <p>Date d'envoi : ${dateFormatted}</p>
            <p>Prix : ${prix} €</p>
            <p><strong>Action : imprime et archive la lettre dès que possible.</strong></p>`
        })
      });

    } else if (type === 'cadeau') {
      const { acheteur_nom, acheteur_email, code, offre, prestige, petit_mot } = data;

      emailPayload = {
        from: FROM,
        to: [acheteur_email],
        subject: '🎁 Votre code cadeau Scellé',
        html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#faf7f2;padding:40px;">
          <p style="font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#9e9589;text-align:center;">S C E L L É</p>
          <h1 style="font-size:28px;font-weight:400;color:#1a1714;">Votre cadeau est prêt</h1>
          <p style="color:#1a1714;">Bonjour ${acheteur_nom},</p>
          <p style="color:#1a1714;">Transmettez ce code au destinataire pour qu'il écrive sa lettre.</p>
          <div style="background:#1a1714;padding:24px;text-align:center;margin:24px 0;">
            <p style="color:rgba(245,240,232,0.5);font-size:11px;letter-spacing:2px;margin:0 0 8px;">CODE CADEAU</p>
            <p style="color:#f5f0e8;font-size:28px;letter-spacing:6px;margin:0;">${code}</p>
          </div>
          ${petit_mot ? `<p style="background:#e8dfc8;padding:16px;font-style:italic;color:#1a1714;">"${petit_mot}"</p>` : ''}
          ${prestige ? `<p style="color:#8b6f47;">✓ Édition Prestige incluse</p>` : ''}
          <p style="color:#9e9589;font-size:13px;">Offre : ${offre}</p>
          <p style="text-align:center;color:#9e9589;font-size:11px;letter-spacing:3px;margin-top:32px;">S C E L L É · Lettres du futur</p>
        </div>`
      };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload)
    });

    const result = await response.json();
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
