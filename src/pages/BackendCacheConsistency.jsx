import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "read-hit", title: "读流程：缓存命中",
    description: "请求先查缓存，命中则直接返回，不访问数据库。",
    bullets: ["App → Cache → 命中", "延迟低，DB 无压力", "大部分读请求走此路径"],
    active: "read", phase: 0,
  },
  {
    id: "read-miss", title: "读流程：缓存未命中",
    description: "缓存未命中，回源数据库查询后写回缓存。",
    bullets: ["Cache Miss → 查 DB", "DB 返回 → 写入 Cache", "下次读命中缓存"],
    active: "read", phase: 1,
  },
  {
    id: "write-db", title: "写流程：更新数据库",
    description: "先更新数据库，确保数据持久化。",
    bullets: ["App → 写 DB", "DB 更新成功", "然后删除缓存"],
    active: "write", phase: 0,
  },
  {
    id: "write-del", title: "写流程：删除缓存",
    description: "数据库更新后删除缓存，下次读触发回源重建。",
    bullets: ["删除 Cache 中旧值", "避免脏读", "Cache Aside 模式核心"],
    active: "write", phase: 1,
  },
  {
    id: "dw-sync", title: "双写：同步更新",
    description: "同时更新数据库和缓存，要求顺序一致。",
    bullets: ["写 DB → 写 Cache", "需保证原子性", "并发下可能乱序"],
    active: "double", phase: 0,
  },
  {
    id: "dw-mq", title: "双写：消息驱动对账",
    description: "通过消息队列异步同步，最终一致性。",
    bullets: ["DB 变更 → 发消息", "消费者更新 Cache", "版本号防乱序覆盖"],
    active: "double", phase: 1,
  },
];

// Layout: App(left) → Cache(center) → DB(right)
const NX = { app: 20, cache: 220, db: 420 };
const NY = 55, NW = 120, NH = 50;

// Flow arrows per mode/phase
// arc: "above"|"below" — route around Cache node instead of through it
const flows = {
  read: [
    [{ from: "app", to: "cache", label: "查询", color: "42,111,107", y: -10 }, { from: "cache", to: "app", label: "命中 ✓", color: "42,111,107", y: 12 }],
    [
      { from: "app", to: "cache", label: "查询", color: "210,100,42", y: -10 },
      { from: "cache", to: "db", label: "Miss → 回源", color: "210,100,42", y: -10 },
      { from: "db", to: "cache", label: "返回数据", color: "76,120,168", y: 12 },
      { from: "cache", to: "app", label: "写回+返回", color: "76,120,168", y: 12 },
    ],
  ],
  write: [
    [{ from: "app", to: "db", label: "① 写 DB", color: "210,100,42", arc: "above" }],
    [
      { from: "app", to: "db", label: "① 写 DB", color: "210,100,42", dim: true, arc: "above" },
      { from: "app", to: "cache", label: "② 删 Cache", color: "180,60,60" },
    ],
  ],
  double: [
    [
      { from: "app", to: "db", label: "① 写 DB", color: "210,100,42", arc: "above" },
      { from: "app", to: "cache", label: "② 写 Cache", color: "76,120,168", y: 12 },
    ],
    [
      { from: "app", to: "db", label: "① 写 DB", color: "210,100,42", arc: "above" },
      { from: "db", to: "cache", label: "MQ 同步", color: "140,80,180", y: 12 },
    ],
  ],
};

// Check if any arrow in current step bypasses cache (App→DB or DB→App)
function cacheBypass(arrows) {
  return arrows.some(a => (a.from === "app" && a.to === "db") || (a.from === "db" && a.to === "app"));
}

const principles = [
  { title: "Cache Aside", detail: "读缓存未命中再回源，写库后删除缓存。", points: ["读路径快", "写路径避免脏读", "失效缓存降低不一致风险"] },
  { title: "双写一致", detail: "数据库与缓存同步更新，要求顺序与幂等。", points: ["先写库再写缓存", "消息队列对账", "版本号防止乱序覆盖"] },
  { title: "常见问题", detail: "缓存击穿、雪崩、穿透的应对策略。", points: ["击穿：热点 key 加互斥锁", "雪崩：过期时间加随机值", "穿透：布隆过滤器拦截"] },
];

