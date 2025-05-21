# OpenResume

[![GitHub Stars](https://img.shields.io/github/stars/Saksham-Goel1107/OpenResume?style=for-the-badge)](https://github.com/Saksham-goel1107/openResume)

![GitHub forks](https://img.shields.io/github/forks/Saksham-Goel1107/OpenResume?style=for-the-badge)
![License](https://img.shields.io/github/license/Saksham-Goel1107/OpenResume?style=for-the-badge)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)

</div>

OpenResume is a powerful open-source resume builder and resume parser designed to modernize the job application process. Built with privacy in mind, it runs entirely in your browser and requires no account creation.

The goal of OpenResume is to provide everyone with free access to modern professional resume designs and enable anyone to apply for jobs with confidence, regardless of their design skills or financial resources.

**Official site:** [https://openresume.onrender.com/](https://openresume.onrender.com/)

<!-- Inspired by the original work of xitanggg - thank you for pioneering this space -->

## ⚒️ Resume Builder

OpenResume's resume builder allows users to create modern, professional resumes with ease - no design skills required.

![Resume Builder Demo](https://i.ibb.co/jzcrrt8/resume-builder-demo-optimize.gif)

### Key Features
| <div style="width:285px">**Feature**</div> | **Description** |
|---|---|
| **1. Real Time UI Update** | The resume PDF is updated in real time as you enter your resume information, so you can easily see the final output. |
| **2. Modern Professional Resume Design** | The resume PDF is a modern professional design that adheres to U.S. best practices and is ATS friendly to top ATS platforms such as Greenhouse and Lever. It automatically formats fonts, sizes, margins, bullet points to ensure consistency and avoid human errors. |
| **3. Privacy Focus** | The app only runs locally on your browser, meaning no sign up is required and no data ever leaves your browser, so it gives you peace of mind on your personal data. (Fun fact: Running only locally means the app still works even if you disconnect the internet.) |
| **4. Import From Existing Resume PDF** | If you already have an existing resume PDF, you have the option to import it directly, so you can update your resume design to a modern professional design in literally a few seconds. |
| **5. Successful Track Record** | OpenResume users have landed interviews and offers from top companies, such as Dropbox, Google, Meta to name a few. It has been proven to work and liken by recruiters and hiring managers. |

## 🔍 Resume Parser

OpenResume’s second component is the resume parser. For those who have an existing resume, the resume parser can help test and confirm its ATS readability.

![Resume Parser Demo](https://i.ibb.co/JvSVwNk/resume-parser-demo-optimize.gif)

You can learn more about the resume parser algorithm in the ["Resume Parser Algorithm Deep Dive" section](https://openresume.onrender.com/resume-parser).

## 📚 Tech Stack

| <div style="width:140px">**Category**</div> | <div style="width:100px">**Choice**</div> | **Descriptions** |
|---|---|---|
| **Language** | [TypeScript](https://github.com/microsoft/TypeScript) | TypeScript is JavaScript with static type checking and helps catch many silly bugs at code time. |
| **UI Library** | [React](https://github.com/facebook/react) | React’s declarative syntax and component-based architecture make it simple to develop reactive reusable components. |
| **State Management** | [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) | Redux toolkit reduces the boilerplate to set up and update a central redux store, which is used in managing the complex resume state. |
| **CSS Framework** | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | Tailwind speeds up development by providing helpful css utilities and removing the need to context switch between tsx and css files. |
| **Web Framework** | [NextJS 15](https://github.com/vercel/next.js) | Next.js supports static site generation and helps build efficient React webpages that support SEO. |
| **PDF Reader** | [PDF.js](https://github.com/mozilla/pdf.js) | PDF.js reads content from PDF files and is used by the resume parser at its first step to read a resume PDF’s content. |
| **PDF Renderer** | [React-pdf](https://github.com/diegomura/react-pdf) | React-pdf creates PDF files and is used by the resume builder to create a downloadable PDF file. |

## 📁 Project Structure

OpenResume is created with the NextJS web framework and follows its project structure. The source code can be found in `src/app`. There are a total of 4 page routes as shown in the table below. (Code path is relative to `src/app`)

| <div style="width:115px">**Page Route**</div> | **Code Path** | **Description** |
|---|---|---|
| / | /page.tsx | Home page that contains hero, auto typing resume, steps, testimonials, logo cloud, etc |
| /resume-import | /resume-import/page.tsx | Resume import page, where you can choose to import data from an existing resume PDF. The main component used is `ResumeDropzone` (`/components/ResumeDropzone.tsx`) |
| /resume-builder | /resume-builder/page.tsx | Resume builder page to build and download a resume PDF. The main components used are `ResumeForm` (`/components/ResumeForm`) and `Resume` (`/components/Resume`) |
| /resume-parser | /resume-parser/page.tsx | Resume parser page to test a resume’s AST readability. The main library util used is `parseResumeFromPdf` (`/lib/parse-resume-from-pdf`) |

## 💻 Local Development

### Method 1: npm

1. Download the repo `git clone https://github.com/Saksham-Goel1107/OpenResume.git`
2. Change the directory `cd OpenResume`
3. Install the dependency `npm install`
4. Start a development server `npm run dev`
5. Open your browser and visit [http://localhost:3000](http://localhost:3000) to see OpenResume live

### Method 2: Docker

1. Download the repo `git clone https://github.com/Saksham-Goel1107/OpenResume.git`
2. Change the directory `cd OpenResume`
3. Setup environment variables: `create a `.env` file with your Gemini API key
4. Build the container `docker build -t open-resume .`
5. Start the container `docker run -p 3000:3000 --env-file .env open-resume`
6. Open your browser and visit [http://localhost:3000](http://localhost:3000) to see OpenResume live

## 🚀 Deployment

### Deploying to Render (Recommended)
For detailed instructions on deploying to Render, see [Render Deployment Guide](./docs/render-deployment.md).

Key steps:
1. Connect your GitHub repository to Render
2. Configure as a Web Service with Docker runtime
3. Add your `GEMINI_API_KEY`and `REDIS_KEYS` as an environment variable
4. Deploy

Your environment variables (like API keys) are securely managed in Render and never exposed in your repository.
