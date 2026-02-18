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
              <div className="heap-tree-wrap">
                <svg className="heap-svg" viewBox="0 0 260 148" aria-hidden="true">
                  {/* 静态边 */}
                  <line className="heap-edge" x1="130" y1="24" x2="65"  y2="72" />
                  <line className="heap-edge" x1="130" y1="24" x2="195" y2="72" />
                  <line className="heap-edge" x1="65"  y1="72" x2="35"  y2="120"/>
                  <line className="heap-edge" x1="65"  y1="72" x2="100" y2="120"/>
                  <line className="heap-edge" x1="195" y1="72" x2="165" y2="120"/>
                  <line className="heap-edge" x1="195" y1="72" x2="225" y2="120"/>
                  {/* sift-up 高亮路径 */}
                  <line className="heap-edge heap-edge--sift"  x1="225" y1="120" x2="195" y2="72" />
                  <line className="heap-edge heap-edge--sift heap-edge--sift2" x1="195" y1="72"  x2="130" y2="24" />
                </svg>
                {/* 静态节点 */}
                <span className="heap-node heap-node--root" style={{left:130, top:24}}>2</span>
                <span className="heap-node" style={{left:65,  top:72}}>5</span>
                <span className="heap-node heap-node--l1b" style={{left:195, top:72}}>7</span>
                <span className="heap-node" style={{left:35,  top:120}}>9</span>
                <span className="heap-node" style={{left:100, top:120}}>8</span>
                <span className="heap-node" style={{left:165, top:120}}>10</span>
                {/* 动画节点：insert 3 → sift-up */}
                <span className="heap-node heap-node--insert">3</span>
                {/* min 标签 */}
                <span className="heap-min-badge">min</span>
              </div>
              <div className="heap-ops">
                <span className="heap-op heap-op--1">insert 3</span>
                <span className="heap-op heap-op--2">↑ sift-up</span>
                <span className="heap-op heap-op--3">extractMin</span>
                <span className="heap-op heap-op--4">heapify↓</span>
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
