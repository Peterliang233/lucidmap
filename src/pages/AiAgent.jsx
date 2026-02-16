import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "entry",
    title: "1. 任务入口",
    description: "用户目标进入核心，引导整体推理方向。",
    bullets: ["目标输入", "上下文约束"],
    active: "entry",
    example: {
      title: "示例：预订酒店",
      lines: ["用户说：周五入住广州", "补充预算与偏好"],
    },
  },
  {
    id: "plan",
    title: "2. 规划决策",
    description: "规划模块拆解路径，驱动核心推理。",
    bullets: ["任务分解", "策略选择"],
    active: "plan",
    example: {
      title: "示例：预订酒店",
      lines: ["拆解：日期 → 地段 → 价格", "决定先确认入住时间"],
    },
  },
  {
    id: "act",
    title: "3. 工具执行",
    description: "工具执行模块完成调用，产出可用证据。",
    bullets: ["工具调度", "结果回传"],
    active: "act",
    example: {
      title: "示例：预订酒店",
      lines: ["调用日历/酒店搜索", "返回可选房型与价格"],
    },
  },
  {
    id: "memory",
    title: "4. 记忆闭环",
    description: "观察与记忆沉淀，形成稳定的反馈回路。",
    bullets: ["状态沉淀", "复用经验"],
    active: "memory",
    example: {
      title: "示例：预订酒店",
      lines: ["记录偏好：近地铁/安静", "下次优先推荐匹配项"],
    },
  },
];

export default function AiAgent() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="Agent 架构"
      subtitle="以核心模块为中心，构建规划、工具、记忆与反馈的协作体系。"
      steps={steps}
      panel={[
        { title: "核心模块", detail: "任务入口、规划、工具、记忆与观察。" },
        { title: "协作重点", detail: "模块间的数据流与反馈闭环。" },
      ]}
      flow={["目标进入核心", "规划驱动工具执行", "观察与记忆强化"]}
      diagramClass="ai-agent"
      renderDiagram={(step) => (
        <div className={`ai-agent__arch mode--${step.active}`}>
          <svg className="agent-arch__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="agent-line line-entry" d="M26 50 L44 50" />
            <path className="agent-line line-plan" d="M50 28 L50 44" />
            <path className="agent-line line-core-tool" d="M56 50 L74 50" />
            <path className="agent-line line-core-memory" d="M44 60 Q 36 68 26 76" />
            <path className="agent-line line-tool-observe" d="M74 50 Q 62 66 54 76" />
            <path className="agent-line line-observe-memory" d="M46 78 L28 78" />
          </svg>

          <div className="agent-arch__signals" aria-hidden="true">
            <span className="agent-signal signal-entry" />
            <span className="agent-signal signal-plan" />
            <span className="agent-signal signal-tool" />
            <span className="agent-signal signal-feedback" />
            <span className="agent-signal signal-memory" />
          </div>

          <div className="agent-arch__grid">
            <div className="agent-module planner">
              <span className="module-title">Planner</span>
              <span className="module-meta">策略分解</span>
            </div>
            <div className="agent-module user">
              <span className="module-title">User / Goal</span>
              <span className="module-meta">任务入口</span>
            </div>
            <div className="agent-module core">
              <span className="module-title">Agent Core</span>
              <span className="module-meta">LLM 推理中枢</span>
            </div>
            <div className="agent-module tools">
              <span className="module-title">Tool Executor</span>
              <span className="module-meta">执行调度</span>
            </div>
            <div className="agent-module memory">
              <span className="module-title">Memory</span>
              <span className="module-meta">经验沉淀</span>
            </div>
            <div className="agent-module observe">
              <span className="module-title">Observation</span>
              <span className="module-meta">环境反馈</span>
            </div>
          </div>

          <div className={`agent-example example--${step.active}`}>
            <div className="agent-example__title">{step.example?.title || "示例"}</div>
            <div className="agent-example__lines">
              {(step.example?.lines || []).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
