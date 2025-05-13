"use client";
import React, { useState } from 'react';

const FeedbackCard = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Submitting feedback:', feedback);
      const res = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });
      
      const data = await res.json();
      console.log('Feedback submission response:', data);
      
      if (res.ok) {
        setSubmitted(true);
        setFeedback("");
      } else {
        setError(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sidebar-card">
      <h3 className="feature-title">
        <span style={{ fontSize: '16px' }}>💬</span> Feedback
      </h3>
      
      {error && (
        <div style={{
          padding: '8px 12px',
          marginBottom: '8px',
          background: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {error}
        </div>
      )}
      
      {submitted ? (
        <div style={{
          padding: '8px 12px',
          background: '#dcfce7',
          color: '#15803d',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          Thank you for your feedback! We appreciate your input.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <textarea
            rows="2"
            placeholder="Share your ideas or what you'd love to see next..."
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            style={{ 
              width: '100%',
              padding: '8px 10px',
              marginBottom: '8px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              fontSize: '12px',
              fontFamily: "'Inter', sans-serif",
              resize: 'vertical',
              minHeight: '60px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={e => {
              e.target.style.borderColor = '#a5b4fc';
              e.target.style.boxShadow = '0 0 0 2px rgba(79, 70, 229, 0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button 
            type="submit" 
            disabled={!feedback.trim() || isSubmitting}
            style={{
              padding: '6px 12px',
              background: !feedback.trim() || isSubmitting ? '#e5e7eb' : '#4f46e5',
              color: !feedback.trim() || isSubmitting ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: !feedback.trim() || isSubmitting ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              if (feedback.trim() && !isSubmitting) {
                e.target.style.background = '#4338ca';
              }
            }}
            onMouseLeave={e => {
              if (feedback.trim() && !isSubmitting) {
                e.target.style.background = '#4f46e5';
              }
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{ 
                  display: 'inline-block', 
                  width: '12px', 
                  height: '12px', 
                  border: '2px solid rgba(255,255,255,0.3)', 
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '6px'
                }}></span>
                <style jsx>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackCard;
