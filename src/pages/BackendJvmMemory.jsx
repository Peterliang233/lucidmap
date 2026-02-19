import TopicShell from "../components/TopicShell.jsx";

/* ── step data ── */
const steps = [
  {
    id: "overview", title: "JVM 内存全景",
    description: "JVM 运行时内存分为线程共享区和线程私有区。",
    bullets: ["共享：堆（对象实例）、元空间（类元数据）", "私有：虚拟机栈、程序计数器、本地方法栈", "理解全局布局是排查 OOM 的基础"],
    mode: "overview", phase: 0,
  },
  {
    id: "heap-alloc", title: "堆：对象分配到 Eden",
    description: "new 出来的对象优先分配在 Eden 区，Eden 满时触发 Minor GC。",
    bullets: ["new Order() → Eden 区", "Eden 满 → 触发 Minor GC", "复制算法：存活对象复制到 Survivor"],
    mode: "heap", phase: 0,
  },
  {
    id: "heap-survivor", title: "堆：Survivor 交换",
    description: "Minor GC 后存活对象在 S0/S1 间来回复制，年龄 +1。",
    bullets: ["S0 ↔ S1 交替使用", "每次 GC 年龄 +1", "默认 15 次后晋升老年代"],
    mode: "heap", phase: 1,
  },
  {
    id: "heap-old", title: "堆：晋升老年代",
    description: "长期存活或大对象直接进入 Old Gen，Full GC 成本高。",
    bullets: ["Age ≥ 阈值 → Old Gen", "大对象直接进入 Old", "Old 满 → Full GC（STW）"],
    mode: "heap", phase: 2,
  },
  {
    id: "stack-push", title: "栈：方法调用入栈",
    description: "每个方法调用创建一个栈帧，包含局部变量表和操作数栈。",
    bullets: ["main() → pay() → check()", "局部变量: orderId, price", "线程私有，互不干扰"],
    mode: "stack", phase: 0,
  },
  {
    id: "stack-pop", title: "栈：方法返回出栈",
    description: "方法返回时栈帧弹出，局部变量随之释放。",
    bullets: ["check() 返回 → 弹出栈帧", "递归过深 → StackOverflowError", "-Xss 可调整栈深度"],
    mode: "stack", phase: 1,
  },
  {
    id: "meta", title: "元空间：类加载",
    description: "ClassLoader 将 .class 文件加载到 Metaspace（使用本地内存）。",
    bullets: ["存储：常量池、字段、方法元数据", "类卸载后释放空间", "热部署需注意 ClassLoader 泄漏"],
    mode: "meta", phase: 0,
  },
  {
    id: "gc-mark", title: "GC：标记阶段",
    description: "从 GC Roots 出发遍历引用链，标记所有可达对象。",
    bullets: ["STW 暂停所有应用线程", "GC Roots：栈引用、静态变量、JNI", "不可达对象标记为垃圾"],
    mode: "gc", phase: 0,
  },
  {
    id: "gc-sweep", title: "GC：清理与压缩",
    description: "清除垃圾对象，压缩存活对象以减少内存碎片。",
    bullets: ["Mark-Sweep 或 Mark-Compact", "新生代用复制算法效率高", "G1/ZGC 大幅降低 STW 停顿"],
    mode: "gc", phase: 1,
  },
];

const principles = [
  { title: "分代回收", detail: "基于对象存活率分代，新生代高频回收，老年代低频回收。", points: ["Minor GC 用复制算法", "晋升阈值控制老年代增长", "Full GC 成本高需优化避免"] },
  { title: "线程与栈帧", detail: "每次方法调用创建栈帧，返回即释放，线程私有。", points: ["局部变量表 + 操作数栈", "递归过深 → StackOverflow", "栈空间线程私有互不干扰"] },
  { title: "GC 算法", detail: "标记-清除、标记-压缩、复制算法各有适用场景。", points: ["新生代：复制算法", "老年代：标记-压缩", "G1/ZGC 降低 STW 停顿"] },
];

