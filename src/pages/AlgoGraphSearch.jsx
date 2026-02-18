import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "bfs",
    title: "BFS 广度优先",
    description: "从起点逐层扩散，先访问所有邻居再深入。",
    bullets: ["使用队列（FIFO）", "保证无权图最短路径", "层序遍历"],
    active: "bfs",
  },
  {
    id: "dfs",
    title: "DFS 深度优先",
    description: "沿一条路径深入到底，再回溯探索其他分支。",
    bullets: ["使用栈/递归", "适合连通性、环检测", "回溯剪枝"],
    active: "dfs",
  },
  {
    id: "dijkstra",
    title: "Dijkstra 最短路",
    description: "贪心策略，每次选距离最小的未访问节点松弛。",
    bullets: ["优先队列（最小堆）", "非负权图最短路", "松弛操作"],
    active: "dijkstra",
  },
];

// Graph layout: 6 nodes in a nice arrangement
const nodes = [
  { id: "A", x: 80,  y: 60  },
  { id: "B", x: 220, y: 30  },
  { id: "C", x: 220, y: 130 },
  { id: "D", x: 360, y: 60  },
  { id: "E", x: 360, y: 160 },
  { id: "F", x: 500, y: 100 },
];

const edges = [
  { from: "A", to: "B", w: 2 },
  { from: "A", to: "C", w: 5 },
  { from: "B", to: "D", w: 3 },
  { from: "C", to: "E", w: 2 },
  { from: "D", to: "F", w: 4 },
  { from: "E", to: "F", w: 1 },
  { from: "B", to: "C", w: 1 },
  { from: "D", to: "E", w: 6 },
];

const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

// BFS traversal order from A (layer by layer)
const bfsLayers = [["A"], ["B", "C"], ["D", "E"], ["F"]];
const bfsEdgeOrder = ["A-B", "A-C", "B-D", "B-C", "C-E", "D-F", "E-F"];
const bfsQueue = [["A"], ["B", "C"], ["C", "D"], ["D", "E"], ["E", "F"], ["F"], []];

// DFS traversal order from A (depth-first)
const dfsOrder = ["A", "B", "C", "E", "F", "D"];
const dfsEdgeOrder = ["A-B", "B-C", "C-E", "E-F", "B-D"];
const dfsStack = [["A"], ["A", "B"], ["A", "B", "C"], ["A", "B", "C", "E"], ["A", "B", "C", "E", "F"], ["A", "B", "D"]];

// Dijkstra from A: show distance updates
const dijkSteps = [
  { node: "A", dist: { A: 0, B: "∞", C: "∞", D: "∞", E: "∞", F: "∞" }, visited: [], edge: null },
  { node: "B", dist: { A: 0, B: 2, C: 5, D: "∞", E: "∞", F: "∞" }, visited: ["A"], edge: "A-B" },
  { node: "C", dist: { A: 0, B: 2, C: 3, D: 5, E: "∞", F: "∞" }, visited: ["A", "B"], edge: "B-C" },
  { node: "D", dist: { A: 0, B: 2, C: 3, D: 5, E: 5, F: "∞" }, visited: ["A", "B", "C"], edge: "C-E" },
  { node: "E", dist: { A: 0, B: 2, C: 3, D: 5, E: 5, F: 9 }, visited: ["A", "B", "C", "D"], edge: "D-F" },
  { node: "F", dist: { A: 0, B: 2, C: 3, D: 5, E: 5, F: 6 }, visited: ["A", "B", "C", "D", "E"], edge: "E-F" },
];
const dijkPath = ["A", "B", "C", "E", "F"]; // shortest A→F
const dijkPathEdges = ["A-B", "B-C", "C-E", "E-F"];

function edgeKey(from, to) {
  return [from, to].sort().join("-");
}

const principles = [
  {
    title: "BFS 广度优先",
    detail: "逐层扩散，保证无权图最短路径。",
    points: ["时间复杂度 O(V+E)", "空间复杂度 O(V)（队列）", "适合层序遍历、最短路径"],
  },
  {
    title: "DFS 深度优先",
    detail: "深入到底再回溯，适合连通性与环检测。",
    points: ["时间复杂度 O(V+E)", "递归栈深度 O(V)", "适合拓扑排序、强连通分量"],
  },
  {
    title: "Dijkstra",
    detail: "贪心松弛，求非负权图单源最短路。",
    points: ["优先队列实现 O((V+E)logV)", "不支持负权边", "松弛：d[v] = min(d[v], d[u]+w)"],
  },
];

