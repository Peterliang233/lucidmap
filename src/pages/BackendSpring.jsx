import TopicShell from "../components/TopicShell.jsx";

/* ── Steps ── */
const steps = [
  {
    id: "ioc-overview", title: "IoC 容器全景",
    description: "Spring 的核心是 IoC 容器，负责管理所有 Bean 的创建、装配和生命周期。",
    bullets: ["控制反转：对象创建权交给容器", "BeanFactory / ApplicationContext", "配置来源：注解、XML、Java Config"],
    mode: "ioc", phase: 0,
  },
  {
    id: "bean-register", title: "Bean 注册",
    description: "容器启动时扫描 @Component 等注解，将 BeanDefinition 注册到 BeanFactory。",
    bullets: ["@Component / @Service / @Repository", "BeanDefinition 描述类元信息", "BeanDefinitionRegistry 统一注册"],
    mode: "ioc", phase: 1,
  },
  {
    id: "di-inject", title: "依赖注入（DI）",
    description: "容器根据类型或名称自动注入依赖，解耦组件间的硬编码关系。",
    bullets: ["@Autowired 按类型注入", "@Qualifier 按名称消歧", "构造器注入 vs Setter 注入"],
    mode: "ioc", phase: 2,
  },
  {
    id: "bean-lifecycle", title: "Bean 生命周期",
    description: "Bean 从实例化到销毁经历完整的生命周期回调链。",
    bullets: ["实例化 → 属性填充 → 初始化 → 使用 → 销毁", "BeanPostProcessor 前后置处理", "@PostConstruct / @PreDestroy"],
    mode: "lifecycle", phase: 0,
  },
  {
    id: "aop-concept", title: "AOP 核心概念",
    description: "面向切面编程将横切关注点（日志、事务、权限）从业务逻辑中分离。",
    bullets: ["Aspect 切面 = Pointcut + Advice", "JoinPoint 连接点：方法执行", "Weaving 织入：编译期 / 运行时"],
    mode: "aop", phase: 0,
  },
  {
    id: "aop-proxy", title: "AOP 代理创建",
    description: "Spring 通过 JDK 动态代理或 CGLIB 为目标对象创建代理。",
    bullets: ["接口 → JDK Proxy（反射）", "类 → CGLIB（字节码增强）", "ProxyFactory 统一创建入口"],
    mode: "aop", phase: 1,
  },
  {
    id: "aop-intercept", title: "方法拦截执行",
    description: "调用代理方法时，拦截器链按顺序执行 Before → 目标方法 → After。",
    bullets: ["@Before → 前置通知", "@Around → 环绕通知", "@AfterReturning / @AfterThrowing"],
    mode: "aop", phase: 2,
  },
  {
    id: "full-flow", title: "Spring 完整流程",
    description: "从容器启动到请求处理，IoC 和 AOP 协同工作。",
    bullets: ["启动：扫描 → 注册 → 实例化 → 注入 → 代理", "请求：Controller → Service(Proxy) → DAO", "AOP 在代理层透明增强业务方法"],
    mode: "flow", phase: 0,
  },
];

const principles = [
  { title: "控制反转 IoC", detail: "将对象创建和依赖管理交给容器，降低组件耦合度。", points: ["容器管理 Bean 全生命周期", "依赖注入替代 new 硬编码", "便于测试和替换实现"] },
  { title: "面向切面 AOP", detail: "横切关注点与业务逻辑分离，通过代理透明增强。", points: ["动态代理实现方法拦截", "事务/日志/权限统一管理", "不侵入业务代码"] },
  { title: "Bean 生命周期", detail: "从定义到销毁的完整回调链，支持自定义扩展。", points: ["BeanPostProcessor 扩展点", "Aware 接口注入容器资源", "作用域：singleton / prototype"] },
];

