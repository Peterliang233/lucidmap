import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "nameserver",
    title: "NameServer",
    description: "路由中心，注册 Broker 信息。",
    bullets: ["轻量", "去中心化"],
    active: "nameserver",
  },
  {
    id: "broker",
    title: "Broker 存储",
    description: "消息存储与转发核心。",
    bullets: ["CommitLog", "ConsumeQueue"],
    active: "broker",
  },
  {
    id: "client",
    title: "Producer/Consumer",
    description: "客户端通过路由找到 Broker。",
    bullets: ["负载均衡", "故障转移"],
    active: "client",
  },
];

export default function MqRocketCore() {
  return (
    <TopicShell
      eyebrow="消息队列动画"
      title="RocketMQ 核心组件"
      subtitle="NameServer + Broker + Client 构成路由体系。"
      steps={steps}
      panel={[
        { title: "定位", detail: "金融级可靠消息系统。" },
        { title: "优势", detail: "事务消息、顺序消息。" },
      ]}
      flow={["NameServer 维护路由", "Broker 管理存储", "客户端根据路由访问"]}
      diagramClass="mq-rocket"
      renderDiagram={(step) => (
        <div className={`mq-rocket__grid mode--${step.active}`}>
          <div className="rocket-node nameserver">NameServer</div>
          <div className="rocket-node broker">Broker</div>
          <div className="rocket-node producer">Producer</div>
          <div className="rocket-node consumer">Consumer</div>
          <div className="rocket-line line--a" />
          <div className="rocket-line line--b" />
        </div>
      )}
    />
  );
}
