import { installCommand } from "@/lib/format";
import { CopyButton } from "./CopyButton";

export function InstallCommand({ source }: { source: string }) {
  const command = installCommand(source);
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-surface px-4 py-4 sm:flex-row sm:items-center sm:px-5">
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] leading-6 sm:text-sm">
        {command}
      </code>
      <CopyButton text={command} />
    </div>
  );
}
