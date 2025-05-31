import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectProjects, changeProjects } from "lib/redux/resumeSlice";
import type { ResumeProject } from "lib/redux/types";
import AskAiButton from '../AskAiButton';

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();
  const showDelete = projects.length > 1;

  return (
    <Form form="projects" addButtonText="Add Project">
      {projects.map(({ project, date, descriptions }, idx) => {
        const handleProjectChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeProject>
        ) => {
          dispatch(changeProjects({ idx, field, value } as any));
        };

        const handleAiSuggestion = (suggestion: string) => {
          const points = suggestion
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .flatMap(point => [point, '']) 
            .slice(0, -1); 
          
          handleProjectChange('descriptions', points);
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        return (
          <FormSection
            key={idx}
            form="projects"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={"Delete project"}
          >
            <Input
              name="project"
              label="Project Name"
              placeholder="OpenResume"
              value={project}
              onChange={handleProjectChange}
              labelClassName="col-span-4"
            />
            <Input
              name="date"
              label="Date"
              placeholder="Winter 2022"
              value={date}
              onChange={handleProjectChange}
              labelClassName="col-span-2"
            />
            <div className="col-span-full relative">
              <BulletListTextarea
                name="descriptions"
                label="Description"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handleProjectChange}
                labelClassName="col-span-full"
              />
              <div className="absolute right-2 top-8">
                <AskAiButton
                  defaultPrompt={`You are a professional resume writer. Transform the following project description into clear bullet points:

"${descriptions.join('\n')}"

Strictly follow this format:
Point 1 here(next line)
Point 2 here(next line)
Point 3 here

Rules:
- Write exactly 3 bullet points
- Start each with a strong action verb
- Focus on achievements and technical impact
- Mention specific technologies used
- Include metrics where possible
- Keep each point to 1-2 lines
- Make it ATS-friendly
- No bullet markers or numbers
- No explanations or commentary
- Use natural, professional language
- No formatting or special characters
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
