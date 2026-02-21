import TopicShell from "../components/TopicShell.jsx";

/* ── Steps ── */
const steps = [
  {
    id: "overview", title: "Skill 体系总览",
    description: "Agent Skill 是对工具能力的结构化封装，包含描述、接口定义和执行器，形成可注册、可发现、可调用的能力单元。",
    bullets: ["Skill = 描述 + Schema + 执行器", "注册中心统一管理所有技能", "LLM 基于描述自主选择技能"],
    mode: "overview", phase: 0,
  },
  {
    id: "manifest", title: "Skill Manifest 结构",
    description: "每个 Skill 通过 Manifest 声明自身能力：名称、自然语言描述、JSON Schema 参数定义和执行器入口。",
    bullets: ["name: 技能唯一标识", "description: 供 LLM 理解的能力描述", "input_schema: JSON Schema 参数校验", "executor: 实际执行函数/API"],
    mode: "manifest", phase: 0,
  },
  {
    id: "registry", title: "注册与治理",
    description: "Skill 注册到 Registry 后，由平台统一管理版本、权限、标签和调用统计。",
    bullets: ["版本管理：v1.0 → v1.1 可回滚", "权限控制：按角色/场景授权", "标签分类：便于检索与路由", "调用统计：成功率、延迟监控"],
    mode: "registry", phase: 0,
  },
  {
    id: "discover", title: "技能发现与路由",
    description: "Agent 接收任务后，从 Registry 拉取可用技能清单，将描述注入 LLM 上下文。",
    bullets: ["Agent 向 Registry 请求技能列表", "Registry 返回匹配的 Skill 描述 + Schema", "描述注入 LLM System Prompt"],
    mode: "invoke", phase: 0,
  },
  {
    id: "select", title: "LLM 选择与参数化",
    description: "LLM 根据技能描述和当前任务上下文，自主选择最合适的 Skill 并填充参数。",
    bullets: ["基于 description 语义匹配", "根据 input_schema 构造参数", "可同时选择多个 Skill 并行调用"],
    mode: "invoke", phase: 1,
  },
  {
    id: "execute", title: "执行与结果回传",
    description: "Runtime 校验参数后执行 Skill，结果以结构化格式回传给 LLM，驱动下一步推理或生成最终答案。",
    bullets: ["参数校验 → 执行器调用", "结果回传为 tool_result", "LLM 基于结果生成回答或继续调用"],
    mode: "invoke", phase: 2,
  },
  {
    id: "loop", title: "调用闭环与迭代",
    description: "Skill 调用不是一次性的，LLM 可根据结果决定是否继续调用其他 Skill，形成多轮闭环。",
    bullets: ["结果不满意 → 换 Skill 重试", "多 Skill 串联完成复杂任务", "最终汇总所有结果生成答案"],
    mode: "loop", phase: 0,
  },
  {
    id: "example", title: "实战示例",
    description: "以「简历筛选」为例，展示 Agent 如何通过多个 Skill 协作完成任务。",
    bullets: ["parse_resume: 解析简历结构", "match_jd: 匹配岗位要求", "rank_candidates: 排序候选人"],
    mode: "example", phase: 0,
  },
];

const principles = [
  { title: "结构化封装", detail: "Skill = 描述 + Schema + 执行器，三者缺一不可。", points: ["描述驱动 LLM 选择", "Schema 保证参数正确", "执行器产出可用结果"] },
  { title: "注册与治理", detail: "Registry 统一管理版本、权限与可观测性。", points: ["版本变更可回滚", "权限控制调用范围", "调用统计驱动优化"] },
  { title: "调用闭环", detail: "选择 → 调用 → 回传 → 判断 → 继续或结束。", points: ["tool_call 结构化输出", "tool_result 回注上下文", "多轮迭代逼近目标"] },
];

