"use client";
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
const FabricCanvas = dynamic(
  () => import('../components/HtmlCanvas').then(mod => mod.FabricCanvas),
  { ssr: false }
);
import { QuoteTabs } from '../components/QuoteTabs';
import { ImageSearch } from '../components/ImageSearch';
// import { ExportControls } from '../components/ExportControls';
import HelpBox from '../components/HelpBox';
import FeedbackCard from '../components/FeedbackCard';
// No longer using App.css as styles are in app-styles.css

// Desktop Recommendation Notice component
function DesktopRecommendationNotice() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth <= 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (!isMounted || !isMobile) return null;
  
  return (
    <div className="mobile-desktop-banner">
      <div className="mobile-desktop-banner-content">
        <span className="mobile-desktop-banner-icon">💻</span>
        <span className="mobile-desktop-banner-text">
          StayFrame works best on desktop devices for the full experience
        </span>
      </div>
    </div>
  );
}

// Mobile Export Buttons component
function MobileExportButtons({ handleExportImage, handleCopyToClipboard }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth <= 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (!isMounted || !isMobile) return null;
  
  return (
    <div className="mobile-export-buttons">
      <button onClick={handleExportImage}>
        <span>🖼️</span> Export Image
      </button>
      <button onClick={handleCopyToClipboard}>
        <span>📋</span> Copy to Clipboard
      </button>
    </div>
  );
}

