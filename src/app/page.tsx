import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Work } from "./_components/Work";
import { Showcase } from "./_components/Showcase";
import { About } from "./_components/About";
import { Contact } from "./_components/Contact";
import { Panels } from "./_components/Panels";
import { ScrollProgress } from "./_components/ScrollProgress";

export default function Home() {
  return (
    <>
      <Header />
      <ScrollProgress />
      <main>
        <Panels>
          <Hero />
          <Work />
          <Showcase />
          <About />
          <Contact />
        </Panels>
      </main>
    </>
  );
}
