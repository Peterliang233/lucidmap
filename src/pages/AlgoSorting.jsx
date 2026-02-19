import TopicShell from "../components/TopicShell.jsx";

// ── Example array: [38, 27, 43, 3, 9, 82, 10] ──
const ARR = [38, 27, 43, 3, 9, 82, 10];
const MAX_VAL = 82;

const steps = [
  {
    id: "bubble-pass", title: "冒泡排序：逐轮冒泡",
    description: "相邻元素两两比较，每轮将最大值冒泡到末尾。",
    bullets: ["比较相邻元素，逆序则交换", "每轮确定一个最大值位置", "时间 O(n²)，稳定排序"],
    active: "bubble", phase: 0,
  },
  {
    id: "bubble-done", title: "冒泡排序：完成",
    description: "多轮冒泡后数组有序，可提前终止优化。",
    bullets: ["无交换则提前结束", "最好 O(n)，最坏 O(n²)", "适合小规模或近乎有序数据"],
    active: "bubble", phase: 1,
  },
  {
    id: "merge-divide", title: "归并排序：分治拆分",
    description: "递归将数组对半拆分，直到每组只有一个元素。",
    bullets: ["分治策略：先拆后合", "递归深度 O(log n)", "每层拆分 O(1)"],
    active: "merge", phase: 0,
  },
  {
    id: "merge-combine", title: "归并排序：合并有序",
    description: "将两个有序子数组合并为一个有序数组。",
    bullets: ["双指针归并", "时间 O(n log n)，稳定", "需要 O(n) 额外空间"],
    active: "merge", phase: 1,
  },
  {
    id: "quick-partition", title: "快速排序：分区",
    description: "选取 pivot，将小于 pivot 的放左边，大于的放右边。",
    bullets: ["选 pivot（如末尾元素）", "partition 划分左右", "pivot 归位"],
    active: "quick", phase: 0,
  },
  {
    id: "quick-recurse", title: "快速排序：递归",
    description: "对 pivot 左右两部分递归排序。",
    bullets: ["平均 O(n log n)", "最坏 O(n²)（已排序）", "随机化 pivot 优化"],
    active: "quick", phase: 1,
  },
  {
    id: "heap-build", title: "堆排序：建堆",
    description: "从最后一个非叶节点开始，自底向上调整为最大堆。",
    bullets: ["完全二叉树存储在数组", "sift-down 调整堆性质", "建堆 O(n)"],
    active: "heap", phase: 0,
  },
  {
    id: "heap-extract", title: "堆排序：逐步取出",
    description: "堆顶（最大值）与末尾交换，缩小堆范围并调整。",
    bullets: ["swap(0, n-1) → 最大值归位", "sift-down 恢复堆", "重复 n-1 次，O(n log n)"],
    active: "heap", phase: 1,
  },
];

// ── Bubble sort snapshots ──
const bubbleSnapshots = [
  // phase 0: mid-pass — showing comparisons
  { arr: [27, 38, 3, 9, 43, 10, 82], comparing: [0, 1], sorted: [6] },
  // phase 1: done
  { arr: [3, 9, 10, 27, 38, 43, 82], comparing: [], sorted: [0, 1, 2, 3, 4, 5, 6] },
];

// ── Merge sort snapshots ──
const mergeSnapshots = [
  // phase 0: divide — show groups
  { arr: [38, 27, 43, 3, 9, 82, 10], groups: [[0, 1, 2, 3], [4, 5, 6]], phase: "divide" },
  // phase 1: merged result
  { arr: [3, 9, 10, 27, 38, 43, 82], groups: [[0, 1, 2, 3, 4, 5, 6]], phase: "merged" },
];

// ── Quick sort snapshots ──
const quickSnapshots = [
  // phase 0: partitioning with pivot=10 (index 6)
  { arr: [38, 27, 43, 3, 9, 82, 10], pivot: 6, left: [3, 4], right: [0, 1, 2, 5], pivotVal: 10 },
  // phase 1: after partition + recurse
  { arr: [3, 9, 10, 27, 38, 43, 82], pivot: -1, left: [], right: [], pivotVal: null },
];

// ── Heap sort snapshots ──
const heapSnapshots = [
  // phase 0: max-heap built
  { arr: [82, 27, 43, 3, 9, 38, 10], heapSize: 7, swapping: [0, 6] },
  // phase 1: extracting
  { arr: [3, 9, 10, 27, 38, 43, 82], heapSize: 0, swapping: [] },
];

