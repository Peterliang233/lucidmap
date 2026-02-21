import TopicShell from "../components/TopicShell.jsx";

/* ── Steps ── */
const steps = [
  {
    id: "overview", title: "Multi-Agent 总览",
    description: "多个专业化 Agent 协作完成复杂任务，每个 Agent 专注自己的能力域。",
    bullets: ["单 Agent 能力有限，多 Agent 互补", "分工协作提升任务完成质量", "核心问题：如何协调与通信"],
    mode: "overview", phase: 0,
  },
  {
    id: "orchestrator", title: "中心调度模式",
    description: "Orchestrator 作为中枢，负责任务拆解、分发和结果汇总。",
    bullets: ["Orchestrator 拆解任务并派发", "Worker Agent 各自执行子任务", "结果回传 Orchestrator 汇总"],
    mode: "pattern", phase: 0,
  },
  {
    id: "hierarchical", title: "层级式协作",
    description: "Manager 管理多个 Sub-Agent，Sub-Agent 可继续委派，形成树状结构。",
    bullets: ["Manager → Sub-Manager → Worker", "逐层分解复杂任务", "适合大规模多步骤任务"],
    mode: "pattern", phase: 1,
  },
  {
    id: "peer", title: "对等协作模式",
    description: "Agent 之间直接通信，无中心节点，适合松耦合场景。",
    bullets: ["Agent 之间点对点通信", "无单点瓶颈", "需要协议约定消息格式"],
    mode: "pattern", phase: 2,
  },
  {
    id: "blackboard", title: "共享黑板模式",
    description: "所有 Agent 读写共享状态（Blackboard），基于状态变化触发行动。",
    bullets: ["Blackboard 存储全局状态", "Agent 监听状态变化并响应", "解耦 Agent 间的直接依赖"],
    mode: "pattern", phase: 3,
  },
  {
    id: "comm", title: "通信与协议",
    description: "Multi-Agent 系统需要标准化的通信协议来保证互操作性。",
    bullets: ["消息格式：JSON / Protobuf", "协议：A2A / MCP / 自定义 RPC", "状态同步：事件驱动 / 轮询"],
    mode: "comm", phase: 0,
  },
  {
    id: "example", title: "实战示例",
    description: "以「智能客服系统」为例，展示多 Agent 协作处理用户请求。",
    bullets: ["Router Agent 识别意图并分发", "FAQ Agent / Order Agent / Human Agent", "结果汇总后统一回复用户"],
    mode: "example", phase: 0,
  },
];

const principles = [
  { title: "分工与专业化", detail: "每个 Agent 专注一个能力域，通过协作覆盖复杂任务。", points: ["单一职责原则", "能力互补而非重复", "易于独立迭代升级"] },
  { title: "协调模式选择", detail: "根据任务特点选择中心调度、层级、对等或黑板模式。", points: ["简单任务用 Orchestrator", "复杂任务用层级式", "松耦合场景用对等/黑板"] },
  { title: "容错与可观测", detail: "多 Agent 系统需要完善的错误处理和全链路追踪。", points: ["单 Agent 失败不影响整体", "超时重试与降级策略", "全链路 Trace 便于调试"] },
];

/* ── Overview Scene ── */
function OverviewScene() {
  const agents = [
    { label: "Agent A", sub: "搜索", cx: 120, cy: 90, color: "#4c78a8" },
    { label: "Agent B", sub: "分析", cx: 300, cy: 60, color: "#2a6f6b" },
    { label: "Agent C", sub: "生成", cx: 480, cy: 90, color: "#d2642a" },
    { label: "Agent D", sub: "校验", cx: 200, cy: 180, color: "#8c50b4" },
    { label: "Agent E", sub: "执行", cx: 400, cy: 180, color: "#388e3c" },
  ];
  const links = [
    [0, 1], [1, 2], [0, 3], [2, 4], [3, 4], [1, 3], [1, 4],
  ];
  return (
    <svg className="magent-svg" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="magent-heading">Multi-Agent 协作系统</text>
      {links.map(([a, b], i) => (
        <line key={i} x1={agents[a].cx} y1={agents[a].cy} x2={agents[b].cx} y2={agents[b].cy}
          className="magent-link" />
      ))}
      {agents.map((a, i) => (
        <g key={i} className="magent-agent-g" style={{ "--ag-delay": `${i * 0.15}s` }}>
          <circle cx={a.cx} cy={a.cy} r={28} className="magent-agent-circle" style={{ "--ag-c": a.color }} />
          <text x={a.cx} y={a.cy - 4} className="magent-agent-name" fill={a.color}>{a.label}</text>
          <text x={a.cx} y={a.cy + 12} className="magent-agent-sub">{a.sub}</text>
        </g>
      ))}
      <text x={300} y={228} className="magent-hint">多个专业化 Agent 通过协作完成复杂任务</text>
    </svg>
  );
}