/* ── Overview Scene ── */
function OverviewScene() {
  return (
    <svg className="askill-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="askill-heading">Agent Skill 体系架构</text>
      {/* Skill boxes */}
      {[
        { label: "Skill A", sub: "搜索", x: 40, color: "#4c78a8" },
        { label: "Skill B", sub: "计算", x: 170, color: "#2a6f6b" },
        { label: "Skill C", sub: "生成", x: 300, color: "#d2642a" },
        { label: "Skill D", sub: "校验", x: 430, color: "#8c50b4" },
      ].map((s, i) => (
        <g key={i} className="askill-skill-g" style={{ "--sk-delay": `${i * 0.15}s` }}>
          <rect x={s.x} y={50} width={110} height={44} rx={10} className="askill-skill-box" style={{ "--sk-c": s.color }} />
          <text x={s.x + 55} y={70} className="askill-skill-name" fill={s.color}>{s.label}</text>
          <text x={s.x + 55} y={86} className="askill-skill-sub">{s.sub}</text>
        </g>
      ))}
      {/* Registry */}
      <rect x={170} y={120} width={260} height={40} rx={12} className="askill-registry-box" />
      <text x={300} y={145} className="askill-registry-label">Skill Registry 注册中心</text>
      {/* Arrows up */}
      {[95, 225, 355, 485].map((x, i) => (
        <line key={i} x1={x} y1={94} x2={x < 300 ? x + 20 : x - 20} y2={120} className="askill-arrow" markerEnd="url(#askill-arr)" />
      ))}
      {/* Agent + LLM */}
      <rect x={100} y={190} width={140} height={40} rx={12} className="askill-agent-box" />
      <text x={170} y={215} className="askill-agent-label">Agent Core</text>
      <rect x={360} y={190} width={140} height={40} rx={12} className="askill-llm-box" />
      <text x={430} y={215} className="askill-llm-label">LLM</text>
      {/* Arrows */}
      <line x1={240} y1={210} x2={360} y2={210} className="askill-arrow" markerEnd="url(#askill-arr)" />
      <line x1={170} y1={190} x2={250} y2={160} className="askill-arrow askill-arrow--discover" markerEnd="url(#askill-arr)" />
      <text x={300} y={250} className="askill-hint">Skill 注册到 Registry → Agent 发现 → LLM 选择 → 执行</text>
      <defs>
        <marker id="askill-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(76,120,168,0.5)" /></marker>
      </defs>
    </svg>
  );
}

/* ── Manifest Scene ── */
function ManifestScene() {
  const fields = [
    { key: "name", val: "\"rank_resume\"", color: "#4c78a8" },
    { key: "description", val: "\"根据 JD 对简历评分排序\"", color: "#2a6f6b" },
    { key: "input_schema", val: "{ title: string, skills: string[] }", color: "#d2642a" },
    { key: "executor", val: "rankResumeHandler()", color: "#8c50b4" },
  ];
  return (
    <svg className="askill-svg" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="askill-heading">Skill Manifest 结构</text>
      <rect x={100} y={45} width={400} height={190} rx={14} className="askill-manifest-box" />
      <text x={300} y={70} className="askill-manifest-title">Skill Manifest</text>
      {fields.map((f, i) => {
        const y = 95 + i * 36;
        return (
          <g key={i} className="askill-field-g" style={{ "--sk-delay": `${i * 0.15}s` }}>
            <rect x={120} y={y - 14} width={360} height={28} rx={6} className="askill-field-row" style={{ "--sk-c": f.color }} />
            <text x={140} y={y + 4} className="askill-field-key" fill={f.color}>{f.key}:</text>
            <text x={260} y={y + 4} className="askill-field-val">{f.val}</text>
          </g>
        );
      })}
      <text x={300} y={260} className="askill-hint">描述驱动选择 · Schema 校验参数 · 执行器产出结果</text>
    </svg>
  );
}

/* ── Registry Scene ── */
function RegistryScene() {
  const features = [
    { icon: "v1.2", label: "版本管理", sub: "可回滚", color: "#4c78a8", x: 60 },
    { icon: "🔑", label: "权限控制", sub: "按角色授权", color: "#d2642a", x: 195 },
    { icon: "#", label: "标签分类", sub: "便于检索", color: "#2a6f6b", x: 330 },
    { icon: "99%", label: "调用统计", sub: "成功率/延迟", color: "#8c50b4", x: 465 },
  ];
  return (
    <svg className="askill-svg" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="askill-heading">Skill Registry 注册与治理</text>
      <rect x={80} y={45} width={440} height={44} rx={12} className="askill-registry-box" />
      <text x={300} y={73} className="askill-registry-label">Skill Registry</text>
      {features.map((f, i) => (
        <g key={i} className="askill-feat-g" style={{ "--sk-delay": `${i * 0.15}s` }}>
          <line x1={f.x + 40} y1={89} x2={f.x + 40} y2={115} className="askill-arrow" markerEnd="url(#askill-arr)" />
          <rect x={f.x} y={115} width={100} height={70} rx={10} className="askill-feat-box" style={{ "--sk-c": f.color }} />
          <text x={f.x + 50} y={140} className="askill-feat-icon">{f.icon}</text>
          <text x={f.x + 50} y={158} className="askill-feat-label" fill={f.color}>{f.label}</text>
          <text x={f.x + 50} y={174} className="askill-feat-sub">{f.sub}</text>
        </g>
      ))}
      <text x={300} y={220} className="askill-hint">统一治理：版本可控、权限可管、效果可观测</text>
      <defs>
        <marker id="askill-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(76,120,168,0.5)" /></marker>
      </defs>
    </svg>
  );
}

