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
        <div className={`http-evo mode--${step.active}`}>
          <div className="http-evo__rails">
            <div className="http-evo__lane">Client</div>
            <div className="http-evo__lane">Server</div>
          </div>

          <div className="http-evo__panel http1">
            <div className="http1-conn">
              <div className="http1-tag">单连接</div>
              <div className="http1-queue">
                <span className="http1-req">Req A</span>
                <span className="http1-req">Req B</span>
                <span className="http1-req http1-req--blocked">HOL</span>
              </div>
              <p className="http1-note">队头阻塞导致后续请求被阻塞</p>
            </div>
          </div>

          <div className="http-evo__panel http2">
            <div className="http2-conn">
              <div className="http2-tag">多路复用</div>
              <div className="http2-lanes">
                <div className="http2-lane lane--a">
                  <span className="frame" />
                  <span className="frame" />
                  <span className="frame" />
                </div>
                <div className="http2-lane lane--b">
                  <span className="frame" />
                  <span className="frame" />
                  <span className="frame" />
                </div>
                <div className="http2-lane lane--c">
                  <span className="frame" />
                  <span className="frame" />
                  <span className="frame" />
                </div>
              </div>
              <p className="http2-note">多个 Stream 交错传输，提升并发</p>
            </div>
          </div>

          <div className="http-evo__panel http3">
            <div className="http3-conn">
              <div className="http3-tag">QUIC + 0-RTT</div>
              <div className="http3-handshake">
                <span>0-RTT</span>
                <span className="http3-handshake__dot" />
                <span>Secure</span>
              </div>
              <div className="http3-streams">
                <div className="http3-stream stream--fast">
                  <span />
                  <span />
                </div>
                <div className="http3-stream stream--stable">
                  <span />
                  <span />
                </div>
              </div>
              <div className="http3-loss">丢包</div>
              <p className="http3-note">基于 UDP，丢包不阻塞其他流</p>
            </div>
          </div>
        </div>
      )}
    />
  );
}
