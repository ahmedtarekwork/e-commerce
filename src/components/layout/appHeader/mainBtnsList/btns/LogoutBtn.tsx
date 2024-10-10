// components
import EmptySpinner from "../../../../spinners/EmptySpinner";

// hooks
import useLogoutUser from "../../../../../hooks/useLogoutUser";

// icons
import { IoLogOut } from "react-icons/io5";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
// variants
import { scaleUpDownVariant } from "../../../../../utils/variants";

const LogoutBtn = () => {
  const { logoutUser, logoutLoading } = useLogoutUser();

  return (
    <li>
      <button title="logout btn" onClick={async () => await logoutUser()}>
        <AnimatePresence mode="popLayout">
          {logoutLoading && (
            <motion.div
              variants={scaleUpDownVariant}
              initial="initial"
              animate="animate"
              exit="exit"
              key="one"
            >
              <EmptySpinner
                settings={{
                  "brdr-width": "3px",
                  diminsions: "23px",
                  clr: "var(--main)",
                }}
              />
            </motion.div>
          )}

          {!logoutLoading && (
            <motion.div
              variants={scaleUpDownVariant}
              initial="initial"
              animate="animate"
              exit="exit"
              key="two"
              className="logout-icon-holder"
            >
              <IoLogOut size={23} />
            </motion.div>
          )}
        </AnimatePresence>
        signout
      </button>
    </li>
  );
};
export default LogoutBtn;
