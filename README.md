# CodeGuard - Bug Detection Tool

Bug detection tool untuk static code analysis dengan web interface yang mendukung analisis JavaScript, Python, dan Solidity dengan fokus khusus pada Somnia Network.

## ✨ Fitur Utama

- 🔍 **Multi-Language Support**: Analisis JavaScript, Python, dan Solidity
- 🛡️ **Security Analysis**: Deteksi kerentanan keamanan dan bug potensial
- 🚀 **Somnia Network Integration**: Optimisasi khusus untuk blockchain Somnia
- 📊 **Real-time Results**: Analisis cepat dengan hasil langsung
- 📈 **Analytics Dashboard**: Statistik dan riwayat analisis
- 💾 **Export Reports**: Export hasil analisis dalam format JSON

## 🏗️ Arsitektur Teknologi

### Frontend
- **React** dengan TypeScript dan Vite
- **Tailwind CSS** + **shadcn/ui** untuk UI components
- **TanStack React Query** untuk state management
- **Wouter** untuk routing

### Backend  
- **Express.js** dengan TypeScript
- **Custom Code Analyzer** dengan parser bahasa-spesifik
- **In-memory Storage** (siap untuk integrasi database)
- **Multer** untuk file upload

### Database (Ready)
- **Drizzle ORM** dengan PostgreSQL schema
- **Neon Database** serverless integration

## 🚀 Quick Start

1. **Clone repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Buka browser**
   ```
   http://localhost:5000
   ```

## 📋 Cara Penggunaan

1. **Pilih Bahasa**: Pilih JavaScript, Python, atau Solidity
2. **Input Kode**: Paste kode atau upload file
3. **Konfigurasi Analisis**: Pilih jenis analisis yang diinginkan
4. **Mulai Analisis**: Klik tombol "Mulai Analisis"
5. **Review Results**: Lihat hasil dengan tingkat severity dan rekomendasi
6. **Export Report**: Download laporan dalam format JSON

## 🔧 Jenis Analisis

### JavaScript
- Console statements detection
- Var usage warnings
- Loose equality checks
- Common anti-patterns

### Python  
- Bare except clauses
- Eval() usage detection
- Global variable warnings
- Security vulnerabilities

### Solidity
- Reentrancy vulnerabilities
- tx.origin usage warnings
- Unchecked external calls
- Pragma version checks
- **Somnia Network optimizations**

## 🌟 Somnia Network Support

CodeGuard menyediakan analisis khusus untuk:
- **EVM Compatibility** checks
- **MultiStream Consensus** optimizations
- **High-performance** contract patterns
- **1M+ TPS** readiness verification

## 📁 Struktur Project

```
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Application pages  
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities
├── server/                # Backend Express app
│   ├── services/          # Code analysis engine
│   ├── routes.ts          # API endpoints
│   └── storage.ts         # Data storage layer
├── shared/                # Shared TypeScript types
└── components.json        # shadcn/ui config
```

## 🔒 Security Features

- **Input validation** dengan Zod schemas
- **File type restrictions** untuk upload
- **XSS protection** untuk code display
- **Rate limiting** ready untuk production

## 📊 Analysis Results

Results include:
- **Severity levels**: Critical, High, Medium, Low
- **Line-specific** issue location
- **Code snippets** with problems highlighted
- **Recommendations** untuk perbaikan
- **Performance metrics** dan statistics

## 🚀 Deployment

Project ini siap untuk deployment di:
- **Replit** (recommended)
- **Vercel** 
- **Netlify**
- **Heroku**

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🔗 Links

- [Somnia Network Documentation](https://docs.somnia.network/)
- [GitHub Repository](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)
- [Live Demo](https://your-app.replit.app)

## 📞 Support

Jika Anda memiliki pertanyaan atau masalah:
- Open an issue di GitHub
- Contact: your-email@example.com

---

**Built with ❤️ for Somnia Network ecosystem**