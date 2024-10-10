// react
import { useEffect, useRef } from "react";

// router
import { Link } from "react-router-dom";

// redux
import useSelector from "../../../../hooks/redux/useSelector";

// components
import CartBtn from "./btns/CartBtn";
import LogoutBtn from "./btns/LogoutBtn";

// icons
import { FaUserAlt } from "react-icons/fa";

const MainBtnsList = ({ type }: { type: "header" | "sidebar" }) => {
  const { user } = useSelector((state) => state.user);

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    [
      listRef.current,
      ...((listRef.current?.querySelectorAll(
        "*"
      ) as unknown as HTMLElement[]) || []),
    ].forEach((el) => {
      if (el) el.dataset.type = type;
    });
  }, []);

  return (
    <ul className="main-btns-list">
      {!user ? (
        <>
          <li>
            <Link title="go to login page btn" to="/login">
              login
            </Link>
          </li>

          <li>
            <Link title="go to signup page btn" to="/signup">
              signup
            </Link>
          </li>
        </>
      ) : (
        <>
          <CartBtn />

          <li>
            <Link title="go to profile page btn" to="/profile">
              <FaUserAlt />
              <span id="header-userName">
                {user?.username || "Unknwon User"}
              </span>
            </Link>
          </li>

          <LogoutBtn />
        </>
      )}
    </ul>
  );
};

export default MainBtnsList;
