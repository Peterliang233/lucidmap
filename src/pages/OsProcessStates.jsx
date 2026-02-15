import { useEffect, useMemo, useState } from "react";
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

const tokenPositions = {
  new: { top: "58px", left: "16%" },
  ready: { top: "150px", left: "14%" },
  running: { top: "150px", left: "44%" },
  blocked: { top: "150px", left: "72%" },
  terminated: { top: "58px", left: "78%" },
};

export default function OsProcessStates() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

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

  const tokenStyle = tokenPositions[activeState] || tokenPositions.new;

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
            <p className="topic__big">{stateMeta[activeState]}</p>
          </div>
          <div className="topic__card">
            <h3>触发条件</h3>
            <p>{activeTransition ? activeTransition.label : "初始化"}</p>
          </div>
        </div>
      </header>

      <section className="topic__stage">
        <div className="state-machine">
          {Object.keys(stateMeta).map((state) => (
            <div
              key={state}
              className={`state-node state-node--${state} ${activeState === state ? "is-active" : ""}`}
            >
              <span>{stateMeta[state]}</span>
            </div>
          ))}
          {transitions.map((transition) => (
            <div
              key={`${transition.from}-${transition.to}`}
              className={`state-link state-link--${transition.from}-${transition.to} ${
                activeTransition &&
                activeTransition.from === transition.from &&
                activeTransition.to === transition.to
                  ? "is-active"
                  : ""
              }`}
            >
              <span>{transition.label}</span>
            </div>
          ))}
          <div className="state-token" style={tokenStyle} />
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
