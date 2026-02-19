import { THEME } from "../config/theme.js";

/**
 * 烟花粒子数据 — 每朵烟花用不规则角度、距离、大小模拟真实绽放
 * ang: 射出角度, dist: 距中心距离, r: 粒子半径, color: 颜色, op: 不透明度
 */
const particles1 = [
  { ang: 5, dist: 30, r: 2.2, color: "#ff4444", op: 0.95 },
  { ang: 28, dist: 22, r: 1.4, color: "#ff6644", op: 0.8 },
  { ang: 55, dist: 27, r: 1.8, color: "#ffcc00", op: 0.9 },
  { ang: 78, dist: 18, r: 1.1, color: "#ff4444", op: 0.65 },
  { ang: 105, dist: 32, r: 2.4, color: "#e8c840", op: 0.95 },
  { ang: 130, dist: 20, r: 1.3, color: "#ff6644", op: 0.7 },
  { ang: 158, dist: 26, r: 1.7, color: "#ff4444", op: 0.85 },
  { ang: 185, dist: 15, r: 1.0, color: "#ffcc00", op: 0.6 },
  { ang: 210, dist: 29, r: 2.0, color: "#ff4444", op: 0.9 },
  { ang: 238, dist: 21, r: 1.5, color: "#e8c840", op: 0.75 },
  { ang: 262, dist: 25, r: 1.6, color: "#ff6644", op: 0.8 },
  { ang: 290, dist: 17, r: 1.2, color: "#ffcc00", op: 0.65 },
  { ang: 318, dist: 28, r: 2.1, color: "#ff4444", op: 0.9 },
  { ang: 345, dist: 19, r: 1.3, color: "#e8c840", op: 0.7 },
  { ang: 15, dist: 34, r: 2.5, color: "#ffcc00", op: 0.95 },
  { ang: 72, dist: 24, r: 1.6, color: "#ff4444", op: 0.75 },
  { ang: 120, dist: 35, r: 2.3, color: "#ffcc00", op: 0.9 },
  { ang: 195, dist: 16, r: 1.0, color: "#e8c840", op: 0.55 },
  { ang: 250, dist: 28, r: 1.8, color: "#ff6644", op: 0.8 },
  { ang: 320, dist: 31, r: 2.6, color: "#ffcc00", op: 0.95 },
  { ang: 42, dist: 14, r: 0.9, color: "#ff8844", op: 0.5 },
  { ang: 168, dist: 12, r: 0.8, color: "#ffaa00", op: 0.45 },
  { ang: 248, dist: 13, r: 0.8, color: "#ff6644", op: 0.4 },
  { ang: 305, dist: 11, r: 0.7, color: "#ffcc00", op: 0.4 },
  { ang: 48, dist: 16, r: 1.0, color: "#ff8844", op: 0.55 },
  { ang: 275, dist: 20, r: 1.2, color: "#e8c840", op: 0.6 },
];

const particles2 = [
  { ang: 12, dist: 26, r: 1.8, color: "#e8c840", op: 0.9 },
  { ang: 38, dist: 20, r: 1.3, color: "#ffaa00", op: 0.75 },
  { ang: 68, dist: 30, r: 2.3, color: "#e8c840", op: 0.95 },
  { ang: 95, dist: 16, r: 1.0, color: "#ff6666", op: 0.6 },
  { ang: 122, dist: 24, r: 1.6, color: "#ffcc00", op: 0.85 },
  { ang: 148, dist: 28, r: 2.0, color: "#e8c840", op: 0.9 },
  { ang: 175, dist: 18, r: 1.2, color: "#ff6666", op: 0.7 },
  { ang: 202, dist: 22, r: 1.5, color: "#ffaa00", op: 0.8 },
  { ang: 230, dist: 31, r: 2.4, color: "#e8c840", op: 0.95 },
  { ang: 255, dist: 14, r: 0.9, color: "#ff6666", op: 0.55 },
  { ang: 282, dist: 27, r: 1.9, color: "#ffcc00", op: 0.9 },
  { ang: 310, dist: 19, r: 1.3, color: "#e8c840", op: 0.75 },
  { ang: 338, dist: 23, r: 1.7, color: "#ffaa00", op: 0.85 },
  { ang: 25, dist: 33, r: 2.2, color: "#e8c840", op: 0.9 },
  { ang: 85, dist: 34, r: 2.5, color: "#ffcc00", op: 0.95 },
  { ang: 155, dist: 22, r: 1.4, color: "#ff6666", op: 0.7 },
  { ang: 220, dist: 35, r: 2.3, color: "#e8c840", op: 0.9 },
  { ang: 295, dist: 26, r: 1.7, color: "#ffaa00", op: 0.8 },
  { ang: 345, dist: 20, r: 1.2, color: "#ffcc00", op: 0.65 },
  { ang: 52, dist: 11, r: 0.7, color: "#ff8844", op: 0.4 },
  { ang: 165, dist: 13, r: 0.8, color: "#ffcc00", op: 0.45 },
  { ang: 270, dist: 10, r: 0.7, color: "#e8c840", op: 0.35 },
  { ang: 130, dist: 15, r: 1.0, color: "#ff8844", op: 0.5 },
];

