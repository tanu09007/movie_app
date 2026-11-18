import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface LayoutProps {
  title: string;
  children: ReactNode;
}

const Layout = ({ title, children }: LayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = title;
  }, [title]);

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="app-topbar">
        <Link className="wordmark" to="/movielist">
          <span className="wordmark-icon" aria-hidden="true">
            M
          </span>
          MOVIE CLUB
        </Link>
        <button className="button button-outline" onClick={handleSignout}>
          Sign out
        </button>
      </header>
      <main className="container">{children}</main>
    </>
  );
};

export default Layout;
