import TopicShell from "../components/TopicShell.jsx";

/* ── Steps ── */
const steps = [
  {
    id: "overview", title: "Transformer 架构总览",
    description: "Transformer 由 Encoder 和 Decoder 组成，完全基于注意力机制，抛弃了 RNN 的序列依赖，实现并行计算。",
    bullets: ["Encoder-Decoder 对称结构", "Self-Attention 替代 RNN/CNN", "并行计算 + 长距离依赖建模"],
    mode: "overview", phase: 0,
  },
  {
    id: "embedding", title: "输入嵌入 + 位置编码",
    description: "Token 经 Embedding 转为向量，再加上位置编码（Positional Encoding）注入序列顺序信息。",
    bullets: ["Token → 512 维 Embedding 向量", "PE 使用 sin/cos 函数编码位置", "Embedding + PE = 模型输入"],
    mode: "embed", phase: 0,
  },
  {
    id: "qkv", title: "Q / K / V 计算",
    description: "输入向量分别乘以 Wq、Wk、Wv 三个权重矩阵，得到 Query、Key、Value 向量。",
    bullets: ["Q = X · Wq（查询：我在找什么）", "K = X · Wk（键：我能提供什么）", "V = X · Wv（值：我的实际内容）"],
    mode: "attention", phase: 0,
  },
  {
    id: "score", title: "注意力分数计算",
    description: "Q 与 K 做点积得到注意力分数，除以 √dk 缩放后经 Softmax 归一化，再与 V 加权求和。",
    bullets: ["Score = Q · K^T / √dk", "Softmax 归一化为概率分布", "Output = Softmax(Score) · V"],
    mode: "attention", phase: 1,
  },
  {
    id: "multihead", title: "多头注意力",
    description: "将 Q/K/V 拆分到 8 个头并行计算注意力，再拼接通过线性层，捕获不同子空间的语义关系。",
    bullets: ["8 个头各自独立计算注意力", "每个头关注不同的语义模式", "Concat → Linear 合并输出"],
    mode: "multihead", phase: 0,
  },
  {
    id: "ffn", title: "前馈网络 + 残差连接",
    description: "注意力输出经 Add & Norm 后进入两层前馈网络（FFN），再次 Add & Norm，形成一个完整的 Encoder 层。",
    bullets: ["FFN = Linear → ReLU → Linear", "残差连接：x + SubLayer(x)", "Layer Norm 稳定训练"],
    mode: "ffn", phase: 0,
  },
  {
    id: "decoder", title: "Decoder 结构",
    description: "Decoder 在 Encoder 基础上增加 Masked Self-Attention 和 Cross-Attention，实现自回归生成。",
    bullets: ["Masked Attention 防止看到未来", "Cross-Attention 关注 Encoder 输出", "自回归逐 Token 生成"],
    mode: "decoder", phase: 0,
  },
  {
    id: "output", title: "输出层与生成",
    description: "Decoder 输出经 Linear 映射到词表大小，Softmax 得到概率分布，选择最高概率的 Token。",
    bullets: ["Linear 投影到词表维度", "Softmax 转为概率分布", "Greedy / Beam Search 选词"],
    mode: "output", phase: 0,
  },
];

const principles = [
  { title: "自注意力机制", detail: "每个 Token 都能直接关注序列中任意位置，捕获长距离依赖。", points: ["O(1) 路径长度", "并行计算所有位置", "Q·K 衡量相关性"] },
  { title: "多头并行", detail: "多个注意力头在不同子空间捕获不同语义模式。", points: ["8 头各自独立", "不同头关注不同模式", "拼接后线性融合"] },
  { title: "残差 + 归一化", detail: "残差连接缓解梯度消失，Layer Norm 稳定深层训练。", points: ["x + SubLayer(x)", "梯度直通路径", "每层独立归一化"] },
];

