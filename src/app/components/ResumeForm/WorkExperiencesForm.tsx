import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";
import AskAiButton from '../AskAiButton';

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();

  const showDelete = workExperiences.length > 1;

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          dispatch(changeWorkExperiences({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        const handleAiSuggestion = (suggestion: string) => {
          const points = suggestion
            .split('\n')
            .reduce((acc: string[], line) => {
              if (line.trim()) {
                if (acc.length > 0) {
                  acc.push('');
                }
                acc.push(line.trim());
              }
              return acc;
            }, []);
          handleWorkExperienceChange('descriptions', points);
        };

        return (
          <FormSection
            key={idx}
            form="workExperiences"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete job"
          >
            <Input
              label="Company"
              labelClassName="col-span-full"
              name="company"
              placeholder="Khan Academy"
              value={company}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="Job Title"
              labelClassName="col-span-4"
              name="jobTitle"
              placeholder="Software Engineer"
              value={jobTitle}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="Date"
              labelClassName="col-span-2"
              name="date"
              placeholder="Jun 2022 - Present"
              value={date}
              onChange={handleWorkExperienceChange}
            />
            <div className="col-span-full relative">
              <BulletListTextarea
                label="Description"
                labelClassName="col-span-full"
                name="descriptions"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handleWorkExperienceChange}
              />
              <div className="absolute right-2 top-8">
                <AskAiButton
  defaultPrompt={`You are a professional resume writer. Rewrite and enhance the following work experience to make it more impactful and ATS-friendly, without changing the meaning:

"${descriptions.join('\n')}"

Instructions:
- Only return 2 to 3 short points
- Each point must be on its own line with no bullet points or numbers
- Leave a single space between each point (line break with spacing)
- Each point must be only 1–2 lines long (concise and to the point)
- Use action verbs and focus on achievements and results
- Include metrics if possible
- Do NOT explain anything-just return the rewritten points only
- Do NOT add phrases like "Here are your points" or "Improved version"
- Do NOT use unnatural or robotic wording—write in natural, professional language
- No formatting like bold or quotes
`}


                  onResult={handleAiSuggestion}
                />
              </div>
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
};
