import { CategoryGrid } from "@/components/CategoryGrid";
import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading, RevealStagger } from "@/components/Reveal";

export default function PacksPage() {
  return (
    <PageFrame className="space-y-12">
      <div className="max-w-2xl">
        <RevealHeading as="h1" className="text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          场景包
        </RevealHeading>
        <Reveal>
          <p className="mt-5 text-lg leading-8 text-quiet">
            按 GitHub 上比较火的方向收束，不是按某个人的本机目录。每个包都是一组实时检索结果。
          </p>
        </Reveal>
      </div>
      <RevealStagger>
        <CategoryGrid />
      </RevealStagger>
    </PageFrame>
  );
}
