import TopicShell from "../components/TopicShell.jsx";

/* ── Steps ── */
const steps = [
  {
    id: "overview", title: "ReAct 框架总览",
    description: "ReAct 将推理（Reasoning）与行动（Acting）交替进行，让 LLM 在思考中调用工具，在观察中修正推理。",
    bullets: ["Reasoning + Acting 的结合", "Thought → Action → Observation 循环", "比纯 CoT 更能利用外部工具"],
    mode: "overview", phase: 0,
  },
  {
    id: "thought", title: "Thought：推理思考",
    description: "LLM 根据当前上下文进行推理，决定下一步应该做什么。",
    bullets: ["分析当前已知信息", "判断是否需要调用工具", "生成自然语言推理链"],
    mode: "loop", phase: 0,
  },
  {
    id: "action", title: "Action：执行动作",
    description: "根据推理结果，选择并调用合适的工具或 API。",
    bullets: ["选择工具：Search / Lookup / Calculate", "构造结构化参数", "发起外部调用"],
    mode: "loop", phase: 1,
  },
  {
    id: "observation", title: "Observation：观察结果",
    description: "接收工具返回的结果，作为下一轮推理的输入。",
    bullets: ["工具返回结构化结果", "结果注入上下文窗口", "LLM 基于新信息继续推理"],
    mode: "loop", phase: 2,
  },
  {
    id: "iterate", title: "多轮迭代",
    description: "Thought → Action → Observation 循环多次，逐步逼近最终答案。",
    bullets: ["每轮积累新的事实", "推理链越来越精确", "直到信息充分，输出最终答案"],
    mode: "loop", phase: 3,
  },
  {
    id: "answer", title: "Answer：输出答案",
    description: "当 LLM 判断信息充分时，跳出循环，生成最终答案。",
    bullets: ["Finish 动作终止循环", "综合所有 Observation 生成回答", "答案可追溯每一步推理"],
    mode: "answer", phase: 0,
  },
  {
    id: "example", title: "完整示例",
    description: "以「苹果公司现任 CEO 的母校是哪所大学？」为例，展示 ReAct 多轮推理过程。",
    bullets: ["Thought: 需要先查 CEO 是谁", "Action: Search[苹果公司 CEO]", "Observation: Tim Cook → 再查母校"],
    mode: "example", phase: 0,
  },
];

const principles = [
  { title: "推理与行动交替", detail: "Thought 提供推理方向，Action 获取外部事实，两者交替推进。", points: ["推理引导工具选择", "工具结果修正推理", "避免纯推理的幻觉问题"] },
  { title: "可追溯的决策链", detail: "每一步 Thought 都记录了推理过程，便于调试和审计。", points: ["完整的推理日志", "每个 Action 有明确依据", "错误可定位到具体步骤"] },
  { title: "与 CoT 的区别", detail: "CoT 只推理不行动，ReAct 在推理中穿插工具调用获取真实信息。", points: ["CoT: 纯内部推理", "ReAct: 推理 + 外部工具", "ReAct 减少事实性错误"] },
];

/* ── Overview Scene ── */
function OverviewScene() {
  return (
    <svg className="react-svg" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="react-heading">ReAct = Reasoning + Acting</text>
      {/* LLM center */}
      <rect x={220} y={80} width={160} height={60} rx={14} className="react-llm-box" />
      <text x={300} y={108} className="react-llm-label">LLM</text>
      <text x={300} y={126} className="react-llm-sub">推理中枢</text>
      {/* Thought */}
      <rect x={30} y={85} width={130} height={44} rx={10} className="react-node react-node--thought" />
      <text x={95} y={112} className="react-node-label" fill="#4c78a8">Thought</text>
      {/* Action */}
      <rect x={440} y={55} width={130} height={44} rx={10} className="react-node react-node--action" />
      <text x={505} y={82} className="react-node-label" fill="#d2642a">Action</text>
      {/* Observation */}
      <rect x={440} y={115} width={130} height={44} rx={10} className="react-node react-node--obs" />
      <text x={505} y={142} className="react-node-label" fill="#388e3c">Observation</text>
      {/* Arrows */}
      <line x1={160} y1={107} x2={220} y2={107} className="react-arrow" markerEnd="url(#react-arr)" />
      <line x1={380} y1={95} x2={440} y2={77} className="react-arrow" markerEnd="url(#react-arr)" />
      <line x1={440} y1={137} x2={380} y2={120} className="react-arrow react-arrow--return" markerEnd="url(#react-arr-green)" />
      {/* Loop arrow */}
      <path d="M505,99 L505,115" className="react-arrow" markerEnd="url(#react-arr)" />
      {/* Answer */}
      <rect x={220} y={180} width={160} height={40} rx={10} className="react-node react-node--answer" />
      <text x={300} y={205} className="react-node-label" fill="#8c50b4">Answer</text>
      <line x1={300} y1={140} x2={300} y2={180} className="react-arrow react-arrow--answer" markerEnd="url(#react-arr-purple)" strokeDasharray="5 3" />
      <text x={300} y={240} className="react-hint">循环直到信息充分 → 输出最终答案</text>
      <defs>
        <marker id="react-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(76,120,168,0.5)" /></marker>
        <marker id="react-arr-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(56,142,60,0.5)" /></marker>
        <marker id="react-arr-purple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(140,80,180,0.5)" /></marker>
      </defs>
    </svg>
  );
}

