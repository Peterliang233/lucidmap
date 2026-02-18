import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "token-fill", title: "令牌桶：令牌生成",
    description: "以固定速率向桶中添加令牌，桶满则丢弃多余令牌。",
    bullets: ["速率: 10 token/s", "桶容量: 20", "允许短时突发"],
    active: "token", phase: 0,
  },
  {
    id: "token-consume", title: "令牌桶：请求消费",
    description: "每个请求消耗一个令牌，令牌不足则拒绝或排队。",
    bullets: ["有令牌 → 放行", "无令牌 → 拒绝/等待", "突发后恢复到稳定速率"],
    active: "token", phase: 1,
  },
  {
    id: "leaky-in", title: "漏桶：请求入桶",
    description: "请求以任意速率进入漏桶，桶满则溢出丢弃。",
    bullets: ["桶容量有限", "突发流量先缓冲", "桶满 → 丢弃请求"],
    active: "leaky", phase: 0,
  },
  {
    id: "leaky-out", title: "漏桶：匀速流出",
    description: "请求以恒定速率从桶底流出，输出平滑。",
    bullets: ["恒定速率处理", "削峰填谷", "延迟换稳定"],
    active: "leaky", phase: 1,
  },
  {
    id: "win-count", title: "滑动窗口：计数",
    description: "在时间窗口内统计请求数，超过阈值则限流。",
    bullets: ["窗口: 1s", "阈值: 100 req/s", "窗口滑动避免边界突刺"],
    active: "window", phase: 0,
  },
  {
    id: "win-slide", title: "滑动窗口：窗口滑动",
    description: "窗口随时间滑动，旧请求移出，新请求计入。",
    bullets: ["细分子窗口提高精度", "过期子窗口清零", "比固定窗口更平滑"],
    active: "window", phase: 1,
  },
  {
    id: "cb-closed", title: "熔断器：Closed 状态",
    description: "正常放行请求，统计错误率。",
    bullets: ["错误率 < 阈值 → 保持 Closed", "错误率 ≥ 阈值 → Open", "滑动窗口统计"],
    active: "breaker", phase: 0,
  },
  {
    id: "cb-open", title: "熔断器：Open → Half-Open",
    description: "熔断后快速失败，超时后进入半开状态探测。",
    bullets: ["Open: 所有请求快速失败", "超时后 → Half-Open", "探测请求成功 → Closed"],
    active: "breaker", phase: 1,
  },
];

// Token bucket: tokens array
const tokenPhases = [
  { tokens: 8, incoming: 0, label: "生成令牌 → 桶中 8 个" },
  { tokens: 3, incoming: 5, label: "5 个请求消耗 5 令牌" },
];

// Leaky bucket
const leakyPhases = [
  { level: 6, inRate: "突发", outRate: "—", label: "突发请求入桶" },
  { level: 3, inRate: "—", outRate: "匀速", label: "匀速流出处理" },
];

// Sliding window bars (sub-windows)
const winBars = [12, 28, 45, 38, 22, 15, 8, 30];
const winPhases = [
  { active: [0, 1, 2, 3], threshold: 100, sum: 123, label: "窗口内 123 req > 100 限流" },
  { active: [2, 3, 4, 5], threshold: 100, sum: 120, label: "窗口滑动，旧请求移出" },
];

// Circuit breaker states
const cbStates = [
  { state: "Closed", color: "56,142,60", next: "Open", errRate: "2%" },
  { state: "Open", color: "180,60,60", next: "Half-Open", errRate: "85%" },
];

const principles = [
  { title: "令牌桶", detail: "按固定速率补充令牌，请求消耗令牌。", points: ["允许短时突发", "令牌耗尽即拒绝/排队", "适合 API 限流"] },
  { title: "漏桶", detail: "请求先入桶，再以恒定速率流出。", points: ["输出稳定", "高峰期会排队", "更适合流量整形"] },
  { title: "熔断器", detail: "错误率升高时快速失败，避免雪崩。", points: ["Closed → Open → Half-Open", "探测成功后恢复", "配合限流保护下游"] },
];

