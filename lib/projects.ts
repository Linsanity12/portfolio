export type ProjectStatus = "featured" | "in-progress";

export type CaseStudySection = {
  heading: string;
  body: string[];
  image?: { src: string; alt: string; caption?: string; width?: number; height?: number };
  table?: { headers: string[]; rows: string[][] };
};

export type Project = {
  slug: string;
  order: number;
  title: string;
  oneLiner: string;
  tags: string;
  period: string;
  status: ProjectStatus;
  thumb?: string;
  sections?: CaseStudySection[];
};

export const PROJECTS: Project[] = [
  {
    slug: "first-robotics",
    order: 2,
    title: "FIRST Robotics — Walton 2974",
    oneLiner:
      "Four years leading a 40-plus member competitive robotics program, from shooter and telescoping-arm subsystems to the 2025 REEFSCAPE build.",
    tags: "Robotics / System Integration",
    period: "2022 — 2025",
    status: "featured",
    thumb: "/work/robot-electronics.webp",
    sections: [
      {
        heading: "The challenge",
        body: [
          "REEFSCAPE, the 2025 game, rewards fast coral cycles. Before touching CAD, the team compared intake concepts against the rules, the packaging limits, and how much moving mass each design would add to the elevator carriage.",
          "The team settled on a chassis-mounted algae mechanism instead of carrying it on the elevator. That gave up some scoring flexibility in exchange for a lighter, faster-cycling coral system — the right trade for a robot that lives or dies on cycle time.",
        ],
      },
      {
        heading: "My role",
        body: [
          "I served as Chief Engineer from 2022 to 2025, leading 13 varsity and 7 junior engineers inside a program of more than 40 members. I directed the design and manufacturing of the shooter and telescoping-arm subsystems, built the team's competition pit from scratch, and wrote the technical documentation we published to Chief Delphi for other teams to learn from.",
          "The decisions and photos below are from the 2025 season specifically — team engineering, credited to the team, inside a role I led across all four years.",
        ],
      },
      {
        heading: "Design decisions",
        body: [
          "The coral mechanism started on a 4:1 reduction. Testing showed it was simply too fast to control cleanly, so the team moved to 7:1 and got a mechanism that behaved the way the drivers needed it to.",
          "The algae finger's first motor was hard to modulate — it was either on or off. Swapping it for a slower window motor, and revising the mount to match, turned it into something a driver could actually finesse.",
        ],
      },
      {
        heading: "Physical integration",
        body: [
          "By February 22nd the elevator and chassis were assembled, the coral mechanism was wired, and the robot was powered up for the first programming pass. The photo below is from that handoff — full frame, temporary wiring and all, because that's what an in-progress robot actually looks like.",
        ],
        image: {
          src: "/work/robot-electronics.webp",
          alt: "Robot electronics and wiring during the 2025 build",
          caption: "Walton Robotics / Chief Delphi, February 22, 2025.",
        },
      },
      {
        heading: "Elevator and cable routing",
        body: [
          "The elevator carries the coral mechanism through its full range of motion, which means its cable routing has to survive constant flexing without snagging. This shot captures that routing uncropped, straight from the build.",
          "Photos and the original build notes: chiefdelphi.com/t/2974-walton-robotics-build-blog-2025/475971",
        ],
        image: {
          src: "/work/robot-elevator.webp",
          alt: "Elevator assembly and cable routing",
          caption: "Walton Robotics / Chief Delphi, February 22, 2025.",
        },
      },
      {
        heading: "Results",
        body: [
          "The team won at Dalton and at Statesboro. Statesboro's impacts twisted the algae intake — an elevator clamp fixed the stability problem but added weight the team had to account for elsewhere.",
          "By April, aluminum elevator pulleys had replaced the originals, and the team ran two competitions afterward with no bearing-release issues. The climber came out entirely: it took about 20 seconds to align, and cutting it freed up weight that went straight back into intake performance.",
        ],
      },
    ],
  },
  {
    slug: "filament-recycling",
    order: 3,
    title: "Plastic Bottle to 3D-Printer Filament",
    oneLiner:
      "A self-funded machine that turns discarded PET bottles into usable 3D-printing filament — custom PCB, temperature-controlled extrusion, and a mechanical build I designed from scratch.",
    tags: "Electronics / PCB Design",
    period: "2023 — Present",
    status: "featured",
    thumb: "/work/filament-board.webp",
    sections: [
      {
        heading: "The project",
        body: [
          "Most of the plastic bottles I use never get recycled into anything useful. This machine is my attempt to close that loop myself — melt a bottle down, extrude it into filament, and feed it back into a 3D printer.",
          "I designed the mechanical and electrical systems myself and self-funded a prototype north of $300, including a custom PCB for the control electronics. Mechanical assembly is done; I'm still iterating on the PCB and firmware integration.",
        ],
      },
      {
        heading: "Hardware",
        body: [
          "The control loop started on a breadboard — thermistor, PWM heater output, stepper driver, rotary encoder, and an SSD1306 display all wired by hand so I could prove the logic before committing to a board.",
        ],
        image: {
          src: "/work/filament-breadboard.webp",
          alt: "Early breadboard prototype of the filament machine's control electronics",
          caption: "Early control-loop prototype, breadboarded before the PCB.",
        },
      },
      {
        heading: "Controller board",
        body: [
          "From the breadboard I laid out a custom PCB — schematic, board, and a populated controller that replaced the wiring mess entirely. It handles temperature control, reel motion, and the operator interface in one place.",
        ],
        image: {
          src: "/work/filament-board.webp",
          alt: "Populated custom controller PCB",
          caption: "Populated controller board, PCB design and layout by me.",
        },
      },
      {
        heading: "Firmware",
        body: [
          "The firmware reads the thermistor, runs a PID loop to hold temperature, and drives the heater over PWM. In parallel it steps the reel motor and reads the rotary encoder so I can dial in temperature, speed, and direction on the fly. Current firmware defaults to a 220°C setpoint with a 190–230°C working range — settings I've tuned by hand, not numbers from a measured process window yet.",
        ],
      },
      {
        heading: "Current progress",
        body: [
          "The mechanical side is built: 16 printed parts covering the cutter, reel, motor mount, hot-end holder, and enclosure. What's left is dialing in consistent filament diameter and proving out a full print with it — I haven't measured throughput or print quality yet, so I'm not claiming either until I have numbers.",
        ],
        image: {
          src: "/work/filament-parts.webp",
          alt: "3D-printed mechanical parts for the filament machine",
          caption: "Cutter, reel, and mounting hardware — printed parts for the mechanical build.",
        },
      },
    ],
  },
  {
    slug: "facial-recognition",
    order: 1,
    title: "AI Facial Recognition Research",
    oneLiner:
      "Comparing five pretrained face-verification models on accuracy, false acceptance, and false rejection — 50,000 verification runs, one evaluation framework, on the LFW benchmark.",
    tags: "Computer Vision / Research",
    period: "Jan — Apr 2026",
    status: "featured",
    thumb: "/work/research-accuracy.webp",
    sections: [
      {
        heading: "The question",
        body: [
          "As a Research Assistant at UGA's Multispectral Imagery Lab (advised by Dr. Thirimachos Bourlai), I set out to answer a practical question: how do five pretrained face-verification models actually compare on accuracy, false acceptance, and false rejection when you run them through the same evaluation framework?",
          "The goal was never to build a new face-recognition algorithm. It was to treat five well-known models — VGG-Face, ArcFace, FaceNet, FaceNet512, and OpenFace — as black boxes, run them through an identical pipeline on the same 50,000 image pairs, and find out which one actually holds up.",
        ],
      },
      {
        heading: "Dataset and approach",
        body: [
          "Everything runs on Labeled Faces in the Wild (LFW) — 13,233 unconstrained face photos of 5,749 people, collected from the web with natural variation in pose, lighting, expression, and occlusion. From the full set, I selected every identity with at least 3 images, giving 901 people and 7,606 images to work with.",
          "From that pool I generated 15,235 image pairs: 6,225 genuine (same person) and 9,010 impostor (different people), with a duplicate check on every pair so the same comparison never got counted twice. The full pipeline: preprocessing (grayscale, rotation correction, cropping) → face detection (OpenCV) → feature extraction (each model's pretrained embedding) → cosine-distance comparison → accept/reject against a threshold.",
        ],
        image: {
          src: "/work/facereco/fig1-preprocessing.png",
          alt: "Four-stage preprocessing pipeline applied to LFW sample images: original, grayscale, histogram-equalized, and cropped",
          caption: "Fig 1. Preprocessing pipeline applied to LFW sample images — original, grayscale, histogram-equalized, cropped.",
        },
      },
      {
        heading: "Getting the pipeline right first",
        body: [
          "Before scaling up, I ran the pipeline on a small custom set — my own photos against public figures — to sanity-check basic behavior. One early result mattered more than the rest: with enforce_detection turned off, an image where no face could be detected still got compared, treating the entire frame as \"the face.\" That reliably produced a false verdict no matter who was actually in the photo.",
          "That finding changed the entire evaluation design — enforce_detection was set to True for every subsequent test, and any pair where a face couldn't be found was skipped rather than forced through. A 100-pair pilot on LFW (50 genuine, 50 impostor) confirmed the pipeline worked before committing to the full run: 96% accuracy, 0% FRR, 8% FAR.",
        ],
      },
      {
        heading: "Large-scale evaluation: 15,235 pairs",
        body: [
          "Running ArcFace across the full 15,235-pair set (901 identities, 7,606 images) gave 94.87% accuracy, a 10.55% false-rejection rate, and a 1.39% false-acceptance rate. In plain terms: about 1 in 10 genuine matches got rejected, mostly from pose changes, occlusion (glasses, hats), and lighting differences between photos of the same person — while the system stayed conservative about accepting impostors.",
          "Looking at the actual error cases makes the failure modes concrete rather than abstract statistics.",
        ],
        image: {
          src: "/work/facereco/fig2-false-rejections.png",
          alt: "Grid of same-person image pairs that ArcFace incorrectly rejected as different people, with distance scores",
          caption: "Fig 2a. False rejections — same person, incorrectly split by pose, lighting, or angle.",
          width: 356,
          height: 2048,
        },
      },
      {
        heading: "The other kind of error",
        body: [
          "False acceptances tell a different story — mostly pairs where facial features were partially obscured, resolution was low, or two different people simply shared enough structural similarity under similar lighting to fool the embedding.",
        ],
        image: {
          src: "/work/facereco/fig2-false-acceptances.png",
          alt: "Grid of different-person image pairs that ArcFace incorrectly accepted as matches, with distance scores",
          caption: "Fig 2b. False acceptances — different people, incorrectly matched.",
          width: 356,
          height: 2048,
        },
      },
      {
        heading: "Model comparison — 5 models, 10 runs each, 50,000 pairs",
        body: [
          "The core experiment: VGG-Face, ArcFace, FaceNet, FaceNet512, and OpenFace, each run 10 independent times over 1,000 randomly-sampled pairs per run — 50,000 verification evaluations total, at each model's own default threshold.",
        ],
        table: {
          headers: ["Model", "Avg Accuracy", "Avg FAR", "Avg FRR", "Avg Time"],
          rows: [
            ["ArcFace", "93.8%", "1.6%", "10.7%", "~610s"],
            ["VGG-Face", "93.0%", "2.1%", "11.4%", "~470s"],
            ["FaceNet", "~56%", "0.3%", "42.5%", "~780s"],
            ["FaceNet512", "~56%", "0.3%", "42.5%", "~780s"],
            ["OpenFace", "51.1%", "~0%", "~97%", "~290s"],
          ],
        },
        image: {
          src: "/work/facereco/fig3-performance-10-runs.png",
          alt: "Line graphs showing accuracy, FAR, and FRR across 10 independent test runs for each of five models",
          caption: "Fig 3. Accuracy, FAR, and FRR across all 10 runs per model — ArcFace and VGG-Face are consistently stable; OpenFace is consistently bad.",
        },
      },
      {
        heading: "Why the gap is so large",
        body: [
          "ArcFace came out on top with the best balance of accuracy, FAR, and FRR, and low run-to-run variance — meaning it generalizes well across random subsets of the data, not just one lucky sample. VGG-Face was a close, faster second. FaceNet and FaceNet512 were the surprise: both rejected over 40% of genuine pairs at their default thresholds, which is impractical however low their FAR looked on paper. OpenFace effectively rejected almost everyone (97% FRR) — functioning as close to a random rejector as a \"working\" system can get.",
          "This was the most counterintuitive finding of the whole project: FaceNet is widely cited as high-performing, but its triplet-loss training pushes different identities aggressively far apart — great for strict security contexts, badly mismatched to LFW's pose and lighting variation.",
        ],
        image: {
          src: "/work/facereco/fig4-model-comparison-bar.png",
          alt: "Grouped bar chart of mean accuracy, FAR, and FRR with standard deviation error bars for all five models",
          caption: "Fig 4. Mean performance ± standard deviation across all five models. ArcFace: high accuracy, low error, low variance.",
        },
      },
      {
        heading: "Threshold tuning",
        body: [
          "Default thresholds are tuned on whatever dataset each model was originally trained on, not on LFW. So I swept threshold values for ArcFace, FaceNet, and VGG-Face and tracked how accuracy, FAR, and FRR moved together, to find where each model actually balances on this dataset.",
        ],
        table: {
          headers: ["Model", "Optimal Threshold", "Accuracy", "FAR", "FRR"],
          rows: [
            ["ArcFace", "0.70", "94.8%", "1.6%", "8.8%"],
            ["FaceNet", "0.60", "92.3%", "5.0%", "~12%"],
            ["VGG-Face", "0.70", "93.7%", "5.2%", "~9%"],
          ],
        },
        image: {
          src: "/work/facereco/fig5-threshold-heatmaps.png",
          alt: "Heatmaps of accuracy, false acceptance rate, and false rejection rate across threshold values for three models",
          caption: "Fig 5. Threshold sweep heatmaps — accuracy peaks around 0.6–0.7 for every model tested.",
        },
      },
      {
        heading: "What tuning actually bought",
        body: [
          "After tuning, ArcFace at 0.70 improved from 93.8% to 94.8% accuracy while cutting its FRR from 10.7% down to 8.8% — more genuine users correctly let through, with almost no added security risk. FaceNet's accuracy jumped the most (its default threshold was badly miscalibrated for LFW), but that came at the cost of a 5.0% FAR, worse than ArcFace's. VGG-Face improved similarly but landed at a less favorable 5.2% FAR.",
          "The takeaway generalizes past this one dataset: a model's out-of-the-box threshold is tuned for whatever benchmark its authors used, not necessarily yours — any real deployment needs its own calibration step.",
        ],
        image: {
          src: "/work/facereco/fig6-before-after.png",
          alt: "Bar chart comparing accuracy, FAR, and FRR before and after threshold optimization for three models",
          caption: "Fig 6. Before vs. after threshold optimization — FRR drops substantially for all three models, FAR trades up slightly.",
        },
      },
      {
        heading: "ROC curve — how good is ArcFace, really?",
        body: [
          "To evaluate ArcFace independent of any single threshold choice, I plotted a full ROC curve — true positive rate against false positive rate across every tested threshold. The result: AUC = 0.9786, meaning ArcFace correctly ranks a genuine pair above an impostor pair 97.86% of the time, across the entire operating range. That's a strong result for an uncontrolled, real-world benchmark like LFW.",
          "The selected operating point (threshold 0.70) sits at 91.2% TPR and 1.6% FPR — near the curve's knee, where you can't meaningfully trade more security for more usability or vice versa without giving something up.",
        ],
        image: {
          src: "/work/facereco/fig7-roc-curve.png",
          alt: "ROC curve for ArcFace on the LFW dataset showing true positive rate versus false positive rate, AUC 0.9786",
          caption: "Fig 7. ROC curve for ArcFace on LFW (AUC = 0.9786). The blue curve hugging the top-left corner is what a strong verifier looks like.",
          width: 700,
          height: 600,
        },
      },
      {
        heading: "Where errors actually come from",
        body: [
          "Pose variation was the single biggest driver of false rejections — a frontal photo compared against a profile or three-quarter view of the same person, which OpenCV's detector handles poorly. Accessories (glasses, hats, masks) caused both kinds of error: rejections when present in only one photo, occasional false acceptances when they dominated the embedding. Poor lighting (backlight, heavy shadow, low exposure) pushed genuine pairs' embeddings apart enough to read as different people.",
          "Two engineering lessons stood out. First, enforce_detection is not a minor setting — forcing detection on an undetectable face silently corrupts results rather than failing loudly. Second, aggregate accuracy alone hides the real story: FAR and FRR are different failure modes (security risk vs. usability risk) and have to be read together, which is exactly what the ROC and threshold-sweep analysis were for.",
        ],
      },
      {
        heading: "Limitations",
        body: [
          "No liveness detection — a printed photo or screen replay could plausibly spoof this system, and that was never tested. Everything ran on static images; there's no evaluation on video, near-infrared, or thermal imagery. All five models were used strictly as black boxes with zero fine-tuning, which likely caps performance below what a domain-adapted version could reach. And this is a single-dataset result — LFW has known demographic imbalance and a heavy skew toward celebrity photos, so these numbers may not transfer cleanly to a different population or capture setup.",
        ],
      },
      {
        heading: "Future work",
        body: [
          "Fine-tuning ArcFace on a domain-specific dataset to push FRR down further; adding a liveness-detection stage to close the spoofing gap; validating against additional benchmarks (VGGFace2, IJB-C) to check whether these findings generalize; a more rigorous demographic fairness analysis with actual statistical testing; and trying alternative detector backends (RetinaFace, MTCNN) that may handle difficult poses better than the OpenCV Haar cascade used here.",
        ],
      },
      {
        heading: "Closing",
        body: [
          "Across 50,000 verification runs on real, unconstrained photos, ArcFace with a tuned threshold of 0.70 was the clear, reproducible winner for this dataset and task. But the more durable finding is procedural: a face-verification system's reported accuracy means very little without knowing its FAR/FRR trade-off, whether its threshold was calibrated for your actual data, and what its failure modes look like when you go looking for them.",
          "Full source code (pair generation, model comparison, threshold tuning, all scripts) is available at github.com/Linsanity12/face-recognition-uga.",
        ],
      },
    ],
  },
  {
    slug: "cardboard-electric-vehicle",
    order: 4,
    title: "Cardboard Electric Vehicle",
    oneLiner:
      "Selected to lead the embedded systems group for a 7-team, ~53-applicant undergraduate EV project — firmware, motor control, and sensor integration. Team is organized; the build hasn't started yet.",
    tags: "Embedded Systems / Motor Control",
    period: "2026 — Present",
    status: "in-progress",
    sections: [
      {
        heading: "Where this is",
        body: [
          "I was selected to lead the embedded systems group on a student-run electric vehicle project — one of seven teams on a build with about 53 applicants total, 17 of whom listed embedded systems as their first choice.",
          "Engineering work hasn't started yet. Right now this page is a placeholder for a role, not a build log — I'd rather say that plainly than pad it out with planning-phase filler.",
        ],
      },
      {
        heading: "What I'll actually be doing",
        body: [
          "Once the build starts, my job is firmware and embedded integration: microcontrollers, GPIO, PWM, UART, I2C, motor control, and sensor interfaces, plus coordinating task distribution and milestones across the embedded team.",
          "I'll turn this into a real case study — decisions, code, test results — once there's something built to show.",
        ],
      },
    ],
  },
  {
    slug: "micromouse",
    order: 5,
    title: "IEEE Micromouse",
    oneLiner:
      "Learning bare-metal C/C++ on an STM32F103C8 with the Micromouse R&D team — starting from the registers, working toward an autonomous maze-solving robot.",
    tags: "Embedded Systems / Robotics",
    period: "2026 — Present",
    status: "in-progress",
    sections: [
      {
        heading: "Where this is",
        body: [
          "I was selected for the IEEE Micromouse R&D Embedded Systems team through a resume review and technical interview. The team's goal is an autonomous maze-solving robot; my part is the embedded firmware.",
          "I'm early in this one — currently learning bare-metal C/C++ on an STM32F103C8 with the HAL set aside, working from the registers up rather than from a framework down.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "First concrete exercise: direct register control of the onboard PC13 LED, no HAL. From there — communication protocols, sensor data acquisition, and control architecture for the maze-solving firmware.",
          "This page grows into a real build log once I have code and hardware results worth showing, not before.",
        ],
      },
    ],
  },
];
