import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "overview",
    title: "GC 全景",
    description: "Go 使用并发三色标记清除 GC，配合写屏障实现低延迟回收。",
    bullets: ["并发 GC：与用户代码并行执行", "三色标记：白/灰/黑三种状态", "写屏障：保证并发标记的正确性"],
    active: "overview",
  },
  {
    id: "tricolor",
    title: "三色标记法",
    description: "对象分为白色（未访问）、灰色（已发现待扫描）、黑色（已扫描完成）。",
    bullets: ["初始：所有对象为白色", "从 Root 出发，访问到的标灰", "灰色对象的子引用标灰，自身变黑"],
    active: "tricolor",
  },
  {
    id: "marking",
    title: "并发标记过程",
    description: "标记阶段与用户 Goroutine 并发执行，通过写屏障维护一致性。",
    bullets: ["STW 1：开启写屏障，扫描栈上 Root", "并发标记：后台 G 遍历对象图", "STW 2：关闭写屏障，完成标记"],
    active: "marking",
  },
  {
    id: "writebarrier",
    title: "写屏障机制",
    description: "混合写屏障（Go 1.8+）确保并发标记期间不丢失存活对象。",
    bullets: ["插入屏障：新引用的对象标灰", "删除屏障：被删引用的对象标灰", "混合屏障：栈无需重扫，降低 STW"],
    active: "writebarrier",
  },
  {
    id: "sweep",
    title: "清除阶段",
    description: "标记完成后，白色对象即为垃圾，并发回收其内存。",
    bullets: ["白色对象 = 不可达 = 垃圾", "并发清除，不需要 STW", "内存归还给 mspan/mcentral"],
    active: "sweep",
  },
  {
    id: "tuning",
    title: "GC 调优",
    description: "通过 GOGC 和 GOMEMLIMIT 控制 GC 触发频率和内存上限。",
    bullets: ["GOGC=100（默认）：堆增长100%时触发", "GOGC=off：关闭自动 GC", "GOMEMLIMIT（Go 1.19+）：设置软内存上限"],
    active: "tuning",
  },
];

const principles = [
  {
    title: "为什么用三色标记",
    detail: "三色标记法天然支持增量和并发，避免全堆 STW。",
    points: ["灰色集合是工作队列的抽象", "黑色对象不会再被扫描", "白色对象在标记结束后即为垃圾"],
  },
  {
    title: "写屏障的必要性",
    detail: "并发标记期间用户代码可能修改引用关系，导致存活对象被误回收。",
    points: ["黑色对象新增白色引用 → 漏标", "写屏障将新引用对象标灰", "Go 1.8 混合屏障消除栈重扫"],
  },
  {
    title: "GC Pacer",
    detail: "Go 运行时动态调整 GC 触发时机，平衡吞吐和延迟。",
    points: ["根据上次 GC 后的分配速率预测", "目标：在达到 GOGC 阈值前完成标记", "GOMEMLIMIT 提供硬性内存约束"],
  },
];

/* ── 颜色 ── */
const C_WHITE = "#999";
const C_GREY = "#e67e22";
const C_BLACK = "#2c3e50";
const C_ROOT = "#2a6f6b";
const C_SWEEP = "#e74c3c";
const C_WB = "#8c50b4";

const SVG_W = 640;

