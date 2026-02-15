import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "plan",
    title: "1. 目标与规划",
    description: "拆解任务，生成可执行的计划。",
    bullets: ["分解子任务", "排序优先级"],
    active: "plan",
  },
  {
    id: "act",
    title: "2. 行动执行",
    description: "调用工具或检索，执行关键步骤。",
    bullets: ["工具调用", "外部检索"],
    active: "act",
  },
  {
    id: "reflect",
    title: "3. 反思校验",
    description: "对结果进行验证与修正。",
    bullets: ["一致性检查", "纠错回退"],
    active: "reflect",
  },
];

export default function AiAgent() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="Agent 核心循环"
      subtitle="Plan → Act → Reflect 的闭环，让智能体稳定完成复杂任务。"
      steps={steps}
      panel={[
        { title: "关键能力", detail: "规划、执行、反思与记忆。" },
        { title: "风险点", detail: "幻觉、工具失败、上下文污染。" },
      ]}
      flow={["先规划再执行", "执行结果反思修正", "形成可迭代闭环"]}
      diagramClass="ai-agent"
      renderDiagram={(step) => (
        <div className={`ai-agent__loop mode--${step.active}`}>
          <div className="agent-node plan">Plan</div>
          <div className="agent-node act">Act</div>
          <div className="agent-node reflect">Reflect</div>
          <div className="agent-arrow arrow-pa" />
          <div className="agent-arrow arrow-ar" />
          <div className="agent-arrow arrow-rp" />
          <div className="agent-memory">Memory</div>
        </div>
      )}
    />
  );
}
