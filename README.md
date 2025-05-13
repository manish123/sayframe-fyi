# SayFrame.fyi - Social Post Creator

A modern web application that allows users to create beautiful social media posts with custom quotes and images. Perfect for content creators, marketers, and social media enthusiasts.

## Features

- Interactive canvas with real-time preview
- Extensive quote library with categories and themes
- Image search and integration
- Multiple template sizes for all major social platforms:
  - Twitter/X: Post (1024x512), Header (1500x500)
  - Facebook: Post (1200x630), Cover (851x315)
  - Instagram: Square (1080x1080), Portrait (1080x1350), Story/Reels (1080x1920)
  - LinkedIn: Post (1200x627), Cover (1584x396)
  - Pinterest: Pin (1000x1500)
  - YouTube: Thumbnail (1280x720)
  - TikTok: Video (1080x1920)
- Text customization (font, size, color, alignment)
- Export to image
- Copy to clipboard functionality
- User feedback collection

## Local Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/social-post-creator.git
   cd social-post-creator
   ```

2. Install dependencies:
   ```bash
   cd next-frontend
   npm install
   ```

3. Create a `.env.local` file in the next-frontend directory with your API keys:
   ```
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `next-frontend/`: Next.js application with the following structure:
  - `src/app/`: Next.js app router pages and API routes
  - `src/components/`: React components including the canvas
  - `src/styles/`: CSS stylesheets
  - `src/data/`: JSON data files for quotes and feedback
  - `public/`: Static assets

## Deployment to Vercel

### Prerequisites

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

### Deployment Steps

1. Login to Vercel:
   ```bash
   vercel login
   ```

2. Navigate to the project directory:
   ```bash
   cd next-frontend
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```
   Follow the prompts to configure your project. For most options, you can accept the defaults.

4. Set up environment variables in the Vercel dashboard:
   - Go to your project in the Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add your `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`

5. For production deployment:
   ```bash
   vercel --prod
   ```

### Continuous Deployment

For automatic deployments on code changes:

1. Connect your GitHub repository to Vercel
2. Enable automatic deployments in the Vercel dashboard
3. Push changes to your repository to trigger deployments

## Performance Optimizations

- Next.js Image component for optimized image loading
- Font optimization with next/font
- SEO optimizations with metadata
- Progressive Web App (PWA) support
- Responsive design for all device sizes
