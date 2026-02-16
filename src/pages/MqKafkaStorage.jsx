import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "append",
    title: "1. Append-Only 日志",
    description: "写入追加到分区日志末尾，磁盘顺序写更高效。",
    bullets: ["追加写入", "顺序 I/O", "滚动 segment"],
    active: "append",
  },
  {
    id: "segment",
    title: "2. 分段 + 索引",
    description: "分区日志按段组织，利用 offset 索引快速定位。",
    bullets: ["段文件", "offset → position", "二分查找"],
    active: "segment",
  },
  {
    id: "cache",
    title: "3. Page Cache + Zero-Copy",
    description: "数据常驻页缓存，sendfile 直传 socket。",
    bullets: ["OS page cache", "零拷贝", "读路径更轻"],
    active: "cache",
  },
  {
    id: "batch",
    title: "4. 批量 + 压缩",
    description: "消息成批写入并压缩，减少系统调用与网络开销。",
    bullets: ["message set", "压缩降低 I/O", "吞吐更高"],
    active: "batch",
  },
  {
    id: "read",
    title: "5. 读取示例",
    description: "以 offset 为入口，定位段文件并读出消息。",
    bullets: ["offset → 段索引", "position → 日志位置", "页缓存/磁盘读取"],
    active: "read",
  },
];

export default function MqKafkaStorage() {
  return (
    <TopicShell
      eyebrow="消息队列动画"
      title="Kafka 消息存储机制"
      subtitle="从日志结构到零拷贝读写，解释 Kafka 高吞吐的原因。"
      steps={steps}
      panel={[
        { title: "存储核心", detail: "分区日志 + 分段 + 索引组织。" },
        { title: "性能来源", detail: "顺序写、页缓存、零拷贝、批量压缩。" },
      ]}
      flow={["追加写入分区日志", "段索引定位", "页缓存直传", "批量压缩提升吞吐", "读取示例路径"]}
      diagramClass="mq-kafka-storage"
      renderDiagram={(step) => (
        <div className={`kafka-store mode--${step.active}`}>
          <div className="kafka-store__nodes">
            <div className="store-node producer">
              <span>Producer</span>
              <span className="node-pill">batch</span>
            </div>
            <div className="store-node broker">
              <span>Broker Storage</span>
              <span className="node-meta">Partition Log</span>
            </div>
            <div className="store-node consumer">
              <span>Consumer</span>
              <span className="node-pill">fetch</span>
            </div>
          </div>

          <div className="kafka-store__pipes" aria-hidden="true">
            <span className="store-line store-line--write" />
            <span className="store-line store-line--read" />
          </div>

          <div className="kafka-store__stack">
            <div className="store-card log-card">
              <div className="card-title">
                <span>Append Log</span>
                <span className="card-tag">sequential</span>
              </div>
              <div className="log-segments">
                <span className="log-seg">0000000000</span>
                <span className="log-seg">0000008000</span>
                <span className="log-seg is-active">0000016000</span>
              </div>
              <div className="log-append">
                <span className="append-dot" />
                <span className="append-dot" />
                <span className="append-dot" />
              </div>
            </div>

            <div className="store-card index-card">
              <div className="card-title">
                <span>Segment Index</span>
                <span className="card-tag">offset → pos</span>
              </div>
              <div className="index-table">
                <div className="index-row">
                  <span>12000</span>
                  <span>0</span>
                </div>
                <div className="index-row">
                  <span>12036</span>
                  <span>512</span>
                </div>
                <div className="index-row">
                  <span>12110</span>
                  <span>2048</span>
                </div>
              </div>
            </div>

            <div className="store-card cache-card">
              <div className="card-title">
                <span>Page Cache</span>
                <span className="card-tag">sendfile</span>
              </div>
              <div className="cache-flow">
                <span className="cache-block">Cache</span>
                <span className="cache-line" />
                <span className="cache-block">Socket</span>
              </div>
              <div className="cache-note">零拷贝直传</div>
            </div>

            <div className="store-card batch-card">
              <div className="card-title">
                <span>Batch + Compression</span>
                <span className="card-tag">gzip / lz4</span>
              </div>
              <div className="batch-box">
                <span className="batch-msg">msg</span>
                <span className="batch-msg">msg</span>
                <span className="batch-msg">msg</span>
              </div>
              <div className="batch-chip">message set</div>
            </div>
          </div>

          <div className="kafka-store__example">
            <div className="example-title">读取一条消息示例</div>
            <div className="example-rows">
              <div className="example-row">
                <span className="example-step">1</span>
                <span>offset=12110</span>
                <span className="example-arrow">命中 segment 0000016000</span>
              </div>
              <div className="example-row">
                <span className="example-step">2</span>
                <span>index → position=2048</span>
                <span className="example-arrow">定位日志位置</span>
              </div>
              <div className="example-row">
                <span className="example-step">3</span>
                <span>page cache → socket</span>
                <span className="example-arrow">零拷贝返回</span>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
