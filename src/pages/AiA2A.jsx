import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "discover",
    title: "1. AgentCard 发现",
    description: "A2A Client 通过 AgentCard/Registry 识别能力、入口与认证要求。",
    bullets: ["AgentCard 元数据", "能力 + Endpoint + Auth"],
    active: "discover",
  },
  {
    id: "dispatch",
    title: "2. 任务拆解与派发",
    description: "协调器拆分目标并向多个 Agent 发起 Task。",
    bullets: ["Message → Task", "并行派发"],
    active: "dispatch",
  },
  {
    id: "stream",
    title: "3. 并行处理 + 状态流",
    description: "远程 Agent 处理任务并持续回传状态。",
    bullets: ["working 状态", "SSE 流式更新"],
    active: "stream",
  },
  {
    id: "input",
    title: "4. 输入补充",
    description: "当上下文不足时，Agent 要求补充信息。",
    bullets: ["input-required", "回补上下文"],
    active: "input",
  },
  {
    id: "artifact",
    title: "5. Artifact 产出",
    description: "多个 Agent 输出结构化结果或附件。",
    bullets: ["Message + Artifact", "候选方案"],
    active: "artifact",
  },
  {
    id: "deliver",
    title: "6. 汇总交付",
    description: "协调器合并结果并交付最终答案。",
    bullets: ["去重与排序", "最终交付"],
    active: "deliver",
  },
];

const lifelines = [
  { id: "user", label: "User", meta: "需求提出" },
  { id: "coord", label: "Coordinator Agent", meta: "A2A Client" },
  { id: "directory", label: "AgentCard Registry", meta: "Discovery / Auth", tags: ["card", "capability"] },
  { id: "flight", label: "Flight Agent", meta: "Remote Agent" },
  { id: "hotel", label: "Hotel Agent", meta: "Remote Agent" },
];

const laneStatus = {
  discover: {
    user: { label: "目标提出", tone: "muted" },
    coord: { label: "发现 AgentCard", tone: "info" },
    directory: { label: "返回能力", tone: "info" },
    flight: { label: "待命", tone: "muted" },
    hotel: { label: "待命", tone: "muted" },
  },
  dispatch: {
    user: { label: "确认目标", tone: "accent" },
    coord: { label: "拆解派发", tone: "warn" },
    directory: { label: "完成发现", tone: "muted" },
    flight: { label: "任务接受", tone: "accent" },
    hotel: { label: "任务接受", tone: "accent" },
  },
  stream: {
    user: { label: "等待中", tone: "muted" },
    coord: { label: "收集中", tone: "info" },
    directory: { label: "空闲", tone: "muted" },
    flight: { label: "working", tone: "info" },
    hotel: { label: "working", tone: "info" },
  },
  input: {
    user: { label: "补充信息", tone: "warn" },
    coord: { label: "追问确认", tone: "warn" },
    directory: { label: "空闲", tone: "muted" },
    flight: { label: "working", tone: "info" },
    hotel: { label: "input-required", tone: "danger" },
  },
  artifact: {
    user: { label: "等待对比", tone: "muted" },
    coord: { label: "合并候选", tone: "accent" },
    directory: { label: "空闲", tone: "muted" },
    flight: { label: "Artifacts", tone: "success" },
    hotel: { label: "Artifacts", tone: "success" },
  },
  deliver: {
    user: { label: "确认方案", tone: "accent" },
    coord: { label: "交付结果", tone: "success" },
    directory: { label: "空闲", tone: "muted" },
    flight: { label: "完成", tone: "muted" },
    hotel: { label: "完成", tone: "muted" },
  },
};

const messages = [
  {
    id: "discover",
    from: "coord",
    to: "directory",
    label: "GET AgentCard (well-known)",
  },
  {
    id: "discover",
    from: "directory",
    to: "coord",
    label: "capability + auth + endpoint",
  },
  {
    id: "dispatch",
    from: "user",
    to: "coord",
    label: "目标: 规划东京出差",
  },
  {
    id: "dispatch",
    from: "coord",
    to: "flight",
    label: "create Task: 最优航班",
  },
  {
    id: "dispatch",
    from: "coord",
    to: "hotel",
    label: "create Task: 酒店筛选",
  },
  {
    id: "stream",
    from: "flight",
    to: "coord",
    label: "status stream: working",
    variant: "stream",
  },
  {
    id: "stream",
    from: "hotel",
    to: "coord",
    label: "status stream: working",
    variant: "stream",
  },
  {
    id: "input",
    from: "hotel",
    to: "coord",
    label: "input-required: 入住日期",
    variant: "input",
  },
  {
    id: "input",
    from: "coord",
    to: "user",
    label: "确认入住日期",
    variant: "input",
  },
  {
    id: "input",
    from: "user",
    to: "coord",
    label: "3/10-3/12（示例）",
    variant: "input",
  },
  {
    id: "input",
    from: "coord",
    to: "hotel",
    label: "补充输入: 入住日期",
    variant: "input",
  },
  {
    id: "input",
    from: "hotel",
    to: "coord",
    label: "status stream: working",
    variant: "stream",
  },
  {
    id: "artifact",
    from: "flight",
    to: "coord",
    label: "artifact: 航班候选 x3",
    variant: "artifact",
  },
  {
    id: "artifact",
    from: "hotel",
    to: "coord",
    label: "artifact: 酒店候选 x3",
    variant: "artifact",
  },
  {
    id: "deliver",
    from: "coord",
    to: "user",
    label: "行程汇总 + 推荐",
  },
];

