import React from 'react';
import './App.css';
import QuoteTabs from '../components/QuoteTabs';
import FabricCanvas from '../components/FabricCanvas';
import ExportControls from '../components/ExportControls';
import FeedbackCard from '../components/FeedbackCard';
import HelpBox from '../components/HelpBox';
import ImageSearch from '../components/ImageSearch';
import QuoteDisplay from '../components/QuoteDisplay';
import TextControls from '../components/TextControls';

function App() {
  // You may need to adapt this to fit Next.js routing/layout
  return (
    <div className="App">
      {/* Your main app layout here */}
      <QuoteTabs />
      <FabricCanvas />
      <ExportControls />
      <FeedbackCard />
      <HelpBox />
      <ImageSearch />
      <QuoteDisplay />
      <TextControls />
    </div>
  );
}

export default App;
