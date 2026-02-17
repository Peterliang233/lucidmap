import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "route",
    title: "1. 路由注册与发现",
    description: "Broker 定期注册到 NameServer，客户端拉取路由并缓存。",
    bullets: ["心跳上报", "路由发现", "无状态集群"],
    active: "route",
  },
  {
    id: "store",
    title: "2. 写入存储链路",
    description: "Producer 选队列发送，Broker 顺序写入并构建索引。",
    bullets: ["CommitLog 顺序写", "ConsumeQueue/Index", "主从复制"],
    active: "store",
  },
  {
    id: "consume",
    title: "3. 拉取消费 + Offset",
    description: "Consumer Pull 拉取消息，更新消费进度并确认。",
    bullets: ["拉取模型", "Offset 提交", "并行消费"],
    active: "consume",
  },
  {
    id: "retry",
    title: "4. 重试与死信",
    description: "失败消息进入重试主题或死信队列，保护主链路。",
    bullets: ["延迟重投", "DLQ 隔离", "问题消息可追溯"],
    active: "retry",
  },
];

const principles = [
  {
    title: "路由发现",
    detail: "Broker 定期向 NameServer 上报路由。",
    points: ["NameServer 无状态", "客户端拉取并缓存", "心跳驱动更新"],
  },
  {
    title: "存储组织",
    detail: "CommitLog 顺序写入，ConsumeQueue 轻量索引。",
    points: ["CommitLog 追加写", "ConsumeQueue 记录偏移", "Index 支持按 key 查询"],
  },
  {
    title: "消费与重试",
    detail: "Pull 拉取并提交进度，失败进入重试或 DLQ。",
    points: ["Pull 模式可控批量", "Offset 保障幂等", "Retry/DLQ 隔离问题消息"],
  },
];

export default function MqRocketCore() {
  return (
    <TopicShell
      eyebrow="消息队列动画"
      title="RocketMQ 核心机制"
      subtitle="路由发现、存储与消费链路的关键原理。"
      steps={steps}
      panel={[
        { title: "机制视角", detail: "注册发现 + 存储组织 + 拉取消费。" },
        { title: "可靠性", detail: "刷盘、主从、重试与死信。" },
      ]}
      principles={principles}
      principlesIntro="从路由、存储与消费链路拆解 RocketMQ 的核心机制。"
      flow={[
        "Broker 心跳注册路由",
        "客户端拉取并缓存路由",
        "写入 CommitLog → ConsumeQueue",
        "Pull 拉取并提交 Offset",
        "失败消息进入 Retry/DLQ",
      ]}
      diagramClass="mq-rocket"
      renderDiagram={(step) => (
        <div className={`rocket-mechanism mode--${step.active}`}>
          <div className="rocket-beams" aria-hidden="true">
            <svg className="rocket-tracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path className="rocket-track track-route" d="M50 20 L50 44" />
              <path className="rocket-track track-query-left" d="M26 46 Q 36 30 50 20" />
              <path className="rocket-track track-query-right" d="M74 46 Q 64 30 50 20" />
              <path className="rocket-track track-produce" d="M26 46 Q 38 56 50 58" />
              <path className="rocket-track track-consume" d="M50 58 Q 62 56 74 46" />
              <path className="rocket-track track-retry" d="M74 46 Q 52 72 26 82" />
            </svg>
            <span className="rocket-beam beam-route" />
            <span className="rocket-beam beam-query-left" />
            <span className="rocket-beam beam-query-right" />
            <span className="rocket-beam beam-produce" />
            <span className="rocket-beam beam-consume" />
            <span className="rocket-beam beam-retry" />
          </div>

          <div className="rocket-grid">
            <div className="rocket-card nameserver">
              <div className="card-title">NameServer 集群</div>
              <div className="card-row">
                <span>NS1</span>
                <span>NS2</span>
                <span>NS3</span>
              </div>
              <div className="card-meta">路由表 / 心跳</div>
            </div>

            <div className="rocket-card producer">
              <div className="card-title">Producer</div>
              <div className="card-meta">队列选择</div>
            </div>

            <div className="rocket-card broker">
              <div className="card-title">Broker 组</div>
              <div className="card-row">
                <span className="role master">Master</span>
                <span className="role slave">Slave</span>
              </div>
              <div className="store-grid">
                <div className="store-item commitlog">
                  <span className="store-title">CommitLog</span>
                  <span className="store-track">
                    <span className="track-dot" />
                  </span>
                </div>
                <div className="store-item queue">
                  <span className="store-title">ConsumeQueue</span>
                  <span className="queue-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <div className="store-item index">
                  <span className="store-title">Index</span>
                  <span className="index-bars">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            </div>

            <div className="rocket-card consumer">
              <div className="card-title">Consumer</div>
              <div className="card-meta">Pull + Ack</div>
            </div>

            <div className="rocket-card retry">
              <div className="card-title">Retry / DLQ</div>
              <div className="card-meta">延迟重投</div>
            </div>

            <div className="rocket-offset">
              <span>offset++</span>
              <span className="rocket-offset__dot" />
            </div>
          </div>
        </div>
      )}
    />
  );
}
