"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { asset } from "@/lib/asset";

const CLIPS = {
  cheer: {
    video: "/templates/dentist/mascot/mascot-cheer.mp4",
    poster: "/templates/dentist/mascot/mascot-cheer-poster.jpg",
  },
  brush: {
    video: "/templates/dentist/mascot/mascot-brush.mp4",
    poster: "/templates/dentist/mascot/mascot-brush-poster.jpg",
  },
} as const;

export type MascotClip = keyof typeof CLIPS;

/**
 * The living mascot: a looping clip framed in a Light-Blue porthole whose fill
 * matches the clip's baked background, so the video edge disappears and the
 * watermark (bottom of frame) sits outside the circular mask.
 *
 * Under reduced motion it falls back to a still pose image. `pointer-events`
 * stay off so the mascot never blocks a CTA. Sections animate the OUTER wrapper
 * (peek/position); this component owns only the idle bob + media.
 */
export function Mascot({
  clip = "cheer",
  pose = 2,
  size = 200,
  float = true,
  alt = "Friendly tooth mascot",
  className = "",
}: {
  clip?: MascotClip;
  pose?: 1 | 2 | 3 | 4;
  /** number → px, or any CSS length (e.g. a clamp() string) for responsive sizing */
  size?: number | string;
  float?: boolean;
  alt?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { video, poster } = CLIPS[clip];
  const poseSrc = asset(`/templates/dentist/mascot/pose-${pose}.png`);

  return (
    <div
      className={`spa-porthole pointer-events-none select-none ${float ? "spa-float" : ""} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {reduced ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poseSrc} alt={alt} draggable={false} />
      ) : (
        <video
          src={asset(video)}
          poster={asset(poster)}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
        />
      )}
    </div>
  );
}
