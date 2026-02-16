import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const pillars = [
  {
    title: "可视化",
    detail: "把复杂机制拆解成动画流程，直观看到关键步骤。",
  },
  {
    title: "低门槛",
    detail: "用更易理解的叙述与图示降低学习成本。",
  },
  {
    title: "可掌握",
    detail: "突出核心原理与细节，让学习更聚焦、更高效。",
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
            <h1>用简单的动画解析计算机相关知识点</h1>
            <p className="landing__subtitle">
              这个项目希望将晦涩难懂的技术用可视化方式呈现，降低学习门槛，帮助大家更好掌握相关知识。
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
            <h2>加入共建</h2>
            <p>欢迎一起参与建设，提交想法与改进建议，让内容更完整准确。</p>
          </div>
          <a
            className="landing__primary"
            href="https://github.com/Peterliang233/lucidmap/tree/main"
            target="_blank"
            rel="noreferrer"
          >
            GitHub 项目地址
          </a>
        </div>
      </section>
    </Layout>
  );
}
