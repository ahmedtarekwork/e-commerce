// react
import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  Dispatch,
  SetStateAction,
  Ref,
  RefObject,
} from "react";

import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStateType } from "../../../../utiles/types";

// components
import SidebarItem, { SidebarItemProps } from "./SidebarItem";
import MainBtnsList from "../MainBtnsList";

interface props {
  headerRef: Ref<HTMLElement>;
}

export interface sidebarRefType {
  setToggleSidebar: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: boolean;
}

const Sidebar = forwardRef<sidebarRefType, props>(({ headerRef }, ref) => {
  const user = useSelector((state: RootStateType) => state.user.user);

  const isAdmin = user?.isAdmin;

  const { pathname } = useLocation();

  let navLinks: SidebarItemProps[] = [];

  if (pathname.includes("dashboard") && user) {
    navLinks = [
      { content: "go to store", path: "/" },
      { content: "dashboard home page", exact: true, path: "/dashboard" },
      { content: "all orders", exact: true, path: "dashboard/orders" },
      { content: "all products", exact: true, path: "dashboard/products" },
      { content: "all users", exact: true, path: "dashboard/users" },
    ];
  } else {
    navLinks = [
      { content: "home", path: "/" },
      { content: "products", path: "/products" },
    ];

    if (user) {
      navLinks.push({ content: "wishlist", path: "/wishlist" });
      navLinks.push({ content: "cart", path: "/cart" });
      navLinks.push({ content: "orders", path: "/orders" });
    }

    isAdmin
      ? navLinks.push({ content: "go to dashboard", path: "/dashboard" })
      : null;
  }

  const [toggleSidebar, setToggleSidebar] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clickFunc = (e: any) => {
    if (toggleSidebar) {
      if (
        !["open-side-bar", "app-side-bar"].some((id) => e.target.id === id) &&
        !["header-container", "app-header"].some((className) =>
          e.target.classList.contains(className)
        )
      )
        setToggleSidebar(false);
    }
  };
  const keyDownFunc = (e: KeyboardEvent) => {
    if (toggleSidebar) {
      if (e.keyCode === 27) setToggleSidebar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDownFunc);
    window.addEventListener("click", clickFunc);

    return () => {
      window.removeEventListener("click", clickFunc);
      window.removeEventListener("keydown", keyDownFunc);
    };
  }, [toggleSidebar]);

  useEffect(() => {
    // tracking header diminsions => so when width or height changes then we will fire the callback func inside tracker
    const header = (headerRef as unknown as RefObject<HTMLElement>).current;
    const sideBar = sidebarRef.current;

    if (header) {
      const headerDim = new ResizeObserver(() => {
        sideBar!.style.cssText = `
        height: calc(100% - ${header.offsetHeight}px);
        top: ${header.offsetHeight}px
        `;
      });
      headerDim.observe(header);

      return () => {
        headerDim.unobserve(header);
      };
    }
  }, [headerRef]);

  useImperativeHandle(
    ref,
    () => ({
      setToggleSidebar,
      toggleSidebar,
    }),
    [toggleSidebar]
  );

  return (
    <>
      <aside
        ref={sidebarRef}
        id="app-side-bar"
        className={toggleSidebar ? "active" : ""}
      >
        <div className="container">
          <MainBtnsList />
        </div>

        <ul className="app-side-bar-list">
          {navLinks.map((item) => (
            <SidebarItem {...item} key={item.content} />
          ))}
        </ul>
      </aside>
      <div
        id="aside-overlay"
        className={`overlay ${toggleSidebar ? "active" : ""}`}
      ></div>
    </>
  );
});

export default Sidebar;
