import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const segmentTable = [
  { id: "S0", base: "0x0000", limit: "0x0FFF" },
  { id: "S1", base: "0x2000", limit: "0x0FFF" },
  { id: "S2", base: "0x4000", limit: "0x2FFF" },
  { id: "S3", base: "0x7000", limit: "0x1FFF" },
];

const tlbEntries = [
  { page: "0x5", frame: "F3" },
  { page: "0x2", frame: "F0" },
  { page: "0x7", frame: "F2" },
];

const basePageTable = [
  { page: "0x5", frame: "F3", present: true },
  { page: "0x7", frame: "F2", present: true },
  { page: "0x9", frame: "-", present: false },
];

const baseFrames = [
  { id: "F0", page: "P2", status: "warm" },
  { id: "F1", page: "P4", status: "cold", dirty: true },
  { id: "F2", page: "P7", status: "warm" },
  { id: "F3", page: "P5", status: "hot" },
];

const steps = [
  {
    id: "seg-check",
    title: "段表校验",
    description: "逻辑地址先经过段表，检查界限并得到线性地址。",
    logical: "seg=2, offset=0x1200",
    linear: "0x5200",
    page: "0x5",
    offset: "0x200",
    segmentActive: "S2",
    tlbActive: null,
    tlbStatus: null,
    pageActive: null,
    pageFault: false,
    frameActive: null,
    victim: null,
    swap: "无",
    event: "段 2: base 0x4000 + offset 0x1200 = 0x5200",
    cost: 18,
    lru: ["F3", "F0", "F2", "F1"],
    detail: [
      {
        title: "内核动作",
        lines: ["CPU 先查段表，进行界限检查", "通过后得到线性地址 0x5200"],
      },
      {
        title: "Example",
        lines: ["Selector=2, offset=0x1200", "S2: base=0x4000 limit=0x2FFF", "0x4000 + 0x1200 = 0x5200"],
      },
      {
        title: "关键结论",
        lines: ["段表负责保护与定位，页表负责映射"],
      },
    ],
  },
  {
    id: "page-split",
    title: "页号 / 偏移拆分",
    description: "线性地址按 4KB 切分成页号和页内偏移。",
    logical: "seg=2, offset=0x1200",
    linear: "0x5200",
    page: "0x5",
    offset: "0x200",
    segmentActive: "S2",
    tlbActive: null,
    tlbStatus: null,
    pageActive: "0x5",
    pageFault: false,
    frameActive: null,
    victim: null,
    swap: "无",
    event: "0x5200 => page 0x5, offset 0x200",
    cost: 20,
    lru: ["F3", "F0", "F2", "F1"],
    detail: [
      {
        title: "内核动作",
        lines: ["4KB 页大小 = 0x1000", "页号=0x5200 >> 12 = 0x5"],
      },
      {
        title: "Example",
        lines: ["0x5200 / 0x1000 = 0x5", "offset = 0x5200 & 0xFFF = 0x200"],
      },
      {
        title: "关键结论",
        lines: ["页号用于查页表，偏移直接用于物理地址"],
      },
    ],
  },
  {
    id: "tlb-hit",
    title: "TLB 命中",
    description: "TLB 命中后直接得到物理页框，无需走页表。",
    logical: "seg=2, offset=0x1200",
    linear: "0x5200",
    page: "0x5",
    offset: "0x200",
    segmentActive: "S2",
    tlbActive: "0x5",
    tlbStatus: "hit",
    pageActive: "0x5",
    pageFault: false,
    frameActive: "F3",
    victim: null,
    swap: "无",
    event: "TLB hit: P5 -> F3, 物理地址 F3:0x200",
    cost: 10,
    lru: ["F3", "F0", "F2", "F1"],
    detail: [
      {
        title: "内核动作",
        lines: ["TLB 保存最近的页表映射", "命中后跳过页表访问"],
      },
      {
        title: "Example",
        lines: ["TLB[P5]=F3", "PA = F3:0x200"],
      },
      {
        title: "关键结论",
        lines: ["TLB 命中显著降低访问延迟"],
      },
    ],
  },
  {
    id: "tlb-miss",
    title: "TLB 未命中 + 缺页",
    description: "TLB 未命中后走页表，发现目标页不在内存。",
    logical: "seg=2, offset=0x5A80",
    linear: "0x9A80",
    page: "0x9",
    offset: "0xA80",
    segmentActive: "S2",
    tlbActive: "0x9",
    tlbStatus: "miss",
    pageActive: "0x9",
    pageFault: true,
    frameActive: null,
    victim: null,
    swap: "Swap 中存在 P9",
    event: "P9 present=0 -> page fault",
    cost: 65,
    lru: ["F3", "F0", "F2", "F1"],
    detail: [
      {
        title: "内核动作",
        lines: ["TLB miss 触发页表遍历", "页表项 present=0，引发缺页异常"],
      },
      {
        title: "Example",
        lines: ["0x9A80 -> page 0x9", "P9 not present"],
      },
      {
        title: "关键结论",
        lines: ["缺页会触发回收/置换，延迟骤增"],
      },
    ],
  },
  {
    id: "reclaim",
    title: "回收与置换",
    description: "LRU 选择牺牲页，若脏则写回磁盘。",
    logical: "seg=2, offset=0x5A80",
    linear: "0x9A80",
    page: "0x9",
    offset: "0xA80",
    segmentActive: "S2",
    tlbActive: "0x9",
    tlbStatus: "miss",
    pageActive: "0x9",
    pageFault: true,
    frameActive: null,
    victim: "F1",
    swap: "写回脏页 P4",
    event: "LRU 选择 F1 (dirty) -> writeback",
    cost: 80,
    lru: ["F3", "F0", "F2", "F1"],
    detail: [
      {
        title: "内核动作",
        lines: ["回收器扫描页框，按 LRU 淘汰冷页", "脏页必须写回磁盘"],
      },
      {
        title: "Example",
        lines: ["LRU tail=F1 (P4, dirty)", "writeback P4 -> free F1"],
      },
      {
        title: "关键结论",
        lines: ["回收成本取决于脏页比例"],
      },
    ],
  },
  {
    id: "swap-in",
    title: "换入完成",
    description: "将 P9 换入空闲页框并更新页表/TLB。",
    logical: "seg=2, offset=0x5A80",
    linear: "0x9A80",
    page: "0x9",
    offset: "0xA80",
    segmentActive: "S2",
    tlbActive: "0x9",
    tlbStatus: "hit",
    pageActive: "0x9",
    pageFault: false,
    frameActive: "F1",
    victim: null,
    swap: "读入 P9 到 F1",
    event: "P9 -> F1, TLB 填充完成",
    cost: 40,
    lru: ["F1", "F3", "F0", "F2"],
    pageOverrides: {
      "0x9": { frame: "F1", present: true },
    },
    frameOverrides: {
      F1: { page: "P9", dirty: false, status: "warm" },
    },
    detail: [
      {
        title: "内核动作",
        lines: ["缺页处理完成后更新页表 + TLB", "线程继续执行"],
      },
      {
        title: "Example",
        lines: ["P9 loaded -> F1", "TLB[P9]=F1"],
      },
      {
        title: "关键结论",
        lines: ["换入后访问恢复为正常内存速度"],
      },
    ],
  },
];

