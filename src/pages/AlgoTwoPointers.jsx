import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "two-init",
    title: "对撞指针：初始化",
    description: "有序数组中找两数之和为 target=14，左右指针从两端出发。",
    bullets: ["L=0, R=6", "sum = 1+13 = 14 ✓"],
    active: "two-sum",
    phase: 0,
  },
  {
    id: "two-small",
    title: "对撞指针：和太小",
    description: "sum < target 时左指针右移，增大和。",
    bullets: ["L=0, R=4 → sum=1+9=10 < 14", "L++ → L=1"],
    active: "two-sum",
    phase: 1,
  },
  {
    id: "two-big",
    title: "对撞指针：和太大",
    description: "sum > target 时右指针左移，减小和。",
    bullets: ["L=1, R=6 → sum=3+13=16 > 14", "R-- → R=5"],
    active: "two-sum",
    phase: 2,
  },
  {
    id: "two-found",
    title: "对撞指针：找到目标",
    description: "sum == target，返回结果。",
    bullets: ["L=1, R=5 → sum=3+11=14 ✓", "返回 [1, 5]"],
    active: "two-sum",
    phase: 3,
  },
  {
    id: "win-init",
    title: "滑动窗口：初始化",
    description: "找最大连续子数组和（长度≤3），窗口从左端开始扩展。",
    bullets: ["L=0, R=0", "窗口和 = 2"],
    active: "window",
    phase: 0,
  },
  {
    id: "win-expand",
    title: "滑动窗口：扩展",
    description: "右指针右移扩展窗口，累加元素。",
    bullets: ["R++ 直到窗口长度=3", "sum = 2+1+5 = 8"],
    active: "window",
    phase: 1,
  },
  {
    id: "win-slide",
    title: "滑动窗口：滑动",
    description: "窗口满后，左右同时右移，维护窗口大小。",
    bullets: ["L++, R++ → [1,5,1] sum=7", "继续 → [5,1,3] sum=9"],
    active: "window",
    phase: 2,
  },
  {
    id: "win-max",
    title: "滑动窗口：最大值",
    description: "记录滑动过程中的最大窗口和。",
    bullets: ["[3,5,2] sum=10, [5,2,8] sum=15", "max = 15"],
    active: "window",
    phase: 3,
  },
  {
    id: "fs-init",
    title: "快慢指针：初始化",
    description: "检测链表是否有环，快指针每次走2步，慢指针走1步。",
    bullets: ["slow = head", "fast = head"],
    active: "fast-slow",
    phase: 0,
  },
  {
    id: "fs-move",
    title: "快慢指针：移动",
    description: "快指针追赶慢指针，若有环必相遇。",
    bullets: ["slow = slow.next", "fast = fast.next.next"],
    active: "fast-slow",
    phase: 1,
  },
  {
    id: "fs-chase",
    title: "快慢指针：追赶",
    description: "快指针在环内追赶慢指针。",
    bullets: ["每轮距离缩小1", "环长度为 C，最多 C 轮相遇"],
    active: "fast-slow",
    phase: 2,
  },
  {
    id: "fs-meet",
    title: "快慢指针：相遇",
    description: "快慢指针在环内相遇，证明存在环。",
    bullets: ["相遇点到入口距离 = 头到入口距离", "可进一步找环入口"],
    active: "fast-slow",
    phase: 3,
  },
];

// ── Two Sum data ──
const twoArr = [1, 3, 5, 7, 9, 11, 13];
const twoSteps = [
  { l: 0, r: 6, sum: 14, cmp: "=" },
  { l: 0, r: 4, sum: 10, cmp: "<" },
  { l: 1, r: 6, sum: 16, cmp: ">" },
  { l: 1, r: 5, sum: 14, cmp: "=" },
];

// ── Sliding Window data ──
const winArr = [2, 1, 5, 1, 3, 5, 2, 8];
const winSteps = [
  { l: 0, r: 0, sum: 2, max: 2 },
  { l: 0, r: 2, sum: 8, max: 8 },
  { l: 2, r: 4, sum: 9, max: 9 },
  { l: 5, r: 7, sum: 15, max: 15 },
];