/* ── SVG sub-scenes ── */
function OverviewScene() {
  const shared = [
    { label: "Heap 堆", sub: "Eden / S0 / S1 / Old", x: 30, y: 60, w: 260, h: 80, c: "#2a6f6b" },
    { label: "Metaspace", sub: "类元数据 / 常量池", x: 30, y: 155, w: 260, h: 55, c: "#8c50b4" },
  ];
  const priv = [
    { label: "VM Stack", sub: "栈帧 / 局部变量", x: 340, y: 60, w: 220, h: 50, c: "#4c78a8" },
    { label: "PC Register", sub: "程序计数器", x: 340, y: 122, w: 220, h: 40, c: "#4c78a8" },
    { label: "Native Stack", sub: "本地方法栈", x: 340, y: 174, w: 220, h: 40, c: "#4c78a8" },
  ];
  return (
    <svg className="jvm-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="jvm-heading">JVM 运行时内存结构</text>
      <text x={160} y={48} className="jvm-group-label">线程共享区</text>
      <text x={450} y={48} className="jvm-group-label">线程私有区</text>
      <line x1={310} y1={55} x2={310} y2={220} stroke="rgba(0,0,0,0.08)" strokeWidth={1} strokeDasharray="5 4" />
      {shared.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={10} className="jvm-ov-box" style={{ "--box-c": r.c }} />
          <text x={r.x + r.w / 2} y={r.y + 22} className="jvm-ov-name" fill={r.c}>{r.label}</text>
          <text x={r.x + r.w / 2} y={r.y + 40} className="jvm-ov-sub">{r.sub}</text>
        </g>
      ))}
      {/* Heap internal hints */}
      <g opacity={0.45}>
        <line x1={100} y1={82} x2={100} y2={130} stroke="rgba(42,111,107,0.3)" strokeDasharray="3 2" />
        <line x1={180} y1={82} x2={180} y2={130} stroke="rgba(42,111,107,0.3)" strokeDasharray="3 2" />
        <text x={65} y={125} className="jvm-ov-hint">Eden</text>
        <text x={138} y={125} className="jvm-ov-hint">S0/S1</text>
        <text x={225} y={125} className="jvm-ov-hint">Old</text>
      </g>
      {priv.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={10} className="jvm-ov-box" style={{ "--box-c": r.c }} />
          <text x={r.x + r.w / 2} y={r.y + 20} className="jvm-ov-name" fill={r.c}>{r.label}</text>
          <text x={r.x + r.w / 2} y={r.y + 36} className="jvm-ov-sub">{r.sub}</text>
        </g>
      ))}
      <text x={300} y={245} className="jvm-hint-footer">点击下一步深入各区域 →</text>
    </svg>
  );
}

