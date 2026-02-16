import TopNav from "./TopNav.jsx";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <div className="bg-veil" aria-hidden="true" />
      <TopNav />
      <main className="layout__content">{children}</main>
      <footer className="footer">
        <p>Copyright © 2026 peterliang. All Rights Reserved. peterliang 版权所有</p>
      </footer>
    </div>
  );
}