// ── Fast-Slow data: linked list with cycle ──
// Nodes: 1→2→3→4→5→6→3 (cycle at node 3)
const fsNodes = [
  { id: 1, x: 40,  y: 70 },
  { id: 2, x: 120, y: 70 },
  { id: 3, x: 200, y: 70 },
  { id: 4, x: 280, y: 70 },
  { id: 5, x: 280, y: 140 },
  { id: 6, x: 200, y: 140 },
];
// next pointers: 0→1→2→3→4→5→2(cycle back to node 3)
const fsEdges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,2]];
const fsSteps = [
  { slow: 0, fast: 0 },
  { slow: 1, fast: 2 },
  { slow: 2, fast: 4 },
  { slow: 3, fast: 2 }, // fast wrapped around
];

// SVG layout constants
const CELL_W = 56, CELL_H = 44, CELL_GAP = 8, PAD_X = 20, PAD_Y = 50;

function cellX(i, len) {
  const totalW = len * CELL_W + (len - 1) * CELL_GAP;
  const startX = (560 - totalW) / 2;
  return startX + i * (CELL_W + CELL_GAP);
}

const principles = [
  {
    title: "对撞指针",
    detail: "两端向中间收缩，利用有序性剪枝。",
    points: ["时间 O(n)，空间 O(1)", "适合有序数组两数之和、三数之和", "每步排除一个不可能的元素"],
  },
  {
    title: "滑动窗口",
    detail: "维护一个连续子区间，动态调整左右边界。",
    points: ["时间 O(n)，每个元素最多进出窗口各一次", "适合最大/最小子数组、无重复子串", "窗口内维护状态（和、计数、哈希表）"],
  },
  {
    title: "快慢指针",
    detail: "不同速度遍历，用于环检测和中点查找。",
    points: ["Floyd 判圈：快2慢1，有环必相遇", "找中点：快到尾时慢在中间", "找环入口：相遇后重置一个指针到头"],
  },
];

