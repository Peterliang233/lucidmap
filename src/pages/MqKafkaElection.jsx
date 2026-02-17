import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "followers",
    title: "1. 初始状态",
    description: "三个 Controller 都是 Follower，等待心跳。",
    bullets: ["无 Leader", "稳定等待"],
    active: "followers",
  },
  {
    id: "down",
    title: "2. Leader 挂掉",
    description: "上一任 Leader 掉线，集群进入不确定期。",
    bullets: ["Leader 下线", "等待超时"],
    active: "down",
  },
  {
    id: "timeout",
    title: "3. Election Timeout",
    description: "Follower 超时，提升为 Candidate。",
    bullets: ["自增 Term", "进入候选态"],
    active: "timeout",
  },
  {
    id: "request",
    title: "4. RequestVote",
    description: "Candidate 广播 RequestVote。",
    bullets: ["请求投票", "携带 Term"],
    active: "request",
  },
  {
    id: "vote",
    title: "5. 统计票数",
    description: "收集投票，多数派即当选。",
    bullets: ["实时计票", "2/3 成功"],
    active: "vote",
  },
  {
    id: "heartbeat",
    title: "6. Leader 心跳",
    description: "新 Leader 当选并发送心跳。",
    bullets: ["AppendEntries", "维持权威"],
    active: "heartbeat",
  },
];

const controllers = [
  { id: "c1", label: "C1" },
  { id: "c2", label: "C2" },
  { id: "c3", label: "C3" },
];

const principles = [
  {
    title: "选举触发",
    detail: "Leader 心跳超时触发新一轮选举。",
    points: ["Follower 等待心跳", "超时提升为 Candidate", "Term 自增防止旧 Leader"],
  },
  {
    title: "多数派投票",
    detail: "票数过半即可当选并发送心跳。",
    points: ["RequestVote 广播", "多数派=2/3", "当选后发送 AppendEntries"],
  },
  {
    title: "一致性保障",
    detail: "Term 与投票记录防止脑裂。",
    points: ["每个 Term 只投一票", "旧 Term 票作废", "Heartbeat 维持权威"],
  },
];

