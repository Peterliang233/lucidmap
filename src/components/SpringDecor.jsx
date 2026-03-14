import { THEME } from "../config/theme.js";

const petals = [
  { id: "p1", left: "8%", delay: "0s", dur: "10s", size: 10, drift: 26, rot: -35 },
  { id: "p2", left: "18%", delay: "2.6s", dur: "12s", size: 12, drift: -18, rot: 45 },
  { id: "p3", left: "32%", delay: "1.2s", dur: "11s", size: 9, drift: 22, rot: 20 },
  { id: "p4", left: "46%", delay: "3.8s", dur: "13s", size: 14, drift: -26, rot: -18 },
  { id: "p5", left: "58%", delay: "0.8s", dur: "10.5s", size: 10, drift: 18, rot: 32 },
  { id: "p6", left: "68%", delay: "2.2s", dur: "12.5s", size: 11, drift: -20, rot: -28 },
  { id: "p7", left: "78%", delay: "4.2s", dur: "11.8s", size: 13, drift: 24, rot: 12 },
  { id: "p8", left: "90%", delay: "1.8s", dur: "12.8s", size: 10, drift: -16, rot: 38 },
];

function FlowerCluster({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 260 120" aria-hidden="true">
      <defs>
        <linearGradient id="springStem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f8a3b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1f6d68" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="springPetalPink" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff6fb" />
          <stop offset="45%" stopColor="#ffd6e8" />
          <stop offset="100%" stopColor="#ffbcd8" />
        </radialGradient>
        <radialGradient id="springPetalWhite" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f2fff2" />
          <stop offset="100%" stopColor="#dff7e1" />
        </radialGradient>
        <radialGradient id="springCenter" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff7b8" />
          <stop offset="100%" stopColor="#f2c84b" />
        </radialGradient>
      </defs>

      {/* ground */}
      <path
        d="M0,110 C30,86 68,98 92,105 C120,113 150,110 174,100 C202,88 232,92 260,110 L260,120 L0,120 Z"
        fill="rgba(47, 138, 59, 0.10)"
      />

      {/* stems */}
      <g stroke="url(#springStem)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M56,112 C52,90 58,72 66,58" />
        <path d="M128,112 C118,86 126,64 144,50" />
        <path d="M200,112 C194,92 202,70 220,56" />
      </g>

      {/* leaves */}
      <g fill="rgba(47, 138, 59, 0.22)">
        <path d="M66,78 C52,72 44,80 48,92 C58,92 66,88 70,84 Z" />
        <path d="M140,74 C126,70 116,78 120,90 C132,90 142,86 146,82 Z" />
        <path d="M216,78 C202,72 194,82 198,94 C210,94 218,90 222,86 Z" />
      </g>

      {/* flowers */}
      <g className="spring-flower spring-flower--1" transform="translate(66 56)">
        <g>
          <ellipse cx="0" cy="-12" rx="14" ry="10" fill="url(#springPetalPink)" />
          <ellipse cx="12" cy="-2" rx="14" ry="10" fill="url(#springPetalPink)" transform="rotate(72)" />
          <ellipse cx="-12" cy="-2" rx="14" ry="10" fill="url(#springPetalPink)" transform="rotate(-72)" />
          <ellipse cx="0" cy="10" rx="14" ry="10" fill="url(#springPetalPink)" transform="rotate(144)" />
          <ellipse cx="0" cy="10" rx="14" ry="10" fill="url(#springPetalPink)" transform="rotate(-144)" />
          <circle cx="0" cy="0" r="6" fill="url(#springCenter)" />
        </g>
      </g>

      <g className="spring-flower spring-flower--2" transform="translate(144 48)">
        <g>
          <ellipse cx="0" cy="-12" rx="16" ry="11" fill="url(#springPetalWhite)" />
          <ellipse cx="12" cy="-2" rx="16" ry="11" fill="url(#springPetalWhite)" transform="rotate(72)" />
          <ellipse cx="-12" cy="-2" rx="16" ry="11" fill="url(#springPetalWhite)" transform="rotate(-72)" />
          <ellipse cx="0" cy="10" rx="16" ry="11" fill="url(#springPetalWhite)" transform="rotate(144)" />
          <ellipse cx="0" cy="10" rx="16" ry="11" fill="url(#springPetalWhite)" transform="rotate(-144)" />
          <circle cx="0" cy="0" r="6.5" fill="url(#springCenter)" />
        </g>
      </g>

      <g className="spring-flower spring-flower--3" transform="translate(220 56)">
        <g>
          <ellipse cx="0" cy="-12" rx="14" ry="10" fill="url(#springPetalPink)" opacity="0.95" />
          <ellipse cx="12" cy="-2" rx="14" ry="10" fill="url(#springPetalPink)" opacity="0.95" transform="rotate(72)" />
          <ellipse cx="-12" cy="-2" rx="14" ry="10" fill="url(#springPetalPink)" opacity="0.95" transform="rotate(-72)" />
          <ellipse cx="0" cy="10" rx="14" ry="10" fill="url(#springPetalPink)" opacity="0.95" transform="rotate(144)" />
          <ellipse cx="0" cy="10" rx="14" ry="10" fill="url(#springPetalPink)" opacity="0.95" transform="rotate(-144)" />
          <circle cx="0" cy="0" r="6" fill="url(#springCenter)" />
        </g>
      </g>
    </svg>
  );
}

