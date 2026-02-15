import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "discover",
    title: "1. 发现能力",
    description: "客户端发现 MCP 服务器暴露的能力与资源。",
    bullets: ["列出资源", "接口自描述"],
    active: "discover",
  },
  {
    id: "connect",
    title: "2. 建立连接",
    description: "通过标准协议连接与鉴权。",
    bullets: ["连接管理", "权限控制"],
    active: "connect",
  },
  {
    id: "invoke",
    title: "3. 调用与返回",
    description: "调用工具/资源并回传结构化结果。",
    bullets: ["统一协议", "结构化输出"],
    active: "invoke",
  },
];

export default function AiMcp() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="MCP 协议架构"
      subtitle="模型、客户端、服务器之间的标准化工具调用。"
      steps={steps}
      panel={[
        { title: "价值", detail: "标准化工具接入与数据共享。" },
        { title: "要点", detail: "能力发现、权限、结构化响应。" },
      ]}
      flow={["客户端发现能力", "建立安全连接", "调用后结构化返回"]}
      diagramClass="ai-mcp"
      renderDiagram={(step) => (
        <div className={`ai-mcp__grid mode--${step.active}`}>
          <div className="mcp-node model">LLM</div>
          <div className="mcp-node client">Client</div>
          <div className="mcp-node server">MCP Server</div>
          <div className="mcp-node resources">Tools/Resources</div>
          <div className="mcp-line line-1" />
          <div className="mcp-line line-2" />
          <div className="mcp-line line-3" />
        </div>
      )}
    />
  );
}
