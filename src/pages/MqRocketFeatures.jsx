import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "order",
    title: "顺序消息：队列内严格保序",
    description: "同一业务键路由同一队列，Consumer 按 offset 串行消费。",
    bullets: ["ShardingKey 固定队列", "单队列串行消费", "失败重试仍按队列顺序"],
    active: "order",
    example: {
      title: "订单状态流",
      lines: ["order_521: create → pay → ship", "Producer 使用 key=order_521", "Consumer 按 offset 顺序处理"],
      tags: ["Topic: order_event", "Queue-0", "顺序一致"],
    },
  },
  {
    id: "delay",
    title: "延迟消息：定时投递",
    description: "消息先进入延迟等级/定时轮，到期后转投真实 Topic。",
    bullets: ["DelayLevel 预设", "时间到再写入队列", "适合超时/补偿场景"],
    active: "delay",
    example: {
      title: "未支付自动关单",
      lines: ["下单后 30 分钟未支付 -> 关闭订单", "消息进入 DelayLevel=5", "到期投递到 order_timeout"],
      tags: ["DelayLevel=5", "TTL 30m", "自动关单"],
    },
  },
  {
    id: "transaction",
    title: "事务消息：最终一致",
    description: "先发送 Half Message，本地事务完成后回查 Commit/rollback。",
    bullets: ["Half 消息隔离", "本地事务 + 回查", "Commit 后对消费可见"],
    active: "transaction",
    example: {
      title: "支付成功更新订单",
      lines: ["发送 half msg 到 Broker", "本地事务写库成功 -> OK", "Broker 回查后 commit 下发"],
      tags: ["Half → Commit", "CheckBack", "最终一致"],
    },
  },
];

export default function MqRocketFeatures() {
  return (
    <TopicShell
      eyebrow="消息队列动画"
      title="RocketMQ 关键特性"
      subtitle="顺序、延迟与事务消息是高频考点。"
      steps={steps}
      panel={[
        { title: "核心特性", detail: "顺序、延迟、事务消息是高频考点。" },
        { title: "常见场景", detail: "订单编排、超时关闭、支付一致性。" },
      ]}
      flow={["同一业务键 → 固定队列", "DelayLevel 缓冲 → 定时投递", "Half 消息 → 回查 → Commit/rollback"]}
      diagramClass="mq-rocket-features"
      renderDiagram={(step) => (
        <div className={`rocket-features mode--${step.active}`}>
          <div className="rocket-features__left">
            <div className="rocket-features__grid">
              <div className="feature-node producer">
                <div className="feature-node__title">Producer</div>
                <div className="feature-node__meta">业务事件产生</div>
              </div>
              <div className="feature-node broker">
                <div className="feature-node__title">Broker 集群</div>
                <div className="feature-node__meta">Topic / Queue 组织</div>
              </div>
              <div className="feature-node consumer">
                <div className="feature-node__title">Consumer</div>
                <div className="feature-node__meta">按 offset 消费</div>
              </div>
            </div>

            <div className="feature-lanes">
              <div className="feature-lane lane-order">
                <div className="feature-lane__header">
                  <span>顺序消息</span>
                  <span className="feature-lane__tag">Queue-0</span>
                </div>
                <div className="feature-lane__track">
                  <span className="feature-lane__pipe" />
                  <span className="feature-lane__node is-left">Producer</span>
                  <span className="feature-lane__node is-mid">Queue</span>
                  <span className="feature-lane__node is-right">Consumer</span>
                  <div className="feature-queue" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="feature-token token-1">Create</span>
                  <span className="feature-token token-2">Pay</span>
                  <span className="feature-token token-3">Ship</span>
                </div>
                <div className="feature-lane__meta">Key=order_521 固定路由，同队列顺序消费</div>
              </div>

              <div className="feature-lane lane-delay">
                <div className="feature-lane__header">
                  <span>延迟消息</span>
                  <span className="feature-lane__tag">DelayLevel-5</span>
                </div>
                <div className="feature-lane__track">
                  <span className="feature-lane__pipe" />
                  <span className="feature-lane__node is-left">Producer</span>
                  <span className="feature-lane__node is-mid">Delay</span>
                  <span className="feature-lane__node is-right">Consumer</span>
                  <div className="delay-bucket">
                    <div className="delay-wheel" aria-hidden="true" />
                    <div className="delay-countdown">30m</div>
                  </div>
                  <span className="feature-token token-delay">Cancel</span>
                </div>
                <div className="feature-lane__meta">到期后再投递到真实 Topic</div>
              </div>

              <div className="feature-lane lane-transaction">
                <div className="feature-lane__header">
                  <span>事务消息</span>
                  <span className="feature-lane__tag">Half → Commit</span>
                </div>
                <div className="feature-lane__track">
                  <span className="feature-lane__pipe" />
                  <span className="feature-lane__node is-left">Producer</span>
                  <span className="feature-lane__node is-mid">Broker</span>
                  <span className="feature-lane__node is-right">Consumer</span>
                  <span className="feature-check" aria-hidden="true" />
                  <span className="feature-token token-half">Half</span>
                  <span className="feature-token token-commit">Commit</span>
                </div>
                <div className="feature-tx__steps" aria-hidden="true">
                  <span>Half</span>
                  <span>Local Tx</span>
                  <span>CheckBack</span>
                  <span>Commit</span>
                </div>
                <div className="feature-lane__meta">回查失败会回滚或重试</div>
              </div>
            </div>
          </div>

          <div className="feature-example">
            <div className="feature-example__eyebrow">示例</div>
            <div className="feature-example__title">{step.example?.title}</div>
            <ul className="feature-example__list">
              {(step.example?.lines || []).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="feature-example__tags">
              {(step.example?.tags || []).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