/* ── Pattern Scenes ── */
function OrchestratorScene() {
  const workers = [
    { label: "Worker A", cx: 120, cy: 180, color: "#4c78a8" },
    { label: "Worker B", cx: 300, cy: 180, color: "#2a6f6b" },
    { label: "Worker C", cx: 480, cy: 180, color: "#d2642a" },
  ];
  return (
    <svg className="magent-svg" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="magent-heading">中心调度模式 Orchestrator</text>
      {/* Orchestrator */}
      <rect x={220} y={55} width={160} height={50} rx={14} className="magent-orch-box" />
      <text x={300} y={78} className="magent-orch-label">Orchestrator</text>
      <text x={300} y={95} className="magent-orch-sub">任务拆解 & 汇总</text>
      {/* Arrows & Workers */}
      {workers.map((w, i) => (
        <g key={i} className="magent-worker-g" style={{ "--ag-delay": `${i * 0.2}s` }}>
          <line x1={300} y1={105} x2={w.cx} y2={w.cy - 22} className="magent-dispatch-arrow" markerEnd="url(#magent-arr)" />
          <circle cx={w.cx} cy={w.cy} r={22} className="magent-worker-circle" style={{ "--ag-c": w.color }} />
          <text x={w.cx} y={w.cy + 5} className="magent-worker-name">{w.label}</text>
        </g>
      ))}
      <text x={300} y={228} className="magent-hint">Orchestrator 统一调度，Worker 专注执行</text>
      <defs>
        <marker id="magent-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(76,120,168,0.5)" /></marker>
      </defs>
    </svg>
  );
}

function HierarchicalScene() {
  return (
    <svg className="magent-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="magent-heading">层级式协作 Hierarchical</text>
      {/* Manager */}
      <rect x={230} y={48} width={140} height={40} rx={10} className="magent-hier-box magent-hier-box--mgr" />
      <text x={300} y={73} className="magent-hier-label" fill="#d2642a">Manager</text>
      {/* Sub-managers */}
      <rect x={80} y={125} width={130} height={36} rx={10} className="magent-hier-box magent-hier-box--sub" />
      <text x={145} y={148} className="magent-hier-label" fill="#4c78a8">Sub-Mgr A</text>
      <rect x={380} y={125} width={130} height={36} rx={10} className="magent-hier-box magent-hier-box--sub" />
      <text x={445} y={148} className="magent-hier-label" fill="#4c78a8">Sub-Mgr B</text>
      {/* Workers */}
      {[70, 170].map((x, i) => (
        <g key={`a${i}`}>
          <circle cx={x + 25} cy={210} r={18} className="magent-hier-worker" style={{ "--ag-c": "#2a6f6b" }} />
          <text x={x + 25} y={214} className="magent-hier-wname">W{i + 1}</text>
        </g>
      ))}
      {[360, 460].map((x, i) => (
        <g key={`b${i}`}>
          <circle cx={x + 25} cy={210} r={18} className="magent-hier-worker" style={{ "--ag-c": "#8c50b4" }} />
          <text x={x + 25} y={214} className="magent-hier-wname">W{i + 3}</text>
        </g>
      ))}
      {/* Lines */}
      <line x1={300} y1={88} x2={145} y2={125} className="magent-hier-line" />
      <line x1={300} y1={88} x2={445} y2={125} className="magent-hier-line" />
      <line x1={110} y1={161} x2={95} y2={192} className="magent-hier-line" />
      <line x1={175} y1={161} x2={195} y2={192} className="magent-hier-line" />
      <line x1={410} y1={161} x2={385} y2={192} className="magent-hier-line" />
      <line x1={480} y1={161} x2={485} y2={192} className="magent-hier-line" />
      <text x={300} y={250} className="magent-hint">树状结构逐层分解，适合复杂多步骤任务</text>
    </svg>
  );
}

