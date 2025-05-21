"use client";
import { useEffect, useState, useRef, memo, useCallback } from "react";
import { ResumePDF } from "components/Resume/ResumePDF";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { START_HOME_RESUME, END_HOME_RESUME } from "home/constants";
import { makeObjectCharIterator } from "lib/make-object-char-iterator";
import { useTailwindBreakpoints } from "lib/hooks/useTailwindBreakpoints";
import { deepClone } from "lib/deep-clone";

// countObjectChar(END_HOME_RESUME) -> ~1800 chars
const CHARS_PER_FRAME = 10;
// Animation duration: ~9s with 10 chars per frame
// The animation will be smoother with requestAnimationFrame than with setInterval

const RESET_INTERVAL_MS = 60 * 1000; // 60s

// Memoized resume PDF to prevent unnecessary re-renders
const MemoizedResumePDF = memo(({ resume, isLg }: { resume: any, isLg: boolean }) => (
  <ResumePDF
    resume={resume}
    settings={{
      ...initialSettings,
      fontSize: "12",
      formToHeading: {
        workExperiences: resume.workExperiences[0].company
          ? "WORK EXPERIENCE"
          : "",
        educations: resume.educations[0].school ? "EDUCATION" : "",
        projects: resume.projects[0].project ? "PROJECT" : "",
        skills: resume.skills.featuredSkills[0].skill ? "SKILLS" : "",
        custom: "CUSTOM SECTION",
      },
    }}
  />
));

MemoizedResumePDF.displayName = 'MemoizedResumePDF';

// Use memo to prevent unnecessary re-renders of the entire component
export const AutoTypingResume = memo(() => {
  // Use lazy initial state to avoid deep cloning on every render
  const [resume, setResume] = useState(() => deepClone(initialResumeState));
  const [isVisible, setIsVisible] = useState(false);
  // Create iterator only once and memoize it
  const resumeCharIterator = useRef(
    makeObjectCharIterator(START_HOME_RESUME, END_HOME_RESUME)
  );
  const hasSetEndResume = useRef(false);
  const animationRef = useRef<number | undefined>(undefined);
  const componentRef = useRef<HTMLDivElement>(null);
  const lastUpdateTime = useRef<number>(0);
  const { isLg } = useTailwindBreakpoints();

  // Intersection observer to only animate when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (componentRef.current) {
      observer.observe(componentRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Use a more efficient animation approach with useCallback to avoid recreating the function
  const animateResume = useCallback((timestamp: number) => {
    const now = timestamp;
    // Throttle updates to reduce performance impact - increase the interval for better performance
    if (now - lastUpdateTime.current > 250) { // Reduced to ~4 updates per second for better performance
      lastUpdateTime.current = now;
      
      // Process multiple characters at once to reduce overall animation time
      // Skip the first call that may cause an error
      let next: IteratorResult<typeof END_HOME_RESUME, any>;
      try {
        next = resumeCharIterator.current.next();
        // Process more characters at once (increased from original) for fewer state updates
        for (let i = 0; i < CHARS_PER_FRAME + 10; i++) { // Process more characters per frame
          const result = resumeCharIterator.current.next();
          if (result.done) {
            next = result;
            break;
          }
          next = result;
        }
        
        if (!next.done) {
          // Only update state if actually needed
          setResume(prev => {
            // Skip update if it would be the same content (optimization)
            if (JSON.stringify(prev) === JSON.stringify(next.value)) {
              return prev;
            }
            return next.value;
          });
        } else if (!hasSetEndResume.current) {
          setResume(END_HOME_RESUME);
          hasSetEndResume.current = true;
        }
      } catch (err) {
        // Handle any iterator errors gracefully
        console.error("Animation iterator error:", err);
        if (!hasSetEndResume.current) {
          setResume(END_HOME_RESUME);
          hasSetEndResume.current = true;
        }
      }
    }
    
    // Only continue animation if component is visible and animation not complete
    if (isVisible && !hasSetEndResume.current) {
      animationRef.current = requestAnimationFrame(animateResume);
    }
  }, [isVisible]);
  
  // Start/stop animation based on visibility
  useEffect(() => {
    // Only start animation if visible and not already finished
    if (isVisible && !hasSetEndResume.current) {
      animationRef.current = requestAnimationFrame(animateResume);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    
    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [isVisible, animateResume, hasSetEndResume]);

  // Reset animation periodically
  useEffect(() => {
    const resetAnimation = () => {
      resumeCharIterator.current = makeObjectCharIterator(
        START_HOME_RESUME,
        END_HOME_RESUME
      );
      hasSetEndResume.current = false;
    };
    
    const intervalId = setInterval(resetAnimation, RESET_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div ref={componentRef}>
      <ResumeIframeCSR documentSize="Letter" scale={isLg ? 0.7 : 0.5}>
        <MemoizedResumePDF resume={resume} isLg={isLg} />
      </ResumeIframeCSR>
    </div>
  );
});

AutoTypingResume.displayName = 'AutoTypingResume';
