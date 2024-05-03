// react
import { useEffect, useRef } from "react";

// router
import { Outlet, useLocation } from "react-router-dom";

// components
import Header from "../components/layout/appHeader/Header";
import Footer from "../components/layout/Footer";
import TopMessage, { TopMessageRefType } from "../components/TopMessage";

const MainLayout = () => {
  const { pathname } = useLocation();

  const showHeader = !["login", "signup"].some((path) =>
    pathname.includes(path)
  );

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
      window.addEventListener("offline", () => {
        console.log("offline");

        msgData.setMessageData?.({
          show: true,
          clr: "red",
          content: "you are offline, check your internet connection",
          remove: false,
        });
      });

      window.addEventListener("online", () => {
        console.log("online");

        msgData.setMessageData?.({
          show: true,
          clr: "green",
          content: "you back online again",
          time: 2500,
        });
      });

      return () => {
        window.removeEventListener("offline", () => {
          console.log("offline");

          msgData.setMessageData?.({
            show: true,
            clr: "red",
            content: "you are offline, check your internet connection",
            remove: false,
          });
        });

        window.removeEventListener("online", () => {
          console.log("online");

          msgData.setMessageData?.({
            show: true,
            clr: "green",
            content: "you back online again",
            time: 2500,
          });
        });
      };
    }
  });

  return (
    <>
      {showHeader && <Header ref={headerRef} />}

      <main
        ref={mainElRef}
        className={`app-holder${!showHeader ? " login-page" : ""}${
          ["profile", "singleUser", "cart"].some((path) =>
            pathname.includes(path)
          )
            ? " grid-page"
            : ""
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