/* ── IoC Scene ── */
function IocScene({ phase }) {
  const CW = 480, CH = 200, CX = 60, CY = 50;
  const beans = [
    { name: "UserService", x: 150, y: 110, color: "#2a6f6b" },
    { name: "OrderService", x: 350, y: 110, color: "#4c78a8" },
    { name: "UserDAO", x: 150, y: 180, color: "#8c50b4" },
    { name: "OrderDAO", x: 350, y: 180, color: "#8c50b4" },
    { name: "DataSource", x: 470, y: 145, color: "#d2642a" },
  ];
  // DI arrows: vertical from Service down to DAO, horizontal from DAO right to DataSource
  const diArrows = [
    { x1: 150, y1: 126, x2: 150, y2: 164 },   // UserService ↓ UserDAO
    { x1: 350, y1: 126, x2: 350, y2: 164 },   // OrderService ↓ OrderDAO
    { x1: 198, y1: 180, x2: 422, y2: 155 },   // UserDAO → DataSource
    { x1: 398, y1: 180, x2: 422, y2: 155 },   // OrderDAO → DataSource
  ];
  return (
    <svg className="spring-svg" viewBox="0 0 600 290" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="spring-heading">
        {phase === 0 ? "IoC 容器全景" : phase === 1 ? "Bean 注册到容器" : "依赖注入（DI）"}
      </text>
      {/* Container */}
      <rect x={CX} y={CY} width={CW} height={CH} rx={16} className="spring-container" />
      <text x={CX + 14} y={CY + 20} className="spring-container-label">ApplicationContext</text>
      {/* Beans */}
      {beans.map((b, i) => {
        const visible = phase === 0 || phase === 2 || (phase === 1 && i <= 2 + phase);
        return (
          <g key={b.name} className={`spring-bean-g ${visible ? "spring-bean-g--visible" : "spring-bean-g--hidden"} ${phase === 1 ? "spring-bean-g--registering" : ""}`}
            style={{ "--bean-delay": `${i * 0.2}s` }}>
            <rect x={b.x - 48} y={b.y - 16} width={96} height={32} rx={8}
              className="spring-bean" style={{ "--bean-c": b.color }} />
            <text x={b.x} y={b.y + 5} className="spring-bean-text">{b.name}</text>
          </g>
        );
      })}
      {/* DI arrows */}
      {phase === 2 && diArrows.map((a, i) => (
        <g key={i} className="spring-di-arrow" style={{ "--di-delay": `${i * 0.15}s` }}>
          <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
            className="spring-di-line" markerEnd="url(#spring-arr)" />
          {i === 0 && <text x={165} y={148} className="spring-di-label">@Autowired</text>}
        </g>
      ))}
      {/* Phase 0: annotation labels */}
      {phase === 0 && (
        <g>
          <text x={300} y={CY + CH + 20} className="spring-hint">容器管理所有 Bean 的创建与装配</text>
          <text x={150} y={90} className="spring-anno">@Service</text>
          <text x={350} y={90} className="spring-anno">@Service</text>
          <text x={150} y={210} className="spring-anno">@Repository</text>
          <text x={350} y={210} className="spring-anno">@Repository</text>
          <text x={470} y={125} className="spring-anno">@Bean</text>
        </g>
      )}
      {/* Phase 1: scan label inside viewBox */}
      {phase === 1 && (
        <g className="spring-scan-g">
          <text x={300} y={CY + CH + 20} className="spring-hint">@ComponentScan 扫描并注册 BeanDefinition</text>
        </g>
      )}
      <defs>
        <marker id="spring-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="rgba(42,111,107,0.5)" />
        </marker>
      </defs>
    </svg>
  );
}

