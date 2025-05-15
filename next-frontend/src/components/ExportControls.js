"use client";
import React, { useState } from 'react';

export const ExportControls = ({ canvasRef }) => {
  const [exportConfirmation, setExportConfirmation] = useState('');
  const [copyConfirmation, setCopyConfirmation] = useState('');

  // Collection of witty confirmation messages
  const getRandomMessage = (action) => {
    const exportMessages = [
      "Your masterpiece is ready to shine! 🌟",
      "Image exported! Time to make your feed jealous. 😎",
      "Creation saved! Share it before it's cool. 🔥",
      "Export complete! Your followers will thank you. ✨",
      "Artwork saved! One step closer to viral fame. 🚀"
    ];

    const copyMessages = [
      "Copied to clipboard! Paste it like a pro. 📋",
      "Ready to paste! Your clipboard has never looked better. ✨",
      "Copied! Ctrl+V your way to greatness. 🏆",
      "Image captured in your clipboard! Paste away! 🚀",
      "Clipboard loaded with awesomeness! 🔥"
    ];

    const messages = action === 'export' ? exportMessages : copyMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const exportImage = async () => {
    if (canvasRef.current && canvasRef.current.exportImage) {
      try {
        // Use the exportImage method exposed via useImperativeHandle
        const dataURL = await canvasRef.current.exportImage();
        
        const link = document.createElement('a');
        link.download = `stayframe-${Date.now()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show witty confirmation message
        const message = getRandomMessage('export');
        setExportConfirmation(message);
        
        // Clear the confirmation after 3 seconds
        setTimeout(() => {
          setExportConfirmation('');
        }, 3000);
      } catch (error) {
        console.error('Error exporting image:', error);
      }
    }
  };

  const copyToClipboard = async () => {
    if (canvasRef.current && canvasRef.current.copyToClipboard) {
      try {
        await canvasRef.current.copyToClipboard();
        
        // Show witty confirmation message
        const message = getRandomMessage('copy');
        setCopyConfirmation(message);
        
        // Clear the confirmation after 3 seconds
        setTimeout(() => {
          setCopyConfirmation('');
        }, 3000);
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
          style={{ minWidth: exportConfirmation ? '250px' : 'auto' }}
        >
          {exportConfirmation ? (
            <span className="has-text-success">
              <span style={{ marginRight: '6px' }}>✓</span>
              {exportConfirmation}
            </span>
          ) : (
            <>
              <span className="icon is-small">
                <i className="fas fa-download"></i>
              </span>
              <span>Export Image</span>
            </>
          )}
        </button>
      </p>
      <p className="control">
        <button 
          className="button is-primary is-small" 
          onClick={copyToClipboard}
          style={{ minWidth: copyConfirmation ? '250px' : 'auto' }}
        >
          {copyConfirmation ? (
            <span className="has-text-success">
              <span style={{ marginRight: '6px' }}>✓</span>
              {copyConfirmation}
            </span>
          ) : (
            <>
              <span className="icon is-small">
                <i className="fas fa-copy"></i>
              </span>
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>
      </p>
    </div>
  );
};
