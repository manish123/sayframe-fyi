"use client";
import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Consistent styling for the entire application
const appStyles = {
  fontFamily: 'Roboto, Arial, sans-serif',
  colors: {
    primary: '#23d160', // Bulma's green
    secondary: '#363636', // Bulma's dark
    text: '#4a4a4a',     // Bulma's text
    lightText: '#7a7a7a', // Bulma's light text
    white: '#ffffff',
    black: '#0a0a0a',     // Bulma's black
    background: '#f5f5f5', // Bulma's background
    border: '#dbdbdb'      // Bulma's border
  },
  borderRadius: '4px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  fontSize: {
    small: '14px',
    medium: '16px',
    large: '18px'
  }
};

const ASPECT_RATIOS = {
  // Twitter
  'twitter-post': { width: 1024, height: 512 },
  'twitter-header': { width: 1500, height: 500 },
  
  // Facebook
  'facebook-post': { width: 1200, height: 630 },
  'facebook-cover': { width: 851, height: 315 },
  
  // Instagram
  'instagram-square': { width: 1080, height: 1080 },
  'instagram-portrait': { width: 1080, height: 1350 },
  'instagram-story': { width: 1080, height: 1920 },
  'instagram-reels': { width: 1080, height: 1920 },
  
  // LinkedIn
  'linkedin-post': { width: 1200, height: 627 },
  'linkedin-cover': { width: 1584, height: 396 },
  
  // Pinterest
  'pinterest-pin': { width: 1000, height: 1500 },
  
  // YouTube
  'youtube-thumbnail': { width: 1280, height: 720 },
  
  // TikTok
  'tiktok-video': { width: 1080, height: 1920 }
};

