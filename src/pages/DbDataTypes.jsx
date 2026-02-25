import TopicShell from "../components/TopicShell.jsx";

const types = [
  {
    id: "integer",
    category: "数值型",
    color: "var(--accent-2)",
    items: [
      { name: "TINYINT", bytes: 1, range: "-128 ~ 127", example: "age TINYINT UNSIGNED — 存储年龄(0-255)" },
      { name: "INT", bytes: 4, range: "-2.1B ~ 2.1B", example: "user_id INT — 用户主键" },
      { name: "BIGINT", bytes: 8, range: "±9.2E18", example: "order_id BIGINT — 订单号/雪花ID" },
    ],
  },
  {
    id: "decimal",
    category: "精确小数",
    color: "#e67e22",
    items: [
      { name: "DECIMAL(M,D)", bytes: "M+2", range: "精确定点", example: "price DECIMAL(10,2) — 金额 99999999.99" },
      { name: "FLOAT", bytes: 4, range: "≈7位有效", example: "score FLOAT — 评分(允许误差)" },
      { name: "DOUBLE", bytes: 8, range: "≈15位有效", example: "coordinate DOUBLE — 经纬度" },
    ],
  },
  {
    id: "string",
    category: "字符串型",
    color: "var(--accent)",
    items: [
      { name: "CHAR(N)", bytes: "N", range: "定长 0-255", example: "country_code CHAR(2) — 'CN','US'" },
      { name: "VARCHAR(N)", bytes: "L+1/2", range: "变长 0-65535", example: "username VARCHAR(50) — 用户名" },
      { name: "TEXT", bytes: "L+2", range: "最大 64KB", example: "content TEXT — 文章正文" },
      { name: "BLOB", bytes: "L+2", range: "最大 64KB", example: "avatar BLOB — 小图片二进制" },
    ],
  },
  {
    id: "datetime",
    category: "日期时间型",
    color: "#9b59b6",
    items: [
      { name: "DATE", bytes: 3, range: "YYYY-MM-DD", example: "birthday DATE — '1995-06-15'" },
      { name: "DATETIME", bytes: 8, range: "YYYY-MM-DD HH:MM:SS", example: "created_at DATETIME — 创建时间" },
      { name: "TIMESTAMP", bytes: 4, range: "UTC 自动转换", example: "updated_at TIMESTAMP — 自动更新时间戳" },
    ],
  },
  {
    id: "json",
    category: "JSON 类型",
    color: "#2ecc71",
    items: [
      { name: "JSON", bytes: "变长", range: "结构化文档", example: 'config JSON — \'{"theme":"dark","lang":"zh"}\'' },
    ],
  },
];

const steps = [
  {
    id: "integer",
    title: "整数类型",
    description: "TINYINT / INT / BIGINT — 按字节选型，够用就好。",
    bullets: ["TINYINT 1字节，适合状态码、年龄", "INT 4字节，通用主键", "BIGINT 8字节，雪花ID/大表主键"],
    active: "integer",
  },
  {
    id: "decimal",
    title: "小数类型",
    description: "DECIMAL 精确计算，FLOAT/DOUBLE 近似计算。",
    bullets: ["金额必须用 DECIMAL，避免精度丢失", "FLOAT 约7位有效数字", "DOUBLE 约15位有效数字"],
    active: "decimal",
  },
  {
    id: "string",
    title: "字符串类型",
    description: "CHAR 定长 vs VARCHAR 变长，TEXT 存长文本。",
    bullets: ["CHAR(N) 固定N字节，适合固定长度字段", "VARCHAR(N) 按实际长度存储+1/2字节前缀", "TEXT/BLOB 存大文本/二进制，不宜做索引"],
    active: "string",
  },
  {
    id: "datetime",
    title: "日期时间类型",
    description: "DATE / DATETIME / TIMESTAMP 三种时间粒度。",
    bullets: ["DATE 只存日期，3字节", "DATETIME 8字节，不受时区影响", "TIMESTAMP 4字节，自动UTC转换，2038年问题"],
    active: "datetime",
  },
  {
    id: "json",
    title: "JSON 类型",
    description: "MySQL 5.7+ 原生 JSON，支持路径查询。",
    bullets: ["二进制存储，校验格式合法性", "支持 JSON_EXTRACT / -> / ->> 操作符", "可对虚拟列建索引加速查询"],
    active: "json",
  },
];

