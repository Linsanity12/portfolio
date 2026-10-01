import { PROJECTS, type CaseStudySection, type Project } from "@/lib/projects";
import { DASHBOARD_IMAGE, DASHBOARD_PROJECT, DASHBOARD_SECTIONS } from "@/lib/v2-dashboard";
import type { ExtraLink, V2Project, V2Section } from "@/lib/v2-types";

/**
 * Content for the /v2 pages. Titles, periods, status, thumbnails and most case-study text come
 * straight from lib/projects.ts, so the two versions can't drift apart. This file adds:
 *  - OVERRIDES: v2-specific wording for the two projects whose text was rewritten
 *    (FIRST Robotics, from the team's public build blog; the filament recycler),
 *  - image alt text and crop hints,
 *  - copy mirrored verbatim from app/(site)/info/page.tsx.
 */

export type { ExtraLink } from "@/lib/v2-types";

/** Extra links shown next to a project's case-study link. */
export const EXTRA_LINKS: Record<string, ExtraLink> = {
  "facial-recognition": { label: "Try the live demo", href: "/face-verify" },
  // the walkthrough is the only extra link this project has: no public repo or live demo exists yet
  "ai-model-testing-dashboard": {
    label: "Watch the walkthrough",
    href: "/work/ai-model-testing-dashboard#walkthrough",
  },
};

/** Alt text and object-position for each card thumbnail. */
export const IMAGE_META: Record<string, { alt: string; position?: string }> = {
  "ai-model-testing-dashboard": DASHBOARD_IMAGE,
  "facial-recognition": {
    alt: "Bar chart comparing average verification accuracy across five face-verification models",
    position: "50% 50%",
  },
  "first-robotics": {
    alt: "Robot electronics and wiring during the 2025 build",
    position: "50% 45%",
  },
  "filament-recycling": {
    alt: "Populated controller board for the filament machine",
    position: "50% 30%",
  },
};

const STILL = "Still from a Walton Robotics build video";

/** Wording written for v2. Anything not listed here uses lib/projects.ts as-is. */
type Override = Partial<Pick<Project, "oneLiner" | "tags">> & { sections?: CaseStudySection[] };

