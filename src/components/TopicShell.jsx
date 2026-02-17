import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout.jsx";

export default function TopicShell({
  eyebrow = "专题动画",
  title,
  subtitle,
  steps = [],
  panel = [],
  flow = [],
  legend = null,
  principles = [],
  principlesTitle = "原理拆解",
  principlesIntro = "",
  principlesPlacement = "below",
  principlesClass = "",
  interval = 2600,
  backPath = "/map",
  diagramClass = "",
  renderDiagram,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || steps.length <= 1) return undefined;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, interval);
    return () => clearInterval(timer);
  }, [playing, steps.length, interval]);

  const step = steps[stepIndex] || {};

  const handlePrev = () => {
    if (steps.length <= 1) return;
    setStepIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const handleNext = () => {
    if (steps.length <= 1) return;
    setStepIndex((prev) => (prev + 1) % steps.length);
  };

  const renderPrinciples = () => {
    if (!principles.length) return null;
    return (
      <div className={`topic-shell__principles ${principlesClass}`}>
        <div className="principles__header">
          <h3>{principlesTitle}</h3>
          {principlesIntro && <p>{principlesIntro}</p>}
        </div>
        <div className="principles__grid">
          {principles.map((item) => (
            <div key={item.title} className="principles__card">
              <h4>{item.title}</h4>
              {item.detail && <p className="principles__meta">{item.detail}</p>}
              {item.points && (
                <ul className="principles__list">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const diagramNode = renderDiagram ? (
    <div className={`topic-shell__diagram ${diagramClass}`}>{renderDiagram(step, stepIndex)}</div>
  ) : null;

  return (
    <Layout>
      <div className="topic-shell">
        <header className="topic-shell__hero">
          <div>
            <p className="topic-shell__eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="topic-shell__subtitle">{subtitle}</p>
            <div className="topic-shell__actions">
              {steps.length > 1 && (
                <button
                  type="button"
                  className="topic-shell__primary"
                  onClick={() => setPlaying((v) => !v)}
                >
                  {playing ? "暂停" : "播放"}
                </button>
              )}
              {steps.length > 1 && (
                <>
                  <button type="button" className="topic-shell__ghost" onClick={handlePrev}>
                    上一步
                  </button>
                  <button type="button" className="topic-shell__ghost" onClick={handleNext}>
                    下一步
                  </button>
                </>
              )}
              <Link className="topic-shell__back" to={backPath}>
                返回知识地图
              </Link>
            </div>
          </div>
          <div className="topic-shell__panel">
            {panel.map((item) => (
              <div key={item.title} className="topic-shell__card">
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="topic-shell__stage">
          {steps.length > 1 && (
            <div className="topic-shell__timeline">
              {steps.map((item, index) => (
                <button
                  key={item.id || item.title}
                  type="button"
                  className={`timeline__step ${index === stepIndex ? "is-active" : ""}`}
                  onClick={() => setStepIndex(index)}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}

          {step.title && (
            <div className="topic-shell__step">
              <div>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>
              {step.bullets && (
                <ul>
                  {step.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {legend && <div className="topic-shell__legend">{legend}</div>}

          {principlesPlacement === "side" && renderDiagram && principles.length > 0 ? (
            <div className="topic-shell__split">
              {diagramNode}
              {renderPrinciples()}
            </div>
          ) : (
            <>
              {diagramNode}
              {renderPrinciples()}
            </>
          )}

          {null}
        </section>
      </div>
    </Layout>
  );
}