function ElectionDiagram({ step }) {
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const laneRefs = useRef({});
  const [anchors, setAnchors] = useState({ track: null, lanes: {}, columns: [] });

  const updateAnchors = () => {
    if (!stageRef.current || !trackRef.current) {
      return;
    }
    const stageRect = stageRef.current.getBoundingClientRect();
    const trackRect = trackRef.current.getBoundingClientRect();
    const lanes = {};
    controllers.forEach((node) => {
      const el = laneRefs.current[node.id];
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const top = rect.top - stageRect.top;
      lanes[node.id] = {
        top,
        bottom: top + rect.height,
        center: top + rect.height / 2,
      };
    });
    const columns = [];
    const trackCells = laneRefs.current.c1?.querySelectorAll(".lane-cell");
    if (trackCells) {
      trackCells.forEach((cell) => {
        const rect = cell.getBoundingClientRect();
        const left = rect.left - stageRect.left;
        columns.push({
          left,
          right: left + rect.width,
          center: left + rect.width / 2,
          gapLeft: 0,
          gapRight: 0,
        });
      });
      columns.forEach((col, index) => {
        const prev = columns[index - 1];
        const next = columns[index + 1];
        if (prev) {
          col.gapLeft = Math.max(0, col.left - prev.right);
        }
        if (next) {
          col.gapRight = Math.max(0, next.left - col.right);
        }
      });
    }
    setAnchors({
      track: {
        left: trackRect.left - stageRect.left,
        width: trackRect.width,
      },
      lanes,
      columns,
    });
  };

  useLayoutEffect(() => {
    updateAnchors();
  }, [step.active]);

  useEffect(() => {
    const handle = () => requestAnimationFrame(updateAnchors);
    window.addEventListener("resize", handle);
    const observer = new ResizeObserver(handle);
    if (stageRef.current) {
      observer.observe(stageRef.current);
    }
    return () => {
      window.removeEventListener("resize", handle);
      observer.disconnect();
    };
  }, []);

  const stateMap = {
    followers: {
      term: 12,
      status: {
        c1: { role: "follower", term: 12, votedFor: "-", heartbeat: "ok" },
        c2: { role: "follower", term: 12, votedFor: "-", heartbeat: "ok" },
        c3: { role: "follower", term: 12, votedFor: "-", heartbeat: "ok" },
      },
    },
    down: {
      term: 12,
      status: {
        c1: { role: "follower", term: 12, votedFor: "-", heartbeat: "ok" },
        c2: { role: "down", term: 12, votedFor: "-", heartbeat: "lost" },
        c3: { role: "follower", term: 12, votedFor: "-", heartbeat: "ok" },
      },
    },
    timeout: {
      term: 13,
      status: {
        c1: { role: "candidate", term: 13, votedFor: "C1", heartbeat: "timeout" },
        c2: { role: "down", term: 12, votedFor: "-", heartbeat: "lost" },
        c3: { role: "follower", term: 12, votedFor: "-", heartbeat: "ok" },
      },
    },
    request: {
      term: 13,
      status: {
        c1: { role: "candidate", term: 13, votedFor: "C1", heartbeat: "timeout" },
        c2: { role: "down", term: 12, votedFor: "-", heartbeat: "lost" },
        c3: { role: "follower", term: 13, votedFor: "-", heartbeat: "ok" },
      },
    },
    vote: {
      term: 13,
      status: {
        c1: { role: "candidate", term: 13, votedFor: "C1", heartbeat: "timeout" },
        c2: { role: "down", term: 12, votedFor: "-", heartbeat: "lost" },
        c3: { role: "follower", term: 13, votedFor: "C1", heartbeat: "ok" },
      },
    },
    heartbeat: {
      term: 13,
      status: {
        c1: { role: "leader", term: 13, votedFor: "C1", heartbeat: "send" },
        c2: { role: "down", term: 12, votedFor: "-", heartbeat: "lost" },
        c3: { role: "follower", term: 13, votedFor: "C1", heartbeat: "recv" },
      },
    },
  };

  const timeline = {
    c1: [
      { step: "followers", role: "follower", label: "Follower", note: "等待心跳" },
      { step: "down", role: "follower", label: "Follower", note: "检测失联" },
      { step: "timeout", role: "candidate", label: "Candidate", note: "Term+1" },
      { step: "request", role: "candidate", label: "Candidate", note: "广播投票" },
      { step: "vote", role: "candidate", label: "Candidate", note: "收集选票" },
      { step: "heartbeat", role: "leader", label: "Leader", note: "心跳维护" },
    ],
    c2: [
      { step: "followers", role: "follower", label: "Follower", note: "稳定运行" },
      { step: "down", role: "down", label: "Down", note: "Leader 掉线" },
      { step: "timeout", role: "down", label: "Down", note: "无响应" },
      { step: "request", role: "down", label: "Down", note: "无响应" },
      { step: "vote", role: "down", label: "Down", note: "无响应" },
      { step: "heartbeat", role: "down", label: "Down", note: "无响应" },
    ],
    c3: [
      { step: "followers", role: "follower", label: "Follower", note: "等待心跳" },
      { step: "down", role: "follower", label: "Follower", note: "检测失联" },
      { step: "timeout", role: "follower", label: "Follower", note: "保持状态" },
      { step: "request", role: "follower", label: "Follower", note: "准备投票" },
      { step: "vote", role: "follower", label: "Follower", note: "投票 C1" },
      { step: "heartbeat", role: "follower", label: "Follower", note: "接收心跳" },
    ],
  };

  const state = stateMap[step.active] || stateMap.followers;
  const emphasizeElection = ["timeout", "request", "vote", "heartbeat"].includes(step.active);
  const hideC2 = step.active !== "followers";
  const terms = [12, 13, 14];
  const termIndex = Math.max(0, terms.indexOf(state.term));
  const termLeft = terms.length > 1 ? (termIndex / (terms.length - 1)) * 100 : 0;

  const stepIndexMap = steps.reduce((acc, item, index) => {
    acc[item.id] = index;
    return acc;
  }, {});

  const renderMessage = ({
    from,
    to,
    label,
    active,
    variant = "",
    stepId,
    offsetX = 0,
    labelSide = "right",
  }) => {
    if (!anchors.track) {
      return null;
    }
    const fromLane = anchors.lanes[from];
    const toLane = anchors.lanes[to];
    if (!fromLane || !toLane) {
      return null;
    }
    const index = stepIndexMap[stepId];
    const column = anchors.columns[index];
    const fallback =
      anchors.track.left + (index + 0.5) * (anchors.track.width / steps.length);
    const x = (column ? column.center : fallback) + offsetX;
    const fromAbove = fromLane.center < toLane.center;
    const start = fromAbove ? fromLane.bottom : fromLane.top;
    const end = fromAbove ? toLane.top : toLane.bottom;
    const top = Math.min(start, end);
    const height = Math.abs(end - start);
    const isReverse = start > end;
    return (
      <div
        className={`timing-message label-${labelSide} ${variant} ${active ? "is-on" : ""} ${
          isReverse ? "is-reverse" : ""
        }`}
        style={{
          "--msg-x": `${x}px`,
          "--msg-top": `${top}px`,
          "--msg-height": `${height}px`,
        }}
      >
        <span className="timing-message__label">{label}</span>
        <span className="timing-message__pulse" />
      </div>
    );
  };

  return (
    <div className={`kraft-timing mode--${step.active}`}>
      <div className="kraft-election__header">
        <div className="kraft-election__title">KRaft Controller Election</div>
        <div className="kraft-term" style={{ "--term-left": `${termLeft}%` }}>
          <div className="term-track">
            {terms.map((term) => (
              <div key={term} className={`term-dot ${term === state.term ? "is-active" : ""}`}>
                Term {term}
              </div>
            ))}
            <span className="term-marker" />
          </div>
          <div className="term-caption">Current Term: {state.term}</div>
        </div>
      </div>

      <div className="timing-axis">
        <div className="axis-label">时间轴</div>
        <div className="axis-steps">
          {steps.map((item) => (
            <div
              key={item.id}
              className={`axis-step ${item.id === step.active ? "is-active" : ""}`}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>

      <div className="timing-stage" ref={stageRef}>
        <div className="timing-rows">
          {controllers.map((node) => {
            const info = state.status[node.id];
            const lane = timeline[node.id];
            const isHidden = node.id === "c2" && hideC2;
            return (
              <div
                key={node.id}
                className={`timing-row ${info.role} ${isHidden ? "is-hidden" : ""}`}
              >
                <div className="lane-meta">
                  <div className="lane-title">{node.label}</div>
                  <div className="lane-role">{info.role}</div>
                  <div className={`lane-chips ${emphasizeElection ? "is-election" : ""}`}>
                    <span className="chip-term">Term {info.term}</span>
                    <span className={`chip-vote ${info.votedFor !== "-" ? "is-active" : ""}`}>
                      Vote {info.votedFor}
                    </span>
                    <span className={`chip-heart ${info.heartbeat !== "ok" ? "is-warn" : ""}`}>
                      Heartbeat {info.heartbeat}
                    </span>
                  </div>
                </div>
                <div
                  className="lane-track"
                  ref={(el) => {
                    laneRefs.current[node.id] = el;
                  }}
                >
                  {lane.map((cell) => (
                    <div
                      key={cell.step}
                      className={`lane-cell ${cell.role} ${
                        cell.step === step.active ? "is-active" : ""
                      }`}
                    >
                      <div className="cell-title">{cell.label}</div>
                      <div className="cell-note">{cell.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="timing-track-area" ref={trackRef} />

        <div className="timing-messages" aria-hidden="true">
          {renderMessage({
            from: "c1",
            to: "c3",
            label: "RequestVote",
            active: step.active === "request",
            variant: "msg--vote",
            stepId: "request",
            offsetX: 0,
            labelSide: "left",
          })}
          {renderMessage({
            from: "c3",
            to: "c1",
            label: "VoteGranted",
            active: step.active === "vote",
            variant: "msg--vote",
            stepId: "vote",
            offsetX: 0,
            labelSide: "left",
          })}
          {renderMessage({
            from: "c1",
            to: "c3",
            label: "Heartbeat",
            active: step.active === "heartbeat",
            variant: "msg--heartbeat",
            stepId: "heartbeat",
            offsetX: 0,
            labelSide: "left",
          })}
        </div>
      </div>

      <div className="kraft-legend">
        <span className="legend-chip leader">Leader</span>
        <span className="legend-chip candidate">Candidate</span>
        <span className="legend-chip follower">Follower</span>
        <span className="legend-chip down">Down</span>
      </div>
    </div>
  );
}

export default function MqKafkaElection() {
  return (
    <TopicShell
      eyebrow="消息队列动画"
      title="Kafka KRaft 选举机制"
      subtitle="用时序图方式展示 KRaft 控制器选举全过程。"
      steps={steps}
      panel={[
        { title: "重点", detail: "Raft 选主 + 多数派投票。" },
        { title: "结果", detail: "Leader 当选后发送心跳维持权威。" },
      ]}
      principles={principles}
      principlesIntro="结合 KRaft 的 Term、投票与心跳机制，理解选举过程。"
      flow={["Follower 等待", "超时变 Candidate", "RequestVote 广播", "计票", "Leader 心跳"]}
      interval={2800}
      diagramClass="mq-kafka-election"
      renderDiagram={(step) => <ElectionDiagram step={step} />}
    />
  );
}
