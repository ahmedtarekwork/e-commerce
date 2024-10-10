// react
import { cloneElement, useEffect, useRef } from "react";

// router
import { useLocation, useOutlet } from "react-router-dom";

// components
import Header from "../components/layout/appHeader/Header";
import Footer from "../components/layout/Footer";

// framer motion
import { AnimatePresence } from "framer-motion";

const AnimatedOutlet = () => {
  const outlet = useOutlet();
  const { pathname } = useLocation();

  return (
    <AnimatePresence mode="popLayout">
      {outlet && cloneElement(outlet, { key: pathname })}
    </AnimatePresence>
  );
};

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

      mainEl?.style.removeProperty("margin-top");
    }
  }, [showHeader]);

  useEffect(() => {
    if (makePageFullHeight) {
      const mainEl = mainElRef.current;
      const header = headerRef.current;
      const footer = footerRef.current;

      if (mainEl && header && footer) {
        mainElRef.current.style.minHeight = `calc(100vh - ${
          header.offsetHeight + footer.offsetHeight
        })`;
      }
    }
  }, [makePageFullHeight]);

  return (
    <>
      {showHeader && <Header ref={headerRef} />}
      <main
        ref={mainElRef}
        className={`app-holder${!showHeader ? " login-page" : ""}`}
      >
        <div
          className="container"
          style={{
            ...(makePageFullHeight
              ? {
                  display: "flex",
                  flexDirection: "column",
                }
              : {}),
          }}
        >
          <AnimatedOutlet key={pathname} />
        </div>
      </main>
      <Footer ref={footerRef} />
    </>
  );
};

export default MainLayout;