/* ── Lifecycle Scene ── */
function LifecycleScene() {
  const stages = [
    { label: "实例化", sub: "new Bean()", color: "#4c78a8", cx: 70 },
    { label: "属性填充", sub: "populate", color: "#2a6f6b", cx: 185 },
    { label: "初始化", sub: "init", color: "#8c50b4", cx: 300 },
    { label: "使用中", sub: "getBean()", color: "#388e3c", cx: 415 },
    { label: "销毁", sub: "destroy", color: "#d2642a", cx: 530 },
  ];
  return (
    <svg className="spring-svg" viewBox="0 0 600 220" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="spring-heading">Bean 生命周期</text>
      {/* Timeline line */}
      <line x1={50} y1={95} x2={550} y2={95} className="spring-timeline" />
      {/* Stages */}
      {stages.map((s, i) => (
        <g key={i} className="spring-lc-stage" style={{ "--lc-delay": `${i * 0.3}s` }}>
          <circle cx={s.cx} cy={95} r={14} className="spring-lc-node" style={{ "--lc-c": s.color }} />
          <text x={s.cx} y={99} className="spring-lc-num">{i + 1}</text>
          <text x={s.cx} y={68} className="spring-lc-label" fill={s.color}>{s.label}</text>
          <text x={s.cx} y={123} className="spring-lc-sub">{s.sub}</text>
          {i < stages.length - 1 && (
            <line x1={s.cx + 14} y1={95} x2={stages[i + 1].cx - 14} y2={95}
              className="spring-lc-arrow" markerEnd="url(#spring-lc-arr)" />
          )}
        </g>
      ))}
      {/* BeanPostProcessor callout */}
      <rect x={160} y={148} width={280} height={28} rx={8} className="spring-bpp-box" />
      <text x={300} y={167} className="spring-bpp-text">BeanPostProcessor 前置 / 后置处理</text>
      <line x1={300} y1={148} x2={300} y2={109} className="spring-bpp-line" strokeDasharray="4 3" />
      <defs>
        <marker id="spring-lc-arr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <path d="M0,0 L6,2.5 L0,5" fill="rgba(0,0,0,0.15)" />
        </marker>
      </defs>
    </svg>
  );
}

/* ── AOP Scene ── */
function AopScene({ phase }) {
  const heights = { 0: 270, 1: 260, 2: 280 };
  return (
    <svg className="spring-svg" viewBox={`0 0 600 ${heights[phase]}`} preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="spring-heading">
        {phase === 0 ? "AOP 核心概念" : phase === 1 ? "AOP 代理创建" : "方法拦截执行"}
      </text>
      {phase === 0 && <AopConceptSub />}
      {phase === 1 && <AopProxySub />}
      {phase === 2 && <AopInterceptSub />}
    </svg>
  );
}

function AopConceptSub() {
  const concepts = [
    { label: "Aspect", sub: "切面", x: 100, y: 80, color: "#d2642a" },
    { label: "Pointcut", sub: "切入点", x: 300, y: 80, color: "#8c50b4" },
    { label: "Advice", sub: "通知", x: 500, y: 80, color: "#2a6f6b" },
    { label: "JoinPoint", sub: "连接点", x: 200, y: 175, color: "#4c78a8" },
    { label: "Weaving", sub: "织入", x: 400, y: 175, color: "#388e3c" },
  ];
  const links = [
    { from: 0, to: 1 }, { from: 0, to: 2 },
    { from: 1, to: 3 }, { from: 2, to: 4 },
  ];
  return (
    <g>
      {links.map((l, i) => (
        <line key={i}
          x1={concepts[l.from].x} y1={concepts[l.from].y + 20}
          x2={concepts[l.to].x} y2={concepts[l.to].y - 20}
          className="spring-aop-link" />
      ))}
      {concepts.map((c, i) => (
        <g key={i} className="spring-aop-concept" style={{ "--aop-delay": `${i * 0.15}s` }}>
          <rect x={c.x - 52} y={c.y - 18} width={104} height={36} rx={10}
            className="spring-aop-box" style={{ "--aop-c": c.color }} />
          <text x={c.x} y={c.y - 1} className="spring-aop-name" fill={c.color}>{c.label}</text>
          <text x={c.x} y={c.y + 14} className="spring-aop-sub">{c.sub}</text>
        </g>
      ))}
      <text x={300} y={240} className="spring-hint">Aspect = Pointcut（在哪切）+ Advice（做什么）</text>
    </g>
  );
}

