import React from 'react';

import HeroSplit from './components/hero';

import "./globals.css";
import SemesterCard from './components/semcard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <HeroSplit/>
      <SemesterCard/>
      
      
      {/* Rest of your app content */}
      
    </div>
  );
}

export default App;