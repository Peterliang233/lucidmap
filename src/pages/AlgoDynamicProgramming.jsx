import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "fib-state",
    title: "斐波那契：定义状态",
    description: "dp[i] 表示第 i 个斐波那契数，边界 dp[0]=0, dp[1]=1。",
    bullets: ["dp[0] = 0, dp[1] = 1", "目标：求 dp[7]"],
    active: "fib",
    phase: 0,
  },
  {
    id: "fib-transition",
    title: "斐波那契：状态转移",
    description: "dp[i] = dp[i-1] + dp[i-2]，每个值由前两个值推出。",
    bullets: ["dp[2] = dp[1] + dp[0] = 1", "dp[3] = dp[2] + dp[1] = 2"],
    active: "fib",
    phase: 1,
  },
  {
    id: "fib-fill",
    title: "斐波那契：填表过程",
    description: "从左到右依次填充，每格依赖前两格。",
    bullets: ["dp[4]=3, dp[5]=5, dp[6]=8", "dp[7] = 13"],
    active: "fib",
    phase: 2,
  },
  {
    id: "fib-result",
    title: "斐波那契：结果",
    description: "整个数组填充完毕，dp[7]=13 即为答案。",
    bullets: ["时间 O(n)，空间 O(n)", "可用滚动变量优化到 O(1)"],
    active: "fib",
    phase: 3,
  },
  {
    id: "climb-state",
    title: "爬楼梯：定义状态",
    description: "dp[i] 表示爬到第 i 阶的方案数，每次可爬 1 或 2 阶。",
    bullets: ["dp[0] = 1（起点）", "dp[1] = 1（一种方式）"],
    active: "climb",
    phase: 0,
  },
  {
    id: "climb-transition",
    title: "爬楼梯：状态转移",
    description: "dp[i] = dp[i-1] + dp[i-2]，从 i-1 跨1阶 或 i-2 跨2阶。",
    bullets: ["dp[2] = dp[1] + dp[0] = 2", "两种走法：1+1 或 2"],
    active: "climb",
    phase: 1,
  },
  {
    id: "climb-fill",
    title: "爬楼梯：填表",
    description: "逐阶计算方案数。",
    bullets: ["dp[3]=3, dp[4]=5", "dp[5]=8, dp[6]=13"],
    active: "climb",
    phase: 2,
  },
  {
    id: "climb-result",
    title: "爬楼梯：结果",
    description: "爬到第 6 阶共 13 种方案。",
    bullets: ["本质与斐波那契相同", "经典 DP 入门题"],
    active: "climb",
    phase: 3,
  },
  {
    id: "lcs-state",
    title: "LCS：定义状态",
    description: "dp[i][j] 表示 s1 前 i 个字符与 s2 前 j 个字符的最长公共子序列长度。",
    bullets: ["s1 = \"ABCDE\", s2 = \"ACE\"", "dp[0][j] = 0, dp[i][0] = 0"],
    active: "lcs",
    phase: 0,
  },
  {
    id: "lcs-transition",
    title: "LCS：状态转移",
    description: "若字符相同取左上角+1，否则取左或上的较大值。",
    bullets: ["s1[i]==s2[j] → dp[i-1][j-1]+1", "否则 → max(dp[i-1][j], dp[i][j-1])"],
    active: "lcs",
    phase: 1,
  },
  {
    id: "lcs-fill",
    title: "LCS：填表",
    description: "逐行逐列填充 2D 表格。",
    bullets: ["A 匹配 A → dp[1][1]=1", "C 匹配 C → dp[3][2]=2"],
    active: "lcs",
    phase: 2,
  },
  {
    id: "lcs-result",
    title: "LCS：结果",
    description: "dp[5][3]=3，最长公共子序列为 \"ACE\"。",
    bullets: ["回溯路径找出子序列", "时间 O(mn)，空间 O(mn)"],
    active: "lcs",
    phase: 3,
  },
];

// ── Fibonacci data ──
const fibVals = [0, 1, 1, 2, 3, 5, 8, 13];
const fibFillOrder = [
  { filled: 2 },  // phase 0: show dp[0], dp[1]
  { filled: 4 },  // phase 1: show through dp[3]
  { filled: 7 },  // phase 2: show through dp[6]
  { filled: 8 },  // phase 3: all filled
];

// ── Climbing Stairs data ──
const climbVals = [1, 1, 2, 3, 5, 8, 13];
const climbFillOrder = [
  { filled: 2 },
  { filled: 3 },
  { filled: 5 },
  { filled: 7 },
];

