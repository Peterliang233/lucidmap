import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "overview",
    title: "GMP 全景",
    description: "Go 调度器由 G（Goroutine）、M（Machine/OS线程）、P（Processor/逻辑处理器）三部分组成。",
    bullets: ["G：轻量协程，初始栈仅 2KB", "M：操作系统线程，执行 G 的载体", "P：逻辑处理器，持有本地队列，默认等于 CPU 核数"],
    active: "overview",
  },
  {
    id: "g-create",
    title: "创建 Goroutine",
    description: "go func() 创建一个 G，优先放入当前 P 的本地队列。",
    bullets: ["go func() → 创建 G 结构体", "优先入当前 P 的 Local Queue", "本地队列满(256) → 半数移入全局队列"],
    active: "g-create",
  },
  {
    id: "bindmp",
    title: "M 绑定 P 执行",
    description: "M 必须绑定一个 P 才能执行 G，从 P 的本地队列取 G 运行。",
    bullets: ["M 从 P.localQueue 取 G 执行", "无空闲 P 时 M 休眠(spinning)", "runtime.GOMAXPROCS 控制 P 数量"],
    active: "bindmp",
  },
  {
    id: "steal",
    title: "Work Stealing",
    description: "当 P 本地队列为空时，从其他 P 偷取一半 G 来执行。",
    bullets: ["本地队列空 → 尝试偷取其他 P 的一半 G", "偷取失败 → 从全局队列获取", "全局也空 → 检查 netpoll"],
    active: "steal",
  },
  {
    id: "syscall",
    title: "系统调用 Hand Off",
    description: "G 进入系统调用时，M 与 P 解绑，P 转交给其他 M 继续执行。",
    bullets: ["G 阻塞在 syscall → M 与 P 解绑", "P 寻找空闲 M 或创建新 M", "syscall 返回后 G 重新排队"],
    active: "syscall",
  },
  {
    id: "preempt",
    title: "抢占式调度",
    description: "Go 1.14+ 基于信号的异步抢占，防止 G 长时间占用 M。",
    bullets: ["sysmon 监控超过 10ms 的 G", "发送 SIGURG 信号触发抢占", "G 在安全点暂停，让出 M"],
    active: "preempt",
  },
];

const principles = [
  {
    title: "为什么需要 P",
    detail: "P 是 G 和 M 之间的中间层，解耦了协程与线程的绑定关系。",
    points: ["本地队列减少全局锁竞争", "Work Stealing 实现负载均衡", "syscall 时 P 可转交，不浪费 CPU"],
  },
  {
    title: "调度时机",
    detail: "Go 调度器在多个时机触发调度切换。",
    points: ["go 关键字创建新 G", "GC、系统调用、channel 操作", "sysmon 抢占超时 G"],
  },
  {
    title: "性能调优",
    detail: "合理设置 GOMAXPROCS 和控制 Goroutine 数量。",
    points: ["GOMAXPROCS 默认 = CPU 核数", "过多 G 导致调度开销增大", "用 worker pool 控制并发度"],
  },
];

/* ── SVG 常量 ── */
const SVG_W = 640;

/* 颜色 */
const C_G = "#2a6f6b";
const C_M = "#4c78a8";
const C_P = "#d2642a";
const C_GQ = "#8c50b4";

