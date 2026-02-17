import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const steps = [
  {
    id: "cpu",
    title: "CPU 发起虚拟地址访问",
    description: "处理器访问虚拟地址，优先命中 TLB。",
    focus: ["cpu", "tlb"],
    example: {
      title: "示例：访问 0x3A:19F0",
      lines: [
        "VA=0x3A:19F0 → VPN=0x3A, Offset=0x19F0",
        "TLB index=2, tag=0x3A (查找中)",
        "若命中可直接给出 PFN",
      ],
    },
  },
  {
    id: "tlb-miss",
    title: "TLB 未命中",
    description: "进入页表查找，触发一次内存访问。",
    focus: ["tlb", "page-table"],
    example: {
      title: "示例：TLB Miss",
      lines: [
        "TLB[set2] tag 不匹配 → miss",
        "读取 PTE[0x3A] (一次内存访问)",
        "PTE: PFN=0x1F, P=1",
      ],
    },
  },
  {
    id: "page-hit",
    title: "页表命中",
    description: "找到物理页帧号，访问内存数据。",
    focus: ["page-table", "ram"],
    example: {
      title: "示例：页表命中",
      lines: [
        "PA=0x1F:19F0 (PFN=0x1F)",
        "访问物理帧 0x1F 获取数据",
        "回填 TLB: VPN 0x3A → PFN 0x1F",
      ],
    },
  },
  {
    id: "page-fault",
    title: "缺页中断",
    description: "页不在内存，从磁盘换入，更新页表与 TLB。",
    focus: ["disk", "page-table", "tlb"],
    example: {
      title: "示例：缺页处理",
      lines: [
        "PTE[0x8E]=disk:5, P=0",
        "缺页中断 → 置换/换入",
        "磁盘 page#5 → PFN 0x22",
        "更新 PTE/TLB",
      ],
    },
  },
];