function AopProxySub() {
  return (
    <g>
      {/* Target */}
      <rect x={40} y={60} width={140} height={50} rx={12} className="spring-target-box" />
      <text x={110} y={82} className="spring-target-label">Target Bean</text>
      <text x={110} y={98} className="spring-target-sub">UserService</text>
      {/* Arrow to proxy factory */}
      <line x1={180} y1={85} x2={220} y2={85} className="spring-proxy-arrow" markerEnd="url(#spring-arr)" />
      {/* Proxy Factory */}
      <rect x={220} y={55} width={160} height={60} rx={12} className="spring-factory-box" />
      <text x={300} y={80} className="spring-factory-label">ProxyFactory</text>
      <text x={300} y={98} className="spring-factory-sub">JDK / CGLIB</text>
      {/* Arrow to proxy */}
      <line x1={380} y1={85} x2={420} y2={85} className="spring-proxy-arrow" markerEnd="url(#spring-arr)" />
      {/* Proxy */}
      <rect x={420} y={60} width={140} height={50} rx={12} className="spring-proxy-box" />
      <text x={490} y={82} className="spring-proxy-label">Proxy Bean</text>
      <text x={490} y={98} className="spring-proxy-sub">$$Proxy</text>
      {/* JDK vs CGLIB */}
      <rect x={170} y={160} width={120} height={36} rx={8} className="spring-jdk-box" />
      <text x={230} y={182} className="spring-jdk-text">JDK Proxy</text>
      <text x={230} y={208} className="spring-jdk-hint">实现接口时使用</text>
      <rect x={310} y={160} width={120} height={36} rx={8} className="spring-cglib-box" />
      <text x={370} y={182} className="spring-cglib-text">CGLIB</text>
      <text x={370} y={208} className="spring-cglib-hint">无接口时使用</text>
      {/* Lines from factory */}
      <line x1={280} y1={115} x2={230} y2={160} className="spring-aop-link" strokeDasharray="4 3" />
      <line x1={320} y1={115} x2={370} y2={160} className="spring-aop-link" strokeDasharray="4 3" />
    </g>
  );
}

function AopInterceptSub() {
  const advices = [
    { label: "@Before", color: "#4c78a8", y: 60 },
    { label: "@Around (前)", color: "#8c50b4", y: 100 },
    { label: "Target 方法", color: "#2a6f6b", y: 140 },
    { label: "@Around (后)", color: "#8c50b4", y: 180 },
    { label: "@After", color: "#d2642a", y: 220 },
  ];
  return (
    <g>
      {/* Interceptor chain */}
      <rect x={170} y={40} width={280} height={210} rx={14} className="spring-chain-box" />
      <text x={310} y={37} className="spring-chain-title">拦截器链 Interceptor Chain</text>
      {/* Timeline */}
      <line x1={210} y1={60} x2={210} y2={220} className="spring-chain-line" />
      {advices.map((a, i) => (
        <g key={i} className="spring-advice-g" style={{ "--adv-delay": `${i * 0.2}s` }}>
          <circle cx={210} cy={a.y} r={6} className="spring-advice-dot" style={{ "--adv-c": a.color }} />
          <rect x={230} y={a.y - 14} width={200} height={28} rx={7}
            className="spring-advice-bar" style={{ "--adv-c": a.color }} />
          <text x={330} y={a.y + 5} className="spring-advice-text" fill={a.color}>{a.label}</text>
          {i < advices.length - 1 && (
            <line x1={210} y1={a.y + 6} x2={210} y2={advices[i + 1].y - 6}
              className="spring-advice-conn" />
          )}
        </g>
      ))}
      {/* Caller */}
      <text x={90} y={143} className="spring-caller-text">调用方</text>
      <line x1={125} y1={140} x2={170} y2={140} className="spring-proxy-arrow" markerEnd="url(#spring-arr)" />
    </g>
  );
}

