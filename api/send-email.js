export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_KEY = 're_BDXzqmTc_LEKH4UYPtqA1qNiUJZmXw2K1';
  const FROM = 'Scellé <contact@xn--scell-fsa.fr>';
  const ADMIN = 'tolivier28pro@gmail.com';

  try {
    const { type, data } = req.body;
    let emailPayload;

    // ── EMAIL 1 : Confirmation commande ─────────────────────────────
    if (type === 'confirmation') {
      const { nom, email, offre, delai, date_envoi, prix } = data;
      const dateFormatted = new Date(date_envoi).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      const prenom = nom.split(' ')[0];

      emailPayload = {
        from: FROM,
        to: [email],
        subject: '✉️ Ta lettre est scellée — Scellé',
        html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:0.5px solid rgba(26,23,20,0.12);">

  <!-- HEADER -->
  <tr><td style="padding:28px 40px;text-align:center;border-bottom:0.5px solid rgba(26,23,20,0.08);">
    <p style="margin:0;font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#9e9589;font-family:Georgia,serif;">S C E L L É</p>
  </td></tr>

  <!-- HERO -->
  <tr><td style="padding:40px 40px 24px;text-align:center;">
    <p style="margin:0 0 8px;font-size:32px;font-weight:400;color:#1a1714;font-family:Georgia,serif;line-height:1.2;">Ta lettre est entre<br>de bonnes mains.</p>
    <p style="margin:16px 0 0;font-size:14px;color:#9e9589;font-family:Georgia,serif;font-style:italic;">Elle t'attend, prête à traverser le temps.</p>
  </td></tr>

  <!-- DIVIDER -->
  <tr><td style="padding:0 40px;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="border-bottom:0.5px solid rgba(139,111,71,0.3);"></td>
      <td width="20"></td>
      <td style="border-bottom:0.5px solid rgba(139,111,71,0.3);"></td>
    </tr></table>
  </td></tr>

  <!-- BODY -->
  <tr><td style="padding:32px 40px;">
    <p style="margin:0 0 16px;font-size:15px;color:#1a1714;font-family:Georgia,serif;">Bonjour ${prenom},</p>
    <p style="margin:0 0 16px;font-size:14px;color:#1a1714;line-height:1.8;font-family:Georgia,serif;">Ta lettre a bien été reçue. Dans les prochaines heures, elle sera imprimée sur beau papier vergé ivoire, mise sous enveloppe et cachetée à la cire. Elle rejoindra ensuite notre archive jusqu'à la date que tu as choisie.</p>
    <p style="margin:0 0 32px;font-size:14px;color:#1a1714;line-height:1.8;font-family:Georgia,serif;">Le jour venu, nous l'expédierons à ton adresse — comme si le temps l'avait portée jusqu'à toi.</p>

    <!-- RECAP -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;margin-bottom:32px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9e9589;font-family:Georgia,serif;">Récapitulatif de ta commande</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#9e9589;padding:8px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);font-family:Georgia,serif;">Offre</td>
            <td style="font-size:13px;color:#1a1714;text-align:right;padding:8px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);font-family:Georgia,serif;">${offre}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#9e9589;padding:8px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);font-family:Georgia,serif;">Délai</td>
            <td style="font-size:13px;color:#1a1714;text-align:right;padding:8px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);font-family:Georgia,serif;">${delai}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#9e9589;padding:8px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);font-family:Georgia,serif;">Date d'envoi prévue</td>
            <td style="font-size:13px;color:#1a1714;text-align:right;padding:8px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);font-family:Georgia,serif;">${dateFormatted}</td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#1a1714;padding:12px 0 0;font-family:Georgia,serif;">Total</td>
            <td style="font-size:15px;color:#1a1714;text-align:right;padding:12px 0 0;font-family:Georgia,serif;">${prix === 'Offert' ? '🎁 Offert' : prix + ' €'}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- PROMESSE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-left:2px solid #8b6f47;margin-bottom:32px;">
      <tr><td style="padding:12px 20px;">
        <p style="margin:0;font-size:13px;color:#8b6f47;font-style:italic;line-height:1.8;font-family:Georgia,serif;">Ta lettre ne sera jamais lue avant toi. Jamais partagée. Elle t'appartient entièrement — jusqu'au jour où tu l'ouvriras.</p>
      </td></tr>
    </table>

    <p style="margin:0;font-size:13px;color:#9e9589;line-height:1.8;font-family:Georgia,serif;">Pour toute question, réponds à cet email ou écris-nous à <a href="mailto:contact@scellé.fr" style="color:#8b6f47;text-decoration:none;">contact@scellé.fr</a></p>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:24px 40px;border-top:0.5px solid rgba(26,23,20,0.08);text-align:center;">
    <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9e9589;font-family:Georgia,serif;">S C E L L É</p>
    <p style="margin:6px 0 0;font-size:11px;color:#b8ad9e;font-family:Georgia,serif;">Lettres du futur · Envoi physique · scelle.fr</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
      };

      // Notification admin
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: [ADMIN],
          subject: `📬 Nouvelle commande — ${nom}`,
          html: `<div style="font-family:Georgia,serif;max-width:560px;padding:24px;">
            <h2>Nouvelle commande !</h2>
            <p><strong>Nom :</strong> ${nom}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Offre :</strong> ${offre}</p>
            <p><strong>Délai :</strong> ${delai}</p>
            <p><strong>Date d'envoi :</strong> ${dateFormatted}</p>
            <p><strong>Prix :</strong> ${prix} €</p>
            <p style="background:#f5f0e8;padding:16px;"><strong>Action :</strong> Imprime la lettre, mets-la sous enveloppe vergé ivoire, cachète à la cire et archive avec la date d'envoi.</p>
          </div>`
        })
      });

    // ── EMAIL 2 : Code cadeau ────────────────────────────────────────
    } else if (type === 'cadeau') {
      const { acheteur_nom, acheteur_email, code, offre, prestige, petit_mot } = data;
      const prenom = acheteur_nom.split(' ')[0];

      emailPayload = {
        from: FROM,
        to: [acheteur_email],
        subject: '🎁 Votre code cadeau Scellé est prêt',
        html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:0.5px solid rgba(26,23,20,0.12);">

  <!-- HEADER -->
  <tr><td style="padding:28px 40px;text-align:center;border-bottom:0.5px solid rgba(26,23,20,0.08);">
    <p style="margin:0;font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#9e9589;font-family:Georgia,serif;">S C E L L É</p>
  </td></tr>

  <!-- HERO -->
  <tr><td style="padding:40px 40px 24px;text-align:center;">
    <p style="margin:0 0 8px;font-size:32px;font-weight:400;color:#1a1714;font-family:Georgia,serif;line-height:1.2;">Un beau cadeau<br>vous attend.</p>
    <p style="margin:16px 0 0;font-size:14px;color:#9e9589;font-family:Georgia,serif;font-style:italic;">Votre code cadeau est prêt à être offert.</p>
  </td></tr>

  <!-- BODY -->
  <tr><td style="padding:32px 40px;">
    <p style="margin:0 0 16px;font-size:15px;color:#1a1714;font-family:Georgia,serif;">Bonjour ${prenom},</p>
    <p style="margin:0 0 32px;font-size:14px;color:#1a1714;line-height:1.8;font-family:Georgia,serif;">Votre achat est confirmé. Transmettez ce code au destinataire — il pourra écrire sa lettre du futur sur Scellé et la recevoir à la date qu'il choisira.</p>

    <!-- CODE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td style="background:#1a1714;padding:32px;text-align:center;">
        <p style="margin:0 0 12px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(245,240,232,0.5);font-family:Georgia,serif;">Code cadeau</p>
        <p style="margin:0;font-size:32px;letter-spacing:8px;color:#f5f0e8;font-family:Georgia,serif;">${code}</p>
      </td></tr>
    </table>

    ${petit_mot ? `
    <!-- PETIT MOT -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr><td style="background:#e8dfc8;padding:24px;border-left:2px solid #8b6f47;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9e9589;font-family:Georgia,serif;">Votre message</p>
        <p style="margin:0;font-size:15px;color:#1a1714;font-style:italic;line-height:1.8;font-family:Georgia,serif;">"${petit_mot}"</p>
      </td></tr>
    </table>` : ''}

    <!-- RECAP -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;margin-bottom:32px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9e9589;font-family:Georgia,serif;">Détails du cadeau</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#9e9589;padding:8px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);font-family:Georgia,serif;">Offre</td>
            <td style="font-size:13px;color:#1a1714;text-align:right;padding:8px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);font-family:Georgia,serif;">${offre}</td>
          </tr>
          ${prestige ? `<tr>
            <td style="font-size:13px;color:#8b6f47;padding:8px 0;font-family:Georgia,serif;">✓ Édition Prestige</td>
            <td style="font-size:13px;color:#8b6f47;text-align:right;padding:8px 0;font-family:Georgia,serif;">Incluse</td>
          </tr>` : ''}
        </table>
      </td></tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;color:#9e9589;line-height:1.8;font-family:Georgia,serif;">Le destinataire utilise ce code directement sur <a href="https://scellé.fr" style="color:#8b6f47;text-decoration:none;">scellé.fr</a> lors de son écriture.</p>
    <p style="margin:0;font-size:13px;color:#9e9589;line-height:1.8;font-family:Georgia,serif;">Pour toute question : <a href="mailto:contact@scellé.fr" style="color:#8b6f47;text-decoration:none;">contact@scellé.fr</a></p>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:24px 40px;border-top:0.5px solid rgba(26,23,20,0.08);text-align:center;">
    <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9e9589;font-family:Georgia,serif;">S C E L L É</p>
    <p style="margin:6px 0 0;font-size:11px;color:#b8ad9e;font-family:Georgia,serif;">Lettres du futur · Envoi physique · scelle.fr</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
      };

    // ── EMAIL 3 : Contact ────────────────────────────────────────────
    } else if (type === 'contact') {
      const { nom, email, sujet, message } = data;
      emailPayload = {
        from: FROM,
        to: [ADMIN],
        subject: `📩 Contact — ${sujet} — ${nom}`,
        html: `<div style="font-family:Georgia,serif;max-width:560px;padding:24px;">
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Sujet :</strong> ${sujet}</p>
          <p><strong>Message :</strong></p>
          <p style="background:#f5f0e8;padding:16px;line-height:1.8;">${message.replace(/\n/g,'<br>')}</p>
        </div>`
      };
    } else {
      return res.status(400).json({ error: 'Type inconnu' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Erreur Resend');
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
