"use client";
import dynamic from "next/dynamic";

// Import the FontLoader component with dynamic loading (client side only)
const FontLoader = dynamic(() => import("components/FontLoader"), { 
  ssr: false 
});

export default function FontLoaderWrapper() {
  return <FontLoader />;
}
