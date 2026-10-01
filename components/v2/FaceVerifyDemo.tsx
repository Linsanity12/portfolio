"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// face-api.js is loaded on demand, so its (large) TensorFlow.js runtime only downloads on this page.
type FaceApi = typeof import("face-api.js");

const MODEL_URL = "/models";
const DEFAULT_THRESHOLD = 0.6;

type Slot = "a" | "b";
type Box = { x: number; y: number; width: number; height: number };
type Photo = { url: string; width: number; height: number; el: HTMLImageElement; box?: Box };
type Outcome =
  | { kind: "none" }
  | { kind: "no-face"; missing: Slot[] }
  | { kind: "compared"; distance: number; msA: number; msB: number };

const LABEL: Record<Slot, string> = { a: "Photo A", b: "Photo B" };

// One shared load per page. React StrictMode mounts effects twice in development, and loading the
// same networks twice at once is wasted work at best.
let modelsPromise: Promise<FaceApi> | null = null;
function loadModels(): Promise<FaceApi> {
  modelsPromise ??= (async () => {
    const faceapi = await import("face-api.js");
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    return faceapi;
  })().catch((err) => {
    modelsPromise = null; // let a later mount try again
    throw err;
  });
  return modelsPromise;
}

/**
 * Two-photo face verification that runs entirely in the browser: detect a face in each photo,
 * compute its 128-value embedding, and compare the two by Euclidean distance against a threshold.
 * The distance is computed once per comparison; moving the threshold slider just re-decides.
 */
