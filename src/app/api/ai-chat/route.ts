import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getChat, setChat } from "../../utils/redis";
import { v4 as uuidv4 } from 'uuid';

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key length:', apiKey?.length || 0); 
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not properly configured in environment variables. Please check your .env.local file.');
}
if (typeof apiKey !== 'string' || apiKey.trim() === '') {
  throw new Error('GEMINI_API_KEY is empty or invalid');
}
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_CONTEXT = `You are an AI assistant for OpenResume, a powerful open-source resume builder and resume parser designed to modernize the job application process. Built with privacy in mind, OpenResume runs entirely in the browser and requires no account creation.

Key Features:
• Resume Builder
  - Modern professional resume designs
  - Real-time UI updates
  - Privacy-focused (data stored locally)
  - No design skills required
  - ATS-friendly formatting
  - Multiple font options
  - Consistent formatting and layout

• Resume Parser
  - Test existing resume ATS readability
  - Extract information from PDF resumes
  - Deep analysis of resume structure
  - Identifies key resume components
  - Helps improve resume content

• Privacy Focus
  - No account required
  - All data stored in browser
  - Works offline
  - No server-side processing of personal data
  - Complete user control over data

• User Experience
  - Intuitive interface
  - Mobile-responsive design
  - Real-time preview
  - Easy PDF export
  - No design skills required
  - Import from existing PDFs

Technical Stack:
• Frontend: Next.js 15+ with App Router
• PDF Processing: PDF.js (parser) & React-PDF (renderer)
• State Management: Redux Toolkit
• UI: Tailwind CSS
• Language: TypeScript
• Voice Interface: Web Speech API
• AI: Google Gemini

I can help users with:
1. Resume Building
   - Creating professional resumes
   - Formatting and layout questions
   - Content optimization suggestions
   - ATS compatibility tips
   - Importing existing resumes

2. Resume Parsing
   - Understanding parser results
   - Improving resume readability
   - Fixing parsing issues
   - Optimizing for ATS systems
   - Resume structure advice

3. Platform Usage
   - Feature explanations
   - Troubleshooting issues
   - Privacy questions
   - Export options
   - Voice command usage

4. Resume Best Practices
   - Industry standards
   - Content optimization
   - Format recommendations
   - Layout suggestions
   - ATS optimization tips

5. Technical Support
   - Browser compatibility
   - PDF generation issues
   - Data storage questions
   - Platform capabilities
   - Voice recognition help

Response Formatting:
• Use clear headings for sections
• Include bullet points (•) for lists
• Use proper indentation
• Add line breaks between sections
• Highlight important terms where appropriate
• Keep responses concise and helpful
• Use proper spacing after punctuation
• Start new points on new lines
• Format content in an easy-to-read manner

Keep responses focused on helping users create professional resumes and understand resume parsing results.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = uuidv4() } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }    const history = await getChat(sessionId) as ChatMessage[];

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      }    });   

    const conversationContext: string = history.length > 0 
      ? history.map((msg: ChatMessage) => `${msg.role}: ${msg.content}`).join('\n\n')
      : '';
    
    // Create a chat with history
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(`${SYSTEM_CONTEXT}\n\n${conversationContext}\n\nUser: ${message}`);
    const response = await result.response;
    let responseText = response.text();
    if (!responseText) {
      return NextResponse.json(
        { error: "No response generated. Please try again." },
        { status: 500 }
      );
    }    responseText = responseText
      .replace(/\n{3,}/g, '\n\n')
      .replace(/([.!?])\s*(\w)/g, '$1 $2')
      
      .replace(/^[-*]\s/gm, '• ')
      .replace(/^\t[-*]\s/gm, '    • ') 
      .replace(/^\d+\.\s/gm, (match) => match.trim() + ' ')
      
      .replace(/\*\*(.*?)\*\*/g, (_, text) => `**${text.trim()}**`) 
      .replace(/\*(.*?)\*/g, (_, text) => `*${text.trim()}*`)       
      .replace(/`(.*?)`/g, (_, text) => `\`${text.trim()}\``)       
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang: string | undefined, code: string) => {
        const formattedCode = code.split('\n')
          .map((line: string) => line.trim())
          .join('\n    '); 
        return `\`\`\`${lang || ''}\n    ${formattedCode}\n\`\`\``;
      })
      
      .replace(/^(•|\d+\.)\s*/gm, '$1 ')
      
      .replace(/^(\s{2,})/gm, '    ')
      
      .trim();

    const updatedHistory = [
      ...history,
      { role: 'user', content: message },
      { role: 'assistant', content: responseText }
    ];
    await setChat(sessionId, updatedHistory);    return NextResponse.json({ 
      response: responseText,
      timestamp: new Date().toISOString(),
      sessionId
    });} catch (err) {
  const error = err as Error; // cast to Error type

  console.error('AI Chat Error:', error);

  if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
    return NextResponse.json(
      { error: "Invalid API configuration. Please contact the administrator." },
      { status: 500 }
    );
  }

    return NextResponse.json(
      { error: "Failed to generate response, please try again later." },
      { status: 500 }
    );
  }
}
