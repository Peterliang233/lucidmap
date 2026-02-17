import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "rdb",
    title: "RDB 快照",
    description: "BGSAVE fork 子进程，COW 保留一致视图，子进程序列化生成 dump.rdb。",
    bullets: ["fork + COW", "遍历 DB/keyspace", "原子替换 dump.rdb"],
    active: "rdb",
  },
  {
    id: "aof",
    title: "AOF 追加",
    description: "写命令按顺序追加到 AOF buffer，并按 fsync 策略落盘。",
    bullets: ["appendonly.aof", "fsync always/everysec/no", "恢复更完整"],
    active: "aof",
  },
];

const principles = [
  {
    title: "RDB 快照主线",
    detail: "fork + COW + 原子替换",
    points: ["BGSAVE 生成子进程", "写入触发 COW，父进程继续处理", "dump.rdb.tmp → rename"],
  },
  {
    title: "AOF 追加链路",
    detail: "顺序写 + fsync 策略",
    points: ["写命令追加到 AOF buffer", "everysec/always/no 控制刷盘", "重启按日志回放恢复"],
  },
  {
    title: "混合与恢复",
    detail: "降低恢复时间，兼顾完整性",
    points: ["RDB 作为基线 + AOF 增量", "rewrite 压缩历史日志", "示例：SET → AOF → rewrite"],
  },
];

