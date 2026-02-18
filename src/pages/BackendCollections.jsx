import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "hm-put", title: "HashMap：put 过程",
    description: "计算 hash 定位桶，链表尾插；链表长度≥8 转红黑树。",
    bullets: ["hash(key) & (n-1) 定位桶", "链表尾插 O(n)", "链表≥8 → 红黑树 O(logn)"],
    active: "hashmap", phase: 0,
  },
  {
    id: "hm-resize", title: "HashMap：扩容 rehash",
    description: "容量翻倍，所有 key 重新散列，并发下可能链表成环。",
    bullets: ["capacity × 2", "rehash 所有 entry", "并发写 → 死循环风险"],
    active: "hashmap", phase: 1,
  },
  {
    id: "sync-lock", title: "同步容器：全局锁",
    description: "Hashtable / Collections.synchronizedMap 用全局锁保护。",
    bullets: ["synchronized(this)", "读写互斥", "吞吐量低"],
    active: "sync", phase: 0,
  },
  {
    id: "sync-block", title: "同步容器：锁竞争",
    description: "多线程排队等锁，并发度=1。",
    bullets: ["T1 持锁 → T2/T3 阻塞", "锁粒度=整个 Map", "适合低并发场景"],
    active: "sync", phase: 1,
  },
  {
    id: "chm-seg", title: "CHM：分段锁",
    description: "JDK7 Segment 分段锁，每段独立加锁。",
    bullets: ["默认 16 个 Segment", "不同段可并发写", "并发度=Segment 数"],
    active: "chm", phase: 0,
  },
  {
    id: "chm-cas", title: "CHM：CAS + synchronized",
    description: "JDK8 改为 Node 数组 + CAS + synchronized 桶头锁。",
    bullets: ["CAS 写空桶", "synchronized 锁桶头", "读无锁，volatile 保证可见性"],
    active: "chm", phase: 1,
  },
];

// HashMap bucket visualization
const buckets = [
  { idx: 0, chain: ["K1:V1"] },
  { idx: 1, chain: [] },
  { idx: 2, chain: ["K2:V2", "K5:V5"] },
  { idx: 3, chain: ["K3:V3", "K6:V6", "K9:V9"] },
];

// CHM segments
const segments = [
  { id: "Seg0", keys: ["K1", "K4"] },
  { id: "Seg1", keys: ["K2", "K5"] },
  { id: "Seg2", keys: ["K3"] },
  { id: "Seg3", keys: ["K6", "K7"] },
];

const BX = 30, BY = 36, BW = 50, BH = 24, BGAP = 4;
const CW = 56, CGAP = 6;

const principles = [
  { title: "HashMap 风险", detail: "并发扩容可能导致链表成环或数据丢失。", points: ["rehash 期间指针重排", "非线程安全", "JDK8 尾插法减少成环"] },
  { title: "同步容器", detail: "全局锁保证一致性，但吞吐降低。", points: ["锁粒度粗", "读写互斥", "适合低并发场景"] },
  { title: "ConcurrentHashMap", detail: "分段锁/CAS 提升并发。", points: ["JDK7 Segment 分段锁", "JDK8 CAS + 桶头 synchronized", "读无锁，volatile 可见性"] },
];

