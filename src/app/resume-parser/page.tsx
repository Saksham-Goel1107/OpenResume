"use client";
import dynamic from 'next/dynamic';

// Spinner component centered on the screen
function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    </div>
  );
}

// Import the ResumeParserWrapper component dynamically to ensure client-side rendering
const ResumeParserWrapper = dynamic(
  () => import('./ResumeParserWrapper'),
  { 
    loading: () => <Spinner />
  }
);

const RESUME_EXAMPLES = [
  {
    fileUrl: "resume-example/laverne-resume.pdf",
    description: "Borrowed from University of La Verne Career Center"
  },
  {
    fileUrl: "resume-example/openresume-resume.pdf",
    description: "Created with OpenResume resume builder"
  },
];

export default function ResumeParser() {
  return <ResumeParserWrapper defaultFileUrl={RESUME_EXAMPLES[0].fileUrl} />;
}
