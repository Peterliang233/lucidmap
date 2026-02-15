import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "negotiate",
    title: "1. 协议协商",
    description: "Agent 之间声明能力与任务范围。",
    bullets: ["能力声明", "任务分工"],
    active: "negotiate",
  },
  {
    id: "collab",
    title: "2. 协作执行",
    description: "多 Agent 并行执行并汇总。",
    bullets: ["并行", "去中心"],
    active: "collab",
  },
  {
    id: "handoff",
    title: "3. 交接汇总",
    description: "结果汇聚并交付。",
    bullets: ["共识", "最终输出"],
    active: "handoff",
  },
];

export default function AiA2A() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="A2A 协作机制"
      subtitle="多 Agent 协作与任务分发的流程模型。"
      steps={steps}
      panel={[
        { title: "特点", detail: "并行、可扩展、松耦合。" },
        { title: "挑战", detail: "一致性与冲突处理。" },
      ]}
      flow={["能力协商", "并行执行", "结果汇总交付"]}
      diagramClass="ai-a2a"
      renderDiagram={(step) => (
        <div className={`ai-a2a__grid mode--${step.active}`}>
          <div className="a2a-node agent-a">Agent A</div>
          <div className="a2a-node agent-b">Agent B</div>
          <div className="a2a-node agent-c">Agent C</div>
          <div className="a2a-node hub">Coordinator</div>
          <div className="a2a-line line-ab" />
          <div className="a2a-line line-ac" />
          <div className="a2a-line line-bc" />
        </div>
      )}
    />
  );
}
