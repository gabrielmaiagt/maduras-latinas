# 🇲🇽 Maduras Latinas

Plataforma de relacionamento para conectar mujeres maduras con hombres jóvenes.

## 🔥 Firebase
- **Proyecto**: maduras-latinas-2026
- **Firestore**: Ativado
- **Analytics**: Ativado

## 📦 Setup Local

```bash
# Já feito:
git clone https://github.com/gabrielmaiagt/maduras-latinas.git
cd maduras-latinas
```

## 📁 Estrutura
```
maduras-latinas/
├── index.html              # Landing page (próximo)
├── registro/
│   ├── paso1/
│   └── paso2/
├── bienvenida/
├── descubrir/
├── chat/
├── js/
│   ├── firebase-config.js  ✅ Criado
│   └── tracking.js         ✅ Criado
└── css/
```

## 🚀 Próximos Passos

1. **Fazer primeiro commit:**
```bash
git add .
git commit -m "feat: setup inicial firebase e tracking"
git push origin main
```

2. **Conectar no Netlify:**
   - https://app.netlify.com/
   - "Add new site" → "Import an existing project"
   - Conectar com GitHub
   - Selecionar repo `maduras-latinas`
   - Deploy!

3. **Configurar domínio:**
   - Site settings → Domain management
   - Trocar para: `maduraslatinas.netlify.app`

## 💰 Checkout
- Gateway: PerfectPay
- Link: https://go.centerpag.com/PPU38CQ5N9J
- Preço: US$ 6.99

## 📊 Tracking
- Events salvos no Firestore collection `events`
- Users salvos em collection `users`
- Storage local: `maduras_funnel_events`

---

**Status**: Setup inicial ✅ | Landing page 🚧
