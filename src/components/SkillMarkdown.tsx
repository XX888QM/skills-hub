import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function SkillMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="skill-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
