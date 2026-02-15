import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const steps = [
  {
    id: "cpu",
    title: "CPU 发起虚拟地址访问",
    description: "处理器访问虚拟地址，优先命中 TLB。",
    focus: ["cpu", "tlb"],
  },
  {
    id: "tlb-miss",
    title: "TLB 未命中",
    description: "进入页表查找，触发一次内存访问。",
    focus: ["page-table"],
  },
  {
    id: "page-hit",
    title: "页表命中",
    description: "找到物理页帧号，访问内存数据。",
    focus: ["ram"],
  },
  {
    id: "page-fault",
    title: "缺页中断",
    description: "页不在内存，从磁盘换入，更新页表与 TLB。",
    focus: ["disk", "page-table", "tlb"],
  },
];

export default function OsVirtualMemory() {
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
          <h1>虚拟内存与分页</h1>
          <p className="topic__subtitle">展示地址翻译、TLB 命中与缺页中断的完整流程。</p>
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
            <h3>关键术语</h3>
            <p>TLB、页表、缺页中断、换页。</p>
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

        <div className="vm-diagram">
          {[
            { id: "cpu", label: "CPU" },
            { id: "tlb", label: "TLB" },
            { id: "page-table", label: "页表" },
            { id: "ram", label: "内存" },
            { id: "disk", label: "磁盘" },
          ].map((node) => (
            <div
              key={node.id}
              className={`vm-node ${step.focus.includes(node.id) ? "is-active" : ""}`}
            >
              {node.label}
            </div>
          ))}
          <div className="vm-arrows" />
          <div className={`vm-fault ${step.id === "page-fault" ? "is-active" : ""}`}>
            缺页中断
          </div>
        </div>

        <div className="topic__flow">
          <div className="flow__step">TLB 命中可直接完成地址翻译</div>
          <div className="flow__step">TLB 未命中需要访问页表</div>
          <div className="flow__step">缺页时触发磁盘换入与页表更新</div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
