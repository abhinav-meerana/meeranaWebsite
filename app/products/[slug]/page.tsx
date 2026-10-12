import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductStage from "@/components/stage/ProductStage";
import { STORIES, getStory } from "@/content/storyboards";
import { pageMeta } from "@/lib/seo";
/* app/story.css is no longer imported: every rule the stage's visuals need
   lives in viz.css (B), and story.css is deleted at integration (§11). */
import "../../viz.css";
import "../../stage.css";

/* Static export: every product route is enumerated at build time, and nothing
   else exists. */
export const dynamicParams = false;

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return { title: "Product not found" };

  return pageMeta({
    title: `${story.name} — ${story.descriptor}`,
    description: story.heroSub,
    path: `/products/${story.slug}/`,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  return (
    <main id="main">
      {/* Keyed by product, so moving between products rebuilds the stage. */}
      <ProductStage key={story.slug} story={story} />
    </main>
  );
}
