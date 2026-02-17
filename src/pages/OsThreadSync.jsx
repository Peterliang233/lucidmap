import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";

const steps = [
  {
    id: "mutex-lock",
    mode: "mutex",
    title: "互斥锁：进入临界区",
    summary: "T1 抢到 mutex 进入临界区，T2/T3 进入锁等待队列。",
    lockOwner: "T1",
    criticalOwner: "T1",
    lockQueue: ["T2", "T3"],
    condQueue: [],
    cpu: 12,
    cpuLabel: "低：阻塞等待",
    event: "T1 lock() 成功，T2/T3 阻塞",
    signal: false,
    condition: null,
    threads: [
      {
        id: "T1",
        status: "running",
        tags: [
          { text: "持有 mutex", tone: "lock" },
          { text: "临界区执行", tone: "run" },
        ],
      },
      {
        id: "T2",
        status: "blocked",
        tags: [{ text: "等待 mutex", tone: "wait" }],
      },
      {
        id: "T3",
        status: "blocked",
        tags: [{ text: "等待 mutex", tone: "wait" }],
      },
    ],
    detail: [
      {
        title: "内核动作",
        lines: ["mutex 被占用，失败线程进入 wait queue 并睡眠", "调度器继续让 T1 运行"],
      },
      {
        title: "示例",
        lines: ["T1 lock(L) -> acquired", "T2 lock(L) -> block", "L.wait=[T2,T3]"],
      },
      {
        title: "关键结论",
        lines: ["避免忙等，但有上下文切换成本"],
      },
    ],
  },
  {
    id: "mutex-handoff",
    mode: "mutex",
    title: "互斥锁：唤醒交接",
    summary: "T1 unlock 唤醒 T2，T2 重新调度后获得锁。",
    lockOwner: "T2",
    criticalOwner: "T2",
    lockQueue: ["T3"],
    condQueue: [],
    cpu: 18,
    cpuLabel: "低：唤醒 + 调度",
    event: "unlock -> wake(T2)",
    signal: false,
    condition: null,
    threads: [
      {
        id: "T1",
        status: "ready",
        tags: [{ text: "退出临界区", tone: "idle" }],
      },
      {
        id: "T2",
        status: "running",
        tags: [
          { text: "被唤醒", tone: "signal" },
          { text: "获得 mutex", tone: "lock" },
        ],
      },
      {
        id: "T3",
        status: "blocked",
        tags: [{ text: "继续等待", tone: "wait" }],
      },
    ],
    detail: [
      {
        title: "内核动作",
        lines: ["unlock 唤醒一个等待线程", "被唤醒线程需再次竞争 CPU/锁"],
      },
      {
        title: "示例",
        lines: ["T1 unlock(L)", "wake(T2)", "T2 lock(L) -> acquired"],
      },
      {
        title: "关键结论",
        lines: ["公平性取决于锁实现与调度策略"],
      },
    ],
  },
  {
    id: "spin-contend",
    mode: "spin",
    title: "自旋锁：忙等争用",
    summary: "T1 持锁，T2/T3 在 CPU 上反复 test-and-set。",
    lockOwner: "T1",
    criticalOwner: "T1",
    lockQueue: [],
    condQueue: [],
    cpu: 88,
    cpuLabel: "高：忙等自旋",
    event: "while (test_and_set)",
    signal: false,
    condition: null,
    threads: [
      {
        id: "T1",
        status: "running",
        tags: [
          { text: "持有 spinlock", tone: "lock" },
          { text: "临界区执行", tone: "run" },
        ],
      },
      {
        id: "T2",
        status: "spinning",
        tags: [
          { text: "test-and-set", tone: "spin" },
          { text: "占用 CPU", tone: "spin" },
        ],
      },
      {
        id: "T3",
        status: "spinning",
        tags: [{ text: "持续重试", tone: "spin" }],
      },
    ],
    detail: [
      {
        title: "内核动作",
        lines: ["不进入阻塞队列，线程一直在 CPU 上重试"],
      },
      {
        title: "示例",
        lines: ["while (test_and_set(L)) {}", "unlock 时立刻被某线程抢到"],
      },
      {
        title: "关键结论",
        lines: ["适合短临界区，避免上下文切换"],
      },
    ],
  },
  {
    id: "spin-acquire",
    mode: "spin",
    title: "自旋锁：快速接管",
    summary: "T1 释放后，T2 立即在 CPU 上抢到锁。",
    lockOwner: "T2",
    criticalOwner: "T2",
    lockQueue: [],
    condQueue: [],
    cpu: 70,
    cpuLabel: "中高：仍在自旋",
    event: "unlock -> immediate acquire",
    signal: false,
    condition: null,
    threads: [
      {
        id: "T1",
        status: "ready",
        tags: [{ text: "释放锁", tone: "idle" }],
      },
      {
        id: "T2",
        status: "running",
        tags: [
          { text: "抢到锁", tone: "lock" },
          { text: "继续执行", tone: "run" },
        ],
      },
      {
        id: "T3",
        status: "spinning",
        tags: [{ text: "未命中", tone: "spin" }],
      },
    ],
    detail: [
      {
        title: "内核动作",
        lines: ["没有睡眠/唤醒流程，延迟低"],
      },
      {
        title: "示例",
        lines: ["T1 unlock(L)", "T2 CAS 成功 -> acquired"],
      },
      {
        title: "关键结论",
        lines: ["临界区过长会放大 CPU 浪费"],
      },
    ],
  },
  {
    id: "cond-wait",
    mode: "cond",
    title: "条件变量：等待条件",
    summary: "条件不满足，T1 wait() 释放 mutex 并进入条件队列。",
    lockOwner: null,
    criticalOwner: null,
    lockQueue: [],
    condQueue: ["T1"],
    cpu: 8,
    cpuLabel: "低：睡眠等待",
    event: "wait() -> release mutex",
    signal: false,
    condition: "buffer=0",
    threads: [
      {
        id: "T1",
        status: "sleeping",
        tags: [
          { text: "wait(cond)", tone: "wait" },
          { text: "释放 mutex", tone: "idle" },
        ],
      },
      {
        id: "T2",
        status: "running",
        tags: [{ text: "准备生产", tone: "run" }],
      },
      {
        id: "T3",
        status: "ready",
        tags: [{ text: "空闲", tone: "idle" }],
      },
    ],
    detail: [
      {
        title: "内核动作",
        lines: ["wait 会原子释放 mutex 并睡眠", "条件队列与锁队列分离"],
      },
      {
        title: "示例",
        lines: ["while (buffer==0) wait()", "T1 -> cond.wait"],
      },
      {
        title: "关键结论",
        lines: ["等待条件而非锁，避免无意义轮询"],
      },
    ],
  },
  {
    id: "cond-signal",
    mode: "cond",
    title: "条件变量：唤醒继续",
    summary: "T2 生产数据并 signal，T1 被唤醒后重新加锁。",
    lockOwner: "T1",
    criticalOwner: "T1",
    lockQueue: [],
    condQueue: [],
    cpu: 15,
    cpuLabel: "低：唤醒后重新竞争",
    event: "signal -> wake T1",
    signal: true,
    condition: "buffer=1",
    threads: [
      {
        id: "T1",
        status: "running",
        tags: [
          { text: "被唤醒", tone: "signal" },
          { text: "重新加锁", tone: "lock" },
        ],
      },
      {
        id: "T2",
        status: "ready",
        tags: [{ text: "生产完成", tone: "idle" }],
      },
      {
        id: "T3",
        status: "ready",
        tags: [{ text: "空闲", tone: "idle" }],
      },
    ],
    detail: [
      {
        title: "内核动作",
        lines: ["signal 只唤醒，不直接让出锁", "被唤醒线程需再次 lock"],
      },
      {
        title: "示例",
        lines: ["T2 produce(); signal()", "T1 wake -> lock -> run"],
      },
      {
        title: "关键结论",
        lines: ["使用 while 重新检查条件，避免虚假唤醒"],
      },
    ],
  },
];

