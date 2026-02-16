import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import data from "../data.json";
import logo from "../assets/logo-lucidmap.svg";

const isInternalLink = (link) => typeof link === "string" && link.startsWith("/");

const ItemLink = ({ item }) => {
  if (!item?.link || item.link === "#") {
    return <span className="nav-item__disabled">{item?.title}</span>;
  }

  if (isInternalLink(item.link)) {
    return (
      <Link className="nav-item__link" to={item.link}>
        {item.title}
      </Link>
    );
  }

  return (
    <a className="nav-item__link" href={item.link} target="_blank" rel="noreferrer">
      {item.title}
    </a>
  );
};

export default function TopNav() {
  const { sections } = data;
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [dropdownAlign, setDropdownAlign] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const moduleRefs = useRef({});

  const handleToggle = () => setMenuOpen((prev) => !prev);

  const handleSectionToggle = (id) => {
    setActiveSection((prev) => (prev === id ? null : id));
  };

  useLayoutEffect(() => {
    if (!activeSection) return;
    const moduleEl = moduleRefs.current[activeSection];
    if (!moduleEl) return;
    const dropdown = moduleEl.querySelector(".top-nav__dropdown");
    if (!dropdown) return;

    const rect = dropdown.getBoundingClientRect();
    const margin = 16;
    let align = "center";

    if (rect.right > window.innerWidth - margin) align = "right";
    if (rect.left < margin) align = "left";

    setDropdownAlign((prev) => (prev[activeSection] === align ? prev : { ...prev, [activeSection]: align }));
  }, [activeSection, menuOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 12);
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`top-nav ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="top-nav__bar">
        <Link className="top-nav__logo" to="/">
          <img src={logo} alt="LucidMap" />
          <span>LucidMap</span>
        </Link>

        <nav className={`top-nav__menu ${menuOpen ? "is-open" : ""}`}>
          <Link className="top-nav__link" to="/">
            首页
          </Link>
          <Link className="top-nav__link" to="/map">
            知识地图
          </Link>

          <div className="top-nav__modules">
            {(sections || []).map((section) => (
              <div
                key={section.id}
                ref={(el) => {
                  moduleRefs.current[section.id] = el;
                }}
                className={`top-nav__module ${activeSection === section.id ? "is-open" : ""} ${
                  dropdownAlign[section.id] ? `align-${dropdownAlign[section.id]}` : ""
                }`}
              >
                <button
                  type="button"
                  className="top-nav__trigger"
                  onClick={() => handleSectionToggle(section.id)}
                >
                  {section.title}
                </button>

                <div className="top-nav__dropdown">
                  <div className="dropdown__header">
                    <div>
                      <p className="dropdown__title">{section.title}</p>
                      <p className="dropdown__desc">{section.desc}</p>
                    </div>
                  </div>
                  <div className="dropdown__grid">
                    {(section.groups || []).map((group) => (
                      <div key={group.title} className="dropdown__group">
                        <p className="dropdown__group-title">{group.title}</p>
                        <div className="dropdown__items">
                          {(group.items || []).map((item) => (
                            <ItemLink key={item.title} item={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </nav>

        <button className="top-nav__toggle" type="button" onClick={handleToggle}>
          {menuOpen ? "关闭" : "菜单"}
        </button>
      </div>
    </header>
  );
}