/* ── Loop Scene ── */
function LoopScene({ phase }) {
  const loopSteps = [
    { label: "Thought", sub: "推理思考", color: "#4c78a8", cx: 150, cy: 80 },
    { label: "Action", sub: "调用工具", color: "#d2642a", cx: 420, cy: 80 },
    { label: "Observation", sub: "接收结果", color: "#388e3c", cx: 420, cy: 200 },
    { label: "下一轮 Thought", sub: "继续推理", color: "#4c78a8", cx: 150, cy: 200 },
  ];
  const arrows = [
    { x1: 210, y1: 80, x2: 360, y2: 80 },
    { x1: 420, y1: 110, x2: 420, y2: 170 },
    { x1: 360, y1: 200, x2: 210, y2: 200 },
    { x1: 150, y1: 170, x2: 150, y2: 110 },
  ];
  return (
    <svg className="react-svg" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="react-heading">
        {phase === 0 ? "Thought：推理思考" : phase === 1 ? "Action：执行动作" : phase === 2 ? "Observation：观察结果" : "多轮迭代循环"}
      </text>
      {/* Loop arrows */}
      {arrows.map((a, i) => (
        <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
          className={`react-loop-arrow ${i === phase || (phase === 3) ? "react-loop-arrow--active" : ""}`}
          markerEnd="url(#react-arr)" />
      ))}
      {/* Nodes */}
      {loopSteps.map((s, i) => {
        const isActive = i === phase || phase === 3;
        const isPast = i < phase && phase !== 3;
        return (
          <g key={i} className={`react-loop-node ${isActive ? "react-loop-node--active" : ""} ${isPast ? "react-loop-node--past" : ""}`}>
            <rect x={s.cx - 65} y={s.cy - 22} width={130} height={44} rx={12}
              className="react-loop-box" style={{ "--loop-c": s.color }} />
            <text x={s.cx} y={s.cy - 2} className="react-loop-label" fill={s.color}>{s.label}</text>
            <text x={s.cx} y={s.cy + 16} className="react-loop-sub">{s.sub}</text>
          </g>
        );
      })}
      {/* Center label */}
      <text x={285} y={145} className="react-center-label">ReAct Loop</text>
      {/* Phase-specific detail */}
      {phase === 0 && (
        <text x={300} y={260} className="react-hint">LLM 分析上下文，决定下一步行动</text>
      )}
      {phase === 1 && (
        <text x={300} y={260} className="react-hint">选择工具并构造参数发起调用</text>
      )}
      {phase === 2 && (
        <text x={300} y={260} className="react-hint">工具结果注入上下文，供下轮推理</text>
      )}
      {phase === 3 && (
        <text x={300} y={260} className="react-hint">循环执行直到信息充分</text>
      )}
    </svg>
  );
}

/* ── Answer Scene ── */
function AnswerScene() {
  return (
    <svg className="react-svg" viewBox="0 0 600 220" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="react-heading">Answer：输出最终答案</text>
      {/* Accumulated context */}
      <rect x={40} y={55} width={240} height={120} rx={12} className="react-context-box" />
      <text x={160} y={78} className="react-context-title">累积上下文</text>
      <text x={60} y={100} className="react-context-item">Thought 1 → Action 1 → Obs 1</text>
      <text x={60} y={120} className="react-context-item">Thought 2 → Action 2 → Obs 2</text>
      <text x={60} y={140} className="react-context-item">Thought 3: 信息充分</text>
      <text x={60} y={160} className="react-context-item react-context-item--finish">Action: Finish[答案]</text>
      {/* Arrow */}
      <line x1={280} y1={115} x2={340} y2={115} className="react-arrow" markerEnd="url(#react-arr-purple)" />
      {/* Answer box */}
      <rect x={340} y={75} width={220} height={80} rx={14} className="react-answer-box" />
      <text x={450} y={105} className="react-answer-label">Final Answer</text>
      <text x={450} y={128} className="react-answer-sub">综合推理链生成回答</text>
      <text x={300} y={205} className="react-hint">所有推理步骤可追溯、可审计</text>
    </svg>
  );
}

