import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "heap-alloc", title: "堆：对象分配到 Eden",
    description: "new 出来的对象分配在 Eden 区，Eden 满时触发 Minor GC。",
    bullets: ["new Order() → Eden", "Eden 满 → Minor GC", "复制算法：存活对象复制到 Survivor"],
    active: "heap", phase: 0,
  },
  {
    id: "heap-survivor", title: "堆：Survivor 交换",
    description: "Minor GC 后存活对象在 S0/S1 间复制，年龄+1。",
    bullets: ["S0 ↔ S1 交替使用", "每次 GC 年龄+1", "默认 15 次后晋升"],
    active: "heap", phase: 1,
  },
  {
    id: "heap-old", title: "堆：晋升老年代",
    description: "长期存活或大对象直接进入 Old Gen，Full GC 成本高。",
    bullets: ["Age ≥ 阈值 → Old", "大对象直接 Old", "Old 满 → Full GC (STW)"],
    active: "heap", phase: 2,
  },
  {
    id: "stack-push", title: "栈：方法调用入栈",
    description: "每个方法调用创建栈帧，包含局部变量表和操作数栈。",
    bullets: ["main() → pay() → check()", "局部变量: orderId, price", "线程私有，互不干扰"],
    active: "stack", phase: 0,
  },
  {
    id: "stack-pop", title: "栈：方法返回出栈",
    description: "方法返回时栈帧弹出，局部变量随之释放。",
    bullets: ["check() 返回 → pop", "递归过深 → StackOverflow", "栈深度可通过 -Xss 调整"],
    active: "stack", phase: 1,
  },
  {
    id: "meta", title: "元空间：类加载",
    description: "ClassLoader 将 .class 文件加载到 Metaspace（本地内存）。",
    bullets: ["常量池、字段、方法元数据", "类卸载后释放", "热部署需注意类泄漏"],
    active: "meta", phase: 0,
  },
  {
    id: "gc-mark", title: "GC：标记阶段",
    description: "从 GC Roots 出发遍历引用链，标记所有可达对象。",
    bullets: ["STW 暂停所有线程", "GC Roots: 栈引用、静态变量", "不可达 → 标记为垃圾"],
    active: "gc", phase: 0,
  },
  {
    id: "gc-sweep", title: "GC：清理与压缩",
    description: "清除垃圾对象，压缩存活对象减少碎片。",
    bullets: ["Mark-Sweep 或 Mark-Compact", "新生代用复制算法", "G1/ZGC 降低 STW"],
    active: "gc", phase: 1,
  },
];

// Heap SVG layout
const heapObjs = [
  // phase 0: all in Eden
  [{ l: "Order", x: 60, y: 68 }, { l: "Item", x: 130, y: 62 }, { l: "User", x: 95, y: 82 }],
  // phase 1: GC moved to S0
  [{ l: "New", x: 60, y: 68 }, { l: "Order", x: 218, y: 62 }, { l: "User", x: 218, y: 82 }],
  // phase 2: promoted to Old
  [{ l: "New", x: 60, y: 68 }, { l: "Order", x: 290, y: 62 }, { l: "User", x: 80, y: 138 }, { l: "History", x: 200, y: 138 }],
];

// Stack frames
const stackData = [
  [{ n: "main()", v: "args" }, { n: "pay()", v: "orderId" }, { n: "check()", v: "inventory" }],
  [{ n: "main()", v: "args" }, { n: "pay()", v: "orderId" }],
];

// GC objects
const gcObjs = [
  { l: "A", x: 55, y: 62, alive: true }, { l: "B", x: 125, y: 56, alive: true },
  { l: "C", x: 195, y: 66, alive: false }, { l: "D", x: 85, y: 90, alive: false },
  { l: "E", x: 160, y: 92, alive: true }, { l: "F", x: 250, y: 80, alive: false },
];

const metaClasses = ["OrderService", "Inventory", "Payment", "UserDAO"];

const principles = [
  { title: "分代回收", detail: "新生代高频回收，老年代低频回收。", points: ["Minor GC 复制存活对象", "晋升阈值决定老年代", "Full GC 成本高，需优化"] },
  { title: "线程与栈帧", detail: "每次方法调用创建栈帧，返回即释放。", points: ["局部变量表 + 操作数栈", "递归过深 → StackOverflow", "栈空间线程私有"] },
  { title: "GC 算法", detail: "标记-清除、标记-压缩、复制算法各有适用场景。", points: ["新生代用复制算法", "老年代用标记-压缩", "G1/ZGC 降低 STW 停顿"] },
];

