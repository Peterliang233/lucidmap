import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "http1",
    title: "HTTP/1.1",
    description: "请求队头阻塞明显，管线化使用受限。",
    bullets: ["文本协议", "多路复用不足"],
    active: "http1",
  },
  {
    id: "http2",
    title: "HTTP/2",
    description: "二进制分帧 + 多路复用，提高并发效率。",
    bullets: ["头部压缩", "服务端推送"],
    active: "http2",
  },
  {
    id: "http3",
    title: "HTTP/3",
    description: "基于 QUIC，降低连接建立与丢包影响。",
    bullets: ["0-RTT", "避免队头阻塞"],
    active: "http3",
  },
];

const cards = [
  {
    id: "http1",
    title: "HTTP/1.1",
    detail: "文本协议、队头阻塞",
  },
  {
    id: "http2",
    title: "HTTP/2",
    detail: "多路复用、头部压缩",
  },
  {
    id: "http3",
    title: "HTTP/3",
    detail: "QUIC、低延迟",
  },
];

export default function NetworkHttpEvolution() {
  return (
    <TopicShell
      eyebrow="网络协议动画"
      title="HTTP 版本演进"
      subtitle="从 1.1 到 3，看协议如何提升性能与体验。"
      steps={steps}
      panel={[
        { title: "核心变化", detail: "连接复用、传输层升级、延迟优化。" },
        { title: "适用场景", detail: "高并发、弱网、实时交互。" },
      ]}
      flow={["1.1 解决持久连接", "2 引入二进制多路复用", "3 迁移到 QUIC"]}
      diagramClass="http-diagram"
      renderDiagram={(step) => (
        <div className="http-cards">
          {cards.map((card) => (
            <div key={card.id} className={`http-card ${step.active === card.id ? "is-active" : ""}`}>
              <h3>{card.title}</h3>
              <p>{card.detail}</p>
              <div className="http-streams">
                <span />
                <span />
                <span />
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
}
