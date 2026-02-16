import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "readview",
    title: "生成 Read View",
    description: "一致性读开始时创建 Read View，记录活跃事务与上下限。",
    bullets: ["active_trx_ids", "up_limit_id / low_limit_id", "creator_trx_id"],
    active: "readview",
  },
  {
    id: "version",
    title: "版本链与隐藏字段",
    description: "每行包含 trx_id、roll_pointer、db_row_id，形成可追溯版本链。",
    bullets: ["trx_id 标识版本", "roll_pointer 指向 undo", "旧版本仍保留"],
    active: "version",
  },
  {
    id: "visibility",
    title: "可见性判断",
    description: "根据 Read View 规则筛选可见版本，避免加锁读取。",
    bullets: ["trx_id < up_limit 可见", "trx_id >= low_limit 不可见", "区间内查 active 列表"],
    active: "visibility",
  },
  {
    id: "undo",
    title: "写入与 Undo Log",
    description: "更新生成新版本并写 undo，旧版本继续服务一致性读。",
    bullets: ["新版本挂链头", "undo 记录旧值", "事务可读自身版本"],
    active: "undo",
  },
  {
    id: "purge",
    title: "Purge 清理",
    description: "无事务需要旧版本后，后台清理链尾并回收空间。",
    bullets: ["长事务会阻塞清理", "释放历史版本占用"],
    active: "purge",
  },
];

const versions = [
  { id: "v3", label: "V3", trx: "T124", value: "balance=108" },
  { id: "v2", label: "V2", trx: "T119", value: "balance=103" },
  { id: "v1", label: "V1", trx: "T108", value: "balance=90" },
];

const readView = {
  creator: "T124",
  upLimit: "T118",
  lowLimit: "T126",
  active: ["T118", "T120"],
};

export default function DbSqlTuning() {
  return (
    <TopicShell
      eyebrow="数据库事务动画"
      title="MVCC 实现原理"
      subtitle="通过 Read View 与版本链理解一致性读与并发写入。"
      steps={steps}
      panel={[
        { title: "读路径", detail: "一致性读 = Read View + 版本链。" },
        { title: "写路径", detail: "更新生成新版本并写 undo log。" },
      ]}
      flow={["生成 Read View", "版本链判定可见性", "Purge 回收旧版本"]}
      diagramClass="mvcc-diagram"
      renderDiagram={(step) => (
        <div className={`mvcc-board mode--${step.active}`}>
          <div className="mvcc-left">
            <div className="mvcc-sql">
              <div className="mvcc-card-title">SQL</div>
              <pre className="mvcc-code">SELECT balance FROM account WHERE id = 42;</pre>
              <pre className="mvcc-code">UPDATE account SET balance = 108 WHERE id = 42;</pre>
            </div>
            <div className="mvcc-versions">
              <span className="mvcc-chain-line" />
              <span className="mvcc-chain-dot" />
              {versions.map((version) => {
                const visibilityClass =
                  step.active === "visibility"
                    ? version.id === "v2"
                      ? "is-visible"
                      : "is-hidden"
                    : "";
                const newClass = step.active === "undo" && version.id === "v3" ? "is-new" : "";
                const purgedClass = step.active === "purge" && version.id === "v1" ? "is-purged" : "";
                return (
                  <div
                    key={version.id}
                    className={`mvcc-version ${visibilityClass} ${newClass} ${purgedClass}`}
                  >
                    <div className="version-tag">{version.label}</div>
                    <div className="version-body">
                      <span>{version.value}</span>
                      <span>trx_id: {version.trx}</span>
                      <span className="meta">roll_ptr → undo</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mvcc-undo">
              <div className="undo-title">undo log</div>
              <div className="undo-body">
                <span>before: 103</span>
                <span>before: 90</span>
              </div>
              <span className="mvcc-undo-arrow" />
            </div>
          </div>

          <div className="mvcc-right">
            <div className={`mvcc-readview ${step.active === "readview" ? "is-active" : ""}`}>
              <div className="mvcc-card-title">Read View</div>
              <div className="mvcc-readview-grid">
                <span>creator_trx_id</span>
                <span>{readView.creator}</span>
                <span>up_limit_id</span>
                <span>{readView.upLimit}</span>
                <span>low_limit_id</span>
                <span>{readView.lowLimit}</span>
              </div>
              <div className="mvcc-active-list">
                {readView.active.map((trx) => (
                  <span key={trx} className="mvcc-badge">
                    {trx}
                  </span>
                ))}
              </div>
            </div>

            <div className={`mvcc-rules ${step.active === "visibility" ? "is-active" : ""}`}>
              <div className="mvcc-card-title">可见性规则</div>
              <div className="mvcc-rule">
                <span>trx_id &lt; up_limit</span>
                <strong>可见</strong>
              </div>
              <div className="mvcc-rule">
                <span>trx_id ≥ low_limit</span>
                <strong>不可见</strong>
              </div>
              <div className="mvcc-rule">
                <span>区间内检查 active_trx_ids</span>
                <strong>再判断</strong>
              </div>
            </div>

            <div className={`mvcc-purge ${step.active === "purge" ? "is-active" : ""}`}>
              <div className="mvcc-card-title">Purge</div>
              <p>长事务结束后，旧版本从链尾回收。</p>
            </div>
          </div>
        </div>
      )}
    />
  );
}
