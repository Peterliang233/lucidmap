import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "server",
    title: "1. Server 暴露能力",
    description: "MCP Server 提供 tools / resources / prompts。",
    bullets: ["可接文件系统、数据库、浏览器、RAG、代码仓库"],
    active: "server",
  },
  {
    id: "question",
    title: "2. 用户提问",
    description: "用户提出任务：搜索本地文档中的 RAG 论文。",
    bullets: ["自然语言需求"],
    active: "question",
  },
  {
    id: "prompt",
    title: "3. Host 提示模型",
    description: "Host 组织上下文与用户问题，发送给模型。",
    bullets: ["上下文拼装", "路由与权限"],
    active: "prompt",
  },
  {
    id: "select",
    title: "4. Model 选择工具",
    description: "模型判断需要调用 search_docs。",
    bullets: ["基于上下文选择 tool"],
    active: "select",
  },
  {
    id: "toolcall",
    title: "5. 输出 Tool Call JSON",
    description: "模型输出标准化 JSON 参数。",
    bullets: ["结构化调用"],
    active: "toolcall",
  },
  {
    id: "mcp",
    title: "6. Host 转 MCP 请求",
    description: "Host 解析 tool call 并发送 MCP 协议请求。",
    bullets: ["权限控制", "多 Server 管理"],
    active: "mcp",
  },
  {
    id: "execute",
    title: "7. Server 执行搜索",
    description: "MCP Server 执行工具并返回结果。",
    bullets: ["tools/call -> result"],
    active: "execute",
  },
  {
    id: "return",
    title: "8. 结果回传 Model",
    description: "Host 将工具结果回传给模型。",
    bullets: ["结构化结果"],
    active: "return",
  },
  {
    id: "answer",
    title: "9. Model 生成回答",
    description: "模型结合结果生成最终答案。",
    bullets: ["LLM 驱动 + 协议调度"],
    active: "answer",
  },
  {
    id: "deliver",
    title: "10. 返回给用户",
    description: "Host 将最终回答展示给用户。",
    bullets: ["UI 输出"],
    active: "deliver",
  },
];

const lifelines = [
  { id: "user", label: "User" },
  { id: "host", label: "MCP Host (App)" },
  { id: "model", label: "Model (LLM)" },
  { id: "server", label: "MCP Server" },
];

const messages = [
  { id: "question", from: "user", to: "host", label: "问题：搜索本地 RAG 论文" },
  { id: "prompt", from: "host", to: "model", label: "prompt + context" },
  { id: "select", from: "model", to: "host", label: "选择工具 search_docs" },
  { id: "toolcall", from: "model", to: "host", label: "tool call JSON" },
  { id: "mcp", from: "host", to: "server", label: "MCP 请求 tools/call" },
  { id: "execute", from: "server", to: "host", label: "result: docs" },
  { id: "return", from: "host", to: "model", label: "tool result" },
  { id: "answer", from: "model", to: "host", label: "final answer" },
  { id: "deliver", from: "host", to: "user", label: "展示给用户" },
];

const principles = [
  {
    title: "分层职责",
    detail: "Host 负责权限与路由，Server 提供能力。",
    points: ["Host 统一上下文与安全", "Server 暴露 tools/resources/prompts", "Model 只选择与决策"],
  },
  {
    title: "协议优势",
    detail: "标准化 JSON-RPC 让调用可移植。",
    points: ["统一请求/响应格式", "工具可插拔", "多 Server 并行扩展"],
  },
  {
    title: "示例链路",
    detail: "搜索本地 RAG 论文。",
    points: ["选择 search_docs", "MCP Server 返回文档列表", "模型基于结果生成答案"],
  },
];

export default function AiMcp() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="MCP 协议架构"
      subtitle="以 JSON-RPC 2.0 为底座，统一能力发现、调用与返回。"
      steps={steps}
      panel={[
        { title: "协议基础", detail: "请求/响应/通知三种消息类型。" },
        { title: "能力层级", detail: "tools / resources / prompts。" },
        { title: "传输层", detail: "stdio / Streamable HTTP。" },
      ]}
      principles={principles}
      principlesIntro="从职责划分与协议优势理解 MCP 的调用链路。"
      flow={["模型选择工具", "Host 协议调度", "工具结果回传模型"]}
      diagramClass="ai-mcp"
      renderDiagram={(step) => (
        <div className={`ai-mcp__grid mode--${step.active}`}>
          <div className="mcp-seq" style={{ "--cols": `repeat(${lifelines.length}, minmax(0, 1fr))` }}>
            <div className="mcp-seq__header">
              {lifelines.map((line) => (
                <div
                  key={line.id}
                  className={`mcp-lifeline mcp-lifeline--${line.id} ${
                    step.active === "server" && line.id === "server" ? "is-active" : ""
                  }`}
                >
                  <div className="mcp-lifeline__title">{line.label}</div>
                  {line.id === "host" && (
                    <div className="mcp-lifeline__meta">
                      Host 内含 MCP Client，负责协议转换与权限管理
                    </div>
                  )}
                  {line.id === "server" && (
                    <div className="mcp-lifeline__tags">
                      <span>tools</span>
                      <span>resources</span>
                      <span>prompts</span>
                    </div>
                  )}
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
            <div className={`mcp-note ${step.active === "server" ? "is-active" : ""}`}>
              <h4>MCP Server</h4>
              <p>服务进程，对外暴露 tools/resources/prompts。</p>
              <p>可接：文件系统、数据库、浏览器、RAG、本地代码仓库。</p>
            </div>
            <div className="mcp-note">
              <h4>JSON-RPC 2.0 调用示例</h4>
              <pre>{`// Request
{
  "jsonrpc": "2.0",
  "id": "req-1",
  "method": "tools/call",
  "params": {
    "name": "search_docs",
    "arguments": { "query": "RAG papers" }
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": "req-1",
  "result": {
    "items": [
      { "title": "RAG Survey", "path": "/docs/rag.pdf" },
      { "title": "Retrieval-Augmented Gen", "path": "/docs/rag2.pdf" }
    ]
  }
}`}</pre>
            </div>
          </aside>
        </div>
      )}
    />
  );
}
