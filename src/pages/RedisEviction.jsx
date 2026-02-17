import { useEffect } from "react";
import hljs from "highlight.js/lib/core";
import cpp from "highlight.js/lib/languages/cpp";
import TopicShell from "../components/TopicShell.jsx";

hljs.registerLanguage("cpp", cpp);

const steps = [
  {
    id: "ttl",
    title: "TTL 过期",
    description: "优先淘汰已过期的 key。",
    bullets: ["惰性删除", "定期扫描"],
    active: "ttl",
    evict: "session:404",
  },
  {
    id: "lru",
    title: "LRU",
    description: "淘汰最近最少使用的键。",
    bullets: ["访问时间", "缓存命中率"],
    active: "lru",
    evict: "config:v1",
  },
  {
    id: "lfu",
    title: "LFU",
    description: "淘汰访问频次最低的键。",
    bullets: ["频次统计", "热点保护"],
    active: "lfu",
    evict: "coupon:trial",
  },
];

const principles = [
  {
    title: "触发与抽样",
    detail: "超过 maxmemory 后进入淘汰",
    points: ["触顶才触发淘汰", "random-sample 选择候选", "逐步释放直到回落"],
  },
  {
    title: "TTL/LRU/LFU 对比",
    detail: "不同维度衡量热度",
    points: ["TTL 优先过期键", "LRU 看最近访问", "LFU 看访问频次"],
  },
  {
    title: "策略选型",
    detail: "allkeys vs volatile",
    points: ["allkeys 适合纯缓存", "volatile 只淘汰带过期键", "示例：热点 key 优先保护"],
  },
];

const samples = [
  { key: "user:1001", ttl: "60s", freq: 8, age: "刚访问" },
  { key: "config:v1", ttl: "永久", freq: 1, age: "30m 未访问" },
  { key: "session:404", ttl: "已过期", freq: 2, age: "5m 未访问" },
  { key: "feed:hot", ttl: "120s", freq: 6, age: "10s 未访问" },
  { key: "coupon:trial", ttl: "20s", freq: 0, age: "15m 未访问" },
  { key: "product:sku", ttl: "180s", freq: 4, age: "2m 未访问" },
  { key: "cart:889", ttl: "90s", freq: 3, age: "1m 未访问" },
  { key: "topic:news", ttl: "45s", freq: 5, age: "20s 未访问" },
];

const lruCode = `class LRUCache {
  struct Node {
    int key, val;
    Node *prev, *next;
    Node(int k, int v) : key(k), val(v), prev(nullptr), next(nullptr) {}
  };
  int cap;
  unordered_map<int, Node*> mp;
  Node *head, *tail;

  void remove(Node* node) {
    node->prev->next = node->next;
    node->next->prev = node->prev;
  }

  void pushFront(Node* node) {
    node->next = head->next;
    node->prev = head;
    head->next->prev = node;
    head->next = node;
  }

public:
  LRUCache(int capacity) : cap(capacity) {
    head = new Node(-1, -1);
    tail = new Node(-1, -1);
    head->next = tail;
    tail->prev = head;
  }

  int get(int key) {
    if (!mp.count(key)) return -1;
    Node* node = mp[key];
    remove(node);
    pushFront(node);
    return node->val;
  }

  void put(int key, int value) {
    if (mp.count(key)) {
      Node* node = mp[key];
      node->val = value;
      remove(node);
      pushFront(node);
      return;
    }
    if ((int)mp.size() == cap) {
      Node* lru = tail->prev;
      remove(lru);
      mp.erase(lru->key);
      delete lru;
    }
    Node* node = new Node(key, value);
    mp[key] = node;
    pushFront(node);
  }
};`;

const lfuCode = `class LFUCache {
  struct Node {
    int key, val, freq;
    list<int>::iterator it;
  };
  int cap, minFreq;
  unordered_map<int, Node> nodes;
  unordered_map<int, list<int>> freqList;

  void touch(int key) {
    int f = nodes[key].freq;
    freqList[f].erase(nodes[key].it);
    if (freqList[f].empty()) {
      freqList.erase(f);
      if (minFreq == f) minFreq++;
    }
    nodes[key].freq++;
    int nf = nodes[key].freq;
    freqList[nf].push_front(key);
    nodes[key].it = freqList[nf].begin();
  }

public:
  LFUCache(int capacity) : cap(capacity), minFreq(0) {}

  int get(int key) {
    if (!nodes.count(key)) return -1;
    touch(key);
    return nodes[key].val;
  }

  void put(int key, int value) {
    if (cap == 0) return;
    if (nodes.count(key)) {
      nodes[key].val = value;
      touch(key);
      return;
    }
    if ((int)nodes.size() == cap) {
      int evict = freqList[minFreq].back();
      freqList[minFreq].pop_back();
      if (freqList[minFreq].empty()) freqList.erase(minFreq);
      nodes.erase(evict);
    }
    minFreq = 1;
    freqList[1].push_front(key);
    nodes[key] = {key, value, 1, freqList[1].begin()};
  }
};`;

export default function RedisEviction() {
  useEffect(() => {
    document.querySelectorAll("pre code.language-cpp").forEach((block) => {
      hljs.highlightElement(block);
    });
  }, []);

  return (
    <TopicShell
      eyebrow="Redis 动画"
      title="缓存淘汰策略"
      subtitle="不同淘汰算法影响命中率与稳定性。"
      steps={steps}
      panel={[
        { title: "常见策略", detail: "allkeys-lru / allkeys-lfu / volatile-ttl" },
        { title: "选择原则", detail: "业务热点分布与容量。" },
      ]}
      flow={["TTL 优先清理过期", "LRU 偏向近期热点", "LFU 保护高频"]}
      principles={principles}
      principlesIntro="解释淘汰触发、候选选择与策略差异。"
      diagramClass="redis-evict"
      renderDiagram={(step) => (
        <div className={`redis-evict__grid mode--${step.active}`}>
          <div className="evict-sample">
            <div>
              <h3>样本缓存池</h3>
              <p>通过具体 key 示例对比 TTL/LRU/LFU 的淘汰决策。</p>
            </div>
            <div className="evict-legend">
              <span className="legend-item">TTL=已过期</span>
              <span className="legend-item">LRU=最久未访问</span>
              <span className="legend-item">LFU=访问频次最低</span>
            </div>
          </div>

          <div className="evict-list">
            {samples.map((item) => {
              const isEvict = step.evict === item.key;
              return (
                <div key={item.key} className={`evict-card ${isEvict ? "is-evict" : ""}`}>
                  <div>
                    <p className="evict-key">{item.key}</p>
                    <p className="evict-meta">{item.age}</p>
                  </div>
                  <div className="evict-badges">
                    <span className={`badge badge--ttl ${item.ttl === "已过期" ? "is-hot" : ""}`}>
                      TTL {item.ttl}
                    </span>
                    <span className={`badge badge--freq ${item.freq === 0 ? "is-hot" : ""}`}>
                      访问 {item.freq}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="evict-marker">淘汰目标：{step.evict}</div>

          <div className="evict-code">
            <div className="code-card">
              <div className="code-card__header">
                <h3>LRU Cache · C++ (LeetCode)</h3>
                <span>HashMap + 双向链表</span>
              </div>
              <pre className="code-block">
                <code className="language-cpp">{lruCode}</code>
              </pre>
            </div>
            <div className="code-card">
              <div className="code-card__header">
                <h3>LFU Cache · C++ (LeetCode)</h3>
                <span>HashMap + 频次链表</span>
              </div>
              <pre className="code-block">
                <code className="language-cpp">{lfuCode}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    />
  );
}
