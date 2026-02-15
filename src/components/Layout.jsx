import TopNav from "./TopNav.jsx";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <div className="bg-veil" aria-hidden="true" />
      <TopNav />
      {children}
    </div>
  );
}