export default function AlgoGraphSearch() {
  return (
    <TopicShell
      eyebrow="算法动画"
      title="图论与搜索"
      subtitle="BFS、DFS 与 Dijkstra 最短路的核心遍历过程。"
      steps={steps}
      panel={[
        { title: "应用场景", detail: "最短路、连通性、拓扑排序。" },
        { title: "常用结构", detail: "邻接表、队列、栈、优先队列。" },
      ]}
      principles={principles}
      principlesIntro="三种图搜索算法的核心原理与适用场景。"
      flow={["BFS 按层扩散", "DFS 深入回溯", "Dijkstra 贪心松弛"]}
      diagramClass="graph-diagram"
      renderDiagram={(step) => {
        const mode = step.active;
        return (
          <div className="graph-scene">
            <svg className="graph-svg" viewBox="0 0 580 210" preserveAspectRatio="xMidYMid meet">
              <defs>
                <marker id="graph-arrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <path d="M0,0 L6,2.5 L0,5" fill="currentColor" opacity="0.5" />
                </marker>
              </defs>

              {/* Edges */}
              {edges.map((e) => {
                const a = nodeMap[e.from], b = nodeMap[e.to];
                const key = edgeKey(e.from, e.to);
                const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;

                let cls = "graph-edge";
                let showWeight = mode === "dijkstra";

                if (mode === "bfs") {
                  const idx = bfsEdgeOrder.indexOf(key);
                  if (idx >= 0) cls += " graph-edge--bfs";
                  // stagger via CSS custom property
                } else if (mode === "dfs") {
                  const idx = dfsEdgeOrder.indexOf(key);
                  if (idx >= 0) cls += " graph-edge--dfs";
                } else if (mode === "dijkstra") {
                  if (dijkPathEdges.includes(key)) cls += " graph-edge--path";
                }

                return (
                  <g key={key}>
                    <line
                      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      className={cls}
                      style={{
                        "--edge-idx": mode === "bfs" ? bfsEdgeOrder.indexOf(key) : mode === "dfs" ? dfsEdgeOrder.indexOf(key) : dijkPathEdges.indexOf(key),
                      }}
                    />
                    {showWeight && (
                      <g>
                        <rect x={mx - 10} y={my - 9} width={20} height={16} rx={4} className="graph-weight-bg" />
                        <text x={mx} y={my + 3} className="graph-weight-text">{e.w}</text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((n) => {
                let cls = "graph-node";
                let orderLabel = null;

                if (mode === "bfs") {
                  const layerIdx = bfsLayers.findIndex((l) => l.includes(n.id));
                  if (layerIdx >= 0) {
                    cls += ` graph-node--bfs-${layerIdx}`;
                    orderLabel = `L${layerIdx}`;
                  }
                } else if (mode === "dfs") {
                  const idx = dfsOrder.indexOf(n.id);
                  if (idx >= 0) {
                    cls += ` graph-node--dfs-${idx}`;
                    orderLabel = `${idx + 1}`;
                  }
                } else if (mode === "dijkstra") {
                  if (dijkPath.includes(n.id)) cls += " graph-node--path";
                  const lastStep = dijkSteps[dijkSteps.length - 1];
                  orderLabel = `${lastStep.dist[n.id]}`;
                }

                return (
                  <g key={n.id} className={cls}>
                    <circle cx={n.x} cy={n.y} r={22} className="graph-node__circle" />
                    <text x={n.x} y={n.y + 1} className="graph-node__label">{n.id}</text>
                    {orderLabel && (
                      <text x={n.x} y={n.y + 36} className="graph-node__order">{orderLabel}</text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Data structure visualization below the graph */}
            <div className={`graph-ds graph-ds--${mode}`}>
              {mode === "bfs" && (
                <div className="graph-ds__row">
                  <span className="graph-ds__label">Queue</span>
                  <div className="graph-ds__items">
                    {bfsQueue.map((q, i) => (
                      <span key={i} className={`graph-ds__step graph-ds__step--${i}`}>
                        [{q.join(", ")}]
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {mode === "dfs" && (
                <div className="graph-ds__row">
                  <span className="graph-ds__label">Stack</span>
                  <div className="graph-ds__items">
                    {dfsStack.map((s, i) => (
                      <span key={i} className={`graph-ds__step graph-ds__step--${i}`}>
                        [{s.join(", ")}]
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {mode === "dijkstra" && (
                <div className="graph-ds__row graph-ds__row--dijk">
                  <span className="graph-ds__label">dist[]</span>
                  <div className="graph-ds__items">
                    {dijkSteps.map((s, i) => (
                      <span key={i} className={`graph-ds__step graph-ds__step--${i}`}>
                        {nodes.map((n) => `${n.id}:${s.dist[n.id]}`).join(" ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="graph-legend">
              {mode === "bfs" && <>
                <span className="graph-legend__item graph-legend__item--start">起点 A</span>
                <span className="graph-legend__item graph-legend__item--wave">逐层扩散</span>
                <span className="graph-legend__item graph-legend__item--queue">队列驱动</span>
              </>}
              {mode === "dfs" && <>
                <span className="graph-legend__item graph-legend__item--start">起点 A</span>
                <span className="graph-legend__item graph-legend__item--depth">深入到底</span>
                <span className="graph-legend__item graph-legend__item--back">回溯</span>
              </>}
              {mode === "dijkstra" && <>
                <span className="graph-legend__item graph-legend__item--start">起点 A</span>
                <span className="graph-legend__item graph-legend__item--relax">松弛更新</span>
                <span className="graph-legend__item graph-legend__item--path">最短路径</span>
              </>}
            </div>
          </div>
        );
      }}
    />
  );
}
