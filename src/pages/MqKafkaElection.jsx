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

function ElectionDiagram({ step }) {
  const wrapRef = useRef(null);
  const nodeRefs = useRef({});
  const [anchors, setAnchors] = useState({});

  const updateAnchors = () => {
    if (!wrapRef.current) {
      return;
    }
    const wrapRect = wrapRef.current.getBoundingClientRect();
    const next = {};
    controllers.forEach((node) => {
      const el = nodeRefs.current[node.id];
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      next[node.id] = {
        x: rect.left - wrapRect.left + rect.width / 2,
        y: rect.top - wrapRect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      };
    });
    setAnchors(next);
  };

  useLayoutEffect(() => {
    updateAnchors();
  }, [step.active]);

  useEffect(() => {
    if (!wrapRef.current) {
      return;
    }
    const handle = () => {
      requestAnimationFrame(updateAnchors);
    };
    window.addEventListener("resize", handle);
    const observer = new ResizeObserver(handle);
    observer.observe(wrapRef.current);
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
      votes: [],
    },
    down: {
      term: 12,
      status: {
        c1: { role: "follower", term: 12, votedFor: "-", heartbeat: "ok" },
        c2: { role: "down", term: 12, votedFor: "-", heartbeat: "lost" },
        c3: { role: "follower", term: 12, votedFor: "-", heartbeat: "ok" },
      },
      down: "c2",
      votes: [],
    },
    timeout: {
      term: 12,
      status: {
        c1: { role: "candidate", term: 13, votedFor: "C1", heartbeat: "timeout" },
        c2: { role: "down", term: 12, votedFor: "-", heartbeat: "lost" },
        c3: { role: "follower", term: 12, votedFor: "-", heartbeat: "ok" },
      },
      candidate: "c1",
      showTimeout: true,
      votes: ["c1"],
    },
    request: {
      term: 13,
      status: {
        c1: { role: "candidate", term: 13, votedFor: "C1", heartbeat: "timeout" },
        c2: { role: "down", term: 12, votedFor: "-", heartbeat: "lost" },
        c3: { role: "follower", term: 13, votedFor: "-", heartbeat: "ok" },
      },
      candidate: "c1",
      showRequest: true,
      votes: ["c1"],
    },
    vote: {
      term: 13,
      status: {
        c1: { role: "candidate", term: 13, votedFor: "C1", heartbeat: "timeout" },
        c2: { role: "down", term: 12, votedFor: "-", heartbeat: "lost" },
        c3: { role: "follower", term: 13, votedFor: "C1", heartbeat: "ok" },
      },
      candidate: "c1",
      showRequest: true,
      votes: ["c1", "c3"],
    },
    heartbeat: {
      term: 13,
      status: {
        c1: { role: "leader", term: 13, votedFor: "C1", heartbeat: "send" },
        c2: { role: "down", term: 12, votedFor: "-", heartbeat: "lost" },
        c3: { role: "follower", term: 13, votedFor: "C1", heartbeat: "recv" },
      },
      leader: "c1",
      showHeartbeat: true,
      votes: ["c1", "c3"],
    },
  };

  const state = stateMap[step.active] || stateMap.followers;
  const emphasizeElection = ["timeout", "request", "vote", "heartbeat"].includes(step.active);
  const terms = [12, 13, 14];
  const termIndex = Math.max(0, terms.indexOf(state.term));
  const termLeft = terms.length > 1 ? (termIndex / (terms.length - 1)) * 100 : 0;
  const voteCount = state.votes.length;
  const votePercent = (voteCount / controllers.length) * 100;

  const renderLine = (from, to, label, active, offsetY, variant = "") => {
    const fromAnchor = anchors[from];
    const toAnchor = anchors[to];
    if (!fromAnchor || !toAnchor) {
      return null;
    }
    let startX = fromAnchor.x;
    let endX = toAnchor.x;
    if (fromAnchor.x < toAnchor.x) {
      startX += fromAnchor.width / 2;
      endX -= toAnchor.width / 2;
    } else {
      startX -= fromAnchor.width / 2;
      endX += toAnchor.width / 2;
    }
    const left = Math.min(startX, endX);
    const width = Math.max(0, Math.abs(endX - startX));
    const mid = (startX + endX) / 2;
    const y = (fromAnchor.y + toAnchor.y) / 2 + offsetY;
    const isReverse = startX > endX;
    return (
      <div
        className={`kraft-line ${variant} ${active ? "is-on" : ""}`}
        style={{
          "--line-left": `${left}px`,
          "--line-width": `${width}px`,
          "--line-mid": `${mid}px`,
          "--line-y": `${y}px`,
        }}
      >
        <div className={`kraft-line__bar ${isReverse ? "is-reverse" : ""}`} />
        <span className="kraft-line__label">{label}</span>
      </div>
    );
  };

  return (
    <div className={`kraft-election mode--${step.active}`}>
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

      <div className="kraft-election__stage">
        <div className="kraft-nodes-wrap" ref={wrapRef}>
          <div className="kraft-lines" aria-hidden="true">
            {renderLine("c1", "c2", "RequestVote", state.showRequest, -18, "line--vote")}
            {renderLine("c1", "c3", "RequestVote", state.showRequest, 0, "line--vote")}
            {renderLine("c1", "c3", "Heartbeat", state.showHeartbeat, 18, "line--heartbeat")}
          </div>

          <div className="kraft-nodes">
            {controllers.map((node) => {
              const info = state.status[node.id];
              const hasVote = state.votes.includes(node.id);
              const isCandidate = info.role === "candidate";
              const isLeader = info.role === "leader";
              const isDown = info.role === "down";
              return (
                <div
                  key={node.id}
                  ref={(el) => {
                    nodeRefs.current[node.id] = el;
                  }}
                  className={`kraft-node ${info.role}`}
                >
                  <div className="node-title">{node.label}</div>
                  <div className="node-status">
                    {isLeader && "Leader"}
                    {isCandidate && "Candidate"}
                    {info.role === "follower" && "Follower"}
                    {isDown && "Down"}
                  </div>
                  <div className={`node-info ${emphasizeElection ? "is-election" : ""}`}>
                    <span className="chip-term">Term {info.term}</span>
                    <span className={`chip-vote ${hasVote ? "is-active" : ""}`}>
                      Vote {info.votedFor}
                    </span>
                    <span className={`chip-heart ${info.heartbeat !== "ok" ? "is-warn" : ""}`}>
                      Heartbeat {info.heartbeat}
                    </span>
                  </div>
                  {state.showTimeout && node.id === state.candidate && (
                    <div className="timeout-ring" />
                  )}
                  {hasVote && <div className="vote-badge">Vote</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="kraft-votes">
          <div className="votes-title">实时计票</div>
          <div className="votes-count">
            {voteCount}/{controllers.length}
          </div>
          <div className="votes-bar">
            <span style={{ width: `${votePercent}%` }} />
          </div>
          <div className="votes-note">{voteCount >= 2 ? "多数派达成" : "等待更多投票"}</div>
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
      subtitle="展示 KRaft 控制器选举全过程：超时、投票、计票、心跳。"
      steps={steps}
      panel={[
        { title: "重点", detail: "Raft 选主 + 多数派投票。" },
        { title: "结果", detail: "Leader 当选后发送心跳维持权威。" },
      ]}
      flow={["Follower 等待", "超时变 Candidate", "RequestVote 广播", "计票", "Leader 心跳"]}
      interval={2800}
      diagramClass="mq-kafka-election"
      renderDiagram={(step) => <ElectionDiagram step={step} />}
    />
  );
}