const OVERRIDES: Record<string, Override> = {
  "first-robotics": {
    sections: [
      {
        heading: "The 2025 season",
        body: [
          "REEFSCAPE, the 2025 game, rewards fast coral cycles. Walton 2974 ran the season as an Open Alliance team, sharing its CAD, code and progress in a public build blog, with events planned at Dalton in week 2 and Statesboro in week 4.",
          "Kickoff was a joint effort with teams 1002 and 1261. Together they read the rules, listed the strategic options, and ranked what the robot needed: what had to work by the first event, what came next (a deep climb first among them), and what would be nice to have without steering any design.",
        ],
      },
      {
        heading: "My role",
        body: [
          "I served as Chief Engineer from 2022 to 2025, leading 13 varsity and 7 junior engineers inside a program of more than 40 members. I directed the design and manufacturing of the shooter and telescoping-arm subsystems, built the team’s competition pit from scratch, and wrote technical documentation the team published for other teams to learn from.",
          "The decisions and photos below are from the 2025 season specifically: team engineering, credited to the team, inside a role I led across all four years.",
        ],
      },
      {
        heading: "From requirements to prototypes",
        body: [
          "Decision matrices for the coral intake, the algae intake and the climber narrowed the options. Three coral intakes went to CAD: an over-the-bumper design, a Y-shaped one and an expanding U. The algae intake started from the team’s own 2019 design.",
          "The CAD review was blunt. The U-shape risked jamming when picking a coral up off the floor, and neither the over-the-bumper nor the ground intake had any way to score. The Y-shape, with compliant star rollers that quickly reorient and grip the coral, came out ahead.",
          "For algae, the team laser-cut an adjustable-width prototype to find the right compression. A gap of 11⅞ inches between wheel edges held the algae well, and mounting the wheels top and bottom instead of side to side kept it better aligned. The prototype moved from drills to motors as the plates were recut.",
        ],
        image: {
          src: "/work/robotics/algae-intake-test.webp",
          alt: "Algae intake prototype gripping a large teal ball on the practice floor",
          caption: `Testing the laser-cut algae intake prototype. ${STILL}, 2025.`,
          width: 1280,
          height: 720,
        },
      },
      {
        heading: "Designing around cycle time",
        body: [
          "The first full-robot CAD was organised around one goal: the shortest possible coral cycle. Intake and outtake sit on a single path parallel to the elevator, an idea the team credited to team 3512, so the drivetrain hardly needs to turn between pickup and scoring. With the coral mechanism on the carriage weighing about 7 lb before pocketing, the elevator could reach L4 height in just over half a second.",
          "Because the chute sits at a fixed angle, scoring on L4 needed three elevator stages. The team chose a continuous-belt elevator so it never has to lift the weight of extra stages. The algae mechanism went on a chassis-mounted pivot instead of the carriage, since added carriage weight would slow every coral cycle. That gave up some scoring flexibility for a lighter, faster-cycling coral system, the right trade for a robot that lives or dies on cycle time.",
          "A first algae design built like a shooter, tested with Krakens on 4:1 gearboxes, didn’t throw far enough. The team switched to a lighter bar-style mechanism, about 14 lb against roughly 21 lb for the shooter version.",
        ],
      },
      {
        heading: "Testing the details",
        body: [
          "The coral chute was laser-cut and assembled first, so the design could be tested before committing to aluminum. Its wheels started on a 4:1 reduction that proved too fast to control cleanly, so the team moved to 7:1 and got a mechanism that behaved the way the drivers needed.",
          "The algae finger’s first motor was hard to modulate: above about 10% power it snapped from up to down. Swapping it for a slower window motor (about 92 rpm), with an encoder on the belt and a revised mount, turned it into something a driver could finesse.",
          "The swerve modules changed from L3 to L2 gearing as well. A game of short cycles doesn’t need L3 speed.",
        ],
        image: {
          src: "/work/robotics/coral-chute-bench.webp",
          alt: "Coral chute prototype on a workbench with green compliant wheels, belts and a motor",
          caption: `Bench-testing the coral chute and its belt-driven wheels. ${STILL}, February 2025.`,
          width: 1280,
          height: 720,
        },
      },
      {
        heading: "Physical integration",
        body: [
          "By February 22nd the elevator and chassis were assembled, the coral mechanism was wired, and the robot was powered up for the first programming pass. The photo below is from that handoff: full frame, temporary wiring and all, because that’s what an in-progress robot actually looks like.",
        ],
        image: {
          src: "/work/robot-electronics.webp",
          alt: "Robot electronics and wiring during the 2025 build",
          caption: "Walton Robotics, February 22, 2025.",
          width: 988,
          height: 1272,
        },
      },
      {
        heading: "Elevator and cable routing",
        body: [
          "The elevator carries the coral mechanism through its full range of motion, which means its cable routing has to survive constant flexing without snagging. This shot captures that routing uncropped, straight from the build.",
          "The first energy chain shattered under that flexing, so the team moved to a larger, stronger one and reset the lengths and mounts to keep it in a single plane.",
        ],
        image: {
          src: "/work/robot-elevator.webp",
          alt: "Elevator assembly and cable routing",
          caption: "Walton Robotics, February 22, 2025.",
          width: 988,
          height: 614,
        },
      },
      {
        heading: "The climber",
        body: [
          "No subsystem changed shape more than the climber. It began as a pivot arm with two pegs and a winch, modeled on another team’s design. Space on the robot pushed the team toward an Everybot-style climber that uses the elevator to lift: an extension off the coral chute hooks the cage, and the elevator pulls the robot up.",
          "Early hardware climbed the shallow cage and held up to 150 lb, but the deep cage was a friction problem between the polycarbonate plates. The next design was a two-piece latch, a lower guide that orients the cage plus spring-loaded wings held out by rubber bands, and it climbed faster and more efficiently than any version before it.",
          "Before the district championship the team made a call. Lining up on the cage was taking drivers about 20 seconds, too long to be worth it. The climber and its braking gearbox came off, which freed the weight to make the limit and to put into a better intake funnel.",
        ],
        image: {
          src: "/work/robotics/climber-first-hang.webp",
          alt: "Robot hanging at an angle from the practice cage during an early climber test",
          caption: `An early climber hang test on the practice field. ${STILL}, March 2025.`,
          width: 1280,
          height: 720,
        },
      },
      {
        heading: "Practice, then Dalton",
        body: [
          "A small reef built for the pit let the team practice scoring wherever they were. Walton went on to win the Dalton event with captain 6919 and partner 10376.",
          "Between events the team added a mini PC and two cameras to work on autonomous routines, one on the elevator and one on a swerve module, both looking at where the coral leaves the chute.",
        ],
        image: {
          src: "/work/robotics/reef-scoring-practice.webp",
          alt: "Robot 2974 scoring on a practice reef",
          caption: `Practice scoring on the reef. ${STILL}, March 2025.`,
          width: 1280,
          height: 720,
        },
      },
      {
        heading: "Statesboro and the district championship",
        body: [
          "At Statesboro, the first qualifier ever held there, Walton won alongside 8866, 4701 and 5219 in a 2–1 final. Impacts twisted the algae intake, and an elevator clamp fixed the stability problem but added weight the team had to account for elsewhere. The team then competed at the district championship on an alliance with 1261 and 7538.",
          "Feeding from the human player station was the slowest part of the cycle, so the funnel grew from a short, narrow opening to one 10 inches tall and 14.5 inches wide with a top plate, and later gained a roller of compliant star wheels at its mouth, driven by a NEO 550. Moving coral in got much quicker.",
        ],
        image: {
          src: "/work/robotics/dalton-event.webp",
          alt: "Robot 2974 and an alliance partner beside the reef at an event",
          caption: `At the Dalton event. ${STILL}, March 2025.`,
          width: 1280,
          height: 720,
        },
      },
      {
        heading: "Small fixes that mattered",
        body: [
          "The coral’s sharp edges kept digging into the outtake floor, so polycarbonate gave way to half-inch HDPE, and a small 3D-printed diverter fixed a corner where the chute caught. The printed elevator pulleys couldn’t keep up with the belt, so they were replaced with Delrin and then aluminum, which ran with the least friction and no bearing-release issues across the next two competitions.",
          "Grip tape and surgical tubing on the algae mechanism kept its game piece from slipping out.",
        ],
        image: {
          src: "/work/robotics/auton-camera-test.webp",
          alt: "Robot 2974 in a practice space beside a reef, during a camera and autonomous test",
          caption: `Testing camera-assisted autonomous routines. ${STILL}, March 2025.`,
          width: 1280,
          height: 720,
        },
      },
      {
        heading: "Results",
        body: [
          "Two event wins, at Dalton and Statesboro, and a district championship alliance with 1261 and 7538. Over the rest of the season the robot kept changing right up to the trip to Houston: a wider funnel, aluminum pulleys and camera-assisted autonomous routines, with the climber cut so its weight could go into intake performance.",
          "As an Open Alliance team, Walton also shared its process openly, from the kickoff worksheet to the weekly updates, and passed intake and scoring-mechanism CAD to another team that asked for it.",
        ],
      },
    ],
  },

  "filament-recycling": {
    tags: "Electronics / Embedded Systems",
    oneLiner:
      "A PET-bottle recycler I built from the open PET2Print design: a bottle cutter, a heated hot end, a motorised reel and a PID temperature controller. The machine is built; proving out the filament is what’s left.",
    sections: [
      {
        heading: "The idea",
        body: [
          "Most of the plastic bottles I use never get recycled into anything useful. This machine is my attempt to close that loop myself: take a discarded PET bottle and turn it into filament a 3D printer can use. I self-funded the build, at a little over $300.",
          "It has four parts. A cutter slices the bottle into one long strip of even width. A hot end softens the strip and folds it into a round section the size of standard filament. A motorised reel pulls the strip through and stores the result. A controller holds the hot end at temperature and sets the reel speed. The PET is never fully melted, only warmed enough to fold over into a tube.",
        ],
      },
      {
        heading: "The design behind it",
        body: [
          "I built this from PET2Print, an open design published in 2023 by thediylife, and the printed parts follow it. What is mine is the build: printing and assembling the machine, wiring the electronics, moving the control circuit from a breadboard to a soldered controller board, and tuning the firmware settings for my setup.",
        ],
      },
      {
        heading: "How the cutter works",
        body: [
          "In this design the cutter is two ordinary 608 skate bearings with one face ground sharp. A printed base holds them at a fixed gap, a metal strip under them saves the base from wearing away, and a printed guide keeps the strip in line as it heads for the hot end.",
        ],
      },
      {
        heading: "The hot end",
        body: [
          "The hot end is a standard 0.4 mm nozzle drilled out to just under 1.6 mm, because filament swells slightly after it leaves the nozzle and the target is 1.75 mm. The back of the heat block is opened with a tapered bit, so the strip’s edges fold over gently on their way in. Plywood plates keep the mounting screws from melting the printed holder.",
        ],
      },
      {
        heading: "The controller",
        body: [
          "The control loop started on a breadboard: thermistor, PWM heater output, stepper driver, rotary encoder and an SSD1306 display, all wired by hand so I could prove the logic before committing to a board.",
        ],
        image: {
          src: "/work/filament-breadboard.webp",
          alt: "Early breadboard prototype of the filament machine’s control electronics",
          caption: "Early control-loop prototype, breadboarded before the controller board.",
          width: 1350,
          height: 1800,
        },
      },
      {
        heading: "From breadboard to board",
        body: [
          "From the breadboard I moved to a populated controller board, which replaced the wiring mess and puts temperature control, reel motion and the operator interface in one place.",
          "The firmware reads the thermistor, runs a PID loop to hold temperature and drives the heater over PWM. In parallel it steps the reel motor and reads the rotary encoder, so temperature, speed and direction can be dialed in on the fly. It currently defaults to a 220°C setpoint with a 190–230°C working range. Those are settings I’ve tuned by hand, not numbers from a measured process window yet.",
        ],
        image: {
          src: "/work/filament-board.webp",
          alt: "Populated controller board for the filament machine",
          caption: "The populated controller board.",
          width: 1350,
          height: 1800,
        },
      },
      {
        heading: "Turning a bottle into filament",
        body: [
          "The published process is careful about preparation. The label and any residue come off first (acetone works well), and rippled bottles are smoothed with a little heat and a drop of water inside to pressurise them slightly, with gloves on and care around hot steam. The hot end is preheated to about 220°C, the strip is fed through with pliers and tied onto the reel, and the reel motor pulls it the rest of the way. A reel speed of 22 is reported to work well.",
          "The published prints are a benchy and a calibration cube. The filament comes out hollow rather than solid, so the slicer’s flow rate has to rise to around 135%, and the reported print temperatures are 260°C at the hot end and 70°C on the bed. The results are described as usable for home projects, though less consistent than factory filament, with some stringing and under-extrusion.",
          "Those are the design’s numbers, not mine. I haven’t run my own prints yet, so I’m treating them as starting points.",
        ],
      },
      {
        heading: "Where it stands",
        body: [
          "The mechanical side is built: 16 printed parts covering the cutter, reel, motor mount, hot-end holder and enclosure. What’s left is dialing in a consistent filament diameter and proving out a full print with it. I haven’t measured throughput or print quality, so I’m not claiming either until I have numbers.",
        ],
        image: {
          src: "/work/filament-parts.webp",
          alt: "3D-printed mechanical parts for the filament machine",
          caption: "Cutter, reel and mounting hardware: the printed parts for the mechanical build.",
          width: 1350,
          height: 1800,
        },
      },
    ],
  },
};

