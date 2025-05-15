# StayFrame Social Post Creator

A modern web application for creating beautiful social media posts with customizable text overlays on images. Built with Next.js and Bulma CSS framework.

## Features

- Image upload and search functionality
- Text overlay with customizable fonts, sizes, colors, and styles
- Text positioning and alignment controls
- Export to PNG image format
- Copy to clipboard functionality
- Preview mode for reviewing posts before export
- Mobile-responsive design
- Multi-line text support

## Technology Stack

- **Frontend Framework**: Next.js
- **CSS Framework**: Bulma
- **Image Handling**: HTML Canvas for rendering and export
- **State Management**: React Hooks

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/components/` - React components including HtmlCanvas for the main editor
- `src/app/` - Next.js pages and routing
- `public/` - Static assets

## Subscription Tiers

StayFrame offers different subscription tiers:

- **Free Tier**: Basic image+quote overlay with limited features
- **Pro Tier**: Multiple text boxes, custom fonts, templates, and export options
- **Agency Tier**: Team collaboration, client management, and advanced features

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
