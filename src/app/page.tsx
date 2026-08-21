import { Algorithm } from "@/components/algorithm";
import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Interests } from "@/components/interests";
import { Nav } from "@/components/nav";
import { Projects } from "@/components/projects";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Algorithm />
        <Projects />
        <Experience />
        <Education />
        <Interests />
      </main>
      <SiteFooter />
    </>
  );
}
