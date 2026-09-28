# Bevo’s Pack

A responsive dog-walking and training website built with React, TypeScript, and Vite.

## Development

Requires Node.js 20.19 or newer.

```sh
npm install
npm run dev
```

Run `npm run lint` and `npm run build` to check the project. Preview a production build with `npm run preview`.

## Deployment

The included GitHub Actions workflow builds and deploys the site to GitHub Pages when changes are pushed to `main`. Set the repository’s Pages source to **GitHub Actions**.

Live calendar availability is configured at build time with the `VITE_AVAILABILITY_ENDPOINT` Actions variable. Without it, the calendar displays an unavailable/configuration message.

## Features

- Responsive, accessible page layout
- Services, rates, testimonials, and contact form
- Calendar availability backed by a Google Apps Script endpoint
- Per-date walk duration and recurring-request options
