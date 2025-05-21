"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { Resume } from "lib/redux/types";
import type { TextItems } from "lib/parse-resume-from-pdf/types";

// Create a client-only wrapper for the resume parser page
const ResumeParserWrapper = ({ 
  defaultFileUrl 
}: { 
  defaultFileUrl: string 
}) => {
  const [fileUrl, setFileUrl] = useState(defaultFileUrl);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [sections, setSections] = useState<any>({});
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {    async function loadPdfParser() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Dynamically import all parser functions
        const { readPdfModern } = await import("lib/parse-resume-from-pdf/read-pdf-modern");
        const { groupTextItemsIntoLines } = await import("lib/parse-resume-from-pdf/group-text-items-into-lines");
        const { groupLinesIntoSections } = await import("lib/parse-resume-from-pdf/group-lines-into-sections");
        const { extractResumeFromSections } = await import("lib/parse-resume-from-pdf/extract-resume-from-sections");
        
        // Parse the PDF using modern implementation
        const parsedTextItems = await readPdfModern(fileUrl);
        setTextItems(parsedTextItems);
        
        if (!parsedTextItems || parsedTextItems.length === 0) {
          throw new Error("Could not extract text content from PDF");
        }
        
        // Process the text items
        const parsedLines = groupTextItemsIntoLines(parsedTextItems);
        setLines(parsedLines);
        
        const parsedSections = groupLinesIntoSections(parsedLines);
        setSections(parsedSections);
        
        const parsedResume = extractResumeFromSections(parsedSections);
        setResume(parsedResume);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        setError("Failed to parse PDF. This could be due to the PDF format or structure. Please try a different file.");
        setIsLoading(false);
      }
    }
    
    loadPdfParser();
  }, [fileUrl]);
  // Import the rest of the component only on client-side
  const ResumeParserContent = dynamic(
    () => import('./ResumeParserContent'), 
    { 
      loading: () => <div className="p-4 text-center">Loading parser components...</div>
    }
  );

  return (
    <ResumeParserContent 
      fileUrl={fileUrl}
      setFileUrl={setFileUrl}
      textItems={textItems}
      lines={lines}
      sections={sections}
      resume={resume}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default ResumeParserWrapper;
