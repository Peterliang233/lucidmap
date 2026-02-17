import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "atomic",
    title: "原子性",
    description: "事务要么全部成功，要么全部回滚。",
    bullets: ["Undo 日志", "回滚保证一致"],
    active: "atomic",
  },
  {
    id: "consistent",
    title: "一致性",
    description: "事务前后数据库保持合法状态。",
    bullets: ["约束规则", "业务校验"],
    active: "consistent",
  },
  {
    id: "isolation",
    title: "隔离性",
    description: "并发事务互不干扰。",
    bullets: ["MVCC", "锁机制"],
    active: "isolation",
  },
  {
    id: "durable",
    title: "持久性",
    description: "提交后的数据不会丢失。",
    bullets: ["Redo 日志", "刷盘策略"],
    active: "durable",
  },
];

const cards = [
  { id: "atomic", title: "Atomicity", detail: "要么全部成功" },
  { id: "consistent", title: "Consistency", detail: "状态合法" },
  { id: "isolation", title: "Isolation", detail: "互不干扰" },
  { id: "durable", title: "Durability", detail: "提交持久" },
];

const principles = [
  {
    title: "原子性与回滚",
    detail: "事务失败可回滚到起点，避免半完成状态。",
    points: ["Undo log 记录旧值", "异常触发回滚", "保证要么全成要么全不成"],
  },
  {
    title: "一致性与约束",
    detail: "业务规则 + 数据约束保证状态合法。",
    points: ["主键/外键/唯一性约束", "检查约束与触发器", "应用层校验共同作用"],
  },
  {
    title: "示例拆解",
    detail: "转账 A→B 100 元。",
    points: ["扣款失败则回滚", "并发读写用锁/MVCC 隔离", "提交后日志落盘保证持久"],
  },
];

export default function DbAcid() {
  return (
    <TopicShell
      eyebrow="数据库事务动画"
      title="事务四大特性 ACID"
      subtitle="用四块基石说明事务可靠性保障。"
      steps={steps}
      panel={[
        { title: "事务目标", detail: "保证数据正确且可恢复。" },
        { title: "落地机制", detail: "日志 + 锁 + 约束。" },
      ]}
      principles={principles}
      principlesIntro="从日志、锁与约束三个角度拆解 ACID 的落地机制。"
      flow={["原子性依赖回滚", "隔离性依赖并发控制", "持久性依赖日志落盘"]}
      diagramClass="acid-diagram"
      renderDiagram={(step) => (
        <div className="acid-grid">
          {cards.map((card) => (
            <div key={card.id} className={`acid-card ${step.active === card.id ? "is-active" : ""}`}>
              <h3>{card.title}</h3>
              <p>{card.detail}</p>
            </div>
          ))}
        </div>
      )}
    />
  );
}
