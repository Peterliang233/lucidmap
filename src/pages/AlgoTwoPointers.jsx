import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "init",
    title: "初始化",
    description: "左右指针分别指向两端。",
    bullets: ["left=0", "right=n-1"],
    left: 0,
    right: 6,
  },
  {
    id: "move-left",
    title: "移动左指针",
    description: "根据条件移动左指针。",
    bullets: ["left++", "缩小区间"],
    left: 2,
    right: 6,
  },
  {
    id: "move-right",
    title: "移动右指针",
    description: "根据条件移动右指针。",
    bullets: ["right--", "缩小区间"],
    left: 2,
    right: 4,
  },
  {
    id: "meet",
    title: "相遇",
    description: "指针相遇或交错，算法结束。",
    bullets: ["left >= right", "输出结果"],
    left: 3,
    right: 3,
  },
];

const values = [1, 3, 5, 7, 9, 11, 13];

export default function AlgoTwoPointers() {
  return (
    <TopicShell
      eyebrow="算法动画"
      title="双指针与滑动窗口"
      subtitle="用指针移动示意双指针算法。"
      steps={steps}
      panel={[
        { title: "场景", detail: "有序数组、字符串、窗口问题。" },
        { title: "技巧", detail: "缩小搜索空间，提高效率。" },
      ]}
      flow={["双指针缩小区间", "滑动窗口维护区间状态", "时间复杂度 O(n)"]}
      diagramClass="pointer-diagram"
      renderDiagram={(step) => (
        <div className="pointer-board" style={{ "--left": step.left, "--right": step.right }}>
          <div className="pointer-array">
            {values.map((value, index) => (
              <div key={value} className="pointer-cell">
                <span>{value}</span>
                <div className="cell-index">{index}</div>
              </div>
            ))}
          </div>
          <div className="pointer-marker pointer-left">L</div>
          <div className="pointer-marker pointer-right">R</div>
        </div>
      )}
    />
  );
}
