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

  return (
    <div className="export-controls">
      <button onClick={exportImage}>
        Export as PNG
      </button>
    </div>
  );
};