function HeapScene({ phase }) {
  const edenObjs = [
    { l: "Order", x: 70, y: 100 }, { l: "Item", x: 150, y: 95 }, { l: "User", x: 110, y: 125 },
  ];
  const s0Objs = [{ l: "Order", x: 330, y: 100 }, { l: "User", x: 330, y: 125 }];
  const oldObjs = [{ l: "Order", x: 200, y: 255 }, { l: "History", x: 320, y: 255 }];
  return (
    <svg className="jvm-svg" viewBox="0 0 600 310" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="jvm-heading">Heap 分代结构</text>
      {/* Eden */}
      <rect x={20} y={50} width={240} height={110} rx={12} className="jvm-region jvm-region--eden" />
      <text x={36} y={72} className="jvm-region-label" fill="rgba(42,111,107,0.6)">Eden</text>
      {/* S0 */}
      <rect x={275} y={50} width={100} height={110} rx={12} className="jvm-region jvm-region--s" />
      <text x={291} y={72} className="jvm-region-label" fill="rgba(76,120,168,0.6)">S0</text>
      {/* S1 */}
      <rect x={390} y={50} width={100} height={110} rx={12} className="jvm-region jvm-region--s" />
      <text x={406} y={72} className="jvm-region-label" fill="rgba(76,120,168,0.6)">S1</text>
      {/* Old */}
      <rect x={20} y={185} width={470} height={80} rx={12} className="jvm-region jvm-region--old" />
      <text x={36} y={210} className="jvm-region-label" fill="rgba(210,100,42,0.6)">Old Gen</text>
      {/* Size labels */}
      <text x={510} y={110} className="jvm-size-hint">Young Gen</text>
      <text x={510} y={230} className="jvm-size-hint">Old Gen</text>
      {/* Eden objects */}
      {edenObjs.map((o, i) => (
        <g key={`e${i}`} className={`jvm-obj-g ${phase >= 1 ? "jvm-obj-g--dim" : "jvm-obj-g--active"}`}>
          <rect x={o.x - 28} y={o.y - 12} width={56} height={24} rx={12} className="jvm-obj jvm-obj--eden" />
          <text x={o.x} y={o.y + 4} className="jvm-obj-text">{o.l}</text>
        </g>
      ))}
      {/* New object in Eden for phase 0 */}
      {phase === 0 && (
        <g className="jvm-obj-g--entering">
          <rect x={192} y={113} width={56} height={24} rx={12} className="jvm-obj jvm-obj--eden jvm-obj--new" />
          <text x={220} y={129} className="jvm-obj-text">new()</text>
        </g>
      )}
      {/* Arrow Eden → S0 */}
      {phase >= 1 && (
        <g className="jvm-arrow-g">
          <line x1={250} y1={105} x2={278} y2={105} className="jvm-arrow jvm-arrow--teal" markerEnd="url(#jvm-arr-teal)" />
          <text x={264} y={98} className="jvm-arrow-label" fill="rgba(42,111,107,0.6)">GC</text>
        </g>
      )}
      {/* S0 objects */}
      {phase >= 1 && s0Objs.map((o, i) => (
        <g key={`s${i}`} className="jvm-obj-g--active">
          <rect x={o.x - 28} y={o.y - 12} width={56} height={24} rx={12} className="jvm-obj jvm-obj--surv" />
          <text x={o.x} y={o.y + 4} className="jvm-obj-text">{o.l}</text>
        </g>
      ))}
      {/* Arrow S0 → Old */}
      {phase >= 2 && (
        <g className="jvm-arrow-g">
          <line x1={330} y1={158} x2={330} y2={188} className="jvm-arrow jvm-arrow--orange" markerEnd="url(#jvm-arr-orange)" />
          <text x={345} y={178} className="jvm-arrow-label" fill="rgba(210,100,42,0.6)">晋升</text>
        </g>
      )}
      {/* Old objects */}
      {phase >= 2 && oldObjs.map((o, i) => (
        <g key={`o${i}`} className="jvm-obj-g--active">
          <rect x={o.x - 32} y={o.y - 12} width={64} height={24} rx={12} className="jvm-obj jvm-obj--old" />
          <text x={o.x} y={o.y + 4} className="jvm-obj-text">{o.l}</text>
        </g>
      ))}
      <defs>
        <marker id="jvm-arr-teal" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(42,111,107,0.5)" /></marker>
        <marker id="jvm-arr-orange" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(210,100,42,0.5)" /></marker>
      </defs>
    </svg>
  );
}

function StackScene({ phase }) {
  const allFrames = [
    { n: "main()", v: "String[] args" },
    { n: "pay()", v: "orderId, price" },
    { n: "check()", v: "inventory" },
  ];
  const frames = phase === 0 ? allFrames : allFrames.slice(0, 2);
  const FW = 260, FH = 44, GAP = 8, CX = 300, TOP = 60;
  return (
    <svg className="jvm-svg" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="jvm-heading">Thread Stack — 线程栈</text>
      <text x={300} y={46} className="jvm-sub-heading">每个线程拥有独立的虚拟机栈</text>
      {/* Stack container */}
      <rect x={CX - FW / 2 - 14} y={TOP - 8} width={FW + 28} height={frames.length * (FH + GAP) + 20} rx={14} className="jvm-stack-bg" />
      <text x={CX + FW / 2 + 24} y={TOP + 10} className="jvm-stack-label">栈顶</text>
      <text x={CX + FW / 2 + 24} y={TOP + frames.length * (FH + GAP) - 4} className="jvm-stack-label">栈底</text>
      {frames.map((f, i) => {
        const y = TOP + i * (FH + GAP);
        const isTop = i === frames.length - 1 && phase === 0;
        return (
          <g key={i}>
            <rect x={CX - FW / 2} y={y} width={FW} height={FH} rx={8} className={`jvm-frame ${isTop ? "jvm-frame--top" : ""}`} />
            <text x={CX - FW / 2 + 14} y={y + 27} className="jvm-frame-name">{f.n}</text>
            <text x={CX + FW / 2 - 14} y={y + 27} className="jvm-frame-vars">{f.v}</text>
          </g>
        );
      })}
      {phase === 1 && (
        <g className="jvm-pop-hint">
          <text x={300} y={TOP + frames.length * (FH + GAP) + 30} className="jvm-pop-label">check() 已返回，栈帧弹出 ↑</text>
        </g>
      )}
    </svg>
  );
}

