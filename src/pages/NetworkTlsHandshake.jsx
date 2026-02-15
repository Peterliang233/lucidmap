import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "client-hello",
    title: "1. ClientHello",
    description: "客户端发起握手，携带支持的加密套件。",
    bullets: ["随机数", "版本与套件", "KeyShare"],
    active: "client-hello",
  },
  {
    id: "server-hello",
    title: "2. ServerHello",
    description: "服务端返回证书与协商结果。",
    bullets: ["证书链", "协商套件", "随机数"],
    active: "server-hello",
  },
  {
    id: "verify",
    title: "3. 证书校验",
    description: "客户端验证证书链与域名，确认服务端身份。",
    bullets: ["CA 信任链", "域名校验", "证书有效期"],
    active: "verify",
  },
  {
    id: "key-exchange",
    title: "4. 密钥交换",
    description: "通过 ECDHE 协商会话密钥，具备前向安全。",
    bullets: ["ECDHE", "会话密钥", "前向安全"],
    active: "key-exchange",
  },
  {
    id: "finished",
    title: "5. Finished",
    description: "握手完成，后续数据使用对称加密。",
    bullets: ["对称加密", "完整性校验", "会话复用"],
    active: "finished",
  },
];

const messages = [
  { id: "client-hello", from: "client", label: "ClientHello + KeyShare" },
  { id: "server-hello", from: "server", label: "ServerHello + Certificate" },
  { id: "verify", from: "client", label: "Certificate Verify" },
  { id: "key-exchange", from: "client", label: "Key Exchange" },
  { id: "finished", from: "server", label: "Finished" },
  { id: "finished-client", from: "client", label: "Finished" },
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
        <div className={`tls-seq mode--${step.active}`}>
          <div className="tls-seq__timeline">
            <div className="tls-header">
              <div className="tls-header__lane">Client</div>
              <div className="tls-header__line" aria-hidden="true" />
              <div className="tls-header__lane">Server</div>
            </div>
            <div className="tls-body">
              {messages.map((message) => {
                const isActive =
                  step.active === message.id ||
                  (step.active === "finished" && message.id.startsWith("finished"));
                const isClient = message.from === "client";

                return (
                  <div key={message.id} className={`tls-row ${isActive ? "is-active" : ""}`}>
                    {isClient ? (
                      <div className={`tls-bubble tls-bubble--client ${isActive ? "is-active" : ""}`}>
                        <span>{message.label}</span>
                      </div>
                    ) : (
                      <span className="tls-spacer" aria-hidden="true" />
                    )}
                    <div className="tls-line" aria-hidden="true" />
                    {!isClient ? (
                      <div className={`tls-bubble tls-bubble--server ${isActive ? "is-active" : ""}`}>
                        <span>{message.label}</span>
                      </div>
                    ) : (
                      <span className="tls-spacer" aria-hidden="true" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="tls-channel">Secure Channel</div>
          </div>

          <aside className="tls-principles">
            <div className={`principle-card ${step.active === "server-hello" ? "is-active" : ""}`}>
              <h3>证书链</h3>
              <p>Root CA → Intermediate → Server</p>
              <div className="cert-chain">
                <span>Root</span>
                <span>Intermediate</span>
                <span>Server</span>
              </div>
            </div>
            <div className={`principle-card ${step.active === "verify" ? "is-active" : ""}`}>
              <h3>身份验证</h3>
              <p>校验域名与有效期，防止中间人攻击。</p>
              <div className="verify-badges">
                <span>域名</span>
                <span>签名</span>
                <span>有效期</span>
              </div>
            </div>
            <div className={`principle-card ${step.active === "key-exchange" ? "is-active" : ""}`}>
              <h3>密钥派生</h3>
              <p>ECDHE 生成会话密钥，具备前向安全。</p>
              <div className="key-flow">
                <span>KeyShare</span>
                <span>Derive</span>
                <span>Session Key</span>
              </div>
            </div>
            <div className={`principle-card ${step.active === "finished" ? "is-active" : ""}`}>
              <h3>对称加密</h3>
              <p>数据使用对称密钥加密并校验完整性。</p>
              <div className="secure-badges">
                <span>AES</span>
                <span>HMAC</span>
                <span>0-RTT</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    />
  );
}
