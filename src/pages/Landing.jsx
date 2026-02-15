import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const pillars = [
  {
    title: "配置化",
    detail: "所有目录、知识点与链接均由 JSON 驱动，随时扩展。",
  },
  {
    title: "结构化",
    detail: "从模块 → 分组 → 知识点，形成清晰的面试地图。",
  },
  {
    title: "可视化",
    detail: "通过动画专题页，将抽象原理讲清楚。",
  },
];

const floatingItems = ["OS", "Net", "DB", "JVM", "Algo", "Cache", "IO", "TCP"];

export default function LandingPage() {
  const scrollToMission = () => {
    const target = document.getElementById("mission");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Layout>
      <section className="landing">
        <div className="landing__hero">
          <div>
            <p className="landing__eyebrow">LucidMap Project</p>
            <h1>把八股文变成一张能扩展的知识地图</h1>
            <p className="landing__subtitle">
              这个项目的宗旨是：让面试知识点拥有清晰的结构、可持续扩展的配置体系，并用动画解释复杂原理。
            </p>
            <div className="landing__actions">
              <Link className="landing__primary" to="/map">
                进入知识地图
              </Link>
              <button className="landing__ghost" type="button" onClick={scrollToMission}>
                了解宗旨
              </button>
            </div>
          </div>

          <div className="landing__visual">
            <div className="orbital">
              <div className="orbital__core">B+</div>
              <div className="orbital__ring" />
              <div className="orbital__ring orbital__ring--inner" />
              <div className="orbital__dot orbital__dot--a" />
              <div className="orbital__dot orbital__dot--b" />
              <div className="orbital__dot orbital__dot--c" />
            </div>
            <div className="floating-grid">
              {floatingItems.map((item, index) => (
                <span key={item} style={{ "--delay": `${index * 0.2}s` }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div id="mission" className="landing__mission">
          <div className="mission__text">
            <h2>宗旨</h2>
            <p>
              用更高的信息密度，把面试复盘、基础知识和系统设计串在一起，形成可复用的知识导航。
            </p>
          </div>
          <div className="mission__grid">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="mission__card">
                <h3>{pillar.title}</h3>
                <p>{pillar.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="landing__cta">
          <div>
            <h2>继续探索</h2>
            <p>每个模块都能深入到动画知识点，持续更新。</p>
          </div>
          <Link className="landing__primary" to="/map">
            打开知识地图
          </Link>
        </div>
      </section>
    </Layout>
  );
}