const principles = [
  {
    title: "选型原则：够用最小",
    detail: "选择能满足业务范围的最小类型，节省存储和索引空间。",
    points: ["状态字段用 TINYINT 而非 INT", "已知最大长度用 VARCHAR(N) 而非 TEXT", "能用 DATE 就不用 DATETIME"],
  },
  {
    title: "精度陷阱：金额用 DECIMAL",
    detail: "FLOAT/DOUBLE 是 IEEE 754 浮点，存在精度丢失。",
    points: ["0.1 + 0.2 ≠ 0.3（浮点）", "DECIMAL(10,2) 精确到分", "金融场景必须 DECIMAL 或整数存分"],
  },
  {
    title: "CHAR vs VARCHAR 实战",
    detail: "定长字段用 CHAR 更快，变长字段用 VARCHAR 更省空间。",
    points: ["手机号 CHAR(11) — 固定11位", "用户名 VARCHAR(50) — 长度不定", "CHAR 尾部补空格，比较时自动去除"],
  },
];

/* ── SVG 常量 ── */
const SVG_W = 660;
const SVG_H = 340;
const COL_X = [40, 170, 310, 460, 570];
const COL_W = [110, 120, 130, 90, 70];
const HEAD_Y = 40;
const ROW_START = 80;
const ROW_H = 36;

