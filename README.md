# 🚀 Ihsanul Hak - Modern Portfolio

A stunning, modern portfolio website built with React, TypeScript, and cutting-edge web technologies. This is a complete refactor of my previous portfolio, now featuring a modern framework-based approach with enhanced animations, better performance, and responsive design.

## ✨ Features

- **Modern Framework**: Built with React 18 + TypeScript for type safety and better development experience
- **Stunning Animations**: Powered by Framer Motion for smooth, performant animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: 3D animations, particle effects, and smooth scrolling
- **Performance Optimized**: Fast loading times with Vite bundler
- **SEO Friendly**: Proper meta tags and semantic HTML structure
- **Contact Form**: Functional contact form with validation
- **Project Showcase**: Features my latest projects including ForexAI platform

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast
- **Build Tool**: Vite
- **Development**: ESLint, PostCSS, Autoprefixer

## 🎨 Design Features

- **Dark Theme**: Modern dark theme with gradient accents
- **Glass Morphism**: Beautiful glass effects and blur backgrounds
- **Particle System**: Dynamic particle background animations
- **Neon Effects**: Glowing text and hover effects
- **Smooth Scrolling**: Seamless navigation between sections
- **Interactive Cards**: Hover effects and 3D transformations

## 📱 Sections

1. **Hero Section**: Eye-catching introduction with typing animation
2. **About Me**: Personal information with social links and stats
3. **Skills**: Interactive skill cards with proficiency indicators
4. **Projects**: Showcase of featured projects including:
   - **ForexAI Trading Platform** (forexai.coms.codes)
   - **AI Mock Interview System**
   - **Personal Portfolio v2**
5. **Contact**: Functional contact form with multiple contact methods

## 🚀 Quick Deploy

### Deploy to Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ikihsan/portfolio)

1. Click the deploy button above
2. Connect your GitHub account
3. Your portfolio will be deployed automatically
4. Custom domain can be added in Vercel dashboard

### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ikihsan/portfolio)

1. Click the deploy button above
2. Connect your GitHub account
3. Site will be built and deployed automatically

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ikihsan/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Key Improvements from Previous Version

### Technical Improvements
- **Framework-based**: Moved from vanilla JavaScript to React + TypeScript
- **Component Architecture**: Modular, reusable components
- **Type Safety**: Full TypeScript implementation
- **Modern Tooling**: Vite for faster development and builds
- **Better Performance**: Optimized animations and lazy loading

### Design Improvements
- **Enhanced Animations**: Sophisticated motion design with Framer Motion
- **Better UX**: Improved navigation and user interactions
- **Modern Aesthetics**: Updated color scheme and typography
- **Responsive Design**: Better mobile experience
- **Interactive Elements**: More engaging user interactions

### Content Updates
- **Project Showcase**: Added ForexAI trading platform
- **Skill Representation**: Interactive skill cards with proficiency levels
- **Better Contact**: Enhanced contact form with validation
- **Social Integration**: Better social media integration

## 🌟 Featured Projects

### ForexAI Trading Platform
- **URL**: [forexai.coms.codes](https://forexai.coms.codes)
- **Tech**: Node.js, NestJS, AI/ML, PostgreSQL
- **Description**: Advanced AI-powered forex trading system

### AI Mock Interview System
- **GitHub**: [Mock Interview](https://github.com/ikihsan/Mock_interview)
- **Tech**: Node.js, NestJS, AI Integration
- **Description**: Intelligent interview preparation platform

## 📞 Contact

- **Email**: ikihsaan@gmail.com
- **GitHub**: [github.com/ikihsan](https://github.com/ikihsan)
- **Instagram**: [@ikihsaan](https://www.instagram.com/ikihsaan/)
- **Portfolio**: [ikihsan.coms.codes](https://ikihsan.coms.codes)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** for amazing animation capabilities
- **Tailwind CSS** for rapid styling
- **Lucide** for beautiful icons
- **React** ecosystem for powerful development tools

---

⭐ **Star this repository if you found it helpful!**

Built with ❤️ by Ihsanul Hak IK

## CI: Build iOS app with Codemagic

This repository includes `codemagic.yaml` to build the iOS app (Capacitor wrapper) in the cloud and deliver a TestFlight build.

Quick start
- Ensure changes are pushed to GitHub (already configured).
- In Codemagic, add the app from your GitHub repo and choose “Use codemagic.yaml”.
- Add an environment group named `app_store_connect` with:
   - APP_STORE_CONNECT_PRIVATE_KEY (contents of your .p8 ASC API key)
   - APP_STORE_CONNECT_KEY_IDENTIFIER
   - APP_STORE_CONNECT_ISSUER_ID
- Start the workflow: “iOS • Capacitor • TestFlight”.

What the pipeline does
1) Uses Node 18, runs `npm ci` and `npm run native:prep` (builds web and syncs iOS)
2) Runs CocoaPods in `native/ios`
3) Builds an .ipa via Xcode using the App scheme and uploads to TestFlight

Artifacts
- The generated .ipa and logs are available in the workflow artifacts. TestFlight upload is automatic when credentials are set.
