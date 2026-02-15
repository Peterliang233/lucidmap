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