/* ── Example Scene ── */
function ExampleScene() {
  const rounds = [
    { thought: "需要先查苹果公司现任 CEO", action: "Search[苹果公司 CEO]", obs: "Tim Cook" },
    { thought: "CEO 是 Tim Cook，查他的母校", action: "Search[Tim Cook 母校]", obs: "Auburn University / Duke MBA" },
    { thought: "信息充分，可以回答", action: "Finish[Auburn University 和 Duke University]", obs: null },
  ];
  return (
    <svg className="react-svg" viewBox="0 0 600 310" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={22} className="react-heading">完整示例：苹果 CEO 的母校？</text>
      {/* Column headers */}
      <text x={100} y={50} className="react-col-header" fill="#4c78a8">Thought</text>
      <text x={300} y={50} className="react-col-header" fill="#d2642a">Action</text>
      <text x={500} y={50} className="react-col-header" fill="#388e3c">Observation</text>
      {/* Rows */}
      {rounds.map((r, i) => {
        const y = 72 + i * 80;
        return (
          <g key={i} className="react-example-row" style={{ "--ex-delay": `${i * 0.3}s` }}>
            <text x={20} y={y + 4} className="react-round-num">Round {i + 1}</text>
            {/* Thought */}
            <rect x={20} y={y + 10} width={170} height={36} rx={8} className="react-ex-box react-ex-box--thought" />
            <text x={105} y={y + 33} className="react-ex-text">{r.thought}</text>
            {/* Arrow T→A */}
            <line x1={190} y1={y + 28} x2={210} y2={y + 28} className="react-ex-arrow" markerEnd="url(#react-arr)" />
            {/* Action */}
            <rect x={210} y={y + 10} width={180} height={36} rx={8} className="react-ex-box react-ex-box--action" />
            <text x={300} y={y + 33} className="react-ex-text">{r.action}</text>
            {/* Arrow A→O */}
            {r.obs && <line x1={390} y1={y + 28} x2={410} y2={y + 28} className="react-ex-arrow" markerEnd="url(#react-arr-green)" />}
            {/* Observation */}
            {r.obs && (
              <>
                <rect x={410} y={y + 10} width={170} height={36} rx={8} className="react-ex-box react-ex-box--obs" />
                <text x={495} y={y + 33} className="react-ex-text">{r.obs}</text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Phase bar ── */
function PhaseBar({ mode, phase, labels, color }) {
  const tagMap = { overview: "总览", loop: "循环", answer: "输出", example: "示例" };
  return (
    <div className="react-phase-bar" style={{ "--phase-c": color }}>
      <span className="react-phase-bar__tag">{tagMap[mode]}</span>
      <div className="react-phase-bar__steps">
        {labels.map((t, i) => (
          <span key={i} className={`react-phase-bar__step ${i === phase ? "is-active" : ""} ${i < phase ? "is-past" : ""}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AiReact() {
  const phaseLabels = {
    overview: ["框架总览"],
    loop: ["Thought", "Action", "Observation", "多轮迭代"],
    answer: ["输出答案"],
    example: ["完整示例"],
  };
  const phaseColors = {
    overview: "#4c78a8",
    loop: "#d2642a",
    answer: "#8c50b4",
    example: "#2a6f6b",
  };

  return (
    <TopicShell
      eyebrow="AI 动画"
      title="ReAct 推理框架"
      subtitle="Reasoning + Acting：LLM 在推理中调用工具，在观察中修正方向。"
      steps={steps}
      panel={[
        { title: "核心机制", detail: "Thought → Action → Observation 循环。" },
        { title: "关键优势", detail: "推理可追溯，减少幻觉，利用外部工具。" },
      ]}
      principles={principles}
      principlesIntro="理解 ReAct 如何将推理与工具调用结合，构建可靠的 Agent 决策链。"
      flow={["Thought 推理分析", "Action 调用工具", "Observation 获取结果", "循环直到输出 Answer"]}
      diagramClass="react-diagram"
      renderDiagram={(step) => {
        const { mode, phase } = step;
        const pct = ((steps.findIndex(s => s.id === step.id) + 1) / steps.length) * 100;
        return (
          <div className="react-scene">
            <div className="react-progress">
              <div className="react-progress__fill" style={{ width: `${pct}%` }} />
            </div>
            {mode === "overview" && <OverviewScene />}
            {mode === "loop" && <LoopScene phase={phase} />}
            {mode === "answer" && <AnswerScene />}
            {mode === "example" && <ExampleScene />}
            <PhaseBar mode={mode} phase={phase} labels={phaseLabels[mode]} color={phaseColors[mode]} />
          </div>
        );
      }}
    />
  );
}