function MetaScene() {
  const classes = ["OrderService", "Inventory", "Payment", "UserDAO"];
  return (
    <svg className="jvm-svg" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="jvm-heading">Metaspace — 元空间（本地内存）</text>
      {/* ClassLoader box */}
      <rect x={40} y={60} width={160} height={50} rx={12} className="jvm-meta-loader" />
      <text x={120} y={82} className="jvm-meta-loader-text">AppClassLoader</text>
      <text x={120} y={98} className="jvm-meta-loader-sub">加载 .class 文件</text>
      {/* Arrow */}
      <line x1={200} y1={85} x2={260} y2={85} className="jvm-arrow jvm-arrow--purple" markerEnd="url(#jvm-arr-purple)" strokeDasharray="6 3" />
      <text x={230} y={78} className="jvm-arrow-label" fill="rgba(140,80,180,0.6)">load</text>
      {/* Class metadata cards */}
      {classes.map((c, i) => (
        <g key={c}>
          <rect x={270} y={50 + i * 48} width={280} height={38} rx={8} className="jvm-meta-card" style={{ "--meta-i": i }} />
          <text x={290} y={74 + i * 48} className="jvm-meta-name">{c}.class</text>
          <text x={530} y={74 + i * 48} className="jvm-meta-detail">常量池 + 字段 + 方法</text>
        </g>
      ))}
      <defs>
        <marker id="jvm-arr-purple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(140,80,180,0.5)" /></marker>
      </defs>
    </svg>
  );
}

function GcScene({ phase }) {
  const objs = [
    { l: "A", x: 80, y: 100, alive: true },
    { l: "B", x: 180, y: 90, alive: true },
    { l: "C", x: 280, y: 105, alive: false },
    { l: "D", x: 130, y: 150, alive: false },
    { l: "E", x: 230, y: 145, alive: true },
    { l: "F", x: 380, y: 120, alive: false },
  ];
  const roots = [
    { from: { x: 460, y: 60 }, to: { x: 80, y: 100 } },
    { from: { x: 460, y: 60 }, to: { x: 180, y: 90 } },
    { from: { x: 460, y: 60 }, to: { x: 230, y: 145 } },
  ];
  // Reference chains between alive objects
  const refs = [
    { from: { x: 80, y: 100 }, to: { x: 180, y: 90 } },
    { from: { x: 180, y: 90 }, to: { x: 230, y: 145 } },
  ];
  return (
    <svg className="jvm-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="jvm-heading">{phase === 0 ? "GC 标记阶段（Stop-The-World）" : "GC 清理与压缩"}</text>
      {/* Heap boundary */}
      <rect x={30} y={50} width={430} height={140} rx={14} className="jvm-gc-heap" />
      <text x={245} y={68} className="jvm-gc-heap-label">Heap</text>
      {/* GC Roots */}
      {phase === 0 && (
        <g>
          <rect x={480} y={42} width={90} height={32} rx={8} className="jvm-gc-roots-box" />
          <text x={525} y={63} className="jvm-gc-roots-text">GC Roots</text>
          {roots.map((r, i) => (
            <line key={i} x1={r.from.x} y1={r.from.y} x2={r.to.x} y2={r.to.y} className="jvm-gc-root-line" strokeDasharray="5 3" />
          ))}
          {refs.map((r, i) => (
            <line key={`ref${i}`} x1={r.from.x} y1={r.from.y} x2={r.to.x} y2={r.to.y} className="jvm-gc-ref-line" />
          ))}
        </g>
      )}
      {/* Objects */}
      {objs.map((o, i) => {
        const swept = phase === 1 && !o.alive;
        const marking = phase === 0 && o.alive;
        return (
          <g key={i}>
            <circle cx={o.x} cy={o.y} r={22} className={`jvm-gc-node ${o.alive ? "jvm-gc-node--alive" : "jvm-gc-node--dead"} ${swept ? "jvm-gc-node--swept" : ""} ${marking ? "jvm-gc-node--marking" : ""}`} />
            <text x={o.x} y={o.y + 5} className={`jvm-gc-label ${swept ? "jvm-gc-label--swept" : ""}`}>{o.l}</text>
          </g>
        );
      })}
      {/* Sweep progress bar */}
      {phase === 1 && (
        <g>
          <rect x={30} y={200} width={430} height={5} rx={2.5} fill="rgba(0,0,0,0.06)" />
          <rect x={30} y={200} width={430} height={5} rx={2.5} className="jvm-gc-sweep-bar" />
          <text x={245} y={225} className="jvm-gc-sweep-text">清理不可达对象，压缩存活对象</text>
        </g>
      )}
    </svg>
  );
}

