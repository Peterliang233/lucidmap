import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "order",
    title: "顺序消息",
    description: "同一队列保持严格顺序。",
    bullets: ["队列绑定", "业务有序"],
    active: "order",
  },
  {
    id: "delay",
    title: "延迟消息",
    description: "定时/延迟投递，支持业务解耦。",
    bullets: ["延迟等级", "定时触发"],
    active: "delay",
  },
  {
    id: "transaction",
    title: "事务消息",
    description: "两阶段提交保证最终一致。",
    bullets: ["half message", "回查"],
    active: "transaction",
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
        { title: "场景", detail: "订单、支付、库存一致性。" },
        { title: "代价", detail: "配置复杂度、监控要求。" },
      ]}
      flow={["顺序消息保序", "延迟消息缓冲", "事务消息最终一致"]}
      diagramClass="mq-rocket-features"
      renderDiagram={(step) => (
        <div className={`mq-feature__grid mode--${step.active}`}>
          <div className="feature-card order">
            <h3>顺序队列</h3>
            <div className="feature-line">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="feature-card delay">
            <h3>延迟投递</h3>
            <div className="feature-clock">⏱</div>
          </div>
          <div className="feature-card transaction">
            <h3>事务消息</h3>
            <div className="feature-tx">
              <span>Half</span>
              <span>Commit</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