// ── C++ code snippets ──
const cppCode = {
  bubble: `void bubbleSort(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n-1-i; j++)
            if (a[j] > a[j+1]) {
                swap(a[j], a[j+1]);
                swapped = true;
            }
        if (!swapped) break;
    }
}`,
  merge: `void merge(vector<int>& a, int l, int m, int r) {
    vector<int> tmp(a.begin()+l, a.begin()+m+1);
    int i = 0, j = m+1, k = l;
    while (i < tmp.size() && j <= r)
        a[k++] = tmp[i] <= a[j] ? tmp[i++] : a[j++];
    while (i < tmp.size()) a[k++] = tmp[i++];
}
void mergeSort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m+1, r);
    merge(a, l, m, r);
}`,
  quick: `int partition(vector<int>& a, int l, int r) {
    int pivot = a[r], i = l;
    for (int j = l; j < r; j++)
        if (a[j] <= pivot) swap(a[i++], a[j]);
    swap(a[i], a[r]);
    return i;
}
void quickSort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int p = partition(a, l, r);
    quickSort(a, l, p - 1);
    quickSort(a, p + 1, r);
}`,
  heap: `void siftDown(vector<int>& a, int n, int i) {
    int largest = i;
    int l = 2*i+1, r = 2*i+2;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest != i) {
        swap(a[i], a[largest]);
        siftDown(a, n, largest);
    }
}
void heapSort(vector<int>& a) {
    int n = a.size();
    for (int i = n/2-1; i >= 0; i--) siftDown(a,n,i);
    for (int i = n-1; i > 0; i--) {
        swap(a[0], a[i]);
        siftDown(a, i, 0);
    }
}`,
};

// ── Color map ──
const colors = {
  bubble: { main: "42,111,107", accent: "210,100,42" },
  merge:  { main: "76,120,168", accent: "140,80,180" },
  quick:  { main: "210,100,42", accent: "42,111,107" },
  heap:   { main: "140,80,180", accent: "210,100,42" },
};

// ── SVG bar chart renderer ──
const SVG_W = 460, SVG_H = 160, BAR_Y = 140, BAR_GAP = 8;

function renderBars(arr, opts = {}) {
  const { comparing = [], sorted = [], pivot = -1, left = [], right = [], groups, heapSize, swapping = [], mode } = opts;
  const n = arr.length;
  const barW = (SVG_W - 60 - (n - 1) * BAR_GAP) / n;
  const barX0 = 30;
  const c = colors[mode] || colors.bubble;

  return arr.map((v, i) => {
    const x = barX0 + i * (barW + BAR_GAP);
    const h = (v / MAX_VAL) * 100 + 10;
    const y = BAR_Y - h;

    let cls = "sort-bar";
    let fill = `rgba(${c.main},0.18)`;
    let stroke = `rgba(${c.main},0.35)`;

    if (sorted.includes(i)) {
      cls += " sort-bar--sorted";
      fill = `rgba(56,142,60,0.15)`;
      stroke = `rgba(56,142,60,0.4)`;
    } else if (comparing.includes(i)) {
      cls += " sort-bar--comparing";
      fill = `rgba(${c.accent},0.2)`;
      stroke = `rgba(${c.accent},0.6)`;
    } else if (i === pivot) {
      cls += " sort-bar--pivot";
      fill = `rgba(180,60,60,0.15)`;
      stroke = `rgba(180,60,60,0.5)`;
    } else if (left.includes(i)) {
      cls += " sort-bar--left";
      fill = `rgba(42,111,107,0.15)`;
      stroke = `rgba(42,111,107,0.4)`;
    } else if (right.includes(i)) {
      cls += " sort-bar--right";
      fill = `rgba(210,100,42,0.12)`;
      stroke = `rgba(210,100,42,0.35)`;
    } else if (swapping.includes(i)) {
      cls += " sort-bar--swap";
      fill = `rgba(${c.accent},0.2)`;
      stroke = `rgba(${c.accent},0.6)`;
    }

    // Merge groups coloring
    if (groups && groups.length === 2) {
      if (groups[0].includes(i)) {
        fill = `rgba(76,120,168,0.18)`;
        stroke = `rgba(76,120,168,0.45)`;
      } else if (groups[1].includes(i)) {
        fill = `rgba(140,80,180,0.18)`;
        stroke = `rgba(140,80,180,0.45)`;
      }
    }

    // Heap: items beyond heapSize are sorted
    if (typeof heapSize === "number" && heapSize > 0 && i >= heapSize) {
      fill = `rgba(56,142,60,0.15)`;
      stroke = `rgba(56,142,60,0.4)`;
      cls += " sort-bar--sorted";
    }

    return (
      <g key={i}>
        <rect x={x} y={y} width={barW} height={h} rx={4}
          className={cls} style={{ fill, stroke, "--bar-i": i }} />
        <text x={x + barW / 2} y={BAR_Y + 14} className="sort-bar__val">{v}</text>
        {i === pivot && <text x={x + barW / 2} y={y - 6} className="sort-bar__tag sort-bar__tag--pivot">pivot</text>}
        {comparing.includes(i) && <text x={x + barW / 2} y={y - 6} className="sort-bar__tag sort-bar__tag--cmp">比较</text>}
      </g>
    );
  });
}

