import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "delegation-up", title: "1. 向上委派",
    description: "AppClassLoader 收到加载请求，逐级委派给父加载器。",
    bullets: ["App → Extension → Bootstrap", "每层先问父加载器能否加载", "到顶层 Bootstrap 才开始尝试"],
    active: "delegate", phase: 0,
  },
  {
    id: "delegation-down", title: "2. 向下查找",
    description: "Bootstrap 找不到，逐级回退让子加载器尝试。",
    bullets: ["Bootstrap: rt.jar 中未找到", "Extension: ext 目录未找到", "App: classpath 中找到目标类"],
    active: "delegate", phase: 1,
  },
  {
    id: "load", title: "3. 加载 Loading",
    description: "读取 .class 字节码，在方法区生成 Class 对象。",
    bullets: ["读取 OrderService.class 字节流", "在方法区创建运行时数据结构", "堆中生成 java.lang.Class 实例"],
    active: "lifecycle", phase: 0,
  },
  {
    id: "verify", title: "4. 验证 Verify",
    description: "校验字节码格式与语义，确保安全性。",
    bullets: ["魔数 0xCAFEBABE 校验", "元数据与字节码验证", "符号引用验证"],
    active: "lifecycle", phase: 1,
  },
  {
    id: "prepare", title: "5. 准备 Prepare",
    description: "为类变量分配内存并设置零值。",
    bullets: ["static int count = 0（零值）", "static final 直接赋常量值", "不执行用户代码"],
    active: "lifecycle", phase: 2,
  },
  {
    id: "resolve", title: "6. 解析 Resolve",
    description: "将符号引用替换为直接引用。",
    bullets: ["类、字段、方法引用解析", "符号 → 内存地址", "可延迟到首次使用时"],
    active: "lifecycle", phase: 3,
  },
  {
    id: "init", title: "7. 初始化 Init",
    description: "执行 <clinit>，完成静态变量赋值与静态块。",
    bullets: ["static int count = 100", "static { ... } 静态代码块", "父类先于子类初始化"],
    active: "lifecycle", phase: 4,
  },
];

const principles = [
  { title: "双亲委派", detail: "保证核心类库不被篡改，避免重复加载。", points: ["Bootstrap 加载 rt.jar 核心类", "相同类由同一加载器保证唯一性", "可自定义 ClassLoader 打破委派"] },
  { title: "加载生命周期", detail: "Loading → Linking → Initialization 三大阶段。", points: ["Linking 含验证、准备、解析三步", "准备阶段只赋零值", "<clinit> 在初始化阶段执行"] },
  { title: "实际应用", detail: "热部署、SPI、模块隔离都依赖类加载机制。", points: ["Tomcat 每个 webapp 独立 ClassLoader", "SPI 用 Thread ContextClassLoader", "OSGi 实现模块级类隔离"] },
];

// === Delegation diagram constants ===
const loaders = [
  { id: "bootstrap", name: "Bootstrap", sub: "rt.jar / 核心类", y: 36, color: "#d2642a" },
  { id: "extension", name: "Extension", sub: "jre/lib/ext", y: 108, color: "#4c78a8" },
  { id: "app",       name: "Application", sub: "classpath", y: 180, color: "#2a6f6b" },
];
const DX = 170; // center x for delegation diagram

// === Lifecycle diagram constants ===
const phases = [
  { id: "load",    label: "Loading",  color: "#2a6f6b" },
  { id: "verify",  label: "Verify",   color: "#4c78a8" },
  { id: "prepare", label: "Prepare",  color: "#4c78a8" },
  { id: "resolve", label: "Resolve",  color: "#4c78a8" },
  { id: "init",    label: "Init",     color: "#d2642a" },
];

