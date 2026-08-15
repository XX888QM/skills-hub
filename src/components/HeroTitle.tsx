import { Tx } from "@/components/Tx";

export function HeroTitle() {
  return (
    <h1 className="font-editorial max-w-3xl text-balance text-[3.1rem] leading-[1.04] font-normal tracking-[-0.045em] sm:text-6xl lg:text-[4.55rem]">
      <span className="block">
        <Tx k="hero.title1" />
      </span>
      <span className="block">
        <Tx k="hero.title2" />
      </span>
    </h1>
  );
}
