// icons
import { FaStore } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { FaUser, FaListAlt, FaDonate } from "react-icons/fa";
import { BiSolidComponent } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import { BsBookmarkHeartFill } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { TbHomeCog } from "react-icons/tb";
import { TbCategory } from "react-icons/tb";
import { SiBrandfolder } from "react-icons/si";

// types
import type { SidebarItemProps } from "../components/layout/appSidebar/AppSidebarItem";
import type { UserType } from "../utils/types";
import { nanoid } from "@reduxjs/toolkit";

type Props = { pathname: string; user: UserType | null };

const sidebarLink = ({ pathname, user }: Props) => {
  let navLinks: (Omit<SidebarItemProps, "index" | "controller"> & {
    id: string;
  })[] = [];

  if (pathname.includes("dashboard") && user) {
    navLinks = [
      {
        id: nanoid(),
        content: "dashboard",
        Icon: MdDashboard,
        path: "/dashboard",
      },
      {
        id: nanoid(),
        content: "home page settings",
        Icon: TbHomeCog,
        path: "/dashboard/homePageSettings",
      },
      {
        id: nanoid(),
        content: "all categories",
        Icon: TbCategory,
        path: "/dashboard/categories",
      },
      {
        id: nanoid(),
        content: "all brands",
        Icon: SiBrandfolder,
        path: "/dashboard/brands",
      },
      {
        id: nanoid(),
        content: "all orders",
        path: "/dashboard/orders",
        Icon: FaListAlt,
      },
      {
        id: nanoid(),
        content: "all products",
        path: "/dashboard/products",
        Icon: BiSolidComponent,
      },
      {
        id: nanoid(),
        content: "all users",
        path: "/dashboard/users",
        Icon: FaUser,
      },
      {
        id: nanoid(),
        content: "go to store",
        path: "/",
        Icon: FaStore,
      },
    ];
  } else {
    navLinks = [
      {
        id: nanoid(),
        content: "home",
        path: "/",
        Icon: GoHomeFill,
      },
      {
        id: nanoid(),
        content: "products",
        path: "/products",
        Icon: BiSolidComponent,
      },
      {
        id: nanoid(),
        content: "categories",
        Icon: TbCategory,
        path: "/categories",
      },
      {
        id: nanoid(),
        content: "brands",
        Icon: SiBrandfolder,
        path: "/brands",
      },
    ];

    if (user) {
      navLinks = [
        ...navLinks,
        {
          id: nanoid(),
          content: "your wishlist",
          path: "/wishlist",
          Icon: BsBookmarkHeartFill,
        },
        {
          id: nanoid(),
          content: "your cart",
          path: "/cart",
          Icon: FaShoppingCart,
        },
        {
          id: nanoid(),
          content: "your orders",
          path: "/orders",
          Icon: FaListAlt,
        },
      ];
    }

    navLinks.push({
      id: nanoid(),
      content: "donate us",
      path: "/donate",
      Icon: FaDonate,
    });

    if (user?.isAdmin) {
      navLinks.push({
        id: nanoid(),
        content: "go to dashboard",
        path: "/dashboard",
        Icon: MdDashboard,
      });
    }
  }

  return navLinks;
};

export default sidebarLink;