function OverviewScene() {
  const phases = [
    { label: "STW 1", desc: "开启写屏障", x: 40, w: 100, color: C_SWEEP },
    { label: "并发标记", desc: "三色遍历", x: 160, w: 180, color: C_ROOT },
    { label: "STW 2", desc: "关闭写屏障", x: 360, w: 100, color: C_SWEEP },
    { label: "并发清除", desc: "回收白色对象", x: 480, w: 130, color: C_GREY },
  ];
  return (
    <svg className="gogc-svg" viewBox={`0 0 ${SVG_W} 260`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gogc-heading">Go GC 全景 — 并发三色标记清除</text>

      {/* 时间轴 */}
      <line x1={30} y1={100} x2={620} y2={100} stroke="var(--line)" strokeWidth={1} />

      {phases.map((p, i) => (
        <g key={i} className="gogc-phase-block" style={{ "--gogc-d": `${i * 0.2}s` }}>
          <rect x={p.x} y={70} width={p.w} height={56} rx={10} fill={`${p.color}10`} stroke={p.color} strokeWidth={1.5} strokeOpacity={0.4} />
          <text x={p.x + p.w / 2} y={92} textAnchor="middle" className="gogc-phase-label" fill={p.color}>{p.label}</text>
          <text x={p.x + p.w / 2} y={110} textAnchor="middle" className="gogc-phase-sub">{p.desc}</text>
        </g>
      ))}

      {/* 三色图例 */}
      <g transform="translate(120, 160)">
        <circle cx={0} cy={0} r={14} fill="rgba(255,255,255,0.9)" stroke={C_WHITE} strokeWidth={2} />
        <text x={0} y={4} textAnchor="middle" className="gogc-legend-text">W</text>
        <text x={0} y={24} textAnchor="middle" className="gogc-legend-label">白色</text>
        <text x={0} y={38} textAnchor="middle" className="gogc-legend-desc">未访问</text>
      </g>
      <g transform="translate(320, 160)">
        <circle cx={0} cy={0} r={14} fill="rgba(230,126,34,0.15)" stroke={C_GREY} strokeWidth={2} />
        <text x={0} y={4} textAnchor="middle" className="gogc-legend-text">G</text>
        <text x={0} y={24} textAnchor="middle" className="gogc-legend-label">灰色</text>
        <text x={0} y={38} textAnchor="middle" className="gogc-legend-desc">已发现待扫描</text>
      </g>
      <g transform="translate(520, 160)">
        <circle cx={0} cy={0} r={14} fill="rgba(44,62,80,0.15)" stroke={C_BLACK} strokeWidth={2} />
        <text x={0} y={4} textAnchor="middle" className="gogc-legend-text">B</text>
        <text x={0} y={24} textAnchor="middle" className="gogc-legend-label">黑色</text>
        <text x={0} y={38} textAnchor="middle" className="gogc-legend-desc">已扫描完成</text>
      </g>
    </svg>
  );
}

function TricolorScene() {
  const objs = [
    { id: "R", x: 100, y: 70, color: "black", label: "Root" },
    { id: "A", x: 220, y: 60, color: "black" },
    { id: "B", x: 340, y: 55, color: "grey" },
    { id: "C", x: 220, y: 140, color: "grey" },
    { id: "D", x: 460, y: 70, color: "white" },
    { id: "E", x: 340, y: 145, color: "white" },
    { id: "F", x: 460, y: 150, color: "white" },
  ];
  const edges = [
    ["R", "A"], ["A", "B"], ["A", "C"], ["B", "D"], ["C", "E"],
  ];
  const objMap = {};
  objs.forEach((o) => { objMap[o.id] = o; });

  const colorMap = {
    white: { fill: "rgba(255,255,255,0.9)", stroke: C_WHITE },
    grey: { fill: "rgba(230,126,34,0.15)", stroke: C_GREY },
    black: { fill: "rgba(44,62,80,0.15)", stroke: C_BLACK },
  };

  return (
    <svg className="gogc-svg" viewBox={`0 0 ${SVG_W} 240`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gogc-heading">三色标记 — 标记进行中</text>

      <defs>
        <marker id="gogc-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="rgba(0,0,0,0.25)" />
        </marker>
      </defs>

      {/* 引用边 */}
      {edges.map(([from, to], i) => {
        const f = objMap[from], t = objMap[to];
        return <line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke="rgba(0,0,0,0.15)" strokeWidth={1.5} markerEnd="url(#gogc-arr)" />;
      })}

      {/* 对象节点 */}
      {objs.map((o) => {
        const c = colorMap[o.color];
        const isGrey = o.color === "grey";
        return (
          <g key={o.id}>
            <circle cx={o.x} cy={o.y} r={22} fill={c.fill} stroke={c.stroke} strokeWidth={2} className={isGrey ? "gogc-node--grey" : ""} />
            <text x={o.x} y={o.y + 5} textAnchor="middle" className="gogc-node-label">{o.label || o.id}</text>
          </g>
        );
      })}

      {/* F 孤立 */}
      <text x={460} y={185} textAnchor="middle" className="gogc-hint-small">F 无引用 → 白色 → 垃圾</text>

      {/* 图例 */}
      <text x={SVG_W / 2} y={225} textAnchor="middle" className="gogc-hint">灰色 = 工作队列 · 扫描灰色的子引用 → 子变灰，自身变黑</text>
    </svg>
  );
}

function MarkingScene() {
  const timeline = [
    { label: "STW 1", desc: "扫描栈 Root\n开启写屏障", y: 70, color: C_SWEEP },
    { label: "并发标记", desc: "后台 Mark Worker\n遍历对象图", y: 130, color: C_ROOT },
    { label: "STW 2", desc: "重扫描\n关闭写屏障", y: 190, color: C_SWEEP },
  ];
  return (
    <svg className="gogc-svg" viewBox={`0 0 ${SVG_W} 260`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gogc-heading">并发标记过程</text>

      {/* 左侧时间线 */}
      <line x1={80} y1={55} x2={80} y2={220} stroke="var(--line)" strokeWidth={2} />

      {timeline.map((t, i) => (
        <g key={i} className="gogc-mark-step" style={{ "--gogc-d": `${i * 0.25}s` }}>
          <circle cx={80} cy={t.y} r={8} fill={`${t.color}20`} stroke={t.color} strokeWidth={2} />
          <text x={100} y={t.y - 6} className="gogc-phase-label" fill={t.color}>{t.label}</text>
          {t.desc.split("\n").map((line, li) => (
            <text key={li} x={100} y={t.y + 10 + li * 14} className="gogc-mark-desc">{line}</text>
          ))}
        </g>
      ))}

      {/* 右侧：用户 G 和 Mark G 并行 */}
      <rect x={340} y={50} width={120} height={170} rx={12} fill="rgba(42,111,107,0.04)" stroke={C_ROOT} strokeWidth={1} />
      <text x={400} y={72} textAnchor="middle" className="gogc-phase-label" fill={C_ROOT}>Mark Worker</text>
      <rect x={400 - 40} y={85} width={80} height={20} rx={4} fill="rgba(42,111,107,0.1)" className="gogc-worker-bar" />
      <rect x={400 - 40} y={115} width={80} height={20} rx={4} fill="rgba(42,111,107,0.1)" className="gogc-worker-bar" style={{ "--gogc-d": "0.3s" }} />
      <rect x={400 - 40} y={145} width={80} height={20} rx={4} fill="rgba(42,111,107,0.1)" className="gogc-worker-bar" style={{ "--gogc-d": "0.6s" }} />

      <rect x={490} y={50} width={120} height={170} rx={12} fill="rgba(76,120,168,0.04)" stroke={C_WHITE} strokeWidth={1} />
      <text x={550} y={72} textAnchor="middle" className="gogc-phase-label" fill="#4c78a8">User Goroutine</text>
      <rect x={550 - 40} y={85} width={80} height={120} rx={4} fill="rgba(76,120,168,0.06)" />
      <text x={550} y={150} textAnchor="middle" className="gogc-hint-small">正常执行</text>

      <text x={SVG_W / 2} y={248} textAnchor="middle" className="gogc-hint">两次短暂 STW + 并发标记 → 极低延迟</text>
    </svg>
  );
}

function WriteBarrierScene() {
  return (
    <svg className="gogc-svg" viewBox={`0 0 ${SVG_W} 280`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gogc-heading">混合写屏障 (Go 1.8+)</text>

      {/* 问题场景 */}
      <text x={160} y={56} textAnchor="middle" className="gogc-section-label">问题：漏标</text>
      <rect x={40} y={66} width={240} height={100} rx={12} fill="rgba(231,76,60,0.04)" stroke={C_SWEEP} strokeWidth={1} strokeDasharray="4 2" />

      {/* 黑 A → 白 C (新引用) */}
      <circle cx={90} cy={110} r={18} fill="rgba(44,62,80,0.15)" stroke={C_BLACK} strokeWidth={2} />
      <text x={90} y={114} textAnchor="middle" className="gogc-node-label">A(黑)</text>
      <circle cx={220} cy={110} r={18} fill="rgba(255,255,255,0.9)" stroke={C_WHITE} strokeWidth={2} />
      <text x={220} y={114} textAnchor="middle" className="gogc-node-label">C(白)</text>
      <line x1={108} y1={110} x2={200} y2={110} stroke={C_SWEEP} strokeWidth={2} markerEnd="url(#gogc-arr-r)" />
      <text x={155} y={102} textAnchor="middle" className="gogc-label" fill={C_SWEEP}>新引用</text>

      {/* 解决方案 */}
      <text x={470} y={56} textAnchor="middle" className="gogc-section-label">解决：写屏障</text>
      <rect x={350} y={66} width={260} height={100} rx={12} fill="rgba(140,80,180,0.04)" stroke={C_WB} strokeWidth={1} />

      <circle cx={400} cy={110} r={18} fill="rgba(44,62,80,0.15)" stroke={C_BLACK} strokeWidth={2} />
      <text x={400} y={114} textAnchor="middle" className="gogc-node-label">A(黑)</text>
      <circle cx={540} cy={110} r={18} fill="rgba(230,126,34,0.15)" stroke={C_GREY} strokeWidth={2} className="gogc-node--grey" />
      <text x={540} y={114} textAnchor="middle" className="gogc-node-label">C(灰)</text>
      <line x1={418} y1={110} x2={520} y2={110} stroke={C_WB} strokeWidth={2} markerEnd="url(#gogc-arr-wb)" />
      <text x={470} y={102} textAnchor="middle" className="gogc-label" fill={C_WB}>标灰保护</text>

      {/* 混合屏障说明 */}
      <rect x={60} y={195} width={520} height={60} rx={12} fill="rgba(140,80,180,0.04)" stroke={C_WB} strokeWidth={1} />
      <text x={320} y={218} textAnchor="middle" className="gogc-phase-label" fill={C_WB}>混合写屏障 = 插入屏障 + 删除屏障</text>
      <text x={320} y={238} textAnchor="middle" className="gogc-hint-small">栈上对象默认黑色，无需重扫 → STW 时间从 ms 级降到 μs 级</text>

      <defs>
        <marker id="gogc-arr-r" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={C_SWEEP} /></marker>
        <marker id="gogc-arr-wb" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={C_WB} /></marker>
      </defs>
    </svg>
  );
}

function SweepScene() {
  const objs = [
    { id: "A", x: 80, y: 90, alive: true },
    { id: "B", x: 200, y: 85, alive: true },
    { id: "C", x: 320, y: 90, alive: false },
    { id: "D", x: 440, y: 85, alive: true },
    { id: "E", x: 160, y: 160, alive: false },
    { id: "F", x: 380, y: 160, alive: false },
  ];
  return (
    <svg className="gogc-svg" viewBox={`0 0 ${SVG_W} 260`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gogc-heading">并发清除 — 回收白色对象</text>

      {/* 堆区域 */}
      <rect x={30} y={50} width={580} height={140} rx={14} fill="rgba(0,0,0,0.015)" stroke="var(--line)" strokeWidth={1} />
      <text x={SVG_W / 2} y={68} textAnchor="middle" className="gogc-heap-label">Heap</text>

      {objs.map((o) => (
        <g key={o.id}>
          <circle
            cx={o.x} cy={o.y} r={22}
            fill={o.alive ? "rgba(44,62,80,0.12)" : "rgba(255,255,255,0.9)"}
            stroke={o.alive ? C_BLACK : C_WHITE}
            strokeWidth={2}
            strokeDasharray={o.alive ? "none" : "4 2"}
            className={!o.alive ? "gogc-node--swept" : ""}
          />
          <text x={o.x} y={o.y + 5} textAnchor="middle" className={`gogc-node-label ${!o.alive ? "gogc-node-label--dead" : ""}`}>
            {o.id}{o.alive ? "(黑)" : "(白)"}
          </text>
        </g>
      ))}

      {/* 清除进度条 */}
      <rect x={30} y={200} width={580} height={5} rx={2.5} fill="rgba(0,0,0,0.06)" />
      <rect x={30} y={200} width={580} height={5} rx={2.5} className="gogc-sweep-bar" />

      <text x={SVG_W / 2} y={232} textAnchor="middle" className="gogc-hint">白色对象内存归还 mspan → mcentral → mheap</text>
    </svg>
  );
}

function TuningScene() {
  const configs = [
    { label: "GOGC=100", desc: "堆增长 100% 触发 GC（默认）", bar: 50, color: C_ROOT },
    { label: "GOGC=200", desc: "堆增长 200% 触发，GC 频率降低", bar: 75, color: C_GREY },
    { label: "GOGC=50", desc: "堆增长 50% 触发，GC 更频繁", bar: 30, color: C_SWEEP },
    { label: "GOMEMLIMIT", desc: "Go 1.19+ 软内存上限，防止 OOM", bar: 90, color: C_WB },
  ];
  return (
    <svg className="gogc-svg" viewBox={`0 0 ${SVG_W} 280`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gogc-heading">GC 调优 — GOGC & GOMEMLIMIT</text>

      {configs.map((c, i) => {
        const y = 60 + i * 52;
        return (
          <g key={i} className="gogc-tuning-row" style={{ "--gogc-d": `${i * 0.15}s` }}>
            <text x={40} y={y + 14} className="gogc-tuning-label" fill={c.color}>{c.label}</text>
            <text x={40} y={y + 30} className="gogc-tuning-desc">{c.desc}</text>
            <rect x={300} y={y + 4} width={300} height={16} rx={4} fill="rgba(0,0,0,0.04)" />
            <rect x={300} y={y + 4} width={c.bar * 3} height={16} rx={4} fill={`${c.color}30`} stroke={c.color} strokeWidth={1} strokeOpacity={0.4} className="gogc-tuning-bar" />
            <text x={300 + c.bar * 3 + 8} y={y + 16} className="gogc-tuning-pct" fill={c.color}>{c.bar}%</text>
          </g>
        );
      })}

      <text x={SVG_W / 2} y={268} textAnchor="middle" className="gogc-hint">GOGC 控制频率 · GOMEMLIMIT 控制上限 · 两者配合使用</text>
    </svg>
  );
}

const sceneMap = {
  overview: OverviewScene,
  tricolor: TricolorScene,
  marking: MarkingScene,
  writebarrier: WriteBarrierScene,
  sweep: SweepScene,
  tuning: TuningScene,
};

export default function BackendGoGc() {
  return (
    <TopicShell
      eyebrow="Go 运行时"
      title="Go 垃圾回收机制"
      subtitle="并发三色标记清除 + 混合写屏障 — 实现亚毫秒级 GC 停顿。"
      steps={steps}
      panel={[
        { title: "核心算法", detail: "三色标记 + 写屏障 + 并发清除。" },
        { title: "调优手段", detail: "GOGC 控制频率，GOMEMLIMIT 控制上限。" },
      ]}
      principles={principles}
      principlesIntro="从三色标记、写屏障和 GC Pacer 三个角度理解 Go GC。"
      flow={["STW1 开启写屏障", "并发三色标记", "STW2 关闭写屏障", "并发清除白色对象"]}
      diagramClass="gogc-diagram"
      renderDiagram={(step) => {
        const Scene = sceneMap[step.active];
        if (!Scene) return null;
        const pct = ((steps.findIndex((s) => s.id === step.id) + 1) / steps.length) * 100;
        return (
          <div className="gogc-scene">
            <div className="gogc-progress">
              <div className="gogc-progress__fill" style={{ width: `${pct}%` }} />
            </div>
            <Scene />
          </div>
        );
      }}
    />
  );
}
