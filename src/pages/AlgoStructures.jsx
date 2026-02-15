import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "stack",
    title: "栈",
    description: "后进先出，适合递归与回溯。",
    bullets: ["push / pop", "函数调用栈"],
    active: "stack",
  },
  {
    id: "queue",
    title: "队列",
    description: "先进先出，适合层序与任务队列。",
    bullets: ["enqueue / dequeue", "BFS"],
    active: "queue",
  },
  {
    id: "heap",
    title: "堆",
    description: "快速获取最大/最小值。",
    bullets: ["优先队列", "TopK"],
    active: "heap",
  },
];

export default function AlgoStructures() {
  return (
    <TopicShell
      eyebrow="算法动画"
      title="堆、栈、队列"
      subtitle="用结构示意图掌握常见数据结构。"
      steps={steps}
      panel={[
        { title: "考察点", detail: "入栈出栈、队列调度、堆化。" },
        { title: "典型应用", detail: "括号匹配、BFS、TopK。" },
      ]}
      flow={["栈用于回溯", "队列用于广度", "堆用于优先"]}
      diagramClass="struct-diagram"
      renderDiagram={(step) => (
        <div className="struct-grid">
          <div className={`struct-card ${step.active === "stack" ? "is-active" : ""}`}>
            <h3>Stack</h3>
            <div className="stack">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className={`struct-card ${step.active === "queue" ? "is-active" : ""}`}>
            <h3>Queue</h3>
            <div className="queue">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className={`struct-card ${step.active === "heap" ? "is-active" : ""}`}>
            <h3>Heap</h3>
            <div className="heap">
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
