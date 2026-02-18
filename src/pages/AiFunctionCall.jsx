import TopicShell from "../components/TopicShell.jsx";

const messages = [
  { id: "user-ask",      from: "user", to: "llm",  label: "用户提问",  sub: "上海今天天气怎么样？", phase: "fc", llmState: "thinking", json: null },
  { id: "llm-decide",    from: "llm",  to: "llm",  label: "意图识别",  sub: "需要调用 get_weather", phase: "fc", llmState: "thinking", json: null },
  { id: "llm-call",      from: "llm",  to: "tool", label: "函数调用",  sub: "get_weather(city)",    phase: "fc", llmState: "calling",  json: '{\n  "name": "get_weather",\n  "args": { "city": "Shanghai" }\n}' },
  { id: "tool-return",   from: "tool", to: "llm",  label: "返回结果",  sub: "temp:18, Cloudy",      phase: "fc", llmState: "generating", json: '{\n  "temp": 18,\n  "weather": "Cloudy"\n}' },
  { id: "llm-answer",    from: "llm",  to: "user", label: "最终回答",  sub: "上海今天多云，18°C",    phase: "fc", llmState: "idle",     json: null },
  { id: "user-followup", from: "user", to: "llm",  label: "追问",      sub: "需要带伞吗？",         phase: "da", llmState: "thinking", json: null },
  { id: "llm-direct",    from: "llm",  to: "user", label: "直接回答",  sub: "多云不需要带伞",       phase: "da", llmState: "idle",     json: null },
];

const steps = [
  { id: "s1", title: "1. 用户提问",   description: "用户发送自然语言问题给 LLM。",           bullets: ["输入：上海今天天气怎么样？", "消息进入 LLM 上下文"], active: "user-ask" },
  { id: "s2", title: "2. 意图识别",   description: "LLM 分析问题，判断需要调用外部工具。",   bullets: ["识别天气查询意图", "选择 get_weather 函数"], active: "llm-decide" },
  { id: "s3", title: "3. 函数调用",   description: "LLM 输出结构化的函数调用请求。",         bullets: ["JSON 格式参数", "name + args 结构"], active: "llm-call" },
  { id: "s4", title: "4. 返回结果",   description: "外部工具执行并返回结构化结果。",         bullets: ["temp: 18°C", "weather: Cloudy"], active: "tool-return" },
  { id: "s5", title: "5. 最终回答",   description: "LLM 整合工具结果，生成自然语言回答。",   bullets: ["结合上下文生成回答", "上海今天多云，18°C"], active: "llm-answer" },
  { id: "s6", title: "6. 追问",       description: "用户继续提问，LLM 判断无需调用工具。",   bullets: ["需要带伞吗？", "无需外部数据"], active: "user-followup" },
  { id: "s7", title: "7. 直接回答",   description: "LLM 直接基于已有信息回答。",             bullets: ["多云不需要带伞", "无函数调用"], active: "llm-direct" },
];

const principles = [
  { title: "调用决策", detail: "模型判断是否需要外部数据或动作。", points: ["意图识别 → 工具选择", "参数补全与约束校验", "失败可回退纯文本回答"] },
  { title: "结构化调用", detail: "JSON 参数确保调用可执行与可验证。", points: ["参数 schema 约束", "可重复与可追踪", "便于审计与评估"] },
  { title: "结果回注", detail: "工具结果进入上下文，驱动最终回答。", points: ["结果结构化更可控", "必要时二次调用", "减少幻觉与偏差"] },
];

// Layout constants
const SVG_W = 660;
const UX = 90, LX = 320, TX = 550;
const HEAD_Y = 60;
const ROW_H = 64;
const PHASE_GAP = 32;
const JSON_EXTRA = 60;
const JSON_W = 130, JSON_H = 52;

const phaseLabels = { fc: "函数调用流程", da: "直接回答" };
const phaseColors = {
  fc: { main: "#2a6f6b", light: "rgba(42,111,107,0.12)", mid: "rgba(42,111,107,0.6)" },
  da: { main: "#4c78a8", light: "rgba(76,120,168,0.12)", mid: "rgba(76,120,168,0.6)" },
};

const llmStateStyles = {
  thinking:   { fill: "#b8960a", cls: "thinking" },
  calling:    { fill: "#2a6f6b", cls: "calling" },
  generating: { fill: "#d2642a", cls: "generating" },
  idle:       { fill: "#999",    cls: "idle" },
};

function xOf(role) {
  if (role === "user") return UX;
  if (role === "llm") return LX;
  return TX;
}

