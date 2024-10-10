// react
import { useRef, forwardRef } from "react";

// react router
import { Link, useLocation } from "react-router-dom";

// icons
import { FaBars } from "react-icons/fa";
import logo from "../../../../assets/favicon.svg";

// components
import MainBtnsList from "./MainBtnsList";
import AppSidebar from "../appSidebar/AppSidebar";
import AppHeaderLogoText from "./AppHeaderLogoText";

// types
import { type SidebarWraperComponentRefType } from "../SidebarWrapper";

// framer motion
import { motion } from "framer-motion";

const Header = forwardRef<HTMLElement>((_, ref) => {
  const { pathname } = useLocation();
  const isDashbaord = pathname.includes("dashboard");

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
              onClick={() => {
                sidebarRef.current?.setToggleSidebar((prev) => !prev);
              }}
            >
              <FaBars />
            </button>

            <Link
              title="go to home page btn"
              to={!isDashbaord ? "/" : "/dashboard"}
              className="logo"
            >
              <motion.img
                initial={{
                  scale: 0,
                  x: -10,
                }}
                animate={{
                  scale: 1,
                  x: 0,
                }}
                width="40px"
                height="40px"
                src={logo}
                alt="Logo Icon"
              />

              <AppHeaderLogoText isDashbaord={isDashbaord} />
            </Link>
          </div>

          <nav>
            <MainBtnsList type="header" />
          </nav>
        </div>
      </header>

      <AppSidebar ref={sidebarRef} />
    </>
  );
});
export default Header;
