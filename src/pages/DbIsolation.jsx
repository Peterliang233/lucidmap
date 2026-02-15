import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "ru",
    title: "读未提交",
    description: "允许脏读，隔离级别最低。",
    bullets: ["可能脏读", "不建议使用"],
    active: "ru",
  },
  {
    id: "rc",
    title: "读已提交",
    description: "避免脏读，仍可能出现不可重复读。",
    bullets: ["避免脏读", "仍可能幻读"],
    active: "rc",
  },
  {
    id: "rr",
    title: "可重复读",
    description: "同一事务多次读取结果一致。",
    bullets: ["避免不可重复读", "幻读需额外机制"],
    active: "rr",
  },
  {
    id: "serial",
    title: "串行化",
    description: "最高隔离级别，性能成本高。",
    bullets: ["避免所有并发异常", "吞吐下降"],
    active: "serial",
  },
];

const matrix = [
  { level: "读未提交", id: "ru", dirty: false, nonRepeat: false, phantom: false },
  { level: "读已提交", id: "rc", dirty: true, nonRepeat: false, phantom: false },
  { level: "可重复读", id: "rr", dirty: true, nonRepeat: true, phantom: false },
  { level: "串行化", id: "serial", dirty: true, nonRepeat: true, phantom: true },
];

export default function DbIsolation() {
  return (
    <TopicShell
      eyebrow="数据库事务动画"
      title="隔离级别与并发异常"
      subtitle="通过矩阵展示不同级别对脏读、不可重复读、幻读的控制。"
      steps={steps}
      panel={[
        { title: "并发异常", detail: "脏读、不可重复读、幻读。" },
        { title: "实现方式", detail: "锁 + MVCC。" },
      ]}
      flow={["隔离级别越高并发越低", "MVCC 平衡性能与一致性", "串行化最安全"]}
      diagramClass="isolation-diagram"
      renderDiagram={(step) => (
        <div className="isolation-table">
          <div className="isolation-row is-header">
            <span>隔离级别</span>
            <span>脏读</span>
            <span>不可重复读</span>
            <span>幻读</span>
          </div>
          {matrix.map((row) => (
            <div
              key={row.id}
              className={`isolation-row ${step.active === row.id ? "is-active" : ""}`}
            >
              <span>{row.level}</span>
              <span className={row.dirty ? "ok" : "warn"}>{row.dirty ? "避免" : "可能"}</span>
              <span className={row.nonRepeat ? "ok" : "warn"}>
                {row.nonRepeat ? "避免" : "可能"}
              </span>
              <span className={row.phantom ? "ok" : "warn"}>{row.phantom ? "避免" : "可能"}</span>
            </div>
          ))}
        </div>
      )}
    />
  );
}
