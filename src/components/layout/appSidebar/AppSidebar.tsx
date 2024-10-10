// react
import { useRef, forwardRef, memo, useEffect, useState } from "react";

// react router dom
import { useLocation } from "react-router-dom";

// redux
import useSelector from "../../../hooks/redux/useSelector";

// components
import MainBtnsList from "../appHeader/mainBtnsList/MainBtnsList";
import AppSidebarItem from "./AppSidebarItem";
import SidebarWrapper, {
  type SidebarWraperComponentRefType,
} from "../SidebarWrapper";

// utils
import sidebarLink from "../../../constants/sidebarLinks";

const Sidebar = memo(
  forwardRef<SidebarWraperComponentRefType>((_, ref) => {
    const { pathname } = useLocation();
    const user = useSelector((state) => state.user.user);

    const [closeList, setCloseList] = useState<(HTMLElement | null)[]>([]);

    const navLinks = sidebarLink({ pathname, user });

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
          {navLinks.map(({ id, ...item }, index) => (
            <AppSidebarItem index={index} {...item} key={id} />
          ))}
        </ul>
      </SidebarWrapper>
    );
  })
);

export default Sidebar;
