export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_KEY = 're_BDXzqmTc_LEKH4UYPtqA1qNiUJZmXw2K1';
  const FROM = 'Scellé <contact@xn--scell-fsa.fr>';
  const ADMIN = 'tolivier28pro@gmail.com';

  const { type, data } = req.body;

  try {
    let emailPayload;

    // ── EMAIL 1 : Confirmation commande ──────────────────────────
    if (type === 'confirmation') {
      const { nom, email, offre, delai, date_envoi, prix } = data;
      const dateFormatted = new Date(date_envoi).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

      emailPayload = {
        from: FROM,
        to: [email],
        subject: '✉️ Ta lettre est scellée — Scellé',
        html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:0.5px solid rgba(26,23,20,0.12);">
        
        <!-- HEADER -->
        <tr><td style="padding:32px;text-align:center;border-bottom:0.5px solid rgba(26,23,20,0.08);">
          <p style="margin:0;font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#9e9589;">S C E L L É</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="padding:40px 48px;">
          <h1 style="font-family:'Georgia',serif;font-size:28px;font-weight:400;color:#1a1714;margin:0 0 8px;">Ta lettre est scellée</h1>
          <p style="font-size:14px;color:#9e9589;margin:0 0 32px;">Elle sera conservée précieusement jusqu'au jour choisi.</p>
          
          <p style="font-size:14px;color:#1a1714;line-height:1.7;margin:0 0 24px;">Bonjour ${nom},</p>
          <p style="font-size:14px;color:#1a1714;line-height:1.7;margin:0 0 32px;">Ta lettre a bien été reçue et sera imprimée, mise sous enveloppe et conservée avec soin. Elle t'attend, prête à traverser le temps.</p>

          <!-- RECAP -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border:0.5px solid rgba(26,23,20,0.12);margin-bottom:32px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9e9589;">Récapitulatif</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="font-size:13px;color:#9e9589;padding:6px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);">Offre</td><td style="font-size:13px;color:#1a1714;text-align:right;padding:6px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);">${offre}</td></tr>
                <tr><td style="font-size:13px;color:#9e9589;padding:6px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);">Délai</td><td style="font-size:13px;color:#1a1714;text-align:right;padding:6px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);">${delai}</td></tr>
                <tr><td style="font-size:13px;color:#9e9589;padding:6px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);">Date d'envoi prévue</td><td style="font-size:13px;color:#1a1714;text-align:right;padding:6px 0;border-bottom:0.5px solid rgba(26,23,20,0.08);">${dateFormatted}</td></tr>
                <tr><td style="font-size:15px;color:#1a1714;font-weight:400;padding:10px 0 0;">Total</td><td style="font-size:15px;color:#1a1714;font-weight:400;text-align:right;padding:10px 0 0;">${prix} €</td></tr>
              </table>
            </td></tr>
          </table>

          <p style="font-size:13px;color:#9e9589;line-height:1.8;margin:0 0 8px;">Ta lettre ne sera jamais lue avant toi. Elle t'appartient entièrement.</p>
          <p style="font-size:13px;color:#9e9589;line-height:1.8;margin:0;">Pour toute question, réponds à cet email ou écris-nous à <a href="mailto:contact@scellé.fr" style="color:#8b6f47;">contact@scellé.fr</a></p>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="padding:24px 48px;border-top:0.5px solid rgba(26,23,20,0.08);text-align:center;">
          <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9e9589;">S C E L L É</p>
          <p style="margin:6px 0 0;font-size:11px;color:#b8ad9e;">Lettres du futur · Envoi physique</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
      };

      // Email de notification à toi (admin)
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: [ADMIN],
          subject: `📬 Nouvelle commande Scellé — ${nom}`,
          html: `<p>Nouvelle commande reçue !</p>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Offre :</strong> ${offre}</p>
          <p><strong>Délai :</strong> ${delai}</p>
          <p><strong>Date d'envoi :</strong> ${dateFormatted}</p>
          <p><strong>Prix :</strong> ${prix} €</p>
          <p><strong>Action :</strong> Imprime et archive la lettre dès que possible.</p>`
        })
      });
    }

    // ── EMAIL 2 : Code cadeau ─────────────────────────────────────
    else if (type === 'cadeau') {
      const { acheteur_nom, acheteur_email, code, offre, prestige, petit_mot } = data;

      emailPayload = {
        from: FROM,
        to: [acheteur_email],
        subject: '🎁 Votre code cadeau Scellé',
        html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#faf7f2;border:0.5px solid rgba(26,23,20,0.12);">
        
        <tr><td style="padding:32px;text-align:center;border-bottom:0.5px solid rgba(26,23,20,0.08);">
          <p style="margin:0;font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#9e9589;">S C E L L É</p>
        </td></tr>

        <tr><td style="padding:40px 48px;">
          <h1 style="font-family:'Georgia',serif;font-size:28px;font-weight:400;color:#1a1714;margin:0 0 8px;">Votre cadeau est prêt</h1>
          <p style="font-size:14px;color:#9e9589;margin:0 0 32px;">Voici le code cadeau à offrir.</p>

          <p style="font-size:14px;color:#1a1714;line-height:1.7;margin:0 0 24px;">Bonjour ${acheteur_nom},</p>
          <p style="font-size:14px;color:#1a1714;line-height:1.7;margin:0 0 32px;">Votre achat est confirmé. Transmettez ce code au destinataire pour qu'il puisse écrire sa lettre du futur sur Scellé.</p>

          <!-- CODE -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td style="background:#1a1714;padding:24px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,240,232,0.5);">Code cadeau</p>
              <p style="margin:0;font-family:'Georgia',serif;font-size:28px;letter-spacing:6px;color:#f5f0e8;">${code}</p>
            </td></tr>
          </table>

          ${petit_mot ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8dfc8;margin-bottom:32px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9e9589;">Votre message</p>
              <p style="margin:0;font-size:14px;color:#1a1714;font-style:italic;line-height:1.7;">"${petit_mot}"</p>
            </td></tr>
          </table>` : ''}

          ${prestige ? `<p style="font-size:13px;color:#8b6f47;margin:0 0 16px;">✓ Édition Prestige incluse — le bon cadeau physique sera glissé dans l'enveloppe le jour de l'envoi.</p>` : ''}

          <p style="font-size:13px;color:#9e9589;line-height:1.8;margin:0 0 8px;">Le destinataire peut utiliser ce code sur <a href="https://scellé.fr/code-cadeau.html" style="color:#8b6f47;">scellé.fr</a></p>
          <p style="font-size:13px;color:#9e9589;line-height:1.8;margin:0;"><strong>Offre :</strong> ${offre}</p>
        </td></tr>

        <tr><td style="padding:24px 48px;border-top:0.5px solid rgba(26,23,20,0.08);text-align:center;">
          <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#9e9589;">S C E L L É</p>
          <p style="margin:6px 0 0;font-size:11px;color:#b8ad9e;">Lettres du futur · Envoi physique</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
      };
    }

    else {
      return res.status(400).json({ error: 'Type inconnu' });
    }

    // Envoi de l'email principal
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Erreur Resend');

    return res.status(200).json({ success: true, id: result.id });

  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: err.message });
  }
}
