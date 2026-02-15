import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "client-hello",
    title: "1. ClientHello",
    description: "客户端发起握手，携带支持的加密套件。",
    bullets: ["随机数", "版本与套件"],
    active: "client-hello",
  },
  {
    id: "server-hello",
    title: "2. ServerHello",
    description: "服务端返回证书与协商结果。",
    bullets: ["证书链", "随机数"],
    active: "server-hello",
  },
  {
    id: "key-exchange",
    title: "3. 密钥交换",
    description: "双方协商对称密钥，建立安全通道。",
    bullets: ["ECDHE", "生成会话密钥"],
    active: "key-exchange",
  },
  {
    id: "finished",
    title: "4. Finished",
    description: "握手完成，后续数据使用对称加密。",
    bullets: ["加密传输", "会话复用"],
    active: "finished",
  },
];

const messages = [
  { id: "client-hello", from: "client", label: "ClientHello" },
  { id: "server-hello", from: "server", label: "ServerHello + Cert" },
  { id: "key-exchange", from: "client", label: "Key Exchange" },
  { id: "finished", from: "server", label: "Finished" },
];

export default function NetworkTlsHandshake() {
  return (
    <TopicShell
      eyebrow="网络安全动画"
      title="TLS 握手与证书"
      subtitle="从证书校验到密钥协商，建立安全连接。"
      steps={steps}
      panel={[
        { title: "安全保障", detail: "机密性、完整性、身份认证。" },
        { title: "关键概念", detail: "证书链、对称密钥、前向安全。" },
      ]}
      flow={["握手协商套件", "证书验证身份", "生成会话密钥"]}
      diagramClass="tls-diagram"
      renderDiagram={(step) => (
        <div className="tls-grid">
          <div className="tls-column">
            <div className="tls-node">Client</div>
          </div>
          <div className="tls-column">
            <div className="tls-node">Server</div>
          </div>

          <div className="tls-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`tls-message tls-message--${message.from} ${
                  step.active === message.id ? "is-active" : ""
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
