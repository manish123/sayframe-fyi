"use client";
import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import GIF from 'gif.js';

// MultiImageCanvas component for creating GIFs with multiple images and quotes
const MultiImageCanvas = forwardRef(({ quotes = [], images = [], aspectRatio = 'instagram-square' }, ref) => {
  // Constants for aspect ratios
  const ASPECT_RATIOS = {
    'instagram-square': { width: 1080, height: 1080 },
    'instagram-portrait': { width: 1080, height: 1350 },
    'instagram-landscape': { width: 1080, height: 608 },
    'twitter': { width: 1200, height: 675 },
    'facebook': { width: 1200, height: 630 }
  };

  // State variables
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['instagram-square']);
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [frameDuration, setFrameDuration] = useState(500); // milliseconds

  // Initialize frames when images change
  useEffect(() => {
    if (images.length > 0) {
      const initialFrames = images.map((image, index) => ({
        id: `frame-${index}`,
        imageUrl: image.url || '',
        quote: quotes[index] || '',
        textPosition: { x: 50, y: 50 },
        textColor: '#ffffff',
        fontFamily: 'Arial',
        fontSize: 32,
        fontStyle: 'normal',
        fontWeight: 'normal',
        textAlign: 'center',
        duration: frameDuration
      }));
      setFrames(initialFrames);
    }
  }, [images, quotes, frameDuration]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    // Add a new frame
    addFrame(image, quote = '') {
      setFrames(prev => [...prev, {
        id: `frame-${prev.length}`,
        imageUrl: image.url || '',
        quote: quote,
        textPosition: { x: 50, y: 50 },
        textColor: '#ffffff',
        fontFamily: 'Arial',
        fontSize: 32,
        fontStyle: 'normal',
        fontWeight: 'normal',
        textAlign: 'center',
        duration: frameDuration
      }]);
    },

    // Remove a frame
    removeFrame(frameId) {
      setFrames(prev => prev.filter(frame => frame.id !== frameId));
    },

    // Update frame properties
    updateFrame(frameId, properties) {
      setFrames(prev => prev.map(frame => 
        frame.id === frameId ? { ...frame, ...properties } : frame
      ));
    },

    // Reorder frames
    reorderFrames(startIndex, endIndex) {
      setFrames(prev => {
        const result = Array.from(prev);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
      });
    },

    // Set frame duration
    setFrameDuration(duration) {
      setFrameDuration(duration);
    },

    // Generate GIF
    async generateGIF() {
      if (frames.length === 0) return null;
      
      setIsGenerating(true);
      setProgress(0);
      
      try {
        const gif = new GIF({
          workers: 2,
          quality: 10,
          width: canvasSize.width,
          height: canvasSize.height,
          workerScript: '/gif.worker.js'
        });

        // Create a temporary canvas for rendering frames
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasSize.width;
        tempCanvas.height = canvasSize.height;
        const ctx = tempCanvas.getContext('2d');

        // Process each frame
        for (let i = 0; i < frames.length; i++) {
          const frame = frames[i];
          
          // Clear canvas
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
          
          // Draw image if available
          if (frame.imageUrl) {
            // Use regular HTMLImageElement instead of Next.js Image component
            const img = new window.Image();
            img.src = frame.imageUrl;
            await new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve; // Continue even if image fails to load
            });
            
            // Draw image centered and covering the canvas
            const imgRatio = img.width / img.height;
            const canvasRatio = canvasSize.width / canvasSize.height;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (imgRatio > canvasRatio) {
              // Image is wider than canvas ratio
              drawHeight = canvasSize.height;
              drawWidth = drawHeight * imgRatio;
              offsetX = (canvasSize.width - drawWidth) / 2;
              offsetY = 0;
            } else {
              // Image is taller than canvas ratio
              drawWidth = canvasSize.width;
              drawHeight = drawWidth / imgRatio;
              offsetX = 0;
              offsetY = (canvasSize.height - drawHeight) / 2;
            }
            
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          }
          
          // Add quote text
          if (frame.quote) {
            ctx.font = `${frame.fontStyle} ${frame.fontWeight} ${frame.fontSize}px ${frame.fontFamily}`;
            ctx.fillStyle = frame.textColor;
            ctx.textAlign = frame.textAlign;
            
            // Calculate text position
            const x = (frame.textPosition.x / 100) * canvasSize.width;
            const y = (frame.textPosition.y / 100) * canvasSize.height;
            
            // Handle multiline text
            const words = frame.quote.split(' ');
            const lineHeight = frame.fontSize * 1.2;
            let line = '';
            let lineY = y;
            
            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + ' ';
              const metrics = ctx.measureText(testLine);
              const testWidth = metrics.width;
              
              if (testWidth > canvasSize.width * 0.8 && n > 0) {
                ctx.fillText(line, x, lineY);
                line = words[n] + ' ';
                lineY += lineHeight;
              } else {
                line = testLine;
              }
            }
            
            ctx.fillText(line, x, lineY);
          }
          
          // Add frame to GIF
          gif.addFrame(tempCanvas, { delay: frame.duration, copy: true });
          
          // Update progress
          setProgress(Math.round(((i + 1) / frames.length) * 100));
        }
        
        // Get the blob when rendering is complete
        const gifBlob = await new Promise((resolve) => {
          gif.on('finished', blob => {
            resolve(blob);
          });
          gif.render();
        });
        
        setIsGenerating(false);
        return URL.createObjectURL(gifBlob);
      } catch (error) {
        console.error('Error generating GIF:', error);
        setIsGenerating(false);
        return null;
      }
    }
  }));

  // Calculate display size while maintaining aspect ratio
  const getDisplaySize = () => {
    const containerWidth = 800; // Maximum width for the editor
    const containerHeight = 600; // Maximum height for the editor
    
    const widthRatio = containerWidth / canvasSize.width;
    const heightRatio = containerHeight / canvasSize.height;
    
    // Use the smaller ratio to ensure it fits within the container
    const ratio = Math.min(widthRatio, heightRatio);
    
    return {
      width: Math.floor(canvasSize.width * ratio),
      height: Math.floor(canvasSize.height * ratio)
    };
  };

  const displaySize = getDisplaySize();
  const currentFrame = frames[currentFrameIndex] || {};

  return (
    <div className="multi-image-canvas">
      <div className="canvas-container" style={{ position: 'relative', width: displaySize.width, height: displaySize.height }}>
        {/* Canvas for preview */}
        <div 
          ref={canvasRef}
          style={{
            width: displaySize.width,
            height: displaySize.height,
            position: 'relative',
            overflow: 'hidden',
            background: '#000000',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          {/* Current frame preview */}
          {currentFrame.imageUrl && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* Use regular img tag for compatibility */}
              <img 
                src={currentFrame.imageUrl} 
                alt={`Frame ${currentFrameIndex + 1}`}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
              
              {/* Quote overlay */}
              {currentFrame.quote && (
                <div 
                  style={{
                    position: 'absolute',
                    top: `${currentFrame.textPosition.y}%`,
                    left: `${currentFrame.textPosition.x}%`,
                    transform: 'translate(-50%, -50%)',
                    color: currentFrame.textColor,
                    fontFamily: currentFrame.fontFamily,
                    fontSize: `${currentFrame.fontSize * (displaySize.width / canvasSize.width)}px`,
                    fontStyle: currentFrame.fontStyle,
                    fontWeight: currentFrame.fontWeight,
                    textAlign: currentFrame.textAlign,
                    maxWidth: '80%',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {currentFrame.quote}
                </div>
              )}
            </div>
          )}
          
          {/* Loading indicator during GIF generation */}
          {isGenerating && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <div>Generating GIF... {progress}%</div>
              <div 
                style={{
                  width: '80%',
                  height: '10px',
                  background: '#333',
                  borderRadius: '5px',
                  marginTop: '10px'
                }}
              >
                <div 
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: '#4CAF50',
                    borderRadius: '5px'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Frame navigation */}
      <div className="frame-navigation" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button 
          onClick={() => setCurrentFrameIndex(prev => Math.max(0, prev - 1))}
          disabled={currentFrameIndex === 0}
          style={{
            padding: '8px 12px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentFrameIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentFrameIndex === 0 ? 0.5 : 1
          }}
        >
          Previous
        </button>
        <span style={{ margin: '0 15px' }}>
          Frame {currentFrameIndex + 1} of {frames.length}
        </span>
        <button 
          onClick={() => setCurrentFrameIndex(prev => Math.min(frames.length - 1, prev + 1))}
          disabled={currentFrameIndex === frames.length - 1}
          style={{
            padding: '8px 12px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentFrameIndex === frames.length - 1 ? 'not-allowed' : 'pointer',
            opacity: currentFrameIndex === frames.length - 1 ? 0.5 : 1
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
});

// Add display name to fix the React forwardRef warning
MultiImageCanvas.displayName = 'MultiImageCanvas';

export default MultiImageCanvas;
