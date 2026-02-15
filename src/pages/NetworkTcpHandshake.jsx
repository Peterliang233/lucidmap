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
  {
    id: "fin-1",
    title: "5. FIN",
    description: "主动关闭方发送 FIN，申请关闭连接。",
    bullets: ["FIN=1", "进入 FIN-WAIT-1"],
    active: "fin-1",
  },
  {
    id: "fin-ack",
    title: "6. ACK",
    description: "被动关闭方确认 FIN。",
    bullets: ["ACK=fin+1", "进入 CLOSE-WAIT"],
    active: "fin-ack",
  },
  {
    id: "fin-2",
    title: "7. FIN",
    description: "被动关闭方发送 FIN，准备关闭。",
    bullets: ["FIN=1", "进入 LAST-ACK"],
    active: "fin-2",
  },
  {
    id: "fin-close",
    title: "8. ACK",
    description: "主动关闭方确认，进入 TIME-WAIT。",
    bullets: ["ACK=fin+1", "等待 2MSL"],
    active: "fin-close",
  },
];

const messages = [
  { id: "syn", from: "client", label: "SYN x" },
  { id: "syn-ack", from: "server", label: "SYN y / ACK x+1" },
  { id: "ack", from: "client", label: "ACK y+1" },
  { id: "data", from: "client", label: "DATA" },
  { id: "data-reply", from: "server", label: "ACK" },
  { id: "fin-1", from: "client", label: "FIN" },
  { id: "fin-ack", from: "server", label: "ACK fin+1" },
  { id: "fin-2", from: "server", label: "FIN" },
  { id: "fin-close", from: "client", label: "ACK fin+1" },
];

export default function NetworkTcpHandshake() {
  return (
    <TopicShell
      eyebrow="网络协议动画"
      title="TCP 三次握手与四次挥手"
      subtitle="通过消息时序展示连接建立与断开流程。"
      steps={steps}
      panel={[
        { title: "目的", detail: "可靠建立连接，确保双方具备收发能力。" },
        { title: "状态机", detail: "CLOSED → SYN-SENT → ESTABLISHED。" },
      ]}
      flow={[
        "三次握手避免旧连接复用",
        "序列号用于可靠传输",
        "四次挥手确保双方数据发送完毕",
      ]}
      diagramClass="tcp-diagram"
      renderDiagram={(step) => (
        <div className="tcp-seq">
          <div className="tcp-header">
            <div className="tcp-header__lane">Client</div>
            <div className="tcp-header__line" aria-hidden="true" />
            <div className="tcp-header__lane">Server</div>
          </div>
          <div className="tcp-body">
            {messages.map((message) => {
              const isActive =
                step.active === message.id ||
                (step.active === "data" && message.id.startsWith("data"));
              const isClient = message.from === "client";

              return (
                <div key={message.id} className={`tcp-row ${isActive ? "is-active" : ""}`}>
                  {isClient ? (
                    <div className={`tcp-bubble tcp-bubble--client ${isActive ? "is-active" : ""}`}>
                      <span>{message.label}</span>
                    </div>
                  ) : (
                    <span className="tcp-spacer" aria-hidden="true" />
                  )}
                  <div className="tcp-line" aria-hidden="true" />
                  {!isClient ? (
                    <div className={`tcp-bubble tcp-bubble--server ${isActive ? "is-active" : ""}`}>
                      <span>{message.label}</span>
                    </div>
                  ) : (
                    <span className="tcp-spacer" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
