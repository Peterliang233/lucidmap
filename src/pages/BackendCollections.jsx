import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "hashmap",
    title: "HashMap",
    description: "非线程安全，读写并发可能造成死循环。",
    bullets: ["链表 / 红黑树", "扩容成本高"],
    active: "hashmap",
  },
  {
    id: "sync",
    title: "同步容器",
    description: "使用全局锁保障线程安全。",
    bullets: ["性能损耗", "粗粒度锁"],
    active: "sync",
  },
  {
    id: "chm",
    title: "ConcurrentHashMap",
    description: "分段锁 + CAS 提升并发性能。",
    bullets: ["锁粒度更细", "读写分离"],
    active: "chm",
  },
];

export default function BackendCollections() {
  return (
    <TopicShell
      eyebrow="后端基础动画"
      title="集合体系与并发容器"
      subtitle="对比 HashMap 与 ConcurrentHashMap 的并发策略。"
      steps={steps}
      panel={[
        { title: "常见场景", detail: "缓存、计数器、并发读写。" },
        { title: "关注点", detail: "扩容、锁竞争、读写一致性。" },
      ]}
      flow={["HashMap 非线程安全", "同步容器牺牲并发", "CHM 提升吞吐"]}
      diagramClass="collections-diagram"
      renderDiagram={(step) => (
        <div className="collections-grid">
          <div className={`collections-card ${step.active === "hashmap" ? "is-active" : ""}`}>
            <h3>HashMap</h3>
            <div className="bucket">
              <span className="bucket__slot" />
              <span className="bucket__slot" />
              <span className="bucket__slot" />
            </div>
            <p>无锁并发风险</p>
          </div>
          <div className={`collections-card ${step.active === "sync" ? "is-active" : ""}`}>
            <h3>同步容器</h3>
            <div className="lock">LOCK</div>
            <p>全局锁保护</p>
          </div>
          <div className={`collections-card ${step.active === "chm" ? "is-active" : ""}`}>
            <h3>ConcurrentHashMap</h3>
            <div className="segments">
              <span />
              <span />
              <span />
            </div>
            <p>分段锁 + CAS</p>
          </div>
        </div>
      )}
    />
  );
}
