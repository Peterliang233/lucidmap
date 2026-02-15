import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "token",
    title: "令牌桶",
    description: "以固定速率产生令牌，允许短时突发。",
    bullets: ["突发友好", "控制平均速率"],
    active: "token",
  },
  {
    id: "leaky",
    title: "漏桶",
    description: "请求进入漏桶，匀速流出。",
    bullets: ["平滑输出", "延迟增加"],
    active: "leaky",
  },
  {
    id: "window",
    title: "滑动窗口",
    description: "时间窗口统计请求量，动态限流。",
    bullets: ["简单易实现", "窗口边界问题"],
    active: "window",
  },
];

export default function BackendRateLimit() {
  return (
    <TopicShell
      eyebrow="系统设计动画"
      title="限流与熔断策略"
      subtitle="从令牌桶到滑动窗口，展示流量控制手段。"
      steps={steps}
      panel={[
        { title: "限流目的", detail: "保护服务稳定性。" },
        { title: "熔断策略", detail: "快速失败、自动恢复。" },
      ]}
      flow={["令牌桶允许突发", "漏桶输出稳定", "滑动窗口统计频率"]}
      diagramClass="ratelimit-diagram"
      renderDiagram={(step) => (
        <div className={`ratelimit-grid focus--${step.active}`}>
          <div className="bucket token-bucket">
            <div className="bucket__label">令牌桶</div>
            <div className="tokens">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="bucket leaky-bucket">
            <div className="bucket__label">漏桶</div>
            <div className="drop" />
          </div>
          <div className="bucket window-bucket">
            <div className="bucket__label">滑动窗口</div>
            <div className="window-bars">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}
    />
  );
}
