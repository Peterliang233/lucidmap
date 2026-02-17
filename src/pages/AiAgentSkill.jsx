import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "define",
    title: "1. 定义 Skill",
    description: "以结构化方式描述技能能力与接口。",
    bullets: ["name / description", "JSON Schema 接口", "执行函数"],
    active: "define",
  },
  {
    id: "register",
    title: "2. 注册 Skill",
    description: "将 Skill 进入注册表，便于检索与治理。",
    bullets: ["版本与权限", "标签与场景"],
    active: "register",
  },
  {
    id: "task",
    title: "3. 任务进入",
    description: "用户提出目标，Agent 接管任务。",
    bullets: ["目标与约束", "上下文输入"],
    active: "task",
  },
  {
    id: "discover",
    title: "4. 拉取技能清单",
    description: "Agent 获取可用技能与接口描述。",
    bullets: ["清单 + 元数据", "能力匹配"],
    active: "discover",
  },
  {
    id: "select",
    title: "5. 选择与参数化",
    description: "模型基于描述挑选 Skill 并填充参数。",
    bullets: ["基于描述选择", "参数准备"],
    active: "select",
  },
  {
    id: "call",
    title: "6. 生成 Tool Call",
    description: "输出结构化调用参数，进入执行层。",
    bullets: ["JSON 结构", "可验证参数"],
    active: "call",
  },
  {
    id: "execute",
    title: "7. 执行 Skill",
    description: "Skill 运行并返回结果。",
    bullets: ["执行器调用", "结果产出"],
    active: "execute",
  },
  {
    id: "return",
    title: "8. 结果回传模型",
    description: "工具结果回到模型参与回答生成。",
    bullets: ["tool result", "结构化结果"],
    active: "return",
  },
  {
    id: "answer",
    title: "9. 生成答复",
    description: "模型基于结果生成最终输出。",
    bullets: ["结合上下文", "生成响应"],
    active: "answer",
  },
  {
    id: "deliver",
    title: "10. 交付输出",
    description: "Agent 将结果交付给用户。",
    bullets: ["自然语言", "动作/调用"],
    active: "deliver",
  },
];

const lifelines = [
  { id: "user", label: "User / Builder", meta: "定义/维护 Skill" },
  { id: "registry", label: "Skill Registry", tags: ["manifest", "schema", "policy"] },
  { id: "agent", label: "Agent Core", meta: "Planner + Router" },
  { id: "model", label: "Model (LLM)", meta: "选择与生成" },
  { id: "runtime", label: "Skill Runtime", meta: "Tool Runner" },
];

const messages = [
  { id: "define", from: "user", to: "registry", label: "注册 Skill manifest" },
  { id: "register", from: "user", to: "registry", label: "发布版本 / 权限" },
  { id: "task", from: "user", to: "agent", label: "任务/目标" },
  { id: "discover", from: "agent", to: "registry", label: "请求技能清单" },
  { id: "select", from: "registry", to: "agent", label: "返回描述 + schema" },
  { id: "call", from: "agent", to: "runtime", label: "tool call JSON" },
  { id: "execute", from: "runtime", to: "agent", label: "result / artifact" },
  { id: "return", from: "agent", to: "model", label: "tool result" },
  { id: "answer", from: "model", to: "agent", label: "final answer" },
  { id: "deliver", from: "agent", to: "user", label: "答复 / 行动" },
];

const principles = [
  {
    title: "结构化定义",
    detail: "Skill = 描述 + Schema + 执行器。",
    points: ["描述驱动模型选择", "Schema 校验参数", "执行器产出可用结果"],
  },
  {
    title: "治理与版本",
    detail: "注册表管理权限、版本与可观测。",
    points: ["权限控制调用范围", "版本变更可回滚", "统计调用效果"],
  },
  {
    title: "调用闭环",
    detail: "选择 → 调用 → 回传 → 生成。",
    points: ["tool call 结构化", "结果回注模型", "输出与反馈迭代"],
  },
];

