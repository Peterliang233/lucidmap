import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "index-chunk", title: "1. 文档分块",
    description: "将原始文档按语义边界切分为固定大小的文本块。",
    bullets: ["按段落/章节切分", "典型 256-1024 tokens", "相邻块保留 20% 重叠"],
    active: "chunk", phase: 0,
  },
  {
    id: "index-embed", title: "2. 向量化存储",
    description: "Embedding 模型将每个文本块编码为高维向量，存入向量数据库。",
    bullets: ["文本 → 1536 维向量", "语义相近的内容聚集", "HNSW 索引加速检索"],
    active: "embed", phase: 0,
  },
  {
    id: "query-embed", title: "3. 查询向量化",
    description: "用户提问经同一 Embedding 模型编码为查询向量。",
    bullets: ["与文档使用同一模型", "保证向量空间对齐", "查询语义被精确捕获"],
    active: "query", phase: 0,
  },
  {
    id: "retrieve", title: "4. 相似度检索",
    description: "在向量数据库中找到与查询最相似的 Top-K 文本块。",
    bullets: ["余弦相似度 / L2 距离", "Dense + Sparse 混合检索", "毫秒级返回候选集"],
    active: "retrieve", phase: 0,
  },
  {
    id: "rerank", title: "5. 重排序",
    description: "Cross-Encoder 对候选块精排，筛选最相关的上下文。",
    bullets: ["交叉编码器逐对打分", "过滤噪声，提升精度", "Top-3 进入 Prompt"],
    active: "rerank", phase: 0,
  },
  {
    id: "generate", title: "6. LLM 生成回答",
    description: "将检索到的上下文与用户问题组装为 Prompt，LLM 生成有据可查的回答。",
    bullets: ["System + Context + Query", "回答基于检索内容", "可追溯来源，减少幻觉"],
    active: "generate", phase: 0,
  },
];

// ── Pipeline nodes ──
const nodes = [
  { id: "docs",    label: "文档",     sub: "Documents",   x: 40,  color: "76,120,168" },
  { id: "chunk",   label: "分块",     sub: "Chunking",    x: 120, color: "76,120,168" },
  { id: "embedM",  label: "Embedding", sub: "向量化",     x: 210, color: "140,80,180" },
  { id: "vecdb",   label: "向量库",   sub: "Vector DB",   x: 310, color: "42,111,107" },
  { id: "query",   label: "用户提问", sub: "Query",       x: 40,  color: "210,100,42" },
  { id: "qEmbed",  label: "Embedding", sub: "查询向量化", x: 140, color: "140,80,180" },
  { id: "search",  label: "检索",     sub: "Retrieval",   x: 310, color: "42,111,107" },
  { id: "rerank",  label: "重排序",   sub: "Reranking",   x: 400, color: "210,100,42" },
  { id: "llm",     label: "LLM",      sub: "生成回答",    x: 500, color: "180,60,60" },
  { id: "answer",  label: "回答",     sub: "Answer",      x: 590, color: "56,142,60" },
];

// Row Y positions
const ROW1 = 52;  // indexing row
const ROW2 = 132; // query row
const NW = 68, NH = 40;

// Which nodes are active per step
const activeMap = {
  chunk:    ["docs", "chunk"],
  embed:    ["chunk", "embedM", "vecdb"],
  query:    ["query", "qEmbed"],
  retrieve: ["qEmbed", "search", "vecdb"],
  rerank:   ["search", "rerank"],
  generate: ["rerank", "llm", "answer"],
};

// Arrows per step
const arrowMap = {
  chunk:    [{ from: "docs", to: "chunk", row: 1 }],
  embed:    [{ from: "chunk", to: "embedM", row: 1 }, { from: "embedM", to: "vecdb", row: 1 }],
  query:    [{ from: "query", to: "qEmbed", row: 2 }],
  retrieve: [{ from: "qEmbed", to: "search", row: 2 }, { from: "vecdb", to: "search", cross: true }],
  rerank:   [{ from: "search", to: "rerank", row: 2 }],
  generate: [{ from: "rerank", to: "llm", row: 2 }, { from: "llm", to: "answer", row: 2 }],
};

const SVG_W = 640, SVG_H = 195;

function getNodePos(id) {
  const n = nodes.find(nd => nd.id === id);
  if (!n) return { x: 0, y: 0 };
  const isRow1 = ["docs", "chunk", "embedM", "vecdb"].includes(id);
  return { x: n.x, y: isRow1 ? ROW1 : ROW2 };
}

const principles = [
  { title: "检索增强", detail: "用外部知识补充 LLM，减少幻觉。", points: ["知识库独立更新", "无需重新训练模型", "回答可追溯来源"] },
  { title: "向量检索", detail: "Embedding 将语义映射到向量空间。", points: ["余弦相似度衡量相关性", "ANN 索引实现毫秒检索", "Dense + Sparse 混合提升召回"] },
  { title: "Prompt 工程", detail: "检索结果组装为上下文送入 LLM。", points: ["System + Context + Query 结构", "控制 Token 预算", "重排序提升上下文质量"] },
];