function OverviewScene() {
  return (
    <svg className="gmp-svg" viewBox={`0 0 ${SVG_W} 300`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gmp-heading">Go GMP 调度模型</text>

      {/* G */}
      <rect x={40} y={60} width={160} height={70} rx={14} className="gmp-box gmp-box--g" />
      <text x={120} y={88} textAnchor="middle" className="gmp-box__title" fill={C_G}>G — Goroutine</text>
      <text x={120} y={108} textAnchor="middle" className="gmp-box__sub">轻量协程 · 初始栈 2KB</text>

      {/* M */}
      <rect x={240} y={60} width={160} height={70} rx={14} className="gmp-box gmp-box--m" />
      <text x={320} y={88} textAnchor="middle" className="gmp-box__title" fill={C_M}>M — Machine</text>
      <text x={320} y={108} textAnchor="middle" className="gmp-box__sub">OS 线程 · 执行载体</text>

      {/* P */}
      <rect x={440} y={60} width={160} height={70} rx={14} className="gmp-box gmp-box--p" />
      <text x={520} y={88} textAnchor="middle" className="gmp-box__title" fill={C_P}>P — Processor</text>
      <text x={520} y={108} textAnchor="middle" className="gmp-box__sub">逻辑处理器 · 本地队列</text>

      {/* 关系箭头 */}
      <defs>
        <marker id="gmp-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="rgba(0,0,0,0.3)" />
        </marker>
      </defs>

      {/* G → P */}
      <line x1={200} y1={95} x2={238} y2={95} stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} markerEnd="url(#gmp-arr)" />
      {/* P → M */}
      <line x1={400} y1={95} x2={438} y2={95} stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} markerEnd="url(#gmp-arr)" />

      {/* 全局队列 */}
      <rect x={180} y={180} width={280} height={50} rx={12} className="gmp-box gmp-box--gq" />
      <text x={320} y={205} textAnchor="middle" className="gmp-box__title" fill={C_GQ}>Global Queue</text>
      <text x={320} y={220} textAnchor="middle" className="gmp-box__sub">全局 G 队列（需加锁）</text>

      {/* 说明 */}
      <text x={SVG_W / 2} y={270} textAnchor="middle" className="gmp-hint">M 必须绑定 P 才能执行 G · P 数量 = GOMAXPROCS</text>
    </svg>
  );
}

