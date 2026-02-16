import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "http09",
    title: "HTTP/0.9",
    description: "最早期的简单请求，响应即关闭连接。",
    bullets: ["Simple-Request (无版本/头部)", "Simple-Response 仅实体内容", "短连接 + 单请求"],
    active: "http09",
  },
  {
    id: "http10",
    title: "HTTP/1.0",
    description: "引入完整消息格式与状态码，但默认仍是短连接。",
    bullets: ["Full-Request/Response + Headers", "状态码 + 头部", "一资源一连接"],
    active: "http10",
  },
  {
    id: "http11",
    title: "HTTP/1.1",
    description: "默认持久连接，允许管线化，但响应必须按序。",
    bullets: ["Keep-Alive 默认开启", "Pipelining (顺序响应)", "并发依赖多连接"],
    active: "http11",
  },
  {
    id: "http2",
    title: "HTTP/2",
    description: "引入帧与流层，多路复用在单条连接上。",
    bullets: ["Frame/Stream 交错", "头部压缩", "可选 Server Push"],
    active: "http2",
  },
  {
    id: "http3",
    title: "HTTP/3",
    description: "迁移到 QUIC/UDP，流级别可靠性与低延迟连接。",
    bullets: ["QUIC streams", "TLS 1.3 内置", "0-RTT/丢包不互阻"],
    active: "http3",
  },
];

const stageMeta = {
  http09: {
    transport: { label: "TCP", meta: "短连接" },
    chips: ["无头部", "单请求", "响应后关闭"],
    messages: [
      { id: "h09-connect", from: "client", to: "server", label: "TCP 连接", kind: "setup", animate: true },
      { id: "h09-get", from: "client", to: "server", label: "GET / (Simple-Request)", kind: "request", animate: true, delay: 0.3 },
      { id: "h09-html", from: "server", to: "client", label: "HTML 字节流", kind: "response", animate: true, delay: 0.6 },
      { id: "h09-close", from: "server", to: "client", label: "响应后关闭", kind: "teardown" },
    ],
  },
  http10: {
    transport: { label: "TCP", meta: "默认短连接" },
    chips: ["头部与状态码", "Full-Request", "一资源一连接"],
    messages: [
      { id: "h10-connect", from: "client", to: "server", label: "TCP 连接", kind: "setup", animate: true },
      { id: "h10-req", from: "client", to: "server", label: "GET + Headers", kind: "request", animate: true, delay: 0.3 },
      { id: "h10-res", from: "server", to: "client", label: "Status + Headers", kind: "response", animate: true, delay: 0.6 },
      { id: "h10-close", from: "server", to: "client", label: "响应后关闭", kind: "teardown" },
      { id: "h10-next", from: "client", to: "server", label: "下一资源再建连接", kind: "setup" },
    ],
  },
  http11: {
    transport: { label: "TCP", meta: "Keep-Alive" },
    chips: ["持久连接", "管线化", "按序响应"],
    messages: [
      { id: "h11-connect", from: "client", to: "server", label: "TCP 连接 (Keep-Alive)", kind: "setup", animate: true },
      { id: "h11-req-a", from: "client", to: "server", label: "Req A", kind: "request", animate: true, delay: 0.3 },
      { id: "h11-req-b", from: "client", to: "server", label: "Req B (pipeline)", kind: "request", animate: true, delay: 0.6 },
      { id: "h11-res-a", from: "server", to: "client", label: "Resp A", kind: "response", animate: true, delay: 0.9 },
      {
        id: "h11-res-b",
        from: "server",
        to: "client",
        label: "Resp B (顺序等待)",
        kind: "response",
        blocked: true,
      },
    ],
  },
  http2: {
    transport: { label: "TCP + TLS", meta: "帧化/多路复用" },
    chips: ["Frame/Stream", "头部压缩", "并发复用"],
    legend: [
      { label: "Stream A", className: "stream--a" },
      { label: "Stream B", className: "stream--b" },
      { label: "控制帧", className: "control" },
    ],
    messages: [
      { id: "h2-connect", from: "client", to: "server", label: "TCP + TLS", kind: "setup", animate: true },
      { id: "h2-settings", from: "client", to: "server", label: "Preface / SETTINGS", kind: "control", animate: true, delay: 0.3 },
      { id: "h2-s1-h", from: "client", to: "server", label: "Stream 1 HEADERS", kind: "stream", stream: "a", animate: true, delay: 0.6 },
      { id: "h2-s2-h", from: "client", to: "server", label: "Stream 2 HEADERS", kind: "stream", stream: "b", animate: true, delay: 0.9 },
      { id: "h2-s1-d", from: "server", to: "client", label: "Stream 1 DATA", kind: "stream", stream: "a", animate: true, delay: 1.2 },
      { id: "h2-s2-d", from: "server", to: "client", label: "Stream 2 DATA", kind: "stream", stream: "b", animate: true, delay: 1.5 },
    ],
  },
  http3: {
    transport: { label: "QUIC (UDP + TLS 1.3)", meta: "流级别可靠性" },
    chips: ["QUIC streams", "0-RTT", "丢包不互阻"],
    legend: [
      { label: "Stream A", className: "stream--a" },
      { label: "Stream B", className: "stream--b" },
      { label: "丢包", className: "loss" },
    ],
    messages: [
      { id: "h3-quic", from: "client", to: "server", label: "QUIC Initial + TLS 1.3", kind: "setup", animate: true },
      { id: "h3-0rtt", from: "client", to: "server", label: "0-RTT 早期请求", kind: "request", stream: "a", animate: true, delay: 0.3 },
      { id: "h3-s1", from: "client", to: "server", label: "Stream 1 DATA", kind: "stream", stream: "a", animate: true, delay: 0.6 },
      { id: "h3-loss", from: "client", to: "server", label: "丢包 (Stream 1)", kind: "loss" },
      { id: "h3-s2", from: "server", to: "client", label: "Stream 2 继续", kind: "stream", stream: "b", animate: true, delay: 0.9 },
      { id: "h3-res", from: "server", to: "client", label: "响应回传", kind: "response", animate: true, delay: 1.2 },
    ],
  },
};