export default function FaceVerifyDemo() {
  const apiRef = useRef<FaceApi | null>(null);
  const [status, setStatus] = useState("Loading face models…");
  const [ready, setReady] = useState(false);
  const [photos, setPhotos] = useState<Record<Slot, Photo | null>>({ a: null, b: null });
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [outcome, setOutcome] = useState<Outcome>({ kind: "none" });
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState<Slot | null>(null);
  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const urls = urlsRef.current;
    (async () => {
      try {
        const t0 = performance.now();
        const faceapi = await loadModels();
        if (cancelled) return;
        apiRef.current = faceapi;
        setReady(true);
        setStatus(
          `Models loaded in ${Math.round(performance.now() - t0)} ms (tiny face detector, 68-point landmarks, face recognition). Add two photos to begin.`
        );
      } catch (err) {
        console.error(err);
        if (!cancelled) setStatus("The face models didn’t load. Refresh the page to try again.");
      }
    })();
    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const loadPhoto = useCallback((slot: Slot, file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatus("That file isn’t an image. Choose a JPG, PNG or WebP photo.");
      return;
    }
    const url = URL.createObjectURL(file);
    urlsRef.current.push(url);
    const el = new Image();
    el.onload = () => {
      setPhotos((prev) => ({ ...prev, [slot]: { url, width: el.naturalWidth, height: el.naturalHeight, el } }));
      setOutcome({ kind: "none" });
    };
    el.onerror = () => setStatus("That image couldn’t be opened. Try a different photo.");
    el.src = url;
  }, []);

  const compare = async () => {
    const faceapi = apiRef.current;
    if (!faceapi || !photos.a || !photos.b) return;
    setRunning(true);
    setOutcome({ kind: "none" });
    setStatus("Detecting faces…");

    const detect = async (photo: Photo) => {
      await photo.el.decode();
      const t0 = performance.now();
      const found = await faceapi
        .detectSingleFace(photo.el, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      return { found, ms: performance.now() - t0 };
    };

    try {
      const a = await detect(photos.a);
      const b = await detect(photos.b);
      // show whatever boxes were found, even if the other photo had no face
      setPhotos((prev) => ({
        a: prev.a && { ...prev.a, box: a.found?.detection.box },
        b: prev.b && { ...prev.b, box: b.found?.detection.box },
      }));

      if (!a.found || !b.found) {
        const missing = (["a", "b"] as Slot[]).filter((s) => !(s === "a" ? a.found : b.found));
        setOutcome({ kind: "no-face", missing });
        setStatus("");
        return;
      }
      const distance = faceapi.euclideanDistance(a.found.descriptor, b.found.descriptor);
      setOutcome({ kind: "compared", distance, msA: a.ms, msB: b.ms });
      setStatus("");
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong while comparing. Try again with different photos.");
    } finally {
      setRunning(false);
    }
  };

  const canCompare = ready && photos.a && photos.b && !running;
  const isMatch = outcome.kind === "compared" && outcome.distance < threshold;

  return (
    <div className="v2-fv">
      <p className="v2-fv-status" role="status" aria-live="polite">
        {status}
      </p>

      <div className="v2-fv-slots">
        {(["a", "b"] as Slot[]).map((slot) => {
          const photo = photos[slot];
          return (
            <div key={slot} className="v2-fv-slot">
              <label
                className="v2-fv-drop"
                data-over={dragging === slot ? "" : undefined}
                data-filled={photo ? "" : undefined}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(slot);
                }}
                onDragLeave={() => setDragging((d) => (d === slot ? null : d))}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(null);
                  const file = e.dataTransfer.files?.[0];
                  if (file) loadPhoto(slot, file);
                }}
              >
                <input
                  className="v2-fv-input"
                  type="file"
                  accept="image/*"
                  aria-label={`${LABEL[slot]}: choose an image`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) loadPhoto(slot, file);
                    e.target.value = ""; // allow choosing the same file again
                  }}
                />
                {photo ? (
                  <span className="v2-fv-preview" style={{ "--ar": photo.width / photo.height, aspectRatio: `${photo.width} / ${photo.height}` } as React.CSSProperties}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- a local blob URL, nothing for next/image to optimise */}
                    <img src={photo.url} alt={`${LABEL[slot]}, chosen by you`} />
                    {photo.box && (
                      <span
                        className="v2-fv-box"
                        style={{
                          left: `${(photo.box.x / photo.width) * 100}%`,
                          top: `${(photo.box.y / photo.height) * 100}%`,
                          width: `${(photo.box.width / photo.width) * 100}%`,
                          height: `${(photo.box.height / photo.height) * 100}%`,
                        }}
                      />
                    )}
                  </span>
                ) : (
                  <span className="v2-fv-empty">
                    <span className="v2-fv-slot-name">{LABEL[slot]}</span>
                    <span>Choose a photo or drop one here</span>
                  </span>
                )}
              </label>
              <p className="v2-fv-caption">
                {LABEL[slot]}
                {photo ? ": click the photo to replace it" : ""}
              </p>
            </div>
          );
        })}
      </div>

      <div className="v2-fv-controls">
        <button type="button" className="v2-btn v2-fv-go" onClick={compare} disabled={!canCompare}>
          {running ? "Comparing…" : "Compare faces"}
        </button>
        <div className="v2-fv-threshold">
          <label htmlFor="fv-threshold">
            Match threshold <output htmlFor="fv-threshold">{threshold.toFixed(2)}</output>
          </label>
          <input
            id="fv-threshold"
            type="range"
            min="0.3"
            max="0.9"
            step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="v2-fv-result-region" aria-live="polite">
        {outcome.kind === "no-face" && (
          <div className="v2-fv-result" data-verdict="none">
            <h2 className="v2-fv-verdict">No face found</h2>
            <p>
              I couldn’t find a face in {outcome.missing.map((s) => LABEL[s]).join(" or ")}. Try a clear, front-facing photo
              with the face well lit.
            </p>
          </div>
        )}

        {outcome.kind === "compared" && (
          <div className="v2-fv-result" data-verdict={isMatch ? "match" : "no-match"}>
            <h2 className="v2-fv-verdict">{isMatch ? "Match" : "No match"}</h2>
            <p>
              The two faces are <strong>{outcome.distance.toFixed(4)}</strong> apart (Euclidean distance between their
              embeddings). With the threshold at {threshold.toFixed(2)}, that’s {isMatch ? "closer than" : "farther than"}{" "}
              the cut-off, so they {isMatch ? "count as the same person" : "count as different people"}.
            </p>

            <div className="v2-fv-meter" aria-hidden="true">
              <span className="v2-fv-meter-track" />
              <span className="v2-fv-meter-threshold" style={{ left: `${Math.min(threshold, 1) * 100}%` }} />
              <span className="v2-fv-meter-distance" style={{ left: `${Math.min(outcome.distance, 1) * 100}%` }} />
            </div>
            <div className="v2-fv-meter-scale" aria-hidden="true">
              <span>0 (identical)</span>
              <span>Line: threshold. Dot: this pair.</span>
              <span>1.0</span>
            </div>

            <dl className="v2-fv-metrics">
              <div>
                <dt>Detect and embed, photo A</dt>
                <dd>{Math.round(outcome.msA)} ms</dd>
              </div>
              <div>
                <dt>Detect and embed, photo B</dt>
                <dd>{Math.round(outcome.msB)} ms</dd>
              </div>
              <div>
                <dt>Embedding size</dt>
                <dd>128 values</dd>
              </div>
              <div>
                <dt>Distance</dt>
                <dd>Euclidean (L2)</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