const modeLabel = {
  mutex: "互斥锁",
  spin: "自旋锁",
  cond: "条件变量",
};

const statusLabel = {
  running: "RUN",
  blocked: "BLOCK",
  spinning: "SPIN",
  sleeping: "SLEEP",
  ready: "READY",
};

export default function OsThreadSync() {
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
  const lockModeClass = step.mode === "cond" ? "" : "is-active";
  const lockOwnerText = step.lockOwner ? `占用者 ${step.lockOwner}` : "空闲";
  const criticalOwnerText = step.criticalOwner ? `正在执行 ${step.criticalOwner}` : "空闲";
  const conditionText = step.mode === "cond" ? step.condition : "未使用";

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

  return (
    <Layout>
      <div className="topic">
        <header className="topic__hero">
          <div>
            <p className="topic__eyebrow">操作系统动画</p>
            <h1>线程同步与并发控制</h1>
            <p className="topic__subtitle">
              通过互斥锁、自旋锁、条件变量的分步动画，还原内核中的阻塞、忙等与唤醒过程。
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
              <h3>机制对比</h3>
              <p>互斥锁：失败线程阻塞入队，依赖唤醒与调度。</p>
              <p>自旋锁：不睡眠，靠 CAS/TSL 忙等抢锁。</p>
              <p>条件变量：等待条件而非锁，wait 会释放 mutex。</p>
            </div>
            <div className="topic__card">
              <h3>当前场景</h3>
              <p>{step.title}</p>
              <div className="topic__big">{modeLabel[step.mode]}</div>
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

          <div className="sync-stage">
            <div className="sync-diagram" data-mode={step.mode}>
              <div className="sync-resources">
                <div
                  className={`sync-resource ${step.lockOwner ? "is-locked" : ""} ${lockModeClass}`}
                >
                  <div className="sync-resource__title">Mutex / Spinlock</div>
                  <div className="sync-resource__meta">{lockOwnerText}</div>
                  {step.lockOwner ? <span className="sync-resource__badge">LOCKED</span> : null}
                </div>
                <div className={`sync-resource ${step.criticalOwner ? "is-active" : ""}`}>
                  <div className="sync-resource__title">Critical Section</div>
                  <div className="sync-resource__meta">{criticalOwnerText}</div>
                </div>
                <div className={`sync-resource ${step.mode === "cond" ? "is-active" : ""}`}>
                  <div className="sync-resource__title">Condition</div>
                  <div className="sync-resource__meta">{conditionText}</div>
                  <div className={`sync-signal ${step.signal ? "is-on" : ""}`}>signal</div>
                </div>
              </div>

              <div className="sync-lanes">
                {step.threads.map((thread) => (
                  <div key={thread.id} className={`sync-thread is-${thread.status}`}>
                    <div className="sync-thread__header">
                      <span className="sync-thread__pulse" />
                      <span className="sync-thread__label">{thread.id}</span>
                      <span className={`sync-thread__status is-${thread.status}`}>
                        {statusLabel[thread.status]}
                      </span>
                    </div>
                    <div className="sync-thread__tags">
                      {thread.tags.map((tag, index) => (
                        <span
                          key={`${thread.id}-${tag.text}-${index}`}
                          className={`sync-tag ${tag.tone ? `sync-tag--${tag.tone}` : ""}`}
                        >
                          {tag.text}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sync-queues">
                <div className={`sync-queue-box ${step.lockQueue.length ? "is-active" : ""}`}>
                  <strong>锁等待队列</strong>
                  <div className="sync-queue-list">
                    {step.lockQueue.length ? (
                      step.lockQueue.map((item) => (
                        <span key={`lock-${item}`} className="sync-chip">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="sync-empty">empty</span>
                    )}
                  </div>
                </div>
                <div className={`sync-queue-box ${step.condQueue.length ? "is-active" : ""}`}>
                  <strong>条件等待队列</strong>
                  <div className="sync-queue-list">
                    {step.condQueue.length ? (
                      step.condQueue.map((item) => (
                        <span key={`cond-${item}`} className="sync-chip">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="sync-empty">empty</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="sync-cpu">
                <strong>CPU 忙等占用</strong>
                <div className="sync-cpu__bar">
                  <span style={{ width: `${step.cpu}%` }} />
                </div>
                <div className="sync-resource__meta">{step.cpuLabel}</div>
              </div>

              <div className={`sync-event ${step.event ? "is-on" : ""}`}>{step.event}</div>
            </div>

            <div className="sync-detail">
              <div className="sync-detail__card">
                <div className={`sync-mode sync-mode--${step.mode}`}>{modeLabel[step.mode]}</div>
                <div className="sync-detail__title">{step.title}</div>
                <p className="sync-detail__summary">{step.summary}</p>
              </div>
              {step.detail.map((section) => (
                <div key={section.title} className="sync-detail__section">
                  <h4>{section.title}</h4>
                  <div className="sync-detail__lines">
                    {section.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="topic__flow">
            <div className="flow__step">互斥锁通过阻塞与唤醒保证串行进入临界区</div>
            <div className="flow__step">自旋锁用忙等换取低切换成本，适合短临界区</div>
            <div className="flow__step">条件变量释放锁并睡眠，等待条件满足再唤醒</div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
