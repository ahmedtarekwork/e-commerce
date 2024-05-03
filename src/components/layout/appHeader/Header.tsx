import { useRef, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";

// icons
import { FaBars } from "react-icons/fa";

// components
import MainBtnsList from "./MainBtnsList";
import Sidebar from "./sidebar/Sidebar";

// types
import { sidebarRefType } from "./sidebar/Sidebar";

const Header = forwardRef<HTMLElement>((_, ref) => {
  const { pathname } = useLocation();

  const emergencyRef = useRef<HTMLElement>(null);
  const headerRef = ref || emergencyRef;
  const sidebarRef = useRef<sidebarRefType>(null);

  return (
    <>
      <header ref={headerRef} className="app-header">
        <div className="container header-container">
          <div className="logo-and-open-btn-holder">
            <button
              id="open-side-bar"
              onClick={() => {
                if (sidebarRef.current) {
                  const { toggleSidebar, setToggleSidebar } =
                    sidebarRef.current;

                  setToggleSidebar(!toggleSidebar);
                }
              }}
            >
              <FaBars />
            </button>
            <Link
              to={!pathname.includes("dashboard") ? "/" : "/dashboard"}
              className="logo"
            >
              {!pathname.includes("dashboard")
                ? "E-commerce Store"
                : "Sales Managment"}
            </Link>
          </div>

          <nav>
            <MainBtnsList />
          </nav>
        </div>
      </header>

      <Sidebar ref={sidebarRef} headerRef={headerRef} />
    </>
  );
});
export default Header;
