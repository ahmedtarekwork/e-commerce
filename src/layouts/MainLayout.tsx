// react
import { useEffect, useRef } from "react";

// router
import { Outlet, useLocation } from "react-router-dom";

// components
import Header from "../components/layout/appHeader/Header";
import Footer from "../components/layout/Footer";
import TopMessage, { type TopMessageRefType } from "../components/TopMessage";

const MainLayout = () => {
  const { pathname } = useLocation();

  const showHeader = !["login", "signup"].some((path) =>
    pathname.includes(path)
  );

  const makePageFullHeight = [
    "profile",
    "singleUser",
    "cart",
    "donate",
    "products",
  ].some((path) => pathname.includes(path));

  // refs
  const headerRef = useRef<HTMLElement>(null);
  const mainElRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const msgRef = useRef<TopMessageRefType>(null);

  useEffect(() => {
    const header = headerRef.current;
    const mainEl = mainElRef.current;
    const footer = footerRef.current;

    if (showHeader) {
      if (header && mainEl && footer) {
        const headerDim = new ResizeObserver(() => {
          mainEl.style.cssText = `
          margin-top: calc(${header.offsetHeight}px + 15px);
          --remove-size: ${header.offsetHeight + footer.offsetHeight + 15}px;
          `;
        });

        headerDim.observe(header);

        return () => headerDim.unobserve(header);
      }
    } else {
      if (mainEl && footer)
        mainEl.style.cssText = `--remove-size: ${footer.offsetHeight}px`;

      document
        .querySelector<HTMLElement>(".app-holder")!
        .style.removeProperty("margin-top");
    }
  }, [showHeader]);

  useEffect(() => {
    const msgData = msgRef.current;

    if (msgData) {
      const offlineFn = () => {
        msgData.setMessageData?.({
          show: true,
          clr: "red",
          content: "you are offline, check your internet connection",
          remove: false,
        });
      };
      const onlineFn = () => {
        msgData.setMessageData?.({
          show: true,
          clr: "green",
          content: "you back online again",
          time: 2500,
        });
      };

      window.addEventListener("offline", offlineFn);
      window.addEventListener("online", onlineFn);

      return () => {
        window.removeEventListener("offline", offlineFn);
        window.removeEventListener("online", onlineFn);
      };
    }
  }, []);

  return (
    <>
      {showHeader && <Header ref={headerRef} />}

      <main
        ref={mainElRef}
        className={`app-holder${!showHeader ? " login-page" : ""}${
          makePageFullHeight ? " grid-page" : ""
        }`}
      >
        <div className="container">
          <Outlet />
        </div>
      </main>
      <TopMessage ref={msgRef} />
      <Footer ref={footerRef} />
    </>
  );
};

export default MainLayout;