/* ── Invoke Scene (3 phases) ── */
function InvokeScene({ phase }) {
  const titles = ["技能发现与路由", "LLM 选择与参数化", "执行与结果回传"];
  /* phase 2 spreads LLM & Runtime wider to avoid label overlap */
  const nodesByPhase = {
    0: [
      { label: "Agent", sub: "任务接收", cx: 80, cy: 100, color: "#4c78a8" },
      { label: "Registry", sub: "技能清单", cx: 240, cy: 100, color: "#2a6f6b" },
      { label: "LLM", sub: "选择参数", cx: 400, cy: 100, color: "#d2642a" },
      { label: "Runtime", sub: "执行技能", cx: 530, cy: 100, color: "#8c50b4" },
    ],
    1: [
      { label: "Agent", sub: "任务接收", cx: 80, cy: 100, color: "#4c78a8" },
      { label: "Registry", sub: "技能清单", cx: 240, cy: 100, color: "#2a6f6b" },
      { label: "LLM", sub: "选择参数", cx: 400, cy: 100, color: "#d2642a" },
      { label: "Runtime", sub: "执行技能", cx: 530, cy: 100, color: "#8c50b4" },
    ],
    2: [
      { label: "Agent", sub: "任务接收", cx: 60, cy: 100, color: "#4c78a8" },
      { label: "Registry", sub: "技能清单", cx: 190, cy: 100, color: "#2a6f6b" },
      { label: "LLM", sub: "选择参数", cx: 340, cy: 100, color: "#d2642a" },
      { label: "Runtime", sub: "执行技能", cx: 520, cy: 100, color: "#8c50b4" },
    ],
  };
  const nodes = nodesByPhase[phase];
  const activeArrows = {
    0: [{ x1: 120, y1: 100, x2: 200, y2: 100, label: "请求技能列表" }],
    1: [
      { x1: 120, y1: 100, x2: 200, y2: 100, label: "" },
      { x1: 280, y1: 100, x2: 360, y2: 100, label: "描述 + Schema" },
    ],
    2: [
      { x1: 230, y1: 100, x2: 300, y2: 100, label: "" },
      { x1: 390, y1: 85, x2: 470, y2: 85, label: "tool_call" },
      { x1: 470, y1: 115, x2: 390, y2: 115, label: "tool_result", reverse: true },
    ],
  };
  return (
    <svg className="askill-svg" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="askill-heading">{titles[phase]}</text>
      {/* Nodes */}
      {nodes.map((n, i) => {
        const activeNodes = { 0: [0, 1], 1: [1, 2], 2: [2, 3] };
        const isActive = activeNodes[phase].includes(i);
        return (
          <g key={i} className={`askill-invoke-node ${isActive ? "is-active" : ""}`}>
            <rect x={n.cx - 50} y={n.cy - 28} width={100} height={56} rx={12}
              className="askill-invoke-box" style={{ "--sk-c": n.color }} />
            <text x={n.cx} y={n.cy - 4} className="askill-invoke-name" fill={n.color}>{n.label}</text>
            <text x={n.cx} y={n.cy + 14} className="askill-invoke-sub">{n.sub}</text>
          </g>
        );
      })}
      {/* Arrows */}
      {(activeArrows[phase] || []).map((a, i) => (
        <g key={i}>
          <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
            className={`askill-invoke-arrow ${a.reverse ? "askill-invoke-arrow--return" : ""}`}
            markerEnd="url(#askill-arr)" />
          {a.label && <text x={(a.x1 + a.x2) / 2} y={a.reverse ? a.y1 + 18 : a.y1 - 10} className="askill-invoke-label">{a.label}</text>}
        </g>
      ))}
      {/* Phase detail */}
      {phase === 0 && <>
        <rect x={130} y={155} width={340} height={36} rx={8} className="askill-detail-box" />
        <text x={300} y={178} className="askill-detail-text">Registry 返回匹配的 Skill 描述注入 LLM Prompt</text>
      </>}
      {phase === 1 && <>
        <rect x={130} y={155} width={340} height={50} rx={8} className="askill-detail-box" />
        <text x={300} y={174} className="askill-detail-text">LLM 语义匹配最佳 Skill</text>
        <text x={300} y={194} className="askill-detail-text">根据 input_schema 构造参数</text>
      </>}
      {phase === 2 && <>
        <rect x={130} y={155} width={340} height={50} rx={8} className="askill-detail-box" />
        <text x={300} y={174} className="askill-detail-text">Runtime 校验参数 → 执行 Skill</text>
        <text x={300} y={194} className="askill-detail-text">结果回传 LLM 生成答案或继续调用</text>
      </>}
      <text x={300} y={230} className="askill-hint">
        {phase === 0 ? "Agent 从 Registry 获取可用技能" : phase === 1 ? "LLM 基于描述自主选择并填参" : "执行结果驱动下一步决策"}
      </text>
    </svg>
  );
}