export default function AlgoTwoPointers() {
  return (
    <TopicShell
      eyebrow="算法动画"
      title="双指针与滑动窗口"
      subtitle="对撞指针、滑动窗口与快慢指针的核心遍历过程。"
      steps={steps}
      panel={[
        { title: "核心思想", detail: "用指针移动代替嵌套循环，O(n²) → O(n)。" },
        { title: "适用场景", detail: "有序数组、子串问题、链表环检测。" },
      ]}
      principles={principles}
      principlesIntro="三种双指针策略的核心原理与典型应用。"
      flow={["对撞指针两端收缩", "滑动窗口动态维护区间", "快慢指针速度差检测环"]}
      diagramClass="tp-diagram"
      renderDiagram={(step) => {
        const mode = step.active;
        const phase = step.phase;

        if (mode === "two-sum") {
          const s = twoSteps[phase];
          return (
            <div className="tp-scene">
              <svg className="tp-svg" viewBox="0 0 560 160" preserveAspectRatio="xMidYMid meet">
                {/* Target label */}
                <text x={280} y={18} className="tp-target">target = 14</text>

                {/* Array cells */}
                {twoArr.map((v, i) => {
                  const x = cellX(i, twoArr.length);
                  const inRange = i >= s.l && i <= s.r;
                  const isPtr = i === s.l || i === s.r;
                  const found = s.cmp === "=" && isPtr;
                  return (
                    <g key={i}>
                      <rect
                        x={x} y={PAD_Y} width={CELL_W} height={CELL_H} rx={10}
                        className={`tp-cell ${inRange ? "tp-cell--range" : ""} ${found ? "tp-cell--found" : ""}`}
                      />
                      <text x={x + CELL_W / 2} y={PAD_Y + 28} className={`tp-val ${found ? "tp-val--found" : ""}`}>{v}</text>
                      <text x={x + CELL_W / 2} y={PAD_Y + CELL_H + 14} className="tp-idx">{i}</text>
                    </g>
                  );
                })}

                {/* L pointer */}
                <g className="tp-ptr tp-ptr--l" style={{ "--ptr-x": cellX(s.l, twoArr.length) + CELL_W / 2 }}>
                  <circle cx={cellX(s.l, twoArr.length) + CELL_W / 2} cy={PAD_Y - 16} r={12} className="tp-ptr__circle tp-ptr__circle--l" />
                  <text x={cellX(s.l, twoArr.length) + CELL_W / 2} y={PAD_Y - 12} className="tp-ptr__label">L</text>
                </g>

                {/* R pointer */}
                <g className="tp-ptr tp-ptr--r" style={{ "--ptr-x": cellX(s.r, twoArr.length) + CELL_W / 2 }}>
                  <circle cx={cellX(s.r, twoArr.length) + CELL_W / 2} cy={PAD_Y - 16} r={12} className="tp-ptr__circle tp-ptr__circle--r" />
                  <text x={cellX(s.r, twoArr.length) + CELL_W / 2} y={PAD_Y - 12} className="tp-ptr__label">R</text>
                </g>

                {/* Sum display */}
                <text x={280} y={PAD_Y + CELL_H + 38} className={`tp-sum ${s.cmp === "=" ? "tp-sum--hit" : s.cmp === "<" ? "tp-sum--low" : "tp-sum--high"}`}>
                  {twoArr[s.l]} + {twoArr[s.r]} = {s.sum} {s.cmp === "=" ? "✓" : s.cmp === "<" ? "< 14 → L++" : "> 14 → R--"}
                </text>
              </svg>

              {/* State panel */}
              <div className="tp-ds tp-ds--two">
                <span className="tp-ds__label">操作</span>
                <div className="tp-ds__items">
                  {twoSteps.map((ts, i) => (
                    <span key={i} className={`tp-ds__step ${i === phase ? "tp-ds__step--active" : ""} ${i < phase ? "tp-ds__step--past" : ""}`}>
                      [{ts.l},{ts.r}] → {ts.sum} {ts.cmp === "=" ? "✓" : ts.cmp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "window") {
          const s = winSteps[phase];
          return (
            <div className="tp-scene">
              <svg className="tp-svg" viewBox="0 0 560 160" preserveAspectRatio="xMidYMid meet">
                <text x={280} y={18} className="tp-target">最大子数组和（长度≤3）</text>

                {/* Window highlight region */}
                {s.r >= s.l && (
                  <rect
                    x={cellX(s.l, winArr.length) - 4}
                    y={PAD_Y - 4}
                    width={(s.r - s.l + 1) * (CELL_W + CELL_GAP) - CELL_GAP + 8}
                    height={CELL_H + 8}
                    rx={14}
                    className="tp-window-bg"
                  />
                )}

                {/* Array cells */}
                {winArr.map((v, i) => {
                  const x = cellX(i, winArr.length);
                  const inWin = i >= s.l && i <= s.r;
                  return (
                    <g key={i}>
                      <rect
                        x={x} y={PAD_Y} width={CELL_W} height={CELL_H} rx={10}
                        className={`tp-cell ${inWin ? "tp-cell--window" : ""}`}
                      />
                      <text x={x + CELL_W / 2} y={PAD_Y + 28} className={`tp-val ${inWin ? "tp-val--window" : ""}`}>{v}</text>
                      <text x={x + CELL_W / 2} y={PAD_Y + CELL_H + 14} className="tp-idx">{i}</text>
                    </g>
                  );
                })}

                {/* L pointer */}
                <g className="tp-ptr">
                  <circle cx={cellX(s.l, winArr.length) + CELL_W / 2} cy={PAD_Y - 16} r={12} className="tp-ptr__circle tp-ptr__circle--l" />
                  <text x={cellX(s.l, winArr.length) + CELL_W / 2} y={PAD_Y - 12} className="tp-ptr__label">L</text>
                </g>

                {/* R pointer */}
                <g className="tp-ptr">
                  <circle cx={cellX(s.r, winArr.length) + CELL_W / 2} cy={PAD_Y - 16} r={12} className="tp-ptr__circle tp-ptr__circle--r" />
                  <text x={cellX(s.r, winArr.length) + CELL_W / 2} y={PAD_Y - 12} className="tp-ptr__label">R</text>
                </g>

                {/* Sum & max */}
                <text x={280} y={PAD_Y + CELL_H + 38} className={`tp-sum ${s.sum === s.max && phase === 3 ? "tp-sum--hit" : "tp-sum--window"}`}>
                  sum = {s.sum}　　max = {s.max}
                </text>
              </svg>

              <div className="tp-ds tp-ds--win">
                <span className="tp-ds__label">窗口</span>
                <div className="tp-ds__items">
                  {winSteps.map((ws, i) => (
                    <span key={i} className={`tp-ds__step ${i === phase ? "tp-ds__step--active" : ""} ${i < phase ? "tp-ds__step--past" : ""}`}>
                      [{ws.l}..{ws.r}] sum={ws.sum}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "fast-slow") {
          const s = fsSteps[phase];
          const met = phase === 3;
          return (
            <div className="tp-scene">
              <svg className="tp-svg" viewBox="0 0 340 200" preserveAspectRatio="xMidYMid meet">
                {/* Edges */}
                {fsEdges.map(([from, to], i) => {
                  const a = fsNodes[from], b = fsNodes[to];
                  const isCycleBack = from === 5 && to === 2;
                  if (isCycleBack) {
                    // Curved arrow for cycle-back edge
                    return (
                      <path
                        key={i}
                        d={`M${a.x},${a.y} C${a.x - 40},${a.y + 50} ${b.x - 40},${b.y + 50} ${b.x},${b.y}`}
                        className="tp-fs-edge tp-fs-edge--cycle"
                        markerEnd="url(#tp-arrow)"
                      />
                    );
                  }
                  return (
                    <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="tp-fs-edge" markerEnd="url(#tp-arrow)" />
                  );
                })}

                <defs>
                  <marker id="tp-arrow" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
                    <path d="M0,0 L7,2.5 L0,5" fill="rgba(0,0,0,0.3)" />
                  </marker>
                </defs>

                {/* Nodes */}
                {fsNodes.map((n, i) => {
                  const isSlow = i === s.slow;
                  const isFast = i === s.fast;
                  const isBoth = isSlow && isFast;
                  const isCycleEntry = i === 2;
                  return (
                    <g key={n.id}>
                      <circle
                        cx={n.x} cy={n.y} r={20}
                        className={`tp-fs-node ${isBoth && met ? "tp-fs-node--met" : isSlow ? "tp-fs-node--slow" : isFast ? "tp-fs-node--fast" : ""} ${isCycleEntry ? "tp-fs-node--entry" : ""}`}
                      />
                      <text x={n.x} y={n.y + 1} className="tp-fs-label">{n.id}</text>
                      {isCycleEntry && (
                        <text x={n.x} y={n.y - 26} className="tp-fs-entry-badge">环入口</text>
                      )}
                    </g>
                  );
                })}

                {/* Slow pointer indicator */}
                <g>
                  <circle cx={fsNodes[s.slow].x} cy={fsNodes[s.slow].y - 20} r={8} className="tp-fs-indicator tp-fs-indicator--slow">
                    {!met && <animate attributeName="r" values="7;9;7" dur="1.6s" repeatCount="indefinite" />}
                  </circle>
                  <text x={fsNodes[s.slow].x} y={fsNodes[s.slow].y - 17} className="tp-fs-indicator-label">S</text>
                </g>

                {/* Fast pointer indicator */}
                {!(s.slow === s.fast) && (
                  <g>
                    <circle cx={fsNodes[s.fast].x} cy={fsNodes[s.fast].y + 20} r={8} className="tp-fs-indicator tp-fs-indicator--fast">
                      <animate attributeName="r" values="7;9;7" dur="0.8s" repeatCount="indefinite" />
                    </circle>
                    <text x={fsNodes[s.fast].x} y={fsNodes[s.fast].y + 23} className="tp-fs-indicator-label">F</text>
                  </g>
                )}

                {/* Meet flash */}
                {met && (
                  <circle cx={fsNodes[s.slow].x} cy={fsNodes[s.slow].y} r={24} className="tp-fs-meet-ring">
                    <animate attributeName="r" values="22;30;22" dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                )}
              </svg>

              <div className="tp-ds tp-ds--fs">
                <span className="tp-ds__label">位置</span>
                <div className="tp-ds__items">
                  {fsSteps.map((fs, i) => (
                    <span key={i} className={`tp-ds__step ${i === phase ? "tp-ds__step--active" : ""} ${i < phase ? "tp-ds__step--past" : ""}`}>
                      S→{fsNodes[fs.slow].id} F→{fsNodes[fs.fast].id} {i === 3 ? "相遇!" : ""}
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
