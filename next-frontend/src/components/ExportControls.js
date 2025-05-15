"use client";
import React from 'react';

export const ExportControls = ({ canvasRef }) => {
  const exportImage = () => {
    if (canvasRef.current && canvasRef.current.exportImage) {
      // Use the exportImage method exposed via useImperativeHandle
      const dataURL = canvasRef.current.exportImage();
      
      const link = document.createElement('a');
      link.download = 'social-post.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = async () => {
    if (canvasRef.current && canvasRef.current.copyToClipboard) {
      try {
        await canvasRef.current.copyToClipboard();
        alert('Image copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Failed to copy to clipboard. Please try exporting instead.');
      }
    }
  };

  return (
    <div className="export-controls field is-grouped">
      <p className="control">
        <button 
          className="button is-primary is-small" 
          onClick={exportImage}
        >
          <span className="icon is-small">
            <i className="fas fa-download"></i>
          </span>
          <span>Export Image</span>
        </button>
      </p>
      <p className="control">
        <button 
          className="button is-primary is-small" 
          onClick={copyToClipboard}
        >
          <span className="icon is-small">
            <i className="fas fa-copy"></i>
          </span>
          <span>Copy to Clipboard</span>
        </button>
      </p>
    </div>
  );
};
