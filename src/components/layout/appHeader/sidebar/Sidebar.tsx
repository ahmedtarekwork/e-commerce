// react
import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  type Dispatch,
  type SetStateAction,
  type Ref,
  type RefObject,
} from "react";

// react router dom
import { useLocation } from "react-router-dom";

// redux
import useSelector from "../../../../hooks/redux/useSelector";

// components
import SidebarItem, { type SidebarItemProps } from "./SidebarItem";
import MainBtnsList from "../MainBtnsList";

// icons
import { FaStore } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaListAlt, FaDonate } from "react-icons/fa";
import { BiSolidComponent } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";

// utils
import { nanoid } from "@reduxjs/toolkit";

interface props {
  headerRef: Ref<HTMLElement>;
}

export interface sidebarRefType {
  setToggleSidebar: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: boolean;
}

const Sidebar = forwardRef<sidebarRefType, props>(({ headerRef }, ref) => {
  const user = useSelector((state) => state.user.user);

  const { pathname } = useLocation();

  let navLinks: SidebarItemProps[] = [];

  if (pathname.includes("dashboard") && user) {
    navLinks = [
      { content: "go to store", path: "/", Icon: FaStore },
      {
        content: "dashboard home page",
        Icon: MdDashboard,
        path: "/dashboard",
      },
      {
        content: "all orders",
        path: "/dashboard/orders",
        Icon: FaListAlt,
      },
      {
        content: "all products",
        path: "/dashboard/products",
        Icon: BiSolidComponent,
      },
      {
        content: "all users",
        path: "/dashboard/users",
        Icon: FaUser,
      },
    ];
  } else {
    navLinks = [
      { content: "home", path: "/", Icon: GoHomeFill },
      { content: "products", path: "/products", Icon: BiSolidComponent },
    ];

    if (user) {
      navLinks = [
        ...navLinks,
        {
          content: "your wishlist",
          path: "/wishlist",
          Icon: BsBookmarkHeartFill,
        },
        {
          content: "your cart",
          path: "/cart",
          Icon: FaShoppingCart,
        },
        {
          content: "your orders",
          path: "/orders",
          Icon: FaListAlt,
        },
      ];
    }

    navLinks.push({ content: "donate us", path: "/donate", Icon: FaDonate });
    if (user?.isAdmin) {
      navLinks.push({
        content: "go to dashboard",
        path: "/dashboard",
        Icon: MdDashboard,
      });
    }
  }

  const [toggleSidebar, setToggleSidebar] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
        if (e.key.toLowerCase() === "escape") setToggleSidebar(false);
      }
    };

    window.addEventListener("keydown", keyDownFunc);
    window.addEventListener("click", clickFunc);

    return () => {
      window.removeEventListener("click", clickFunc);
      window.removeEventListener("keydown", keyDownFunc);
    };
  }, [toggleSidebar]); // don't change dependencies array

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

  useImperativeHandle(ref, () => ({ setToggleSidebar, toggleSidebar }), [
    toggleSidebar,
  ]);

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
            <SidebarItem {...item} key={nanoid()} />
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
