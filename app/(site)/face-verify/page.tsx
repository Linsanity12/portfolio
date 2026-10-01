import type { Metadata } from "next";
import Link from "next/link";
import CursorTrail from "@/components/v2/CursorTrail";
import FaceVerifyDemo from "@/components/v2/FaceVerifyDemo";
import FlowArt from "@/components/v2/FlowArt";
import FloatingNav from "@/components/v2/FloatingNav";

export const metadata: Metadata = {
  title: "Face Verify | Morris Lin",
  description:
    "Compare two photos and see whether the same person appears in both. Everything runs in your browser; no photo is uploaded.",
};

export default function FaceVerifyPage() {
  return (
    <>
      <a className="v2-skip" href="#demo">
        Skip to the demo
      </a>
      <FlowArt intensity={0.5} />
      <CursorTrail />
      <FloatingNav page="face-verify" />

      <main className="v2-main">
        <header className="v2-case-head">
          <div className="v2-wrap">
            <Link className="v2-back" href="/work/facial-recognition">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M12.5 7h-11m0 0L6 2.5M1.5 7 6 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              AI Facial Recognition Research
            </Link>
            <h1 className="v2-case-title">Face Verify</h1>
            <p className="v2-case-lede">
              Add two photos and see whether the same person appears in both. Face detection, landmarks, the 128-value
              face embedding and the match decision all run in this browser tab, through{" "}
              <a
                className="v2-link"
                href="https://github.com/justadudewhohacks/face-api.js"
                target="_blank"
                rel="noopener noreferrer"
              >
                face-api.js<span className="v2-sr"> (opens in a new tab)</span>
              </a>
              , a TensorFlow.js wrapper around small pretrained face models. No photo ever leaves your device.
            </p>
          </div>
        </header>

        <div className="v2-band">
          <div className="v2-wrap v2-fv-wrap" id="demo">
            <FaceVerifyDemo />

            <p className="v2-fv-note">
              About the threshold: face-api.js defaults to a Euclidean distance of 0.6 on its 128-value embeddings, and
              a lower distance means more similar faces. This is a different embedding space from the ArcFace and
              FaceNet models in my research, so the raw numbers can’t be compared directly. The trade-off has the same
              shape, though: move the threshold and you trade false acceptances for false rejections. The full
              comparison is in the{" "}
              <Link className="v2-link" href="/work/facial-recognition">
                research write-up
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