export default function OsVirtualMemory() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [playing]);

  const step = steps[stepIndex];
  const isFocus = (key) => step.focus.includes(key);
  const showVirt = step.id === "cpu" || step.id === "tlb-miss";
  const showPhys = step.id === "page-hit" || step.id === "page-fault";

  return (
    <Layout>
      <div className="topic">
        <header className="topic__hero">
          <div>
            <p className="topic__eyebrow">操作系统动画</p>
            <h1>虚拟内存与分页</h1>
            <p className="topic__subtitle">展示地址翻译、TLB 命中与缺页中断的完整流程。</p>
            <div className="topic__actions">
              <button
                className="topic__primary"
                type="button"
                onClick={() => setPlaying((v) => !v)}
              >
                {playing ? "暂停" : "播放"}
              </button>
              <Link className="topic__back" to="/map">
                返回导航
              </Link>
            </div>
          </div>
          <div className="topic__panel">
            <div className="topic__card">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            <div className="topic__card">
              <h3>关键术语</h3>
              <p>TLB、页表、缺页中断、换页。</p>
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
                onClick={() => setStepIndex(index)}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className="vm-stage">
            <div className={`vm-diagram mode--${step.id} has-focus`}>
              <div className={`vm-card vm-virt vm-entity ${showVirt ? "is-active" : ""}`}>
                <p className="vm-label">Virtual Address</p>
                <div className="vm-bits">
                  <span className="vm-bit bit--vpn">VPN</span>
                  <span className="vm-bit bit--off">Offset</span>
                </div>
                <p className="vm-note">VPN → 查表</p>
              </div>

              <div className={`vm-card vm-phys vm-entity ${showPhys ? "is-active" : ""}`}>
                <p className="vm-label">Physical Address</p>
                <div className="vm-bits">
                  <span className="vm-bit bit--pfn">PFN</span>
                  <span className="vm-bit bit--off">Offset</span>
                </div>
                <p className="vm-note">PFN + Offset</p>
              </div>

              <div className={`vm-node cpu vm-entity ${isFocus("cpu") ? "is-active" : ""}`}>
                <span>CPU</span>
                <small>发起 VA</small>
              </div>
              <div className={`vm-node tlb vm-entity ${isFocus("tlb") ? "is-active" : ""}`}>
                <span>TLB</span>
                <small>快表缓存</small>
              </div>
              <div
                className={`vm-node pt vm-entity ${isFocus("page-table") ? "is-active" : ""}`}
              >
                <span>页表</span>
                <small>PTE</small>
              </div>
              <div className={`vm-node ram vm-entity ${isFocus("ram") ? "is-active" : ""}`}>
                <span>内存</span>
                <small>物理帧</small>
              </div>
              <div className={`vm-node disk vm-entity ${isFocus("disk") ? "is-active" : ""}`}>
                <span>磁盘</span>
                <small>pagefile</small>
              </div>

              <div className={`vm-table vm-tlb vm-entity ${isFocus("tlb") ? "is-active" : ""}`}>
                <div className="vm-table-title">TLB Cache</div>
                <div className="vm-table-row header">
                  <span>VPN</span>
                  <span>PFN</span>
                  <span>V</span>
                </div>
                <div className="vm-table-row row--hit">
                  <span>0x3A</span>
                  <span>0x1F</span>
                  <span>1</span>
                </div>
                <div className="vm-table-row">
                  <span>0x4C</span>
                  <span>0x09</span>
                  <span>1</span>
                </div>
                <div className="vm-table-row row--miss">
                  <span>0x8E</span>
                  <span>--</span>
                  <span>0</span>
                </div>
                <div className="vm-status vm-status--hit">TLB HIT</div>
                <div className="vm-status vm-status--miss">TLB MISS</div>
              </div>

              <div className={`vm-table vm-pt vm-entity ${isFocus("page-table") ? "is-active" : ""}`}>
                <div className="vm-table-title">Page Table</div>
                <div className="vm-table-row header">
                  <span>VPN</span>
                  <span>PFN</span>
                  <span>P</span>
                </div>
                <div className="vm-table-row row--pte-hit">
                  <span>0x3A</span>
                  <span>0x1F</span>
                  <span>1</span>
                </div>
                <div className="vm-table-row row--pte-hit">
                  <span>0x7D</span>
                  <span>0x22</span>
                  <span>1</span>
                </div>
                <div className="vm-table-row row--pte-fault">
                  <span>0x8E</span>
                  <span>disk:5</span>
                  <span>0</span>
                </div>
                <div className="vm-status vm-status--pte">PTE HIT</div>
                <div className="vm-status vm-status--fault">PAGE FAULT</div>
              </div>

              <div className={`vm-frames vm-ram vm-entity ${isFocus("ram") ? "is-active" : ""}`}>
                <div className="vm-frames-title">物理页帧</div>
                <div className="vm-frame row--frame-hit">PFN 0x1F · data</div>
                <div className="vm-frame">PFN 0x09 · cache</div>
                <div className="vm-frame row--frame-load">PFN 0x22 · load</div>
              </div>

              <div className={`vm-frames vm-disk vm-entity ${isFocus("disk") ? "is-active" : ""}`}>
                <div className="vm-frames-title">磁盘页</div>
                <div className="vm-frame row--disk-hot">page#5</div>
                <div className="vm-frame">page#2</div>
                <div className="vm-frame">page#8</div>
              </div>


              <div className={`vm-fault ${step.id === "page-fault" ? "is-active" : ""}`}>缺页中断</div>
            </div>

            <div className="vm-aside">
              <div className="vm-example">
                <div className="vm-example__title">{step.example?.title || "示例"}</div>
                <div className="vm-example__lines">
                  {(step.example?.lines || []).map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
              </div>

              <div className="vm-principles os-principles">
                <div className="os-principles__card">
                  <span className="os-principles__eyebrow">原理拆解</span>
                  <h3 className="os-principles__title">地址翻译路径</h3>
                  <p className="os-principles__desc">
                    CPU 访问虚拟地址后优先查 TLB；未命中才访问页表；若 PTE
                    不在内存则触发缺页中断并换入。
                  </p>
                  <div className="os-principles__list">
                    <div className="os-principles__item">
                      <strong>TLB 命中</strong>
                      <span>VPN → PFN 直接映射，单次内存访问完成。</span>
                    </div>
                    <div className="os-principles__item">
                      <strong>TLB 未命中</strong>
                      <span>需要读取页表项，带来一次额外内存访问。</span>
                    </div>
                    <div className="os-principles__item">
                      <strong>缺页中断</strong>
                      <span>磁盘换入 + 更新 PTE/TLB，延迟最高。</span>
                    </div>
                  </div>
                </div>
                <div className="os-principles__card">
                  <h3 className="os-principles__title">示例拆解</h3>
                  <p className="os-principles__desc">沿用当前示例，展示命中与缺页的差异。</p>
                  <div className="os-principles__example">
                    <span>VA 0x3A:19F0 → TLB hit → PA 0x1F:19F0</span>
                    <span>VA 0x8E:08C0 → TLB miss → PTE=Disk:5</span>
                    <span>缺页处理 → Disk page#5 → PFN 0x22</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {null}
        </section>
      </div>
    </Layout>
  );
}
