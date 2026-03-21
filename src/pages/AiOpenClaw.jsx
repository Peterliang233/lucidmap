import TopicShell from "../components/TopicShell.jsx";

const lifelines = [
  { id: "channel", label: "Channel", meta: "Web / CLI / App" },
  { id: "gateway", label: "Gateway", meta: "鉴权/路由/会话锁" },
  { id: "context", label: "Context", meta: "assemble / compact" },
  { id: "loop", label: "Agent Loop", meta: "turn state" },
  { id: "model", label: "Model", meta: "reply / toolcall" },
  { id: "exec", label: "Tools/Nodes", meta: "plugins + device" },
  { id: "store", label: "Memory/WS", meta: "markdown + workspace" },
];

const steps = [
  {
    id: "ingress",
    title: "1. 入口事件进入",
    description: "用户消息进入 Channel，随后进入 Gateway 做鉴权、校验与 session 路由。",
    bullets: ["typed API：便于追踪与回放", "session 串行化（write lock）避免并发状态污染"],
    active: "ingress",
    focus: ["channel", "gateway"],
  },
  {
    id: "dispatch",
    title: "2. Gateway 分发到 Loop",
    description: "Gateway 将事件封装成 frame，下发给 Agent Loop 进入一次 turn。",
    bullets: ["统一事件格式", "可选：流式输出管道初始化"],
    active: "dispatch",
    focus: ["gateway", "loop"],
  },
  {
    id: "prep",
    title: "3. 准备 Workspace/Skills",
    description: "Loop 根据任务加载 skills、读取工作区关键文件，准备后续上下文注入。",
    bullets: ["skills：工具 + prompt 片段 + 配置", "workspace：文件/产物/临时输出统一落盘"],
    active: "prep",
    focus: ["loop", "store"],
  },
  {
    id: "assemble",
    title: "4. 组装上下文",
    description: "Loop 调用 Context Engine 进行 assemble/compact，并按 token budget 组织 system/messages。",
    bullets: ["保留证据，压缩历史", "必要时从 memory/workspace 检索补全"],
    active: "assemble",
    focus: ["loop", "context", "store"],
  },
  {
    id: "model_call",
    title: "5. 调用模型",
    description: "Loop 将 system prompt + messages 发送给模型，等待 reply 或 tool call。",
    bullets: ["system = base + skills + bootstrap + overrides", "输出：文本或结构化 tool call"],
    active: "model_call",
    focus: ["loop", "model"],
  },
  {
    id: "toolcall",
    title: "6. 模型提出工具调用",
    description: "模型返回 tool call，Loop 解析并决定执行（可能需要权限/确认）。",
    bullets: ["结构化参数减少歧义", "失败可重试/降级/换工具"],
    active: "toolcall",
    focus: ["model", "loop"],
  },
  {
    id: "execute",
    title: "7. 执行 Tools/Nodes",
    description: "Loop 调用 tools 或 nodes，获取外部证据或多媒体产物。",
    bullets: ["tools：API 能力", "nodes：设备能力（画布/相机/语音等）"],
    active: "execute",
    focus: ["loop", "exec"],
  },
  {
    id: "result",
    title: "8. 结果回灌与二次推理",
    description: "执行结果回到 Loop，再次驱动模型完成最终回答或下一轮工具调用。",
    bullets: ["结果结构化回传", "支持多轮：tool -> result -> model"],
    active: "result",
    focus: ["exec", "loop", "model"],
  },
  {
    id: "memory",
    title: "9. 记忆沉淀与交付",
    description: "将稳定可复用信息写入 Markdown 记忆，并把最终答复回传给 Channel。",
    bullets: ["记忆落盘便于 diff/回滚/迁移", "交付：answer -> channel"],
    active: "memory",
    focus: ["loop", "store", "gateway", "channel"],
  },
];

const messages = [
  { id: "ingress", from: "channel", to: "gateway", label: "event: message.create" },
  { id: "dispatch", from: "gateway", to: "loop", label: "dispatch frame + lock(session)" },
  { id: "prep", from: "loop", to: "store", label: "load skills + read workspace" },
  { id: "assemble", from: "loop", to: "context", label: "assemble(context, budget)" },
  { id: "assemble_back", from: "context", to: "loop", label: "context bundle + compaction" },
  { id: "model_call", from: "loop", to: "model", label: "system + messages" },
  { id: "toolcall", from: "model", to: "loop", label: "tool_call JSON" },
  { id: "execute", from: "loop", to: "exec", label: "tools/nodes execute" },
  { id: "result", from: "exec", to: "loop", label: "result + artifacts" },
  { id: "result_model", from: "loop", to: "model", label: "tool result -> finalize" },
  { id: "memory", from: "loop", to: "store", label: "write MEMORY.md + artifacts" },
  { id: "deliver", from: "gateway", to: "channel", label: "final answer (stream)" },
];

