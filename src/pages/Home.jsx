import { useEffect, useMemo, useState } from "react";
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

const PAGE_SIZE = 2;

export default function HomePage() {
  const { site, legend, sections } = data;
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [pageIndex, setPageIndex] = useState(0);

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

  useEffect(() => {
    setPageIndex(0);
  }, [query, activeTag]);

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

  const totalPages = filteredSections.length ? Math.ceil(filteredSections.length / PAGE_SIZE) : 0;
  const safePageIndex = totalPages ? Math.min(pageIndex, totalPages - 1) : 0;
  const pageSections = filteredSections.slice(
    safePageIndex * PAGE_SIZE,
    safePageIndex * PAGE_SIZE + PAGE_SIZE
  );

  useEffect(() => {
    if (!totalPages) return;
    if (pageIndex > totalPages - 1) {
      setPageIndex(totalPages - 1);
    }
  }, [pageIndex, totalPages]);

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

      </header>

      <nav className="toc">
        {pageSections.map((section) => (
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

        {pageSections.map((section) => (
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

      {totalPages > 1 && (
        <div className="map-pagination">
          <button
            type="button"
            className="map-pagination__button"
            onClick={() => setPageIndex((prev) => (prev + 1) % totalPages)}
          >
            下一页
          </button>
        </div>
      )}

      </div>
    </Layout>
  );
}
