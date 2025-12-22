# Claude Code Project Setup Wizard

> 📖 **[Read Full Documentation](./CLAUDE.md)** - Complete project overview, architecture, and development guide

A Progressive Web App that transforms the Claude Code Project Setup SOP into an interactive wizard with smart defaults, live preview, and auto-save functionality.

**Status:** ✅ MVP Complete | 🚧 Phase 2 Planning

## Features

- ✨ **Smart Presets**: React + Vite, Next.js, Python + Flask
- 🔄 **Auto-Save**: Progress saved every 5 seconds
- 📋 **Live Preview**: Real-time CLAUDE.md generation
- 💾 **Download**: One-click download of your custom config
- 📱 **Responsive**: Works on all devices

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Fill out Project Overview (Step 1)
2. Choose your tech stack or apply a preset (Step 2)
3. Skip through steps 3-8 (using preset defaults)
4. Review and download your CLAUDE.md file (Step 9)

## Tech Stack

- Vite + React + TypeScript
- Zustand (state management)
- Tailwind CSS (styling)
- Zod (validation)
- localforage (persistence)

## MVP Status

✅ Core wizard flow with 9 steps
✅ 3 smart presets (React+Vite, Next.js, Python+Flask)
✅ Live preview
✅ Auto-save & resume
✅ Download CLAUDE.md

## Next Steps

- Implement steps 3-8 fully
- Add import/export config
- PWA offline support
- Deploy to Vercel

---

Built with ❤️ for streamlining Claude Code project setup
