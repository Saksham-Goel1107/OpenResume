import { readPdfModern } from "lib/parse-resume-from-pdf/read-pdf-modern";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";

/**
 * Resume parser util that parses a resume from a resume pdf file
 *
 * Note: The parser algorithm only works for single column resume in English language
 */
export const parseResumeFromPdf = async (fileUrl: string) => {
  try {
    // Step 1. Read a pdf resume file into text items to prepare for processing
    // Use the modern reader which is compatible with Next.js 15
    const textItems = await readPdfModern(fileUrl);
    
    // If we don't have any text items, the parsing failed
    if (!textItems || textItems.length === 0) {
      throw new Error("Failed to extract text from PDF");
    }

    // Step 2. Group text items into lines
    const lines = groupTextItemsIntoLines(textItems);

    // Step 3. Group lines into sections
    const sections = groupLinesIntoSections(lines);

    // Step 4. Extract resume from sections
    const resume = extractResumeFromSections(sections);

    return resume;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    // Return an empty resume structure to prevent UI errors
    return {
      profile: {
        name: "",
        email: "",
        phone: "",
        location: "",
        url: "",
        summary: "",
      },
      workExperiences: [],
      educations: [],
      projects: [],
      skills: {
        featuredSkills: [],
        descriptions: [],
      },
      custom: {
        descriptions: [],
      }
    };
  }
};
