import TopicShell from "../components/TopicShell.jsx";

const steps = [
  { id: "syn", title: "1. SYN", description: "客户端发送 SYN 包，申请建立连接。", bullets: ["标记 SYN=1", "选择初始序列号 seq=1000"], active: "syn" },
  { id: "syn-ack", title: "2. SYN-ACK", description: "服务端确认并返回 SYN-ACK。", bullets: ["ACK=1001", "SYN=1，序列号 seq=5000"], active: "syn-ack" },
  { id: "ack", title: "3. ACK", description: "客户端发送 ACK，连接建立完成。", bullets: ["ACK=5001", "进入 ESTABLISHED"], active: "ack" },
  { id: "data", title: "4. 数据传输", description: "握手完成后，开始可靠数据传输。", bullets: ["序列号递增", "基于 ACK 确认"], active: "data" },
  { id: "fin-1", title: "5. FIN", description: "主动关闭方发送 FIN，申请关闭连接。", bullets: ["FIN=1", "进入 FIN-WAIT-1"], active: "fin-1" },
  { id: "fin-ack", title: "6. ACK", description: "被动关闭方确认 FIN。", bullets: ["ACK=fin+1", "进入 CLOSE-WAIT"], active: "fin-ack" },
  { id: "fin-2", title: "7. FIN", description: "被动关闭方发送 FIN，准备关闭。", bullets: ["FIN=1", "进入 LAST-ACK"], active: "fin-2" },
  { id: "fin-close", title: "8. ACK", description: "主动关闭方确认，进入 TIME-WAIT。", bullets: ["ACK=fin+1", "等待 2MSL"], active: "fin-close" },
];

const messages = [
  { id: "syn",       dir: "right", label: "SYN",     sub: "seq=1000",          phase: "handshake", cState: "SYN-SENT",    sState: "LISTEN" },
  { id: "syn-ack",   dir: "left",  label: "SYN+ACK", sub: "seq=5000 ack=1001", phase: "handshake", cState: "SYN-SENT",    sState: "SYN-RCVD" },
  { id: "ack",       dir: "right", label: "ACK",     sub: "ack=5001",          phase: "handshake", cState: "ESTABLISHED", sState: "ESTABLISHED" },
  { id: "data",      dir: "right", label: "DATA",    sub: "seq=1001 len=512",  phase: "transfer",  cState: "ESTABLISHED", sState: "ESTABLISHED" },
  { id: "data-reply",dir: "left",  label: "ACK",     sub: "ack=1513",          phase: "transfer",  cState: "ESTABLISHED", sState: "ESTABLISHED" },
  { id: "fin-1",     dir: "right", label: "FIN",     sub: "seq=2000",          phase: "teardown",  cState: "FIN-WAIT-1",  sState: "ESTABLISHED" },
  { id: "fin-ack",   dir: "left",  label: "ACK",     sub: "ack=2001",          phase: "teardown",  cState: "FIN-WAIT-2",  sState: "CLOSE-WAIT" },
  { id: "fin-2",     dir: "left",  label: "FIN",     sub: "seq=6000",          phase: "teardown",  cState: "TIME-WAIT",   sState: "LAST-ACK" },
  { id: "fin-close", dir: "right", label: "ACK",     sub: "ack=6001",          phase: "teardown",  cState: "TIME-WAIT",   sState: "CLOSED" },
];

const phaseLabels = { handshake: "三次握手", transfer: "数据传输", teardown: "四次挥手" };
const phaseColors = {
  handshake: { main: "#2a6f6b", light: "rgba(42,111,107,0.12)", mid: "rgba(42,111,107,0.6)" },
  transfer:  { main: "#4c78a8", light: "rgba(76,120,168,0.12)", mid: "rgba(76,120,168,0.6)" },
  teardown:  { main: "#d2642a", light: "rgba(210,100,42,0.12)", mid: "rgba(210,100,42,0.6)" },
};

// Layout constants
const CX = 120, SX = 480, ROW_H = 56, HEAD_Y = 60, PHASE_GAP = 28;

