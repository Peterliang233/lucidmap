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

const stackOps = ["push Order#521", "push Item#9", "pop Item#9", "pop Order#521"];
const queueTasks = ["task-A", "task-B", "task-C", "task-D"];
const heapLevels = [
  ["2"],
  ["5", "7"],
  ["9", "8", "10", "12"],
];
const heapOps = ["insert 3", "shiftUp", "extractMin = 2", "heapify"];

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
        <div className={`struct-scene mode--${step.active}`}>
          <div className={`struct-card struct-card--stack ${step.active === "stack" ? "is-active" : ""}`}>
            <div className="struct-card__head">
              <h3>Stack</h3>
              <span className="struct-tag">LIFO</span>
            </div>
            <p className="struct-desc">后进先出，适合递归/回溯。</p>
            <div className="stack-visual">
              <div className="stack-gates" aria-hidden="true">
                <span className="gate gate--push">
                  <span className="gate-arrow">↓</span>
                  入栈
                </span>
                <span className="gate gate--pop">
                  <span className="gate-arrow">↑</span>
                  出栈
                </span>
              </div>
              <div className="stack-cylinder">
                <div className="stack-cylinder__shape" />
                <div className="stack-drop">
                  <span className="stack-drop__item stack-drop__item--a">Order#521</span>
                  <span className="stack-drop__item stack-drop__item--b">Item#9</span>
                  <span className="stack-drop__item stack-drop__item--c">Coupon#3</span>
                </div>
              </div>
            </div>
            <div className="struct-example">
              <div className="example-title">Example</div>
              <div className="example-row">
                {stackOps.map((op) => (
                  <span key={op}>{op}</span>
                ))}
              </div>
            </div>
          </div>

          <div className={`struct-card struct-card--queue ${step.active === "queue" ? "is-active" : ""}`}>
            <div className="struct-card__head">
              <h3>Queue</h3>
              <span className="struct-tag">FIFO</span>
            </div>
            <p className="struct-desc">先进先出，适合任务排队/BFS。</p>
            <div className="queue-visual">
              <div className="queue-tube">
                <div className="queue-tube__shape" />
                <div className="queue-tube__lane">
                  {queueTasks.map((task, index) => (
                    <span
                      key={task}
                      className={`queue-pod queue-pod--${index + 1}`}
                    >
                      {task}
                    </span>
                  ))}
                </div>
              </div>
              <div className="queue-gates">
                <span className="gate">enqueue →</span>
                <span className="gate">→ dequeue</span>
              </div>
            </div>
            <div className="struct-example">
              <div className="example-title">Example</div>
              <div className="example-row">
                <span>BFS: 起点入队</span>
                <span>出队访问</span>
                <span>邻居入队</span>
              </div>
            </div>
          </div>

          <div className={`struct-card struct-card--heap ${step.active === "heap" ? "is-active" : ""}`}>
            <div className="struct-card__head">
              <h3>Heap</h3>
              <span className="struct-tag">Priority</span>
            </div>
            <p className="struct-desc">快速获得最小/最大值。</p>
            <div className="heap-visual">
              <div className="heap-tree">
                {heapLevels.map((level, levelIndex) => (
                  <div key={`level-${levelIndex}`} className="heap-level">
                    {level.map((node) => (
                      <span key={node} className="heap-node">
                        {node}
                      </span>
                    ))}
                  </div>
                ))}
                <span className="heap-pulse" />
              </div>
              <div className="heap-path">
                <span className="path-node">3</span>
                <span className="path-node">↥</span>
                <span className="path-node">2</span>
              </div>
            </div>
            <div className="struct-example">
              <div className="example-title">Example</div>
              <div className="example-row">
                {heapOps.map((op) => (
                  <span key={op}>{op}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
