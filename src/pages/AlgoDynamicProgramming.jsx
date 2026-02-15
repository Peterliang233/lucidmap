import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "state",
    title: "定义状态",
    description: "明确 dp[i] 或 dp[i][j] 的含义。",
    bullets: ["状态压缩", "边界条件"],
    active: "state",
  },
  {
    id: "transition",
    title: "状态转移",
    description: "建立递推关系式。",
    bullets: ["最优子结构", "无后效性"],
    active: "transition",
  },
  {
    id: "fill",
    title: "表格填充",
    description: "按顺序填充 DP 表。",
    bullets: ["自底向上", "滚动数组"],
    active: "fill",
  },
];

export default function AlgoDynamicProgramming() {
  return (
    <TopicShell
      eyebrow="算法动画"
      title="动态规划"
      subtitle="用网格表格展示 dp 递推过程。"
      steps={steps}
      panel={[
        { title: "核心思想", detail: "拆分问题、保存子结果。" },
        { title: "优化", detail: "滚动数组、空间压缩。" },
      ]}
      flow={["定义状态", "推导转移", "按序填表"]}
      diagramClass="dp-diagram"
      renderDiagram={(step) => (
        <div className={`dp-grid mode--${step.active}`}>
          {Array.from({ length: 25 }).map((_, index) => (
            <div key={index} className="dp-cell">
              {index % 5 === 0 ? "0" : ""}
            </div>
          ))}
          <div className="dp-path" />
        </div>
      )}
    />
  );
}