export default function BackendClassLoader() {
  return (
    <TopicShell
      eyebrow="后端基础动画"
      title="Java 类加载机制"
      subtitle="双亲委派模型与类的生命周期可视化。"
      steps={steps}
      panel={[
        { title: "核心模型", detail: "双亲委派保证类加载安全与唯一。" },
        { title: "生命周期", detail: "加载 → 链接 → 初始化。" },
      ]}
      principles={principles}
      principlesIntro="从双亲委派、加载生命周期与实际应用理解类加载机制。"
      flow={["委派到顶层", "逐级回退查找", "加载 → 验证 → 准备 → 解析 → 初始化"]}
      diagramClass="cl-diagram"
      renderDiagram={(step) => {
        const mode = step.active;
        const phase = step.phase;

        if (mode === "delegate") {
          return (
            <div className="cl-scene">
              <svg className="cl-svg" viewBox="0 0 340 240" preserveAspectRatio="xMidYMid meet">
                <text x={170} y={16} className="cl-title">双亲委派模型</text>
                <defs>
                  <marker id="cl-a" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <path d="M0,0 L6,2.5 L0,5" fill="rgba(0,0,0,0.35)" />
                  </marker>
                </defs>

                {/* Loader boxes */}
                {loaders.map((ld, i) => {
                  const isFound = phase === 1 && i === 2;
                  const isSearching = phase === 0 ? i <= 2 : i < 2;
                  return (
                    <g key={ld.id}>
                      <rect
                        x={DX - 70} y={ld.y} width={140} height={48} rx={10}
                        className={`cl-loader ${isFound ? "cl-loader--found" : ""}`}
                        style={{ "--cl-c": ld.color }}
                      />
                      <text x={DX} y={ld.y + 20} className="cl-loader__name" fill={ld.color}>{ld.name}</text>
                      <text x={DX} y={ld.y + 35} className="cl-loader__sub">{ld.sub}</text>

                      {/* Not found X mark for phase 1 on bootstrap & extension */}
                      {phase === 1 && i < 2 && (
                        <text x={DX + 80} y={ld.y + 28} className="cl-notfound">✗</text>
                      )}
                      {/* Found check for phase 1 on app */}
                      {isFound && (
                        <text x={DX + 80} y={ld.y + 28} className="cl-found">✓</text>
                      )}
                    </g>
                  );
                })}

                {/* Delegation arrows between loaders */}
                {phase === 0 && (
                  <>
                    {/* App → Extension (up) */}
                    <line x1={DX - 20} y1={loaders[2].y} x2={DX - 20} y2={loaders[1].y + 48} className="cl-arrow cl-arrow--up" markerEnd="url(#cl-a)" />
                    <text x={DX - 30} y={(loaders[1].y + 48 + loaders[2].y) / 2 + 4} className="cl-arrow-label" textAnchor="end">委派</text>
                    {/* Extension → Bootstrap (up) */}
                    <line x1={DX - 20} y1={loaders[1].y} x2={DX - 20} y2={loaders[0].y + 48} className="cl-arrow cl-arrow--up" markerEnd="url(#cl-a)" />
                    <text x={DX - 30} y={(loaders[0].y + 48 + loaders[1].y) / 2 + 4} className="cl-arrow-label" textAnchor="end">委派</text>
                    {/* Animated dot going up */}
                    <circle r={4} className="cl-packet" fill="#2a6f6b">
                      <animateMotion dur="2s" repeatCount="indefinite" path={`M${DX - 20},${loaders[2].y} L${DX - 20},${loaders[0].y + 48}`} keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
                {phase === 1 && (
                  <>
                    {/* Bootstrap → Extension (down) */}
                    <line x1={DX + 20} y1={loaders[0].y + 48} x2={DX + 20} y2={loaders[1].y} className="cl-arrow cl-arrow--down" markerEnd="url(#cl-a)" />
                    <text x={DX + 30} y={(loaders[0].y + 48 + loaders[1].y) / 2 + 4} className="cl-arrow-label" textAnchor="start">回退</text>
                    {/* Extension → App (down) */}
                    <line x1={DX + 20} y1={loaders[1].y + 48} x2={DX + 20} y2={loaders[2].y} className="cl-arrow cl-arrow--down" markerEnd="url(#cl-a)" />
                    <text x={DX + 30} y={(loaders[1].y + 48 + loaders[2].y) / 2 + 4} className="cl-arrow-label" textAnchor="start">回退</text>
                    {/* Animated dot going down */}
                    <circle r={4} className="cl-packet" fill="#d2642a">
                      <animateMotion dur="2s" repeatCount="indefinite" path={`M${DX + 20},${loaders[0].y + 48} L${DX + 20},${loaders[2].y}`} keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* Target class label at bottom */}
                <text x={170} y={234} className="cl-target">目标：OrderService.class</text>
              </svg>
              <div className="cl-ds cl-ds--delegate">
                <span className="cl-ds__label">委派</span>
                <div className="cl-ds__items">
                  {["向上委派", "向下查找"].map((t, i) => (
                    <span key={i} className={`cl-ds__step ${i === phase ? "cl-ds__step--active" : ""} ${i < phase ? "cl-ds__step--past" : ""}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (mode === "lifecycle") {
          const PW = 52, PH = 36, GAP = 10;
          const totalW = phases.length * PW + (phases.length - 1) * GAP;
          const startX = (340 - totalW) / 2;

          return (
            <div className="cl-scene">
              <svg className="cl-svg" viewBox="0 0 340 200" preserveAspectRatio="xMidYMid meet">
                <text x={170} y={16} className="cl-title">类加载生命周期</text>
                <defs>
                  <marker id="cl-la" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <path d="M0,0 L6,2.5 L0,5" fill="rgba(0,0,0,0.25)" />
                  </marker>
                </defs>

                {/* Phase boxes in a row */}
                {phases.map((p, i) => {
                  const x = startX + i * (PW + GAP);
                  const y = 34;
                  const isActive = i === phase;
                  const isPast = i < phase;
                  return (
                    <g key={p.id}>
                      <rect
                        x={x} y={y} width={PW} height={PH} rx={8}
                        className={`cl-phase ${isActive ? "cl-phase--active" : ""} ${isPast ? "cl-phase--past" : ""}`}
                        style={{ "--cl-pc": p.color }}
                      />
                      <text x={x + PW / 2} y={y + PH / 2 + 4} className={`cl-phase__label ${isActive ? "cl-phase__label--active" : ""}`} fill={isActive ? p.color : isPast ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.25)"}>
                        {p.label}
                      </text>
                      {/* Arrow to next */}
                      {i < phases.length - 1 && (
                        <line x1={x + PW} y1={y + PH / 2} x2={x + PW + GAP} y2={y + PH / 2} stroke="rgba(0,0,0,0.15)" strokeWidth={1} markerEnd="url(#cl-la)" />
                      )}
                    </g>
                  );
                })}

                {/* Linking bracket over verify/prepare/resolve */}
                <line x1={startX + 1 * (PW + GAP)} y1={30} x2={startX + 3 * (PW + GAP) + PW} y2={30} stroke="rgba(76,120,168,0.3)" strokeWidth={1} />
                <text x={startX + 2 * (PW + GAP) + PW / 2} y={26} className="cl-bracket-label">Linking</text>

                {/* Detail area below */}
                {(() => {
                  const detailY = 90;
                  const details = [
                    { title: "Loading", lines: ["读取 .class 字节流", "创建 Class 对象", "OrderService.class → 方法区"] },
                    { title: "Verify", lines: ["魔数: 0xCAFEBABE ✓", "版本号: 52.0 (Java 8) ✓", "字节码语义校验 ✓"] },
                    { title: "Prepare", lines: ["static int count = 0", "static String name = null", "分配内存，赋零值"] },
                    { title: "Resolve", lines: ["UserDAO → 0x7f3a...", "符号引用 → 直接引用", "方法表地址绑定"] },
                    { title: "Init", lines: ["count = 100", "static { log(\"init\") }", "执行 <clinit> 方法"] },
                  ];
                  const d = details[phase];
                  return (
                    <g className="cl-detail">
                      <rect x={50} y={detailY} width={240} height={90} rx={10} className="cl-detail__bg" />
                      <text x={170} y={detailY + 18} className="cl-detail__title" fill={phases[phase].color}>{d.title}</text>
                      {d.lines.map((line, li) => (
                        <text key={li} x={170} y={detailY + 38 + li * 18} className="cl-detail__line">{line}</text>
                      ))}
                    </g>
                  );
                })()}
              </svg>
              <div className="cl-ds cl-ds--lifecycle">
                <span className="cl-ds__label">阶段</span>
                <div className="cl-ds__items">
                  {["加载", "验证", "准备", "解析", "初始化"].map((t, i) => (
                    <span key={i} className={`cl-ds__step ${i === phase ? "cl-ds__step--active" : ""} ${i < phase ? "cl-ds__step--past" : ""}`}>{t}</span>
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
