import { useRef, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";

// icons
import { FaBars } from "react-icons/fa";
import logo from "../../../../assets/favicon.svg";

// components
import MainBtnsList from "./MainBtnsList";
import Sidebar from "./sidebar/AppSidebar";
import { type SidebarWraperComponentRefType } from "../SidebarWrapper";

const Header = forwardRef<HTMLElement>((_, ref) => {
  const { pathname } = useLocation();

  const emergencyRef = useRef<HTMLElement>(null);
  const headerRef = ref || emergencyRef;
  const sidebarRef = useRef<SidebarWraperComponentRefType>(null);

  return (
    <>
      <header ref={headerRef} className="app-header">
        <div className="container header-container">
          <div className="logo-and-open-btn-holder">
            <button
              title="toggle app sidebar btn"
              id="open-side-bar"
              onClick={() =>
                sidebarRef.current?.setToggleSidebar((prev) => !prev)
              }
            >
              <FaBars />
            </button>

            <Link
              title="go to home page btn"
              to={!pathname.includes("dashboard") ? "/" : "/dashboard"}
              className="logo"
            >
              <img width="40px" height="40px" src={logo} alt="Logo Icon" />
              {!pathname.includes("dashboard")
                ? "E-commerce Store"
                : "Sales Managment"}
            </Link>
          </div>

          <nav>
            <MainBtnsList type="header" />
          </nav>
        </div>
      </header>

      <Sidebar ref={sidebarRef} />
    </>
  );
});
export default Header;