export default function BackendRateLimit() {
  return (
    <TopicShell
      eyebrow="系统设计动画"
      title="限流与熔断策略"
      subtitle="令牌桶、漏桶、滑动窗口与熔断器的核心机制。"
      steps={steps}
      panel={[
        { title: "限流目的", detail: "保护服务稳定性，防止过载。" },
        { title: "熔断策略", detail: "快速失败、自动恢复、避免雪崩。" },
      ]}
      principles={principles}
      principlesIntro="对比限流模型与熔断状态机，理解服务保护的核心机制。"
      flow={["令牌桶允许突发", "漏桶输出稳定", "滑动窗口统计频率", "熔断器快速失败"]}
      diagramClass="rl-diagram"
      renderDiagram={(step) => {
        const mode = step.active;
        const phase = step.phase;

        if (mode === "token") {
          const s = tokenPhases[phase];
          return (
            <div className="rl-scene">
              <svg className="rl-svg" viewBox="0 0 360 160" preserveAspectRatio="xMidYMid meet">
                <text x={180} y={16} className="rl-title">令牌桶 Token Bucket</text>
                {/* Bucket */}
                <rect x={120} y={30} width={120} height={90} rx={14} className="rl-bucket" />
                <text x={180} y={48} className="rl-bucket-label">容量: 20</text>
                {/* Tokens */}
                {Array.from({ length: s.tokens }).map((_, i) => (
                  <circle key={i} cx={140 + (i % 4) * 26} cy={62 + Math.floor(i / 4) * 22} r={8}
                    className="rl-token" style={{ "--tk-i": i }} />
                ))}
                {/* Incoming arrows */}
                {phase === 0 && <text x={60} y={75} className="rl-rate-label">10/s →</text>}
                {phase === 1 && <>
                  <text x={290} y={65} className="rl-rate-label">→ 放行</text>
                  <text x={290} y={85} className="rl-rate-label rl-rate-label--dim">5 req</text>
                </>}
                <text x={180} y={140} className="rl-phase-label">{s.label}</text>
              </svg>
              <div className="rl-ds rl-ds--token">
                <span className="rl-ds__label">令牌桶</span>
                <div className="rl-ds__items">
                  {tokenPhases.map((tp, i) => (
                    <span key={i} className={`rl-ds__step ${i === phase ? "rl-ds__step--active" : ""} ${i < phase ? "rl-ds__step--past" : ""}`}>{tp.label}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "leaky") {
          const s = leakyPhases[phase];
          const waterH = s.level * 10;
          return (
            <div className="rl-scene">
              <svg className="rl-svg" viewBox="0 0 360 160" preserveAspectRatio="xMidYMid meet">
                <text x={180} y={16} className="rl-title">漏桶 Leaky Bucket</text>
                {/* Bucket outline */}
                <rect x={130} y={30} width={100} height={90} rx={14} className="rl-bucket" />
                {/* Water level */}
                <rect x={132} y={30 + 90 - waterH} width={96} height={waterH - 2} rx={10} className="rl-water" />
                {/* Drip */}
                <line x1={180} y1={120} x2={180} y2={140} className="rl-drip" />
                <circle cx={180} cy={144} r={3} className="rl-drip-dot">
                  <animate attributeName="cy" values="140;150;140" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
                </circle>
                {/* Labels */}
                {phase === 0 && <text x={80} y={60} className="rl-rate-label">突发 →</text>}
                {phase === 1 && <text x={250} y={140} className="rl-rate-label">→ 匀速</text>}
                <text x={180} y={158} className="rl-phase-label">{s.label}</text>
              </svg>
              <div className="rl-ds rl-ds--leaky">
                <span className="rl-ds__label">漏桶</span>
                <div className="rl-ds__items">
                  {leakyPhases.map((lp, i) => (
                    <span key={i} className={`rl-ds__step ${i === phase ? "rl-ds__step--active" : ""} ${i < phase ? "rl-ds__step--past" : ""}`}>{lp.label}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "window") {
          const s = winPhases[phase];
          const barW = 30, barGap = 6, barX0 = 40, barMaxH = 60, barY = 110;
          return (
            <div className="rl-scene">
              <svg className="rl-svg" viewBox="0 0 360 160" preserveAspectRatio="xMidYMid meet">
                <text x={180} y={16} className="rl-title">滑动窗口 Sliding Window</text>
                {/* Threshold line */}
                <line x1={barX0} y1={barY - 40} x2={barX0 + winBars.length * (barW + barGap)} y2={barY - 40}
                  className="rl-threshold" strokeDasharray="4 3" />
                <text x={barX0 + winBars.length * (barW + barGap) + 4} y={barY - 36} className="rl-threshold-label">阈值</text>
                {/* Bars */}
                {winBars.map((v, i) => {
                  const x = barX0 + i * (barW + barGap);
                  const h = (v / 50) * barMaxH;
                  const inWindow = s.active.includes(i);
                  return (
                    <g key={i}>
                      <rect x={x} y={barY - h} width={barW} height={h} rx={4}
                        className={`rl-bar ${inWindow ? "rl-bar--active" : ""}`} />
                      <text x={x + barW / 2} y={barY + 14} className="rl-bar-label">{v}</text>
                    </g>
                  );
                })}
                {/* Window bracket */}
                <rect x={barX0 + s.active[0] * (barW + barGap) - 3} y={barY - barMaxH - 6}
                  width={s.active.length * (barW + barGap) - barGap + 6} height={barMaxH + 10}
                  rx={6} className="rl-win-bracket" />
                <text x={180} y={barY + 34} className="rl-phase-label">{s.label}</text>
              </svg>
              <div className="rl-ds rl-ds--win">
                <span className="rl-ds__label">窗口</span>
                <div className="rl-ds__items">
                  {winPhases.map((wp, i) => (
                    <span key={i} className={`rl-ds__step ${i === phase ? "rl-ds__step--active" : ""} ${i < phase ? "rl-ds__step--past" : ""}`}>{wp.label}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "breaker") {
          const s = cbStates[phase];
          const states = ["Closed", "Open", "Half-Open"];
          const stateColors = ["56,142,60", "180,60,60", "210,160,42"];
          const SX = 60, SY = 70, SGAP = 120;
          return (
            <div className="rl-scene">
              <svg className="rl-svg" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid meet">
                <text x={200} y={16} className="rl-title">熔断器状态机 Circuit Breaker</text>
                {states.map((st, i) => {
                  const x = SX + i * SGAP;
                  const c = stateColors[i];
                  const isCurrent = st === s.state || (phase === 1 && st === "Half-Open");
                  return (
                    <g key={st}>
                      <rect x={x} y={SY} width={100} height={36} rx={10}
                        className="rl-cb-state"
                        style={{ fill: `rgba(${c},${isCurrent ? 0.15 : 0.04})`, stroke: `rgba(${c},${isCurrent ? 0.6 : 0.2})` }}
                      />
                      <text x={x + 50} y={SY + 22} className="rl-cb-text" style={{ fill: `rgba(${c},0.9)` }}>{st}</text>
                      {/* Arrows between states */}
                      {i < 2 && (
                        <line x1={x + 100} y1={SY + 18} x2={x + SGAP} y2={SY + 18}
                          className="rl-cb-arrow" markerEnd="url(#rl-cb-arr)" />
                      )}
                    </g>
                  );
                })}
                {/* Return arrow from Half-Open to Closed */}
                <path d={`M${SX + 2 * SGAP + 50},${SY + 36} Q${SX + SGAP},${SY + 70} ${SX + 50},${SY + 36}`}
                  className="rl-cb-arrow rl-cb-arrow--return" fill="none" markerEnd="url(#rl-cb-arr)" />
                <text x={SX + SGAP + 50} y={SY + 66} className="rl-cb-return-label">探测成功</text>
                <text x={200} y={SY - 16} className="rl-phase-label">错误率: {s.errRate}</text>
                <defs>
                  <marker id="rl-cb-arr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="rgba(0,0,0,0.3)" /></marker>
                </defs>
              </svg>
              <div className="rl-ds rl-ds--cb">
                <span className="rl-ds__label">熔断</span>
                <div className="rl-ds__items">
                  {cbStates.map((cs, i) => (
                    <span key={i} className={`rl-ds__step ${i === phase ? "rl-ds__step--active" : ""} ${i < phase ? "rl-ds__step--past" : ""}`}>{cs.state}: 错误率 {cs.errRate}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        return null;
      }}
    />
  );
}