export default function BackendJvmMemory() {
  return (
    <TopicShell
      eyebrow="后端基础动画"
      title="JVM 内存结构"
      subtitle="堆分代、栈帧与 GC 过程的可视化。"
      steps={steps}
      panel={[
        { title: "关键组件", detail: "堆（Eden/Survivor/Old）、栈、元空间。" },
        { title: "问题定位", detail: "OOM、GC 频繁、内存泄漏。" },
      ]}
      principles={principles}
      principlesIntro="结合分代回收、栈帧与 GC 算法，理解 JVM 内存管理。"
      flow={["对象 Eden → Survivor → Old", "方法调用形成栈帧", "GC 标记存活并清理"]}
      diagramClass="jvm-diagram"
      renderDiagram={(step) => {
        const mode = step.active;
        const phase = step.phase;

        if (mode === "heap") {
          const objs = heapObjs[phase];
          return (
            <div className="jvm-scene">
              <svg className="jvm-svg" viewBox="0 0 340 180" preserveAspectRatio="xMidYMid meet">
                <text x={170} y={16} className="jvm-title">Heap 分代结构</text>
                {/* Eden */}
                <rect x={20} y={30} width={160} height={70} rx={10} className="jvm-region jvm-region--eden" />
                <text x={28} y={44} className="jvm-region-label jvm-rl--eden">Eden</text>
                {/* S0 */}
                <rect x={190} y={30} width={65} height={70} rx={10} className="jvm-region jvm-region--s" />
                <text x={198} y={44} className="jvm-region-label jvm-rl--s">S0</text>
                {/* S1 */}
                <rect x={265} y={30} width={65} height={70} rx={10} className="jvm-region jvm-region--s" />
                <text x={273} y={44} className="jvm-region-label jvm-rl--s">S1</text>
                {/* Old */}
                <rect x={20} y={110} width={310} height={50} rx={10} className="jvm-region jvm-region--old" />
                <text x={28} y={126} className="jvm-region-label jvm-rl--old">Old Gen</text>

                {/* Promotion arrows */}
                {phase >= 1 && <line x1={170} y1={70} x2={192} y2={70} className="jvm-arr jvm-arr--teal" markerEnd="url(#jvm-a1)" />}
                {phase >= 2 && <line x1={220} y1={100} x2={220} y2={112} className="jvm-arr jvm-arr--orange" markerEnd="url(#jvm-a2)" />}

                {/* Objects */}
                {objs.map((o, i) => (
                  <g key={i}>
                    <rect x={o.x - 24} y={o.y - 10} width={48} height={20} rx={10} className={`jvm-obj ${o.y > 120 ? "jvm-obj--old" : ""}`} />
                    <text x={o.x} y={o.y + 4} className="jvm-obj-text">{o.l}</text>
                  </g>
                ))}

                <defs>
                  <marker id="jvm-a1" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="rgba(42,111,107,0.6)" /></marker>
                  <marker id="jvm-a2" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="rgba(210,100,42,0.6)" /></marker>
                </defs>
              </svg>
              <div className="jvm-ds jvm-ds--heap">
                <span className="jvm-ds__label">阶段</span>
                <div className="jvm-ds__items">
                  {["分配 Eden", "GC → Survivor", "晋升 Old"].map((t, i) => (
                    <span key={i} className={`jvm-ds__step ${i === phase ? "jvm-ds__step--active" : ""} ${i < phase ? "jvm-ds__step--past" : ""}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "stack") {
          const frames = stackData[phase];
          const FW = 200, FH = 32, FGAP = 6, SX = 170, SY = 28;
          return (
            <div className="jvm-scene">
              <svg className="jvm-svg" viewBox="0 0 340 170" preserveAspectRatio="xMidYMid meet">
                <text x={170} y={16} className="jvm-title">Thread Stack</text>
                <rect x={SX - FW / 2 - 8} y={SY} width={FW + 16} height={frames.length * (FH + FGAP) + 12} rx={10} className="jvm-stack-bg" />
                {frames.map((f, i) => {
                  const y = SY + 6 + (frames.length - 1 - i) * (FH + FGAP);
                  const isTop = i === frames.length - 1;
                  return (
                    <g key={i}>
                      <rect x={SX - FW / 2} y={y} width={FW} height={FH} rx={7} className={`jvm-frame ${isTop ? "jvm-frame--top" : ""}`} />
                      <text x={SX - FW / 2 + 10} y={y + 20} className="jvm-frame-name">{f.n}</text>
                      <text x={SX + FW / 2 - 8} y={y + 20} className="jvm-frame-vars">{f.v}</text>
                    </g>
                  );
                })}
                {phase === 1 && <text x={170} y={SY + frames.length * (FH + FGAP) + 28} className="jvm-pop-label">check() 已返回出栈 ↑</text>}
              </svg>
              <div className="jvm-ds jvm-ds--stack">
                <span className="jvm-ds__label">栈帧</span>
                <div className="jvm-ds__items">
                  {["调用链入栈", "返回出栈"].map((t, i) => (
                    <span key={i} className={`jvm-ds__step ${i === phase ? "jvm-ds__step--active" : ""} ${i < phase ? "jvm-ds__step--past" : ""}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "meta") {
          return (
            <div className="jvm-scene">
              <svg className="jvm-svg" viewBox="0 0 340 170" preserveAspectRatio="xMidYMid meet">
                <text x={170} y={16} className="jvm-title">Metaspace（本地内存）</text>
                <rect x={20} y={32} width={110} height={28} rx={8} className="jvm-meta-loader" />
                <text x={75} y={50} className="jvm-meta-loader-text">AppClassLoader</text>
                <line x1={130} y1={46} x2={155} y2={46} className="jvm-arr jvm-arr--meta" markerEnd="url(#jvm-am)" />
                {metaClasses.map((c, i) => (
                  <g key={c}>
                    <rect x={165} y={28 + i * 32} width={150} height={26} rx={6} className="jvm-meta-class" style={{ "--meta-i": i }} />
                    <text x={240} y={45 + i * 32} className="jvm-meta-text">{c}.class</text>
                  </g>
                ))}
                <defs>
                  <marker id="jvm-am" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="rgba(140,80,180,0.6)" /></marker>
                </defs>
              </svg>
              <div className="jvm-ds jvm-ds--meta">
                <span className="jvm-ds__label">元空间</span>
                <div className="jvm-ds__items">
                  <span className="jvm-ds__step jvm-ds__step--active">ClassLoader → 类元数据</span>
                </div>
              </div>
            </div>
          );
        }

        if (mode === "gc") {
          return (
            <div className="jvm-scene">
              <svg className="jvm-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
                <text x={170} y={16} className="jvm-title">{phase === 0 ? "GC 标记阶段（STW）" : "GC 清理阶段"}</text>
                <rect x={20} y={30} width={300} height={90} rx={12} className="jvm-gc-heap" />
                {gcObjs.map((o, i) => {
                  const swept = phase === 1 && !o.alive;
                  return (
                    <g key={i}>
                      <circle cx={o.x} cy={o.y} r={16} className={`jvm-gc-node ${o.alive ? "jvm-gc-node--alive" : "jvm-gc-node--dead"} ${swept ? "jvm-gc-node--swept" : ""} ${phase === 0 && o.alive ? "jvm-gc-node--marking" : ""}`} />
                      <text x={o.x} y={o.y + 4} className={`jvm-gc-text ${swept ? "jvm-gc-text--swept" : ""}`}>{o.l}</text>
                    </g>
                  );
                })}
                {phase === 0 && <>
                  <text x={290} y={42} className="jvm-gc-roots">Roots</text>
                  <line x1={285} y1={46} x2={195} y2={62} className="jvm-arr jvm-arr--gc" strokeDasharray="4 3" />
                </>}
                {phase === 1 && (
                  <rect x={20} y={122} width={300} height={4} rx={2} className="jvm-gc-bar">
                    <animate attributeName="width" values="0;300" dur="2s" repeatCount="indefinite" />
                  </rect>
                )}
              </svg>
              <div className="jvm-ds jvm-ds--gc">
                <span className="jvm-ds__label">GC</span>
                <div className="jvm-ds__items">
                  {["标记可达", "清理垃圾"].map((t, i) => (
                    <span key={i} className={`jvm-ds__step ${i === phase ? "jvm-ds__step--active" : ""} ${i < phase ? "jvm-ds__step--past" : ""}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        return null;
      }}
    />
  );
}
