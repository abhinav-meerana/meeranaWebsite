import CinematicStory from "@/components/story/CinematicStory";
import Scenario from "@/components/sections/Scenario";
import { About, Contact, PlatformEcosystem, Proof, Solutions, TechnologyIntro } from "@/components/home/Sections";
import "./dashboards.css";
import "./cinematic.css";
import "./home.css";
import "./sections.css";

/* The homepage (brief §3, §11): the cinematic story and its six-platform
   universe, then the informational landing page. Each section carries
   `data-nav`, the option wheel's key, so navigation follows the reader.
   The footer is shared and rendered by the root layout. */
export default function Page() {
  return (
    <main id="main">
      <CinematicStory />
      <PlatformEcosystem />
      <Solutions />
      <section className="home-tech" id="technology" data-nav="technology" aria-labelledby="tech-title">
        <TechnologyIntro />
        <Scenario />
      </section>
      <Proof />
      <About />
      <Contact />
    </main>
  );
}
