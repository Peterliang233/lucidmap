import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "string",
    title: "String",
    description: "最常用结构，支持计数、缓存与分布式锁。",
    bullets: ["原子增减", "简单 KV"],
    active: "string",
  },
  {
    id: "hash",
    title: "Hash",
    description: "适合对象字段存储与局部更新。",
    bullets: ["字段读写", "节省内存"],
    active: "hash",
  },
  {
    id: "list",
    title: "List",
    description: "队列/栈模型，支持阻塞弹出。",
    bullets: ["LPUSH/RPOP", "消息队列"],
    active: "list",
  },
  {
    id: "set",
    title: "Set",
    description: "无序去重集合，支持交并差。",
    bullets: ["去重", "标签系统"],
    active: "set",
  },
  {
    id: "zset",
    title: "ZSet",
    description: "有序集合，按分数排序。",
    bullets: ["排行榜", "范围查询"],
    active: "zset",
  },
];

const cards = [
  { id: "string", title: "String", detail: "计数 / 缓存" },
  { id: "hash", title: "Hash", detail: "对象字段" },
  { id: "list", title: "List", detail: "队列 / 栈" },
  { id: "set", title: "Set", detail: "去重 / 集合" },
  { id: "zset", title: "ZSet", detail: "排序 / TopK" },
];

export default function RedisDataTypes() {
  return (
    <TopicShell
      eyebrow="Redis 动画"
      title="数据类型与使用场景"
      subtitle="选择合适的数据结构，降低复杂度与延迟。"
      steps={steps}
      panel={[
        { title: "原则", detail: "选对结构等于解决一半问题。" },
        { title: "关注点", detail: "操作复杂度、内存占用。" },
      ]}
      flow={["String 快速读写", "Hash 适合对象字段", "ZSet 支持排序"]}
      diagramClass="redis-types"
      renderDiagram={(step) => (
        <div className="redis-types__grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`redis-type-card ${step.active === card.id ? "is-active" : ""}`}
            >
              <h3>{card.title}</h3>
              <p>{card.detail}</p>
              <div className={`redis-type-bar bar--${card.id}`} />
            </div>
          ))}
        </div>
      )}
    />
  );
}
