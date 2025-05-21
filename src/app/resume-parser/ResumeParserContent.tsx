"use client";
import { ResumeDropzone } from "components/ResumeDropzoneClient";
import { cx } from "lib/cx";
import { Heading, Link, Paragraph } from "components/documentation";
import { ResumeTable } from "resume-parser/ResumeTable";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { ResumeParserAlgorithmArticle } from "resume-parser/ResumeParserAlgorithmArticle";
import type { Resume } from "lib/redux/types";
import type { TextItems } from "lib/parse-resume-from-pdf/types";

const RESUME_EXAMPLES = [
  {
    fileUrl: "resume-example/laverne-resume.pdf",
    description: (
      <span>
        Borrowed from University of La Verne Career Center -{" "}
        <Link href="https://laverne.edu/careers/wp-content/uploads/sites/15/2010/12/Undergraduate-Student-Resume-Examples.pdf">
          Link
        </Link>
      </span>
    ),
  },
  {
    fileUrl: "resume-example/openresume-resume.pdf",
    description: (
      <span>
        Created with OpenResume resume builder -{" "}
        <Link href="/resume-builder">Link</Link>
      </span>
    ),
  },
];

interface ResumeParserContentProps {
  fileUrl: string;
  setFileUrl: (url: string) => void;
  textItems: TextItems;
  lines: any[];
  sections: any;
  resume: Resume | null;
  isLoading: boolean;
  error: string | null;
}

const ResumeParserContent = ({ 
  fileUrl, 
  setFileUrl, 
  textItems, 
  lines, 
  sections, 
  resume, 
  isLoading,
  error
}: ResumeParserContentProps) => {
  return (
    <main className="h-full w-full overflow-hidden">
      <div className="grid md:grid-cols-6">
        <div className="flex justify-center px-2 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end">
          <section className="mt-5 grow px-4 md:max-w-[600px] md:px-0">
            <div className="aspect-h-[9.5] aspect-w-7">
              <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full" />
            </div>
          </section>
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
        </div>
        <div className="flex px-6 text-gray-900 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll">
          <FlexboxSpacer maxWidth={45} className="hidden md:block" />
          <section className="max-w-[600px] grow">
            <Heading className="text-primary !mt-4">
              Resume Parser Playground
            </Heading>
            <Paragraph smallMarginTop={true}>
              This playground showcases the OpenResume resume parser and its
              ability to parse information from a resume PDF. Click around the
              PDF examples below to observe different parsing results.
            </Paragraph>
            <div className="mt-3 flex gap-3">
              {RESUME_EXAMPLES.map((example, idx) => (
                <article
                  key={idx}
                  className={cx(
                    "flex-1 cursor-pointer rounded-md border-2 px-4 py-3 shadow-sm outline-none hover:bg-gray-50 focus:bg-gray-50",
                    fileUrl === example.fileUrl
                      ? "border-sky-400"
                      : "border-gray-200"
                  )}
                  onClick={() => setFileUrl(example.fileUrl)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFileUrl(example.fileUrl);
                    }
                  }}
                >
                  <h3 className="font-semibold">Example {idx + 1}</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    {example.description}
                  </div>
                </article>
              ))}
            </div>
            <div className="mb-8 mt-3">
              <ResumeDropzone onFileUrlChange={setFileUrl} playgroundView />
            </div>
            
            {isLoading ? (
              <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-lg">Loading PDF and parsing data...</p>
              </div>
            ) : error ? (
              <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            ) : resume ? (
              <>
                <ResumeTable
                  resume={resume}
                />
                <ResumeParserAlgorithmArticle
                  textItems={textItems}
                  lines={lines}
                  sections={sections}
                />
              </>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ResumeParserContent;
