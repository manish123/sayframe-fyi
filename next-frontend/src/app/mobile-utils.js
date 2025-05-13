"use client";

// Mobile utility functions and components for StayFrame

// Desktop recommendation notice component
export const DesktopRecommendationNotice = ({ onDismiss }) => {
  return (
    <div className="desktop-notice-container">
      <div className="desktop-notice">
        <div className="desktop-notice-icon">💻</div>
        <h2 className="desktop-notice-title">Best Experienced on Desktop</h2>
        <p className="desktop-notice-text">
          StayFrame works best on a desktop or laptop computer due to its drag-and-drop interface and editing features.
          While you can continue on mobile, we recommend switching to a larger screen for the best experience.
        </p>
        <button 
          className="desktop-notice-button"
          onClick={onDismiss}
        >
          Continue on Mobile Anyway
        </button>
      </div>
    </div>
  );
};

// Mobile export buttons component
export const MobileExportButtons = ({ onExport, onCopyToClipboard, disabled }) => {
  return (
    <div className="mobile-export-buttons">
      <button
        className="action-button"
        onClick={onExport}
        disabled={disabled}
      >
        <span>🖼️</span> Export Image
      </button>
      <button
        className="action-button"
        onClick={onCopyToClipboard}
        disabled={disabled}
      >
        <span>📋</span> Copy to Clipboard
      </button>
    </div>
  );
};