const principles = [
  {
    title: "入口与串行化",
    detail: "Gateway 统一把输入变成可运行的帧。",
    points: ["typed API 让事件可追踪", "session write lock 避免并发污染", "统一鉴权/校验/路由"],
  },
  {
    title: "上下文预算管理",
    detail: "Context engine 负责 assemble/compact。",
    points: ["把 token 当预算", "保留证据，压缩历史", "必要时检索 memory/workspace"],
  },
  {
    title: "Loop 驱动模型与工具",
    detail: "tool -> result -> model 的可重复闭环。",
    points: ["模型负责决策与生成", "执行器负责外部证据", "结果结构化回灌可复用"],
  },
  {
    title: "记忆落盘",
    detail: "把长期知识从 prompt 解耦。",
    points: ["Markdown 便于 diff/回滚/迁移", "随用随取而不是全塞 prompt", "沉淀稳定事实与偏好约束"],
  },
];

const stepNotes = {
  ingress: {
    title: "入口帧（抽象）",
    code: `{
  "session": "s-42",
  "event": "message.create",
  "payload": { "text": "..." }
}`,
  },
  assemble: {
    title: "Context Budget（思路）",
    code: `tokens:
  system: 1.2k
  history: 3.0k
  memory: 0.8k
  reserve: 1.5k`,
  },
  toolcall: {
    title: "Tool Call（抽象）",
    code: `tool: "browser.open"
args: { "url": "..." }
-> result: { "status": "ok" }`,
  },
  memory: {
    title: "Memory 写入（抽象）",
    code: `# MEMORY.md
- preference: ...
- constraint: ...
- artifacts: ...`,
  },
};

function OpenClawSequence(step) {
  const focus = new Set(step.focus || []);
  const note = stepNotes[step.active] || null;
  return (
    <div className={`ai-openclaw__grid mode--${step.active}`}>
      <div className="oc-seq-wrap">
        <div className="mcp-seq" style={{ "--cols": `repeat(${lifelines.length}, minmax(0, 1fr))` }}>
          <div className="mcp-seq__header">
            {lifelines.map((line) => (
              <div
                key={line.id}
                className={`mcp-lifeline mcp-lifeline--${line.id} ${focus.has(line.id) ? "is-active" : ""}`}
              >
                <div className="mcp-lifeline__title">{line.label}</div>
                <div className="mcp-lifeline__meta">{line.meta}</div>
              </div>
            ))}
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

              // "assemble" step also highlights the return bundle line.
              const isActive =
                step.active === message.id || (step.active === "assemble" && message.id === "assemble_back") ||
                (step.active === "result" && message.id === "result_model") ||
                (step.active === "memory" && message.id === "deliver");

              return (
                <div
                  key={message.id}
                  className={`mcp-row ${isActive ? "is-active" : ""}`}
                  style={{ "--start": `${start}%`, "--end": `${end}%`, "--mid": `${mid}%` }}
                >
                  <div className={`mcp-line ${fromIndex > toIndex ? "is-reverse" : ""}`} />
                  <div className="mcp-label">{message.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="mcp-seq__aside">
        <div className={`mcp-note ${note ? "is-active" : ""}`}>
          <h4>{note ? note.title : "提示"}</h4>
          <p>
            时序图按一次 turn 展示：入口事件 {"->"} 组装上下文 {"->"} 模型 {"->"} 工具/节点 {"->"} 结果回灌 {"->"} 记忆与交付。
          </p>
          <pre>{note ? note.code : `focus: ${step.focus?.join(", ") || "-"}`}</pre>
        </div>
        <div className="mcp-note">
          <h4>一轮执行的最小闭环</h4>
          <pre>{`loop:
  assemble(context)
  model()
  if tool_call: exec() -> result -> model()
  write memory
  deliver`}</pre>
        </div>
      </aside>
    </div>
  );
}

export default function AiOpenClaw() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="OpenClaw 原理解析"
      subtitle="用时序图拆解一次 turn：入口事件、上下文组装、模型推理、工具/节点执行、记忆沉淀与交付。"
      steps={steps}
      interval={2600}
      panel={[
        { title: "可追踪", detail: "入口事件、消息行、结果回灌都能定位到具体一行。" },
        { title: "可控上下文", detail: "Context engine 以 token budget 管理 assemble/compact。" },
        { title: "可插拔执行", detail: "Tools/Nodes 分层，统一回传 result + artifacts。" },
      ]}
      principles={principles}
      principlesIntro="相比模块连线图，时序图更直观地呈现数据与控制流。"
      diagramClass="ai-openclaw"
      renderDiagram={(step) => OpenClawSequence(step)}
    />
  );
}
