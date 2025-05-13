"use client";
import React from 'react';

const HelpBox = () => (
  <div className="sidebar-card">
    <h3 className="feature-title">
      <span style={{ fontSize: '16px' }}>📝</span> How to use SayFrame
    </h3>
    <ol style={{ paddingLeft: '18px', margin: 0, lineHeight: '1.5' }}>
      <li>Choose a <b>theme</b> from the dropdown menu to explore related content</li>
      <li>Browse and select a <b>quote</b> to add to your canvas (use &quot;Load More&quot; to see additional quotes)</li>
      <li>Click on an <b>image</b> to set it as your background</li>
      <li>Try different <b>search terms</b> (like &quot;background&quot;) to find more image options</li>
      <li>When finished, use <b>Export</b> or <b>Copy to Clipboard</b> to share your creation on social media</li>
    </ol>
  </div>
);

export default HelpBox;
