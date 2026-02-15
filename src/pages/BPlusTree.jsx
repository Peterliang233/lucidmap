import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const makeNode = (id, keys, role, extra = {}) => ({
  id,
  keys,
  role,
  ...extra,
});

const baseTree = {
  levels: [
    [makeNode("root", "17 | 35", "root")],
    [
      makeNode("i1", "5 | 12", "internal"),
      makeNode("i2", "21 | 29", "internal"),
      makeNode("i3", "41 | 52", "internal"),
    ],
    [
      makeNode("l1", "1, 3, 4", "leaf"),
      makeNode("l2", "6, 9, 11", "leaf"),
      makeNode("l3", "18, 19, 20", "leaf"),
      makeNode("l4", "23, 26, 28", "leaf"),
      makeNode("l5", "36, 40", "leaf"),
      makeNode("l6", "45, 48, 50", "leaf"),
      makeNode("l7", "55, 60", "leaf"),
    ],
  ],
};

const steps = [
  {
    id: "search-path",
    title: "1. 定位叶子节点",
    description: "查找键 27，从根节点一路下探到目标叶子。",
    bullets: [
      "根节点 17 | 35 判断目标在中间区间。",
      "进入内部节点 21 | 29。",
      "到达叶子节点 23, 26, 28。",
    ],
    tree: baseTree,
    highlight: ["root", "i2", "l4"],
    focus: "search",
  },
  {
    id: "insert-overflow",
    title: "2. 叶子插入并溢出",
    description: "将 27 插入叶子节点后触发容量溢出。",
    bullets: [
      "叶子节点容量设为 3，插入后变为 4 个键。",
      "溢出的叶子需要分裂。",
    ],
    tree: {
      levels: [
        ...baseTree.levels.slice(0, 2),
        [
          baseTree.levels[2][0],
          baseTree.levels[2][1],
          baseTree.levels[2][2],
          makeNode("l4", "23, 26, 27, 28", "leaf", { overflow: true }),
          baseTree.levels[2][4],
          baseTree.levels[2][5],
          baseTree.levels[2][6],
        ],
      ],
    },
    highlight: ["l4"],
    focus: "insert",
  },
  {
    id: "leaf-split",
    title: "3. 叶子分裂",
    description: "溢出节点拆分为两个叶子，并准备向上提升分隔键。",
    bullets: [
      "左侧保留 23, 26。",
      "右侧新叶子存放 27, 28。",
      "分隔键 27 将被提升到父节点。",
    ],
    tree: {
      levels: [
        ...baseTree.levels.slice(0, 2),
        [
          baseTree.levels[2][0],
          baseTree.levels[2][1],
          baseTree.levels[2][2],
          makeNode("l4", "23, 26", "leaf"),
          makeNode("l4b", "27, 28", "leaf", { isNew: true }),
          baseTree.levels[2][4],
          baseTree.levels[2][5],
          baseTree.levels[2][6],
        ],
      ],
    },
    highlight: ["l4", "l4b"],
    focus: "split",
    promote: "27",
  },
  {
    id: "parent-update",
    title: "4. 父节点插入分隔键",
    description: "父节点插入提升的 27，索引层完成更新。",
    bullets: [
      "内部节点 21 | 29 更新为 21 | 27 | 29。",
      "索引键只作为路标，真实数据仍在叶子。",
    ],
    tree: {
      levels: [
        [baseTree.levels[0][0]],
        [
          baseTree.levels[1][0],
          makeNode("i2", "21 | 27 | 29", "internal", { isNew: true }),
          baseTree.levels[1][2],
        ],
        [
          baseTree.levels[2][0],
          baseTree.levels[2][1],
          baseTree.levels[2][2],
          makeNode("l4", "23, 26", "leaf"),
          makeNode("l4b", "27, 28", "leaf"),
          baseTree.levels[2][4],
          baseTree.levels[2][5],
          baseTree.levels[2][6],
        ],
      ],
    },
    highlight: ["i2", "l4b"],
    focus: "promote",
  },
  {
    id: "leaf-chain",
    title: "5. 叶子链表与范围查询",
    description: "叶子节点保持有序链表，范围扫描只需一次定位。",
    bullets: [
      "定位到 27 后，可沿链表快速获取相邻键。",
      "范围查询无需回到上层索引。",
    ],
    tree: {
      levels: [
        [baseTree.levels[0][0]],
        [
          baseTree.levels[1][0],
          makeNode("i2", "21 | 27 | 29", "internal"),
          baseTree.levels[1][2],
        ],
        [
          baseTree.levels[2][0],
          baseTree.levels[2][1],
          baseTree.levels[2][2],
          makeNode("l4", "23, 26", "leaf"),
          makeNode("l4b", "27, 28", "leaf"),
          baseTree.levels[2][4],
          baseTree.levels[2][5],
          baseTree.levels[2][6],
        ],
      ],
    },
    highlight: ["l4", "l4b", "l5"],
    focus: "range",
  },
];

