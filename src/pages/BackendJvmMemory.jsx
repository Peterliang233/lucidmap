import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "heap",
    title: "堆内存",
    description: "对象实例主要存放在堆中，GC 负责回收。",
    bullets: ["新生代 / 老年代", "GC Roots"],
    active: "heap",
  },
  {
    id: "stack",
    title: "虚拟机栈",
    description: "每个线程独立栈帧，存放局部变量。",
    bullets: ["方法调用", "出栈回收"],
    active: "stack",
  },
  {
    id: "meta",
    title: "元空间",
    description: "类元数据与常量池存放在元空间。",
    bullets: ["类加载", "动态生成"],
    active: "meta",
  },
  {
    id: "gc",
    title: "GC 过程",
    description: "标记、清除、复制压缩完成回收。",
    bullets: ["STW", "分代回收"],
    active: "gc",
  },
];

const regions = [
  { id: "heap", label: "Heap" },
  { id: "stack", label: "Stack" },
  { id: "meta", label: "Metaspace" },
];

export default function BackendJvmMemory() {
  return (
    <TopicShell
      eyebrow="后端基础动画"
      title="JVM 内存结构"
      subtitle="用分区示意图理解堆、栈、元空间与 GC。"
      steps={steps}
      panel={[
        { title: "关键组件", detail: "堆、栈、方法区、直接内存。" },
        { title: "问题定位", detail: "OOM、GC 频繁、内存泄漏。" },
      ]}
      flow={["堆存对象", "栈存局部变量", "元空间存类信息", "GC 回收释放"]}
      diagramClass="jvm-diagram"
      renderDiagram={(step) => (
        <div className={`jvm-layout focus--${step.active}`}>
          {regions.map((region) => (
            <div key={region.id} className={`jvm-block jvm-block--${region.id}`}>
              {region.label}
            </div>
          ))}
          <div className="jvm-gc">GC</div>
        </div>
      )}
    />
  );
}
