"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProLayout({ children }) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pro features navigation */}
      <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-xl font-bold">SayFrame</span>
                <span className="ml-1 bg-yellow-400 text-indigo-900 px-2 py-0.5 rounded-md text-xs font-bold">PRO</span>
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  href="/pro/gif-creator"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/pro/gif-creator' 
                      ? 'bg-indigo-700 text-white' 
                      : 'text-white hover:bg-indigo-500'
                  }`}
                >
                  GIF Creator
                </Link>
                {/* Add more pro features here */}
              </div>
            </div>
            <div>
              <Link 
                href="/"
                className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to Main App
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main>
        {children}
      </main>
      
      {/* Pro features footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold">SayFrame Pro</p>
              <p className="text-gray-400">Create amazing social media content</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-300 hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white">
                Privacy
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
