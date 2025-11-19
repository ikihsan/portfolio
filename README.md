# ikihsan.me

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <br />
  <img src="https://img.shields.io/github/license/ikihsan/portfolio?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/github/stars/ikihsan/portfolio?style=for-the-badge" alt="Stars" />
  <img src="https://img.shields.io/github/forks/ikihsan/portfolio?style=for-the-badge" alt="Forks" />
</div>

## ✨ Overview

A sophisticated, hacker-themed portfolio website showcasing backend development expertise. Built with modern web technologies, featuring an interactive terminal interface, privacy data scanner, and seamless animations. Designed for developers who value clean code, creative interactions, and professional presentation.

## 🚀 Features

- **Interactive Terminal**: Execute JavaScript, fetch trivia, jokes, and NASA's APOD directly from the browser
- **Privacy Scanner**: Click the footer to reveal your IP, geolocation, and device data in a terminal-style modal
- **Animated Skills Timeline**: Git log-style presentation of technical evolution
- **Responsive Design**: Optimized for all devices with dark theme and neon accents
- **Typewriter Effects**: Dynamic bio and scan messages with realistic typing animations
- **Contact Integration**: Server-side form submission to Google Forms
- **Accessibility First**: Reduced motion support, ARIA labels, and keyboard navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom neon theme
- **Animations**: Framer Motion
- **Backend**: Node.js API routes for form handling
- **Deployment**: Vercel
- **External APIs**: IPAPI, Open Trivia DB, NASA APOD, Dad Jokes API

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🏁 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ikihsan/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Build & Deploy

### Local Production Build
```bash
npm run build
npm run start
```

### Vercel Deployment (Recommended)
1. Import your GitHub repo in the Vercel dashboard
2. Set framework to Next.js
3. Configure custom domain if desired
4. Deploy automatically on push

### Alternative Deployments
- **Netlify**: Connect repo and set build command to `npm run build`
- **GitHub Pages**: Not recommended for full Next.js features; use static export if needed

## 📁 Project Structure

```
ikihsan.me/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── about/             # About page
│   ├── blog/              # Blog page
│   ├── contact/           # Contact page
│   ├── work/              # Work/Projects page
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Home page
├── components/            # Reusable components
│   ├── Footer.jsx         # Footer with privacy scanner
│   ├── Header.jsx         # Navigation header
│   ├── GradientBackground.jsx
│   └── PopupQuote.jsx     # Welcome quote modal
├── data/                  # Static data
│   └── quotes.js          # Developer quotes
├── lib/                   # Utilities
├── public/                # Static assets
└── styles/                # Global styles
```

## 🎨 Customization

### Personal Information
- Update name and bio in `app/page.jsx` and `app/about/page.jsx`
- Replace logo in `public/logo.svg`
- Update social links in terminal commands

### Styling
- Modify theme colors in `tailwind.config.js`
- Adjust animations in component files
- Update fonts in `app/layout.jsx`

### Content
- Add projects in `app/work/page.jsx`
- Update skills timeline in `app/page.jsx`
- Modify quotes in `data/quotes.js`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Ihsanul Hak IK**
- Website: [ikihsan.me](https://ikihsan.me)
- LinkedIn: [linkedin.com/in/ikihsan](https://linkedin.com/in/ikihsan)
- GitHub: [github.com/ikihsan](https://github.com/ikihsan)

---

<div align="center">
  <p>Built with ❤️ and lots of ☕</p>
  <p>© 2025 ikihsan.me</p>
</div>