const principles = [
  {
    title: "索引 vs 数据",
    detail: "内部节点只存索引键，真实数据都落在叶子节点。",
  },
  {
    title: "局部性",
    detail: "叶子节点链表让范围查询变成顺序读。",
  },
  {
    title: "稳定高度",
    detail: "分裂与提升保持树高低、路径短。",
  },
];

export default function BPlusTreePage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [playing]);

  const step = steps[stepIndex];

  const treeLevels = useMemo(() => step.tree.levels, [step]);

  const handlePrev = () => {
    setStepIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const handleNext = () => {
    setStepIndex((prev) => (prev + 1) % steps.length);
  };

  return (
    <Layout>
      <div className="bplus">

      <header className="bplus__hero">
        <div>
          <p className="bplus__eyebrow">索引结构动画演示</p>
          <h1>B+ 树索引原理</h1>
          <p className="bplus__subtitle">
            通过“插入 27”的完整路径，展示搜索、叶子分裂、父节点更新与范围扫描。
          </p>
          <div className="bplus__actions">
            <button type="button" className="bplus__button" onClick={() => setPlaying((v) => !v)}>
              {playing ? "暂停" : "播放"}
            </button>
            <button type="button" className="bplus__ghost" onClick={handlePrev}>
              上一步
            </button>
            <button type="button" className="bplus__ghost" onClick={handleNext}>
              下一步
            </button>
            <Link className="bplus__back" to="/map">
              返回导航
            </Link>
          </div>
        </div>

        <div className="bplus__info">
          <div className="bplus__card">
            <h3>演示设定</h3>
            <p>叶子节点容量为 3，内部节点容量为 3。</p>
            <p>插入键：<strong>27</strong></p>
          </div>
          {principles.map((item) => (
            <div key={item.title} className="bplus__card">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="bplus__stage">
        <div className="bplus__timeline">
          {steps.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`timeline__step ${stepIndex === index ? "is-active" : ""}`}
              onClick={() => setStepIndex(index)}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="bplus__step">
          <div>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </div>
          <ul>
            {step.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className="bplus__legend">
          <div>
            <span className="legend__dot" /> 查询关键字 <strong>27</strong>
          </div>
          <div>
            <span className="legend__line" /> 叶子链表
          </div>
        </div>

        <div className="bplus__tree" key={step.id} data-focus={step.focus}>
          {step.promote && (
            <div className="bplus__promote">提升键 {step.promote}</div>
          )}

          {treeLevels.map((level, levelIndex) => (
            <div key={`level-${levelIndex}`} className={`level level--${levelIndex + 1}`}>
              {level.map((node, nodeIndex) => (
                <div
                  key={node.id}
                  className={[
                    "node",
                    `node--${node.role}`,
                    step.highlight?.includes(node.id) ? "node--highlight" : "",
                    node.overflow ? "node--overflow" : "",
                    node.isNew ? "node--new" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ animationDelay: `${0.1 + nodeIndex * 0.12 + levelIndex * 0.18}s` }}
                >
                  <span>{node.keys}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="bplus__flow">
          <div className="flow__step">路径高亮展示查找过程</div>
          <div className="flow__step">叶子节点分裂后保持有序链表</div>
          <div className="flow__step">分隔键上提更新父节点索引</div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
