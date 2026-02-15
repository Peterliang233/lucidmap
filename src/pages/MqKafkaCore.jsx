import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "partition",
    title: "分区日志",
    description: "Topic 被拆成多个分区，顺序写入。",
    bullets: ["顺序写", "水平扩展"],
    active: "partition",
  },
  {
    id: "replica",
    title: "副本机制",
    description: "Leader/Follower 复制，保障可用性。",
    bullets: ["ISR", "容错"],
    active: "replica",
  },
  {
    id: "ack",
    title: "可靠写入",
    description: "acks 决定写入确认强度。",
    bullets: ["acks=1/all", "吞吐与可靠性权衡"],
    active: "ack",
  },
];

export default function MqKafkaCore() {
  return (
    <TopicShell
      eyebrow="消息队列动画"
      title="Kafka 核心机制"
      subtitle="分区、复制与可靠写入的核心原理。"
      steps={steps}
      panel={[
        { title: "定位", detail: "高吞吐日志型队列。" },
        { title: "关键点", detail: "分区、有序、副本。" },
      ]}
      flow={["分区实现并行", "副本保证可用", "acks 控制可靠性"]}
      diagramClass="mq-kafka"
      renderDiagram={(step) => (
        <div className={`kafka-diagram mode--${step.active}`}>
          <div className="kafka-top">
            <div className="kafka-node producer">
              <span>Producer</span>
              <div className="node-pill">batch</div>
            </div>
            <div className="kafka-topic">
              <div className="topic-title">Topic: orders</div>
              <div className="topic-partitions">
                <div className="partition-card leader">P0</div>
                <div className="partition-card">P1</div>
                <div className="partition-card">P2</div>
              </div>
              <div className="topic-hint">按 key 分区，顺序写入</div>
            </div>
            <div className="kafka-node consumer">
              <span>Consumer</span>
              <div className="node-pill">group</div>
            </div>
          </div>

          <div className="kafka-arrows">
            <div className="arrow arrow-produce" />
            <div className="arrow arrow-consume" />
          </div>

          <div className="kafka-brokers">
            <div className="broker-card broker-a">
              <div className="broker-title">Broker A</div>
              <div className="broker-log">
                <div className="log-seg leader">P0 Leader</div>
                <div className="log-seg follower">P1 Follower</div>
              </div>
              <div className="isr-badge">ISR</div>
            </div>
            <div className="broker-card broker-b">
              <div className="broker-title">Broker B</div>
              <div className="broker-log">
                <div className="log-seg leader">P1 Leader</div>
                <div className="log-seg follower">P2 Follower</div>
              </div>
              <div className="isr-badge">ISR</div>
            </div>
            <div className="broker-card broker-c">
              <div className="broker-title">Broker C</div>
              <div className="broker-log">
                <div className="log-seg leader">P2 Leader</div>
                <div className="log-seg follower">P0 Follower</div>
              </div>
              <div className="isr-badge">ISR</div>
            </div>
          </div>

          <div className="kafka-replication">
            <div className="replication-line line-ab" />
            <div className="replication-line line-ac" />
            <div className="replication-line line-bc" />
          </div>

          <div className="kafka-acks">
            <div className="ack-card ack-one">acks=1</div>
            <div className="ack-card ack-all">acks=all</div>
            <div className="ack-flow" />
          </div>
        </div>
      )}
    />
  );
}
