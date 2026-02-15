import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "bfs",
    title: "BFS",
    description: "按层遍历，适合最短路径。",
    bullets: ["队列", "逐层扩散"],
    active: "bfs",
  },
  {
    id: "dfs",
    title: "DFS",
    description: "深度优先，适合连通性判断。",
    bullets: ["递归/栈", "回溯"],
    active: "dfs",
  },
  {
    id: "shortest",
    title: "最短路",
    description: "基于 BFS 或 Dijkstra 找到最短路径。",
    bullets: ["权重影响", "优先队列"],
    active: "shortest",
  },
];

const nodes = [
  { id: "a", label: "A" },
  { id: "b", label: "B" },
  { id: "c", label: "C" },
  { id: "d", label: "D" },
  { id: "e", label: "E" },
];

export default function AlgoGraphSearch() {
  return (
    <TopicShell
      eyebrow="算法动画"
      title="图论与搜索"
      subtitle="BFS、DFS 与最短路的核心访问顺序。"
      steps={steps}
      panel={[
        { title: "应用场景", detail: "最短路、连通性、拓扑。" },
        { title: "常用结构", detail: "邻接表、优先队列。" },
      ]}
      flow={["BFS 按层扩散", "DFS 深入遍历", "最短路依赖代价"]}
      diagramClass="graph-diagram"
      renderDiagram={(step) => (
        <div className={`graph-board mode--${step.active}`}>
          {nodes.map((node) => (
            <div key={node.id} className={`graph-node node--${node.id}`}>
              {node.label}
            </div>
          ))}
          <div className="graph-edge edge-ab" />
          <div className="graph-edge edge-ac" />
          <div className="graph-edge edge-bd" />
          <div className="graph-edge edge-ce" />
          <div className="graph-edge edge-de" />
        </div>
      )}
    />
  );
}
