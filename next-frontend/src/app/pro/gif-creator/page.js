"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MultiImageCanvas from '@/components/MultiImageCanvas';

export default function GifCreatorPage() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [quotes, setQuotes] = useState(['']);
  const [aspectRatio, setAspectRatio] = useState('instagram-square');
  const [frameDuration, setFrameDuration] = useState(500);
  const [generatedGif, setGeneratedGif] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const canvasRef = useRef(null);

  // Search for images
  const searchImages = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/images/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add an image to the canvas
  const addImageToCanvas = (image) => {
    setImages(prev => [...prev, image]);
    setQuotes(prev => [...prev, '']);
  };

  // Update quote text
  const updateQuote = (index, text) => {
    const newQuotes = [...quotes];
    newQuotes[index] = text;
    setQuotes(newQuotes);
  };

  // Remove an image frame
  const removeFrame = (index) => {
    if (images.length <= 1) return;
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newQuotes = [...quotes];
    newQuotes.splice(index, 1);
    setQuotes(newQuotes);
  };

  // Generate the GIF
  const generateGif = async () => {
    if (!canvasRef.current) return;
    
    setIsLoading(true);
    try {
      const gifUrl = await canvasRef.current.generateGIF();
      setGeneratedGif(gifUrl);
    } catch (error) {
      console.error('Error generating GIF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Download the generated GIF
  const downloadGif = () => {
    if (!generatedGif) return;
    
    const link = document.createElement('a');
    link.href = generatedGif;
    link.download = `social-post-${Date.now()}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share the GIF (simplified implementation)
  const shareGif = async () => {
    if (!generatedGif) return;
    
    if (navigator.share) {
      try {
        // Convert data URL to Blob
        const response = await fetch(generatedGif);
        const blob = await response.blob();
        const file = new File([blob], 'social-post.gif', { type: 'image/gif' });
        
        await navigator.share({
          title: 'My Social Post GIF',
          text: 'Check out this GIF I created!',
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing GIF:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      alert('Copy this link to share: ' + generatedGif);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Pro GIF Creator</h1>
      <p className="text-lg mb-6">Create animated GIFs with multiple images and quotes</p>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <label htmlFor="aspect-ratio" className="mr-2">Aspect Ratio:</label>
          <select 
            id="aspect-ratio" 
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="border rounded p-2"
          >
            <option value="instagram-square">Instagram Square (1:1)</option>
            <option value="instagram-portrait">Instagram Portrait (4:5)</option>
            <option value="instagram-landscape">Instagram Landscape (16:9)</option>
            <option value="twitter">Twitter (16:9)</option>
            <option value="facebook">Facebook (1.91:1)</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="frame-duration" className="mr-2">Frame Duration (ms):</label>
          <input 
            type="range" 
            id="frame-duration" 
            min="100" 
            max="2000" 
            step="100"
            value={frameDuration}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setFrameDuration(value);
              if (canvasRef.current) {
                canvasRef.current.setFrameDuration(value);
              }
            }}
            className="mx-2"
          />
          <span>{frameDuration}ms</span>
        </div>
      </div>
      
      <div className="mb-6 flex justify-center">
        <MultiImageCanvas 
          ref={canvasRef}
          images={images}
          quotes={quotes}
          aspectRatio={aspectRatio}
        />
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Edit Quotes</h3>
        {quotes.map((quote, index) => (
          <div key={`quote-${index}`} className="flex items-center mb-2">
            <textarea
              value={quote}
              onChange={(e) => updateQuote(index, e.target.value)}
              placeholder={`Quote for frame ${index + 1}`}
              rows={2}
              className="border rounded p-2 flex-grow mr-2"
            />
            <button 
              onClick={() => removeFrame(index)}
              disabled={images.length <= 1}
              className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Add Images</h3>
        <div className="flex mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for images..."
            onKeyPress={(e) => e.key === 'Enter' && searchImages()}
            className="border rounded p-2 flex-grow mr-2"
          />
          <button 
            onClick={searchImages} 
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {searchResults.map((image) => (
            <div 
              key={image.id} 
              className="cursor-pointer border rounded overflow-hidden hover:shadow-lg transition"
              onClick={() => addImageToCanvas(image)}
            >
              <img src={image.url} alt={image.alt} className="w-full h-32 object-cover" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mb-6">
        <button 
          onClick={generateGif} 
          disabled={images.length === 0 || isLoading}
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate GIF'}
        </button>
      </div>
      
      {generatedGif && (
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-xl font-semibold mb-2">Your Generated GIF</h3>
          <div className="flex justify-center mb-4">
            <img src={generatedGif} alt="Generated GIF" className="max-w-full" />
          </div>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={downloadGif} 
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Download GIF
            </button>
            <button 
              onClick={shareGif} 
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Share GIF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
