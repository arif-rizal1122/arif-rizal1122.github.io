# Rekap Aplikasi — Portfolio Arif Rizal

## Deskripsi
Website portfolio pribadi sebagai Backend Developer. Dibangun dengan **Astro 5 + React 19 + Tailwind CSS 4**, dideploy di GitHub Pages.

## Fitur Utama
| Fitur | Keterangan |
|-------|-----------|
| **Beranda** | Hero section, statistik, tentang saya, project unggulan, skills, CTA |
| **Proyek** | 6 portfolio project dengan filtering berdasarkan teknologi |
| **Blog** | 1 artikel (Migrasi Portofolio ke Astro), content collections |
| **Dashboard** | Profil card + Task Manager (grouped, localStorage) |
| **Notes** | Catatan pribadi berbasis localStorage |
| **Kontak** | Info kontak + form (Google Apps Script) |
| **Navbar** | Navigasi responsif dengan glass effect & mobile drawer |

## Halaman
- `/` — Beranda
- `/projects` — Proyek
- `/blog` — Blog
- `/blog/[slug]` — Detail blog
- `/notes` — Catatan
- `/contact` — Kontak
- `/dashboard` — Dashboard

## Tech Stack
- **Framework:** Astro 5.x (SSG)
- **UI:** React 19.x (Islands Architecture)
- **Styling:** Tailwind CSS 4.x via `@tailwindcss/vite`
- **Bahasa:** TypeScript strict
- **Icons:** Font Awesome 6
- **Font:** Inter + Poppins (Google Fonts)
- **Storage:** localStorage (Tasks & Notes)
- **Data Statis:** `projects.json`, Content Collections blog

## Komponen React
- `Navbar.jsx` — Navigasi + scroll-to-top
- `ProjectCard.jsx` — Kartu proyek dengan tag & link
- `ContactForm.jsx` — Form kontak ke Google Apps Script
- `NotesWidget.jsx` — Textarea dengan auto-save localStorage
- `TasksWidget.jsx` — Task manager group dengan collapsible

## Status Saat Ini
- ✅ Semua halaman berfungsi
- ✅ Responsive & dark mode
- ✅ SEO meta tags (OG, Twitter Card)
- ✅ Animasi scroll reveal
- ⏳ Blog masih 1 artikel
- ⏳ Perlu penambahan project & konten blog
