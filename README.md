# TFZ Web (Next.js + TypeScript) — package per download

Istruzioni rapide
1. Copia i file in una cartella locale.
2. Esegui:
   npm install
   npm run dev

3. Configura l'Apps Script che riceve gli ordini (ORDER_ENDPOINT e ORDER_TOKEN) e inseriscili in .env o in Vercel.
4. Per creare lo zip: ./create_zip.sh

Notes
- Ho fissato `next` a 13.4.10 per evitare tarball inesistenti.
- Non include package-lock.json: verrà rigenerato al primo `npm install`.
- Se vuoi che generi io il zip e te lo fornisca in altro modo, dimmi come preferisci riceverlo.