/** A project with any v2 wording applied, plus its final list of sections. */
export type CaseStudy = { project: V2Project; sections: V2Section[] };

export function withOverrides(p: Project): V2Project {
  const o = OVERRIDES[p.slug];
  return o ? { ...p, oneLiner: o.oneLiner ?? p.oneLiner, tags: o.tags ?? p.tags } : p;
}

// Projects that exist only on the v2 site. The AI Model Testing Dashboard has its own module
// because its case study uses richer blocks (video, diagram, stats) than lib/projects.ts models.
const V2_ONLY: V2Project[] = [DASHBOARD_PROJECT];

const byOrder = [...PROJECTS.map(withOverrides), ...V2_ONLY].sort((a, b) => a.order - b.order);

/** Every project, in order, with v2 wording applied. */
export const ALL: V2Project[] = byOrder;
export const FEATURED: V2Project[] = ALL.filter((p) => p.status === "featured");
export const IN_PROGRESS: V2Project[] = ALL.filter((p) => p.status === "in-progress");

export function getCaseStudy(slug: string): CaseStudy | undefined {
  const project = ALL.find((p) => p.slug === slug);
  if (!project) return undefined;
  const sections: V2Section[] =
    slug === DASHBOARD_PROJECT.slug
      ? DASHBOARD_SECTIONS
      : (OVERRIDES[slug]?.sections ?? PROJECTS.find((p) => p.slug === slug)?.sections ?? []);
  return { project, sections };
}

