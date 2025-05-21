"use client";
import { useState } from "react";
import { ResumeDropzone as ResumeDropzoneInternal } from "./ResumeDropzone";

// This creates a client-only wrapper component to avoid SSR issues with the PDF handling
export const ResumeDropzone = ({ 
  onFileUrlChange: parentOnFileUrlChange, 
  ...props 
}: Parameters<typeof ResumeDropzoneInternal>[0]) => {
  const [parseError, setParseError] = useState<string | null>(null);

  // Enhanced file handling with error catching
  const handleFileUrlChange = async (fileUrl: string) => {
    setParseError(null);

    // If empty, just forward it
    if (!fileUrl) {
      parentOnFileUrlChange("");
      return;
    }

    try {
      // Always pass the URL up even if we have parsing issues
      parentOnFileUrlChange(fileUrl);
    } catch (error) {
      console.error("Error with file URL:", error);
      setParseError("There was an error processing your file.");
    }
  };

  return (
    <div className="relative">
      <ResumeDropzoneInternal
        onFileUrlChange={handleFileUrlChange}
        {...props}
      />
      
      {parseError && (
        <div className="mt-2 text-sm text-red-600">
          {parseError}
        </div>
      )}
    </div>
  );
};