function getY(idx) {
  let y = HEAD_Y + 36;
  let lastPhase = null;
  for (let i = 0; i <= idx; i++) {
    if (messages[i].phase !== lastPhase) {
      y += i === 0 ? 10 : PHASE_GAP;
      lastPhase = messages[i].phase;
    }
    if (i > 0) y += ROW_H;
    // Extra space for JSON blocks on previous messages
    if (i > 0 && messages[i - 1].json) y += JSON_EXTRA;
  }
  return y;
}

const totalH = getY(messages.length - 1) + (messages[messages.length - 1].json ? JSON_EXTRA : 0) + 50;

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
      renderDiagram={(step) => {
        const activeIdx = messages.findIndex((m) => m.id === step.active);
        const activeMsg = messages[activeIdx] || messages[0];
        const progressPct = ((activeIdx + 1) / messages.length) * 100;
        const stStyle = llmStateStyles[activeMsg.llmState] || llmStateStyles.idle;

        let lastPhase = null;

        return (
          <div className="fc-svg-wrap">
            <div className="fc-progress-bar">
              <div className="fc-progress-bar__fill" style={{ width: `${progressPct}%` }} />
            </div>

            <svg
              className="fc-svg"
              viewBox={`0 0 ${SVG_W} ${totalH}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker id="fc-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill="currentColor" />
                </marker>
              </defs>

              {/* Machine boxes */}
              {[
                { x: UX, name: "User", sub: "用户" },
                { x: LX, name: "LLM", sub: "大语言模型" },
                { x: TX, name: "Tool/API", sub: "外部工具" },
              ].map((m) => (
                <g key={m.name}>
                  <rect x={m.x - 50} y={8} width={100} height={42} rx={8} className="fc-svg__machine" />
                  <text x={m.x} y={26} className="fc-svg__machine-name">{m.name}</text>
                  <text x={m.x} y={40} className="fc-svg__machine-sub">{m.sub}</text>
                </g>
              ))}

              {/* Lifelines */}
              <line x1={UX} y1={HEAD_Y} x2={UX} y2={totalH} className="fc-svg__lifeline" />
              <line x1={LX} y1={HEAD_Y} x2={LX} y2={totalH} className="fc-svg__lifeline" />
              <line x1={TX} y1={HEAD_Y} x2={TX} y2={totalH} className="fc-svg__lifeline" />

              {/* LLM status indicator */}
              <circle cx={LX} cy={HEAD_Y - 4} r={5} className={`fc-svg__status fc-svg__status--${stStyle.cls}`} fill={stStyle.fill} />

              {/* Messages */}
              {messages.map((msg, idx) => {
                const y = getY(idx);
                const isActive = idx === activeIdx;
                const isPast = idx < activeIdx;
                const isFuture = idx > activeIdx;
                const pc = phaseColors[msg.phase];
                const isSelfRef = msg.from === "llm" && msg.to === "llm";

                // Phase divider
                let phaseDivider = null;
                if (msg.phase !== lastPhase) {
                  lastPhase = msg.phase;
                  const py = y - 20;
                  const divX1 = UX - 40;
                  const divX2 = TX + 40;
                  const divMid = (UX + TX) / 2;
                  phaseDivider = (
                    <g key={`phase-${msg.phase}`}>
                      <line x1={divX1} y1={py} x2={divMid - 50} y2={py} stroke={pc.mid} strokeWidth={0.5} strokeDasharray="4 4" />
                      <line x1={divMid + 50} y1={py} x2={divX2} y2={py} stroke={pc.mid} strokeWidth={0.5} strokeDasharray="4 4" />
                      <rect x={divMid - 48} y={py - 10} width={96} height={20} rx={10} fill={pc.light} stroke={pc.mid} strokeWidth={0.8} />
                      <text x={divMid} y={py + 3} className="fc-svg__phase-text" fill={pc.main}>{phaseLabels[msg.phase]}</text>
                    </g>
                  );
                }

                // Self-reference arc (LLM → LLM)
                if (isSelfRef) {
                  const arcW = 36;
                  const arcH = 22;
                  const arcPath = `M${LX + 6},${y} C${LX + 6 + arcW},${y} ${LX + 6 + arcW},${y + arcH} ${LX + 6},${y + arcH}`;
                  return (
                    <g key={msg.id}>
                      {phaseDivider}
                      <g className={`fc-svg__msg ${isActive ? "is-active" : ""} ${isPast ? "is-past" : ""} ${isFuture ? "is-future" : ""}`}>
                        <path
                          d={arcPath}
                          fill="none"
                          stroke={isActive ? pc.main : isPast ? pc.mid : "rgba(0,0,0,0.15)"}
                          strokeWidth={isActive ? 2 : 1.2}
                          markerEnd="url(#fc-arrow)"
                          className="fc-svg__line"
                          style={{ color: isActive ? pc.main : isPast ? pc.mid : "rgba(0,0,0,0.15)" }}
                        />
                        {isActive && (
                          <circle r={4} className="fc-svg__packet" fill={pc.main}>
                            <animateMotion
                              dur="1.4s"
                              repeatCount="indefinite"
                              path={arcPath}
                              keyTimes="0;1"
                              calcMode="spline"
                              keySplines="0.4 0 0.2 1"
                            />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.4s" repeatCount="indefinite" />
                          </circle>
                        )}
                        {/* Label to the right of arc */}
                        <rect x={LX + 48} y={y - 2} width={80} height={26} rx={6} className="fc-svg__label-bg"
                          fill={isActive ? pc.light : "#fff"}
                          stroke={isActive ? pc.main : isPast ? pc.mid : "rgba(0,0,0,0.1)"}
                          strokeWidth={isActive ? 1.2 : 0.8}
                        />
                        <text x={LX + 88} y={y + 10} className="fc-svg__label" fill={isActive ? pc.main : isPast ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.3)"}>
                          {msg.label}
                        </text>
                        <text x={LX + 88} y={y + 21} className="fc-svg__sub" fill={isActive ? pc.mid : "rgba(0,0,0,0.25)"}>
                          {msg.sub}
                        </text>
                      </g>
                    </g>
                  );
                }

                // Normal message between two lifelines
                const x1 = xOf(msg.from) + 6;
                const x2 = xOf(msg.to) - 6;
                const yEnd = y + 20;
                const midX = (xOf(msg.from) + xOf(msg.to)) / 2;
                const midY = y + 10;

                return (
                  <g key={msg.id}>
                    {phaseDivider}
                    <g className={`fc-svg__msg ${isActive ? "is-active" : ""} ${isPast ? "is-past" : ""} ${isFuture ? "is-future" : ""}`}>
                      {/* Message line */}
                      <line
                        x1={x1} y1={y} x2={x2} y2={yEnd}
                        className="fc-svg__line"
                        stroke={isActive ? pc.main : isPast ? pc.mid : "rgba(0,0,0,0.15)"}
                        strokeWidth={isActive ? 2 : 1.2}
                        markerEnd="url(#fc-arrow)"
                        style={{ color: isActive ? pc.main : isPast ? pc.mid : "rgba(0,0,0,0.15)" }}
                      />

                      {/* Animated packet */}
                      {isActive && (
                        <circle r={4} className="fc-svg__packet" fill={pc.main}>
                          <animateMotion
                            dur="1.4s"
                            repeatCount="indefinite"
                            path={`M${x1},${y} L${x2},${yEnd}`}
                            keyTimes="0;1"
                            calcMode="spline"
                            keySplines="0.4 0 0.2 1"
                          />
                          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.4s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Label pill */}
                      <rect
                        x={midX - 46} y={midY - 13} width={92} height={26} rx={6}
                        className="fc-svg__label-bg"
                        fill={isActive ? pc.light : "#fff"}
                        stroke={isActive ? pc.main : isPast ? pc.mid : "rgba(0,0,0,0.1)"}
                        strokeWidth={isActive ? 1.2 : 0.8}
                      />
                      <text x={midX} y={midY - 1} className="fc-svg__label" fill={isActive ? pc.main : isPast ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.3)"}>
                        {msg.label}
                      </text>
                      <text x={midX} y={midY + 10} className="fc-svg__sub" fill={isActive ? pc.mid : "rgba(0,0,0,0.25)"}>
                        {msg.sub}
                      </text>

                      {/* JSON code block */}
                      {msg.json && !isFuture && (
                        <g className="fc-svg__json">
                          <rect
                            x={midX - JSON_W / 2} y={yEnd + 8}
                            width={JSON_W} height={JSON_H}
                            rx={6}
                            className="fc-svg__json-bg"
                            fill={isActive ? "rgba(42,111,107,0.06)" : "rgba(0,0,0,0.02)"}
                            stroke={isActive ? pc.main : "rgba(0,0,0,0.08)"}
                            strokeWidth={isActive ? 1 : 0.6}
                          />
                          {msg.json.split("\n").map((line, li) => (
                            <text
                              key={li}
                              x={midX - JSON_W / 2 + 8}
                              y={yEnd + 22 + li * 12}
                              className="fc-svg__json-text"
                              fill={isActive ? pc.main : "rgba(0,0,0,0.35)"}
                            >
                              {line}
                            </text>
                          ))}
                        </g>
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        );
      }}
    />
  );
}