/* ── Overview Scene ── */
function OverviewScene() {
  const encLayers = ["Multi-Head Attention", "Add & Norm", "Feed Forward", "Add & Norm"];
  const decLayers = ["Masked Attention", "Add & Norm", "Cross-Attention", "Add & Norm", "Feed Forward", "Add & Norm"];
  return (
    <svg className="tfm-svg" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={22} className="tfm-heading">Transformer 架构总览</text>
      {/* Encoder stack */}
      <rect x={60} y={40} width={200} height={220} rx={12} className="tfm-stack-box tfm-stack-box--enc" />
      <text x={160} y={60} className="tfm-stack-title" fill="#4c78a8">Encoder x N</text>
      {encLayers.map((l, i) => (
        <g key={i}>
          <rect x={80} y={70 + i * 44} width={160} height={32} rx={6} className="tfm-layer-box" style={{ "--tf-delay": `${i * 0.1}s` }} />
          <text x={160} y={90 + i * 44} className="tfm-layer-label">{l}</text>
        </g>
      ))}
      {/* Decoder stack */}
      <rect x={340} y={40} width={200} height={220} rx={12} className="tfm-stack-box tfm-stack-box--dec" />
      <text x={440} y={60} className="tfm-stack-title" fill="#d2642a">Decoder x N</text>
      {decLayers.map((l, i) => (
        <g key={i}>
          <rect x={360} y={68 + i * 30} width={160} height={22} rx={5} className="tfm-layer-box tfm-layer-box--dec" style={{ "--tf-delay": `${(i + 4) * 0.1}s` }} />
          <text x={440} y={83 + i * 30} className="tfm-layer-label tfm-layer-label--sm">{l}</text>
        </g>
      ))}
      {/* Arrow Enc → Dec */}
      <line x1={260} y1={150} x2={340} y2={150} className="tfm-arrow" markerEnd="url(#tfm-arr)" />
      <text x={300} y={142} className="tfm-arrow-label">Context</text>
      {/* Input / Output labels */}
      <text x={160} y={280} className="tfm-io-label">Input Embedding + PE</text>
      <text x={440} y={280} className="tfm-io-label">Output (Shifted Right)</text>
      <text x={300} y={296} className="tfm-hint">Encoder 编码上下文 → Decoder 自回归生成</text>
      <defs>
        <marker id="tfm-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(76,120,168,0.5)" /></marker>
        <marker id="tfm-arr-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="rgba(42,111,107,0.6)" /></marker>
      </defs>
    </svg>
  );
}

/* ── Embedding Scene ── */
function EmbedScene() {
  const tokens = ["I", "love", "AI", "<pad>"];
  return (
    <svg className="tfm-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={22} className="tfm-heading">输入嵌入 + 位置编码</text>
      {/* Tokens */}
      {tokens.map((t, i) => {
        const x = 80 + i * 120;
        return (
          <g key={i} className="tfm-embed-g" style={{ "--tf-delay": `${i * 0.15}s` }}>
            <rect x={x} y={45} width={80} height={30} rx={6} className="tfm-token-box" />
            <text x={x + 40} y={65} className="tfm-token-label">{t}</text>
            <line x1={x + 40} y1={75} x2={x + 40} y2={95} className="tfm-arrow-sm" markerEnd="url(#tfm-arr)" />
            {/* Embedding */}
            <rect x={x} y={95} width={80} height={26} rx={5} className="tfm-embed-box" />
            <text x={x + 40} y={112} className="tfm-embed-label">Embedding</text>
            {/* + PE */}
            <text x={x + 40} y={136} className="tfm-plus">+</text>
            <rect x={x} y={142} width={80} height={26} rx={5} className="tfm-pe-box" />
            <text x={x + 40} y={159} className="tfm-pe-label">PE (pos={i})</text>
            {/* = Result */}
            <line x1={x + 40} y1={168} x2={x + 40} y2={188} className="tfm-arrow-sm" markerEnd="url(#tfm-arr)" />
            <rect x={x} y={188} width={80} height={26} rx={5} className="tfm-result-box" />
            <text x={x + 40} y={205} className="tfm-result-label">X{i}</text>
          </g>
        );
      })}
      <text x={300} y={240} className="tfm-hint">PE(pos,2i) = sin(pos/10000^(2i/d)) · PE(pos,2i+1) = cos(...)</text>
    </svg>
  );
}