// Define the component with forwardRef and display name
const FabricCanvasComponent = forwardRef(({ quote, images = [], aspectRatio = 'instagram-square' }, ref) => {
  // We don't need containerRef anymore since we're using canvasRef
  // const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['instagram-square']);
  const [quoteText, setQuoteText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  // Text styling and positioning
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 }); // % values - centered
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [textSize, setTextSize] = useState(32);
  const [isResizing, setIsResizing] = useState(false);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textShadow] = useState('2px 2px 5px rgba(0,0,0,0.5)');
  const [textAlignment, setTextAlignment] = useState('center'); // Default to center alignment
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontStyle, setFontStyle] = useState('italic');
  const [fontWeight, setFontWeight] = useState('bold');
  const [showTooltip, setShowTooltip] = useState('');
  const textRef = useRef(null);
  
  // Available fonts - using consistent typography
  const fonts = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Playfair', value: 'Playfair Display, serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' }
  ];
  
  // Available colors
  const colors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Yellow', value: '#ffeb3b' },
    { name: 'Blue', value: '#2196f3' },
    { name: 'Pink', value: '#e91e63' }
  ];
  
  // Debug logs
  useEffect(() => {
    console.log('[HtmlCanvas] Props received:', { 
      quote: quote ? (typeof quote === 'string' ? quote : (quote.text || quote.quote)) : 'none', 
      hasImages: images && images.length > 0,
      aspectRatio
    });
  }, [quote, images, aspectRatio]);
  
  // Update canvas size when aspect ratio changes
  useEffect(() => {
    setCanvasSize(ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['instagram-square']);
  }, [aspectRatio]);
  
  // Process quote when it changes
  useEffect(() => {
    if (quote) {
      let text = '';
      if (typeof quote === 'string') {
        text = quote;
      } else if (quote?.text) {
        text = quote.text;
      } else if (quote?.quote) {
        text = quote.quote;
      } else if (quote) {
        text = JSON.stringify(quote);
      }
      
      console.log('[HtmlCanvas] Setting quote text:', text);
      setQuoteText(text);
    } else {
      setQuoteText('');
    }
  }, [quote]);
  
  // Process image when it changes
  useEffect(() => {
    if (images && images.length > 0) {
      const img = images[0];
      let url = '';
      
      if (typeof img === 'string') {
        url = img;
      } else if (img?.url) {
        url = img.url;
      } else if (img?.src) {
        url = img.src;
      } else if (img?.urls?.regular) {
        url = img.urls.regular;
      } else if (img?.urls?.full) {
        url = img.urls.full;
      } else {
        console.warn('[HtmlCanvas] Unexpected image format:', img);
        return;
      }
      
      console.log('[HtmlCanvas] Setting image URL:', url);
      setIsImageLoading(true);
      setImageUrl(url);
    } else {
      setImageUrl('');
    }
  }, [images]);
  
  // Handle image load completion
  const handleImageLoad = () => {
    console.log('[HtmlCanvas] Image loaded successfully');
    setIsImageLoading(false);
  };
  
  // Handle image load error
  const handleImageError = (error) => {
    console.error('[HtmlCanvas] Error loading image:', error);
    setIsImageLoading(false);
  };
  
  // Text interaction handlers
  const handleTextClick = (e) => {
    if (!quoteText) return;
    
    e.stopPropagation(); // Prevent canvas click from deselecting
    setIsTextSelected(true);
    
    // Check if the click is on a control handle
    const target = e.target;
    if (target.classList.contains('resize-handle')) {
      setIsResizing(true);
      return;
    }
    
    // Otherwise start dragging
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleCanvasClick = (e) => {
    // Deselect text when clicking outside
    if (isTextSelected && textRef.current && !textRef.current.contains(e.target)) {
      setIsTextSelected(false);
    }
  };
  
  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    
    if (isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      // Calculate new position in percentage
      const newX = textPosition.x + (deltaX / canvasWidth) * 100;
      const newY = textPosition.y + (deltaY / canvasHeight) * 100;
      
      // Clamp values to keep text within canvas
      const clampedX = Math.max(10, Math.min(90, newX));
      const clampedY = Math.max(10, Math.min(90, newY));
      
      setTextPosition({ x: clampedX, y: clampedY });
      setDragStart({
        x: mouseX,
        y: mouseY
      });
    } else if (isResizing) {
      // Handle resizing with smoother control
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      
      // Calculate new font size based on mouse position
      const canvasHeight = rect.height;
      const relativeY = 1 - (mouseY / canvasHeight); // Invert so dragging up increases size
      
      // Map relative position to font size (16px to 72px) with easing
      const minSize = 16;
      const maxSize = 72;
      const range = maxSize - minSize;
      const newSize = minSize + (range * Math.pow(relativeY, 1.5)); // Apply easing
      
      setTextSize(Math.round(newSize));
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };
  
  // Handle text alignment change
  const changeTextAlignment = (alignment) => {
    setTextAlignment(alignment);
  };
  
  // Handle text color change
  const changeTextColor = (color) => {
    setTextColor(color);
  };
  
  // Handle font family change
  const changeFontFamily = (font) => {
    setFontFamily(font);
  };
  
  // Handle font style toggle
  const toggleFontStyle = () => {
    setFontStyle(prev => prev === 'italic' ? 'normal' : 'italic');
  };
  
  // Handle font weight toggle
  const toggleFontWeight = () => {
    setFontWeight(prev => prev === 'bold' ? 'normal' : 'bold');
  };
  
  // Show tooltip
  const handleShowTooltip = (text) => {
    setShowTooltip(text);
  };
  
  // Hide tooltip
  const handleHideTooltip = () => {
    setShowTooltip('');
  };
  
  // Add and remove event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);
  
  // Add keyboard shortcuts for text manipulation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isTextSelected) return;
      
      // Arrow keys to move text
      if (e.key === 'ArrowUp') {
        setTextPosition(prev => ({ ...prev, y: Math.max(10, prev.y - 1) }));
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        setTextPosition(prev => ({ ...prev, y: Math.min(90, prev.y + 1) }));
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        setTextPosition(prev => ({ ...prev, x: Math.max(10, prev.x - 1) }));
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setTextPosition(prev => ({ ...prev, x: Math.min(90, prev.x + 1) }));
        e.preventDefault();
      }
      
      // + and - keys to resize text
      if (e.key === '+' || e.key === '=') {
        setTextSize(prev => Math.min(72, prev + 2));
        e.preventDefault();
      } else if (e.key === '-' || e.key === '_') {
        setTextSize(prev => Math.max(16, prev - 2));
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTextSelected]);
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    updateText: (options) => {
      if (options.color) setTextColor(options.color);
      if (options.size) setTextSize(options.size);
      if (options.alignment) setTextAlignment(options.alignment);
      console.log('[HtmlCanvas] Text updated with:', options);
    },
    addText: (text = 'New Text') => {
      setQuoteText(prevText => prevText ? `${prevText}\n${text}` : text);
      setIsTextSelected(true);
    },
    exportImage: async () => {
      if (!canvasRef.current) return Promise.resolve('');

      return new Promise(async (resolve, reject) => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const { width, height } = canvasSize;

          canvas.width = width;
          canvas.height = height;

          console.log('[HtmlCanvas] Canvas dimensions:', { width: canvas.width, height: canvas.height, canvasSize });

          // Draw white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);

          // Handle background image
          if (imageUrl) {
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              await new Promise((resolve, reject) => {
                const cacheBuster = `?cb=${Date.now()}`;
                const finalUrl = imageUrl.includes('?')
                  ? `${imageUrl}&crossorigin=anonymous`
                  : `${imageUrl}?crossorigin=anonymous${cacheBuster}`;
                img.onload = resolve;
                img.onerror = reject;
                img.src = finalUrl;
              });

              const imgRatio = img.width / img.height;
              const canvasRatio = width / height;
              let drawWidth, drawHeight, drawX, drawY;

              if (imgRatio > canvasRatio) {
                drawHeight = height;
                drawWidth = height * imgRatio;
                drawX = (width - drawWidth) / 2;
                drawY = 0;
              } else {
                drawWidth = width;
                drawHeight = width / imgRatio;
                drawX = 0;
                drawY = (height - drawHeight) / 2;
              }

              ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

              // Add a slight darkening overlay for better text visibility
              ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
              ctx.fillRect(0, 0, width, height);
            } catch (imgError) {
              console.error('[HtmlCanvas] Error loading image for export:', imgError);
            }
          }

          // Draw quote text
          if (quoteText) {
            ctx.font = `${fontStyle} ${fontWeight} ${textSize}px ${fontFamily}`;
            ctx.textAlign = textAlignment;
            ctx.textBaseline = 'middle';
            ctx.fillStyle = textColor;

            // Add text shadow
            const shadowParts = textShadow.match(/([0-9]+px) ([0-9]+px) ([0-9]+px) (rgba?\([^)]+\))/i);
            if (shadowParts) {
              ctx.shadowOffsetX = parseInt(shadowParts[1]);
              ctx.shadowOffsetY = parseInt(shadowParts[2]);
              ctx.shadowBlur = parseInt(shadowParts[3]);
              ctx.shadowColor = shadowParts[4];
            } else {
              ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
              ctx.shadowBlur = 5;
              ctx.shadowOffsetX = 2;
              ctx.shadowOffsetY = 2;
            }

            const textX = width * (textPosition.x / 100);
            const textY = height * (textPosition.y / 100);

            const lines = quoteText.split('\n');
            const lineHeight = textSize * 1.2;
            const totalTextHeight = lines.length * lineHeight;
            const startY = textY - (totalTextHeight / 2);

            lines.forEach((line, index) => {
              ctx.fillText(line, textX, startY + index * lineHeight + lineHeight / 2);
            });

            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }

          // Reset context state and draw watermark
          ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
          ctx.globalAlpha = 1; // Reset transparency
          ctx.font = '13px Arial, sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = '#333C4D';
          console.log('[HtmlCanvas] Drawing watermark at position:', { x: width - 14, y: height - 14 });
          ctx.fillText('powered by stayframe.fyi', width - 14, height - 14);

          // Debug: Append canvas to DOM to inspect
          document.body.appendChild(canvas);
          canvas.style.position = 'absolute';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.zIndex = '9999';
          setTimeout(() => document.body.removeChild(canvas), 5000); // Remove after 5 seconds

          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } catch (error) {
          console.error('[HtmlCanvas] Error exporting image:', error);
          reject(error);
        }
      });
    },
    copyToClipboard: async () => {
      return new Promise(async (resolve, reject) => {
        try {
          const dataURL = await ref.current.exportImage();
          if (!dataURL) {
            console.error('[HtmlCanvas] Failed to generate image');
            reject(new Error('Failed to generate image'));
            return;
          }
        
        // Convert data URL to blob
        const res = await fetch(dataURL);
        const blob = await res.blob();
        
        // Try to use clipboard API if available
        if (navigator.clipboard && window.ClipboardItem) {
          // Use window.ClipboardItem explicitly to avoid minification issues
          const ClipboardItemConstructor = window.ClipboardItem;
          const item = new ClipboardItemConstructor({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          console.log('[HtmlCanvas] Image copied to clipboard');
        } else {
          // Fallback for browsers without clipboard API
          // Use document.createElement directly to avoid minification issues
          const img = document.createElement('img');
          img.src = dataURL;
          document.body.appendChild(img);
          
          // Select the image
          const range = document.createRange();
          range.selectNode(img);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          
          // Copy command
          const success = document.execCommand('copy');
          window.getSelection().removeAllRanges();
          document.body.removeChild(img);
          
          if (success) {
            console.log('[HtmlCanvas] Image copied to clipboard (fallback)');
          } else {
            console.error('[HtmlCanvas] Clipboard API not supported and fallback failed');
          }
        }
        resolve(true);
      } catch (error) {
        console.error('[HtmlCanvas] Error copying to clipboard:', error);
        reject(error);
      }
    });
    }
  }));
  
  // Calculate display size while maintaining aspect ratio
  const getDisplaySize = () => {
    const { width, height } = canvasSize;
    const maxWidth = 600; // Maximum display width
    const ratio = width / height;
    
    if (width > maxWidth) {
      return {
        width: maxWidth,
        height: maxWidth / ratio
      };
    }
    
    return { width, height };
  };
  
  const displaySize = getDisplaySize();
  const showPlaceholder = !quoteText && !imageUrl;
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  
  // Generate preview image when requested
  const handlePreview = async () => {
    setShowPreview(true);
    try {
      // Use the exportImage function from the imperative handle
      const dataUrl = await ref.current.exportImage();
      setPreviewImage(dataUrl);
    } catch (error) {
      console.error('[HtmlCanvas] Error generating preview:', error);
    }
  };
  
  return (
    <div 
      style={{ 
        position: 'relative', 
        background: '#f8fafc', 
        borderRadius: '18px', 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', // Stack elements vertically
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '420px', 
        margin: '24px 0',
        boxShadow: '0 4px 24px rgba(60,60,120,0.10)'
      }}
    >
      <div style={{ position: 'relative' }}>
        
        {/* Preview Modal with Bulma styling */}
        {showPreview && (
          <div className="modal is-active" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 10, 10, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="modal-content" style={{
              backgroundColor: appStyles.colors.white,
              borderRadius: '6px',
              padding: '20px',
              maxWidth: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 2px 15px rgba(0,0,0,0.4)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{
                  margin: 0,
                  color: appStyles.colors.text,
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  Preview ({canvasSize.width}×{canvasSize.height}px)
                </h3>
                <button 
                  className="delete"
                  onClick={() => setShowPreview(false)}
                  aria-label="close"
                  style={{
                    background: appStyles.colors.secondary
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{
                border: `1px solid ${appStyles.colors.border}`,
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0'
              }}>
                {previewImage ? (
                  <Image 
                    src={previewImage} 
                    alt="Preview" 
                    width={800}
                    height={600}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '60vh',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                ) : (
                  <div style={{
                    padding: '40px',
                    color: appStyles.colors.lightText,
                    textAlign: 'center'
                  }}>
                    Generating preview...
                  </div>
                )}
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px'
              }}>
                <button 
                  className="button is-light is-small"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </button>
                <button 
                  className="button is-primary is-small"
                  onClick={() => {
                    if (previewImage) {
                      const link = document.createElement('a');
                      link.download = `stayframe-${Date.now()}.png`;
                      link.href = previewImage;
                      link.click();
                    }
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Text controls that appear when text is selected */}
        {isTextSelected && quoteText && (
          <div className="box has-shadow" style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: appStyles.colors.white,
            padding: '10px 12px',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            zIndex: 20,
            fontFamily: appStyles.fontFamily,
            border: `1px solid ${appStyles.colors.border}`
          }}>
            {/* Top row - Font and style controls */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Font family dropdown */}
              <div className="select is-small" 
                onMouseEnter={() => handleShowTooltip('Change font')}
                onMouseLeave={handleHideTooltip}
              >
                <select 
                  value={fontFamily} 
                  onChange={(e) => changeFontFamily(e.target.value)}
                >
                  {fonts.map(font => (
                    <option key={font.value} value={font.value}>{font.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Style toggles */}
              <button 
                className={`button is-small ${fontStyle === 'italic' ? 'is-primary' : 'is-dark'}`}
                onClick={toggleFontStyle}
                style={{
                  fontStyle: 'italic'
                }}
                onMouseEnter={() => handleShowTooltip('Toggle Italic')}
                onMouseLeave={handleHideTooltip}
              >I</button>
              <button 
                className={`button is-small ${fontWeight === 'bold' ? 'is-primary' : 'is-dark'}`}
                onClick={toggleFontWeight}
                style={{
                  fontWeight: 'bold'
                }}
                onMouseEnter={() => handleShowTooltip('Toggle Bold')}
                onMouseLeave={handleHideTooltip}
              >B</button>
            </div>
            
            {/* Second row - Size, alignment, and color */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Text size controls */}
              <button 
                className="button is-dark is-small"
                onClick={() => setTextSize(prev => Math.max(16, prev - 2))}
                onMouseEnter={() => handleShowTooltip('Decrease Size')}
                onMouseLeave={handleHideTooltip}
              >
                <span className="icon is-small">-</span>
              </button>
              <div style={{ fontSize: appStyles.fontSize.small, display: 'flex', alignItems: 'center', minWidth: '36px', justifyContent: 'center', fontFamily: appStyles.fontFamily, color: appStyles.colors.text }}>{textSize}px</div>
              <button 
                className="button is-dark is-small"
                onClick={() => setTextSize(prev => Math.min(72, prev + 2))}
                onMouseEnter={() => handleShowTooltip('Increase Size')}
                onMouseLeave={handleHideTooltip}
              >
                <span className="icon is-small">+</span>
              </button>
              
              {/* Text alignment controls */}
              <div style={{ width: '1px', background: '#e5e7eb', margin: '0 4px' }} />
              <button 
                className={`button is-small ${textAlignment === 'left' ? 'is-primary' : 'is-dark'}`}
                onClick={() => changeTextAlignment('left')}
                onMouseEnter={() => handleShowTooltip('Align Left')}
                onMouseLeave={handleHideTooltip}
              >
                <span className="icon is-small">L</span>
              </button>
              <button 
                className={`button is-small ${textAlignment === 'center' ? 'is-primary' : 'is-dark'}`}
                onClick={() => changeTextAlignment('center')}
                onMouseEnter={() => handleShowTooltip('Align Center')}
                onMouseLeave={handleHideTooltip}
              >
                <span className="icon is-small">C</span>
              </button>
              <button 
                className={`button is-small ${textAlignment === 'right' ? 'is-primary' : 'is-dark'}`}
                onClick={() => changeTextAlignment('right')}
                onMouseEnter={() => handleShowTooltip('Align Right')}
                onMouseLeave={handleHideTooltip}
              >
                <span className="icon is-small">R</span>
              </button>
              
              {/* Color picker */}
              <div style={{ width: '1px', background: '#e5e7eb', margin: '0 4px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {colors.map(color => (
                  <div 
                    key={color.value}
                    onClick={() => changeTextColor(color.value)}
                    onMouseEnter={() => handleShowTooltip(color.name)}
                    onMouseLeave={handleHideTooltip}
                    style={{
                      width: '20px',
                      height: '20px',
                      background: color.value,
                      border: textColor === color.value ? '2px solid #6366f1' : '1px solid #e5e7eb',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Tooltip */}
            {showTooltip && (
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}>
                {showTooltip}
              </div>
            )}
          </div>
        )}
        
        <div 
          ref={canvasRef}
          style={{
            width: `${displaySize.width}px`,
            height: `${displaySize.height}px`,
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(60,60,120,0.07)',
            cursor: isDragging ? 'grabbing' : (isResizing ? 'ns-resize' : 'default')
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
        >
          {imageUrl && (
            <div className="background-image" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              backgroundColor: 'transparent'
            }}>
              {isImageLoading && (
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  color: '#666',
                  fontSize: '20px'
                }}>
                  Loading image...
                </div>
              )}
              {/* Use regular img tag for better compatibility with canvas export */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imageUrl} 
                alt="Background" 
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  backgroundColor: 'transparent',
                  filter: 'brightness(0.9)' // Slightly darken for better text visibility
                }} 
              />
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                background: 'rgba(0,0,0,0.2)' // Overlay for better text contrast
              }} />
            </div>
          )}
          
          {quoteText && (
            <div 
              ref={textRef}
              style={{ 
                position: 'absolute', 
                top: `${textPosition.y}%`, 
                left: `${textPosition.x}%`, 
                transform: 'translate(-50%, -50%)', 
                width: '80%',
                padding: '20px',
                textAlign: textAlignment,
                color: textColor,
                fontSize: `${textSize}px`,
                fontWeight: fontWeight,
                fontStyle: fontStyle,
                fontFamily: fontFamily,
                textShadow: textShadow,
                zIndex: 10,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                border: isTextSelected ? '1px dashed rgba(255,255,255,0.7)' : 'none',
                borderRadius: '8px',
                background: isTextSelected ? 'rgba(0,0,0,0.1)' : 'transparent',
                transition: 'background 0.2s, border 0.2s'
              }}
              onMouseDown={handleTextClick}
            >
              {quoteText}
              {isTextSelected && (
                <div 
                  className="resize-handle"
                  style={{
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '30px',
                    height: '10px',
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: '0 0 4px 4px',
                    cursor: 'ns-resize',
                    zIndex: 11
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '2px',
                    background: '#6366f1',
                    margin: '4px auto',
                    borderRadius: '2px'
                  }} />
                </div>
              )}
            </div>
          )}
          
          <div style={{ 
            position: 'absolute', 
            bottom: '14px', 
            right: '14px', 
            fontSize: '13px', 
            color: '#333C4D', 
            opacity: 0.85,
            fontFamily: 'Arial, sans-serif',
            textShadow: imageUrl ? '0px 0px 2px #fff' : 'none'
          }}>
            powered by stayframe.fyi
          </div>
        </div>

        {/* Place the Preview button below the canvas */}
        <div style={{
          position: 'absolute',
          top: `${displaySize.height + 10}px`, // Position just below the canvas (height + 10px gap)
          left: '50%',
          transform: 'translateX(-50%)', // Center horizontally
          zIndex: 20,
        }}>
          <button 
            className="button is-primary is-small"
            onClick={handlePreview}
            style={{
              padding: '5px 10px',
              fontSize: '14px',
            }}
          >
            <span className="icon is-small">
              👁️
            </span>
            <span>Preview</span>
          </button>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .button.is-primary.is-small {
              padding: 4px 8px !important;
              font-size: 12px !important;
            }
          }
        `}</style>
        
        {showPlaceholder && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#a0aec0',
            fontSize: '22px',
            fontWeight: 500,
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            pointerEvents: 'none',
            maxWidth: '80%',
            opacity: 0.85
          }}>
            Start with a quote. Or upload your moment.<br/>Let StayFrame help you say it.
          </div>
        )}
      </div>
    </div>
  );
});

// Add display name to fix the React forwardRef warning
FabricCanvasComponent.displayName = 'FabricCanvas';

// Export the component with display name
export const FabricCanvas = FabricCanvasComponent;
