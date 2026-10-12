"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Dubai Chambers feature (EV-022) as a poster-first player (FINAL-SPEC §10,
 * phase 2; gap.json "company video").
 *
 * Nothing loads from YouTube until the reader presses the poster: no iframe,
 * no thumbnail request, no cookie. The poster is drawn in CSS from tokens
 * (no YouTube thumbnail: it would be a third-party request, and the brand
 * rules keep faces off the site). Pressing it swaps in the youtube-nocookie
 * player, without autoplay, and moves focus into it so a keyboard user can
 * start it with one more key. Without JavaScript the button does nothing and
 * the caption's plain link still opens the video on YouTube.
 */
export default function FeatureVideo({
  id,
  title,
  outlet,
  url,
}: {
  /** The YouTube video id. */
  id: string;
  title: string;
  outlet: string;
  /** The video's page on YouTube (the no-JS and fallback route). */
  url: string;
}) {
  const [on, setOn] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (on) frame.current?.focus();
  }, [on]);

  return (
    <figure className="fv">
      <div className="fv-frame">
        {on ? (
          <iframe
            ref={frame}
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`}
            title={`${title} (video by ${outlet})`}
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" className="fv-poster" onClick={() => setOn(true)}>
            <span className="fv-play" aria-hidden="true" />
            <span className="fv-copy">
              <span className="annot fv-outlet">{outlet} · video</span>
              <span className="fv-title">{title}</span>
              <span className="fv-note">
                Play video <span className="fv-host">loads the YouTube player</span>
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="t-small fv-caption">
        Video by {outlet}.{" "}
        <a className="link-quiet" href={url} target="_blank" rel="noopener noreferrer">
          Watch on YouTube
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
