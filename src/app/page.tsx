import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Work } from "./_components/Work";
import { About } from "./_components/About";
import { Contact } from "./_components/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Work />
        <About />
        <Contact />
      </main>
    </>
  );
}
