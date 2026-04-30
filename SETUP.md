# Guida Setup IpasticcidiCiccia

## Prerequisiti
- Node.js 16+ (scarica da https://nodejs.org/)
- npm (incluso con Node.js)
- Account Stripe gratuito (https://stripe.com)

## Setup Backend

### 1. Installa le dipendenze
```bash
cd backend
npm install
```

### 2. Configura le variabili di ambiente
```bash
cp .env.example .env
```

Modifica `.env` con i tuoi valori:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ipasticcidi_ciccia
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_super_secret_key_12345
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
FRONTEND_URL=http://localhost:3000
```

**Come ottenere le chiavi Stripe:**
1. Vai a https://dashboard.stripe.com/
2. Accedi o crea account
3. Vai a "Developers" > "API Keys"
4. Copia le chiavi di test (iniziano con `pk_test_` e `sk_test_`)

### 3. Avvia il server
```bash
npm run dev
```

✅ Server disponibile su `http://localhost:5000`

---

## Setup Frontend

### 1. Installa le dipendenze
```bash
cd frontend
npm install
```

### 2. Configura le variabili di ambiente
```bash
cp .env.example .env
```

Modifica `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
```

### 3. Avvia l'app
```bash
npm start
```

✅ App disponibile su `http://localhost:3000`

---

## Testing Pagamenti Stripe

Usa queste carte di prova:

| Scenario | Numero Carta | Scadenza | CVC |
|----------|-------------|----------|-----|
| Pagamento OK | 4242 4242 4242 4242 | 12/25 | 123 |
| Pagamento Rifiutato | 4000 0000 0000 0002 | 12/25 | 123 |
| Autenticazione Richiesta | 4000 2500 0000 0002 | 12/25 | 123 |

---

## Database

### Sviluppo (Mock)
Al momento l'app usa un mock database in memoria. Perfetto per iniziare!

### Produzione (PostgreSQL)

**Opzione 1: Neon (Cloud, Gratuito)**
1. Vai a https://neon.tech
2. Crea account
3. Crea un nuovo progetto
4. Copia la connection string
5. Aggiorna `.env` con i dettagli

**Opzione 2: PostgreSQL Locale**
```bash
# Su Windows/Mac/Linux, scarica da https://www.postgresql.org/
# Poi modifica .env con i tuoi dettagli
```

---

## Deployment

### Deploy Frontend (Vercel)
```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### Deploy Frontend (Netlify)
```bash
cd frontend
npm run build
# Draga la cartella 'build' su https://app.netlify.com
```

### Deploy Backend (Railway)
1. Vai a https://railway.app
2. Connetti il tuo GitHub
3. Seleziona il repository
4. Aggiungi le variabili di ambiente
5. Deploy automatico!

### Deploy Backend (Render)
1. Vai a https://render.com
2. Crea nuovo Web Service
3. Connetti GitHub
4. Configura variabili di ambiente
5. Deploy!

---

## Struttura Progetto

```
IpasticcidiCiccia/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js          (Login/Register)
│   │   │   ├── menu.js          (Gestione menù)
│   │   │   ├── orders.js        (Gestione ordini)
│   │   │   ├── payments.js      (Integrazione Stripe)
│   │   │   ├── users.js         (Profilo utenti)
│   │   │   └── index.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   └── index.js             (Entry point)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js          (Home)
│   │   │   ├── Menu.js          (Menù)
│   │   │   ├── Cart.js          (Carrello)
│   │   │   ├── Checkout.js      (Pagamento)
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   └── AdminDashboard.js
│   │   ├── App.js               (Main app)
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md
├── SETUP.md (questo file)
└── .gitignore
```

---

## Troubleshooting

### "npm: command not found"
- Installa Node.js da https://nodejs.org/

### "Port 5000 already in use"
- Cambia PORT nel file `.env`
- Oppure: `lsof -i :5000` (Mac/Linux) per trovare e killare il processo

### "Stripe keys not working"
- Assicurati di usare le chiavi di **test** (pk_test_ / sk_test_)
- Non le chiavi live (pk_live_ / sk_live_)

### "CORS Error"
- Verifica che `FRONTEND_URL` sia corretto nel `.env` del backend

---

## Prossimi Step

1. ✅ Setup completato
2. 📝 Modifica i dati nel file `.env`
3. 🚀 Avvia backend e frontend
4. 🧪 Testa con le carte Stripe di prova
5. 🌐 Deploy su Vercel + Railway

---

## Supporto

Per problemi:
1. Controlla che Node.js sia installato: `node --version`
2. Leggi i messaggi di errore nel terminale
3. Apri un issue su GitHub

Buona fortuna! 🎉
