// react
import { useEffect } from "react";

// react-router-dom
import { Link, useLocation } from "react-router-dom";

// icons
import { MdOutlineSearchOff, MdHome } from "react-icons/md";

const ErrorPage = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const main = document.querySelector<HTMLElement>(".app-holder");

    if (main) {
      main!.classList.add("center-content");

      return () => main!.classList.remove("center-content");
    }
  });

  return (
    <div
      className="error-page"
      style={{
        display: "grid",
        placeContent: "center",
      }}
    >
      <MdOutlineSearchOff />
      <p>
        sorry, can't find the following path:
        <br />"{pathname}"
      </p>

      <Link to="/" className="btn" style={{ width: "100%" }}>
        Go to home
        <MdHome />
      </Link>
    </div>
  );
};

export default ErrorPage;
