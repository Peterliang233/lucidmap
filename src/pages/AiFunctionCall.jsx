import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "decide",
    title: "1. 决策",
    description: "模型判断是否需要调用函数。",
    bullets: ["意图识别", "参数准备"],
    active: "decide",
  },
  {
    id: "call",
    title: "2. 调用",
    description: "输出函数名与结构化参数。",
    bullets: ["JSON 参数", "可复用接口"],
    active: "call",
  },
  {
    id: "result",
    title: "3. 结果回注",
    description: "函数返回结果，模型继续推理。",
    bullets: ["结构化结果", "最终答案"],
    active: "result",
  },
];

const principles = [
  {
    title: "调用决策",
    detail: "模型判断是否需要外部数据或动作。",
    points: ["意图识别 → 工具选择", "参数补全与约束校验", "失败可回退纯文本回答"],
  },
  {
    title: "结构化调用",
    detail: "JSON 参数确保调用可执行与可验证。",
    points: ["参数 schema 约束", "可重复与可追踪", "便于审计与评估"],
  },
  {
    title: "结果回注",
    detail: "工具结果进入上下文，驱动最终回答。",
    points: ["结果结构化更可控", "必要时二次调用", "减少幻觉与偏差"],
  },
];

export default function AiFunctionCall() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="Function Call 机制"
      subtitle="用结构化调用把模型接入真实世界能力。"
      steps={steps}
      panel={[
        { title: "优势", detail: "可靠性提升、结果可控。" },
        { title: "风险", detail: "参数错误、函数失败。" },
      ]}
      principles={principles}
      principlesIntro="从决策、结构化调用与结果回注理解 Function Call 的价值。"
      flow={["意图识别", "结构化调用", "结果回注再推理"]}
      diagramClass="ai-fncall"
      renderDiagram={(step) => (
        <div className={`ai-fncall__grid mode--${step.active}`}>
          <div className="fncall-node llm">Model</div>
          <div className="fncall-node tool">Function</div>
          <div className="fncall-params">{`{ "city": "Shanghai" }`}</div>
          <div className="fncall-result">{`{ "temp": 18, "text": "Cloudy" }`}</div>
          <div className="fncall-arrow arrow-1" />
          <div className="fncall-arrow arrow-2" />
        </div>
      )}
    />
  );
}
