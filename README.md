# Prathap - Personal Portfolio

A cinematic, highly interactive personal portfolio built with Next.js, React, Tailwind CSS, and GSAP.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: GSAP (ScrollTrigger), Native HTML5 Canvas
- **Icons**: Lucide React
- **Deployment**: Vercel

## Features
- **Cinematic Interactions**: Real-photo reveal interaction using GSAP masking on the Hero section.
- **HTML5 Canvas Background**: A fully custom, highly-performant interactive neural-network particle system.
- **Dynamic Case Studies**: Projects are loaded from a unified data structure and have their own dynamically generated SEO/Metadata routes.
- **GitHub Integration**: Live repository and follower stats fetched via GitHub API with graceful fallbacks.
- **Responsive & Accessible**: Mobile-friendly navigation, focus trapping, semantic HTML, and reduced-motion support.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables
Create a `.env.local` file with the following variables if you want to test live features requiring authentication:
```
GITHUB_TOKEN=your_github_personal_access_token (optional, prevents rate-limits)
```

## Build
```bash
npm run build
```
