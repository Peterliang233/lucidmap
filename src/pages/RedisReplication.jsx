import TopicShell from "../components/TopicShell.jsx";

const steps = [
  {
    id: "full",
    title: "全量同步",
    description: "主节点生成 RDB，发送给从节点。",
    bullets: ["RDB 同步", "首次复制"],
    active: "full",
  },
  {
    id: "incr",
    title: "增量同步",
    description: "通过复制缓冲区传输命令。",
    bullets: ["replication backlog", "高效"],
    active: "incr",
  },
  {
    id: "failover",
    title: "哨兵故障转移",
    description: "选举新主，提升高可用。",
    bullets: ["自动切换", "通知客户端"],
    active: "failover",
  },
];

export default function RedisReplication() {
  return (
    <TopicShell
      eyebrow="Redis 动画"
      title="主从复制与哨兵"
      subtitle="复制、增量同步与自动故障转移。"
      steps={steps}
      panel={[
        { title: "目的", detail: "提升可用性与读性能。" },
        { title: "注意点", detail: "复制延迟、数据一致性。" },
      ]}
      flow={["首次全量同步", "后续增量传播", "哨兵自动故障转移"]}
      diagramClass="redis-repl"
      renderDiagram={(step) => (
        <div className={`redis-repl__stage mode--${step.active}`}>
          {step.active === "full" && (
            <div className="repl-scene repl-scene--full">
              <div className="repl-columns">
                <div className="repl-col repl-col--master">
                  <div className="repl-node master">Master</div>
                  <div className="repl-step-card">
                    <h4>1. fork 子进程</h4>
                    <p>子进程生成 RDB 快照。</p>
                  </div>
                  <div className="repl-snapshot">
                    <div className="snapshot-title">RDB Snapshot</div>
                    <div className="snapshot-blocks">
                      <span />
                      <span />
                    </div>
                    <div className="snapshot-meta">全量数据序列化</div>
                  </div>
                  <div className="repl-step-card">
                    <h4>2. 发送快照</h4>
                    <p>通过 Psync2 传输 RDB。</p>
                  </div>
                </div>

                <div className="repl-col repl-col--replica">
                  <div className="repl-node">Replica A</div>
                  <div className="repl-node">Replica B</div>
                  <div className="repl-step-card">
                    <h4>3. 接收快照</h4>
                    <p>加载 RDB 并初始化数据。</p>
                  </div>
                  <div className="repl-step-card">
                    <h4>4. 同步 offset</h4>
                    <p>进入增量复制阶段。</p>
                  </div>
                </div>
              </div>

              <div className="repl-links">
                <div className="repl-link-row">
                  <span className="link-label">RDB</span>
                  <div className="repl-link" />
                  <div className="repl-progress">
                    <div className="progress-bar">
                      <span />
                    </div>
                  </div>
                </div>
                <div className="repl-link-row">
                  <span className="link-label">Psync2 + offset</span>
                  <div className="repl-link" />
                  <div className="repl-progress">
                    <div className="progress-bar">
                      <span />
                    </div>
                  </div>
                </div>
              </div>

              <div className="repl-psync">
                <span>Psync2</span>
                <span>offset</span>
              </div>
              <div className="repl-flow-label">全量同步（RDB 快照 + Psync）</div>
            </div>
          )}

          {step.active === "incr" && (
            <div className="repl-scene repl-scene--incr">
              <div className="repl-node master">Master</div>
              <div className="repl-link" aria-hidden="true" />
              <div className="repl-buffer">
                <div className="buffer-title">Replication Backlog</div>
                <div className="buffer-bar">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="repl-link" aria-hidden="true" />
              <div className="repl-replicas">
                <div className="repl-node">Replica A</div>
                <div className="repl-node">Replica B</div>
              </div>
              <div className="repl-pipe">
                <div className="pipe-seg" />
                <div className="pipe-seg" />
                <div className="pipe-seg" />
              </div>
              <div className="repl-flow-label">增量复制（Backlog 续传）</div>
            </div>
          )}

          {step.active === "failover" && (
            <div className="repl-scene repl-scene--failover">
              <div className="repl-sentinel sentinel-card">
                <div className="sentinel-title">Sentinel</div>
                <div className="sentinel-list">
                  <span>监控</span>
                  <span>投票</span>
                  <span>故障转移</span>
                </div>
              </div>
              <div className="repl-failover failover-track">
                <div className="track-node old">旧主</div>
                <div className="track-node new">新主</div>
                <div className="track-arrow" />
              </div>
              <div className="repl-flow-label">故障转移（选举 + 切主）</div>
            </div>
          )}
        </div>
      )}
    />
  );
}