export default function AiAgentSkill() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="Agent Skill 体系"
      subtitle="以结构化技能为核心，形成选择、调用与反馈的闭环。"
      steps={steps}
      panel={[
        { title: "核心", detail: "Skill = 描述 + Schema + 执行器。" },
        { title: "选择", detail: "模型基于描述与上下文挑选技能。" },
        { title: "闭环", detail: "执行回传 + 观测迭代。" },
      ]}
      principles={principles}
      principlesIntro="拆解 Skill 的定义、治理与调用闭环。"
      flow={["结构化定义", "路由选择", "执行回传", "结果生成"]}
      diagramClass="ai-skill"
      renderDiagram={(step) => (
        <div className={`ai-skill__grid mode--${step.active}`}>
          <div className="mcp-seq" style={{ "--cols": `repeat(${lifelines.length}, minmax(0, 1fr))` }}>
            <div className="mcp-seq__header">
              {lifelines.map((line) => {
                const activeLines = {
                  define: ["user", "registry"],
                  register: ["user", "registry"],
                  task: ["user", "agent"],
                  discover: ["agent", "registry"],
                  select: ["agent", "registry"],
                  call: ["agent", "runtime"],
                  execute: ["runtime", "agent"],
                  return: ["agent", "model"],
                  answer: ["model", "agent"],
                  deliver: ["agent", "user"],
                };
                const isActive = (activeLines[step.active] || []).includes(line.id);
                return (
                  <div
                    key={line.id}
                    className={`mcp-lifeline mcp-lifeline--${line.id} ${isActive ? "is-active" : ""}`}
                  >
                    <div className="mcp-lifeline__title">{line.label}</div>
                    {line.meta && <div className="mcp-lifeline__meta">{line.meta}</div>}
                    {line.tags && (
                      <div className="mcp-lifeline__tags">
                        {line.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mcp-seq__body">
              <div className="mcp-seq__lines">
                {lifelines.map((line, index) => (
                  <span key={line.id} style={{ "--x": `${((index + 0.5) / lifelines.length) * 100}%` }} />
                ))}
              </div>

              {messages.map((message) => {
                const fromIndex = lifelines.findIndex((line) => line.id === message.from);
                const toIndex = lifelines.findIndex((line) => line.id === message.to);
                const fromPercent = ((fromIndex + 0.5) / lifelines.length) * 100;
                const toPercent = ((toIndex + 0.5) / lifelines.length) * 100;
                const start = Math.min(fromPercent, toPercent);
                const end = Math.max(fromPercent, toPercent);
                const mid = (fromPercent + toPercent) / 2;
                return (
                  <div
                    key={message.id}
                    className={`mcp-row ${step.active === message.id ? "is-active" : ""}`}
                    style={{ "--start": `${start}%`, "--end": `${end}%`, "--mid": `${mid}%` }}
                  >
                    <div className={`mcp-line ${fromIndex > toIndex ? "is-reverse" : ""}`} />
                    <div className="mcp-label">{message.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="mcp-seq__aside">
            <div className={`mcp-note ${step.active === "define" ? "is-active" : ""}`}>
              <h4>Skill Manifest</h4>
              <p>包含名称、描述、JSON Schema 与执行器。</p>
              <p>用于模型选择与参数校验。</p>
            </div>
            <div className={`mcp-note ${step.active === "call" ? "is-active" : ""}`}>
              <h4>Tool Call 结构</h4>
              <pre>{`{
  "name": "rank_resume",
  "arguments": { "title": "SRE", "skills": ["k8s", "linux"] }
}`}</pre>
            </div>
            <div className={`mcp-note ${step.active === "return" || step.active === "answer" ? "is-active" : ""}`}>
              <h4>结果驱动生成</h4>
              <p>工具结果回传给模型，形成最终回答或动作。</p>
              <p>将结构化结果转为用户可用输出。</p>
            </div>
          </aside>
        </div>
      )}
    />
  );
}
