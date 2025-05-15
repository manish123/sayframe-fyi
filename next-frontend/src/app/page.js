"use client";
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
const FabricCanvas = dynamic(
  () => import('../components/HtmlCanvas').then(mod => mod.FabricCanvas),
  { ssr: false }
);
import { QuoteTabs } from '../components/QuoteTabs';
import { ImageSearch } from '../components/ImageSearch';
import BuyMeCoffeeButton from '../components/BuyMeCoffeeButton';
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

// Responsive Export Buttons Styles
const buttonStyle = {
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  padding: '0.5rem 1.25rem',
  borderColor: 'transparent',
  transition: 'all 0.2s ease'
};

const primaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: 'var(--primary)',
  color: 'var(--dark-bg)'
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: 'var(--dark-bg)',
  color: 'var(--light-text)'
};

// Removed unused accentButtonStyle

// Help Modal Component
const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ borderTop: '3px solid var(--primary)' }}>
        <header className="modal-card-head" style={{ 
          backgroundColor: 'var(--dark-bg)', 
          borderBottom: '1px solid var(--dark-bg-light)' 
        }}>
          <p className="modal-card-title" style={{ color: 'var(--light-text)' }}>
            <span className="icon mr-2" style={{ color: 'var(--primary)' }}>📘</span>
            How to use StayFrame
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body" style={{ backgroundColor: 'var(--background)' }}>
          <div className="content">
            <ol style={{ lineHeight: '1.8' }}>
              <li>Choose a <strong style={{ color: 'var(--primary)' }}>theme</strong> from the dropdown menu to explore related content</li>
              <li>Browse and select a <strong style={{ color: 'var(--primary)' }}>quote</strong> to add to your canvas (use &quot;Load More&quot; to see additional quotes)</li>
              <li>Click on an <strong style={{ color: 'var(--primary)' }}>image</strong> to set it as your background</li>
              <li>Try different <strong style={{ color: 'var(--primary)' }}>search terms</strong> (like &quot;background&quot;) to find more image options</li>
              <li>When finished, use <strong style={{ color: 'var(--primary)' }}>Export</strong> or <strong style={{ color: 'var(--primary)' }}>Copy to Clipboard</strong> to share your creation on social media</li>
            </ol>
          </div>
        </section>
        <footer className="modal-card-foot" style={{ 
          backgroundColor: 'var(--background)', 
          borderTop: '1px solid #e0e0e0' 
        }}>
          <button 
            className="button" 
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--dark-bg)',
              borderColor: 'transparent'
            }}
            onClick={onClose}
          >
            Got it!
          </button>
        </footer>
      </div>
    </div>
  );
};

