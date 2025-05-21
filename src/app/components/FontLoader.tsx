"use client";
import { useEffect } from 'react';

// This component dynamically loads font CSS on the client side
export default function FontLoader() {
  useEffect(() => {
    // Load the fonts CSS file dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/fonts/fonts.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  return null; // This component doesn't render anything
}