function renderDiagram(step) {
  const activeType = types.find((t) => t.id === step.active);
  if (!activeType) return null;

  const rows = activeType.items;
  const totalH = ROW_START + rows.length * ROW_H + 80;
  const headers = ["类型名", "字节数", "范围/格式", "示例", ""];

  return (
    <div className="dbt-svg-wrap">
      <div className="dbt-category-bar">
        {types.map((t) => (
          <span
            key={t.id}
            className={`dbt-cat-chip ${step.active === t.id ? "is-active" : ""}`}
            style={{ "--cat-color": t.color }}
          >
            {t.category}
          </span>
        ))}
      </div>

      <svg
        className="dbt-svg"
        viewBox={`0 0 ${SVG_W} ${Math.max(SVG_H, totalH)}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="dbt-head-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={activeType.color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={activeType.color} stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="dbt-row-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={activeType.color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={activeType.color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* 表头背景 */}
        <rect x="20" y={HEAD_Y - 8} width={SVG_W - 40} height="32" rx="8" fill="url(#dbt-head-grad)" />

        {/* 表头文字 */}
        {headers.map((h, i) => (
          <text
            key={i}
            x={COL_X[i] + COL_W[i] / 2}
            y={HEAD_Y + 12}
            textAnchor="middle"
            className="dbt-svg__th"
          >
            {h}
          </text>
        ))}

        {/* 分隔线 */}
        <line x1="20" y1={HEAD_Y + 26} x2={SVG_W - 20} y2={HEAD_Y + 26} stroke="var(--line)" strokeWidth="1" />

        {/* 数据行 */}
        {rows.map((item, idx) => {
          const y = ROW_START + idx * ROW_H;
          const isEven = idx % 2 === 0;
          return (
            <g key={item.name} className="dbt-svg__row" style={{ "--row-delay": `${idx * 0.12}s` }}>
              {/* 行背景 */}
              {isEven && (
                <rect x="20" y={y - 4} width={SVG_W - 40} height={ROW_H - 2} rx="6" fill="url(#dbt-row-grad)" />
              )}

              {/* 类型名 — 加粗高亮 */}
              <text x={COL_X[0] + 4} y={y + 16} className="dbt-svg__name" fill={activeType.color}>
                {item.name}
              </text>

              {/* 字节数 — 带小方块 */}
              <rect
                x={COL_X[1] + COL_W[1] / 2 - 16}
                y={y + 2}
                width="32"
                height="20"
                rx="4"
                fill={activeType.color}
                fillOpacity="0.12"
              />
              <text x={COL_X[1] + COL_W[1] / 2} y={y + 16} textAnchor="middle" className="dbt-svg__cell">
                {item.bytes}
              </text>

              {/* 范围 */}
              <text x={COL_X[2] + 4} y={y + 16} className="dbt-svg__cell dbt-svg__range">
                {item.range}
              </text>

              {/* 示例 */}
              <text x={COL_X[3] + 4} y={y + 16} className="dbt-svg__example">
                {item.example}
              </text>

              {/* 入场动画条 */}
              <rect
                x="20"
                y={y + ROW_H - 6}
                width={SVG_W - 40}
                height="1.5"
                rx="1"
                fill={activeType.color}
                fillOpacity="0.1"
                className="dbt-svg__row-line"
              />
            </g>
          );
        })}

        {/* 底部对比提示 */}
        {step.active === "decimal" && (
          <g className="dbt-svg__tip">
            <rect x="30" y={ROW_START + rows.length * ROW_H + 12} width={SVG_W - 60} height="40" rx="10" fill="#fff3e0" stroke="#e67e22" strokeWidth="1" strokeDasharray="4 2" />
            <text x={SVG_W / 2} y={ROW_START + rows.length * ROW_H + 37} textAnchor="middle" className="dbt-svg__tip-text">
              ⚠ 金额计算：0.1 + 0.2 = 0.30000000000000004（FLOAT） vs 0.30（DECIMAL）
            </text>
          </g>
        )}

        {step.active === "string" && (
          <g className="dbt-svg__tip">
            <rect x="30" y={ROW_START + rows.length * ROW_H + 12} width={SVG_W - 60} height="40" rx="10" fill="#e8f5e9" stroke="var(--accent-2)" strokeWidth="1" strokeDasharray="4 2" />
            <text x={SVG_W / 2} y={ROW_START + rows.length * ROW_H + 37} textAnchor="middle" className="dbt-svg__tip-text">
              CHAR(4) 存 'AB' → 'AB  '(补空格)　|　VARCHAR(4) 存 'AB' → 实际占3字节
            </text>
          </g>
        )}

        {step.active === "datetime" && (
          <g className="dbt-svg__tip">
            <rect x="30" y={ROW_START + rows.length * ROW_H + 12} width={SVG_W - 60} height="40" rx="10" fill="#f3e5f5" stroke="#9b59b6" strokeWidth="1" strokeDasharray="4 2" />
            <text x={SVG_W / 2} y={ROW_START + rows.length * ROW_H + 37} textAnchor="middle" className="dbt-svg__tip-text">
              TIMESTAMP 范围: 1970-01-01 ~ 2038-01-19（注意2038年溢出问题）
            </text>
          </g>
        )}

        {step.active === "json" && (
          <g className="dbt-svg__tip">
            <rect x="30" y={ROW_START + rows.length * ROW_H + 12} width={SVG_W - 60} height="40" rx="10" fill="#e8f8f5" stroke="#2ecc71" strokeWidth="1" strokeDasharray="4 2" />
            <text x={SVG_W / 2} y={ROW_START + rows.length * ROW_H + 37} textAnchor="middle" className="dbt-svg__tip-text">
              SELECT config-&gt;&gt;'$.theme' FROM settings → 'dark'（路径提取）
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export default function DbDataTypes() {
  return (
    <TopicShell
      eyebrow="MySQL 字段类型"
      title="MySQL 字段类型详解"
      subtitle="整数、小数、字符串、日期、JSON — 结合实例理解选型策略。"
      steps={steps}
      panel={[
        { title: "核心原则", detail: "够用最小，精确优先。" },
        { title: "常见陷阱", detail: "浮点精度、CHAR补空格、TIMESTAMP溢出。" },
      ]}
      principles={principles}
      principlesIntro="从存储效率、精度安全和实战场景三个角度理解字段选型。"
      flow={["业务需求 → 确定值域", "选最小满足类型", "金额用DECIMAL", "时间注意时区"]}
      diagramClass="dbt-diagram"
      renderDiagram={renderDiagram}
    />
  );
}