// Feedback Modal Component
const FeedbackModal = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Submitting feedback:', feedback);
      const res = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSubmitted(true);
        setFeedback("");
      } else {
        setError(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ borderTop: '3px solid var(--primary)' }}>
        <header className="modal-card-head" style={{ 
          backgroundColor: 'var(--dark-bg)', 
          borderBottom: '1px solid var(--dark-bg-light)' 
        }}>
          <p className="modal-card-title" style={{ color: 'var(--light-text)' }}>
            <span className="icon mr-2" style={{ color: 'var(--primary)' }}>📫</span>
            Send Feedback
          </p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body" style={{ backgroundColor: 'var(--background)' }}>
          {error && (
            <div className="notification is-danger is-light">
              {error}
            </div>
          )}
          
          {submitted ? (
            <div className="notification" style={{ 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--dark-bg)' 
            }}>
              Thank you for your feedback! We appreciate your input.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label" style={{ color: 'var(--foreground)' }}>
                  Share your ideas or what you&apos;d love to see next
                </label>
                <div className="control">
                  <textarea
                    className="textarea"
                    rows="4"
                    placeholder="Your feedback helps us improve StayFrame..."
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    style={{ 
                      borderColor: 'var(--primary-light)',
                      boxShadow: 'none'
                    }}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button 
                    type="submit" 
                    className={`button ${isSubmitting ? 'is-loading' : ''}`}
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--dark-bg)',
                      borderColor: 'transparent'
                    }}
                    disabled={!feedback.trim() || isSubmitting}
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default function Page() {
  const [aspectRatio, setAspectRatio] = useState('twitter-post');
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  // State for images and selections
  const [images, setImages] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSearchTerm, setImageSearchTerm] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
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
      
      <header className="navbar py-3" style={{ 
        background: 'var(--dark-bg)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
      }}>
        <div className="container">
          <div className="navbar-brand">
            <div className="navbar-item" style={{ display: 'flex', alignItems: 'center' }}>
              <h1 className="title is-4 mb-0" style={{ 
                fontFamily: "var(--font-heading)", 
                fontWeight: 600, 
                letterSpacing: "0.5px",
                color: "var(--primary)",
                display: 'flex',
                alignItems: 'center',
                margin: 0
              }}>StayFrame</h1>
              <span className="ml-2 is-italic" style={{ 
                color: "var(--light-text)", 
                opacity: 0.9, 
                fontSize: "var(--text-sm)",
                display: 'flex',
                alignItems: 'center'
              }}>- Visual Story Maker</span>
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <span className="is-italic" style={{ 
                color: "var(--light-text)", 
                opacity: 0.9, 
                fontSize: "var(--text-sm)" 
              }}>Every quote has a story. We help you say it.</span>
            </div>
          </div>
        </div>
      </header>

      <div className="py-2 mb-0 has-text-centered" style={{ 
        background: 'var(--primary)', 
        color: 'var(--dark-bg)',
        fontSize: "var(--text-sm)",
        fontWeight: 500
      }}>
        <div className="container">
          <p>
            <span className="icon mr-1">🚧</span>
            This is a beta version for public testing. Your feedback is appreciated!
          </p>
        </div>
      </div>

      <main className="section pt-4" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container is-fluid">
          <div className="columns is-variable is-4">
            {/* Left Sidebar */}
            <div className="column is-one-quarter">
              <div className="box" style={{ 
                backgroundColor: 'var(--dark-bg)', 
                borderTop: '3px solid var(--primary)', 
                padding: '1.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div className="mb-4">
                  <h2 className="title is-5" style={{ 
                    fontSize: 'var(--text-lg)', 
                    fontWeight: 600, 
                    color: 'var(--light-text)' 
                  }}>
                    <span className="icon mr-2" style={{ color: 'var(--primary)' }}>🎨</span> 
                    Find Inspiration
                  </h2>
                  <p className="subtitle is-6" style={{ 
                    fontSize: 'var(--text-sm)', 
                    marginTop: '0.5rem', 
                    lineHeight: '1.5',
                    color: 'var(--light-text)',
                    opacity: 0.9
                  }}>Select a theme from the dropdown, click a quote to add it to canvas, and choose an image for background.</p>
                  
                  <div className="field mt-4">
                    <label htmlFor="theme-select" className="label" style={{ 
                      fontSize: 'var(--text-sm)', 
                      marginBottom: '0.5rem',
                      color: 'var(--primary-light)'
                    }}>Theme</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select 
                          id="theme-select"
                          value={selectedTheme} 
                          onChange={handleThemeChange}
                          style={{ 
                            fontSize: 'var(--text-base)',
                            backgroundColor: 'var(--dark-bg-light)',
                            color: 'var(--light-text)',
                            borderColor: 'var(--primary)',
                            boxShadow: 'none'
                          }}
                        >
                          <option value="">-- Select a theme --</option>
                          {themes.map(theme => (
                            <option key={theme} value={theme}>{theme}</option>
                          ))}
                        </select>
                      </div>
                    </div>
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
            </div>
            
            {/* Main Center Area */}
            <div className="column is-three-quarters">
              <div className="has-text-centered p-4" style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                {/* Template Sizing Dropdown */}
                <div className="field is-horizontal mb-4">
                  <div className="field-label is-normal">
                    <label htmlFor="aspect-ratio" className="label" style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: 500,
                      color: 'var(--dark-bg)'
                    }}>Template Size:</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            id="aspect-ratio"
                            value={aspectRatio}
                            onChange={e => setAspectRatio(e.target.value)}
                            style={{ 
                              fontSize: 'var(--text-base)', 
                              fontFamily: 'var(--font-body)',
                              backgroundColor: 'var(--dark-bg-light)',
                              color: 'var(--light-text)',
                              borderColor: 'var(--primary)',
                              boxShadow: 'none'
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Canvas */}
                <div className="my-4 is-flex is-justify-content-center is-align-items-center" style={{
                  flex: '1',
                  minHeight: '400px',
                  padding: '1rem',
                  position: 'relative'
                }}>
                  <FabricCanvas 
                    quote={selectedQuote} 
                    images={selectedImage ? [selectedImage] : []} 
                    aspectRatio={aspectRatio}
                    ref={canvasRef}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
                
                {/* Export Controls - Using Bulma's responsive classes */}
                <div className="buttons is-centered mt-4">
                  <button 
                    className="button"
                    style={primaryButtonStyle}
                    onClick={async () => {
                      if (canvasRef.current && canvasRef.current.exportImage) {
                        try {
                          // Wait for the exportImage to complete since it's async
                          const dataURL = await canvasRef.current.exportImage();
                          
                          // Only proceed if we got a valid dataURL
                          if (dataURL) {
                            const link = document.createElement('a');
                            link.download = 'stayframe-creation.png';
                            link.href = dataURL;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            
                            // Show engaging success message
                            const successMessages = [
                              "Woohoo! You've been Framed! 🎉",
                              "Looking good! Your creation is ready to shine! ✨",
                              "Awesome! Your StayFrame masterpiece is ready! 🖼️",
                              "Great job! You're now officially Framed! 🌟"
                            ];
                            const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
                            alert(randomMessage);
                          }
                        } catch (error) {
                          console.error('Export error:', error);
                          alert('Export failed. Please try again.');
                        }
                      }
                    }}
                  >
                    Export Image
                  </button>
                  
                  <button 
                    className="button"
                    style={secondaryButtonStyle}
                    onClick={async () => {
                      if (canvasRef.current && canvasRef.current.copyToClipboard) {
                        try {
                          // Wait for the copyToClipboard to complete since it's async
                          await canvasRef.current.copyToClipboard();
                          // Show engaging success message
                          const successMessages = [
                            "Copied to clipboard! Ready to make your social media shine! ✨",
                            "Your StayFrame creation is now in your clipboard! Paste away! 📋",
                            "Clipboard loaded with awesomeness! Share the StayFrame magic! 🪄",
                            "Copy complete! Your creation is ready to impress! 🌟"
                          ];
                          const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
                          alert(randomMessage);
                        } catch (error) {
                          console.error('Copy to clipboard error:', error);
                          alert('Failed to copy to clipboard. Please try again.');
                        }
                      }
                    }}
                  >
                    Copy to Clipboard
                  </button>
                  
                  <BuyMeCoffeeButton />
                </div>
                
                <div className="mt-4 is-flex is-justify-content-center">
                  <button 
                    className="button is-small is-text"
                    style={{ 
                      fontSize: 'var(--text-xs)', 
                      color: 'var(--primary)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px'
                    }}
                    onClick={() => setShowHelpModal(true)}
                  >
                    <span className="icon is-small mr-1">📘</span>
                    How to use StayFrame
                  </button>
                  
                  <button 
                    className="button is-small is-text ml-4"
                    style={{ 
                      fontSize: 'var(--text-xs)', 
                      color: 'var(--primary)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px'
                    }}
                    onClick={() => setShowFeedbackModal(true)}
                  >
                    <span className="icon is-small mr-1">📝</span>
                    Send Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{ 
        background: 'var(--dark-bg)',
        padding: '0.75rem 0',
        marginTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container">
          <div className="is-flex is-justify-content-center is-align-items-center">
            <p style={{ 
              color: 'var(--light-text)', 
              fontSize: 'var(--text-xs)',
              margin: 0,
              padding: 0
            }}>
              © {new Date().getFullYear()} StayFrame. All rights reserved. 
              <span style={{ opacity: 0.7, marginLeft: '0.5rem' }}>Create beautiful social media posts in seconds</span>
            </p>
          </div>
        </div>
      </footer>
      
      {/* Modals */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </>
  );
}
