import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "read",
    title: "读流程",
    description: "缓存未命中，回源数据库后写回缓存。",
    bullets: ["Cache Aside", "降低数据库压力"],
    active: "read",
  },
  {
    id: "write",
    title: "写流程",
    description: "更新数据库后删除缓存，保证一致性。",
    bullets: ["先写库再删缓存", "防止脏读"],
    active: "write",
  },
  {
    id: "double",
    title: "双写一致",
    description: "数据库与缓存同步更新。",
    bullets: ["顺序一致", "消息驱动"],
    active: "double",
  },
];

export default function BackendCacheConsistency() {
  return (
    <TopicShell
      eyebrow="系统设计动画"
      title="缓存一致性方案"
      subtitle="通过箭头流向展示 Cache Aside 与双写一致。"
      steps={steps}
      panel={[
        { title: "目标", detail: "保持数据一致并提升读性能。" },
        { title: "常见问题", detail: "缓存击穿、雪崩、穿透。" },
      ]}
      flow={["读：缓存优先", "写：更新库 + 失效缓存", "双写需要异步对账"]}
      diagramClass="cache-diagram"
      renderDiagram={(step) => (
        <div className={`cache-flow focus--${step.active}`}>
          <div className="cache-node app">App</div>
          <div className="cache-node cache">Cache</div>
          <div className="cache-node db">DB</div>
          <div className="cache-arrow arrow-read" />
          <div className="cache-arrow arrow-write" />
          <div className="cache-arrow arrow-double" />
        </div>
      )}
    />
  );
}
