import type { Video } from "@/lib/v2-types";

/**
 * A captioned, silent walkthrough. Native controls, a poster frame, metadata-only preload and no
 * autoplay. The captions ship as a WebVTT track (on by default) and again as text underneath, and
 * if the browser can't play the file there is a download link instead of an empty player.
 */
export default function CaseVideo({ video }: { video: Video }) {
  return (
    <figure className="v2-video" id={video.id}>
      <div className="v2-video-frame">
        <video
          controls
          playsInline
          preload="metadata"
          poster={video.poster}
          width={video.width}
          height={video.height}
          aria-label="Walkthrough of the AI Model Testing Dashboard, with captions"
        >
          <source src={video.mp4} type="video/mp4" />
          <track kind="captions" src={video.captions} srcLang="en" label="English captions" default />
          <p>
            Your browser can&rsquo;t play this video.{" "}
            <a href={video.mp4} download>
              Download the walkthrough (MP4, {video.size})
            </a>
            .
          </p>
        </video>
      </div>
      <figcaption>
        {video.caption} Running time {video.duration}.
      </figcaption>
      <details className="v2-transcript">
        <summary>Read the captions as text</summary>
        <ol>
          {video.cues.map((cue) => (
            <li key={cue.at}>
              <span className="v2-transcript-at">{cue.at}</span> {cue.text}
            </li>
          ))}
        </ol>
      </details>
    </figure>
  );
}
