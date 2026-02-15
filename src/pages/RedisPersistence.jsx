import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "rdb",
    title: "RDB 快照",
    description: "定期生成数据快照，恢复速度快。",
    bullets: ["fork 子进程", "全量恢复"],
    active: "rdb",
  },
  {
    id: "aof",
    title: "AOF 追加",
    description: "记录写命令，持久化更细粒度。",
    bullets: ["append only", "恢复慢于 RDB"],
    active: "aof",
  },
  {
    id: "rewrite",
    title: "AOF 重写",
    description: "压缩日志，减少体积与恢复时间。",
    bullets: ["rewrite", "提升可用性"],
    active: "rewrite",
  },
];

export default function RedisPersistence() {
  return (
    <TopicShell
      eyebrow="Redis 动画"
      title="持久化机制 RDB/AOF"
      subtitle="快照与追加日志的权衡：性能、可靠性与恢复时间。"
      steps={steps}
      panel={[
        { title: "关键点", detail: "RDB 速度快，AOF 数据更完整。" },
        { title: "组合策略", detail: "RDB + AOF 混合持久化。" },
      ]}
      flow={["RDB 定时快照", "AOF 记录写操作", "重写压缩日志"]}
      diagramClass="redis-persist"
      renderDiagram={(step) => (
        <div className={`redis-persist__grid mode--${step.active}`}>
          <div className="persist-card">
            <h3>内存数据</h3>
            <div className="persist-blocks">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="persist-card">
            <h3>磁盘</h3>
            <div className="persist-disk">
              <div className="disk-platter" />
              <div className="disk-arm" />
            </div>
          </div>
          <div className="persist-card">
            <h3>AOF 日志</h3>
            <div className="persist-log">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}
    />
  );
}
