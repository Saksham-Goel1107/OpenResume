import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";
import FontLoaderWrapper from "components/FontLoaderWrapper";
import Providers from "../app/Providers";
import Script from "next/script";

export const metadata = {
  title: "OpenResume - Free Open-source Resume Builder and Parser",
  description:
    "OpenResume is a free, open-source, and powerful resume builder that allows anyone to create a modern professional resume in 3 simple steps. For those who have an existing resume, OpenResume also provides a resume parser to help test and confirm its ATS readability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Load UserWay Accessibility Widget safely */}
        <Script
          src="https://cdn.userway.org/widget.js"
          strategy="afterInteractive"
          data-account="4MvwVUNjK2"
        />
      </head>
      <body>
        <FontLoaderWrapper />
        <TopNavBar />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}