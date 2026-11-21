type Kind = "pipeline" | "agent" | "stack" | "blueprint";

const MONO = "var(--font-mono)";

function Grid({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={id} width="25" height="25" patternUnits="userSpaceOnUse">
          <path
            d="M25 0H0V25"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".09"
          />
        </pattern>
      </defs>
      <rect width="800" height="500" fill={`url(#${id})`} />
    </>
  );
}

function Label({
  x,
  y,
  children,
  anchor = "start",
  accent = false,
  size = 11,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  accent?: boolean;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={accent ? "var(--accent-text)" : "var(--muted)"}
      style={{
        fontFamily: MONO,
        fontSize: size,
        letterSpacing: ".04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </text>
  );
}

function Pipeline() {
  const nodes = [
    { x: 70, n: "01", t: "research", s: "search + read" },
    { x: 260, n: "02", t: "script", s: "outline → draft" },
    { x: 450, n: "03", t: "voice", s: "tts + timing" },
    { x: 640, n: "04", t: "publish", s: "upload + meta" },
  ];
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Grid id="pa-pipeline" />

      <Label x={40} y={48}>pipeline · 4 stages</Label>
      <Label x={760} y={48} anchor="end" accent>python · llm · cron</Label>

      <line x1="40" y1="70" x2="760" y2="70" stroke="currentColor" strokeOpacity=".2" />

      {nodes.map((node, i) => (
        <g key={node.n}>
          <rect
            x={node.x}
            y={190}
            width={120}
            height={86}
            fill="var(--bg)"
            stroke="currentColor"
            strokeOpacity=".35"
          />
          <text
            x={node.x + 12}
            y={212}
            fill="var(--accent-text)"
            style={{ fontFamily: MONO, fontSize: 10 }}
          >
            {node.n}
          </text>
          <text
            x={node.x + 12}
            y={238}
            fill="currentColor"
            style={{ fontFamily: MONO, fontSize: 14, letterSpacing: "-.01em" }}
          >
            {node.t}
          </text>
          <text
            x={node.x + 12}
            y={260}
            fill="var(--muted)"
            style={{ fontFamily: MONO, fontSize: 9.5 }}
          >
            {node.s}
          </text>

          {i < nodes.length - 1 && (
            <g>
              <line
                x1={node.x + 120}
                y1={233}
                x2={nodes[i + 1].x}
                y2={233}
                stroke="var(--accent)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="art-flow"
              />
              <circle r="3" fill="var(--accent)" className="art-dot">
                <animateMotion
                  dur="3.2s"
                  repeatCount="indefinite"
                  path={`M${node.x + 122},233 L${nodes[i + 1].x - 2},233`}
                  begin={`${i * 0.5}s`}
                />
              </circle>
            </g>
          )}
        </g>
      ))}

      {/* approval gate */}
      <g>
        <line x1="40" y1="360" x2="760" y2="360" stroke="currentColor" strokeOpacity=".2" />
        <rect
          x="40"
          y="392"
          width="200"
          height="56"
          fill="none"
          stroke="var(--accent)"
          strokeDasharray="3 3"
        />
        <Label x={56} y={414} accent>human approval gate</Label>
        <Label x={56} y={432} size={10}>nothing ships unseen</Label>
        <path d="M240 420H300" stroke="currentColor" strokeOpacity=".4" strokeDasharray="2 3" />
        <Label x={310} y={424}>scheduled</Label>
      </g>

      <Label x={40} y={470} size={10}>input · one topic</Label>
      <Label x={760} y={470} anchor="end" size={10}>output · video + metadata</Label>
    </svg>
  );
}

function Agent({ step }: { step: number }) {
  const tools = [
    { x: 90, y: 110, t: "search", d: "web + docs" },
    { x: 90, y: 330, t: "code", d: "sandbox" },
    { x: 560, y: 110, t: "memory", d: "vector store" },
    { x: 560, y: 330, t: "browser", d: "playwright" },
  ];
  const active = step % (tools.length + 1);
  const log = [
    ["plan", "split the task"],
    ["call", "search(query)"],
    ["read", "top 3 results"],
    ["write", "draft + cite"],
    ["check", "schema + sources"],
  ];

  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Grid id="pa-agent" />
      <Label x={40} y={48}>agent · tool loop</Label>
      <Label x={760} y={48} anchor="end" accent>step {String(active).padStart(2, "0")} / 04</Label>

      <rect x="300" y="190" width="200" height="120" fill="var(--bg)" stroke="currentColor" strokeOpacity=".45" />
      <text x="400" y="232" textAnchor="middle" fill="currentColor" style={{ fontFamily: MONO, fontSize: 16 }}>agent</text>
      <text x="400" y="254" textAnchor="middle" fill="var(--muted)" style={{ fontFamily: MONO, fontSize: 9.5 }}>llm · planner · policy</text>
      <text x="400" y="284" textAnchor="middle" fill="var(--accent-text)" style={{ fontFamily: MONO, fontSize: 10 }}>tools ↓ results ↑</text>

      {tools.map((tool, i) => (
        <g key={tool.t} opacity={active === i + 1 ? 1 : 0.62}>
          <rect
            x={tool.x}
            y={tool.y}
            width={150}
            height={62}
            fill="var(--bg)"
            stroke={active === i + 1 ? "var(--accent)" : "currentColor"}
            strokeOpacity={active === i + 1 ? 1 : 0.3}
          />
          <text x={tool.x + 12} y={tool.y + 24} fill="currentColor" style={{ fontFamily: MONO, fontSize: 12 }}>{tool.t}</text>
          <text x={tool.x + 12} y={tool.y + 42} fill="var(--muted)" style={{ fontFamily: MONO, fontSize: 9 }}>{tool.d}</text>
          <line
            x1={tool.x + (tool.x < 400 ? 150 : 0)}
            y1={tool.y + 31}
            x2={tool.x < 400 ? 300 : 500}
            y2={250}
            stroke={active === i + 1 ? "var(--accent)" : "currentColor"}
            strokeOpacity={active === i + 1 ? 0.9 : 0.25}
            strokeDasharray="4 4"
          />
        </g>
      ))}

      <g>
        <line x1="40" y1="430" x2="760" y2="430" stroke="currentColor" strokeOpacity=".2" />
        {log.map((row, i) => {
          const on = i === active - 1 || (active === 0 && i === 0);
          return (
            <text
              key={row[0]}
              x={40 + i * 148}
              y={454}
              fill={on ? "var(--accent-text)" : "var(--muted)"}
              style={{ fontFamily: MONO, fontSize: 9 }}
            >
              {on ? "▸ " : "  "}
              {row[0]} · {row[1]}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

function Stack({ step }: { step: number }) {
  const layers = ["next.js", "react", "node api", "mongodb"];
  const active = step % layers.length;

  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Grid id="pa-stack" />
      <Label x={40} y={48}>full stack · one request</Label>
      <Label x={760} y={48} anchor="end" accent>1440 × 900</Label>

      {/* browser wireframe */}
      <g>
        <rect x="40" y="80" width="520" height="340" fill="var(--bg)" stroke="currentColor" strokeOpacity=".4" />
        <line x1="40" y1="112" x2="560" y2="112" stroke="currentColor" strokeOpacity=".3" />
        <circle cx="58" cy="96" r="3" fill="var(--muted)" />
        <circle cx="70" cy="96" r="3" fill="var(--muted)" />
        <circle cx="82" cy="96" r="3" fill="var(--muted)" />
        <text x="100" y="100" fill="var(--muted)" style={{ fontFamily: MONO, fontSize: 9 }}>localhost:3000</text>

        <rect x="60" y="132" width="70" height="8" fill="currentColor" opacity=".7" />
        <rect x="440" y="130" width="28" height="10" fill="none" stroke="currentColor" strokeOpacity=".4" />
        <rect x="476" y="130" width="28" height="10" fill="none" stroke="currentColor" strokeOpacity=".4" />

        <rect x="60" y="180" width="300" height="26" fill="currentColor" opacity=".8" />
        <rect x="60" y="216" width="230" height="26" fill="currentColor" opacity=".8" />
        <rect x="60" y="262" width="160" height="7" fill="var(--muted)" opacity=".5" />
        <rect x="60" y="278" width="200" height="7" fill="var(--muted)" opacity=".5" />
        <rect x="60" y="306" width="86" height="26" rx="13" fill="var(--accent)" />

        <rect x="400" y="180" width="120" height="90" fill="none" stroke="currentColor" strokeOpacity=".3" strokeDasharray="3 3" />
        <Label x={410} y={200} size={9}>fig</Label>

        <rect x="60" y="356" width="140" height="44" fill="none" stroke="currentColor" strokeOpacity=".25" />
        <rect x="214" y="356" width="140" height="44" fill="none" stroke="currentColor" strokeOpacity=".25" />
        <rect x="368" y="356" width="140" height="44" fill="none" stroke="currentColor" strokeOpacity=".25" />
      </g>

      {/* stack ladder */}
      {layers.map((layer, i) => (
        <g key={layer} opacity={i === active ? 1 : 0.5}>
          <rect
            x={610}
            y={110 + i * 66}
            width={150}
            height={46}
            fill={i === active ? "var(--accent)" : "var(--bg)"}
            stroke="currentColor"
            strokeOpacity=".35"
          />
          <text
            x={622}
            y={138 + i * 66}
            fill={i === active ? "var(--accent-ink)" : "currentColor"}
            style={{ fontFamily: MONO, fontSize: 11.5 }}
          >
            {layer}
          </text>
          {i < layers.length - 1 && (
            <line x1="685" y1={156 + i * 66} x2="685" y2={176 + i * 66} stroke="var(--accent)" strokeDasharray="3 3" />
          )}
        </g>
      ))}

      <line x1="560" y1="250" x2="610" y2="250" stroke="var(--accent)" strokeDasharray="4 4" className="art-flow" />

      <Label x={40} y={454} size={10}>ssr · api routes · auth · data model</Label>
      <Label x={760} y={454} anchor="end" size={10}>mobile first</Label>
    </svg>
  );
}

function BlueprintArt() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Grid id="pa-blueprint" />
      <Label x={40} y={48}>mg · 68×40</Label>
      <Label x={760} y={48} anchor="end">rev. 2026</Label>

      <rect x="40" y="70" width="720" height="360" fill="none" stroke="currentColor" strokeOpacity=".25" strokeDasharray="2 4" />
      <Label x={50} y={88} size={9}>viewport · 1440×900</Label>

      <g transform="translate(60 96)">
        <path d="M4 37V4l12 18L28 4v33" fill="none" stroke="currentColor" strokeWidth="3.2" />
        <path d="M48.3 8.7A16 16 0 1 0 53 20H39" fill="none" stroke="currentColor" strokeWidth="3.2" />
        <circle cx="60" cy="36" r="2.4" fill="var(--accent)" />
      </g>

      <text x="60" y="210" fill="currentColor" style={{ fontFamily: "var(--font-sans)", fontSize: 64, fontWeight: 500, letterSpacing: "-.055em" }}>I do AI.</text>
      <rect x="56" y="152" width="300" height="70" fill="none" stroke="var(--accent)" strokeDasharray="3 3" />
      <Label x={56} y={146} accent>h1.human · 300×70</Label>

      <text x="60" y="246" fill="currentColor" style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, letterSpacing: "-.02em" }}>AI engineering &amp; full-stack</text>
      <text x="60" y="274" fill="currentColor" style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, letterSpacing: "-.02em" }}>development, when the idea</text>
      <text x="60" y="302" fill="currentColor" style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, letterSpacing: "-.02em" }}>needs to ship.</text>
      <rect x="56" y="222" width="420" height="90" fill="none" stroke="currentColor" strokeOpacity=".35" strokeDasharray="2 4" />

      <line x1="60" y1="336" x2="720" y2="336" stroke="currentColor" strokeOpacity=".3" />
      <Label x={60} y={356} size={9}>work · services · about · contact</Label>
      <Label x={720} y={356} anchor="end" size={9}>lets talk →</Label>

      <g>
        {["98", "100", "100", "100"].map((score, i) => (
          <g key={i}>
            <text
              x={470 + i * 72}
              y={398}
              fill={i === 0 ? "var(--accent-text)" : "currentColor"}
              style={{ fontFamily: MONO, fontSize: 22 }}
            >
              {score}
            </text>
            <text x={470 + i * 72} y={414} fill="var(--muted)" style={{ fontFamily: MONO, fontSize: 8.5 }}>
              {["perf", "a11y", "best", "seo"][i]}
            </text>
          </g>
        ))}
      </g>

      <Label x={40} y={470} size={10}>lighthouse · mobile · 2026</Label>
      <Label x={760} y={470} anchor="end" size={10} accent>no trackers</Label>
    </svg>
  );
}

export default function ProjectArt({ kind, step }: { kind: Kind; step: number }) {
  switch (kind) {
    case "pipeline":
      return <Pipeline />;
    case "agent":
      return <Agent step={step} />;
    case "stack":
      return <Stack step={step} />;
    case "blueprint":
      return <BlueprintArt />;
    default:
      return null;
  }
}