function TreeSilhouette({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 220 260" aria-hidden="true">
      <defs>
        <linearGradient id="springTrunk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(60, 85, 58, 0.65)" />
          <stop offset="100%" stopColor="rgba(22, 32, 21, 0.42)" />
        </linearGradient>
        <radialGradient id="springCrown" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="rgba(160, 232, 170, 0.45)" />
          <stop offset="55%" stopColor="rgba(47, 138, 59, 0.18)" />
          <stop offset="100%" stopColor="rgba(31, 109, 104, 0.10)" />
        </radialGradient>
      </defs>

      {/* crown */}
      <g opacity="0.95">
        <circle cx="92" cy="74" r="54" fill="url(#springCrown)" />
        <circle cx="140" cy="86" r="52" fill="url(#springCrown)" />
        <circle cx="110" cy="114" r="62" fill="url(#springCrown)" />
        <circle cx="68" cy="120" r="46" fill="url(#springCrown)" />
      </g>

      {/* trunk */}
      <path
        d="M108 248 C100 220 102 196 94 176 C86 154 72 144 78 122 C84 100 100 106 102 86
           C104 66 90 56 98 42 C106 28 126 34 132 52 C138 68 126 82 132 104 C138 126 160 134 154 160
           C148 186 126 190 130 212 C134 232 138 240 140 248 Z"
        fill="url(#springTrunk)"
      />

      {/* small blossoms */}
      <g className="spring-tree__buds" fill="#ffd6e8" opacity="0.75">
        <circle cx="76" cy="92" r="2.2" />
        <circle cx="92" cy="54" r="2.0" />
        <circle cx="132" cy="66" r="2.1" />
        <circle cx="156" cy="106" r="2.0" />
        <circle cx="124" cy="132" r="2.2" />
        <circle cx="60" cy="132" r="2.1" />
      </g>
    </svg>
  );
}

export default function SpringDecor() {
  if (THEME !== "spring") return null;

  return (
    <div className="spring-decor" aria-hidden="true">
      <div className="spring-decor__petals">
        {petals.map((p) => (
          <span
            key={p.id}
            className="spring-petal"
            style={{
              "--left": p.left,
              "--delay": p.delay,
              "--dur": p.dur,
              "--size": `${p.size}px`,
              "--h": `${Math.max(6, Math.round(p.size * 0.78))}px`,
              "--drift": `${p.drift}px`,
              "--rot": `${p.rot}deg`,
            }}
          />
        ))}
      </div>

      <TreeSilhouette className="spring-tree spring-tree--l" />
      <TreeSilhouette className="spring-tree spring-tree--r" />

      <FlowerCluster className="spring-flowers spring-flowers--l" />
      <FlowerCluster className="spring-flowers spring-flowers--r" />
    </div>
  );
}
