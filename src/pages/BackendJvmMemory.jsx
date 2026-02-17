import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "heap",
    title: "堆内存：对象分配与分代",
    description: "对象与数组分配在堆，新生代频繁 Minor GC，存活对象晋升老年代。",
    bullets: ["Eden / S0 / S1 / Old", "Minor GC 复制存活对象", "晋升阈值触发老年代"],
    active: "heap",
    example: {
      title: "订单对象生命周期",
      lines: ["new Order(521) 分配到 Eden", "Minor GC 后进入 Survivor", "多次存活晋升 Old"],
      tags: ["Eden → Survivor", "Age++", "Old Gen"],
    },
  },
  {
    id: "stack",
    title: "虚拟机栈：线程私有栈帧",
    description: "每个线程维护栈帧，局部变量与操作数栈随方法调用入栈/出栈。",
    bullets: ["方法调用 -> 入栈", "返回 -> 出栈", "局部变量表 + 操作数栈"],
    active: "stack",
    example: {
      title: "调用链示例",
      lines: ["main() -> pay()", "pay() -> checkInventory()", "返回时逐帧出栈"],
      tags: ["Frame Push", "Frame Pop", "Thread Local"],
    },
  },
  {
    id: "meta",
    title: "元空间：类元数据",
    description: "类加载器加载类元数据，元空间位于本地内存。",
    bullets: ["ClassLoader 加载", "运行时常量池", "卸载类释放"],
    active: "meta",
    example: {
      title: "类加载示例",
      lines: ["加载 OrderService.class", "常量池/字段/方法元数据写入", "类卸载后回收"],
      tags: ["Metaspace", "ClassLoader", "Native Memory"],
    },
  },
  {
    id: "gc",
    title: "GC 过程：标记 → 清理 → 压缩",
    description: "GC 在安全点暂停线程，标记存活对象并清理/压缩空间。",
    bullets: ["STW 安全点", "标记存活对象", "清理与压缩碎片"],
    active: "gc",
    example: {
      title: "一次 GC 视角",
      lines: ["STW 停顿线程", "标记存活对象", "清理/压缩释放空间"],
      tags: ["Mark", "Sweep/Compact", "Stop-The-World"],
    },
  },
];

export default function BackendJvmMemory() {
  return (
    <TopicShell
      eyebrow="后端基础动画"
      title="JVM 内存结构"
      subtitle="用分代堆、栈帧与类元数据理解 JVM 内存与 GC。"
      steps={steps}
      panel={[
        { title: "关键组件", detail: "堆、栈、方法区、直接内存。" },
        { title: "问题定位", detail: "OOM、GC 频繁、内存泄漏。" },
      ]}
      flow={[
        "对象分配在堆，Eden → Survivor → Old",
        "线程调用形成栈帧，局部变量随调用释放",
        "类元数据进入元空间，类卸载后回收",
        "GC 标记存活对象并清理/压缩",
      ]}
      diagramClass="jvm-diagram"
      renderDiagram={(step) => (
        <div className={`jvm-board mode--${step.active}`}>
          <div className="jvm-board__left">
            <div className="jvm-memory">
              <div className="jvm-section jvm-section--heap">
                <div className="jvm-section__title">Heap</div>
                <div className="jvm-section__meta">Eden / Survivor / Old</div>
                <div className="heap-grid">
                  <div className="heap-area eden">
                    <span className="heap-label">Eden</span>
                    <span className="heap-token token-a">Order#521</span>
                    <span className="heap-token token-b">Item#9</span>
                  </div>
                  <div className="heap-area s0">
                    <span className="heap-label">S0</span>
                    <span className="heap-token token-c">User#12</span>
                  </div>
                  <div className="heap-area s1">
                    <span className="heap-label">S1</span>
                  </div>
                  <div className="heap-area old">
                    <span className="heap-label">Old Gen</span>
                    <span className="heap-token token-d">OrderHistory</span>
                  </div>
                </div>
              </div>

              <div className="jvm-section jvm-section--stack">
                <div className="jvm-section__title">JVM Stack</div>
                <div className="jvm-section__meta">Thread-local frames</div>
                <div className="stack-frames">
                  <div className="stack-frame">main()</div>
                  <div className="stack-frame">pay()</div>
                  <div className="stack-frame is-top">checkInventory()</div>
                </div>
                <div className="stack-meta">locals: orderId, price</div>
              </div>

              <div className="jvm-section jvm-section--meta">
                <div className="jvm-section__title">Metaspace</div>
                <div className="jvm-section__meta">Class metadata</div>
                <div className="meta-loaders">
                  <div className="meta-loader">
                    <span>AppClassLoader</span>
                    <span className="meta-badge">active</span>
                  </div>
                  <div className="meta-loader">
                    <span>PluginLoader</span>
                    <span className="meta-badge">idle</span>
                  </div>
                </div>
                <div className="meta-classes">
                  <span>OrderService</span>
                  <span>Inventory</span>
                  <span>Payment</span>
                </div>
              </div>
            </div>

            <div className="jvm-gc-lane">
              <div className="gc-header">
                <span>GC Pipeline</span>
                <span className="gc-badge">STW</span>
              </div>
              <div className="gc-steps">
                <span className="gc-step">Mark</span>
                <span className="gc-step">Sweep</span>
                <span className="gc-step">Compact</span>
              </div>
              <div className="gc-sweep" aria-hidden="true" />
            </div>
          </div>

          <div className="jvm-example">
            <div className="jvm-example__eyebrow">示例</div>
            <div className="jvm-example__title">{step.example?.title}</div>
            <ul className="jvm-example__list">
              {(step.example?.lines || []).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="jvm-example__tags">
              {(step.example?.tags || []).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