/* ── Loop Scene ── */
function LoopScene() {
  const loopNodes = [
    { label: "LLM 选择", sub: "选 Skill", cx: 150, cy: 80, color: "#4c78a8" },
    { label: "Tool Call", sub: "构造参数", cx: 450, cy: 80, color: "#d2642a" },
    { label: "执行 Skill", sub: "Runtime", cx: 450, cy: 190, color: "#8c50b4" },
    { label: "判断结果", sub: "继续/结束", cx: 150, cy: 190, color: "#2a6f6b" },
  ];
  const arrows = [
    { x1: 210, y1: 80, x2: 390, y2: 80 },
    { x1: 450, y1: 110, x2: 450, y2: 160 },
    { x1: 390, y1: 190, x2: 210, y2: 190 },
    { x1: 150, y1: 160, x2: 150, y2: 110 },
  ];
  return (
    <svg className="askill-svg" viewBox="0 0 600 270" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="askill-heading">调用闭环与多轮迭代</text>
      {arrows.map((a, i) => (
        <line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
          className="askill-loop-arrow" markerEnd="url(#askill-arr)" />
      ))}
      {loopNodes.map((n, i) => (
        <g key={i} className="askill-loop-node" style={{ "--sk-delay": `${i * 0.2}s` }}>
          <rect x={n.cx - 60} y={n.cy - 22} width={120} height={44} rx={12}
            className="askill-loop-box" style={{ "--sk-c": n.color }} />
          <text x={n.cx} y={n.cy - 2} className="askill-loop-label" fill={n.color}>{n.label}</text>
          <text x={n.cx} y={n.cy + 16} className="askill-loop-sub">{n.sub}</text>
        </g>
      ))}
      <text x={300} y={140} className="askill-center-label">Skill Loop</text>
      <line x1={150} y1={220} x2={300} y2={250} className="askill-arrow askill-arrow--answer" strokeDasharray="5 3" markerEnd="url(#askill-arr-green)" />
      <rect x={300} y={235} width={140} height={28} rx={8} className="askill-answer-box" />
      <text x={370} y={254} className="askill-answer-label">Final Answer</text>
      <defs>
        <marker id="askill-arr-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(42,111,107,0.6)" /></marker>
      </defs>
    </svg>
  );
}