// ── LCS data: "ABCDE" vs "ACE" ──
const lcsS1 = ["A", "B", "C", "D", "E"];
const lcsS2 = ["A", "C", "E"];
// Full DP table (6 rows x 4 cols, including 0-row and 0-col)
const lcsTable = [
  [0, 0, 0, 0],
  [0, 1, 1, 1],
  [0, 1, 1, 1],
  [0, 1, 2, 2],
  [0, 1, 2, 2],
  [0, 1, 2, 3],
];
// Which cells are "match" (diagonal transition)
const lcsMatch = [[1,1],[3,2],[5,3]];
// Path cells for backtracking
const lcsPath = [[5,3],[3,2],[1,1]];
const lcsFillPhase = [
  { rows: 1 },  // phase 0: header only
  { rows: 2 },  // phase 1: first 2 data rows
  { rows: 4 },  // phase 2: first 4 data rows
  { rows: 6 },  // phase 3: all rows (including row 0)
];

// SVG constants for 1D arrays
const C_W = 52, C_H = 40, C_GAP = 6, ARR_Y = 60;

function arrX(i, len) {
  const total = len * C_W + (len - 1) * C_GAP;
  return (540 - total) / 2 + i * (C_W + C_GAP);
}

// SVG constants for 2D table
const T_W = 44, T_H = 34, T_GAP = 3, T_X0 = 116, T_Y0 = 50;

function tblX(j) { return T_X0 + j * (T_W + T_GAP); }
function tblY(i) { return T_Y0 + i * (T_H + T_GAP); }

const principles = [
  {
    title: "最优子结构",
    detail: "问题的最优解包含子问题的最优解。",
    points: ["大问题拆成小问题", "子问题之间独立", "递推关系连接子问题与原问题"],
  },
  {
    title: "重叠子问题",
    detail: "同一子问题被多次求解，用表格记忆化避免重复计算。",
    points: ["自顶向下：递归 + 备忘录", "自底向上：迭代填表", "空间优化：滚动数组"],
  },
  {
    title: "状态转移方程",
    detail: "DP 的核心，定义了如何从已知状态推导未知状态。",
    points: ["斐波那契：dp[i] = dp[i-1] + dp[i-2]", "LCS：匹配则 +1，否则取 max", "背包：选或不选，取最优"],
  },
];

