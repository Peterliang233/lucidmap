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
    title: "5. 消费定位：Partition → Segment",
    description: "消费者根据 offset 先定位到 Partition，再通过段文件名二分查找定位到具体的 .log 段。",
    bullets: ["Consumer 提交 offset 到目标 Partition", "段文件名即 baseOffset，二分查找", "定位到包含目标 offset 的 .log 文件"],
    active: "read",
  },
  {
    id: "index",
    title: "6. 稀疏索引定位物理位置",
    description: "在 .index 稀疏索引中查找不大于目标 offset 的最大条目，获取物理位置。",
    bullets: [".index 是稀疏索引，非每条消息都有", "二分查找 ≤ targetOffset 的最大条目", "得到对应的物理文件偏移量 position"],
    active: "index",
  },
  {
    id: "scan",
    title: "7. 顺序扫描读取消息",
    description: "从索引定位的物理位置开始，在 .log 文件中顺序遍历，找到目标 offset 的消息。",
    bullets: ["从 position 开始顺序读取 .log", "逐条比对 offset 直到命中目标", "Page Cache 加速，零拷贝返回给消费者"],
    active: "scan",
  },
];

const principles = [
  {
    title: "顺序写与分段",
    detail: "Append-Only + segment 组织提升磁盘效率。",
    points: ["顺序 I/O 降低随机寻址", "segment 滚动控制文件大小", "offset 作为天然索引"],
  },
  {
    title: "索引与定位",
    detail: "Partition → Segment → 稀疏索引 → 顺序扫描，四步定位消息。",
    points: ["段文件名二分查找定位 .log", ".index 稀疏索引定位物理位置", "从 position 顺序遍历找到目标消息"],
  },
  {
    title: "零拷贝读路径",
    detail: "Page Cache + sendfile 降低 CPU 与内存开销。",
    points: ["数据留在页缓存", "避免用户态复制", "高吞吐低延迟"],
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
      principles={principles}
      principlesIntro="从存储组织、定位路径与零拷贝解释 Kafka 高吞吐来源。"
      flow={["追加写入分区日志", "段索引定位", "页缓存直传", "批量压缩提升吞吐", "Partition → Segment → .index → 顺序扫描"]}
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
                <span>.index 稀疏索引</span>
                <span className="card-tag">sparse index</span>
              </div>
              <div className="index-note">每隔 N 条记录一个索引条目</div>
              <div className="index-table">
                <div className="index-row index-row--header">
                  <span>offset</span>
                  <span>position</span>
                </div>
                <div className="index-row">
                  <span>8000</span>
                  <span>0</span>
                </div>
                <div className="index-row">
                  <span>8036</span>
                  <span>512</span>
                </div>
                <div className="index-row">
                  <span>8120</span>
                  <span>2048</span>
                </div>
                <div className="index-row">
                  <span>8250</span>
                  <span>4096</span>
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
            <div className="example-title">消费 offset=12110 的完整定位流程</div>
            <div className="example-rows">
              <div className={`example-row ${step.active === "read" ? "is-highlight" : ""}`}>
                <span className="example-step">1</span>
                <span>定位 Partition-0</span>
                <span className="example-arrow">Consumer 指定 offset → Partition</span>
              </div>
              <div className={`example-row ${step.active === "read" ? "is-highlight" : ""}`}>
                <span className="example-step">2</span>
                <span>二分查找段文件</span>
                <span className="example-arrow">baseOffset ≤ 12110 → 0000008000.log</span>
              </div>
              <div className={`example-row ${step.active === "index" ? "is-highlight" : ""}`}>
                <span className="example-step">3</span>
                <span>查 .index 稀疏索引</span>
                <span className="example-arrow">≤ 12110 最大条目: 8120 → pos 2048</span>
              </div>
              <div className={`example-row ${step.active === "scan" ? "is-highlight" : ""}`}>
                <span className="example-step">4</span>
                <span>从 pos=2048 顺序扫描 .log</span>
                <span className="example-arrow">逐条遍历直到 offset=12110</span>
              </div>
              <div className={`example-row ${step.active === "scan" ? "is-highlight" : ""}`}>
                <span className="example-step">5</span>
                <span>Page Cache → 零拷贝返回</span>
                <span className="example-arrow">sendfile 直传 Consumer</span>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