export default function Page() {
  const [aspectRatio, setAspectRatio] = useState('twitter-post');
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  // State for quotes - used in child components
  const [, setQuotes] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch('/api/v1/quotes/themes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setThemes(data);
        } else if (data && Array.isArray(data.themes)) {
          setThemes(data.themes);
        } else {
          setThemes([]);
        }
      });
  }, []);

  useEffect(() => {
    setQuotes([]);
    setSelectedQuote(null);
    setImageSearchTerm('');
    setImages([]);
  }, [selectedTheme]);

  useEffect(() => {
    if (!imageSearchTerm) {
      setImages([]);
      return;
    }

    fetch(`/api/v1/images/search?query=${encodeURIComponent(imageSearchTerm)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          setImages([]);
        }
      })
      .catch(err => {
        console.error('[Page] Error fetching images:', err);
        setImages([]);
      });
  }, [imageSearchTerm]);

  const handleThemeChange = (event) => {
    const theme = event.target.value;
    console.log('[Page] Theme changed to:', theme);
    setSelectedTheme(theme);
  };

  const handleQuoteSelect = (quote) => {
    console.log('[Page] Quote selected:', quote);
    setSelectedQuote(quote);
    
    // Auto-search for images based on the quote theme
    if (quote && selectedTheme && !imageSearchTerm) {
      setImageSearchTerm(selectedTheme);
    }
  };

  const handleImageSearch = (term) => {
    console.log('[Page] handleImageSearch called with:', term);
    setImageSearchTerm(term);
  };

  const handleImageSelect = (img) => {
    console.log('[Page] handleImageSelect called with:', img);
    setSelectedImage(img);
  };

  return (
    <>
      {/* Desktop Recommendation Notice */}
      <DesktopRecommendationNotice />
      
      <header style={{
        background: '#ffffff',
        padding: '16px 0',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <h1 style={{
              margin: 0,
              fontFamily: "var(--font-heading)",
              fontSize: '32px',
              fontWeight: 800,
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>StayFrame</h1>
            <span style={{
              color: 'var(--color-text-secondary)',
              fontSize: '16px',
              fontWeight: 500
            }}>- Visual Story Maker</span>
          </div>
          <span style={{
            marginTop: '4px',
            color: 'var(--color-text-secondary)',
            fontSize: '15px',
            fontWeight: 500,
            fontStyle: 'italic'
          }}>Every quote has a story. We help you say it.</span>
          
          <div style={{
            marginTop: '12px',
            display: 'flex',
            gap: '16px'
          }}>
            <a 
              href="/pro/gif-creator" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              <span>✨</span>
              <span>Pro GIF Creator</span>
              <span style={{
                background: '#f0f4ff',
                color: '#4f46e5',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>NEW</span>
            </a>
          </div>
        </div>
      </header>

      <div style={{
        background: 'var(--color-accent-light)',
        padding: '10px 0',
        textAlign: 'center',
        color: 'var(--color-primary-darker)',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>🚀</span>
          This is a beta version for public testing. Your feedback is appreciated!
        </div>
      </div>

      <main style={{
        backgroundColor: '#f9fafb',
        minHeight: 'calc(100vh - 120px)',
        paddingBottom: '32px'
      }}>
        <div className="app-container" style={{
          maxWidth: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          padding: '24px 24px'
        }}>
          {/* Left Sidebar */}
          <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
            padding: '16px',
            width: '25%',
            minWidth: '240px',
            height: 'fit-content',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 className="feature-title"><span style={{ fontSize: '18px' }}>✨</span> Find Inspiration</h2>
              <p className="section-description">Select a theme from the dropdown, click a quote to add it to canvas, and choose an image for background.</p>
              
              <div className="form-group">
                <label htmlFor="theme-select" className="form-label">Theme</label>
                <select 
                  id="theme-select"
                  value={selectedTheme} 
                  onChange={handleThemeChange} 
                  className="form-select"
                >
                  <option value="">-- Select a theme --</option>
                  {themes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {selectedTheme && (
              <>
                <QuoteTabs theme={selectedTheme} onQuoteSelect={handleQuoteSelect} />
                
                <ImageSearch 
                  searchTerm={imageSearchTerm}
                  onSearch={handleImageSearch}
                  images={images}
                  onImageSelect={handleImageSelect}
                />
              </>
            )}
          </div>
          
          {/* Main Center Area */}
          <div style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
            padding: '24px',
            minWidth: 0,
            border: '1px solid #e5e7eb'
          }}>
            {/* Template Sizing Dropdown */}
            <div className="form-group" style={{
              width: '100%',
              maxWidth: '650px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <label htmlFor="aspect-ratio" className="form-label" style={{margin: 0}}>Template Size:</label>
              <select
                id="aspect-ratio"
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value)}
                className="form-select"
                style={{
                  minWidth: '220px'
                }}
              >
                <option value="twitter-post">Twitter Post (1024x512)</option>
                <option value="twitter-header">Twitter Header (1500x500)</option>
                <option value="facebook-post">Facebook Post (1200x630)</option>
                <option value="facebook-cover">Facebook Cover (851x315)</option>
                <option value="instagram-square">Instagram Square (1080x1080)</option>
                <option value="instagram-portrait">Instagram Portrait (1080x1350)</option>
                <option value="instagram-story">Instagram Story (1080x1920)</option>
                <option value="instagram-reels">Instagram Reels (1080x1920)</option>
                <option value="linkedin-post">LinkedIn Post (1200x627)</option>
                <option value="linkedin-cover">LinkedIn Cover (1584x396)</option>
                <option value="pinterest-pin">Pinterest Pin (1000x1500)</option>
                <option value="youtube-thumbnail">YouTube Thumbnail (1280x720)</option>
                <option value="tiktok-video">TikTok Video (1080x1920)</option>
              </select>
            </div>

            {/* Canvas */}
            <div className="canvas-wrapper">
              <FabricCanvas 
                quote={selectedQuote} 
                images={selectedImage ? [selectedImage] : []} 
                aspectRatio={aspectRatio}
                ref={canvasRef}
              />
            </div>
            
            {/* Mobile Export Buttons */}
            <MobileExportButtons 
              handleExportImage={async () => {
                if (canvasRef.current && canvasRef.current.exportImage) {
                  try {
                    const dataURL = await canvasRef.current.exportImage();
                    if (dataURL) {
                      const link = document.createElement('a');
                      link.download = 'social-post.png';
                      link.href = dataURL;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  } catch (error) {
                    console.error('Export error:', error);
                    alert('Export failed. Please try again.');
                  }
                }
              }}
              handleCopyToClipboard={async () => {
                if (canvasRef.current && canvasRef.current.copyToClipboard) {
                  try {
                    await canvasRef.current.copyToClipboard();
                    alert('Image copied to clipboard!');
                  } catch (error) {
                    console.error('Copy to clipboard error:', error);
                    alert('Copy to clipboard failed. Please try again.');
                  }
                }
              }}
            />
            
            {/* Export Controls */}
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={async () => {
                  if (canvasRef.current && canvasRef.current.exportImage) {
                    try {
                      // Wait for the exportImage to complete since it's async
                      const dataURL = await canvasRef.current.exportImage();
                      
                      // Only proceed if we got a valid dataURL
                      if (dataURL) {
                        const link = document.createElement('a');
                        link.download = 'social-post.png';
                        link.href = dataURL;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      } else {
                        console.error('Export failed: No data URL returned');
                        alert('Export failed. Please try again.');
                      }
                    } catch (error) {
                      console.error('Export error:', error);
                      alert('Export failed. Please try again.');
                    }
                  }
                }}
              >
                Export
              </button>
              
              <button 
                className="btn btn-accent"
                onClick={async () => {
                  if (canvasRef.current && canvasRef.current.copyToClipboard) {
                    try {
                      // Wait for the copyToClipboard to complete since it's async
                      await canvasRef.current.copyToClipboard();
                      // Show a success message
                      alert('Image copied to clipboard!');
                    } catch (error) {
                      console.error('Copy to clipboard error:', error);
                      alert('Failed to copy to clipboard. Please try again.');
                    }
                  }
                }}
              >
                Copy to Clipboard
              </button>
              
              <a 
                href="https://www.buymeacoffee.com/msk.analyst" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                Buy me a coffee
              </a>
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="sidebar">
            <HelpBox />
            <FeedbackCard />
            
            <div className="sidebar-card">
              <div style={{ padding: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                <h3 className="feature-title">
                  <span style={{ fontSize: '20px' }}>✨</span> More Features Coming Soon
                </h3>
                
                <p className="section-description">
                  Tell your story, your way — with powerful tools built for creators.
                </p>
                
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">📁</div>
                    <h4 className="feature-card-title">Upload Your Own Photos</h4>
                    <p className="feature-card-description">Bring personal moments into your posts with ease.</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">🖼️</div>
                    <h4 className="feature-card-title">Showcase Gallery</h4>
                    <p className="feature-card-description">Keep your creations private — or share them with the world.</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">💬</div>
                    <h4 className="feature-card-title">Smart Caption Suggestions</h4>
                    <p className="feature-card-description">Find the right words, even when you&apos;re out of them.</p>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">📆</div>
                    <h4 className="feature-card-title">Scheduled Posting</h4>
                    <p className="feature-card-description">Plan ahead. Post to Instagram, X, Facebook and more, on your time.</p>
                  </div>
                </div>
              </div>
              <p className="sidebar-footer-text">
                From quotes to memories — StayFrame helps you express what matters.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
