import React from 'react'
import { IconButton } from 'components/Button'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from 'lib/redux/hooks'
import { changeProfile, selectProfile } from 'lib/redux/resumeSlice'
import type { ResumeProfile } from 'lib/redux/types'

interface AskAiButtonProps {
  field?: keyof ResumeProfile
  defaultPrompt?: string
  onResult?: (result: string) => void
}

const generateAiResponse = async (promptText: string, currentValue: string): Promise<string> => {
  try {
    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: promptText,
        sessionId: crypto.randomUUID(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get AI response');
    }

    const data = await response.json();
    if (!data.response) {
      throw new Error('Invalid response format from AI');
    }
    return data.response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
}

const getPromptForField = (field?: keyof ResumeProfile, currentValue?: string, defaultPrompt?: string): string => {
  if (defaultPrompt) return defaultPrompt;
  if (!field) return '';

  const baseContext = currentValue 
    ? `Here's my current ${field}: "${currentValue}". Please enhance it to be more impactful while maintaining the same basic information.`
    : `Please help me write a compelling ${field} section.`;

  switch (field) {
    case 'summary':
    return `${baseContext}
             Guidelines:
             - Keep the same core message but make it more impactful
             - Maintain professional tone
             - Use active voice and strong verbs
             - Keep it concise (2-3 sentences)
             - Make it ATS-friendly
             - Focus on value proposition
             - Return plain text only, no markdown or formatting symbols
             - Do not include explanations or instructions
             - Return an polished version that enhances the original text`;
   
    default:
      return '';
  }
};

const AskAiButton = ({ field, defaultPrompt, onResult }: AskAiButtonProps) => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = React.useState(false)
  const profile = useAppSelector(selectProfile)
  
  const handleClick = async () => {
    try {
      setIsLoading(true)
      const currentValue = field ? profile[field] : ''
      const promptText = getPromptForField(field, currentValue, defaultPrompt)
      
      if (!promptText) {
        throw new Error('No prompt available for this field')
      }

      const result = await generateAiResponse(promptText, currentValue)

      if (onResult) {
        onResult(result)
      } else if (field) {
        dispatch(changeProfile({ field, value: result.trim() }))
      }
    } catch (error) {
      console.error('Error:', error)
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative inline-block">
      <IconButton
        onClick={handleClick}
        size="medium"
        tooltipText={isLoading ? "Enhancing..." : "Enhance with AI"}
        className={`bg-gradient-to-r from-[var(--theme-purple)] to-[var(--theme-blue)] text-white hover:opacity-90 
          ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
        disabled={isLoading}
      >
        <SparklesIcon 
          className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`}
          aria-hidden="true" 
        />
      </IconButton>
    </div>
  )
}

export default AskAiButton
