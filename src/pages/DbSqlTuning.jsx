import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "parse",
    title: "解析与规范化",
    description: "SQL 被解析为语法树，并进行规范化处理。",
    bullets: ["语法检查", "权限验证"],
    active: "parse",
  },
  {
    id: "optimize",
    title: "优化器选择",
    description: "评估执行计划，选择成本最低方案。",
    bullets: ["统计信息", "代价估计"],
    active: "optimize",
  },
  {
    id: "index",
    title: "索引匹配",
    description: "利用索引减少扫描范围。",
    bullets: ["覆盖索引", "索引下推"],
    active: "index",
  },
  {
    id: "execute",
    title: "执行与回表",
    description: "执行计划落地，必要时回表取数据。",
    bullets: ["回表成本", "缓存命中"],
    active: "execute",
  },
];

const pipeline = [
  { id: "parse", label: "解析" },
  { id: "optimize", label: "优化" },
  { id: "index", label: "索引" },
  { id: "execute", label: "执行" },
];

export default function DbSqlTuning() {
  return (
    <TopicShell
      eyebrow="数据库性能动画"
      title="SQL 调优清单"
      subtitle="通过执行链路理解慢查询的关键阻塞点。"
      steps={steps}
      panel={[
        { title: "关注点", detail: "慢查询、执行计划、索引失效。" },
        { title: "常见策略", detail: "加索引、改写 SQL、分库分表。" },
      ]}
      flow={["解析阶段确定结构", "优化器决定执行路径", "索引降低扫描成本"]}
      diagramClass="sql-diagram"
      renderDiagram={(step) => (
        <div className="sql-pipeline">
          {pipeline.map((node) => (
            <div key={node.id} className={`sql-node ${step.active === node.id ? "is-active" : ""}`}>
              {node.label}
            </div>
          ))}
        </div>
      )}
    />
  );
}
