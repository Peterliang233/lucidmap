import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "syn",
    title: "1. SYN",
    description: "客户端发送 SYN 包，申请建立连接。",
    bullets: ["标记 SYN=1", "选择初始序列号 x"],
    active: "syn",
  },
  {
    id: "syn-ack",
    title: "2. SYN-ACK",
    description: "服务端确认并返回 SYN-ACK。",
    bullets: ["ACK=x+1", "SYN=1，序列号 y"],
    active: "syn-ack",
  },
  {
    id: "ack",
    title: "3. ACK",
    description: "客户端发送 ACK，连接建立完成。",
    bullets: ["ACK=y+1", "进入 ESTABLISHED"],
    active: "ack",
  },
  {
    id: "data",
    title: "4. 数据传输",
    description: "握手完成后，开始可靠数据传输。",
    bullets: ["序列号递增", "基于 ACK 确认"],
    active: "data",
  },
];

const messages = [
  { id: "syn", from: "client", label: "SYN x" },
  { id: "syn-ack", from: "server", label: "SYN y / ACK x+1" },
  { id: "ack", from: "client", label: "ACK y+1" },
  { id: "data", from: "client", label: "DATA" },
  { id: "data-reply", from: "server", label: "ACK" },
];

export default function NetworkTcpHandshake() {
  return (
    <TopicShell
      eyebrow="网络协议动画"
      title="TCP 三次握手"
      subtitle="通过消息时序展示可靠连接建立流程。"
      steps={steps}
      panel={[
        { title: "目的", detail: "可靠建立连接，确保双方具备收发能力。" },
        { title: "状态机", detail: "CLOSED → SYN-SENT → ESTABLISHED。" },
      ]}
      flow={["三次握手避免旧连接复用", "序列号用于可靠传输", "ACK 保证双方可达"]}
      diagramClass="tcp-diagram"
      renderDiagram={(step) => (
        <div className="tcp-grid">
          <div className="tcp-column">
            <div className="tcp-node">Client</div>
          </div>
          <div className="tcp-column">
            <div className="tcp-node">Server</div>
          </div>

          <div className="tcp-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`tcp-message tcp-message--${message.from} ${
                  step.active === message.id || (step.active === "data" && message.id.startsWith("data"))
                    ? "is-active"
                    : ""
                }`}
              >
                <span>{message.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
