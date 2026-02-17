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

const principles = [
  {
    title: "全量同步触发",
    detail: "runid/offset 不匹配会退回全量",
    points: ["PSYNC ? -1 首次全量", "runid 不一致 → FULLRESYNC", "offset 不在 backlog → FULLRESYNC"],
  },
  {
    title: "增量同步路径",
    detail: "Backlog 续传，补齐缺口",
    points: ["+CONTINUE 表示可增量", "回放 backlog 追平 offset", "实时复制保持一致"],
  },
  {
    title: "哨兵故障转移",
    detail: "观察 → 投票 → 选主 → 重配",
    points: ["SDOWN/ODOWN 触发选举", "按优先级/offset 选新主", "SLAVEOF 重配拓扑"],
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
      principles={principles}
      principlesIntro="从 PSYNC、backlog 到哨兵选主，拆解高可用链路。"
      diagramClass="redis-repl"
      renderDiagram={(step) => (
        <div className={`redis-repl__stage mode--${step.active}`}>
          {step.active === "full" && (
            <div className="repl-scene repl-scene--full">
              <div className="repl-full-handshake">
                <div className="repl-msg repl-msg--from-replica">
                  <div className="msg-title">① 从节点发起</div>
                  <div className="msg-body">PSYNC ? -1</div>
                </div>
                <div className="repl-msg repl-msg--from-master">
                  <div className="msg-title">② 主节点回复</div>
                  <div className="msg-body">+FULLRESYNC &lt;runid&gt; &lt;offset&gt;</div>
                </div>
              </div>

              <div className="repl-full-grid">
                <div className="repl-full-col repl-full-col--master">
                  <div className="repl-node master">Master</div>
                  <div className="repl-step-card">
                    <h4>③ BGSAVE</h4>
                    <p>fork 子进程生成 RDB（COW）。</p>
                  </div>
                  <div className="repl-cow">
                    <div className="cow-chip">Linux COW</div>
                    <div className="cow-line" />
                    <div className="cow-note">这是全量同步的核心开销</div>
                  </div>
                  <div className="repl-snapshot snapshot-card">
                    <div className="snapshot-title">RDB Snapshot</div>
                    <div className="snapshot-blocks">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="snapshot-meta">子进程序列化全量数据</div>
                  </div>
                  <div className="repl-write-queue">
                    <div className="queue-title">④ 新写命令进入 backlog</div>
                    <div className="queue-chips">
                      <span>SET</span>
                      <span>INCR</span>
                      <span>HSET</span>
                      <span>DEL</span>
                    </div>
                  </div>
                  <div className="repl-backlog-ring">
                    <div className="ring-title">replication backlog buffer</div>
                    <div className="ring-core" />
                    <div className="ring-dot dot-a" />
                    <div className="ring-dot dot-b" />
                    <div className="ring-dot dot-c" />
                    <div className="ring-label">环形缓冲区</div>
                  </div>
                </div>

                <div className="repl-full-middle">
                  <div className="repl-stream rdb-stream">
                    <div className="stream-label">⑤ 发送 RDB</div>
                    <div className="stream-line">
                      <span style={{ "--delay": "0s" }} />
                      <span style={{ "--delay": "0.6s" }} />
                      <span style={{ "--delay": "1.2s" }} />
                    </div>
                  </div>
                  <div className="repl-stream cmd-stream">
                    <div className="stream-label">⑥ 回放 backlog 命令</div>
                    <div className="stream-line">
                      <span style={{ "--delay": "0.2s" }} />
                      <span style={{ "--delay": "0.8s" }} />
                      <span style={{ "--delay": "1.4s" }} />
                    </div>
                  </div>
                </div>

                <div className="repl-full-col repl-full-col--replica">
                  <div className="repl-node">Replica</div>
                  <div className="repl-step-card">
                    <h4>⑤ 清空旧数据并加载 RDB</h4>
                    <p>加载期间阻塞。</p>
                  </div>
                  <div className="repl-load-card">
                    <div className="load-bar">
                      <span />
                    </div>
                    <p>RDB 加载进度</p>
                  </div>
                  <div className="repl-step-card">
                    <h4>⑥ 执行增量命令</h4>
                    <p>补齐生成 RDB 期间的写入。</p>
                  </div>
                  <div className="repl-apply-card">
                    <div className="apply-bar">
                      <span />
                    </div>
                    <p>backlog 回放完成</p>
                  </div>
                  <div className="repl-ready">⑦ offset 一致，进入增量同步</div>
                </div>
              </div>

              <div className="repl-full-notes">
                <span>PSYNC ? -1 → FULLRESYNC</span>
                <span>主进程持续处理写入</span>
                <span>RDB 完成后补齐 backlog</span>
              </div>
              <div className="repl-flow-label">全量同步（RDB 快照 + Psync）</div>
            </div>
          )}

          {step.active === "incr" && (
            <div className="repl-scene repl-scene--incr">
              <div className="repl-incr-handshake">
                <div className="repl-msg repl-msg--from-replica">
                  <div className="msg-title">① 断线重连</div>
                  <div className="msg-body">PSYNC &lt;runid&gt; &lt;offset&gt;</div>
                </div>
                <div className="repl-msg repl-msg--from-master">
                  <div className="msg-title">③ 可以增量同步</div>
                  <div className="msg-body">+CONTINUE</div>
                </div>
              </div>

              <div className="repl-incr-grid">
                <div className="repl-incr-col">
                  <div className="repl-node master">Master</div>
                  <div className="repl-step-card">
                    <h4>② 判断是否可部分同步</h4>
                    <p>runid 匹配，offset 在 backlog 范围内。</p>
                  </div>
                  <div className="repl-decision">
                    <div className="decision-title">判断逻辑</div>
                    <div className="decision-item">runid 不一致 → FULLRESYNC</div>
                    <div className="decision-item">offset &lt; backlog 起点 → FULLRESYNC</div>
                    <div className="decision-item">否则 → CONTINUE</div>
                  </div>
                </div>

                <div className="repl-incr-middle">
                  <div className="repl-backlog repl-buffer">
                    <div className="buffer-title">Replication Backlog</div>
                    <div className="backlog-range">
                      <span className="range-start">start</span>
                      <div className="range-bar">
                        <span className="range-dot" />
                      </div>
                      <span className="range-end">end</span>
                    </div>
                    <div className="buffer-offset">取 offset 之后的命令</div>
                  </div>
                  <div className="repl-stream cmd-stream">
                    <div className="stream-label">③ 发送 backlog 命令</div>
                    <div className="stream-line">
                      <span style={{ "--delay": "0.2s" }} />
                      <span style={{ "--delay": "0.8s" }} />
                      <span style={{ "--delay": "1.4s" }} />
                    </div>
                  </div>
                </div>

                <div className="repl-incr-col">
                  <div className="repl-node">Replica</div>
                  <div className="repl-step-card">
                    <h4>③ 执行增量命令</h4>
                    <p>回放 backlog 追平。</p>
                  </div>
                  <div className="repl-apply-card">
                    <div className="apply-bar">
                      <span />
                    </div>
                    <p>slave_offset 追上 master_offset</p>
                  </div>
                  <div className="repl-ready">④ 进入实时复制</div>
                </div>
              </div>

              <div className="repl-live-stream">
                <div className="live-label">正常命令流实时复制</div>
                <div className="stream-line">
                  <span style={{ "--delay": "0s" }} />
                  <span style={{ "--delay": "0.6s" }} />
                  <span style={{ "--delay": "1.2s" }} />
                </div>
              </div>
              <div className="repl-flow-label">增量同步（PSYNC + Backlog 续传）</div>
            </div>
          )}

          {step.active === "failover" && (
            <div className="repl-scene repl-scene--failover">
              <div className="failover-interaction">
                <div className="failover-canvas">
                  <svg
                    className="failover-lines"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <marker
                        id="fo-arrow"
                        markerWidth="6"
                        markerHeight="6"
                        refX="5"
                        refY="3"
                        orient="auto"
                      >
                        <path d="M0,0 L6,3 L0,6 Z" fill="rgba(42, 111, 107, 0.4)" />
                      </marker>
                    </defs>
                    <line
                      className="fo-line fo-line--alert"
                      x1="18"
                      y1="50"
                      x2="80"
                      y2="18"
                      markerEnd="url(#fo-arrow)"
                    />
                    <line
                      className="fo-line"
                      x1="18"
                      y1="50"
                      x2="80"
                      y2="38"
                      markerEnd="url(#fo-arrow)"
                    />
                    <line
                      className="fo-line fo-line--select"
                      x1="18"
                      y1="50"
                      x2="80"
                      y2="58"
                      markerEnd="url(#fo-arrow)"
                    />
                    <line
                      className="fo-line"
                      x1="18"
                      y1="50"
                      x2="80"
                      y2="80"
                      markerEnd="url(#fo-arrow)"
                    />
                  </svg>

                  <div className="failover-sentinel">
                    <div className="sentinel-cluster">
                      <div className="sentinel-node leader">
                        S1
                        <span className="sentinel-badge badge-candidate">Candidate</span>
                        <span className="sentinel-badge badge-leader">Leader</span>
                        <span className="sentinel-epoch">epoch+1</span>
                      </div>
                      <div className="sentinel-node s2">
                        S2
                        <span className="sentinel-badge badge-lock">1/epoch</span>
                        <span className="sentinel-badge badge-voted">VOTED</span>
                      </div>
                      <div className="sentinel-node s3">
                        S3
                        <span className="sentinel-badge badge-lock">1/epoch</span>
                        <span className="sentinel-badge badge-voted">VOTED</span>
                      </div>
                      <div className="vote-line line-2" />
                      <div className="vote-line line-3" />
                      <span className="vote-dot dot-self" />
                      <span className="vote-dot dot-2" />
                      <span className="vote-dot dot-3" />
                      <div className="epoch-meter" aria-hidden="true">
                        <span className="epoch-old">epoch 41</span>
                        <span className="epoch-new">epoch 42</span>
                      </div>
                      <div className="vote-meter" aria-hidden="true">
                        <span className="vote-chip" />
                        <span className="vote-chip" />
                        <span className="vote-chip vote-chip--idle" />
                        <span className="vote-count">2/3</span>
                        <span className="vote-quorum">quorum</span>
                      </div>
                      <div className="leader-halo" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="failover-nodes">
                    <div className="criteria-legend">
                      <span>P↓</span>
                      <span>O↑</span>
                      <span>R↓</span>
                    </div>
                    <div className="failover-node master down">
                      Master
                      <span className="node-badge badge-warn">SDOWN</span>
                    </div>
                    <div className="failover-node replica picked">
                      Replica A
                      <span className="node-badge badge-master">NEW</span>
                      <div className="node-metrics">
                        <span className="metric best" style={{ "--fill": "95%" }}>
                          P1
                        </span>
                        <span className="metric best" style={{ "--fill": "90%" }}>
                          O98
                        </span>
                        <span className="metric best" style={{ "--fill": "85%" }}>
                          R01
                        </span>
                      </div>
                    </div>
                    <div className="failover-node replica">
                      Replica B
                      <div className="node-metrics">
                        <span className="metric" style={{ "--fill": "55%" }}>
                          P2
                        </span>
                        <span className="metric" style={{ "--fill": "70%" }}>
                          O92
                        </span>
                        <span className="metric" style={{ "--fill": "40%" }}>
                          R09
                        </span>
                      </div>
                    </div>
                    <div className="failover-node replica">
                      Replica C
                      <div className="node-metrics">
                        <span className="metric" style={{ "--fill": "45%" }}>
                          P3
                        </span>
                        <span className="metric" style={{ "--fill": "60%" }}>
                          O90
                        </span>
                        <span className="metric" style={{ "--fill": "30%" }}>
                          R12
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="failover-actions">
                    <span>SLAVEOF NO ONE</span>
                    <span>SLAVEOF New Master</span>
                  </div>
                </div>
                <div className="failover-legend">
                  <span>P: slave-priority（越小越优先）</span>
                  <span>O: replication offset（越大数据越新）</span>
                  <span>R: runid（越小越优先）</span>
                </div>
              </div>
              <div className="repl-flow-label">故障转移：哨兵观察 → 投票 → 选主 → 重配</div>
            </div>
          )}
        </div>
      )}
    />
  );
}
