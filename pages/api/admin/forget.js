// Private: "Forget it here" on the Add Stock page clears the saved cookie.
import { setAdminCookie } from '../../../lib/squareAdmin';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  setAdminCookie(res, '');
  res.status(200).json({ ok: true });
}
