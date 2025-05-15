"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Refactored: Controlled by parent, stateless for images
export const ImageSearch = ({ searchTerm, onSearch, images, onImageSelect }) => {
  const [inputValue, setInputValue] = useState(searchTerm || '');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, etc.).');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Please select an image under 5MB.');
      return;
    }
    
    setIsUploading(true);
    
    // Create a local URL for the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const uploadedImage = {
        id: 'uploaded-' + Date.now(),
        urls: {
          regular: event.target.result
        },
        alt_description: file.name,
        user: {
          name: 'You (Local Upload)'
        },
        isLocalUpload: true
      };
      
      // Select the uploaded image
      handleImageSelect(uploadedImage);
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="form-group">
      <h3 className="feature-title">
        <span style={{ color: 'var(--primary)' }}>🔍</span>
        <span>Search Images & Select One</span>
      </h3>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <form 
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            gap: '8px',
            flex: 1
          }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter search term..."
              style={{
                backgroundColor: 'var(--dark-bg-light)',
                color: 'var(--light-text)',
                border: '1px solid var(--dark-bg)',
                borderRadius: '4px',
                padding: '0.5rem 0.75rem',
                fontSize: 'var(--text-sm)',
                width: '100%',
                outline: 'none'
              }}
            />
          </div>
          
          <button 
            type="submit"
            className={`button is-primary is-small ${(!inputValue || inputValue === searchTerm) ? 'is-disabled' : ''}`}
            disabled={!inputValue || inputValue === searchTerm}
          >
            <span className="icon is-small">
              <i className="fas fa-search"></i>
            </span>
            <span>Search</span>
          </button>
        </form>
        
        {/* Upload Image Button */}
        <div>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <label 
            htmlFor="image-upload"
            className={`button is-primary is-small ${isUploading ? 'is-loading' : ''}`}
          >
            <span className="icon is-small">
              <i className="fas fa-upload"></i>
            </span>
            <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
          </label>
        </div>
      </div>
      
      <div style={{ 
        background: 'var(--dark-bg-light)', 
        borderRadius: '6px', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', 
        padding: '16px', 
        marginBottom: '16px',
        border: '1px solid var(--dark-bg)'
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
                    boxShadow: image === selectedImage ? '0 4px 12px rgba(26, 188, 156, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                    border: image === selectedImage ? '2px solid var(--primary)' : '1px solid var(--dark-bg)',
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
