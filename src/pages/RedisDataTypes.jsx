import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "string",
    title: "String",
    description: "最常用结构，支持计数、缓存与分布式锁。",
    bullets: ["原子增减", "简单 KV", "示例：page_view:10086"],
    active: "string",
  },
  {
    id: "hash",
    title: "Hash",
    description: "适合对象字段存储与局部更新。",
    bullets: ["字段读写", "节省内存", "示例：user:42{name,level}"],
    active: "hash",
  },
  {
    id: "list",
    title: "List",
    description: "队列/栈模型，支持阻塞弹出。",
    bullets: ["有序队列/栈", "可按索引读取", "示例：[123,233]"],
    active: "list",
  },
  {
    id: "set",
    title: "Set",
    description: "无序去重集合，支持交并差。",
    bullets: ["元素无序", "天然去重", "示例：{123,233}"],
    active: "set",
  },
  {
    id: "zset",
    title: "ZSet",
    description: "有序集合，按分数排序。",
    bullets: ["score + member", "按分数排序", "示例：{Tom:98,Ann:102}"],
    active: "zset",
  },
];

const principles = [
  {
    title: "选型与复杂度",
    detail: "按访问模式选择结构，避免过度设计。",
    points: ["计数/缓存 → String（O(1)）", "对象字段 → Hash（局部更新）", "排序榜单 → ZSet（score + range）"],
  },
  {
    title: "编码与转化",
    detail: "小结构用紧凑编码，阈值后升级。",
    points: [
      "Hash: listpack → hashtable",
      "List: quicklist 分段链表",
      "ZSet: listpack → skiplist + dict",
    ],
  },
  {
    title: "示例路径",
    detail: "跟随一条 key 的生命周期。",
    points: ["HSET user:42 → listpack", "字段增长触发 rehash", "ZADD leaderboard → skiplist 插入"],
  },
];

const cards = [
  { id: "string", title: "String", detail: "计数 / 缓存", example: "例：page_view:10086" },
  { id: "hash", title: "Hash", detail: "对象字段", example: "例：user:42{name,level}" },
  { id: "list", title: "List", detail: "有序序列", example: "例：[123,233]" },
  { id: "set", title: "Set", detail: "无序去重", example: "例：{123,233}" },
  { id: "zset", title: "ZSet", detail: "有序得分", example: "例：{Tom:98,Ann:102}" },
];