export default function NetworkHttpEvolution() {
  return (
    <TopicShell
      eyebrow="网络协议动画"
      title="HTTP 版本演进"
      subtitle="从 0.9 到 3，用时序动画对比关键差异。"
      steps={steps}
      panel={[
        { title: "演进主线", detail: "短连接 → 持久连接 → 多路复用 → QUIC 流独立。" },
        { title: "优化目标", detail: "并发能力、连接成本、弱网体验。" },
      ]}
      flow={[
        "0.9 简单请求",
        "1.0 完整消息格式",
        "1.1 持久连接 + 管线化",
        "2 帧化多路复用",
        "3 QUIC 传输升级",
      ]}
      interval={3200}
      diagramClass="http-diagram"
      renderDiagram={(step) => {
        const stage = stageMeta[step.active] || stageMeta.http09;
        const lifelines = [
          { id: "client", label: "Client", meta: "浏览器/调用方" },
          { id: "transport", label: stage.transport.label, meta: stage.transport.meta },
          { id: "server", label: "Server", meta: "Origin / CDN" },
        ];

        return (
          <div className={`http-evo mode--${step.active}`}>
            <div className="http-evo__header">
              <div className="http-evo__title">时序流程</div>
              <div className="http-evo__chips">
                {stage.chips.map((chip, index) => (
                  <span key={chip} className={`http-chip ${index === 0 ? "is-primary" : ""}`}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="mcp-seq http-seq" style={{ "--cols": `repeat(${lifelines.length}, minmax(0, 1fr))` }}>
              <div className="mcp-seq__header">
                {lifelines.map((line) => (
                  <div
                    key={line.id}
                    className={`mcp-lifeline http-lifeline ${line.id === "transport" ? "is-transport" : ""}`}
                  >
                    <div className="mcp-lifeline__title">{line.label}</div>
                    {line.meta && <div className="mcp-lifeline__meta">{line.meta}</div>}
                  </div>
                ))}
              </div>

              <div className="mcp-seq__body">
                <div className="mcp-seq__lines">
                  {lifelines.map((line, index) => (
                    <span key={line.id} style={{ "--x": `${((index + 0.5) / lifelines.length) * 100}%` }} />
                  ))}
                </div>

                {stage.messages.map((message, index) => {
                  const fromIndex = lifelines.findIndex((line) => line.id === message.from);
                  const toIndex = lifelines.findIndex((line) => line.id === message.to);
                  const fromPercent = ((fromIndex + 0.5) / lifelines.length) * 100;
                  const toPercent = ((toIndex + 0.5) / lifelines.length) * 100;
                  const start = Math.min(fromPercent, toPercent);
                  const end = Math.max(fromPercent, toPercent);
                  const mid = (fromPercent + toPercent) / 2;
                  const delay = message.delay ?? index * 0.25;

                  return (
                    <div
                      key={message.id}
                      className={[
                        "mcp-row",
                        "http-row",
                        message.animate ? "is-active" : "",
                        message.stream ? `stream--${message.stream}` : "",
                        message.kind ? `is-${message.kind}` : "",
                        message.blocked ? "is-blocked" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{
                        "--start": `${start}%`,
                        "--end": `${end}%`,
                        "--mid": `${mid}%`,
                        "--delay": `${delay}s`,
                      }}
                    >
                      <div className={`mcp-line ${fromIndex > toIndex ? "is-reverse" : ""}`} />
                      <div className="mcp-label">{message.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {stage.legend && stage.legend.length > 0 && (
              <div className="http-evo__legend">
                {stage.legend.map((item) => (
                  <span key={item.label} className={`http-legend ${item.className || ""}`}>
                    {item.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