/* ── Example Scene ── */
function ExampleScene() {
  const skills = [
    { name: "parse_resume", desc: "解析简历结构", result: "姓名/学历/技能", color: "#4c78a8" },
    { name: "match_jd", desc: "匹配岗位要求", result: "匹配度 85%", color: "#d2642a" },
    { name: "rank_candidates", desc: "排序候选人", result: "Top 3 列表", color: "#2a6f6b" },
  ];
  return (
    <svg className="askill-svg" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="askill-heading">实战：智能简历筛选</text>
      {/* Task */}
      <rect x={200} y={42} width={200} height={32} rx={8} className="askill-ex-task" />
      <text x={300} y={63} className="askill-ex-task-label">任务：筛选 SRE 候选人</text>
      {/* Skills chain */}
      {skills.map((s, i) => {
        const y = 95 + i * 60;
        return (
          <g key={i} className="askill-ex-row" style={{ "--sk-delay": `${i * 0.25}s` }}>
            <text x={30} y={y + 4} className="askill-ex-step">Step {i + 1}</text>
            <rect x={80} y={y - 16} width={150} height={34} rx={8} className="askill-ex-box" style={{ "--sk-c": s.color }} />
            <text x={155} y={y + 5} className="askill-ex-name" fill={s.color}>{s.name}</text>
            <line x1={230} y1={y + 1} x2={270} y2={y + 1} className="askill-arrow" markerEnd="url(#askill-arr)" />
            <rect x={270} y={y - 12} width={140} height={26} rx={6} className="askill-ex-desc-box" />
            <text x={340} y={y + 6} className="askill-ex-desc">{s.desc}</text>
            <line x1={410} y1={y + 1} x2={440} y2={y + 1} className="askill-arrow" markerEnd="url(#askill-arr)" />
            <rect x={440} y={y - 12} width={130} height={26} rx={6} className="askill-ex-result-box" style={{ "--sk-c": s.color }} />
            <text x={505} y={y + 6} className="askill-ex-result">{s.result}</text>
          </g>
        );
      })}
      {/* Final */}
      <line x1={300} y1={260} x2={300} y2={248} className="askill-arrow" markerEnd="url(#askill-arr)" />
      <text x={300} y={270} className="askill-hint">三个 Skill 串联 → 输出候选人排名</text>
    </svg>
  );
}

/* ── Phase bar ── */
function PhaseBar({ mode, phase, labels, color }) {
  const tagMap = { overview: "总览", manifest: "定义", registry: "治理", invoke: "调用", loop: "闭环", example: "示例" };
  return (
    <div className="askill-phase-bar" style={{ "--phase-c": color }}>
      <span className="askill-phase-bar__tag">{tagMap[mode]}</span>
      <div className="askill-phase-bar__steps">
        {labels.map((t, i) => (
          <span key={i} className={`askill-phase-bar__step ${i === phase ? "is-active" : ""} ${i < phase ? "is-past" : ""}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AiAgentSkill() {
  const phaseLabels = {
    overview: ["体系总览"],
    manifest: ["Manifest 结构"],
    registry: ["注册治理"],
    invoke: ["技能发现", "LLM 选择", "执行回传"],
    loop: ["调用闭环"],
    example: ["简历筛选"],
  };
  const phaseColors = {
    overview: "#4c78a8",
    manifest: "#2a6f6b",
    registry: "#d2642a",
    invoke: "#8c50b4",
    loop: "#4c78a8",
    example: "#2a6f6b",
  };

  return (
    <TopicShell
      eyebrow="AI 动画"
      title="Agent Skill 体系"
      subtitle="结构化技能封装：定义、注册、发现、选择、执行与反馈闭环。"
      steps={steps}
      panel={[
        { title: "核心", detail: "Skill = 描述 + Schema + 执行器。" },
        { title: "治理", detail: "Registry 管理版本、权限与可观测。" },
        { title: "闭环", detail: "选择 → 调用 → 回传 → 迭代。" },
      ]}
      principles={principles}
      principlesIntro="理解 Skill 的结构化封装、治理机制与调用闭环。"
      flow={["结构化定义", "注册治理", "发现路由", "LLM 选择", "执行回传", "闭环迭代"]}
      diagramClass="askill-diagram"
      renderDiagram={(step) => {
        const { mode, phase } = step;
        const pct = ((steps.findIndex(s => s.id === step.id) + 1) / steps.length) * 100;
        return (
          <div className="askill-scene">
            <div className="askill-progress">
              <div className="askill-progress__fill" style={{ width: `${pct}%` }} />
            </div>
            {mode === "overview" && <OverviewScene />}
            {mode === "manifest" && <ManifestScene />}
            {mode === "registry" && <RegistryScene />}
            {mode === "invoke" && <InvokeScene phase={phase} />}
            {mode === "loop" && <LoopScene />}
            {mode === "example" && <ExampleScene />}
            <PhaseBar mode={mode} phase={phase} labels={phaseLabels[mode]} color={phaseColors[mode]} />
          </div>
        );
      }}
    />
  );
}
