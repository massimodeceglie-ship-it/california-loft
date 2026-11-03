const { google } = require('googleapis');
const TZ = 'Europe/Rome', J = { 'content-type': 'application/json' };
const p2 = n => String(n).padStart(2, '0');
const cal = () => google.calendar({ version: 'v3', auth: new google.auth.JWT(process.env.G_EMAIL, null, (process.env.G_KEY || '').replace(/\\n/g, '\n'), ['https://www.googleapis.com/auth/calendar']) });
const off = d => new Intl.DateTimeFormat('en-GB', { timeZone: TZ, timeZoneName: 'longOffset' }).formatToParts(new Date(d + 'T12:00:00Z')).find(x => x.type === 'timeZoneName').value.replace('GMT', '') || '+00:00';
const at = (d, h) => new Date(`${d}T${p2(h)}:00:00${off(d)}`);
const HALF = { am: [9, 13], pm: [14, 18] };

exports.handler = async (e) => {
  try {
    const c = cal(), id = process.env.G_CAL_ID;
    if (e.httpMethod === 'POST') {
      const b = JSON.parse(e.body || '{}');
      const u = await fetch(process.env.SUPABASE_URL + '/auth/v1/user', { headers: { Authorization: 'Bearer ' + b.token, apikey: process.env.SUPABASE_ANON_KEY } }).then(r => r.json());
      if (!u.email || u.email !== process.env.ADMIN_EMAIL) return { statusCode: 403, headers: J, body: '{}' };
      const [s, f] = b.fascia === 'full' ? [9, 18] : HALF[b.fascia];
      await c.events.insert({ calendarId: id, requestBody: { summary: 'Shooting – ' + b.name, description: [b.phone, b.email, b.notes].filter(Boolean).join('\n'), start: { dateTime: at(b.date, s).toISOString(), timeZone: TZ }, end: { dateTime: at(b.date, f).toISOString(), timeZone: TZ } } });
      return { statusCode: 200, headers: J, body: '{"ok":true}' };
    }
    const [y, m] = (e.queryStringParameters.month || '').split('-').map(Number);
    const n = new Date(y, m, 0).getDate(), first = `${y}-${p2(m)}-01`, last = `${y}-${p2(m)}-${p2(n)}`;
    const r = await c.events.list({ calendarId: id, singleEvents: true, maxResults: 500, timeMin: at(first, 0).toISOString(), timeMax: at(last, 23).toISOString() });
    const ev = (r.data.items || []).filter(x => x.status !== 'cancelled' && x.transparency !== 'transparent').map(x => x.start.date
      ? [at(x.start.date, 0), at(x.end.date, 0)] : [new Date(x.start.dateTime), new Date(x.end.dateTime)]);
    const busy = {};
    for (let d = 1; d <= n; d++) { const k = `${y}-${p2(m)}-${p2(d)}`;
      for (const h of ['am', 'pm']) { const ws = at(k, HALF[h][0]), we = at(k, HALF[h][1]); if (ev.some(([s, f]) => s < we && f > ws)) busy[k + '_' + h] = true; } }
    return { statusCode: 200, headers: J, body: JSON.stringify({ busy }) };
  } catch (err) { return { statusCode: 200, headers: J, body: JSON.stringify({ busy: {}, error: true }) }; }
};
