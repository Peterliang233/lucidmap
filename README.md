# LucidMap 八股文导航

一个基于 **React + Vite** 的配置化导航站点，用于整理计算机面试八股文知识点。目录、卡片和标签都由 JSON 数据驱动，便于后续持续扩展。

## 功能特性
- JSON 配置化目录与内容
- 关键词搜索（标题 / 描述 / 标签）
- 标签筛选（支持一键切换 / 取消）
- 分组折叠 / 展开
- 专题页路由（如 B+ 树动画页）
- 自适应布局 + 动效卡片

## 技术栈
- React 18
- Vite 5

## 快速开始
访问路径：
- 首页：`#/`
- 知识地图：`#/map`

1. 安装依赖
```
npm install
```

2. 启动开发服务器
```
npm run dev
```

3. 打包
```
npm run build
```

4. 预览
```
npm run preview
```

## 配置说明
所有内容均在 `src/data.json` 中配置。

### 顶层结构
- `site`: 站点信息（标题、副标题、页脚）
- `legend`: 标签列表（可选，缺省自动从内容中收集）
- `sections`: 目录分区列表

### Section 结构
- `id`: 用于锚点定位的唯一标识
- `title`: 分区标题
- `desc`: 分区描述
- `groups`: 分组列表

### Group 结构
- `title`: 分组标题
- `items`: 卡片列表

### Item 结构
- `title`: 卡片标题
- `desc`: 简介
- `link`: 外部链接或内部路由（可选，`#` 表示无链接）
- `tags`: 标签数组


### 内部路由示例
- `src/data.json` 中如果 `link` 以 `/` 开头，会被视为站内路由。
- 示例：`/topics/bplus-tree`（Hash 路由下实际地址为 `#/topics/bplus-tree`）。

### 示例
```
{
  "id": "os",
  "title": "操作系统",
  "desc": "进程、线程、内存、调度与 I/O 关键点",
  "groups": [
    {
      "title": "进程与线程",
      "items": [
        {
          "title": "线程同步与并发控制",
          "desc": "互斥锁、自旋锁、条件变量的对比与适用场景",
          "link": "#",
          "tags": ["高频", "性能优化"]
        }
      ]
    }
  ]
}
```

## 目录结构
```
.
├─ index.html
├─ package.json
├─ vite.config.js
└─ src
   ├─ App.jsx
   ├─ data.json
   ├─ main.jsx
   └─ styles.css
```

## 常见问题
- **Q: 为什么直接打开 HTML 看不到内容？**
  - A: 这是 Vite 项目，需要 `npm run dev` 启动本地服务器。

## 后续建议
- 增加多级目录或专题页
- 增加可视化编辑器（在线维护 JSON）
- 接入真实知识库链接（语雀/Notion/GitBook）