export default function RedisPersistence() {
  return (
    <TopicShell
      eyebrow="Redis 动画"
      title="持久化机制 RDB/AOF"
      subtitle="快照与追加日志的权衡：性能、可靠性与恢复时间。"
      steps={steps}
      panel={[
        { title: "关键点", detail: "RDB 速度快，AOF 数据更完整。" },
        { title: "组合策略", detail: "RDB + AOF 混合持久化。" },
      ]}
      flow={["RDB 快照生成", "AOF 追加落盘"]}
      principles={principles}
      principlesIntro="用 RDB/AOF 两条链路解释性能与可靠性的权衡。"
      diagramClass="redis-persist"
      renderDiagram={(step) => (
        <div className={`redis-persist__stage mode--${step.active}`}>
          {step.active === "rdb" && (
            <div className="redis-persist__grid">
              <section className="persist-card persist-master">
                <div className="persist-card__header">
                  <h3>主节点内存</h3>
                  <span className="persist-tag tag--live">live</span>
                </div>
                <div className="persist-memory">
                  <span />
                  <span className="is-dirty" />
                  <span />
                  <span />
                  <span className="is-dirty" />
                  <span />
                  <span />
                  <span />
                  <span className="is-dirty" />
                </div>
                <div className="persist-write">
                  <div className="persist-label">写入命令</div>
                  <div className="persist-chip-row">
                    <span>SET</span>
                    <span>INCR</span>
                    <span>HSET</span>
                    <span>LPUSH</span>
                  </div>
                </div>
                <div className="persist-traffic">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="persist-dirty">
                  <span className="dirty-dot" />
                  <span>脏页</span>
                </div>
                <div className="persist-steps">
                  <span>父进程持续处理请求</span>
                  <span>⑥ 子进程退出，父进程更新成功时间</span>
                </div>
                <div className="sigchld">
                  <span className="sigchld-dot" />
                  <span>SIGCHLD</span>
                </div>
              </section>

              <section className="persist-card persist-fork">
                <div className="persist-card__header">
                  <h3>fork + COW</h3>
                  <span className="persist-tag tag--rdb">RDB</span>
                </div>
                <div className="fork-tree">
                  <div className="fork-node">主进程</div>
                  <div className="fork-node fork-node--child">子进程</div>
                  <div className="fork-lines">
                    <span className="fork-pulse" />
                  </div>
                </div>
                <div className="fork-split">
                  <span className="split-dot split-dot--left" />
                  <span className="split-dot split-dot--right" />
                </div>
                <div className="persist-steps">
                  <span>① fork: 父进程继续请求</span>
                  <span>② COW: 写入触发拷贝</span>
                </div>
                <div className="cow-pages">
                  <span />
                  <span className="is-copy" />
                  <span />
                  <span className="is-copy" />
                  <span />
                  <span />
                </div>
                <div className="cow-legend">
                  <span className="legend-item">
                    <span className="legend-swatch swatch--shared" />
                    共享页
                  </span>
                  <span className="legend-item">
                    <span className="legend-swatch swatch--copy" />
                    复制页
                  </span>
                </div>
              </section>

              <section className="persist-card persist-rdb">
                <div className="persist-card__header">
                  <h3>子进程序列化</h3>
                  <span className="persist-tag tag--rdb">snapshot</span>
                </div>
                <div className="db-stack">
                  <span className="scan-line" />
                  <span>DB0</span>
                  <span>DB1</span>
                  <span>DB2</span>
                  <span>…</span>
                  <span>DB15</span>
                </div>
                <div className="keyspace">
                  <div className="persist-label">key 类型</div>
                  <div className="type-row">
                    <span>string</span>
                    <span>list</span>
                    <span>set</span>
                    <span>zset</span>
                    <span>hash</span>
                    <span>stream</span>
                  </div>
                </div>
                <div className="persist-binary">
                  <div className="persist-label">RDB 二进制结构</div>
                  <div className="binary-row">
                    <span>header</span>
                    <span>key/value</span>
                    <span>expire</span>
                    <span>EOF</span>
                    <span>checksum</span>
                  </div>
                  <div className="binary-progress">
                    <span />
                  </div>
                </div>
                <div className="persist-steps">
                  <span>③ 遍历 DB / keyspace</span>
                  <span>④ 序列化并写入结构</span>
                </div>
              </section>

              <section className="persist-card persist-disk-card">
                <div className="persist-card__header">
                  <h3>磁盘文件</h3>
                  <span className="persist-tag">persistence</span>
                </div>
                <div className="persist-disk">
                  <div className="disk-platter" />
                  <div className="disk-arm" />
                </div>
                <div className="disk-files">
                  <div className="disk-file disk-file--rdb">dump.rdb</div>
                  <div className="disk-file disk-file--temp">dump.rdb.tmp</div>
                </div>
                <div className="persist-steps">
                  <span>④ 写入 dump.rdb.tmp</span>
                  <span>⑤ fsync + rename 原子替换</span>
                </div>
                <div className="rename-flow">
                  <span className="rename-dot" />
                </div>
                <div className="fsync-rdb">
                  <span />
                  <span>fsync</span>
                </div>
              </section>
            </div>
          )}

          {step.active === "aof" && (
            <div className="redis-persist__grid">
              <section className="persist-card persist-master">
                <div className="persist-card__header">
                  <h3>主节点内存</h3>
                  <span className="persist-tag tag--live">live</span>
                </div>
                <div className="persist-memory">
                  <span />
                  <span className="is-dirty" />
                  <span />
                  <span />
                  <span className="is-dirty" />
                  <span />
                  <span />
                  <span />
                  <span className="is-dirty" />
                </div>
                <div className="persist-write">
                  <div className="persist-label">写入命令</div>
                  <div className="persist-chip-row">
                    <span>SET</span>
                    <span>INCR</span>
                    <span>HSET</span>
                    <span>LPUSH</span>
                  </div>
                </div>
                <div className="persist-traffic">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="persist-steps">
                  <span>写请求驱动日志追加</span>
                  <span>命令顺序即恢复顺序</span>
                </div>
              </section>

              <section className="persist-card persist-aof">
                <div className="persist-card__header">
                  <h3>AOF 追加</h3>
                  <span className="persist-tag tag--aof">append</span>
                </div>
                <div className="aof-buffer">
                  <div className="persist-label">AOF buffer</div>
                  <div className="persist-chip-row">
                    <span>SET</span>
                    <span>EXPIRE</span>
                    <span>ZADD</span>
                    <span>DEL</span>
                  </div>
                </div>
                <div className="aof-append">
                  <div className="persist-label">顺序追加</div>
                  <div className="append-line">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="fsync-panel">
                  <div className="persist-label">fsync 策略</div>
                  <div className="fsync-options">
                    <span className="fsync-option is-active">everysec</span>
                    <span className="fsync-option">always</span>
                    <span className="fsync-option">no</span>
                  </div>
                  <div className="fsync-bar">
                    <span />
                  </div>
                  <div className="fsync-clock">
                    <span className="clock-hand" />
                  </div>
                </div>
                <div className="persist-steps">
                  <span>写命令顺序追加</span>
                  <span>刷盘策略控制持久性</span>
                </div>
              </section>

              <section className="persist-card persist-disk-card">
                <div className="persist-card__header">
                  <h3>磁盘文件</h3>
                  <span className="persist-tag">persistence</span>
                </div>
                <div className="persist-disk">
                  <div className="disk-platter" />
                  <div className="disk-arm" />
                </div>
                <div className="disk-files">
                  <div className="disk-file disk-file--aof">appendonly.aof</div>
                </div>
                <div className="persist-steps">
                  <span>追加写入文件末尾</span>
                  <span>重启按日志回放恢复</span>
                </div>
              </section>
            </div>
          )}

          <div className="persist-streams">
            <div className="persist-stream stream--rdb">
              <div className="stream-label">BGSAVE → 序列化 → dump.rdb.tmp → rename</div>
              <div className="stream-line">
                <span style={{ "--delay": "0s" }} />
                <span style={{ "--delay": "0.6s" }} />
                <span style={{ "--delay": "1.2s" }} />
              </div>
            </div>
            <div className="persist-stream stream--aof">
              <div className="stream-label">写命令追加 → AOF buffer → fsync</div>
              <div className="stream-line">
                <span style={{ "--delay": "0.2s" }} />
                <span style={{ "--delay": "0.8s" }} />
                <span style={{ "--delay": "1.4s" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
