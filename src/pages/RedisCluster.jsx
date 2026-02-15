import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "slots",
    title: "槽位分配",
    description: "16384 槽位映射到不同节点。",
    bullets: ["一致性哈希思想", "避免热点"],
    active: "slots",
  },
  {
    id: "migrate",
    title: "槽位迁移",
    description: "扩容时迁移槽位，保持平衡。",
    bullets: ["在线迁移", "最小影响"],
    active: "migrate",
  },
  {
    id: "failover",
    title: "故障转移",
    description: "节点失效时提升从节点。",
    bullets: ["自动切换", "集群感知"],
    active: "failover",
  },
];

export default function RedisCluster() {
  return (
    <TopicShell
      eyebrow="Redis 动画"
      title="Redis Cluster 分片"
      subtitle="通过槽位切分与迁移，实现水平扩展。"
      steps={steps}
      panel={[
        { title: "优势", detail: "横向扩展、容错能力强。" },
        { title: "挑战", detail: "槽位迁移与热点均衡。" },
      ]}
      flow={["槽位均衡分配", "迁移平衡热点", "主从自动切换"]}
      diagramClass="redis-cluster"
      renderDiagram={(step) => (
        <div className={`redis-cluster__grid mode--${step.active}`}>
          <div className="cluster-node node--a">Node A</div>
          <div className="cluster-node node--b">Node B</div>
          <div className="cluster-node node--c">Node C</div>
          <div className="cluster-slot slot--a">0-5460</div>
          <div className="cluster-slot slot--b">5461-10922</div>
          <div className="cluster-slot slot--c">10923-16383</div>
          <div className="cluster-move">迁移</div>
        </div>
      )}
    />
  );
}