const exampleNotes = {
  discover: "示例: 协调器先发现航班/酒店 Agent 的入口与能力。",
  dispatch: "示例: 将出差目标拆成“机票/酒店”两个并行任务。",
  stream: "示例: 两个 Agent 并行处理，实时回报进度。",
  input: "示例: 酒店 Agent 要求补充入住日期。",
  artifact: "示例: 返回候选列表，等待协调器对比排序。",
  deliver: "示例: 生成最终行程建议并交付给用户。",
};

export default function AiA2A() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="A2A 协作机制"
      subtitle="基于 Agent2Agent 协议的多 Agent 协作流程。"
      steps={steps}
      interval={3200}
      panel={[
        { title: "发现机制", detail: "AgentCard / Registry 发现能力与入口。" },
        { title: "任务模型", detail: "Task + Message + Artifact。" },
        { title: "通信形态", detail: "JSON-RPC / HTTP / SSE。" },
      ]}
      flow={["发现 Agent", "任务拆解", "并行处理", "状态与补充", "Artifact 产出", "汇总交付"]}
      diagramClass="ai-a2a"
      renderDiagram={(step) => (
        <div className={`ai-a2a__grid mode--${step.active}`}>
          <div className="mcp-seq a2a-seq" style={{ "--cols": `repeat(${lifelines.length}, minmax(0, 1fr))` }}>
            <div className="mcp-seq__header">
              {lifelines.map((line) => {
                const isActive = Object.keys(laneStatus).includes(step.active) && laneStatus[step.active][line.id];
                const status = laneStatus[step.active]?.[line.id];
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
                    {status && (
                      <div className={`a2a-status a2a-status--${status.tone}`}>{status.label}</div>
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

              {messages.map((message, index) => {
                const fromIndex = lifelines.findIndex((line) => line.id === message.from);
                const toIndex = lifelines.findIndex((line) => line.id === message.to);
                const fromPercent = ((fromIndex + 0.5) / lifelines.length) * 100;
                const toPercent = ((toIndex + 0.5) / lifelines.length) * 100;
                const start = Math.min(fromPercent, toPercent);
                const end = Math.max(fromPercent, toPercent);
                const mid = (fromPercent + toPercent) / 2;
                const isActive = step.active === message.id;
                const variantClass = message.variant ? `a2a-row--${message.variant}` : "";
                return (
                  <div
                    key={`${message.id}-${index}`}
                    className={`mcp-row ${variantClass} ${isActive ? "is-active" : ""}`}
                    style={{ "--start": `${start}%`, "--end": `${end}%`, "--mid": `${mid}%` }}
                  >
                    <div className={`mcp-line ${fromIndex > toIndex ? "is-reverse" : ""}`} />
                    <div className="mcp-label">{message.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="mcp-seq__aside a2a-seq__aside">
            <div className={`mcp-note ${step.active === "discover" ? "is-active" : ""}`}>
              <h4>AgentCard 发现</h4>
              <p>通过 AgentCard/Registry 找到能力、入口与权限信息。</p>
              <p>发现完成后即可发起 A2A 任务。</p>
            </div>
            <div className={`mcp-note ${step.active === "dispatch" || step.active === "stream" ? "is-active" : ""}`}>
              <h4>任务与状态</h4>
              <p>每个请求都会生成 Task，状态可持续更新。</p>
              <p>适合长任务与多 Agent 并行。</p>
            </div>
            <div className={`mcp-note ${step.active === "input" ? "is-active" : ""}`}>
              <h4>输入补充</h4>
              <p>上下文不足时返回 InputRequired。</p>
              <p>协调器补充信息后继续推进。</p>
            </div>
            <div className={`mcp-note ${step.active === "artifact" || step.active === "deliver" ? "is-active" : ""}`}>
              <h4>Example</h4>
              <p>{exampleNotes[step.active] || exampleNotes.artifact}</p>
            </div>
          </aside>
        </div>
      )}
    />
  );
}
