import React from 'react';

const BuyMeCoffeeButton = () => {
  return (
    <div className="has-text-centered" style={{ margin: '1rem 0' }}>
      <a 
        href="https://www.buymeacoffee.com/stayframe" 
        target="_blank" 
        rel="noopener noreferrer"
        className="button is-primary"
      >
        <span className="icon">
          <span>☕</span>
        </span>
        <span>Buy me a coffee</span>
      </a>
    </div>
  );
};

export default BuyMeCoffeeButton;
