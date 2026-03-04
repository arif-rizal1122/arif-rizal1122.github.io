4. 📁 Struktur Folder Proyek
text

Copy code
portfolio/
├── .github/
│   └── workflows/
│       └── static.yml       # Konfigurasi auto-deploy GitHub Actions
├── public/
│   ├── favicon.ico
│   ├── resume.pdf
│   └── images/
├── src/
│   ├── components/
│   │   ├── ProjectCard.jsx
│   │   ├── ContactForm.jsx
│   │   ├── DashboardWidget.jsx
│   │   └── ThemeToggle.jsx
│   ├── content/
│   │   └── blog/
│   │       └── post-1.md
│   ├── data/
│   │   └── projects.json    # Data proyek statis
│   └── pages/
│       ├── index.astro
│       ├── projects.astro
│       ├── blog.astro
│       └── dashboard.astro  # Fitur pribadi
├── package.json
├── tailwind.config.js
└── astro.config.mjs