/** The project after this one in display order (wraps around). */
export function nextProject(slug: string): V2Project {
  const i = ALL.findIndex((p) => p.slug === slug);
  return ALL[(i + 1) % ALL.length];
}

export const ABOUT_COPY = [
  "I like the place where electronics, code, and physical systems meet — where a design decision on paper turns into a board that either works or doesn't.",
  "Most of what I build sits somewhere between embedded systems and robotics: PCB design, motor control, and lately computer vision. I'd rather have something working on a breadboard than a polished plan for one.",
];

export const EXPERIENCE = [
  { period: "Nov 2025 — Present", role: "Research Assistant", org: "UGA Multispectral Imagery Lab" },
  {
    period: "2026 — Present",
    role: "Embedded Systems / Microcontroller Group Lead",
    org: "Cardboard Electric Vehicle Project",
  },
  { period: "2026 — Present", role: "Embedded R&D Team", org: "IEEE Micromouse" },
  { period: "2022 — 2025", role: "Chief Engineer", org: "FIRST Robotics — Walton Robotics 2974" },
];

export const EDUCATION = {
  school: "University of Georgia",
  detail: "B.S. Electrical Engineering · Expected May 2029",
};

export const EXPLORING = ["Embedded Systems", "PCB Design", "Computer Architecture", "Motor Control", "Robotics"];
