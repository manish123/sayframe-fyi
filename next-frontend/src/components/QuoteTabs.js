"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuoteDisplay.css';

export const QuoteTabs = ({ theme, onQuoteSelect, setSelectedImage }) => {
  const [selectedQuote, setSelectedQuote] = useState(null);

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (theme) {
      console.log('[QuoteTabs] Theme changed, fetching quotes for:', theme);
      fetchQuotes();
      // Reset selected quote when theme changes
      setSelectedQuote(null);
    }
    // eslint-disable-next-line
  }, [theme, page]);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      let params = { theme, limit: 10, page };
      console.log('[QuoteTabs] Fetching quotes with params:', params);
      const response = await axios.get('/api/v1/quotes', { params });
      // Accept both {quotes: [...]} and [...] for robustness
      const apiQuotes = Array.isArray(response.data) ? response.data : (response.data.quotes || []);
      console.log('[QuoteTabs] Received quotes from API:', apiQuotes);
      
      // Flatten quotes: { theme, quote: string } => { text, theme }
      const flattenedQuotes = apiQuotes.map(q => {
        // Ensure we have a consistent structure
        if (typeof q.quote === 'string') {
          return { text: q.quote, theme: q.theme };
        } else if (typeof q.text === 'string') {
          return q;
        } else {
          // Handle unexpected formats
          console.warn('[QuoteTabs] Unexpected quote format:', q);
          return { text: JSON.stringify(q), theme: theme };
        }
      });
      
      console.log('[QuoteTabs] Processed quotes:', flattenedQuotes);
      setQuotes(page === 1 ? flattenedQuotes : [...quotes, ...flattenedQuotes]);
      setHasMore(flattenedQuotes.length === 10);
    } catch (err) {
      console.error('[QuoteTabs] Error fetching quotes:', err);
      setError('Failed to fetch quotes.');
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleQuoteSelect = (quote) => {
    console.log('[QuoteTabs] Quote selected:', quote);
    setSelectedQuote(quote);
    if (setSelectedImage) {
      console.log('[QuoteTabs] Clearing selected image');
      setSelectedImage(null);
    }
    if (onQuoteSelect) {
      console.log('[QuoteTabs] Calling parent onQuoteSelect with:', quote);
      onQuoteSelect(quote);
    }
  };

  return (
    <div className="form-group">
      <h3 className="feature-title">
        <span style={{ color: 'var(--primary)' }}>💬</span>
        <span>Select a Quote</span>
      </h3>
      
      <div className="quote-list-container">
        {loading && (
          <div className="message-container">
            <div className="loading-spinner"></div>
            <span style={{ marginLeft: '8px', verticalAlign: 'middle' }}>Loading quotes...</span>
          </div>
        )}
        
        {error && (
          <div className="message-container" style={{ color: 'var(--color-error)' }}>
            {error}
          </div>
        )}
        
        {!loading && quotes.length === 0 && (
          <div className="message-container">
            No quotes found for this theme.
          </div>
        )}
        
        {quotes.map((quote, idx) => (
          <div
            key={quote.id || quote._id || idx}
            onClick={() => handleQuoteSelect(quote)}
            className={`quote-item ${selectedQuote === quote ? 'selected' : ''}`}
          >
            {quote.text || quote.quote || 'No text available'}
          </div>
        ))}
        
        {hasMore && (
          <button 
            onClick={handleLoadMore} 
            className="btn btn-primary"
            style={{
              margin: '8px auto 12px',
              display: 'block',
              backgroundColor: 'var(--primary)',
              color: 'var(--dark-bg)',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Load More Quotes
          </button>
        )}
      </div>
    </div>
  );
};