/* ── Attention Scene (2 phases: QKV, Score) ── */
function AttentionScene({ phase }) {
  if (phase === 0) {
    /* QKV computation */
    return (
      <svg className="tfm-svg" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
        <text x={300} y={22} className="tfm-heading">Q / K / V 计算</text>
        {/* Input X */}
        <rect x={40} y={80} width={100} height={80} rx={10} className="tfm-matrix-box" />
        <text x={90} y={105} className="tfm-matrix-label">X</text>
        <text x={90} y={125} className="tfm-matrix-sub">输入向量</text>
        <text x={90} y={145} className="tfm-matrix-dim">(n x 512)</text>
        {/* Arrows to W matrices */}
        {[
          { label: "Wq", color: "#4c78a8", y: 70, result: "Q" },
          { label: "Wk", color: "#d2642a", y: 120, result: "K" },
          { label: "Wv", color: "#2a6f6b", y: 170, result: "V" },
        ].map((w, i) => (
          <g key={i} className="tfm-qkv-g" style={{ "--tf-delay": `${i * 0.2}s` }}>
            <line x1={140} y1={120} x2={220} y2={w.y + 20} className="tfm-arrow" markerEnd="url(#tfm-arr)" />
            <rect x={220} y={w.y} width={100} height={40} rx={8} className="tfm-w-box" style={{ "--tf-c": w.color }} />
            <text x={270} y={w.y + 18} className="tfm-w-label" fill={w.color}>x {w.label}</text>
            <text x={270} y={w.y + 33} className="tfm-w-dim">(512 x 64)</text>
            <line x1={320} y1={w.y + 20} x2={400} y2={w.y + 20} className="tfm-arrow" markerEnd="url(#tfm-arr)" />
            <rect x={400} y={w.y} width={100} height={40} rx={8} className="tfm-qkv-box" style={{ "--tf-c": w.color }} />
            <text x={450} y={w.y + 18} className="tfm-qkv-label" fill={w.color}>{w.result}</text>
            <text x={450} y={w.y + 33} className="tfm-qkv-dim">(n x 64)</text>
          </g>
        ))}
        <text x={300} y={235} className="tfm-hint">每个 Token 的向量分别投影为 Query、Key、Value</text>
      </svg>
    );
  }
  /* phase 1: Score computation */
  return (
    <svg className="tfm-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={22} className="tfm-heading">注意力分数计算</text>
      {/* Q · K^T */}
      <rect x={30} y={55} width={70} height={40} rx={8} className="tfm-qkv-box" style={{ "--tf-c": "#4c78a8" }} />
      <text x={65} y={80} className="tfm-qkv-label" fill="#4c78a8">Q</text>
      <text x={115} y={80} className="tfm-op">·</text>
      <rect x={130} y={55} width={70} height={40} rx={8} className="tfm-qkv-box" style={{ "--tf-c": "#d2642a" }} />
      <text x={165} y={80} className="tfm-qkv-label" fill="#d2642a">K^T</text>
      {/* / sqrt(dk) */}
      <text x={220} y={80} className="tfm-op">/ √dk</text>
      <line x1={260} y1={75} x2={290} y2={75} className="tfm-arrow" markerEnd="url(#tfm-arr)" />
      {/* Score matrix */}
      <rect x={290} y={50} width={90} height={50} rx={8} className="tfm-score-box" />
      <text x={335} y={72} className="tfm-score-label">Score</text>
      <text x={335} y={90} className="tfm-score-dim">(n x n)</text>
      {/* Softmax */}
      <line x1={380} y1={75} x2={410} y2={75} className="tfm-arrow" markerEnd="url(#tfm-arr)" />
      <rect x={410} y={55} width={80} height={40} rx={8} className="tfm-softmax-box" />
      <text x={450} y={80} className="tfm-softmax-label">Softmax</text>
      {/* x V */}
      <line x1={490} y1={75} x2={510} y2={75} className="tfm-arrow" markerEnd="url(#tfm-arr)" />
      <text x={520} y={68} className="tfm-op">·</text>
      <rect x={530} y={55} width={50} height={40} rx={8} className="tfm-qkv-box" style={{ "--tf-c": "#2a6f6b" }} />
      <text x={555} y={80} className="tfm-qkv-label" fill="#2a6f6b">V</text>
      {/* Attention weights visualization */}
      <text x={300} y={130} className="tfm-sub-heading">注意力权重矩阵示例</text>
      {["I", "love", "AI"].map((t, i) => (
        <text key={`r${i}`} x={130} y={158 + i * 28} className="tfm-attn-token">{t}</text>
      ))}
      {["I", "love", "AI"].map((t, i) => (
        <text key={`c${i}`} x={190 + i * 80} y={142} className="tfm-attn-token">{t}</text>
      ))}
      {[
        [0.1, 0.2, 0.7],
        [0.3, 0.1, 0.6],
        [0.5, 0.3, 0.2],
      ].map((row, ri) =>
        row.map((v, ci) => (
          <g key={`${ri}-${ci}`}>
            <rect x={160 + ci * 80} y={143 + ri * 28} width={60} height={22} rx={4}
              className="tfm-attn-cell" style={{ "--tf-opacity": v }} />
            <text x={190 + ci * 80} y={158 + ri * 28} className="tfm-attn-val">{v.toFixed(1)}</text>
          </g>
        ))
      )}
      <text x={300} y={245} className="tfm-hint">Attention(Q,K,V) = Softmax(Q·K^T / √dk) · V</text>
    </svg>
  );
}