export default function BackendCacheConsistency() {
  return (
    <TopicShell
      eyebrow="系统设计动画"
      title="缓存一致性方案"
      subtitle="Cache Aside 读写流程与双写一致性策略。"
      steps={steps}
      panel={[
        { title: "目标", detail: "保持数据一致并提升读性能。" },
        { title: "常见问题", detail: "缓存击穿、雪崩、穿透。" },
      ]}
      principles={principles}
      principlesIntro="结合读写路径与失效策略，理解缓存一致性核心权衡。"
      flow={["读：缓存优先", "写：更新库 + 失效缓存", "双写需要异步对账"]}
      diagramClass="cache-diagram"
      renderDiagram={(step) => {
        const mode = step.active;
        const phase = step.phase;
        const arrows = flows[mode]?.[phase] || [];
        const bypass = cacheBypass(arrows);

        return (
          <div className="cc-scene">
            <svg className="cc-svg" viewBox="0 0 560 175" preserveAspectRatio="xMidYMid meet">
              <text x={280} y={14} className="cc-title">
                {mode === "read" ? "Cache Aside 读流程" : mode === "write" ? "Cache Aside 写流程" : "双写一致性"}
              </text>

              {/* Nodes */}
              {[
                { id: "app", label: "App", color: "42,111,107" },
                { id: "cache", label: "Cache", color: "76,120,168" },
                { id: "db", label: "DB", color: "210,100,42" },
              ].map((n) => {
                const fade = n.id === "cache" && bypass;
                return (
                  <g key={n.id} style={{ opacity: fade ? 0.25 : 1, transition: "opacity 0.4s" }}>
                    <rect x={NX[n.id]} y={NY} width={NW} height={NH} rx={10}
                      className="cc-node" style={{ stroke: `rgba(${n.color},0.4)`, fill: `rgba(${n.color},0.06)` }} />
                    <text x={NX[n.id] + NW / 2} y={NY + 31} className="cc-node-text" style={{ fill: `rgba(${n.color},0.9)` }}>{n.label}</text>
                  </g>
                );
              })}

              {/* Flow arrows */}
              {arrows.map((a, i) => {
                if (a.arc) {
                  // Arc arrow that goes above/below Cache node
                  const ax1 = NX[a.from] + NW;
                  const ax2 = NX[a.to];
                  const arcY = a.arc === "above" ? NY - 20 : NY + NH + 20;
                  const midX = (ax1 + ax2) / 2;
                  const pathD = `M${ax1},${NY + NH / 2} Q${midX},${arcY} ${ax2},${NY + NH / 2}`;
                  const op = a.dim ? 0.2 : 0.6;
                  return (
                    <g key={i} className={a.dim ? "cc-arrow--dim" : ""}>
                      <path d={pathD} fill="none" className="cc-arrow"
                        style={{ stroke: `rgba(${a.color},${op})` }} markerEnd="url(#cc-arr)" />
                      <rect x={midX - 36} y={arcY - (a.arc === "above" ? 8 : -2)} width={72} height={15} rx={4}
                        style={{ fill: `rgba(${a.color},0.08)`, stroke: `rgba(${a.color},0.2)`, strokeWidth: 0.8 }} />
                      <text x={midX} y={arcY + (a.arc === "above" ? 4 : 13)} className="cc-arrow-label"
                        style={{ fill: `rgba(${a.color},0.85)` }}>{a.label}</text>
                      {!a.dim && (
                        <circle r={3} style={{ fill: `rgba(${a.color},0.8)` }}>
                          <animateMotion dur="1.4s" repeatCount="indefinite" path={pathD} />
                          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.4s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  );
                }
                // Straight arrow between adjacent nodes
                const goLeft = NX[a.from] > NX[a.to];
                const ax1 = goLeft ? NX[a.from] : NX[a.from] + NW;
                const ax2 = goLeft ? NX[a.to] + NW : NX[a.to];
                const ay = NY + NH / 2 + (a.y || 0);
                const midX = (ax1 + ax2) / 2;
                return (
                  <g key={i} className={a.dim ? "cc-arrow--dim" : ""}>
                    <line x1={ax1} y1={ay} x2={ax2} y2={ay}
                      className="cc-arrow" style={{ stroke: `rgba(${a.color},${a.dim ? 0.2 : 0.6})` }}
                      markerEnd="url(#cc-arr)" />
                    <rect x={midX - 36} y={ay - 19} width={72} height={15} rx={4}
                      style={{ fill: `rgba(${a.color},0.08)`, stroke: `rgba(${a.color},0.2)`, strokeWidth: 0.8 }} />
                    <text x={midX} y={ay - 7} className="cc-arrow-label" style={{ fill: `rgba(${a.color},0.85)` }}>{a.label}</text>
                    {!a.dim && (
                      <circle r={3} style={{ fill: `rgba(${a.color},0.8)` }}>
                        <animateMotion dur="1.2s" repeatCount="indefinite" path={`M${ax1},${ay} L${ax2},${ay}`} />
                        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}

              <defs>
                <marker id="cc-arr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <path d="M0,0 L6,2.5 L0,5" fill="rgba(0,0,0,0.3)" />
                </marker>
              </defs>
            </svg>

            <div className={`cc-ds cc-ds--${mode}`}>
              <span className="cc-ds__label">{mode === "read" ? "读" : mode === "write" ? "写" : "双写"}</span>
              <div className="cc-ds__items">
                {(flows[mode] || []).map((_, i) => {
                  const labels = {
                    read: ["缓存命中", "缓存未命中→回源"],
                    write: ["写 DB", "删 Cache"],
                    double: ["同步双写", "MQ 异步对账"],
                  };
                  return (
                    <span key={i} className={`cc-ds__step ${i === phase ? "cc-ds__step--active" : ""} ${i < phase ? "cc-ds__step--past" : ""}`}>
                      {labels[mode]?.[i]}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
