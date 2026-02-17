import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "group",
    title: "消费组",
    description: "同组消费者共同分担分区。",
    bullets: ["水平扩展", "单分区单消费者"],
    active: "group",
  },
  {
    id: "rebalance",
    title: "Rebalance",
    description: "成员变化触发分区重新分配。",
    bullets: ["短暂停止", "再分配"],
    active: "rebalance",
  },
  {
    id: "offset",
    title: "Offset 提交",
    description: "决定至少一次/至多一次语义。",
    bullets: ["手动提交", "幂等处理"],
    active: "offset",
  },
];

const principles = [
  {
    title: "消费组分配",
    detail: "分区与消费者一一分配，保证并行与有序。",
    points: ["单分区同一时刻只给一个消费者", "消费者数 > 分区数会空闲", "重平衡会重新分配"],
  },
  {
    title: "Rebalance 影响",
    detail: "成员变更导致短暂停止与状态迁移。",
    points: ["Stop-the-world 式暂停", "分区迁移带来重复消费", "需控制心跳与超时"],
  },
  {
    title: "Offset 语义",
    detail: "提交时机决定至少一次/至多一次。",
    points: ["先提交后处理 → 至多一次", "处理完再提交 → 至少一次", "幂等处理降低重复影响"],
  },
];

export default function MqKafkaConsumer() {
  return (
    <TopicShell
      eyebrow="消息队列动画"
      title="Kafka 消费模型"
      subtitle="消费组、Rebalance 与 Offset 管理。"
      steps={steps}
      panel={[
        { title: "语义", detail: "至少一次 / 至多一次。" },
        { title: "风险点", detail: "重平衡、重复消费。" },
      ]}
      principles={principles}
      principlesIntro="结合分配策略与提交时机，理解消费语义与重平衡成本。"
      flow={["消费组绑定分区", "重平衡再分配", "提交 offset 控制语义"]}
      diagramClass="mq-kafka-consume"
      renderDiagram={(step) => (
        <div className={`mq-consume__grid mode--${step.active}`}>
          <div className="consume-header">
            <div className="mq-topic">Topic: orders</div>
            <div className="mq-offset">Offset</div>
          </div>

          <div className="mq-part-list">
            <span>P0</span>
            <span>P1</span>
            <span>P2</span>
            <span>P3</span>
          </div>

          <div className="mq-consume__diagram">
            <div className="mq-group">
              <div className="consumer">C1</div>
              <div className="consumer">C2</div>
              <div className="consumer ghost">C3</div>
            </div>

            <div className="assignments">
              <div className="assign-card">
                <h4>C1</h4>
                <div className="assign-list">
                  <span>P0</span>
                  <span>P1</span>
                </div>
              </div>
              <div className="assign-card">
                <h4>C2</h4>
                <div className="assign-list">
                  <span>P2</span>
                  <span>P3</span>
                </div>
              </div>
              <div className="assign-card ghost">
                <h4>C3</h4>
                <div className="assign-list">
                  <span>P1</span>
                  <span>P3</span>
                </div>
              </div>
            </div>

            <div className="rebalance-indicator">Rebalance</div>
          </div>

          <div className="offset-timeline">
            <div className="offset-row">
              <span className="offset-label">P0</span>
              <div className="offset-track">
                <span className="offset-dot" />
                <span className="offset-dot active" />
              </div>
            </div>
            <div className="offset-row">
              <span className="offset-label">P1</span>
              <div className="offset-track">
                <span className="offset-dot" />
                <span className="offset-dot active" />
              </div>
            </div>
            <div className="offset-row">
              <span className="offset-label">P2</span>
              <div className="offset-track">
                <span className="offset-dot" />
                <span className="offset-dot active" />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
