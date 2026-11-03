# California Loft – guida di pubblicazione

## 1. Supabase (database e accesso)
1. Crea un progetto gratuito su supabase.com.
2. Authentication > Users > Add user: crea il tuo accesso (email e password).
3. SQL Editor: incolla `supabase.sql`, sostituisci TUA_EMAIL con la tua email, premi Run.
4. Project Settings > API: copia Project URL e anon public key dentro `index.html` (in fondo, `SB_URL` e `SB_KEY`).

## 2. Google Calendar
1. console.cloud.google.com: crea un progetto, abilita "Google Calendar API".
2. IAM > Service Accounts: crea un account di servizio, poi Keys > Add key > JSON.
3. Su Google Calendar: Impostazioni del calendario > Condividi con persone specifiche > aggiungi l'email del service account con permesso "Apportare modifiche agli eventi".
4. Annota l'ID del calendario (Impostazioni > Integra calendario).

## 3. Netlify (pubblicazione)
1. Metti questa cartella su GitHub e collegala a Netlify (Add new site > Import from Git).
2. Site configuration > Environment variables, aggiungi:
   - `G_EMAIL`: client_email del file JSON
   - `G_KEY`: private_key del file JSON
   - `G_CAL_ID`: ID del calendario
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`: gli stessi di Supabase
   - `ADMIN_EMAIL`: la tua email
3. Domain management: aggiungi `app.californialoft.it`.

## Uso
Sul sito, in fondo alla pagina, "Area riservata": accedi, vedi le richieste, Accetta o Rifiuta. Se accetti, il giorno diventa rosso e l'evento va su Google Calendar. Gli impegni già in Google Calendar risultano occupati ai clienti.
