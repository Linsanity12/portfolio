# morris-lin.com

Source code for my engineering portfolio: **[morris-lin.com](https://morris-lin.com)**

I'm Morris Lin, an Electrical Engineering student at the University of Georgia. The site collects my
work in embedded systems, robotics, and computer vision. It includes full case studies and a face
verification demo that runs in your browser.

## What's on the site

- **AI Model Testing Dashboard**: a full-stack tool that compares language models and prompts by accuracy, speed, and cost
- **AI Facial Recognition Research** (UGA Multispectral Imagery Lab): five pretrained face-verification models benchmarked on LFW
- **Face Verify demo**: in-browser face matching with [face-api.js](https://github.com/justadudewhohacks/face-api.js). Photos never leave your device.
- **FIRST Robotics, Walton 2974**: subsystem design and build as Chief Engineer
- **Plastic bottle to 3D-printer filament**: a recycling machine with a custom PCB
- **Cardboard Electric Vehicle** and **IEEE MicroMouse**: embedded systems work in progress

## Tech

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · face-api.js
Hosted on Cloudflare Pages.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site written to out/
```

See [DEPLOY.md](DEPLOY.md) for how the site gets published.
