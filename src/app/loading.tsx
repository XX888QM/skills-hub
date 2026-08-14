import { PageFrame } from "@/components/PageFrame";

export default function Loading() {
  return (
    <PageFrame className="space-y-6" aria-busy="true" aria-label="正在加载">
      <div className="h-14 w-64 animate-pulse rounded-2xl bg-surface" />
      <div className="h-64 animate-pulse rounded-2xl bg-surface" />
    </PageFrame>
  );
}
