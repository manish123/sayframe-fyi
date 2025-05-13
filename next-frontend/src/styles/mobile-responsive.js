"use client";
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
const FabricCanvas = dynamic(
  () => import('../components/HtmlCanvas').then(mod => mod.FabricCanvas),
  { ssr: false }
);
import { QuoteTabs } from '../components/QuoteTabs';
import { ImageSearch } from '../components/ImageSearch';
import HelpBox from '../components/HelpBox';
import FeedbackCard from '../components/FeedbackCard';
import '../styles/mobile.css';

export default function Page() {
  const [aspectRatio, setAspectRatio] = useState('twitter-post');
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [, setQuotes] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const canvasRef = useRef(null);
  
  // Mobile-specific state
  const [activeTab, setActiveTab] = useState('canvas');
  const [themeCollapsed, setThemeCollapsed] = useState(false);
  const [quotesCollapsed, setQuotesCollapsed] = useState(true);
  const [imagesCollapsed, setImagesCollapsed] = useState(true);
  const [exportCollapsed, setExportCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`/api/v1/images/search?query=${encodeURIComponent(imageSearchTerm)}`, { signal })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.results)) {
          setImages(data.results);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching images:', err);
        }
      });

    return () => {
      controller.abort();
    };
  }, [imageSearchTerm]);

  const handleThemeChange = (event) => {
    const theme = event.target.value;
    setSelectedTheme(theme);
    // Reset other states when theme changes
  };

  const handleQuoteSelect = (quote) => {
    setSelectedQuote(quote);
    
    // Auto-suggest image search based on quote theme or content
    if (quote && !imageSearchTerm) {
      // Extract keywords from quote or use theme
      const searchTerm = selectedTheme || quote.split(' ').slice(0, 2).join(' ');
      setImageSearchTerm(searchTerm);
    }
  };

  const handleImageSearch = (term) => {
    setImageSearchTerm(term);
  };

  const handleImageSelect = (img) => {
    setSelectedImage(img);
  };

  const handleExportImage = async () => {
    if (canvasRef.current && canvasRef.current.exportImage) {
      try {
        // Wait for the exportImage to complete since it's async
        const dataURL = await canvasRef.current.exportImage();
        
        // Only proceed if we got a valid dataURL
        if (dataURL) {
          const link = document.createElement('a');
          link.download = 'stayframe-post.png';
          link.href = dataURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert('Image exported successfully!');
        } else {
          console.error('Export failed: No data URL returned');
          alert('Export failed. Please try again.');
        }
      } catch (error) {
        console.error('Export error:', error);
        alert('Export failed. Please try again.');
      }
    }
  };

  const handleCopyToClipboard = async () => {
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
  };

  return (
    <>
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
            <h1 className="app-title" style={{
              margin: 0,
              fontFamily: "var(--font-heading)",
              fontSize: '32px',
              fontWeight: 800,
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>StayFrame</h1>
            <span className="app-subtitle" style={{
              color: 'var(--color-text-secondary)',
              fontSize: '16px',
              fontWeight: 500
            }}>- Visual Story Maker</span>
          </div>
          <span className="app-tagline" style={{
            marginTop: '4px',
            color: 'var(--color-text-secondary)',
            fontSize: '15px',
            fontWeight: 500,
            fontStyle: 'italic'
          }}>Every quote has a story. We help you say it.</span>
        </div>
      </header>

      <div className="beta-banner" style={{
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
        {/* Mobile Tabs Navigation - Only visible on mobile */}
        {isMobile && (
          <div className="mobile-tabs">
            <div 
              className={`mobile-tab ${activeTab === 'canvas' ? 'active' : ''}`}
              onClick={() => setActiveTab('canvas')}
            >
              Canvas
            </div>
            <div 
              className={`mobile-tab ${activeTab === 'quotes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quotes')}
            >
              Quotes & Images
            </div>
            <div 
              className={`mobile-tab ${activeTab === 'export' ? 'active' : ''}`}
              onClick={() => setActiveTab('export')}
            >
              Export
            </div>
          </div>
        )}
        
        <div className="app-container" style={{
          maxWidth: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          padding: '24px 24px'
        }}>
          {/* Left Sidebar */}
          <div className="left-sidebar" style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
            padding: '16px',
            width: '25%',
            minWidth: '240px',
            height: 'fit-content',
            border: '1px solid #f3f4f6',
            display: isMobile && activeTab !== 'quotes' ? 'none' : 'block'
          }}>
            {/* Theme Selection Section - Collapsible on mobile */}
            <div className="mobile-collapsible">
              <div 
                className="mobile-collapsible-header" 
                onClick={() => isMobile && setThemeCollapsed(!themeCollapsed)}
                style={{ display: isMobile ? 'flex' : 'none' }}
              >
                <span><span style={{ fontSize: '18px' }}>✨</span> Find Inspiration</span>
                <span>{themeCollapsed ? '▼' : '▲'}</span>
              </div>
              
              <div className={`mobile-collapsible-content ${isMobile && themeCollapsed ? 'collapsed' : ''}`}>
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
            </div>
            
            {selectedTheme && (
              <>
                {/* Quotes Section - Collapsible on mobile */}
                <div className="mobile-collapsible">
                  <div 
                    className="mobile-collapsible-header" 
                    onClick={() => isMobile && setQuotesCollapsed(!quotesCollapsed)}
                    style={{ display: isMobile ? 'flex' : 'none' }}
                  >
                    <span>Quotes</span>
                    <span>{quotesCollapsed ? '▼' : '▲'}</span>
                  </div>
                  
                  <div className={`mobile-collapsible-content ${isMobile && quotesCollapsed ? 'collapsed' : ''}`}>
                    <QuoteTabs theme={selectedTheme} onQuoteSelect={handleQuoteSelect} />
                  </div>
                </div>
                
                {/* Images Section - Collapsible on mobile */}
                <div className="mobile-collapsible">
                  <div 
                    className="mobile-collapsible-header" 
                    onClick={() => isMobile && setImagesCollapsed(!imagesCollapsed)}
                    style={{ display: isMobile ? 'flex' : 'none' }}
                  >
                    <span>Background Images</span>
                    <span>{imagesCollapsed ? '▼' : '▲'}</span>
                  </div>
                  
                  <div className={`mobile-collapsible-content ${isMobile && imagesCollapsed ? 'collapsed' : ''}`}>
                    <ImageSearch 
                      searchTerm={imageSearchTerm}
                      onSearch={handleImageSearch}
                      images={images}
                      onImageSelect={handleImageSelect}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Main Center Area */}
          <div className="main-content" style={{
            width: '50%',
            display: isMobile && activeTab !== 'canvas' ? 'none' : 'flex',
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
              gap: '16px',
              flexWrap: isMobile ? 'wrap' : 'nowrap'
            }}>
              <label htmlFor="aspect-ratio" className="form-label" style={{margin: 0}}>Template Size:</label>
              <select
                id="aspect-ratio"
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value)}
                className="form-select"
                style={{
                  minWidth: isMobile ? '100%' : '220px'
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
            <div className="canvas-wrapper" style={{
              width: '100%',
              maxWidth: '650px',
              margin: '20px 0',
              overflow: 'hidden'
            }}>
              <FabricCanvas 
                quote={selectedQuote} 
                images={selectedImage ? [selectedImage] : []} 
                aspectRatio={aspectRatio}
                ref={canvasRef}
              />
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="right-sidebar" style={{
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
            padding: '16px',
            width: '25%',
            minWidth: '240px',
            height: 'fit-content',
            border: '1px solid #f3f4f6',
            display: isMobile && activeTab !== 'export' ? 'none' : 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div className="feature-card">
              <h3 className="feature-title"><span style={{ fontSize: '18px' }}>🎨</span> Customize Your Post</h3>
              <p className="section-description">Click on the text to edit it directly on the canvas. Drag to reposition.</p>
            </div>
            
            <HelpBox />
            
            <FeedbackCard />
            
            {/* Export Section - Collapsible on mobile */}
            <div className="mobile-collapsible">
              <div 
                className="mobile-collapsible-header" 
                onClick={() => isMobile && setExportCollapsed(!exportCollapsed)}
                style={{ display: isMobile ? 'flex' : 'none' }}
              >
                <span>Export Options</span>
                <span>{exportCollapsed ? '▼' : '▲'}</span>
              </div>
              
              <div className={`mobile-collapsible-content ${isMobile && exportCollapsed ? 'collapsed' : ''}`}>
                <div className="action-buttons-container" style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <button
                    className="action-button"
                    onClick={handleExportImage}
                    disabled={!canvasRef.current}
                  >
                    <span>🖼️</span> Export Image
                  </button>
                  <button
                    className="action-button"
                    onClick={handleCopyToClipboard}
                    disabled={!canvasRef.current}
                  >
                    <span>📋</span> Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>
            
            <p className="sidebar-footer-text">
              From quotes to memories — StayFrame helps you express what matters.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