/* ── Full Flow Scene ── */
function FlowScene() {
  const nodes = [
    { label: "扫描", sub: "@ComponentScan", x: 70, y: 80, color: "#4c78a8" },
    { label: "注册", sub: "BeanDefinition", x: 190, y: 80, color: "#2a6f6b" },
    { label: "实例化", sub: "createBean", x: 300, y: 80, color: "#8c50b4" },
    { label: "注入", sub: "@Autowired", x: 410, y: 80, color: "#2a6f6b" },
    { label: "代理", sub: "AOP Proxy", x: 520, y: 80, color: "#d2642a" },
  ];
  const reqNodes = [
    { label: "Controller", x: 130, y: 195, color: "#4c78a8" },
    { label: "Service Proxy", x: 300, y: 195, color: "#d2642a" },
    { label: "DAO", x: 470, y: 195, color: "#8c50b4" },
  ];
  return (
    <svg className="spring-svg" viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet">
      <text x={300} y={24} className="spring-heading">Spring 完整流程</text>
      {/* Startup flow */}
      <text x={30} y={58} className="spring-flow-label">启动</text>
      {nodes.map((n, i) => (
        <g key={i} className="spring-flow-node" style={{ "--flow-delay": `${i * 0.15}s` }}>
          <rect x={n.x - 44} y={n.y - 18} width={88} height={36} rx={8}
            className="spring-flow-box" style={{ "--flow-c": n.color }} />
          <text x={n.x} y={n.y - 1} className="spring-flow-name" fill={n.color}>{n.label}</text>
          <text x={n.x} y={n.y + 14} className="spring-flow-sub">{n.sub}</text>
          {i < nodes.length - 1 && (
            <line x1={n.x + 44} y1={n.y} x2={nodes[i + 1].x - 44} y2={nodes[i + 1].y}
              className="spring-flow-arrow" markerEnd="url(#spring-arr)" />
          )}
        </g>
      ))}
      {/* Request flow */}
      <text x={30} y={175} className="spring-flow-label">请求</text>
      <line x1={50} y1={125} x2={50} y2={165} className="spring-flow-divider" strokeDasharray="4 3" />
      {reqNodes.map((n, i) => (
        <g key={i} className="spring-flow-node" style={{ "--flow-delay": `${(i + 5) * 0.15}s` }}>
          <rect x={n.x - 56} y={n.y - 18} width={112} height={36} rx={8}
            className="spring-flow-box" style={{ "--flow-c": n.color }} />
          <text x={n.x} y={n.y + 5} className="spring-flow-name" fill={n.color}>{n.label}</text>
          {i < reqNodes.length - 1 && (
            <line x1={n.x + 56} y1={n.y} x2={reqNodes[i + 1].x - 56} y2={reqNodes[i + 1].y}
              className="spring-flow-arrow" markerEnd="url(#spring-arr)" />
          )}
        </g>
      ))}
      {/* AOP hint */}
      <text x={300} y={228} className="spring-aop-hint">AOP 透明增强</text>
    </svg>
  );
}

/* ── Phase bar ── */
function PhaseBar({ mode, phase, labels, color }) {
  const tagMap = { ioc: "IoC", lifecycle: "生命周期", aop: "AOP", flow: "流程" };
  return (
    <div className={`spring-phase-bar`} style={{ "--phase-c": color }}>
      <span className="spring-phase-bar__tag">{tagMap[mode]}</span>
      <div className="spring-phase-bar__steps">
        {labels.map((t, i) => (
          <span key={i} className={`spring-phase-bar__step ${i === phase ? "is-active" : ""} ${i < phase ? "is-past" : ""}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function BackendSpring() {
  const phaseLabels = {
    ioc: ["容器全景", "Bean 注册", "依赖注入"],
    lifecycle: ["完整生命周期"],
    aop: ["核心概念", "代理创建", "方法拦截"],
    flow: ["完整流程"],
  };
  const phaseColors = {
    ioc: "#2a6f6b",
    lifecycle: "#4c78a8",
    aop: "#d2642a",
    flow: "#8c50b4",
  };

  return (
    <TopicShell
      eyebrow="后端基础动画"
      title="Spring 核心原理"
      subtitle="IoC 容器、依赖注入、Bean 生命周期与 AOP 代理机制。"
      steps={steps}
      panel={[
        { title: "核心机制", detail: "IoC 控制反转 + AOP 面向切面编程。" },
        { title: "关键面试点", detail: "Bean 生命周期、循环依赖、代理模式。" },
      ]}
      principles={principles}
      principlesIntro="理解 IoC 和 AOP 是掌握 Spring 框架的基础。"
      flow={["扫描注册 → 实例化 → 注入 → 代理", "请求经过代理链透明增强", "生命周期回调贯穿始终"]}
      diagramClass="spring-diagram"
      renderDiagram={(step) => {
        const { mode, phase } = step;
        const pct = ((steps.findIndex(s => s.id === step.id) + 1) / steps.length) * 100;
        return (
          <div className="spring-scene">
            <div className="spring-progress">
              <div className="spring-progress__fill" style={{ width: `${pct}%` }} />
            </div>
            {mode === "ioc" && <IocScene phase={phase} />}
            {mode === "lifecycle" && <LifecycleScene />}
            {mode === "aop" && <AopScene phase={phase} />}
            {mode === "flow" && <FlowScene />}
            <PhaseBar mode={mode} phase={phase} labels={phaseLabels[mode]} color={phaseColors[mode]} />
          </div>
        );
      }}
    />
  );
}