function getY(idx) {
  // Calculate y position accounting for phase dividers
  let y = HEAD_Y + 30;
  let lastPhase = null;
  for (let i = 0; i <= idx; i++) {
    if (messages[i].phase !== lastPhase) {
      y += i === 0 ? 10 : PHASE_GAP;
      lastPhase = messages[i].phase;
    }
    if (i > 0) y += ROW_H;
  }
  return y;
}

const totalH = getY(messages.length - 1) + 50;

function stateColor(state) {
  if (state === "ESTABLISHED") return "#388e3c";
  if (state === "CLOSED") return "#999";
  if (state === "TIME-WAIT") return "#d2822a";
  return "#b8960a";
}

const principles = [
  { title: "连接建立", detail: "三次握手确认双方收发能力，避免旧连接复用。", points: ["SYN=1, seq=x；SYN-ACK=1, ack=x+1", "第三次 ACK 让服务端进入 ESTABLISHED", "序列号确保连接的唯一性"] },
  { title: "可靠传输", detail: "序列号、ACK 与重传机制保证有序可靠。", points: ["DATA 序号递增，丢包触发重传", "窗口控制发送速率", "RTT 估算超时"] },
  { title: "挥手示例", detail: "双方独立关闭，TIME-WAIT 确保可靠终止。", points: ["客户端 FIN → FIN-WAIT-1", "服务端 ACK 后 CLOSE-WAIT，再发 FIN", "主动方等待 2MSL"] },
];

