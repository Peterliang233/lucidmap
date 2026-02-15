import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const steps = [
  {
    id: "buddy-split",
    title: "伙伴系统拆分",
    description: "大块内存不断对半拆分，满足 6KB 申请。",
    blocks: [64, 32, 16, 8, 8],
    focus: [3],
  },
  {
    id: "buddy-merge",
    title: "伙伴合并",
    description: "释放内存后，两个伙伴块合并回更大块。",
    blocks: [64, 32, 16, 16],
    focus: [2, 3],
  },
  {
    id: "slab-cache",
    title: "Slab 缓存",
    description: "将相同大小的对象放入 slab，降低碎片。",
    blocks: ["obj", "obj", "obj", "obj", "free"],
    focus: [4],
  },
  {
    id: "fragment",
    title: "碎片风险",
    description: "外部碎片导致大块内存难以连续分配。",
    blocks: ["used", "free", "used", "free", "free"],
    focus: [1, 3],
  },
];

export default function OsMemoryAlloc() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [playing]);

  const step = steps[stepIndex];

  return (
    <Layout>
      <div className="topic">
      <header className="topic__hero">
        <div>
          <p className="topic__eyebrow">操作系统动画</p>
          <h1>内存回收与段页式</h1>
          <p className="topic__subtitle">用动画展示伙伴系统、Slab 与碎片问题。</p>
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
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
          <div className="topic__card">
            <h3>关键词</h3>
            <p>伙伴系统、Slab、外部碎片、内存回收。</p>
          </div>
        </div>
      </header>

      <section className="topic__stage">
        <div className="topic__timeline">
          {steps.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`timeline__step ${index === stepIndex ? "is-active" : ""}`}
              onClick={() => setStepIndex(index)}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="memory-diagram">
          {step.blocks.map((block, index) => (
            <div
              key={`${block}-${index}`}
              className={`memory-block ${step.focus.includes(index) ? "is-active" : ""} ${
                block === "free" ? "is-free" : ""
              } ${block === "used" ? "is-used" : ""} ${block === "obj" ? "is-obj" : ""}`}
              style={{ flex: typeof block === "number" ? block / 8 : 1 }}
            >
              {typeof block === "number" ? `${block}KB` : block}
            </div>
          ))}
        </div>

        <div className="topic__flow">
          <div className="flow__step">伙伴系统通过拆分与合并减少外部碎片</div>
          <div className="flow__step">Slab 为固定大小对象提供快速分配</div>
          <div className="flow__step">碎片问题会影响大块内存的连续性</div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
