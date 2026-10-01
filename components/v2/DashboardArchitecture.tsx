/**
 * How the dashboard's pieces connect, drawn as a single narrow column so it stays legible on a
 * phone. Colors come from the v2 tokens through the .v2-dg-* classes, so it follows the page.
 */
export default function DashboardArchitecture() {
  return (
    <figure className="v2-dg">
      <svg viewBox="0 0 380 620" role="img" aria-labelledby="dg-title dg-desc">
        <title id="dg-title">Architecture of the AI Model Testing Dashboard</title>
        <desc id="dg-desc">
          The browser calls route handlers. Route handlers start the runner in the background. The runner sends requests
          to the Vercel AI Gateway, which reaches OpenAI and Anthropic models. The browser&rsquo;s server-rendered
          pages, the route handlers and the runner all read or write a Postgres database.
        </desc>
        <defs>
          <marker
            id="dg-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M1 1l8 4-8 4z" className="v2-dg-arrowhead" />
          </marker>
        </defs>

        {/* database bus, drawn first so the boxes sit on top */}
        <path d="M304 42H336V578H304M304 142H336M304 266H336" className="v2-dg-bus" />
        <circle cx="336" cy="142" r="3.5" className="v2-dg-dot" />
        <circle cx="336" cy="266" r="3.5" className="v2-dg-dot" />
        <text transform="translate(358 310) rotate(-90)" textAnchor="middle" className="v2-dg-label">
          read and write
        </text>

        {/* main flow */}
        <path d="M164 74V110" className="v2-dg-line" markerEnd="url(#dg-arrow)" />
        <path d="M164 174V220" className="v2-dg-line" markerEnd="url(#dg-arrow)" />
        <path d="M164 312V362" className="v2-dg-line" markerEnd="url(#dg-arrow)" />
        <path d="M164 426V462" className="v2-dg-line" markerEnd="url(#dg-arrow)" />
        <text x="176" y="96" className="v2-dg-label">
          fetch
        </text>
        <text x="176" y="202" className="v2-dg-label">
          after(), in the background
        </text>
        <text x="176" y="341" className="v2-dg-label">
          generateText
        </text>

        <g>
          <rect x="24" y="10" width="280" height="64" rx="12" className="v2-dg-box" />
          <text x="164" y="36" textAnchor="middle" className="v2-dg-title">
            Browser
          </text>
          <text x="164" y="57" textAnchor="middle" className="v2-dg-sub">
            Setup, live run, results, ticket detail
          </text>
        </g>
        <g>
          <rect x="24" y="110" width="280" height="64" rx="12" className="v2-dg-box" />
          <text x="164" y="136" textAnchor="middle" className="v2-dg-title">
            Route handlers
          </text>
          <text x="164" y="157" textAnchor="middle" className="v2-dg-sub">
            create, start, cancel, status, export
          </text>
        </g>
        <g>
          <rect x="24" y="220" width="280" height="92" rx="12" className="v2-dg-box v2-dg-box-accent" />
          <text x="164" y="247" textAnchor="middle" className="v2-dg-title">
            Runner
          </text>
          <text x="164" y="270" textAnchor="middle" className="v2-dg-sub">
            4 requests at a time, retries with backoff,
          </text>
          <text x="164" y="289" textAnchor="middle" className="v2-dg-sub">
            budget guard, exact-match scoring
          </text>
        </g>
        <g>
          <rect x="24" y="362" width="280" height="64" rx="12" className="v2-dg-box" />
          <text x="164" y="388" textAnchor="middle" className="v2-dg-title">
            Vercel AI Gateway
          </text>
          <text x="164" y="409" textAnchor="middle" className="v2-dg-sub">
            one API for both providers
          </text>
        </g>
        <g>
          <rect x="24" y="462" width="280" height="56" rx="12" className="v2-dg-box" />
          <text x="164" y="486" textAnchor="middle" className="v2-dg-title">
            OpenAI and Anthropic models
          </text>
          <text x="164" y="506" textAnchor="middle" className="v2-dg-sub">
            GPT-4o mini, Claude Haiku 4.5
          </text>
        </g>
        <g>
          <rect x="24" y="546" width="280" height="64" rx="12" className="v2-dg-box v2-dg-box-db" />
          <text x="164" y="572" textAnchor="middle" className="v2-dg-title">
            Postgres (Neon)
          </text>
          <text x="164" y="593" textAnchor="middle" className="v2-dg-sub">
            via Drizzle ORM
          </text>
        </g>
      </svg>
      <figcaption>
        How the pieces connect. Pages read Postgres directly, route handlers change state, and the runner reaches models
        only through the AI Gateway.
      </figcaption>
    </figure>
  );
}