/* ── Multi-Head Scene ── */
function MultiHeadScene() {
  const heads = Array.from({ length: 8 }, (_, i) => i);
  return (
    <svg className="tfm-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={22} className="tfm-heading">多头注意力 Multi-Head Attention</text>
      {/* Input */}
      <rect x={30} y={60} width={80} height={36} rx={8} className="tfm-input-box" />
      <text x={70} y={83} className="tfm-input-label">Q / K / V</text>
      {/* Split arrows */}
      {heads.map((_, i) => {
        const hx = 160 + i * 52;
        return (
          <g key={i} className="tfm-head-g" style={{ "--tf-delay": `${i * 0.08}s` }}>
            <line x1={110} y1={78} x2={hx + 16} y2={105} className="tfm-arrow-sm" />
            <rect x={hx} y={105} width={36} height={60} rx={6} className="tfm-head-box" style={{ "--tf-c": `hsl(${i * 40}, 55%, 50%)` }} />
            <text x={hx + 18} y={130} className="tfm-head-label">H{i + 1}</text>
            <text x={hx + 18} y={150} className="tfm-head-sub">Attn</text>
            <line x1={hx + 18} y1={165} x2={hx + 18} y2={185} className="tfm-arrow-sm" />
          </g>
        );
      })}
      {/* Concat */}
      <rect x={160} y={185} width={310} height={28} rx={6} className="tfm-concat-box" />
      <text x={315} y={204} className="tfm-concat-label">Concat</text>
      {/* Linear */}
      <line x1={315} y1={213} x2={315} y2={228} className="tfm-arrow-sm" markerEnd="url(#tfm-arr)" />
      <rect x={240} y={228} width={150} height={24} rx={6} className="tfm-linear-box" />
      <text x={315} y={244} className="tfm-linear-label">Linear (Wo)</text>
      <text x={540} y={140} className="tfm-side-note">8 个头</text>
      <text x={540} y={156} className="tfm-side-note">并行计算</text>
    </svg>
  );
}

/* ── FFN + Residual Scene ── */
function FfnScene() {
  const layers = [
    { label: "Multi-Head Attention", color: "#4c78a8", y: 50 },
    { label: "Add & Norm", color: "#8c50b4", y: 100, small: true },
    { label: "FFN: Linear → ReLU → Linear", color: "#d2642a", y: 145 },
    { label: "Add & Norm", color: "#8c50b4", y: 195, small: true },
  ];
  return (
    <svg className="tfm-svg" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={22} className="tfm-heading">前馈网络 + 残差连接</text>
      {/* Main flow */}
      {layers.map((l, i) => (
        <g key={i} className="tfm-ffn-g" style={{ "--tf-delay": `${i * 0.15}s` }}>
          <rect x={180} y={l.y} width={240} height={l.small ? 30 : 36} rx={8}
            className={`tfm-ffn-box ${l.small ? "tfm-ffn-box--norm" : ""}`} style={{ "--tf-c": l.color }} />
          <text x={300} y={l.y + (l.small ? 20 : 23)} className="tfm-ffn-label" fill={l.color}>{l.label}</text>
          {i < 3 && <line x1={300} y1={l.y + (l.small ? 30 : 36)} x2={300} y2={layers[i + 1].y} className="tfm-arrow-sm" markerEnd="url(#tfm-arr)" />}
        </g>
      ))}
      {/* Residual connections */}
      <path d="M180,68 L140,68 L140,115 L180,115" className="tfm-residual" />
      <text x={125} y={95} className="tfm-res-label">+</text>
      <path d="M180,163 L140,163 L140,210 L180,210" className="tfm-residual" />
      <text x={125} y={190} className="tfm-res-label">+</text>
      {/* Right side explanation */}
      <rect x={440} y={65} width={140} height={70} rx={8} className="tfm-note-box" />
      <text x={510} y={88} className="tfm-note-title">残差连接</text>
      <text x={510} y={108} className="tfm-note-text">output = x + F(x)</text>
      <text x={510} y={124} className="tfm-note-text">梯度直通路径</text>
      <rect x={440} y={155} width={140} height={55} rx={8} className="tfm-note-box" />
      <text x={510} y={175} className="tfm-note-title">Layer Norm</text>
      <text x={510} y={195} className="tfm-note-text">每层独立归一化</text>
      <text x={300} y={260} className="tfm-hint">每个 Encoder 层 = Attention + Add&Norm + FFN + Add&Norm</text>
    </svg>
  );
}