export default function OsMemoryAlloc() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [playing]);

  const step = steps[stepIndex];

  const handleStepChange = (nextIndex) => {
    setStepIndex(nextIndex);
    setPlaying(false);
  };

  const handlePrev = () => {
    handleStepChange((stepIndex - 1 + steps.length) % steps.length);
  };

  const handleNext = () => {
    handleStepChange((stepIndex + 1) % steps.length);
  };

  const pageTable = useMemo(() => {
    return basePageTable.map((entry) => {
      const override = step.pageOverrides ? step.pageOverrides[entry.page] : null;
      return override ? { ...entry, ...override } : entry;
    });
  }, [step]);

  const frames = useMemo(() => {
    return baseFrames.map((frame) => {
      const override = step.frameOverrides ? step.frameOverrides[frame.id] : null;
      return override ? { ...frame, ...override } : frame;
    });
  }, [step]);

  return (
    <Layout>
      <div className="topic">
        <header className="topic__hero">
          <div>
            <p className="topic__eyebrow">操作系统动画</p>
            <h1>内存回收与段页式</h1>
            <p className="topic__subtitle">
              从段表校验到 TLB/页表访问，再到缺页回收，串起段页式内存管理的完整链路。
            </p>
            <div className="topic__actions">
              <button className="topic__ghost" type="button" onClick={handlePrev}>
                上一步
              </button>
              <button className="topic__primary" type="button" onClick={() => setPlaying((v) => !v)}>
                {playing ? "暂停" : "播放"}
              </button>
              <button className="topic__ghost" type="button" onClick={handleNext}>
                下一步
              </button>
              <Link className="topic__back" to="/map">
                返回导航
              </Link>
            </div>
          </div>
          <div className="topic__panel">
            <div className="topic__card">
              <h3>核心要点</h3>
              <p>段表负责保护与定位，页表负责映射与换入。</p>
              <p>TLB 命中最快，缺页会触发回收与置换。</p>
              <p>回收成本由脏页写回与磁盘 I/O 决定。</p>
            </div>
            <div className="topic__card">
              <h3>当前步骤</h3>
              <div className="mem-step__title">{step.title}</div>
              <p>{step.description}</p>
            </div>
          </div>
        </header>

        <section className="topic__stage">
          <div className="topic__timeline">
            {steps.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`timeline__step ${index === stepIndex ? "is-active" : ""}`}
                onClick={() => handleStepChange(index)}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className="mem-stage">
            <div className="mem-diagram" data-step={step.id}>
              <div className="mem-address">
                <div className="mem-address__block">
                  <strong>逻辑地址</strong>
                  <div className="mem-address__value">{step.logical}</div>
                </div>
                <div className="mem-address__block">
                  <strong>线性地址</strong>
                  <div className="mem-address__value">{step.linear}</div>
                </div>
                <div className="mem-address__block">
                  <strong>页号 / 偏移</strong>
                  <div className="mem-address__value">
                    page {step.page} | off {step.offset}
                  </div>
                </div>
              </div>

              <div className="mem-tables">
                <div className="mem-table mem-table--segment">
                  <div className="mem-table__title">Segment Table</div>
                  {segmentTable.map((row) => (
                    <div
                      key={row.id}
                      className={`mem-entry ${step.segmentActive === row.id ? "is-active" : ""}`}
                    >
                      <span>{row.id}</span>
                      <span>base {row.base}</span>
                      <span>limit {row.limit}</span>
                    </div>
                  ))}
                </div>

                <div className="mem-table mem-table--tlb">
                  <div className="mem-table__title">TLB</div>
                  {tlbEntries.map((row) => (
                    <div
                      key={row.page}
                      className={`mem-entry ${step.tlbActive === row.page ? "is-active" : ""} ${
                        step.tlbActive === row.page && step.tlbStatus === "hit" ? "is-hit" : ""
                      } ${step.tlbActive === row.page && step.tlbStatus === "miss" ? "is-miss" : ""}`}
                    >
                      <span>P{row.page}</span>
                      <span>{"->"} {row.frame}</span>
                      <span>{step.tlbActive === row.page ? step.tlbStatus : ""}</span>
                    </div>
                  ))}
                  {step.tlbStatus === "miss" ? (
                    <div className="mem-entry mem-entry--wide is-miss">P{step.page} not found</div>
                  ) : null}
                </div>

                <div className="mem-table mem-table--page">
                  <div className="mem-table__title">Page Table</div>
                  {pageTable.map((row) => (
                    <div
                      key={row.page}
                      className={`mem-entry ${step.pageActive === row.page ? "is-active" : ""} ${
                        step.pageActive === row.page && !row.present ? "is-miss" : ""
                      }`}
                    >
                      <span>P{row.page}</span>
                      <span>{row.present ? row.frame : "not present"}</span>
                      <span>{row.present ? "PRESENT" : "FAULT"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mem-frames">
                <div className="mem-table__title">Physical Frames</div>
                <div className="mem-frames__grid">
                  {frames.map((frame) => (
                    <div
                      key={frame.id}
                      className={`mem-frame mem-frame--${frame.status} ${
                        step.frameActive === frame.id ? "is-active" : ""
                      } ${step.victim === frame.id ? "is-victim" : ""} ${
                        frame.dirty ? "is-dirty" : ""
                      }`}
                    >
                      <span>{frame.id}</span>
                      <span>{frame.page}</span>
                      <span>{frame.dirty ? "dirty" : "clean"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mem-lru">
                <div className="mem-table__title">LRU Queue</div>
                <div className="mem-lru__list">
                  {step.lru.map((item) => (
                    <span key={item} className={`mem-lru__item ${step.victim === item ? "is-victim" : ""}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mem-swap">
                <div className="mem-table__title">Swap / Disk</div>
                <div className="mem-swap__value">{step.swap}</div>
              </div>

              <div className="mem-cost">
                <div className="mem-table__title">访问代价</div>
                <div className="mem-cost__bar">
                  <span style={{ width: `${step.cost}%` }} />
                </div>
                <div className="mem-cost__label">{step.cost < 30 ? "低" : step.cost < 60 ? "中" : "高"}</div>
              </div>

              <div className="mem-event">{step.event}</div>
            </div>

          <div className="mem-detail">
            <div className="mem-detail__card">
              <div className="mem-detail__title">{step.title}</div>
              <p className="mem-detail__summary">{step.description}</p>
            </div>
            {step.detail.map((section) => (
              <div key={section.title} className="mem-detail__section">
                <h4>{section.title}</h4>
                <div className="mem-detail__lines">
                  {section.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
              </div>
            ))}
            <div className="mem-principles os-principles">
              <div className="os-principles__card">
                <span className="os-principles__eyebrow">原理拆解</span>
                <h3 className="os-principles__title">段页式关键链路</h3>
                <p className="os-principles__desc">
                  段表负责权限与边界校验，页表负责虚实映射；TLB 缓存最近映射，
                  缺页时触发回收与置换。
                </p>
                <div className="os-principles__list">
                  <div className="os-principles__item">
                    <strong>段表校验</strong>
                    <span>越界直接异常，合法后得到线性地址。</span>
                  </div>
                  <div className="os-principles__item">
                    <strong>页表映射</strong>
                    <span>VPN → PFN，未命中则进入缺页路径。</span>
                  </div>
                  <div className="os-principles__item">
                    <strong>回收置换</strong>
                    <span>LRU 选择牺牲页，脏页需写回磁盘。</span>
                  </div>
                </div>
              </div>
              <div className="os-principles__card">
                <h3 className="os-principles__title">示例拆解</h3>
                <p className="os-principles__desc">沿用当前示例地址 0x9A80 的换入路径。</p>
                <div className="os-principles__example">
                  <span>seg=2, offset=0x5A80 → linear 0x9A80</span>
                  <span>page 0x9 present=0 → page fault</span>
                  <span>LRU 选 F1(脏) → writeback → load P9</span>
                </div>
              </div>
            </div>
          </div>
          </div>

          <div className="topic__flow">
            <div className="flow__step">段表负责访问控制与线性地址定位</div>
            <div className="flow__step">TLB 命中最快，miss 需访问页表</div>
            <div className="flow__step">缺页触发回收/置换，I/O 成本最高</div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