export default function NetworkTcpHandshake() {
  return (
    <TopicShell
      eyebrow="网络协议动画"
      title="TCP 三次握手与四次挥手"
      subtitle="通过消息时序展示连接建立与断开流程。"
      steps={steps}
      panel={[
        { title: "目的", detail: "可靠建立连接，确保双方具备收发能力。" },
        { title: "状态机", detail: "CLOSED → SYN-SENT → ESTABLISHED。" },
      ]}
      principles={principles}
      principlesIntro="结合握手/挥手时序，拆解连接建立、可靠传输与关闭的核心原理。"
      flow={["三次握手避免旧连接复用", "序列号用于可靠传输", "四次挥手确保双方数据发送完毕"]}
      diagramClass="tcp-diagram"
      renderDiagram={(step) => {
        const activeIdx = messages.findIndex(
          (m) => m.id === step.active || (step.active === "data" && m.id.startsWith("data"))
        );
        const activeMsg = messages[activeIdx] || messages[0];
        const progressPct = ((activeIdx + 1) / messages.length) * 100;

        let lastPhase = null;
        const phaseRows = [];

        return (
          <div className="tcp-svg-wrap">
            {/* Progress bar */}
            <div className="tcp-progress-bar">
              <div className="tcp-progress-bar__fill" style={{ width: `${progressPct}%` }} />
            </div>

            <svg
              className="tcp-svg"
              viewBox={`0 0 600 ${totalH}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker id="tcp-arrow-r" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill="currentColor" />
                </marker>
                <marker id="tcp-arrow-l" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
                  <path d="M8,0 L0,3 L8,6" fill="currentColor" />
                </marker>
              </defs>

              {/* Machine boxes */}
              <rect x={CX - 50} y={8} width={100} height={42} rx={8} className="tcp-svg__machine" />
              <text x={CX} y={26} className="tcp-svg__machine-name">Client</text>
              <text x={CX} y={40} className="tcp-svg__machine-port">:54321</text>

              <rect x={SX - 50} y={8} width={100} height={42} rx={8} className="tcp-svg__machine" />
              <text x={SX} y={26} className="tcp-svg__machine-name">Server</text>
              <text x={SX} y={40} className="tcp-svg__machine-port">:443</text>

              {/* Lifelines */}
              <line x1={CX} y1={HEAD_Y} x2={CX} y2={totalH} className="tcp-svg__lifeline" />
              <line x1={SX} y1={HEAD_Y} x2={SX} y2={totalH} className="tcp-svg__lifeline" />

              {/* Active state indicators on lifelines */}
              <circle cx={CX} cy={HEAD_Y - 4} r={5} className={`tcp-svg__status tcp-svg__status--${activeMsg.cState === "ESTABLISHED" ? "ok" : activeMsg.cState === "CLOSED" ? "off" : activeMsg.cState.includes("WAIT") ? "warn" : "wait"}`} />
              <circle cx={SX} cy={HEAD_Y - 4} r={5} className={`tcp-svg__status tcp-svg__status--${activeMsg.sState === "ESTABLISHED" ? "ok" : activeMsg.sState === "CLOSED" || activeMsg.sState === "LISTEN" ? "off" : activeMsg.sState.includes("WAIT") || activeMsg.sState === "LAST-ACK" ? "warn" : "wait"}`} />

              {/* Messages */}
              {messages.map((msg, idx) => {
                const y = getY(idx);
                const isActive = idx === activeIdx || (step.active === "data" && msg.id.startsWith("data") && idx <= activeIdx);
                const isPast = idx < activeIdx;
                const visible = isActive || isPast;
                const pc = phaseColors[msg.phase];

                const x1 = msg.dir === "right" ? CX + 6 : SX - 6;
                const x2 = msg.dir === "right" ? SX - 6 : CX + 6;
                const yEnd = y + 20;
                const midX = (CX + SX) / 2;
                const midY = y + 10;

                // Phase divider
                let phaseDivider = null;
                if (msg.phase !== lastPhase) {
                  lastPhase = msg.phase;
                  const py = y - 18;
                  phaseDivider = (
                    <g key={`phase-${msg.phase}`} className="tcp-svg__phase">
                      <line x1={CX - 40} y1={py} x2={SX + 40} y2={py} stroke={pc.mid} strokeWidth={0.5} strokeDasharray="4 4" />
                      <rect x={midX - 36} y={py - 10} width={72} height={20} rx={10} fill={pc.light} stroke={pc.mid} strokeWidth={0.8} />
                      <text x={midX} y={py + 3} className="tcp-svg__phase-text" fill={pc.main}>{phaseLabels[msg.phase]}</text>
                    </g>
                  );
                }

                return (
                  <g key={msg.id}>
                    {phaseDivider}
                    <g className={`tcp-svg__msg ${isActive ? "is-active" : ""} ${isPast ? "is-past" : ""} ${!visible ? "is-future" : ""}`} data-phase={msg.phase}>
                      {/* Message line */}
                      <line
                        x1={x1} y1={y} x2={x2} y2={yEnd}
                        className="tcp-svg__line"
                        stroke={isActive ? pc.main : isPast ? pc.mid : "rgba(0,0,0,0.15)"}
                        strokeWidth={isActive ? 2 : 1.2}
                        markerEnd={msg.dir === "right" ? "url(#tcp-arrow-r)" : "url(#tcp-arrow-l)"}
                        style={{ color: isActive ? pc.main : isPast ? pc.mid : "rgba(0,0,0,0.15)" }}
                      />

                      {/* Animated packet along the line */}
                      {isActive && (
                        <circle r={4} className="tcp-svg__packet" fill={pc.main}>
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

                      {/* Label on the line */}
                      <rect
                        x={midX - 52} y={midY - 13} width={104} height={26} rx={6}
                        className="tcp-svg__label-bg"
                        fill={isActive ? pc.light : "#fff"}
                        stroke={isActive ? pc.main : isPast ? pc.mid : "rgba(0,0,0,0.1)"}
                        strokeWidth={isActive ? 1.2 : 0.8}
                      />
                      <text x={midX} y={midY - 1} className="tcp-svg__label" fill={isActive ? pc.main : isPast ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.3)"}>
                        {msg.label}
                      </text>
                      <text x={midX} y={midY + 10} className="tcp-svg__sub" fill={isActive ? pc.mid : "rgba(0,0,0,0.25)"}>
                        {msg.sub}
                      </text>

                      {/* State badges on lifelines */}
                      {visible && (
                        <>
                          <text x={CX - 12} y={y + 4} className={`tcp-svg__state tcp-svg__state--right ${isPast && !isActive ? "is-past" : ""}`} fill={stateColor(msg.cState)}>
                            {msg.cState}
                          </text>
                          <text x={SX + 12} y={yEnd + 4} className={`tcp-svg__state tcp-svg__state--left ${isPast && !isActive ? "is-past" : ""}`} fill={stateColor(msg.sState)}>
                            {msg.sState}
                          </text>
                        </>
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
