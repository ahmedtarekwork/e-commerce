// react
import { useRef, forwardRef, memo, useEffect, useState } from "react";

// react router dom
import { useLocation } from "react-router-dom";

// redux
import useSelector from "../../../hooks/redux/useSelector";

// components
import MainBtnsList from "../appHeader/MainBtnsList";
import AppSidebarItem, { type SidebarItemProps } from "./AppSidebarItem";
import SidebarWrapper, {
  type SidebarWraperComponentRefType,
} from "../SidebarWrapper";

// icons
import { FaStore } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaListAlt, FaDonate } from "react-icons/fa";
import { BiSolidComponent } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { TbHomeCog } from "react-icons/tb";

// utils
import { nanoid } from "@reduxjs/toolkit";

import { type AnimationControls, AnimatePresence } from "framer-motion";

const Sidebar = memo(
  forwardRef<
    SidebarWraperComponentRefType,
    {
      sidebarItemControlls: AnimationControls;
    }
  >(({ sidebarItemControlls }, ref) => {
    const { pathname } = useLocation();
    const user = useSelector((state) => state.user.user);

    const [closeList, setCloseList] = useState<(HTMLElement | null)[]>([]);

    let navLinks: Omit<SidebarItemProps, "index" | "controller">[] = [];

    if (pathname.includes("dashboard") && user) {
      navLinks = [
        {
          content: "dashboard",
          Icon: MdDashboard,
          path: "/dashboard",
        },
        {
          content: "home page settings",
          Icon: TbHomeCog,
          path: "/dashboard/homePageSettings",
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
        { content: "go to store", path: "/", Icon: FaStore },
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

    const emergencyRef = useRef<SidebarWraperComponentRefType>(null);
    const sidebarRef = ref || emergencyRef;

    useEffect(() => {
      setCloseList([
        document.getElementById("open-side-bar"),
        document.getElementById("app-side-bar"),
        document.querySelector(".header-container"),
        document.querySelector(".app-header"),
      ]);
    }, []);

    return (
      <SidebarWrapper
        insideClose
        id="app-side-bar"
        ref={sidebarRef}
        closeList={{
          reversedList: closeList,
        }}
      >
        <div className="container">
          <MainBtnsList type="sidebar" />
        </div>

        <ul className="app-side-bar-list">
          <AnimatePresence>
            {navLinks.map((item, index) => (
              <AppSidebarItem
                controller={sidebarItemControlls}
                index={index}
                {...item}
                key={nanoid()}
              />
            ))}
          </AnimatePresence>
        </ul>
      </SidebarWrapper>
    );
  })
);

export default Sidebar;
