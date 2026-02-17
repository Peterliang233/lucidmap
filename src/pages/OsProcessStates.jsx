import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const flow = [
  "new",
  "ready",
  "running",
  "blocked",
  "ready",
  "running",
  "terminated",
];

const stateMeta = {
  new: "创建",
  ready: "就绪",
  running: "运行",
  blocked: "阻塞",
  terminated: "终止",
};

const transitions = [
  { from: "new", to: "ready", label: "创建完成" },
  { from: "ready", to: "running", label: "调度" },
  { from: "running", to: "blocked", label: "I/O 等待" },
  { from: "blocked", to: "ready", label: "事件完成" },
  { from: "running", to: "terminated", label: "退出" },
];

const statePositions = {
  new: { x: 16, y: 16 },
  ready: { x: 16, y: 62 },
  running: { x: 48, y: 62 },
  blocked: { x: 78, y: 62 },
  terminated: { x: 82, y: 16 },
};

export default function OsProcessStates() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [connector, setConnector] = useState(null);
  const containerRef = useRef(null);
  const nodeRefs = useRef({});

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % flow.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [playing]);

  const activeState = flow[stepIndex];

  const activeTransition = useMemo(() => {
    if (stepIndex === 0) return null;
    const from = flow[stepIndex - 1];
    const to = flow[stepIndex];
    return transitions.find((t) => t.from === from && t.to === to) || null;
  }, [stepIndex]);

  const fromState = activeTransition ? activeTransition.from : null;
  const toState = activeTransition ? activeTransition.to : activeState;
  const focusStates = new Set([fromState, toState].filter(Boolean));

  const activePosition = statePositions[activeState] || statePositions.new;
  const tokenStyle = { top: `${activePosition.y}%`, left: `${activePosition.x}%` };

  useEffect(() => {
    if (!activeTransition) {
      setConnector(null);
      return undefined;
    }

    const updateConnector = () => {
      const container = containerRef.current;
      const fromNode = nodeRefs.current[activeTransition.from];
      const toNode = nodeRefs.current[activeTransition.to];
      if (!container || !fromNode || !toNode) {
        setConnector(null);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();
      const fromCenter = {
        x: fromRect.left + fromRect.width / 2 - containerRect.left,
        y: fromRect.top + fromRect.height / 2 - containerRect.top,
      };
      const toCenter = {
        x: toRect.left + toRect.width / 2 - containerRect.left,
        y: toRect.top + toRect.height / 2 - containerRect.top,
      };

      const dx = toCenter.x - fromCenter.x;
      const dy = toCenter.y - fromCenter.y;
      const distance = Math.hypot(dx, dy) || 1;
      const ux = dx / distance;
      const uy = dy / distance;
      const edgeDistance = (rect) => {
        const halfW = rect.width / 2;
        const halfH = rect.height / 2;
        const scale = 1 / Math.max(Math.abs(ux) / halfW, Math.abs(uy) / halfH);
        return scale;
      };
      const fromInset = edgeDistance(fromRect);
      const toInset = edgeDistance(toRect);
      const start = {
        x: fromCenter.x + ux * fromInset,
        y: fromCenter.y + uy * fromInset,
      };
      const end = {
        x: toCenter.x - ux * toInset,
        y: toCenter.y - uy * toInset,
      };
      let path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      let labelPoint = null;
      const isHorizontalLabel =
        (activeTransition.from === "new" && activeTransition.to === "ready") ||
        (activeTransition.from === "blocked" && activeTransition.to === "ready");

      if (activeTransition.from === "blocked" && activeTransition.to === "ready") {
        const baseOffset = Math.min(containerRect.height * 0.18, 60);
        const minOffset = Math.max(18, Math.min(start.y, end.y) - 16);
        const offset = Math.min(baseOffset, minOffset);
        const bendY = Math.min(start.y, end.y) - offset;
        path = `M ${start.x} ${start.y} C ${start.x} ${bendY}, ${end.x} ${bendY}, ${end.x} ${end.y}`;
        labelPoint = {
          x: (start.x + end.x) / 2,
          y: Math.max(10, bendY - 10),
        };
      }

      if (isHorizontalLabel) {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const nx = uy;
        const ny = -ux;
        const offset = activeTransition.from === "blocked" ? -14 : 12;
        if (!labelPoint) {
          labelPoint = {
            x: midX + nx * offset,
            y: midY + ny * offset,
          };
        }
      }

      setConnector({
        path,
        viewBox: `0 0 ${containerRect.width} ${containerRect.height}`,
        labelPoint,
        isHorizontalLabel,
      });
    };

    updateConnector();
    window.addEventListener("resize", updateConnector);
    return () => window.removeEventListener("resize", updateConnector);
  }, [activeTransition]);

  return (
    <Layout>
      <div className="topic">
      <header className="topic__hero">
        <div>
          <p className="topic__eyebrow">操作系统动画</p>
          <h1>进程模型与状态转换</h1>
          <p className="topic__subtitle">
            展示进程在创建、就绪、运行、阻塞、终止之间的流转与触发条件。
          </p>
          <div className="topic__actions">
            <button className="topic__primary" type="button" onClick={() => setPlaying((v) => !v)}>
              {playing ? "暂停" : "播放"}
            </button>
            <Link className="topic__back" to="/map">
              返回导航
            </Link>
          </div>
        </div>
        <div className="topic__panel">
          <div className="topic__card">
            <h3>当前状态</h3>
            <p className="process-step__title">{stateMeta[activeState]}</p>
          </div>
          <div className="topic__card">
            <h3>触发条件</h3>
            <p>{activeTransition ? activeTransition.label : "初始化"}</p>
          </div>
        </div>
      </header>

      <section className="topic__stage">
        <div className="process-stage">
          <div className="state-machine" ref={containerRef}>
            {connector && activeTransition ? (
              <svg className="state-connector" viewBox={connector.viewBox} preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <marker
                    id="stateArrow"
                    viewBox="0 0 10 10"
                    refX="9.4"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    markerUnits="userSpaceOnUse"
                    orient="auto"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 Z" fill="currentColor" />
                  </marker>
                </defs>
                <path
                  id="state-connector-path"
                  className="state-connector__path"
                  d={connector.path}
                  markerEnd="url(#stateArrow)"
                />
                {connector.isHorizontalLabel && connector.labelPoint ? (
                  <text
                    className="state-connector__label is-horizontal"
                    x={connector.labelPoint.x}
                    y={connector.labelPoint.y}
                    textAnchor="middle"
                  >
                    {activeTransition.label}
                  </text>
                ) : (
                  <text className="state-connector__label" textAnchor="middle" dy="-6">
                    <textPath href="#state-connector-path" startOffset="58%" method="align" spacing="auto">
                      {activeTransition.label}
                    </textPath>
                  </text>
                )}
              </svg>
            ) : null}
            {Object.keys(stateMeta).map((state) => (
              <div
                key={state}
                className={`state-node state-node--${state} ${activeState === state ? "is-active" : ""} ${
                  fromState === state ? "is-from" : ""
                } ${toState === state ? "is-to" : ""} ${
                  focusStates.size && !focusStates.has(state) ? "is-dim" : ""
                }`}
                style={{
                  top: `${statePositions[state].y}%`,
                  left: `${statePositions[state].x}%`,
                }}
                ref={(el) => {
                  if (el) {
                    nodeRefs.current[state] = el;
                  }
                }}
              >
                <span>{stateMeta[state]}</span>
              </div>
            ))}
            <div className="state-token" style={tokenStyle} />
          </div>

          <div className="process-principles os-principles">
            <div className="os-principles__card">
              <span className="os-principles__eyebrow">原理拆解</span>
              <h3 className="os-principles__title">进程状态机主线</h3>
              <p className="os-principles__desc">
                进程在就绪队列中等待调度，获得时间片后进入运行；遇到 I/O 或事件等待会阻塞，
                事件完成后回到就绪，最终退出并释放资源。
              </p>
              <div className="os-principles__list">
                <div className="os-principles__item">
                  <strong>创建 → 就绪</strong>
                  <span>初始化 PCB/地址空间，将进程放入 ready queue。</span>
                </div>
                <div className="os-principles__item">
                  <strong>就绪 → 运行</strong>
                  <span>调度器分配 CPU，进入时间片执行。</span>
                </div>
                <div className="os-principles__item">
                  <strong>运行 → 阻塞</strong>
                  <span>I/O/锁等待触发 sleep，等待事件完成。</span>
                </div>
              </div>
            </div>
            <div className="os-principles__card">
              <h3 className="os-principles__title">示例时序</h3>
              <p className="os-principles__desc">以一次磁盘读取为例的状态流转。</p>
              <div className="os-principles__example">
                <span>t0: fork() → 创建</span>
                <span>t1: ready queue → 运行</span>
                <span>t2: read() → 阻塞等待 I/O</span>
                <span>t3: I/O 完成 → 就绪</span>
                <span>t4: 再次调度 → 运行</span>
                <span>t5: exit() → 终止</span>
              </div>
            </div>
          </div>
        </div>

        <div className="topic__flow">
          <div className="flow__step">创建后进入就绪队列等待 CPU</div>
          <div className="flow__step">运行中遇到 I/O 进入阻塞态</div>
          <div className="flow__step">阻塞完成再次进入就绪</div>
          <div className="flow__step">运行结束后终止并释放资源</div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
