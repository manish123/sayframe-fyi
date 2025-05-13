"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuoteDisplay.css';

export const QuoteDisplay = ({ mood, onQuoteSelect }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (mood) {
      fetchQuotes(mood);
    }
  }, [mood]);
  
  const fetchQuotes = async (mood) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/quotes', {
        params: { mood, limit: 5 }
      });
      setQuotes(response.data.quotes || response.data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setError(error.message);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="quotes-container">
      <div className="quotes-header">
        <h3>Quotes for &quot;{mood}&quot;</h3>
        <span className="quotes-count">{quotes.length} results</span>
      </div>
      
      {loading ? (
        <div className="loading-message">Finding perfect quotes...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : quotes.length > 0 ? (
        <div>
          {quotes.map((quote, index) => (
            <div key={index} className="quote-item" onClick={() => onQuoteSelect(quote)}>
              <div className="quote-text">&quot;{quote.text}&quot;</div>
              <div className="quote-author">- {quote.author}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-quotes-message">
          No quotes found for &quot;{mood}&quot;. Try different keywords.
        </div>
      )}
    </div>
  );
};
