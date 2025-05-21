// Modern implementation of PDF parser compatible with Next.js 15
import type { TextItem, TextItems } from "lib/parse-resume-from-pdf/types";

// Create a modern PDF reader function that uses the latest PDF.js version
export const readPdfModern = async (fileUrl: string): Promise<TextItems> => {
  try {
    console.log("Starting PDF parsing with modern implementation");
      // Dynamically import PDF.js only on client side
    const pdfjsLib = await import('pdfjs-dist');
    console.log("PDF.js loaded successfully, version:", pdfjsLib.version);
    
    // Set the worker source to a CDN that matches our version
    const workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    console.log("Worker source set to:", workerSrc);
    
    // Load the document
    console.log("Attempting to load PDF document:", fileUrl);
    
    // Configure options for PDF loading
    // cMapUrl is important for handling fonts
    const loadingTask = pdfjsLib.getDocument({
      url: fileUrl, 
      disableAutoFetch: false,
      isEvalSupported: true,
      useSystemFonts: true
    });
    
    // Add a longer timeout for slow connections
    const pdfDocument = await Promise.race([
      loadingTask.promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("PDF loading timed out after 15 seconds")), 15000)
      )
    ]) as Awaited<typeof loadingTask.promise>;
    
    console.log(`PDF loaded successfully with ${pdfDocument.numPages} pages`);
    
    let textItems: TextItems = [];
      console.log(`PDF document loaded successfully with ${pdfDocument.numPages} pages`);
    
    // Process each page
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${pdfDocument.numPages}`);
      const page = await pdfDocument.getPage(pageNum);
      
      // Get the text content with added error handling
      console.log(`Extracting text content from page ${pageNum}`);
      const textContent = await page.getTextContent().catch(e => {
        console.error(`Error extracting text content from page ${pageNum}:`, e);
        return { items: [] };
      });
      
      console.log(`Page ${pageNum} has ${textContent.items.length} text items`);
      
      // Wait for font data to be loaded
      console.log(`Loading font data for page ${pageNum}`);
      const operatorList = await page.getOperatorList().catch(e => {
        console.error(`Error loading operator list for page ${pageNum}:`, e);
        return null;
      });
      const commonObjs = page.commonObjs;
      
      // Process each text item
      const pageTextItems = textContent.items.map((item: any) => {
        // Extract text and position information
        const text = item.str;
        const transform = item.transform;
        const fontName = item.fontName;
        
        // Extract x, y position from transform matrix
        const x = transform[4];
        const y = transform[5];
        
        // Try to get the actual font name if possible
        let resolvedFontName = fontName;
        try {
          const fontObj = commonObjs.get(fontName);
          if (fontObj && fontObj.name) {
            resolvedFontName = fontObj.name;
          }
        } catch (e) {
          // If we can't get the font name, use what we have
          console.debug('Could not resolve font name:', e);
        }
        
        // Clean up text (handle special characters like hyphens)
        const cleanedText = text.replace(/-­‐/g, "-");
        
        return {
          text: cleanedText,
          x,
          y,
          width: item.width || 0,
          height: item.height || 0,
          fontName: resolvedFontName,
          hasEOL: !!item.hasEOL,
        };
      });
      
      // Add this page's text items to the collection
      textItems.push(...pageTextItems);
    }
      // Filter out empty space textItem noise
    const filtered = textItems.filter((item) => 
      !((!item.hasEOL && item.text.trim() === ""))
    );
    
    console.log(`Successfully extracted ${filtered.length} text items from PDF`);
    
    // Validate that we actually got some text content
    if (filtered.length === 0) {
      throw new Error("No text content was extracted from the PDF. The PDF might be image-based or protected.");
    }
    
    return filtered;
  } catch (error) {
    console.error("Error in modern PDF parsing:", error);
    
    // Provide more detailed error messages based on error type
    if (typeof error === "object" && error !== null && "message" in error && typeof (error as any).message === "string") {
      const message = (error as any).message as string;
      if (message.includes("worker")) {
        console.error("PDF.js worker failed to load. This is likely a configuration issue.");
      } else if (message.includes("password")) {
        console.error("The PDF file is password protected and cannot be parsed.");
      } else if (message.includes("Missing PDF")) {
        console.error("The PDF file could not be found or is invalid.");
      }
    }
    
    // Rethrow so the calling function can handle the error appropriately
    throw error;
  }
};