function GCreateScene() {
  const queueG = ["G1", "G2", "G3", "G4"];
  return (
    <svg className="gmp-svg" viewBox={`0 0 ${SVG_W} 280`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gmp-heading">go func() → 创建 Goroutine</text>

      {/* P 框 */}
      <rect x={60} y={55} width={200} height={180} rx={14} className="gmp-box gmp-box--p" />
      <text x={160} y={78} textAnchor="middle" className="gmp-box__title" fill={C_P}>P0</text>
      <text x={160} y={94} textAnchor="middle" className="gmp-box__sub">Local Queue</text>

      {/* 队列中的 G */}
      {queueG.map((g, i) => (
        <g key={g} style={{ "--gmp-d": `${i * 0.15}s` }} className="gmp-g-enter">
          <rect x={80} y={108 + i * 28} width={160} height={22} rx={6} fill={`rgba(42,111,107,${0.06 + i * 0.03})`} stroke={C_G} strokeWidth={1} strokeOpacity={0.3} />
          <text x={160} y={123 + i * 28} textAnchor="middle" className="gmp-q-text">{g}</text>
        </g>
      ))}

      {/* 新 G 进入 */}
      <g className="gmp-new-g">
        <rect x={340} y={100} width={100} height={36} rx={10} fill="rgba(42,111,107,0.08)" stroke={C_G} strokeWidth={1.5} />
        <text x={390} y={123} textAnchor="middle" className="gmp-box__title" fill={C_G}>G5 (new)</text>
      </g>
      <line x1={340} y1={118} x2={262} y2={118} stroke={C_G} strokeWidth={1.5} strokeDasharray="6 3" markerEnd="url(#gmp-arr-g)" />
      <text x={300} y={112} textAnchor="middle" className="gmp-label" fill={C_G}>入队</text>

      {/* 全局队列 */}
      <rect x={340} y={180} width={240} height={50} rx={12} className="gmp-box gmp-box--gq" />
      <text x={460} y={205} textAnchor="middle" className="gmp-box__title" fill={C_GQ}>Global Queue</text>
      <text x={460} y={220} textAnchor="middle" className="gmp-box__sub">本地满 → 半数移入全局</text>

      <defs>
        <marker id="gmp-arr-g" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill={C_G} />
        </marker>
      </defs>
    </svg>
  );
}

function BindScene() {
  return (
    <svg className="gmp-svg" viewBox={`0 0 ${SVG_W} 260`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gmp-heading">M 绑定 P 执行 G</text>

      {/* M */}
      <rect x={40} y={60} width={120} height={50} rx={12} className="gmp-box gmp-box--m" />
      <text x={100} y={85} textAnchor="middle" className="gmp-box__title" fill={C_M}>M0</text>
      <text x={100} y={100} textAnchor="middle" className="gmp-box__sub">OS Thread</text>

      {/* 绑定线 */}
      <line x1={160} y1={85} x2={220} y2={85} stroke={C_P} strokeWidth={2} markerEnd="url(#gmp-arr-p)" className="gmp-bind-line" />
      <text x={190} y={78} textAnchor="middle" className="gmp-label" fill={C_P}>bind</text>

      {/* P */}
      <rect x={220} y={55} width={180} height={160} rx={14} className="gmp-box gmp-box--p" />
      <text x={310} y={78} textAnchor="middle" className="gmp-box__title" fill={C_P}>P0</text>

      {/* P 内的 G 队列 */}
      {["G1", "G2", "G3"].map((g, i) => (
        <g key={g}>
          <rect x={240} y={92 + i * 28} width={140} height={22} rx={6} fill={i === 0 ? "rgba(42,111,107,0.15)" : "rgba(42,111,107,0.05)"} stroke={C_G} strokeWidth={1} strokeOpacity={i === 0 ? 0.6 : 0.2} />
          <text x={310} y={107 + i * 28} textAnchor="middle" className="gmp-q-text">{g}{i === 0 ? " ← running" : ""}</text>
        </g>
      ))}

      {/* 正在执行的 G */}
      <rect x={460} y={60} width={140} height={50} rx={12} fill="rgba(42,111,107,0.08)" stroke={C_G} strokeWidth={1.5} className="gmp-running" />
      <text x={530} y={82} textAnchor="middle" className="gmp-box__title" fill={C_G}>G1 running</text>
      <text x={530} y={98} textAnchor="middle" className="gmp-box__sub">user code</text>

      <line x1={400} y1={103} x2={458} y2={85} stroke={C_G} strokeWidth={1.5} strokeDasharray="5 3" markerEnd="url(#gmp-arr-g2)" />

      <text x={SVG_W / 2} y={245} textAnchor="middle" className="gmp-hint">M 从 P 的本地队列头部取 G 执行</text>

      <defs>
        <marker id="gmp-arr-p" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={C_P} /></marker>
        <marker id="gmp-arr-g2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={C_G} /></marker>
      </defs>
    </svg>
  );
}

function StealScene() {
  return (
    <svg className="gmp-svg" viewBox={`0 0 ${SVG_W} 280`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gmp-heading">Work Stealing — 工作窃取</text>

      {/* P0 空 */}
      <rect x={40} y={60} width={160} height={120} rx={14} className="gmp-box gmp-box--p" />
      <text x={120} y={82} textAnchor="middle" className="gmp-box__title" fill={C_P}>P0 (空闲)</text>
      <rect x={60} y={96} width={120} height={28} rx={6} fill="rgba(0,0,0,0.03)" stroke="var(--line)" strokeWidth={1} strokeDasharray="4 2" />
      <text x={120} y={114} textAnchor="middle" className="gmp-empty-text">empty</text>

      {/* P1 有任务 */}
      <rect x={340} y={60} width={160} height={120} rx={14} className="gmp-box gmp-box--p" />
      <text x={420} y={82} textAnchor="middle" className="gmp-box__title" fill={C_P}>P1 (繁忙)</text>
      {["G5", "G6", "G7", "G8"].map((g, i) => (
        <g key={g}>
          <rect x={355} y={92 + i * 22} width={130} height={18} rx={5} fill={i >= 2 ? "rgba(42,111,107,0.12)" : "rgba(42,111,107,0.05)"} stroke={C_G} strokeWidth={1} strokeOpacity={i >= 2 ? 0.5 : 0.2} />
          <text x={420} y={105 + i * 22} textAnchor="middle" className="gmp-q-text" style={{ fontSize: "9px" }}>{g}</text>
        </g>
      ))}

      {/* 偷取箭头 */}
      <path d="M200,120 C260,120 280,120 338,120" fill="none" stroke={C_P} strokeWidth={2} strokeDasharray="8 4" markerEnd="url(#gmp-arr-steal)" className="gmp-steal-arrow" />
      <text x={270} y={112} textAnchor="middle" className="gmp-label gmp-steal-label" fill={C_P}>steal half</text>

      {/* 全局队列 fallback */}
      <rect x={160} y={210} width={320} height={44} rx={12} className="gmp-box gmp-box--gq" />
      <text x={320} y={232} textAnchor="middle" className="gmp-box__title" fill={C_GQ}>Global Queue (fallback)</text>
      <text x={320} y={246} textAnchor="middle" className="gmp-box__sub">偷取失败 → 从全局队列获取</text>

      <defs>
        <marker id="gmp-arr-steal" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={C_P} /></marker>
      </defs>
    </svg>
  );
}

function SyscallScene() {
  return (
    <svg className="gmp-svg" viewBox={`0 0 ${SVG_W} 280`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gmp-heading">Syscall Hand Off — 系统调用交接</text>

      {/* M0 + G (syscall) */}
      <rect x={40} y={60} width={120} height={80} rx={12} className="gmp-box gmp-box--m" />
      <text x={100} y={82} textAnchor="middle" className="gmp-box__title" fill={C_M}>M0</text>
      <rect x={55} y={96} width={90} height={30} rx={8} fill="rgba(42,111,107,0.08)" stroke={C_G} strokeWidth={1} />
      <text x={100} y={115} textAnchor="middle" className="gmp-q-text">G1 (syscall)</text>

      {/* P 解绑 */}
      <text x={220} y={80} textAnchor="middle" className="gmp-label" fill={C_P}>P 解绑</text>
      <line x1={160} y1={90} x2={270} y2={90} stroke={C_P} strokeWidth={2} strokeDasharray="6 4" markerEnd="url(#gmp-arr-ho)" className="gmp-handoff-line" />

      {/* P → M1 */}
      <rect x={280} y={55} width={140} height={50} rx={12} className="gmp-box gmp-box--p" />
      <text x={350} y={78} textAnchor="middle" className="gmp-box__title" fill={C_P}>P0</text>
      <text x={350} y={94} textAnchor="middle" className="gmp-box__sub">转交给 M1</text>

      <line x1={420} y1={80} x2={470} y2={80} stroke={C_M} strokeWidth={2} markerEnd="url(#gmp-arr-m)" />

      <rect x={475} y={55} width={120} height={50} rx={12} className="gmp-box gmp-box--m" />
      <text x={535} y={78} textAnchor="middle" className="gmp-box__title" fill={C_M}>M1</text>
      <text x={535} y={94} textAnchor="middle" className="gmp-box__sub">继续执行队列</text>

      {/* syscall 返回 */}
      <rect x={40} y={180} width={200} height={50} rx={12} fill="rgba(42,111,107,0.05)" stroke={C_G} strokeWidth={1} strokeDasharray="4 2" />
      <text x={140} y={202} textAnchor="middle" className="gmp-box__title" fill={C_G}>G1 syscall 返回</text>
      <text x={140} y={218} textAnchor="middle" className="gmp-box__sub">重新进入 P 的本地队列</text>

      <path d="M100,140 L100,178" stroke={C_G} strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#gmp-arr-g3)" />

      <text x={SVG_W / 2} y={265} textAnchor="middle" className="gmp-hint">Hand Off 保证 P 不因 syscall 阻塞而浪费</text>

      <defs>
        <marker id="gmp-arr-ho" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={C_P} /></marker>
        <marker id="gmp-arr-m" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={C_M} /></marker>
        <marker id="gmp-arr-g3" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={C_G} /></marker>
      </defs>
    </svg>
  );
}

function PreemptScene() {
  return (
    <svg className="gmp-svg" viewBox={`0 0 ${SVG_W} 260`} preserveAspectRatio="xMidYMid meet">
      <text x={SVG_W / 2} y={24} textAnchor="middle" className="gmp-heading">抢占式调度 (Go 1.14+)</text>

      {/* sysmon */}
      <rect x={40} y={60} width={140} height={50} rx={12} fill="rgba(140,80,180,0.06)" stroke="#8c50b4" strokeWidth={1} />
      <text x={110} y={82} textAnchor="middle" className="gmp-box__title" fill="#8c50b4">sysmon</text>
      <text x={110} y={98} textAnchor="middle" className="gmp-box__sub">后台监控线程</text>

      {/* 检测 */}
      <line x1={180} y1={85} x2={280} y2={85} stroke="#8c50b4" strokeWidth={1.5} strokeDasharray="6 3" markerEnd="url(#gmp-arr-sys)" />
      <text x={230} y={78} textAnchor="middle" className="gmp-label" fill="#8c50b4">检测 &gt;10ms</text>

      {/* M + P + G running */}
      <rect x={285} y={55} width={200} height={130} rx={14} className="gmp-box gmp-box--p" />
      <text x={385} y={78} textAnchor="middle" className="gmp-box__title" fill={C_P}>P0 + M0</text>

      <rect x={305} y={92} width={160} height={36} rx={8} fill="rgba(42,111,107,0.1)" stroke={C_G} strokeWidth={1.5} className="gmp-running" />
      <text x={385} y={114} textAnchor="middle" className="gmp-box__title" fill={C_G}>G7 (运行 &gt;10ms)</text>

      <rect x={305} y={140} width={160} height={28} rx={6} fill="rgba(42,111,107,0.04)" stroke={C_G} strokeWidth={1} strokeOpacity={0.2} />
      <text x={385} y={158} textAnchor="middle" className="gmp-q-text">G8 waiting...</text>

      {/* SIGURG */}
      <rect x={510} y={70} width={100} height={36} rx={8} fill="rgba(210,100,42,0.08)" stroke={C_P} strokeWidth={1.5} className="gmp-signal" />
      <text x={560} y={92} textAnchor="middle" className="gmp-box__title" fill={C_P}>SIGURG</text>

      <line x1={485} y1={110} x2={512} y2={95} stroke={C_P} strokeWidth={1.5} markerEnd="url(#gmp-arr-sig)" />

      {/* 结果 */}
      <rect x={160} y={210} width={320} height={36} rx={10} fill="rgba(42,111,107,0.05)" stroke={C_G} strokeWidth={1} strokeDasharray="4 2" />
      <text x={320} y={233} textAnchor="middle" className="gmp-box__sub">G7 在安全点暂停 → 重新入队 → G8 获得执行机会</text>

      <defs>
        <marker id="gmp-arr-sys" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#8c50b4" /></marker>
        <marker id="gmp-arr-sig" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={C_P} /></marker>
      </defs>
    </svg>
  );
}

const sceneMap = {
  overview: OverviewScene,
  "g-create": GCreateScene,
  bindmp: BindScene,
  steal: StealScene,
  syscall: SyscallScene,
  preempt: PreemptScene,
};

export default function BackendGoGmp() {
  return (
    <TopicShell
      eyebrow="Go 运行时"
      title="Go GMP 调度模型"
      subtitle="Goroutine、Machine、Processor 三位一体的协程调度机制。"
      steps={steps}
      panel={[
        { title: "核心思想", detail: "M:N 调度 — 少量 OS 线程运行大量协程。" },
        { title: "关键机制", detail: "本地队列 + Work Stealing + Hand Off。" },
      ]}
      principles={principles}
      principlesIntro="从 P 的作用、调度时机和性能调优三个角度理解 GMP。"
      flow={["go func() 创建 G", "G 入 P 本地队列", "M 绑定 P 执行 G", "空闲时 Work Stealing"]}
      diagramClass="gmp-diagram"
      renderDiagram={(step) => {
        const Scene = sceneMap[step.active];
        if (!Scene) return null;
        const pct = ((steps.findIndex((s) => s.id === step.id) + 1) / steps.length) * 100;
        return (
          <div className="gmp-scene">
            <div className="gmp-progress">
              <div className="gmp-progress__fill" style={{ width: `${pct}%` }} />
            </div>
            <Scene />
          </div>
        );
      }}
    />
  );
}
