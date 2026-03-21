import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import data from "../data.json";
import logo from "../assets/logo-lucidmap.svg";

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

const heroSatellites = [
  { id: "kernel", label: "Kernel", x: "16%", y: "26%" },
  { id: "network", label: "Network", x: "76%", y: "22%" },
  { id: "storage", label: "Storage", x: "78%", y: "74%" },
  { id: "runtime", label: "Runtime", x: "24%", y: "74%" },
  { id: "ai", label: "AI", x: "82%", y: "52%" },
  { id: "database", label: "Database", x: "60%", y: "16%" },
  { id: "java", label: "Java", x: "12%", y: "52%" },
  { id: "golang", label: "Go", x: "38%", y: "12%" },
  { id: "algo", label: "Algorithm", x: "58%", y: "82%" },
  { id: "linux", label: "Linux", x: "26%", y: "14%" },
  { id: "io", label: "IO", x: "28%", y: "34%" },
];

const heroStreams = [
  { id: "s1", x: "24%", delay: "0s" },
  { id: "s2", x: "50%", delay: "0.6s" },
  { id: "s3", x: "76%", delay: "1.2s" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { sections, site } = data || {};

  const stats = useMemo(() => {
    const sectionCount = (sections || []).length;
    let groupCount = 0;
    let itemCount = 0;
    (sections || []).forEach((section) => {
      (section.groups || []).forEach((group) => {
        groupCount += 1;
        itemCount += (group.items || []).length;
      });
    });
    return { sectionCount, groupCount, itemCount };
  }, [sections]);

  const featuredRoutes = useMemo(() => {
    const isInternal = (link) => typeof link === "string" && link.startsWith("/topics/");
    return (sections || [])
      .map((section) => {
        const items = [];
        (section.groups || []).forEach((group) => {
          (group.items || []).forEach((item) => {
            if (items.length >= 3) return;
            if (item?.link && isInternal(item.link)) items.push(item);
          });
        });
        return {
          id: section.id,
          title: section.title,
          desc: section.desc,
          items,
        };
      })
      .filter((s) => s.items.length);
  }, [sections]);

  const randomInternalLink = useMemo(() => {
    const isInternal = (link) => typeof link === "string" && link.startsWith("/topics/");
    const pool = [];
    (sections || []).forEach((section) => {
      (section.groups || []).forEach((group) => {
        (group.items || []).forEach((item) => {
          if (item?.link && isInternal(item.link)) pool.push(item.link);
        });
      });
    });
    return () => {
      if (!pool.length) return "/map";
      return pool[Math.floor(Math.random() * pool.length)];
    };
  }, [sections]);

  return (
    <Layout>
      <section className="landing">
        <div className="landing__hero">
          <div>
            <div className="landing__brand">
              <img className="landing__brand-mark" src={logo} alt="LucidMap mascot" />
              <div>
                <p className="landing__eyebrow">{site?.title ? "LucidMap" : "LucidMap"}</p>
                <p className="landing__brand-tagline">{site?.tagline || "系统化整理技术知识点"}</p>
              </div>
            </div>

            <h1>
              让技术原理
              <span className="landing__fun">动起来</span>
            </h1>

            <p className="landing__subtitle">
              以“知识卡片 + 动画拆解 + 地图导航”的方式，把分散的知识点组织成可复用的学习路线。
            </p>

            <div className="landing__stats" aria-label="site stats">
              <span className="landing-stat">
                <b>{stats.sectionCount}</b> 个模块
              </span>
              <span className="landing-stat">
                <b>{stats.groupCount}</b> 个分组
              </span>
              <span className="landing-stat">
                <b>{stats.itemCount}</b> 张卡片
              </span>
            </div>

            <div className="landing__actions">
              <Link className="landing__primary" to="/map">
                进入知识地图
              </Link>
              <button
                type="button"
                className="landing__ghost"
                onClick={() => navigate(randomInternalLink())}
              >
                随机抽一张卡
              </button>
              <a
                className="landing__ghost"
                href="https://github.com/Peterliang233/lucidmap/tree/main"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>

          </div>

          <div className="landing__visual">
            <div className="hero-map hero-map--clean">
              <div className="hero-map__backdrop" />
              <div className="hero-map__grid" />

              {/* 雷达扫描线 */}
              <div className="hero-map__radar" />

              {/* 多层轨道弧 */}
              <div className="hero-map__arc hero-map__arc--a" />
              <div className="hero-map__arc hero-map__arc--b" />
              <div className="hero-map__arc hero-map__arc--c" />

              {/* 轨道上的运动粒子 */}
              <div className="hero-map__orbit-dots">
                <span className="orbit-dot orbit-dot--1" />
                <span className="orbit-dot orbit-dot--2" />
                <span className="orbit-dot orbit-dot--3" />
              </div>

              {/* 脉冲环 */}
              <div className="hero-map__pulse" />
              <div className="hero-map__pulse hero-map__pulse--b" />

              {/* SVG 连接线：核心到卫星 */}
              <svg className="hero-map__links" viewBox="0 0 100 100" preserveAspectRatio="none">
                {heroSatellites.map((sat) => (
                  <line
                    key={`link-${sat.id}`}
                    className="hero-map__link-line"
                    x1="50" y1="50"
                    x2={parseFloat(sat.x)} y2={parseFloat(sat.y)}
                  />
                ))}
              </svg>

              {/* 核心 */}
              <div className="hero-map__core">
                <div className="hero-map__core-glow" />
                <span className="hero-map__badge">LucidMap</span>
                <span className="hero-map__metric">Knowledge Signal Hub</span>
              </div>

              {/* 数据流 */}
              <div className="hero-map__streams">
                {heroStreams.map((stream) => (
                  <span
                    key={stream.id}
                    className="hero-map__stream"
                    style={{
                      "--x": stream.x,
                      "--delay": stream.delay,
                    }}
                  />
                ))}
              </div>

              {/* 卫星节点 */}
              <div className="hero-map__satellites">
                {heroSatellites.map((satellite, index) => (
                  <div
                    key={satellite.id}
                    className="hero-map__satellite"
                    style={{
                      "--x": satellite.x,
                      "--y": satellite.y,
                      "--delay": `${index * 0.25}s`,
                    }}
                  >
                    <span className="hero-map__sat-dot" />
                    {satellite.label}
                  </div>
                ))}
              </div>

              {/* 扫描光线 */}
              <div className="hero-map__scanline" />

              <div className="hero-map__legend">
                <span>Signals: 42</span>
                <span>Cards: {stats.itemCount}</span>
                <span>Topics: 128</span>
              </div>

            </div>
          </div>
        </div>

        <div id="mission" className="landing__mission">
          <div className="mission__text">
            <h2>宗旨</h2>
            <p>
              这个项目希望将晦涩难懂的技术用可视化方式呈现，降低学习门槛，帮助大家更好掌握相关知识。
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

        <div className="landing__routes">
          <div className="routes__header">
            <h2>模块速览</h2>
            <p>每个模块挑几个入口，快速进入动画与卡片。</p>
          </div>
          <div className="routes__grid">
            {featuredRoutes.map((section) => (
              <div key={section.id || section.title} className="route-card">
                <div className="route-card__head">
                  <h3>{section.title}</h3>
                  <p>{section.desc}</p>
                </div>
                <div className="route-card__links">
                  {section.items.map((item) => (
                    <Link key={item.link} className="route-link" to={item.link}>
                      <span className="route-link__title">{item.title}</span>
                      <span className="route-link__desc">{item.desc}</span>
                    </Link>
                  ))}
                </div>
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
