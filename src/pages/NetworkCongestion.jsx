import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "slow-start",
    title: "1. 慢启动",
    description: "cwnd 指数增长，快速探测可用带宽。",
    bullets: ["每 RTT 翻倍", "达到阈值后切换"],
    phase: "slow-start",
  },
  {
    id: "avoid",
    title: "2. 拥塞避免",
    description: "cwnd 线性增长，避免拥塞。",
    bullets: ["每 RTT 增加 1", "稳定增长"],
    phase: "avoid",
  },
  {
    id: "fast-retransmit",
    title: "3. 快速重传",
    description: "收到 3 个重复 ACK，立即重传。",
    bullets: ["跳过超时", "提升恢复速度"],
    phase: "fast",
  },
  {
    id: "recovery",
    title: "4. 快速恢复",
    description: "cwnd 降低后继续线性增长。",
    bullets: ["ssthresh 调整", "保持管道"],
    phase: "recovery",
  },
];

const bars = [
  { id: 1, phase: "slow-start", height: 20 },
  { id: 2, phase: "slow-start", height: 32 },
  { id: 3, phase: "slow-start", height: 48 },
  { id: 4, phase: "slow-start", height: 64 },
  { id: 5, phase: "avoid", height: 70 },
  { id: 6, phase: "avoid", height: 76 },
  { id: 7, phase: "avoid", height: 82 },
  { id: 8, phase: "fast", height: 60 },
  { id: 9, phase: "recovery", height: 66 },
  { id: 10, phase: "recovery", height: 72 },
];

const principles = [
  {
    title: "窗口增长规则",
    detail: "cwnd 控制发送速率，ssthresh 分界慢启动与拥塞避免。",
    points: ["慢启动每 RTT 翻倍", "拥塞避免每 RTT +1", "到达阈值切换增长模式"],
  },
  {
    title: "丢包处理",
    detail: "重复 ACK 触发快速重传，超时则回到慢启动。",
    points: ["3 个重复 ACK → fast retransmit", "ssthresh = cwnd / 2", "超时 → cwnd 归 1"],
  },
  {
    title: "数值示例",
    detail: "初始 cwnd=1，ssthresh=8。",
    points: ["1 → 2 → 4 → 8 (慢启动)", "9 → 10 (线性增长)", "丢包后 cwnd 回落再爬升"],
  },
];

export default function NetworkCongestion() {
  return (
    <TopicShell
      eyebrow="网络协议动画"
      title="拥塞控制与流量控制"
      subtitle="用窗口曲线展示慢启动、拥塞避免与快速恢复。"
      steps={steps}
      panel={[
        { title: "目标", detail: "防止网络拥塞，同时保证吞吐量。" },
        { title: "关键变量", detail: "cwnd、ssthresh、RTT。" },
      ]}
      principles={principles}
      principlesPlacement="side"
      principlesIntro="结合曲线，拆解窗口增长与丢包恢复的核心规则。"
      flow={["慢启动快速增长", "拥塞避免平滑提升", "丢包触发快速重传"]}
      diagramClass="cwnd-diagram"
      renderDiagram={(step) => (
        <div className={`cwnd-chart phase--${step.phase}`}>
          {bars.map((bar) => (
            <div
              key={bar.id}
              className={`cwnd-bar bar--${bar.phase}`}
              style={{ height: `${bar.height}%` }}
            />
          ))}
          <div className="cwnd-labels">
            <span>慢启动</span>
            <span>拥塞避免</span>
            <span>快速重传</span>
            <span>快速恢复</span>
          </div>
        </div>
      )}
    />
  );
}