export default function AlgoDynamicProgramming() {
  return (
    <TopicShell
      eyebrow="算法动画"
      title="动态规划"
      subtitle="斐波那契、爬楼梯与 LCS 的递推填表过程。"
      steps={steps}
      panel={[
        { title: "核心思想", detail: "拆分子问题，保存中间结果，避免重复计算。" },
        { title: "适用条件", detail: "最优子结构 + 重叠子问题。" },
      ]}
      principles={principles}
      principlesIntro="动态规划三大核心要素与经典应用。"
      flow={["定义状态含义", "推导转移方程", "确定填表顺序"]}
      diagramClass="dp-diagram"
      renderDiagram={(step) => {
        const mode = step.active;
        const phase = step.phase;

        if (mode === "fib") {
          const f = fibFillOrder[phase];
          return (
            <div className="dp-scene">
              <svg className="dp-svg" viewBox="0 0 540 150" preserveAspectRatio="xMidYMid meet">
                <text x={270} y={20} className="dp-title">dp[i] = dp[i-1] + dp[i-2]</text>

                {fibVals.map((v, i) => {
                  const x = arrX(i, fibVals.length);
                  const filled = i < f.filled;
                  const isActive = i === f.filled - 1 && phase > 0;
                  const isBase = i <= 1;
                  return (
                    <g key={i}>
                      <rect
                        x={x} y={ARR_Y} width={C_W} height={C_H} rx={8}
                        className={`dp-cell-svg ${filled ? "dp-cell-svg--filled" : ""} ${isActive ? "dp-cell-svg--active" : ""} ${isBase && filled ? "dp-cell-svg--base" : ""}`}
                      />
                      <text x={x + C_W / 2} y={ARR_Y + 26} className={`dp-cell-val ${filled ? "dp-cell-val--filled" : ""}`}>
                        {filled ? v : "?"}
                      </text>
                      <text x={x + C_W / 2} y={ARR_Y - 8} className="dp-cell-idx">dp[{i}]</text>

                      {/* Arrows showing dependency */}
                      {isActive && i >= 2 && (
                        <>
                          <line
                            x1={arrX(i - 1, fibVals.length) + C_W / 2} y1={ARR_Y + C_H + 4}
                            x2={x + C_W / 2 - 6} y2={ARR_Y + C_H + 18}
                            className="dp-arrow dp-arrow--fib"
                            markerEnd="url(#dp-arr)"
                          />
                          <line
                            x1={arrX(i - 2, fibVals.length) + C_W / 2} y1={ARR_Y + C_H + 4}
                            x2={x + C_W / 2 - 12} y2={ARR_Y + C_H + 18}
                            className="dp-arrow dp-arrow--fib"
                            markerEnd="url(#dp-arr)"
                          />
                          <text x={x + C_W / 2} y={ARR_Y + C_H + 30} className="dp-arrow-label">
                            {fibVals[i - 1]}+{fibVals[i - 2]}={v}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}

                <defs>
                  <marker id="dp-arr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <path d="M0,0 L6,2.5 L0,5" fill="rgba(210,100,42,0.6)" />
                  </marker>
                </defs>
              </svg>

              <div className="dp-ds dp-ds--fib">
                <span className="dp-ds__label">填表</span>
                <div className="dp-ds__items">
                  {fibFillOrder.map((fo, i) => (
                    <span key={i} className={`dp-ds__step ${i === phase ? "dp-ds__step--active" : ""} ${i < phase ? "dp-ds__step--past" : ""}`}>
                      {i === 0 ? "边界 dp[0..1]" : i === 3 ? `dp[7]=${fibVals[7]}` : `填到 dp[${fo.filled - 1}]=${fibVals[fo.filled - 1]}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "climb") {
          const c = climbFillOrder[phase];
          return (
            <div className="dp-scene">
              <svg className="dp-svg" viewBox="0 0 540 170" preserveAspectRatio="xMidYMid meet">
                <text x={270} y={20} className="dp-title">dp[i] = dp[i-1] + dp[i-2]（爬 1 阶或 2 阶）</text>

                {climbVals.map((v, i) => {
                  const x = arrX(i, climbVals.length);
                  const filled = i < c.filled;
                  const isActive = i === c.filled - 1 && phase > 0;
                  const isBase = i <= 1;
                  return (
                    <g key={i}>
                      {/* Stair shape */}
                      <rect
                        x={x} y={ARR_Y + i * 4} width={C_W} height={C_H} rx={8}
                        className={`dp-cell-svg ${filled ? "dp-cell-svg--climb" : ""} ${isActive ? "dp-cell-svg--active-climb" : ""} ${isBase && filled ? "dp-cell-svg--base-climb" : ""}`}
                      />
                      <text x={x + C_W / 2} y={ARR_Y + i * 4 + 26} className={`dp-cell-val ${filled ? "dp-cell-val--climb" : ""}`}>
                        {filled ? v : "?"}
                      </text>
                      <text x={x + C_W / 2} y={ARR_Y - 8} className="dp-cell-idx">第{i}阶</text>

                      {/* Step arrows */}
                      {isActive && i >= 2 && (
                        <>
                          <line
                            x1={arrX(i - 1, climbVals.length) + C_W} y1={ARR_Y + (i - 1) * 4 + C_H / 2}
                            x2={x} y2={ARR_Y + i * 4 + C_H / 2}
                            className="dp-arrow dp-arrow--climb"
                            markerEnd="url(#dp-arr-climb)"
                          />
                          <text x={(arrX(i - 1, climbVals.length) + C_W + x) / 2} y={ARR_Y + (i - 1) * 4 + C_H / 2 - 6} className="dp-arrow-label dp-arrow-label--climb">+1阶</text>
                          {i >= 2 && (
                            <>
                              <path
                                d={`M${arrX(i - 2, climbVals.length) + C_W},${ARR_Y + (i - 2) * 4 + C_H} Q${arrX(i - 1, climbVals.length) + C_W / 2},${ARR_Y + i * 4 + C_H + 10} ${x},${ARR_Y + i * 4 + C_H}`}
                                className="dp-arrow dp-arrow--climb-2"
                                markerEnd="url(#dp-arr-climb)"
                                fill="none"
                              />
                              <text x={arrX(i - 1, climbVals.length) + C_W / 2} y={ARR_Y + i * 4 + C_H + 22} className="dp-arrow-label dp-arrow-label--climb">+2阶</text>
                            </>
                          )}
                        </>
                      )}
                    </g>
                  );
                })}

                <defs>
                  <marker id="dp-arr-climb" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <path d="M0,0 L6,2.5 L0,5" fill="rgba(42,111,107,0.6)" />
                  </marker>
                </defs>
              </svg>

              <div className="dp-ds dp-ds--climb">
                <span className="dp-ds__label">方案</span>
                <div className="dp-ds__items">
                  {climbFillOrder.map((co, i) => (
                    <span key={i} className={`dp-ds__step ${i === phase ? "dp-ds__step--active" : ""} ${i < phase ? "dp-ds__step--past" : ""}`}>
                      {i === 0 ? "边界 第0,1阶" : `第${co.filled - 1}阶=${climbVals[co.filled - 1]}种`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "lcs") {
          const lf = lcsFillPhase[phase];
          return (
            <div className="dp-scene">
              <svg className="dp-svg" viewBox="0 0 400 310" preserveAspectRatio="xMidYMid meet">
                <text x={200} y={18} className="dp-title">LCS(&quot;ABCDE&quot;, &quot;ACE&quot;)</text>

                {/* Column headers (s2) */}
                <text x={T_X0 - 16} y={T_Y0 + T_H / 2 + 4} className="dp-tbl-hdr">∅</text>
                {lcsS2.map((c, j) => (
                  <text key={j} x={tblX(j + 1) + T_W / 2} y={T_Y0 - 8} className="dp-tbl-hdr dp-tbl-hdr--s2">{c}</text>
                ))}
                <text x={tblX(0) + T_W / 2} y={T_Y0 - 8} className="dp-tbl-hdr">∅</text>

                {/* Row headers (s1) */}
                {lcsS1.map((c, i) => (
                  <text key={i} x={T_X0 - 16} y={tblY(i + 1) + T_H / 2 + 4} className="dp-tbl-hdr dp-tbl-hdr--s1">{c}</text>
                ))}

                {/* Table cells */}
                {lcsTable.map((row, i) =>
                  row.map((val, j) => {
                    const x = tblX(j);
                    const y = tblY(i);
                    const filled = i < lf.rows;
                    const isMatch = filled && lcsMatch.some(([mi, mj]) => mi === i && mj === j);
                    const isPath = phase === 3 && lcsPath.some(([pi, pj]) => pi === i && pj === j);
                    const isActive = filled && i === lf.rows - 1;
                    return (
                      <g key={`${i}-${j}`}>
                        <rect
                          x={x} y={y} width={T_W} height={T_H} rx={6}
                          className={`dp-tbl-cell ${filled ? "dp-tbl-cell--filled" : ""} ${isMatch ? "dp-tbl-cell--match" : ""} ${isPath ? "dp-tbl-cell--path" : ""} ${isActive ? "dp-tbl-cell--row-active" : ""}`}
                        />
                        <text x={x + T_W / 2} y={y + T_H / 2 + 4} className={`dp-tbl-val ${filled ? "dp-tbl-val--filled" : ""} ${isMatch ? "dp-tbl-val--match" : ""} ${isPath ? "dp-tbl-val--path" : ""}`}>
                          {filled ? val : ""}
                        </text>

                        {/* Diagonal arrow for match cells */}
                        {isMatch && phase >= 2 && (
                          <line
                            x1={tblX(j - 1) + T_W} y1={tblY(i - 1) + T_H}
                            x2={x + 2} y2={y + 2}
                            className="dp-arrow dp-arrow--lcs"
                            markerEnd="url(#dp-arr-lcs)"
                          />
                        )}
                      </g>
                    );
                  })
                )}

                <defs>
                  <marker id="dp-arr-lcs" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <path d="M0,0 L6,2.5 L0,5" fill="rgba(140,80,180,0.6)" />
                  </marker>
                </defs>

                {/* Result label */}
                {phase === 3 && (
                  <text x={200} y={298} className="dp-lcs-result">LCS = &quot;ACE&quot;，长度 = 3</text>
                )}
              </svg>

              <div className="dp-ds dp-ds--lcs">
                <span className="dp-ds__label">LCS</span>
                <div className="dp-ds__items">
                  {lcsFillPhase.map((lp, i) => (
                    <span key={i} className={`dp-ds__step ${i === phase ? "dp-ds__step--active" : ""} ${i < phase ? "dp-ds__step--past" : ""}`}>
                      {i === 0 ? "初始化边界" : i === 3 ? "结果: ACE (3)" : `填第${lp.rows - 1}行`}
                    </span>
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
