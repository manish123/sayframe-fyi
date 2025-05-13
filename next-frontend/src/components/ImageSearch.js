"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Refactored: Controlled by parent, stateless for images
export const ImageSearch = ({ searchTerm, onSearch, images, onImageSelect }) => {
  const [inputValue, setInputValue] = useState(searchTerm || '');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log('[ImageSearch] searchTerm changed:', searchTerm);
    setInputValue(searchTerm || '');
  }, [searchTerm]);

  useEffect(() => {
    console.log('[ImageSearch] Received images:', images);
  }, [images]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue && inputValue !== searchTerm) {
      console.log('[ImageSearch] Submitting search for:', inputValue);
      onSearch(inputValue);
    }
  };

  const handleImageSelect = (image) => {
    console.log('[ImageSearch] Image selected:', image);
    setSelectedImage(image);
    if (onImageSelect) {
      console.log('[ImageSearch] Calling parent onImageSelect with:', image);
      onImageSelect(image);
    }
  };

  return (
    <div className="form-group">
      <h3 className="feature-title"><span style={{ fontSize: '16px' }}>🔍</span> Search Images & Select One</h3>
      <p className="mobile-instruction">Type a keyword and tap search to find background images</p>
      
      <form 
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px'
        }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter search term..."
          />
        </div>
        
        <button 
          type="submit"
          className="btn btn-primary"
          disabled={!inputValue || inputValue === searchTerm}
        >
          Search
        </button>
      </form>
      
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)', 
        padding: '16px', 
        marginBottom: '16px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '16px',
          marginTop: '8px'
        }}>
          {images && images.length > 0 ? (
            images.map((image, idx) => (
              <div key={image.id || idx} style={{ display: 'flex', flexDirection: 'column' }}>
                <div 
                  style={{
                    position: 'relative',
                    paddingBottom: '100%', // 1:1 aspect ratio
                    overflow: 'hidden',
                    borderRadius: '6px',
                    boxShadow: image === selectedImage ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: image === selectedImage ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleImageSelect(image)}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = image === selectedImage ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || 'Image'}
                    fill
                    sizes="100px"
                    style={{
                      objectFit: 'cover',
                    }}
                    priority={idx < 4} // Load first 4 images with priority
                    loading={idx >= 4 ? "lazy" : undefined}
                  />
                  {image === selectedImage && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#4f46e5',
                      color: 'white',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  padding: '4px 2px 0',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {`Photo by ${image.photographer || 'Unknown'}`}
                </div>
              </div>
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '32px 0', 
              color: '#6b7280',
              background: '#f9fafb',
              borderRadius: '6px'
            }}>
              {images && images.length === 0 ? (
                <>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                  <div>No images found. Try another search term.</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🖼️</div>
                  <div>Search for images to see results here.</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