function PeerScene() {
  const peers = [
    { cx: 150, cy: 100, label: "Agent A", color: "#4c78a8" },
    { cx: 450, cy: 100, label: "Agent B", color: "#d2642a" },
    { cx: 150, cy: 200, label: "Agent C", color: "#2a6f6b" },
    { cx: 450, cy: 200, label: "Agent D", color: "#8c50b4" },
  ];
  const links = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
  return (
    <svg className="magent-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="magent-heading">对等协作 Peer-to-Peer</text>
      {links.map(([a, b], i) => (
        <line key={i} x1={peers[a].cx} y1={peers[a].cy} x2={peers[b].cx} y2={peers[b].cy}
          className="magent-peer-link" />
      ))}
      {peers.map((p, i) => (
        <g key={i} className="magent-peer-g" style={{ "--ag-delay": `${i * 0.15}s` }}>
          <circle cx={p.cx} cy={p.cy} r={26} className="magent-peer-circle" style={{ "--ag-c": p.color }} />
          <text x={p.cx} y={p.cy + 5} className="magent-peer-name" fill={p.color}>{p.label}</text>
        </g>
      ))}
      <text x={300} y={150} className="magent-center-label">P2P Mesh</text>
      <text x={300} y={250} className="magent-hint">无中心节点，Agent 之间直接通信</text>
    </svg>
  );
}

function BlackboardScene() {
  const agents = [
    { label: "Agent A", cx: 80, cy: 80, color: "#4c78a8" },
    { label: "Agent B", cx: 80, cy: 170, color: "#2a6f6b" },
    { label: "Agent C", cx: 500, cy: 80, color: "#d2642a" },
    { label: "Agent D", cx: 500, cy: 170, color: "#8c50b4" },
  ];
  return (
    <svg className="magent-svg" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="magent-heading">共享黑板模式 Blackboard</text>
      {/* Blackboard */}
      <rect x={190} y={55} width={220} height={140} rx={14} className="magent-bb-box" />
      <text x={300} y={85} className="magent-bb-label">Blackboard</text>
      <text x={300} y={105} className="magent-bb-sub">共享状态</text>
      <text x={300} y={130} className="magent-bb-item">task_status: running</text>
      <text x={300} y={148} className="magent-bb-item">result_a: ...</text>
      <text x={300} y={166} className="magent-bb-item">result_b: ...</text>
      {/* Agents & arrows */}
      {agents.map((a, i) => (
        <g key={i} className="magent-bb-agent" style={{ "--ag-delay": `${i * 0.15}s` }}>
          <circle cx={a.cx} cy={a.cy} r={22} className="magent-bb-circle" style={{ "--ag-c": a.color }} />
          <text x={a.cx} y={a.cy + 5} className="magent-bb-name" fill={a.color}>{a.label}</text>
          <line x1={a.cx + (a.cx < 300 ? 22 : -22)} y1={a.cy} x2={a.cx < 300 ? 190 : 410} y2={a.cy < 130 ? 90 : 160}
            className="magent-bb-arrow" />
        </g>
      ))}
      <text x={300} y={228} className="magent-hint">Agent 通过读写共享状态间接协作</text>
    </svg>
  );
}

/* ── Comm Scene ── */
function CommScene() {
  const protocols = [
    { label: "A2A", desc: "Agent-to-Agent 协议", color: "#d2642a", x: 70 },
    { label: "MCP", desc: "工具接入协议", color: "#2a6f6b", x: 200 },
    { label: "gRPC", desc: "高性能 RPC", color: "#4c78a8", x: 330 },
    { label: "Event Bus", desc: "事件驱动", color: "#8c50b4", x: 460 },
  ];
  return (
    <svg className="magent-svg" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="magent-heading">通信与协议</text>
      {protocols.map((p, i) => (
        <g key={i} className="magent-proto-g" style={{ "--ag-delay": `${i * 0.2}s` }}>
          <rect x={p.x - 10} y={60} width={120} height={60} rx={12}
            className="magent-proto-box" style={{ "--ag-c": p.color }} />
          <text x={p.x + 50} y={86} className="magent-proto-name" fill={p.color}>{p.label}</text>
          <text x={p.x + 50} y={106} className="magent-proto-desc">{p.desc}</text>
        </g>
      ))}
      <text x={300} y={155} className="magent-hint">选择合适的协议保证 Agent 间互操作性</text>
      <text x={300} y={175} className="magent-hint">消息格式标准化 + 状态同步机制</text>
    </svg>
  );
}