const particles3 = [
  { ang: 8, dist: 24, r: 1.6, color: "#ff6666", op: 0.85 },
  { ang: 35, dist: 28, r: 2.0, color: "#ffaa00", op: 0.9 },
  { ang: 62, dist: 16, r: 1.0, color: "#ff6666", op: 0.6 },
  { ang: 88, dist: 26, r: 1.8, color: "#e8c840", op: 0.9 },
  { ang: 118, dist: 20, r: 1.4, color: "#ffaa00", op: 0.75 },
  { ang: 145, dist: 30, r: 2.3, color: "#ff6666", op: 0.95 },
  { ang: 172, dist: 14, r: 0.9, color: "#e8c840", op: 0.55 },
  { ang: 198, dist: 25, r: 1.7, color: "#ffaa00", op: 0.85 },
  { ang: 225, dist: 18, r: 1.2, color: "#ff6666", op: 0.7 },
  { ang: 252, dist: 29, r: 2.1, color: "#e8c840", op: 0.95 },
  { ang: 280, dist: 21, r: 1.5, color: "#ffaa00", op: 0.8 },
  { ang: 308, dist: 15, r: 1.0, color: "#ff6666", op: 0.6 },
  { ang: 335, dist: 27, r: 1.9, color: "#e8c840", op: 0.9 },
  { ang: 20, dist: 32, r: 2.2, color: "#ffaa00", op: 0.9 },
  { ang: 95, dist: 33, r: 2.5, color: "#e8c840", op: 0.95 },
  { ang: 160, dist: 34, r: 2.3, color: "#ff6666", op: 0.9 },
  { ang: 235, dist: 22, r: 1.4, color: "#ffcc00", op: 0.7 },
  { ang: 300, dist: 31, r: 2.4, color: "#e8c840", op: 0.95 },
  { ang: 48, dist: 12, r: 0.8, color: "#ff8844", op: 0.45 },
  { ang: 155, dist: 10, r: 0.7, color: "#ffcc00", op: 0.4 },
  { ang: 215, dist: 11, r: 0.7, color: "#ffaa00", op: 0.35 },
  { ang: 295, dist: 13, r: 0.9, color: "#e8c840", op: 0.45 },
  { ang: 55, dist: 18, r: 1.1, color: "#ff8844", op: 0.55 },
  { ang: 270, dist: 15, r: 1.0, color: "#ffaa00", op: 0.5 },
  { ang: 340, dist: 28, r: 1.7, color: "#ff6666", op: 0.8 },
];

/** 将极坐标转为 x,y */
function polar(ang, dist) {
  const r = (ang * Math.PI) / 180;
  return { x: Math.cos(r) * dist, y: Math.sin(r) * dist };
}

function renderBurst(particles) {
  return (
    <g transform="translate(40,40)">
      {particles.map((p, i) => {
        const pos = polar(p.ang, p.dist);
        return (
          <circle
            key={i}
            cx={pos.x.toFixed(1)}
            cy={pos.y.toFixed(1)}
            r={p.r}
            fill={p.color}
            opacity={p.op}
          />
        );
      })}
    </g>
  );
}

export default function CnyDecor() {
  if (THEME !== "chinese-new-year") return null;

  return (
    <div className="cny-decor" aria-hidden="true">
      <div className="cny-lantern cny-lantern--l">
        <div className="cny-lantern__string" />
        <div className="cny-lantern__body">
          <div className="cny-lantern__glow" />
          <span className="cny-lantern__text">福</span>
        </div>
        <div className="cny-lantern__tassel" />
      </div>
      <div className="cny-lantern cny-lantern--r">
        <div className="cny-lantern__string" />
        <div className="cny-lantern__body">
          <div className="cny-lantern__glow" />
          <span className="cny-lantern__text">春</span>
        </div>
        <div className="cny-lantern__tassel" />
      </div>
      {/* 烟花 */}
      <div className="cny-firework cny-firework--1">
        <div className="cny-firework__trail" />
        <svg className="cny-firework__burst" viewBox="0 0 80 80" aria-hidden="true">
          {renderBurst(particles1)}
        </svg>
      </div>
      <div className="cny-firework cny-firework--2">
        <div className="cny-firework__trail" />
        <svg className="cny-firework__burst" viewBox="0 0 80 80" aria-hidden="true">
          {renderBurst(particles2)}
        </svg>
      </div>
      <div className="cny-firework cny-firework--3">
        <div className="cny-firework__trail" />
        <svg className="cny-firework__burst" viewBox="0 0 80 80" aria-hidden="true">
          {renderBurst(particles3)}
        </svg>
      </div>
      {/* 爆竹 */}
      <svg className="cny-firecracker" viewBox="0 0 40 120" aria-hidden="true">
        <line x1="20" y1="0" x2="20" y2="20" stroke="#c41a1a" strokeWidth="1.5" strokeDasharray="3 2" />
        {[0,1,2,3,4].map(i => (
          <g key={i} transform={`translate(0, ${20 + i * 20})`}>
            <rect x="6" y="0" width="28" height="16" rx="3" fill="#c41a1a" opacity={0.85 - i * 0.1} />
            <rect x="10" y="2" width="20" height="12" rx="2" fill="#e8c840" opacity="0.3" />
            <line x1="20" y1="0" x2="20" y2={i < 4 ? "20" : "4"} stroke="#c41a1a" strokeWidth="1" strokeDasharray="2 2" transform="translate(0, 16)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