/* ── Phase indicator bar ── */
function PhaseBar({ mode, phase, labels, color }) {
  return (
    <div className={`jvm-phase-bar jvm-phase-bar--${mode}`} style={{ "--phase-c": color }}>
      <span className="jvm-phase-bar__tag">{mode === "heap" ? "堆" : mode === "stack" ? "栈" : mode === "meta" ? "元空间" : mode === "gc" ? "GC" : "总览"}</span>
      <div className="jvm-phase-bar__steps">
        {labels.map((t, i) => (
          <span key={i} className={`jvm-phase-bar__step ${i === phase ? "is-active" : ""} ${i < phase ? "is-past" : ""}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function BackendJvmMemory() {
  const phaseLabels = {
    heap: ["分配 Eden", "GC → Survivor", "晋升 Old"],
    stack: ["调用链入栈", "返回出栈"],
    meta: ["ClassLoader → 类元数据"],
    gc: ["标记可达", "清理垃圾"],
  };
  const phaseColors = {
    overview: "#2a6f6b",
    heap: "#2a6f6b",
    stack: "#4c78a8",
    meta: "#8c50b4",
    gc: "#d2642a",
  };

  return (
    <TopicShell
      eyebrow="后端基础动画"
      title="JVM 内存结构"
      subtitle="堆分代、栈帧与 GC 过程的可视化。"
      steps={steps}
      panel={[
        { title: "关键组件", detail: "堆（Eden / Survivor / Old）、栈、元空间。" },
        { title: "问题定位", detail: "OOM、GC 频繁、内存泄漏排查。" },
      ]}
      principles={principles}
      principlesIntro="结合分代回收、栈帧与 GC 算法，理解 JVM 内存管理全貌。"
      flow={["对象 Eden → Survivor → Old", "方法调用形成栈帧", "GC 标记存活并清理"]}
      diagramClass="jvm-diagram"
      renderDiagram={(step) => {
        const { mode, phase } = step;
        const pct = ((steps.findIndex(s => s.id === step.id) + 1) / steps.length) * 100;
        return (
          <div className="jvm-scene">
            {/* Progress bar */}
            <div className="jvm-progress">
              <div className="jvm-progress__fill" style={{ width: `${pct}%` }} />
            </div>
            {/* SVG scene */}
            {mode === "overview" && <OverviewScene />}
            {mode === "heap" && <HeapScene phase={phase} />}
            {mode === "stack" && <StackScene phase={phase} />}
            {mode === "meta" && <MetaScene />}
            {mode === "gc" && <GcScene phase={phase} />}
            {/* Phase bar */}
            {mode !== "overview" && (
              <PhaseBar mode={mode} phase={phase} labels={phaseLabels[mode]} color={phaseColors[mode]} />
            )}
          </div>
        );
      }}
    />
  );
}