/* ── Example Scene ── */
function ExampleScene() {
  return (
    <svg className="magent-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="magent-heading">实战：智能客服系统</text>
      {/* User */}
      <rect x={230} y={45} width={140} height={36} rx={10} className="magent-ex-box" style={{ "--ag-c": "#4c78a8" }} />
      <text x={300} y={68} className="magent-ex-label" fill="#4c78a8">用户请求</text>
      {/* Router */}
      <rect x={230} y={105} width={140} height={40} rx={12} className="magent-ex-router" />
      <text x={300} y={123} className="magent-ex-router-label">Router Agent</text>
      <text x={300} y={138} className="magent-ex-router-sub">意图识别 & 分发</text>
      <line x1={300} y1={81} x2={300} y2={105} className="magent-ex-arrow" markerEnd="url(#magent-arr)" />
      {/* Workers */}
      {[
        { label: "FAQ Agent", cx: 110, color: "#2a6f6b" },
        { label: "Order Agent", cx: 300, color: "#d2642a" },
        { label: "Human Agent", cx: 490, color: "#8c50b4" },
      ].map((w, i) => (
        <g key={i} className="magent-ex-worker" style={{ "--ag-delay": `${i * 0.2}s` }}>
          <line x1={300} y1={145} x2={w.cx} y2={185} className="magent-ex-arrow" markerEnd="url(#magent-arr)" />
          <rect x={w.cx - 55} y={185} width={110} height={36} rx={10}
            className="magent-ex-box" style={{ "--ag-c": w.color }} />
          <text x={w.cx} y={208} className="magent-ex-label" fill={w.color}>{w.label}</text>
        </g>
      ))}
      <text x={300} y={248} className="magent-hint">Router 识别意图 → 分发到专业 Agent → 汇总回复</text>
      <defs>
        <marker id="magent-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(76,120,168,0.5)" /></marker>
      </defs>
    </svg>
  );
}

/* ── Phase bar ── */
function PhaseBar({ mode, phase, labels, color }) {
  const tagMap = { overview: "总览", pattern: "协作模式", comm: "通信", example: "示例" };
  return (
    <div className="magent-phase-bar" style={{ "--phase-c": color }}>
      <span className="magent-phase-bar__tag">{tagMap[mode]}</span>
      <div className="magent-phase-bar__steps">
        {labels.map((t, i) => (
          <span key={i} className={`magent-phase-bar__step ${i === phase ? "is-active" : ""} ${i < phase ? "is-past" : ""}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AiMultiAgent() {
  const phaseLabels = {
    overview: ["系统总览"],
    pattern: ["中心调度", "层级式", "对等协作", "共享黑板"],
    comm: ["通信协议"],
    example: ["智能客服"],
  };
  const phaseColors = {
    overview: "#4c78a8",
    pattern: "#d2642a",
    comm: "#2a6f6b",
    example: "#8c50b4",
  };

  return (
    <TopicShell
      eyebrow="AI 动画"
      title="Multi-Agent 架构"
      subtitle="多 Agent 协作模式：中心调度、层级式、对等与共享黑板。"
      steps={steps}
      panel={[
        { title: "核心思想", detail: "专业化分工 + 协作完成复杂任务。" },
        { title: "关键挑战", detail: "协调模式、通信协议、容错机制。" },
      ]}
      principles={principles}
      principlesIntro="理解 Multi-Agent 的协作模式与工程实践要点。"
      flow={["任务拆解分发", "专业 Agent 并行执行", "结果汇总交付"]}
      diagramClass="magent-diagram"
      renderDiagram={(step) => {
        const { mode, phase } = step;
        const pct = ((steps.findIndex(s => s.id === step.id) + 1) / steps.length) * 100;
        return (
          <div className="magent-scene">
            <div className="magent-progress">
              <div className="magent-progress__fill" style={{ width: `${pct}%` }} />
            </div>
            {mode === "overview" && <OverviewScene />}
            {mode === "pattern" && phase === 0 && <OrchestratorScene />}
            {mode === "pattern" && phase === 1 && <HierarchicalScene />}
            {mode === "pattern" && phase === 2 && <PeerScene />}
            {mode === "pattern" && phase === 3 && <BlackboardScene />}
            {mode === "comm" && <CommScene />}
            {mode === "example" && <ExampleScene />}
            <PhaseBar mode={mode} phase={phase} labels={phaseLabels[mode]} color={phaseColors[mode]} />
          </div>
        );
      }}
    />
  );
}