export default function BackendCollections() {
  return (
    <TopicShell
      eyebrow="后端基础动画"
      title="集合体系与并发容器"
      subtitle="HashMap、同步容器与 ConcurrentHashMap 的并发策略对比。"
      steps={steps}
      panel={[
        { title: "常见场景", detail: "缓存、计数器、并发读写。" },
        { title: "关注点", detail: "扩容、锁竞争、读写一致性。" },
      ]}
      principles={principles}
      principlesIntro="从并发风险、锁粒度与扩容机制理解容器选型。"
      flow={["HashMap 非线程安全", "同步容器牺牲并发", "CHM 细粒度锁提升吞吐"]}
      diagramClass="coll-diagram"
      renderDiagram={(step) => {
        const mode = step.active;
        const phase = step.phase;

        if (mode === "hashmap") {
          return (
            <div className="coll-scene">
              <svg className="coll-svg" viewBox="0 0 400 170" preserveAspectRatio="xMidYMid meet">
                <text x={200} y={16} className="coll-title">{phase === 0 ? "HashMap put：hash → 桶 → 链表" : "HashMap 扩容 rehash"}</text>

                {/* Bucket array */}
                {buckets.map((b, i) => {
                  const y = BY + i * (BH + BGAP);
                  return (
                    <g key={i}>
                      <rect x={BX} y={y} width={BW} height={BH} rx={5} className="coll-bucket" />
                      <text x={BX + BW / 2} y={y + 16} className="coll-bucket-idx">[{b.idx}]</text>
                      {b.chain.map((kv, j) => {
                        const cx = BX + BW + 16 + j * (CW + CGAP);
                        return (
                          <g key={j}>
                            {j > 0 && <line x1={cx - CGAP} y1={y + BH / 2} x2={cx} y2={y + BH / 2} className="coll-chain-arrow" />}
                            {j === 0 && <line x1={BX + BW} y1={y + BH / 2} x2={cx} y2={y + BH / 2} className="coll-chain-arrow" />}
                            <rect x={cx} y={y + 2} width={CW} height={BH - 4} rx={5} className={`coll-node ${phase === 0 && i === 3 && j === 2 ? "coll-node--new" : ""}`} />
                            <text x={cx + CW / 2} y={y + 16} className="coll-node-text">{kv}</text>
                          </g>
                        );
                      })}
                      {b.chain.length === 0 && <text x={BX + BW + 20} y={y + 16} className="coll-null">null</text>}
                    </g>
                  );
                })}

                {/* Rehash indicator */}
                {phase === 1 && (
                  <g>
                    <rect x={260} y={40} width={120} height={80} rx={10} className="coll-rehash-box" />
                    <text x={320} y={60} className="coll-rehash-text">rehash</text>
                    <text x={320} y={78} className="coll-rehash-sub">capacity × 2</text>
                    <text x={320} y={96} className="coll-rehash-sub">重新散列</text>
                    <line x1={240} y1={80} x2={260} y2={80} className="coll-chain-arrow" markerEnd="url(#coll-arr)" />
                  </g>
                )}

                <defs>
                  <marker id="coll-arr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="rgba(0,0,0,0.3)" /></marker>
                </defs>
              </svg>
              <div className="coll-ds coll-ds--hm">
                <span className="coll-ds__label">HashMap</span>
                <div className="coll-ds__items">
                  {["put 链表/树", "扩容 rehash"].map((t, i) => (
                    <span key={i} className={`coll-ds__step ${i === phase ? "coll-ds__step--active" : ""} ${i < phase ? "coll-ds__step--past" : ""}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "sync") {
          const threads = ["T1", "T2", "T3"];
          const TX = 200, TY = 40;
          return (
            <div className="coll-scene">
              <svg className="coll-svg" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
                <text x={200} y={16} className="coll-title">{phase === 0 ? "全局锁：synchronized(this)" : "锁竞争：线程排队"}</text>

                {/* Lock */}
                <rect x={TX - 40} y={TY} width={80} height={36} rx={8} className="coll-lock" />
                <text x={TX} y={TY + 22} className="coll-lock-text">LOCK</text>

                {/* Threads */}
                {threads.map((t, i) => {
                  const y = TY + 50 + i * 28;
                  const holding = i === 0;
                  const blocked = phase === 1 && i > 0;
                  return (
                    <g key={t}>
                      <rect x={TX - 30} y={y} width={60} height={22} rx={6} className={`coll-thread ${holding ? "coll-thread--hold" : ""} ${blocked ? "coll-thread--block" : ""}`} />
                      <text x={TX} y={y + 15} className="coll-thread-text">{t}{holding ? " ✓" : blocked ? " ⏳" : ""}</text>
                    </g>
                  );
                })}

                {/* Arrow from T1 to lock */}
                <line x1={TX} y1={TY + 36} x2={TX} y2={TY + 50} className="coll-chain-arrow" />
              </svg>
              <div className="coll-ds coll-ds--sync">
                <span className="coll-ds__label">同步</span>
                <div className="coll-ds__items">
                  {["全局锁保护", "线程排队竞争"].map((t, i) => (
                    <span key={i} className={`coll-ds__step ${i === phase ? "coll-ds__step--active" : ""} ${i < phase ? "coll-ds__step--past" : ""}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "chm") {
          return (
            <div className="coll-scene">
              <svg className="coll-svg" viewBox="0 0 400 170" preserveAspectRatio="xMidYMid meet">
                <text x={200} y={16} className="coll-title">{phase === 0 ? "分段锁：Segment 独立加锁" : "JDK8：CAS + synchronized 桶头"}</text>

                {segments.map((seg, i) => {
                  const x = 30 + i * 92;
                  const isActive = phase === 0 ? i < 2 : i === 0;
                  return (
                    <g key={seg.id}>
                      <rect x={x} y={36} width={82} height={100} rx={10} className={`coll-seg ${isActive ? "coll-seg--active" : ""}`} />
                      <text x={x + 41} y={52} className="coll-seg-label">{seg.id}</text>
                      {seg.keys.map((k, j) => (
                        <g key={k}>
                          <rect x={x + 8} y={58 + j * 28} width={66} height={22} rx={5} className="coll-seg-node" />
                          <text x={x + 41} y={73 + j * 28} className="coll-seg-text">{k}</text>
                        </g>
                      ))}
                      {isActive && (
                        <text x={x + 41} y={142} className="coll-seg-lock">{phase === 0 ? "🔒" : "CAS"}</text>
                      )}
                    </g>
                  );
                })}
              </svg>
              <div className="coll-ds coll-ds--chm">
                <span className="coll-ds__label">CHM</span>
                <div className="coll-ds__items">
                  {["分段锁并发", "CAS + 桶头锁"].map((t, i) => (
                    <span key={i} className={`coll-ds__step ${i === phase ? "coll-ds__step--active" : ""} ${i < phase ? "coll-ds__step--past" : ""}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        return null;
      }}
    />
  );
}
