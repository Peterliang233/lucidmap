import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const cycles = [
  {
    id: "mutex",
    title: "互斥锁",
    detail: "只有一个线程可进入临界区，其它线程排队等待。",
  },
  {
    id: "spin",
    title: "自旋锁",
    detail: "线程忙等占用 CPU，适合短临界区。",
  },
  {
    id: "cond",
    title: "条件变量",
    detail: "线程睡眠等待条件满足，被唤醒后继续执行。",
  },
];

export default function OsThreadSync() {
  const [active, setActive] = useState("mutex");
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      setActive((prev) => {
        const index = cycles.findIndex((item) => item.id === prev);
        return cycles[(index + 1) % cycles.length].id;
      });
    }, 2600);
    return () => clearInterval(timer);
  }, [playing]);

  return (
    <Layout>
      <div className="topic">
      <header className="topic__hero">
        <div>
          <p className="topic__eyebrow">操作系统动画</p>
          <h1>线程同步与并发控制</h1>
          <p className="topic__subtitle">对比互斥锁、自旋锁、条件变量的核心机制与适用场景。</p>
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
          {cycles.map((item) => (
            <div key={item.id} className={`topic__card ${active === item.id ? "is-active" : ""}`}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="topic__stage">
        <div className="sync-grid">
          <div className={`sync-card ${active === "mutex" ? "is-active" : ""}`}>
            <h3>互斥锁</h3>
            <div className="sync-queue">
              <span className="thread thread--run">运行</span>
              <span className="thread">等待</span>
              <span className="thread">等待</span>
            </div>
            <p>队列唤醒，进入临界区。</p>
          </div>

          <div className={`sync-card ${active === "spin" ? "is-active" : ""}`}>
            <h3>自旋锁</h3>
            <div className="sync-spin">
              <div className="spinner" />
              <span>忙等尝试获取锁</span>
            </div>
            <p>CPU 占用高，等待时间短。</p>
          </div>

          <div className={`sync-card ${active === "cond" ? "is-active" : ""}`}>
            <h3>条件变量</h3>
            <div className="sync-cond">
              <div className="sleeping">sleep</div>
              <div className="signal">signal</div>
              <div className="running">run</div>
            </div>
            <p>满足条件后唤醒线程。</p>
          </div>
        </div>

        <div className="topic__flow">
          <div className="flow__step">互斥锁：串行进入临界区</div>
          <div className="flow__step">自旋锁：忙等换取低切换成本</div>
          <div className="flow__step">条件变量：避免无意义的 CPU 轮询</div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
