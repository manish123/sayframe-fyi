import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import "../styles/app-styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  title: "SayFrame - Social Post Creator",
  description: "Create beautiful social media posts with custom quotes and images for all platforms",
  keywords: ["social media", "post creator", "quotes", "images", "twitter", "instagram", "facebook", "linkedin"],
  authors: [{ name: "SayFrame Team" }],
  robots: "index, follow",
  openGraph: {
    title: "SayFrame - Social Post Creator",
    description: "Create beautiful social media posts with custom quotes and images for all platforms",
    url: "https://sayframe.fyi",
    siteName: "SayFrame",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SayFrame - Social Post Creator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SayFrame - Social Post Creator",
    description: "Create beautiful social media posts with custom quotes and images for all platforms",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable}`}>
        <main>{children}</main>
        <footer className="app-footer">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} SayFrame. All rights reserved.</p>
            <p>Create beautiful social media posts in seconds</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
