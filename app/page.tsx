import Hero from "@/components/sections/Hero";
import Showcase from "@/components/sections/Showcase";
import Scenario from "@/components/sections/Scenario";
import { World, Cta } from "@/components/sections/Sections";
import "./hero.css";
import "./showcase.css";
import "./sections.css";

/* The footer is shared and rendered by the root layout, so every route has it. */
export default function Page() {
  return (
    <main id="main">
      <Hero />
      <Showcase />
      <Scenario />
      <World />
      <Cta />
    </main>
  );
}