export default function AiRag() {
  return (
    <TopicShell
      eyebrow="AI 动画"
      title="RAG 原理解析"
      subtitle="检索增强生成：从文档索引到知识问答的完整流程。"
      steps={steps}
      panel={[
        { title: "核心思想", detail: "检索外部知识，增强 LLM 生成质量。" },
        { title: "关键优势", detail: "减少幻觉、知识可更新、来源可追溯。" },
      ]}
      principles={principles}
      principlesIntro="从向量检索、重排序到 Prompt 组装，理解 RAG 的核心机制。"
      flow={["文档分块 → 向量化", "查询 → 检索 → 重排序", "上下文 + LLM → 回答"]}
      diagramClass="rag-diagram"
      renderDiagram={(step) => {
        const mode = step.active;
        const actives = activeMap[mode] || [];
        const arrows = arrowMap[mode] || [];
        const isIndexPhase = ["chunk", "embed"].includes(mode);

        return (
          <div className="rag-scene">
            <svg className="rag-svg" viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMid meet">
              {/* Phase labels */}
              <text x={12} y={ROW1 - 18} className="rag-phase-label">离线索引</text>
              <text x={12} y={ROW2 - 18} className="rag-phase-label">在线查询</text>

              {/* Phase divider */}
              <line x1={8} y1={(ROW1 + NH + ROW2 - NH) / 2 + 4} x2={SVG_W - 8} y2={(ROW1 + NH + ROW2 - NH) / 2 + 4}
                stroke="rgba(0,0,0,0.06)" strokeWidth={1} strokeDasharray="6 4" />

              <defs>
                <marker id="rag-arr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <path d="M0,0 L6,2.5 L0,5" fill="rgba(0,0,0,0.3)" />
                </marker>
              </defs>

              {/* Nodes */}
              {nodes.map((n) => {
                const isRow1 = ["docs", "chunk", "embedM", "vecdb"].includes(n.id);
                const y = isRow1 ? ROW1 : ROW2;
                const isActive = actives.includes(n.id);
                const dimPhase = isIndexPhase ? !isRow1 && !actives.includes(n.id) : isRow1 && !actives.includes(n.id);

                return (
                  <g key={n.id} className={`rag-node ${isActive ? "rag-node--active" : ""}`}
                    style={{ opacity: dimPhase ? 0.25 : isActive ? 1 : 0.5 }}>
                    <rect x={n.x - NW / 2} y={y - NH / 2} width={NW} height={NH} rx={10}
                      className="rag-node__box"
                      style={{
                        fill: isActive ? `rgba(${n.color},0.1)` : "rgba(255,255,255,0.9)",
                        stroke: `rgba(${n.color},${isActive ? 0.6 : 0.2})`,
                      }} />
                    <text x={n.x} y={y - 2} className="rag-node__label"
                      style={{ fill: `rgba(${n.color},${isActive ? 0.95 : 0.6})` }}>{n.label}</text>
                    <text x={n.x} y={y + 12} className="rag-node__sub">{n.sub}</text>
                  </g>
                );
              })}

              {/* Arrows */}
              {arrows.map((a, i) => {
                const from = getNodePos(a.from);
                const to = getNodePos(a.to);
                const fromNode = nodes.find(n => n.id === a.from);
                const c = fromNode ? fromNode.color : "0,0,0";

                if (a.cross) {
                  // Cross-row arrow (vecdb → search)
                  const pathD = `M${from.x},${from.y + NH / 2} Q${from.x},${to.y} ${to.x - NW / 2},${to.y}`;
                  return (
                    <g key={i}>
                      <path d={pathD} fill="none" className="rag-arrow rag-arrow--active"
                        style={{ stroke: `rgba(${c},0.5)` }} markerEnd="url(#rag-arr)" />
                      <circle r={3} className="rag-packet" style={{ fill: `rgba(${c},0.8)` }}>
                        <animateMotion dur="1.6s" repeatCount="indefinite" path={pathD}
                          keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
                        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.6s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  );
                }

                // Straight arrow
                const x1 = from.x + NW / 2;
                const x2 = to.x - NW / 2;
                const y = a.row === 1 ? ROW1 : ROW2;
                return (
                  <g key={i}>
                    <line x1={x1} y1={y} x2={x2} y2={y}
                      className="rag-arrow rag-arrow--active"
                      style={{ stroke: `rgba(${c},0.5)` }} markerEnd="url(#rag-arr)" />
                    <circle r={3} className="rag-packet" style={{ fill: `rgba(${c},0.8)` }}>
                      <animateMotion dur="1.4s" repeatCount="indefinite" path={`M${x1},${y} L${x2},${y}`}
                        keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="1.4s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}

              {/* Embedding model shared indicator */}
              {(mode === "query" || mode === "retrieve") && (
                <g opacity={0.4}>
                  <line x1={210} y1={ROW1 + NH / 2 + 4} x2={210} y2={ROW2 - NH / 2 - 4}
                    stroke="rgba(140,80,180,0.3)" strokeWidth={0.8} strokeDasharray="3 2" />
                  <text x={228} y={(ROW1 + ROW2) / 2 + 3} className="rag-shared-label">同一模型</text>
                </g>
              )}
            </svg>

            {/* Context example */}
            <div className={`rag-context rag-context--${mode}`}>
              {mode === "chunk" && (
                <div className="rag-context__box">
                  <span className="rag-context__tag" style={{ color: "rgba(76,120,168,0.8)" }}>分块示例</span>
                  <div className="rag-context__chunks">
                    <span className="rag-chunk">RAG 通过检索外部知识库来增强 LLM 的生成能力...</span>
                    <span className="rag-chunk">向量数据库使用 ANN 算法实现毫秒级相似度检索...</span>
                    <span className="rag-chunk">重排序阶段使用 Cross-Encoder 精确评估相关性...</span>
                  </div>
                </div>
              )}
              {mode === "embed" && (
                <div className="rag-context__box">
                  <span className="rag-context__tag" style={{ color: "rgba(140,80,180,0.8)" }}>向量化</span>
                  <div className="rag-context__vectors">
                    <span className="rag-vec"><span className="rag-vec__text">chunk_1</span><span className="rag-vec__arrow">→</span><span className="rag-vec__val">[0.12, -0.34, 0.78, ...]</span></span>
                    <span className="rag-vec"><span className="rag-vec__text">chunk_2</span><span className="rag-vec__arrow">→</span><span className="rag-vec__val">[0.45, 0.21, -0.56, ...]</span></span>
                    <span className="rag-vec"><span className="rag-vec__text">chunk_3</span><span className="rag-vec__arrow">→</span><span className="rag-vec__val">[-0.08, 0.67, 0.33, ...]</span></span>
                  </div>
                </div>
              )}
              {mode === "query" && (
                <div className="rag-context__box">
                  <span className="rag-context__tag" style={{ color: "rgba(210,100,42,0.8)" }}>用户提问</span>
                  <div className="rag-context__query">
                    <span className="rag-query-text">RAG 是如何减少幻觉的?</span>
                    <span className="rag-query-vec">→ [0.31, -0.22, 0.65, ...]</span>
                  </div>
                </div>
              )}
              {mode === "retrieve" && (
                <div className="rag-context__box">
                  <span className="rag-context__tag" style={{ color: "rgba(42,111,107,0.8)" }}>检索结果 Top-5</span>
                  <div className="rag-context__results">
                    <span className="rag-result"><span className="rag-result__score">0.92</span> RAG 通过检索外部知识库来增强...</span>
                    <span className="rag-result"><span className="rag-result__score">0.87</span> 检索到的文档作为上下文送入...</span>
                    <span className="rag-result"><span className="rag-result__score">0.81</span> 向量相似度衡量语义相关性...</span>
                  </div>
                </div>
              )}
              {mode === "rerank" && (
                <div className="rag-context__box">
                  <span className="rag-context__tag" style={{ color: "rgba(210,100,42,0.8)" }}>重排序</span>
                  <div className="rag-context__results">
                    <span className="rag-result rag-result--top"><span className="rag-result__score">0.96</span> RAG 通过检索外部知识库来增强...</span>
                    <span className="rag-result rag-result--top"><span className="rag-result__score">0.91</span> 检索到的文档作为上下文送入...</span>
                    <span className="rag-result rag-result--dim"><span className="rag-result__score">0.62</span> 向量相似度衡量语义相关性...</span>
                  </div>
                </div>
              )}
              {mode === "generate" && (
                <div className="rag-context__box">
                  <span className="rag-context__tag" style={{ color: "rgba(180,60,60,0.8)" }}>Prompt 组装</span>
                  <div className="rag-context__prompt">
                    <span className="rag-prompt-line rag-prompt-line--sys">System: 基于以下上下文回答问题</span>
                    <span className="rag-prompt-line rag-prompt-line--ctx">Context: [检索到的文档块]</span>
                    <span className="rag-prompt-line rag-prompt-line--q">Question: RAG 是如何减少幻觉的?</span>
                    <span className="rag-prompt-line rag-prompt-line--a">Answer: RAG 通过检索真实文档作为上下文，让 LLM 基于事实生成回答，从而减少幻觉...</span>
                  </div>
                </div>
              )}
            </div>

            {/* State panel */}
            <div className={`rag-ds rag-ds--${mode}`}>
              <span className="rag-ds__label">
                {isIndexPhase ? "索引" : "查询"}
              </span>
              <div className="rag-ds__items">
                {steps.map((s, i) => (
                  <span key={i} className={`rag-ds__step ${s.active === mode ? "rag-ds__step--active" : ""} ${steps.findIndex(st => st.active === mode) > i ? "rag-ds__step--past" : ""}`}>
                    {s.title.replace(/^\d+\.\s*/, "")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