/* ── Decoder Scene ── */
function DecoderScene() {
  const layers = [
    { label: "Masked Self-Attention", color: "#d2642a", y: 55, h: 34 },
    { label: "Add & Norm", color: "#8c50b4", y: 98, h: 24 },
    { label: "Cross-Attention (Q=Dec, K,V=Enc)", color: "#4c78a8", y: 132, h: 34 },
    { label: "Add & Norm", color: "#8c50b4", y: 176, h: 24 },
    { label: "Feed Forward", color: "#2a6f6b", y: 210, h: 34 },
    { label: "Add & Norm", color: "#8c50b4", y: 254, h: 24 },
  ];
  return (
    <svg className="tfm-svg" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={22} className="tfm-heading">Decoder 结构</text>
      <text x={300} y={42} className="tfm-sub-heading">Masked Attention + Cross-Attention + FFN</text>
      {layers.map((l, i) => (
        <g key={i} className="tfm-dec-g" style={{ "--tf-delay": `${i * 0.12}s` }}>
          <rect x={160} y={l.y} width={260} height={l.h} rx={7}
            className={`tfm-dec-box ${l.h < 30 ? "tfm-dec-box--norm" : ""}`} style={{ "--tf-c": l.color }} />
          <text x={290} y={l.y + l.h / 2 + 5} className="tfm-dec-label" fill={l.color}>{l.label}</text>
          {i < 5 && <line x1={290} y1={l.y + l.h} x2={290} y2={layers[i + 1].y} className="tfm-arrow-sm" markerEnd="url(#tfm-arr)" />}
        </g>
      ))}
      {/* Encoder output arrow */}
      <line x1={60} y1={149} x2={160} y2={149} className="tfm-arrow tfm-arrow--cross" markerEnd="url(#tfm-arr)" />
      <text x={40} y={140} className="tfm-enc-out">Encoder</text>
      <text x={40} y={155} className="tfm-enc-out">Output</text>
      {/* Mask note */}
      <rect x={440} y={55} width={140} height={50} rx={8} className="tfm-note-box" />
      <text x={510} y={75} className="tfm-note-title">Masked</text>
      <text x={510} y={93} className="tfm-note-text">防止看到未来 Token</text>
      <text x={300} y={296} className="tfm-hint">Decoder 逐 Token 自回归生成序列</text>
    </svg>
  );
}

