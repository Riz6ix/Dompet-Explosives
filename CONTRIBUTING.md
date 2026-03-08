# Contributing

Makasih udah tertarik buat contribute ke Dompet Explosives. Semua bentuk bantuan diterima — mulai dari report bug, fix typo, sampe nambah fitur baru.

## Cara Contribute

1. **Fork** repo ini
2. **Clone** ke lokal kamu:
   ```bash
   git clone https://github.com/USERNAME/Dompet-Explosives.git
   ```
3. **Buat branch baru**:
   ```bash
   git checkout -b fitur/nama-fitur
   ```
4. **Code & test** — pastikan gak ada error
5. **Commit** dengan pesan yang jelas:
   ```bash
   git commit -m "feat: tambah fitur X"
   ```
6. **Push** ke branch kamu:
   ```bash
   git push origin fitur/nama-fitur
   ```
7. Buka **Pull Request** di repo utama

## Development Setup

- Node.js 18+
- npm 9+
- `npm run dev` buat jalanin dev server
- `npm run build` buat test production build
- `npm run lint` buat cek linting errors

## Report Bug

Ketemu bug? Buat issue baru dan sertakan:
- Steps to reproduce (langkah buat reproduce)
- Expected vs actual behavior
- Screenshot kalau ada

## Saran Fitur

Punya ide fitur baru? Buat issue dengan label `enhancement`. Diskusi dulu sebelum langsung ngoding, biar gak overlap.

## Code Style

- React functional components + hooks
- Tailwind CSS buat styling
- File naming: PascalCase buat components, camelCase buat utils/hooks
- Commit message format: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

---

Thanks for making this project better. 🤝