const byteCells = Array.from({ length: 12 }, (_, index) => index);
const listpackPairs = [
  { key: "name", value: "Lina" },
  { key: "level", value: "3" },
  { key: "city", value: "SZ" },
  { key: "score", value: "98" },
];
const bucketRows = [
  { index: 0, items: ["user:1", "user:7"] },
  { index: 1, items: ["user:5"] },
  { index: 2, items: ["user:2", "user:9"] },
  { index: 3, items: [] },
  { index: 4, items: ["user:3"] },
];
const quicklistNodes = Array.from({ length: 3 }, (_, index) => index);
const quicklistItems = Array.from({ length: 3 }, (_, index) => index);
const intsetValues = [3, 7, 11, 23, 42, 58];
const skipLevels = [
  {
    level: 3,
    nodes: [
      { label: "H", className: "head" },
      { label: "Tom:98", className: "" },
      { label: "Ann:102", className: "" },
    ],
  },
  {
    level: 2,
    nodes: [
      { label: "H", className: "head" },
      { label: "Bob:87", className: "" },
      { label: "Tom:98", className: "" },
      { label: "Ann:102", className: "" },
    ],
  },
  {
    level: 1,
    nodes: [
      { label: "H", className: "head" },
      { label: "Bob:87", className: "" },
      { label: "Tom:98", className: "" },
      { label: "Ann:102", className: "" },
      { label: "Ken:120", className: "target" },
    ],
  },
];
const dictPairs = [
  { key: "Tom", value: "98" },
  { key: "Ann", value: "102" },
  { key: "Bob", value: "87" },
  { key: "Ken", value: "120" },
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
      principles={principles}
      principlesIntro="结合结构编码与升级路径，解释为什么要选对数据类型。"
      diagramClass="redis-types"
      renderDiagram={(step) => (
        <div className="redis-types__stack">
          <div className={`redis-impl stage--${step.active}`}>
            <div className="redis-impl-card impl--string">
              <div className="impl-head">
                <span className="impl-tag">实现原理</span>
                <div>
                  <h3>String 内存编码</h3>
                  <p>SDS 连续字节 + 编码优化</p>
                </div>
              </div>
              <div className="impl-grid impl-grid--string">
                <div className="impl-box">
                  <div className="impl-title">SDS 字节串</div>
                  <div className="impl-bytes">
                    {byteCells.map((cell) => (
                      <span key={`byte-${cell}`} />
                    ))}
                    <span className="impl-scan" />
                  </div>
                </div>
                <div className="impl-box">
                  <div className="impl-title">编码</div>
                  <div className="impl-chips">
                    <span>int</span>
                    <span>embstr</span>
                    <span>raw</span>
                  </div>
                </div>
              </div>
              <div className="impl-ops">
                <div className="op-row">
                  <span className="op-chip is-hot">INCR page_view</span>
                  <span className="op-arrow" />
                  <span className="op-result">10087</span>
                </div>
                <div className="op-row">
                  <span className="op-chip is-hot">GET cache:home</span>
                  <span className="op-arrow" />
                  <span className="op-result">HTML</span>
                </div>
              </div>
            </div>

            <div className="redis-impl-card impl--hash">
              <div className="impl-head">
                <span className="impl-tag">实现原理</span>
                <div>
                  <h3>Hash 紧凑 + 哈希表</h3>
                  <p>小对象用紧凑列表，增长后切换哈希表</p>
                </div>
              </div>
              <div className="impl-grid impl-grid--hash">
                <div className="impl-box compact">
                  <div className="impl-title">listpack</div>
                  <div className="impl-pairs">
                    {listpackPairs.map((pair) => (
                      <div key={pair.key} className="impl-pair">
                        <span className="impl-key">{pair.key}</span>
                        <span className="impl-val">{pair.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="impl-switch">
                  <span className="impl-switch-label">size ↑</span>
                  <span className="impl-switch-line" />
                </div>
                <div className="impl-box hashtable">
                  <div className="impl-title">hashtable</div>
                  <div className="impl-buckets">
                    {bucketRows.map((row) => (
                      <div key={`bucket-${row.index}`} className="bucket-row">
                        <span className="bucket-index">{row.index}</span>
                        <div className="bucket-chain">
                          {row.items.length === 0 && <span className="bucket-empty">empty</span>}
                          {row.items.map((item, itemIndex) => (
                            <div key={`${row.index}-${item}`} className="bucket-item">
                              <span className="bucket-node">{item}</span>
                              {itemIndex < row.items.length - 1 && (
                                <span className="bucket-arrow" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="impl-ops">
                <div className="op-row">
                  <span className="op-chip is-hot">HSET user:42 name Lina</span>
                  <span className="op-arrow" />
                  <span className="op-result">1</span>
                </div>
                <div className="op-row">
                  <span className="op-chip is-hot">HGET user:42 level</span>
                  <span className="op-arrow" />
                  <span className="op-result">3</span>
                </div>
              </div>
            </div>

            <div className="redis-impl-card impl--list">
              <div className="impl-head">
                <span className="impl-tag">实现原理</span>
                <div>
                  <h3>List Quicklist</h3>
                  <p>多段紧凑节点拼接，头尾快速进出</p>
                </div>
              </div>
              <div className="impl-grid impl-grid--list">
                <div className="impl-box quicklist">
                  <div className="impl-title">quicklist</div>
                  <div className="impl-nodes">
                    {quicklistNodes.map((node) => (
                      <div key={`node-${node}`} className="ql-node">
                        <div className="ql-meta">node#{node + 1}</div>
                        <div className="ql-slot ql-prev">prev</div>
                        <div className="ql-values">
                          {quicklistItems.map((item) => (
                            <span key={`node-${node}-item-${item}`} />
                          ))}
                        </div>
                        <div className="ql-slot ql-next">next</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="impl-track">
                  <span className="impl-track-label left">LPUSH</span>
                  <span className="impl-track-label right">RPOP</span>
                  <span className="impl-packet" />
                </div>
              </div>
              <div className="impl-ops">
                <div className="op-row">
                  <span className="op-chip is-hot">RPUSH list:ids 123 233</span>
                  <span className="op-arrow" />
                  <span className="op-result">len=2</span>
                </div>
                <div className="op-row">
                  <span className="op-chip is-hot">LRANGE list:ids 0 1</span>
                  <span className="op-arrow" />
                  <span className="op-result">[123,233]</span>
                </div>
              </div>
            </div>

            <div className="redis-impl-card impl--set">
              <div className="impl-head">
                <span className="impl-tag">实现原理</span>
                <div>
                  <h3>Set 去重容器</h3>
                  <p>整数集合与哈希表两种实现</p>
                </div>
              </div>
              <div className="impl-grid impl-grid--set">
                <div className="impl-box intset">
                  <div className="impl-title">intset</div>
                  <div className="impl-array">
                    {intsetValues.map((value) => (
                      <span key={`intset-${value}`}>{value}</span>
                    ))}
                  </div>
                </div>
                <div className="impl-uniq">
                  <span className="impl-uniq-dot" />
                  <span>uniq check</span>
                </div>
                <div className="impl-box hashtable">
                  <div className="impl-title">hashtable</div>
                  <div className="impl-buckets">
                    {bucketRows.slice(0, 4).map((row) => (
                      <div key={`set-bucket-${row.index}`} className="bucket-row">
                        <span className="bucket-index">{row.index}</span>
                        <div className="bucket-chain">
                          {row.items.length === 0 && <span className="bucket-empty">empty</span>}
                          {row.items.map((item, itemIndex) => (
                            <div key={`${row.index}-${item}`} className="bucket-item">
                              <span className="bucket-node">{item}</span>
                              {itemIndex < row.items.length - 1 && (
                                <span className="bucket-arrow" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="impl-ops">
                <div className="op-row">
                  <span className="op-chip is-hot">SADD set:ids 123 123 233</span>
                  <span className="op-arrow" />
                  <span className="op-result">len=2</span>
                </div>
                <div className="op-row">
                  <span className="op-chip is-hot">SMEMBERS set:ids</span>
                  <span className="op-arrow" />
                  <span className="op-result">{`{123,233}`}</span>
                </div>
              </div>
            </div>

            <div className="redis-impl-card impl--zset">
              <div className="impl-head">
                <span className="impl-tag">实现原理</span>
                <div>
                  <h3>ZSet 跳表 + 字典</h3>
                  <p>排序用跳表，定位用字典</p>
                </div>
              </div>
              <div className="impl-grid impl-grid--zset">
                <div className="impl-box skiplist">
                  <div className="impl-title">skiplist</div>
                  <div className="skip-hint">
                    <span className="skip-target">search 120</span>
                    <span className="skip-legend">从高层跳跃 → 下钻定位</span>
                  </div>
                  <div className="impl-skip">
                    {skipLevels.map((level) => (
                      <div key={`level-${level.level}`} className={`skip-level level-${level.level}`}>
                        {level.nodes.map((node) => (
                          <span
                            key={`${level.level}-${node.label}`}
                            className={`skip-node ${node.className}`}
                          >
                            {node.label}
                          </span>
                        ))}
                      </div>
                    ))}
                    <span className="skip-cursor" />
                  </div>
                </div>
                <div className="impl-box dict">
                  <div className="impl-title">dict</div>
                  <div className="impl-pairs">
                    {dictPairs.map((pair) => (
                      <div key={`dict-${pair.key}`} className="impl-pair">
                        <span className="impl-key">{pair.key}</span>
                        <span className="impl-val">{pair.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="impl-ops">
                <div className="op-row">
                  <span className="op-chip is-hot">ZADD score:rank 98 Tom 102 Ann</span>
                  <span className="op-arrow" />
                  <span className="op-result">OK</span>
                </div>
                <div className="op-row">
                  <span className="op-chip is-hot">ZRANGE score:rank 0 -1 WITHSCORES</span>
                  <span className="op-arrow" />
                  <span className="op-result">[Tom:98,Ann:102]</span>
                </div>
              </div>
            </div>
          </div>

          <div className="redis-types__grid">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`redis-type-card ${step.active === card.id ? "is-active" : ""}`}
              >
                <h3>{card.title}</h3>
                <p>{card.detail}</p>
                <span className="redis-type-example">{card.example}</span>
                <div className={`redis-type-bar bar--${card.id}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