const principles = [
  { title: "冒泡排序", detail: "简单直观，适合教学和小数据量。", points: ["时间 O(n²)，空间 O(1)", "稳定排序", "提前终止优化"] },
  { title: "归并排序", detail: "分治思想，稳定且时间复杂度最优。", points: ["时间 O(n log n)，空间 O(n)", "稳定排序", "适合链表和外部排序"] },
  { title: "快速排序", detail: "实践中最快的通用排序算法。", points: ["平均 O(n log n)，最坏 O(n²)", "不稳定排序", "随机化 pivot 避免最坏情况"] },
  { title: "堆排序", detail: "原地排序，无需额外空间。", points: ["时间 O(n log n)，空间 O(1)", "不稳定排序", "适合 Top-K 问题"] },
];

export default function AlgoSorting() {
  return (
    <TopicShell
      eyebrow="算法动画"
      title="排序算法"
      subtitle="冒泡、归并、快排、堆排的核心过程与 C++ 实现。"
      steps={steps}
      panel={[
        { title: "示例数组", detail: "[38, 27, 43, 3, 9, 82, 10]" },
        { title: "对比维度", detail: "时间、空间、稳定性。" },
      ]}
      principles={principles}
      principlesIntro="四种排序算法的核心原理、复杂度与适用场景对比。"
      flow={["冒泡 O(n²) 稳定", "归并 O(n log n) 稳定", "快排 O(n log n) 最快", "堆排 O(n log n) 原地"]}
      diagramClass="sort-diagram"
      renderDiagram={(step) => {
        const mode = step.active;
        const phase = step.phase;
        const c = colors[mode];

        let snap, title;
        if (mode === "bubble") {
          snap = bubbleSnapshots[phase];
          title = phase === 0 ? "Bubble Sort — 比较交换" : "Bubble Sort — 排序完成";
        } else if (mode === "merge") {
          snap = mergeSnapshots[phase];
          title = phase === 0 ? "Merge Sort — 分治拆分" : "Merge Sort — 合并完成";
        } else if (mode === "quick") {
          snap = quickSnapshots[phase];
          title = phase === 0 ? "Quick Sort — Partition" : "Quick Sort — 排序完成";
        } else {
          snap = heapSnapshots[phase];
          title = phase === 0 ? "Heap Sort — 建最大堆" : "Heap Sort — 排序完成";
        }

        return (
          <div className="sort-scene">
            {/* Bar chart SVG */}
            <svg className="sort-svg" viewBox={`0 0 ${SVG_W} ${SVG_H + 24}`} preserveAspectRatio="xMidYMid meet">
              <text x={SVG_W / 2} y={16} className="sort-title">{title}</text>
              {renderBars(snap.arr, { ...snap, mode })}

              {/* Merge divide brackets */}
              {mode === "merge" && phase === 0 && snap.groups.length === 2 && (
                <>
                  <line x1={30} y1={BAR_Y + 24} x2={30 + snap.groups[0].length * ((SVG_W - 60 - 6 * BAR_GAP) / 7 + BAR_GAP) - BAR_GAP} y2={BAR_Y + 24}
                    stroke="rgba(76,120,168,0.4)" strokeWidth={1.5} strokeLinecap="round" />
                  <line x1={30 + snap.groups[1][0] * ((SVG_W - 60 - 6 * BAR_GAP) / 7 + BAR_GAP)} y1={BAR_Y + 24}
                    x2={30 + (snap.groups[1][snap.groups[1].length - 1] + 1) * ((SVG_W - 60 - 6 * BAR_GAP) / 7 + BAR_GAP) - BAR_GAP} y2={BAR_Y + 24}
                    stroke="rgba(140,80,180,0.4)" strokeWidth={1.5} strokeLinecap="round" />
                </>
              )}

              {/* Heap tree overlay for build phase */}
              {mode === "heap" && phase === 0 && (() => {
                const treeNodes = snap.arr.slice(0, snap.heapSize);
                const TY = 30, TX = SVG_W / 2;
                const levelGap = 28, nodeR = 11;
                const positions = [];
                treeNodes.forEach((v, i) => {
                  const level = Math.floor(Math.log2(i + 1));
                  const posInLevel = i - (Math.pow(2, level) - 1);
                  const levelCount = Math.min(Math.pow(2, level), treeNodes.length - (Math.pow(2, level) - 1));
                  const spread = 180 / Math.pow(2, level);
                  const x = TX + (posInLevel - (levelCount - 1) / 2) * spread;
                  const y = TY + level * levelGap;
                  positions.push({ x, y, v });
                });
                return (
                  <g className="sort-heap-tree" opacity={0.6}>
                    {positions.map((p, i) => {
                      if (i === 0) return null;
                      const parentIdx = Math.floor((i - 1) / 2);
                      const parent = positions[parentIdx];
                      return <line key={`e${i}`} x1={parent.x} y1={parent.y + nodeR} x2={p.x} y2={p.y - nodeR}
                        stroke="rgba(140,80,180,0.2)" strokeWidth={0.8} />;
                    })}
                    {positions.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r={nodeR} className="sort-heap-node" />
                        <text x={p.x} y={p.y + 3.5} className="sort-heap-text">{p.v}</text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>

            {/* C++ code panel */}
            <div className="sort-code">
              <div className="sort-code__header">
                <span className="sort-code__lang">C++</span>
                <span className="sort-code__algo" style={{ color: `rgba(${c.main},0.8)` }}>
                  {mode === "bubble" ? "Bubble Sort" : mode === "merge" ? "Merge Sort" : mode === "quick" ? "Quick Sort" : "Heap Sort"}
                </span>
              </div>
              <pre className="sort-code__pre"><code>{cppCode[mode]}</code></pre>
            </div>

            {/* State panel */}
            <div className={`sort-ds sort-ds--${mode}`}>
              <span className="sort-ds__label">
                {mode === "bubble" ? "冒泡" : mode === "merge" ? "归并" : mode === "quick" ? "快排" : "堆排"}
              </span>
              <div className="sort-ds__items">
                {(mode === "bubble" ? ["逐轮冒泡", "排序完成"] :
                  mode === "merge" ? ["分治拆分", "合并有序"] :
                  mode === "quick" ? ["Partition", "递归完成"] :
                  ["建最大堆", "逐步取出"]).map((t, i) => (
                  <span key={i} className={`sort-ds__step ${i === phase ? "sort-ds__step--active" : ""} ${i < phase ? "sort-ds__step--past" : ""}`}>{t}</span>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="sort-legend">
              {mode === "bubble" && <>
                <span className="sort-legend__item sort-legend__item--cmp">比较中</span>
                <span className="sort-legend__item sort-legend__item--sorted">已排序</span>
              </>}
              {mode === "merge" && <>
                <span className="sort-legend__item sort-legend__item--left">左半部分</span>
                <span className="sort-legend__item sort-legend__item--right">右半部分</span>
                <span className="sort-legend__item sort-legend__item--sorted">已合并</span>
              </>}
              {mode === "quick" && <>
                <span className="sort-legend__item sort-legend__item--pivot">pivot</span>
                <span className="sort-legend__item sort-legend__item--left">≤ pivot</span>
                <span className="sort-legend__item sort-legend__item--gt">{">"} pivot</span>
              </>}
              {mode === "heap" && <>
                <span className="sort-legend__item sort-legend__item--heap">堆中</span>
                <span className="sort-legend__item sort-legend__item--swap">交换</span>
                <span className="sort-legend__item sort-legend__item--sorted">已排序</span>
              </>}
            </div>
          </div>
        );
      }}
    />
  );
}
