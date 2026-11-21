import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import WorkStage from "@/components/WorkStage";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Now from "@/components/Now";
import Cta from "@/components/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <WorkStage />
      <Services />
      <Process />
      <Now />
      <Cta />
    </>
  );
}
