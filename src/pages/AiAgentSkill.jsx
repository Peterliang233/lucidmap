import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "define",
    title: "1. 定义 Skill",
    description: "为 Agent 定义可复用技能与触发条件。",
    bullets: ["输入输出", "能力封装"],
    active: "define",
  },
  {
    id: "invoke",
    title: "2. 调用 Skill",
    description: "在流程中按需调用技能。",
    bullets: ["策略路由", "参数注入"],
    active: "invoke",
  },
  {
    id: "observe",
    title: "3. 评估与迭代",
    description: "通过反馈迭代技能效果。",
    bullets: ["评估指标", "版本迭代"],
    active: "observe",
  },
];

export default function AiAgentSkill() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="Agent Skill 体系"
      subtitle="技能化封装，让 Agent 能力可复用、可治理。"
      steps={steps}
      panel={[
        { title: "目标", detail: "能力沉淀、复用与治理。" },
        { title: "实践", detail: "Skill 版本管理与指标评估。" },
      ]}
      flow={["定义与封装", "按需调用", "评估迭代"]}
      diagramClass="ai-skill"
      renderDiagram={(step) => (
        <div className={`ai-skill__grid mode--${step.active}`}>
          <div className="skill-card">Input</div>
          <div className="skill-card">Policy</div>
          <div className="skill-card">Skill</div>
          <div className="skill-card">Output</div>
          <div className="skill-arrow arrow-1" />
          <div className="skill-arrow arrow-2" />
          <div className="skill-arrow arrow-3" />
          <div className="skill-loop">Feedback</div>
        </div>
      )}
    />
  );
}