/* ── Output Scene ── */
function OutputScene() {
  const probs = [
    { token: "the", prob: 0.05 }, { token: "a", prob: 0.03 },
    { token: "world", prob: 0.62 }, { token: "AI", prob: 0.15 },
    { token: "model", prob: 0.10 }, { token: "...", prob: 0.05 },
  ];
  return (
    <svg className="tfm-svg" viewBox="0 0 600 270" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={22} className="tfm-heading">输出层与生成</text>
      {/* Decoder output */}
      <rect x={60} y={50} width={120} height={36} rx={8} className="tfm-dec-out-box" />
      <text x={120} y={73} className="tfm-dec-out-label">Decoder 输出</text>
      {/* Linear */}
      <line x1={180} y1={68} x2={220} y2={68} className="tfm-arrow" markerEnd="url(#tfm-arr)" />
      <rect x={220} y={50} width={100} height={36} rx={8} className="tfm-linear-out-box" />
      <text x={270} y={73} className="tfm-linear-out-label">Linear</text>
      {/* Softmax */}
      <line x1={320} y1={68} x2={360} y2={68} className="tfm-arrow" markerEnd="url(#tfm-arr)" />
      <rect x={360} y={50} width={100} height={36} rx={8} className="tfm-softmax-out-box" />
      <text x={410} y={73} className="tfm-softmax-out-label">Softmax</text>
      {/* Probability bars */}
      <text x={300} y={110} className="tfm-sub-heading">词表概率分布</text>
      {probs.map((p, i) => {
        const y = 125 + i * 22;
        const barW = p.prob * 280;
        return (
          <g key={i} className="tfm-prob-g" style={{ "--tf-delay": `${i * 0.1}s` }}>
            <text x={120} y={y + 14} className="tfm-prob-token">{p.token}</text>
            <rect x={150} y={y + 2} width={barW} height={16} rx={3}
              className={`tfm-prob-bar ${p.prob > 0.5 ? "tfm-prob-bar--top" : ""}`} />
            <text x={155 + barW} y={y + 14} className="tfm-prob-val">{(p.prob * 100).toFixed(0)}%</text>
          </g>
        );
      })}
      {/* Selected */}
      <rect x={440} y={140} width={120} height={36} rx={10} className="tfm-selected-box" />
      <text x={500} y={155} className="tfm-selected-label">world</text>
      <text x={500} y={170} className="tfm-selected-sub">argmax</text>
      <text x={300} y={260} className="tfm-hint">Linear → Softmax → 选择最高概率 Token</text>
    </svg>
  );
}

/* ── Phase bar ── */
function PhaseBar({ mode, phase, labels, color }) {
  const tagMap = { overview: "总览", embed: "嵌入", attention: "注意力", multihead: "多头", ffn: "前馈", decoder: "解码", output: "输出" };
  return (
    <div className="tfm-phase-bar" style={{ "--phase-c": color }}>
      <span className="tfm-phase-bar__tag">{tagMap[mode]}</span>
      <div className="tfm-phase-bar__steps">
        {labels.map((t, i) => (
          <span key={i} className={`tfm-phase-bar__step ${i === phase ? "is-active" : ""} ${i < phase ? "is-past" : ""}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AiTransformer() {
  const phaseLabels = {
    overview: ["架构总览"],
    embed: ["嵌入 + PE"],
    attention: ["Q/K/V 计算", "注意力分数"],
    multihead: ["多头注意力"],
    ffn: ["FFN + 残差"],
    decoder: ["Decoder"],
    output: ["输出生成"],
  };
  const phaseColors = {
    overview: "#4c78a8",
    embed: "#2a6f6b",
    attention: "#d2642a",
    multihead: "#8c50b4",
    ffn: "#4c78a8",
    decoder: "#d2642a",
    output: "#2a6f6b",
  };

  return (
    <TopicShell
      eyebrow="AI 动画"
      title="Transformer 原理"
      subtitle="Self-Attention + Multi-Head：并行计算捕获长距离依赖的革命性架构。"
      steps={steps}
      panel={[
        { title: "核心", detail: "Self-Attention 替代 RNN 实现并行。" },
        { title: "关键", detail: "Q·K 衡量相关性，V 提供内容。" },
        { title: "结构", detail: "Encoder 编码 + Decoder 生成。" },
      ]}
      principles={principles}
      principlesIntro="理解 Transformer 的注意力机制、多头并行与残差归一化。"
      flow={["Token Embedding", "位置编码", "Self-Attention", "Multi-Head", "FFN + 残差", "Decoder 生成"]}
      diagramClass="tfm-diagram"
      renderDiagram={(step) => {
        const { mode, phase } = step;
        const pct = ((steps.findIndex(s => s.id === step.id) + 1) / steps.length) * 100;
        return (
          <div className="tfm-scene">
            <div className="tfm-progress">
              <div className="tfm-progress__fill" style={{ width: `${pct}%` }} />
            </div>
            {mode === "overview" && <OverviewScene />}
            {mode === "embed" && <EmbedScene />}
            {mode === "attention" && <AttentionScene phase={phase} />}
            {mode === "multihead" && <MultiHeadScene />}
            {mode === "ffn" && <FfnScene />}
            {mode === "decoder" && <DecoderScene />}
            {mode === "output" && <OutputScene />}
            <PhaseBar mode={mode} phase={phase} labels={phaseLabels[mode]} color={phaseColors[mode]} />
          </div>
        );
      }}
    />
  );
}
