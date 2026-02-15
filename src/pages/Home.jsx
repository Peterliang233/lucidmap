import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import data from "../data.json";

const normalize = (value = "") => value.trim().toLowerCase();

const collectTags = (sections = []) => {
  const tagSet = new Set();
  sections.forEach((section) => {
    section.groups?.forEach((group) => {
      group.items?.forEach((item) => {
        item.tags?.forEach((tag) => tagSet.add(tag));
      });
    });
  });
  return Array.from(tagSet);
};

const matchesQuery = (item, query) => {
  if (!query) return true;
  const haystack = [item.title, item.desc, ...(item.tags || [])].join(" ").toLowerCase();
  return haystack.includes(query);
};

const matchesTag = (item, tag) => {
  if (!tag) return true;
  return (item.tags || []).includes(tag);
};

const isInternalLink = (link) => typeof link === "string" && link.startsWith("/");

export default function HomePage() {
  const { site, legend, sections } = data;
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [collapsed, setCollapsed] = useState({});

  const tagOptions = useMemo(() => {
    const fromConfig = legend && legend.length ? legend : [];
    return fromConfig.length ? fromConfig : collectTags(sections);
  }, [legend, sections]);

  const { filteredSections, totalCount } = useMemo(() => {
    let total = 0;
    const normalized = normalize(query);

    const mapped = (sections || [])
      .map((section) => {
        const groupList = (section.groups || [])
          .map((group, index) => {
            const items = (group.items || []).filter(
              (item) => matchesQuery(item, normalized) && matchesTag(item, activeTag)
            );
            if (!items.length) return null;
            total += items.length;
            return {
              ...group,
              _key: `${section.id || section.title}-${index}`,
              items,
            };
          })
          .filter(Boolean);

        if (!groupList.length) return null;
        return { ...section, groups: groupList };
      })
      .filter(Boolean);

    return { filteredSections: mapped, totalCount: total };
  }, [sections, query, activeTag]);

  const handleTagClick = (tag) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };


  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleGroup = (key) => {
    setCollapsed((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Layout>
      <div className="app">

      <header className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">{site?.tagline || "系统化整理面试八股文"}</p>
          <h1 className="hero__title">知识地图</h1>
          <p className="hero__subtitle">
            {site?.subtitle || "通过配置化目录，把散落的知识点组织成可扩展的地图。"}
          </p>

          <div className="hero__actions">
            <div className="search">
              <input
                type="search"
                placeholder="搜索关键词、标签、主题..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <span className="search__count">{totalCount} 条</span>
            </div>

            <div className="legend">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`legend__item ${activeTag === tag ? "is-active" : ""}`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="hero__panel">
          <div className="panel">
            <h2>配置指南</h2>
            <ol>
              <li>在 <code>src/data.json</code> 的 <code>sections</code> 中新增分类。</li>
              <li>为分类提供 <code>id</code>、<code>title</code> 与 <code>groups</code>。</li>
              <li>每个 <code>item</code> 可配置标题、简介、链接与标签。</li>
            </ol>
            <p className="panel__tip">目录、卡片与标签都会自动生成。</p>
          </div>
        </aside>
      </header>

      <nav className="toc">
        {(sections || []).map((section) => (
          <button
            key={section.id || section.title}
            type="button"
            className="toc__link"
            onClick={() => scrollToSection(section.id)}
          >
            {section.title}
          </button>
        ))}
      </nav>

      <main className="content">
        {filteredSections.length === 0 && (
          <div className="empty">
            <p>没有匹配到内容。</p>
            <span>试试调整关键词或点击其他标签。</span>
          </div>
        )}

        {filteredSections.map((section) => (
          <section key={section.id || section.title} id={section.id} className="section">
            <div className="section__header">
              <h2 className="section__title">{section.title}</h2>
              <p className="section__desc">{section.desc}</p>
            </div>

            {section.groups.map((group) => {
              const isCollapsed = collapsed[group._key];
              return (
                <div key={group._key} className="group">
                  <div className="group__header">
                    <h3 className="group__title">{group.title}</h3>
                    <button
                      type="button"
                      className="group__toggle"
                      onClick={() => toggleGroup(group._key)}
                    >
                      {isCollapsed ? "展开" : "收起"}
                    </button>
                  </div>

                  {!isCollapsed && (
                    <div className="cards">
                      {group.items.map((item) => (
                        <article key={item.title} className="card">
                          <h4 className="card__title">{item.title}</h4>
                          <p className="card__desc">{item.desc}</p>
                          <div className="card__tags">
                            {(item.tags || []).map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                className="tag"
                                onClick={() => handleTagClick(tag)}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                          {item.link && item.link !== "#" && (
                            <div className="card__link">
                              {isInternalLink(item.link) ? (
                                <Link to={item.link}>查看</Link>
                              ) : (
                                <a href={item.link} target="_blank" rel="noreferrer">
                                  查看
                                </a>
                              )}
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}
      </main>

      <footer className="footer">
        <p>{site?.footer || "持续维护中 · 使用 JSON 配置动态扩展"}</p>
      </footer>
      </div>
    </Layout>
  );
}
